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
    Typography,
    CircularProgress,
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { tagService, Tag, CreateTagRequest, UpdateTagRequest } from '../services/tagService';

type TagFormData = {
    name: string;
};

export const TagsPage: React.FC = () => {
    const { token } = useAuth();
    const [tags, setTags] = useState<Tag[]>([]);
    const [open, setOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [formData, setFormData] = useState<TagFormData>({
        name: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTags = async () => {
        if (token) {
            setLoading(true);
            setError(null);
            try {
                const data = await tagService.getTags(token);
                setTags(data);
            } catch (error: any) {
                setError(error.message || 'Failed to load tags');
                console.error('Error loading tags:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadTags();
    }, [token]);

    const handleOpen = (tag?: Tag) => {
        if (tag) {
            setEditingTag(tag);
            setFormData({ name: tag.name });
        } else {
            setEditingTag(null);
            setFormData({ name: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingTag(null);
        setFormData({ name: '' });
    };

    const handleSubmit = async () => {
        if (!token || !formData.name.trim()) return;

        try {
            if (editingTag) {
                await tagService.updateTag(token, editingTag.id, formData);
            } else {
                await tagService.createTag(token, formData);
            }
            handleClose();
            loadTags();
        } catch (error) {
            console.error('Error saving tag:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Tags</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Tag
                </Button>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tags.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell>
                                        <Chip label={tag.name} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpen(tag)}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editingTag ? 'Edit Tag' : 'Add Tag'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tag Name"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        disabled={!formData.name.trim()}
                    >
                        {editingTag ? 'Save' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}; 