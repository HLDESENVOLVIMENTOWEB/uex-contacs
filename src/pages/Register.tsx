import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Box } from '@mui/material';
import { RegisterForm } from '../components/auth/RegisterForm';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/contacts');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <RegisterForm onSuccess={handleSuccess} />
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;