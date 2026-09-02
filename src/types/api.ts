import type { User } from './user';
import type { Transaction } from './transaction';
import type { DashboardSummary, DashboardTrends } from './dashboard';

export interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}

export type SingleTransactionResponse = Transaction;

export type TransactionListResponse = Transaction[];

export type DashboardSummaryResponse = DashboardSummary;

export type DashboardTrendsResponse = DashboardTrends;
