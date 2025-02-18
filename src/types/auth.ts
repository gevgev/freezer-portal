export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
    // Add any other fields that come from the backend
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
} 