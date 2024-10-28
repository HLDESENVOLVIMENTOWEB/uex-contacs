import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { User, AuthContextData, SignUpData } from '../types/auth.types';
import { authService } from '../services/auth.service';

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{
    user: User | null;
    loading: boolean;
    error: string | null;
  }>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          setState(prev => ({ ...prev, user, loading: false }));
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          user: null,
          error: 'Failed to restore session',
          loading: false
        }));
        authService.signOut();
      }
    };

    initializeAuth();
  }, []);

  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    setState(prev => ({ ...prev, error: errorMessage }));
    throw error;
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const user = await authService.signIn(email, password);
      setState(prev => ({ ...prev, user, loading: false }));
    } catch (error) {
      handleError(error);
    }
  }, []);

  const signUp = useCallback(async (userData: SignUpData): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const user = await authService.signUp(userData);
      setState(prev => ({ ...prev, user, loading: false }));
    } catch (error) {
      handleError(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authService.signOut();
      setState(prev => ({ ...prev, user: null, loading: false }));
    } catch (error) {
      handleError(error);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    if (!state.user) throw new Error('No user logged in');
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedUser = {
        ...state.user,
        ...data,
      };
      await authService.updateUser(updatedUser);
      setState(prev => ({ ...prev, user: updatedUser, loading: false }));
    } catch (error) {
      handleError(error);
    }
  }, [state.user]);

  const deleteAccount = useCallback(async (password: string) => {
    if (!state.user) throw new Error('No user logged in');
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await authService.deleteAccount(state.user.id, password);
      setState(prev => ({ ...prev, user: null, loading: false }));
    } catch (error) {
      handleError(error);
    }
  }, [state.user]);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!state.user) throw new Error('No user logged in');
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await authService.updatePassword(state.user.id, currentPassword, newPassword);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      handleError(error);
    }
  }, [state.user]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextData = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    deleteAccount,
    updatePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};