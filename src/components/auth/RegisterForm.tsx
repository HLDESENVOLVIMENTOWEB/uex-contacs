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

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  const validateForm = (): boolean => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Preencha todos os campos');
      return false;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await signUp({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });
      onSuccess?.();
    } catch (err) {
      setError('Erro ao criar conta. O email pode já estar em uso.');
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
        Criar Conta
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Nome completo"
        name="name"
        autoComplete="name"
        autoFocus
        required
        value={formData.name}
        onChange={handleChange}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
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
        autoComplete="new-password"
        required
        value={formData.password}
        onChange={handleChange}
        disabled={loading}
        helperText="Mínimo de 6 caracteres"
      />

      <TextField
        fullWidth
        label="Confirmar senha"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={loading}
        error={formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0}
        helperText={
          formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0
            ? 'As senhas não coincidem'
            : ' '
        }
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
            Criando conta...
          </>
        ) : (
          'Criar conta'
        )}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Já tem uma conta?{' '}
          <Link component={RouterLink} to="/login">
            Fazer login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};