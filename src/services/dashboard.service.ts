import { DashboardData } from '../types';
import { mockDashboardData } from '../data/dashboard';

export const getDashboardData = async (): Promise<DashboardData> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockDashboardData;
};
