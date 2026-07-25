import { DashboardData } from '../types';
import { mockDashboardData } from '../data/dashboard';
import { adaptDashboardData, BackendProgressStats } from './adapters';
import { getMember3Resource } from './member3Api.service';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const getDashboardData = async (): Promise<DashboardData> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockDashboardData;
  }

  const stats = await getMember3Resource<BackendProgressStats>('/progress');
  return adaptDashboardData(stats);
};