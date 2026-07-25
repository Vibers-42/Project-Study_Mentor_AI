/**
 * Reusable constants and helpers for Recharts configuration in Study Mentor AI
 */

export const CHART_COLORS = {
  primary: '#6366f1',   // indigo-500
  secondary: '#8b5cf6', // violet-500
  tertiary: '#06b6d4',  // cyan-500
  success: '#10b981',   // emerald-500
  warning: '#f59e0b',   // amber-500
  danger: '#ef4444',    // rose-500
  grid: 'rgba(148, 163, 184, 0.15)', // slate grid line
  text: '#94a3b8',      // slate-400
};

export const commonAxisProps = {
  stroke: CHART_COLORS.text,
  tick: { fill: CHART_COLORS.text, fontSize: 11 },
  tickLine: false,
  axisLine: false,
};

export const commonTooltipProps = {
  contentStyle: {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    color: '#f8fafc',
    fontSize: '0.75rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
  },
  itemStyle: {
    color: '#f8fafc',
  },
};
