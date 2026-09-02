import apiClient from './apiClient';
import type { DashboardSummary, DashboardTrends, DashboardPeriod } from '../types';

export const getSummary = async (period: DashboardPeriod = 'all'): Promise<DashboardSummary> => {
  const response = await apiClient.get<DashboardSummary>('/dashboard/summary', {
    params: { period }
  });
  return response.data;
};

export const getTrends = async (period: DashboardPeriod = 'all'): Promise<DashboardTrends> => {
  const response = await apiClient.get<DashboardTrends>('/dashboard/trends', {
    params: { period }
  });
  return response.data;
};
