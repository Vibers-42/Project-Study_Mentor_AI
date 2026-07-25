import { AnalyticsData } from '../types';
import { mockAnalyticsData } from '../data/analytics';

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  // Simulate network delay; swap return mockAnalyticsData with axios.get(...) later!
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockAnalyticsData;
};

export const getPerformanceHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { date: 'Jul 1', score: 65 },
    { date: 'Jul 5', score: 68 },
    { date: 'Jul 10', score: 72 },
    { date: 'Jul 15', score: 78 },
    { date: 'Jul 20', score: 75 },
    { date: 'Jul 25', score: 82 },
  ];
};
