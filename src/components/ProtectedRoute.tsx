import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin }) => {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (requireAdmin && user?.role !== 'admin') {
            navigate('/login');
        }
    }, [token, user, requireAdmin, navigate]);

    if (!token || (requireAdmin && user?.role !== 'admin')) {
        return null;
    }

    return <>{children}</>;
}; 