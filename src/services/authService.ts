import axios from 'axios';
import { LoginCredentials, AuthResponse } from '../types/auth';

// Configure your backend API URL here
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    logout: async (token: string): Promise<void> => {
        await api.post('/auth/logout', null, {
            headers: { 
                Authorization: `Bearer ${token}`
            }
        });
    },

    getCurrentUser: async (token: string) => {
        const response = await api.get('/auth/me', {
            headers: { 
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
}; 