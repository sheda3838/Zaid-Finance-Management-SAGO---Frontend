export type DashboardPeriod = 'all' | '30d' | '7d';

export interface DashboardSummary {
  period: DashboardPeriod;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface TrendDataPoint {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
}

export interface DashboardTrends {
  period: DashboardPeriod;
  data: TrendDataPoint[];
}
