import apiClient from './apiClient';
import type { AuthResponse } from '../types';

export const register = async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (data: { email: string; password: string }): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const logout = (): void => {
  // The AuthContext will use this function to clear authentication state and local token storage.
  localStorage.removeItem('token');
};
