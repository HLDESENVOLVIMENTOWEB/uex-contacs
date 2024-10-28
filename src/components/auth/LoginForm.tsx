import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Typography,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await signIn(formData.email, formData.password);
      onSuccess?.();
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        autoFocus
        required
        value={formData.email}
        onChange={handleChange}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Senha"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={formData.password}
        onChange={handleChange}
        disabled={loading}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Não tem uma conta?{' '}
          <Link component={RouterLink} to="/register">
            Cadastre-se
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};