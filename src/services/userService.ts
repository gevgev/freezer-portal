import axios from 'axios';
import { User } from '../types/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface CreateUserRequest {
    email: string;
    password: string;
    role: 'admin' | 'user';
}

export interface UpdateUserRequest {
    email?: string;
    password?: string;
    role?: 'admin' | 'user';
}

interface BackendUser {
    ID: string;
    Email: string;
    Role: string;
    CreatedAt: string;
    PasswordHash: string;
}

export const userService = {
    getUsers: async (token: string): Promise<User[]> => {
        const response = await api.get<BackendUser[]>('/api/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        return response.data.map(user => ({
            id: user.ID,
            email: user.Email,
            role: user.Role as 'admin' | 'user',
            createdAt: user.CreatedAt
        }));
    },

    createUser: async (token: string, userData: CreateUserRequest): Promise<User> => {
        const response = await api.post('/api/users', userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateUser: async (token: string, userId: string, userData: UpdateUserRequest): Promise<User> => {
        const response = await api.put(`/api/users/${userId}`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deleteUser: async (token: string, userId: string): Promise<void> => {
        await api.delete(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};