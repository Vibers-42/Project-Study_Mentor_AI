export const formatScore = (score: number, decimals: number = 0): string => {
  return `${score.toFixed(decimals)}%`;
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};
