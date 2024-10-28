import React from 'react';
import { Alert, AlertTitle, Collapse } from '@mui/material';

interface ErrorMessageProps {
  message?: string;
  show?: boolean;
  onClose?: () => void;
  severity?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  show = true,
  onClose,
  severity = 'error',
  title,
}) => {
  return (
    <Collapse in={show && !!message}>
      <Alert 
        severity={severity}
        onClose={onClose}
        sx={{ mb: 2 }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
};

export default ErrorMessage;