import { createContext } from 'react';
import type { AuthResponse, User } from '@/types';
import type { LoginData, RegisterData, UpdateUserData } from '../services/auth.service';
import type { UseMutateFunction } from '@tanstack/react-query';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginData) => void;
  isLoggingIn: boolean;
  loginError: Error | null;

  logout: () => void;
  isLoggingOut: boolean;

  updateProfile: UseMutateFunction<AuthResponse, Error, UpdateUserData>;
  isUpdatingProfile: boolean;
  updateProfileError: Error | null;

  register: UseMutateFunction<AuthResponse, Error, RegisterData>;
  isRegistering: boolean;
  registerError: Error | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);