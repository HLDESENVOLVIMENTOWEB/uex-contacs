import React from 'react';
import { 
  Backdrop, 
  CircularProgress, 
  Typography, 
  Box 
} from '@mui/material';

interface LoadingProps {
  open: boolean;
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  open, 
  message = 'Carregando...', 
  fullScreen = false 
}) => {
  if (fullScreen) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
        {message && (
          <Typography variant="h6" component="div">
            {message}
          </Typography>
        )}
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        display: open ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3
      }}
    >
      <CircularProgress />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loading;