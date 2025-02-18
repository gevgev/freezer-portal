import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface Tag {
    id: string;
    name: string;
    createdAt: string;
}

interface BackendTag {
    ID: string;
    Name: string;
    CreatedAt: string;
}

export interface CreateTagRequest {
    name: string;
}

export interface UpdateTagRequest {
    name: string;
}

const handleError = (error: any) => {
    if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    throw error;
};

export const tagService = {
    getTags: async (token: string): Promise<Tag[]> => {
        try {
            const response = await api.get<BackendTag[]>('/api/tags', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            return response.data.map(tag => ({
                id: tag.ID,
                name: tag.Name,
                createdAt: tag.CreatedAt
            }));
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    createTag: async (token: string, data: CreateTagRequest): Promise<Tag> => {
        try {
            const response = await api.post<BackendTag>('/api/tags', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return {
                id: response.data.ID,
                name: response.data.Name,
                createdAt: response.data.CreatedAt
            };
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    updateTag: async (token: string, tagId: string, data: UpdateTagRequest): Promise<Tag> => {
        try {
            const response = await api.put<BackendTag>(`/api/tags/${tagId}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return {
                id: response.data.ID,
                name: response.data.Name,
                createdAt: response.data.CreatedAt
            };
        } catch (error) {
            handleError(error);
            throw error;
        }
    }
}; 