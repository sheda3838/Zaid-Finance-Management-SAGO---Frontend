import apiClient from './apiClient';
import type { Transaction } from '../types';

export const getRecentTransactions = async (): Promise<Transaction[]> => {
  const response = await apiClient.get<Transaction[]>('/transactions', {
    params: {
      limit: 5,
      sort: 'newest'
    }
  });
  return response.data;
};
