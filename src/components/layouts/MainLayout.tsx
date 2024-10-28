import React from 'react';
import { 
  Box, 
  Container, 
  useTheme, 
  useMediaQuery,
  Toolbar,
} from '@mui/material';
import { Header } from '../common/Header';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, Navigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

interface MainLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  requireAuth?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  maxWidth = 'lg',
  requireAuth = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const location = useLocation();

  // Verificar autenticação se necessário
  if (requireAuth && !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Header fixo */}
      {requireAuth && <Header />}

      {/* Espaçamento para compensar o header fixo */}
      {requireAuth && <Toolbar />}

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: isMobile ? 2 : 4,
          px: isMobile ? 2 : 3,
        }}
      >
        <Container 
          maxWidth={maxWidth}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Container>
      </Box>

      {/* Footer (opcional) */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth={maxWidth}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
            }}
          >
            © {new Date().getFullYear()} Gerenciador de Contatos
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

// HOC para envolver páginas com o layout principal
export const withMainLayout = (
  Component: React.ComponentType<any>,
  layoutProps?: Omit<MainLayoutProps, 'children'>
) => {
  return function WithMainLayout(props: any) {
    return (
      <MainLayout {...layoutProps}>
        <Component {...props} />
      </MainLayout>
    );
  };
};

export default MainLayout;