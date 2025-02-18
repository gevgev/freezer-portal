import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider, createTheme } from '@mui/material';
import { UsersPage } from './pages/UsersPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { TagsPage } from './pages/TagsPage';

const theme = createTheme({
    // You can customize the theme here
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/dashboard/*"
                            element={
                                <ProtectedRoute requireAdmin>
                                    <DashboardLayout>
                                        <Routes>
                                            <Route path="/users" element={<UsersPage />} />
                                            <Route path="/categories" element={<CategoriesPage />} />
                                            <Route path="/tags" element={<TagsPage />} />
                                        </Routes>
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/dashboard/users" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;