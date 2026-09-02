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

export interface GetTransactionsParams {
  search?: string;
  type?: string;
  category?: string;
  sort?: string;
}

export const getTransactions = async (params?: GetTransactionsParams): Promise<Transaction[]> => {
  // Filter out empty params so we don't send `search=""` or `category="All"` to the backend if the backend doesn't expect it.
  const cleanParams: Record<string, string> = {};
  if (params?.search) cleanParams.search = params.search;
  if (params?.type && params.type !== 'all') cleanParams.type = params.type;
  if (params?.category && params.category !== 'all') cleanParams.category = params.category;
  if (params?.sort) cleanParams.sort = params.sort;

  const response = await apiClient.get<Transaction[]>('/transactions', { params: cleanParams });
  return response.data;
};

export interface CreateTransactionData {
  type: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
}

export const createTransaction = async (data: CreateTransactionData): Promise<Transaction> => {
  const response = await apiClient.post<Transaction>('/transactions', data);
  return response.data;
};

export const updateTransaction = async (id: string, data: Partial<CreateTransactionData>): Promise<Transaction> => {
  const response = await apiClient.patch<Transaction>(`/transactions/${id}`, data);
  return response.data;
};
