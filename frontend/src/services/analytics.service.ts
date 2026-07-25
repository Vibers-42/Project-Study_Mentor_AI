import { AnalyticsData } from '../types';
import { mockAnalyticsData } from '../data/analytics';
import { adaptAnalyticsData, BackendProgressStats } from './adapters';
import { getMember3Resource } from './member3Api.service';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockAnalyticsData;
  }

  const stats = await getMember3Resource<BackendProgressStats>('/analytics');
  return adaptAnalyticsData(stats);
};

export const getPerformanceHistory = async () => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { date: 'Jul 1', score: 65 },
      { date: 'Jul 5', score: 68 },
      { date: 'Jul 10', score: 72 },
      { date: 'Jul 15', score: 78 },
      { date: 'Jul 20', score: 75 },
      { date: 'Jul 25', score: 82 },
    ];
  }

  const stats = await getMember3Resource<BackendProgressStats>('/analytics');
  return (stats?.score_trend ?? []).map((item: any) => ({
    date: item.date
      ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'Unknown',
    score: Math.round(Math.min((item.score ?? 0) * 10, 100)),
  }));
};