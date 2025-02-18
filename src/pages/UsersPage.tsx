import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    Typography
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService, CreateUserRequest, UpdateUserRequest } from '../services/userService';
import { User } from '../types/auth';

export const UsersPage: React.FC = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<CreateUserRequest | UpdateUserRequest>({
        email: '',
        password: '',
        role: 'user'
    });

    const loadUsers = async () => {
        if (token) {
            const data = await userService.getUsers(token);
            setUsers(data);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [token]);

    const handleOpen = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({ email: user.email, role: user.role });
        } else {
            setEditingUser(null);
            setFormData({ email: '', password: '', role: 'user' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingUser(null);
        setFormData({ email: '', password: '', role: 'user' });
    };

    const handleSubmit = async () => {
        if (!token) return;

        try {
            if (editingUser) {
                await userService.updateUser(token, editingUser.id, formData);
            } else {
                await userService.createUser(token, formData as CreateUserRequest);
            }
            handleClose();
            loadUsers();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!token) return;
        
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(token, userId);
                loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Users</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add User
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editingUser ? 'Edit User' : 'Add User'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {!editingUser && (
                        <TextField
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    )}
                    <TextField
                        select
                        margin="dense"
                        label="Role"
                        fullWidth
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingUser ? 'Save' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}; 