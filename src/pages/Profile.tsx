import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, deleteAccount, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(password);
      navigate('/login');
    } catch (err) {
      setError('Senha inválida');
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Perfil
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Nome: {user.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Email: {user.email}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Conta criada em: {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={handleSignOut}>
              Sair
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Excluir conta
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Excluir conta</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Para excluir sua conta, digite sua senha:
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Senha"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteAccount} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;