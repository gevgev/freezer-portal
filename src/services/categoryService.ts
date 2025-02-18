import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface Category {
    id: string;
    name: string;
    description: string;
    // isActive: boolean;  // Commented out
    createdAt: string;
}

interface BackendCategory {
    ID: string;
    Name: string;
    Description: string;
    // IsActive: boolean;  // Commented out
    CreatedAt: string;
}

export interface CreateCategoryRequest {
    name: string;
    description: string;
}

export interface UpdateCategoryRequest {
    name?: string;
    description?: string;
    // isActive?: boolean;  // Commented out
}

export const categoryService = {
    getCategories: async (token: string): Promise<Category[]> => {
        const response = await api.get<BackendCategory[]>('/api/categories', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        return response.data.map(category => ({
            id: category.ID,
            name: category.Name,
            description: category.Description,
            // isActive: category.IsActive,
            createdAt: category.CreatedAt
        }));
    },

    createCategory: async (token: string, data: CreateCategoryRequest): Promise<Category> => {
        const response = await api.post<BackendCategory>('/api/categories', data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return {
            id: response.data.ID,
            name: response.data.Name,
            description: response.data.Description,
            // isActive: response.data.IsActive,
            createdAt: response.data.CreatedAt
        };
    },

    updateCategory: async (token: string, categoryId: string, data: UpdateCategoryRequest): Promise<Category> => {
        const response = await api.put<BackendCategory>(`/api/categories/${categoryId}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return {
            id: response.data.ID,
            name: response.data.Name,
            description: response.data.Description,
            // isActive: response.data.IsActive,
            createdAt: response.data.CreatedAt
        };
    },

    // Commenting out toggle method
    /*
    toggleCategory: async (token: string, categoryId: string, isActive: boolean): Promise<void> => {
        await api.put(`/api/categories/${categoryId}/toggle`, { isActive }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
    */
}; 