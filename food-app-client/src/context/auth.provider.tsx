import React, { type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthResponse, User } from '@/types';
import {
  fetchCurrentUser,
  login as loginService,
  type LoginData,
  logout as logoutService,
  register as registerService,
  type RegisterData,
  updateCurrentUser,
  type UpdateUserData,
} from '../services/auth.service';
import { AuthContext, type AuthContextType } from './auth.context';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await fetchCurrentUser();
        return response.user;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  const loginMutation = useMutation<AuthResponse, Error, LoginData>({
    mutationFn: (credentials) => loginService(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
    },
  });

  const updateProfileMutation = useMutation<AuthResponse, Error, UpdateUserData>({
    mutationFn: (data) => updateCurrentUser(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: (data) => registerService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading Application...</h2>
      </div>
    );
  }

  const authContextValue: AuthContextType = {
    user: user || null,
    isAuthenticated: !!user && !isError,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};