/**
 * Reusable constants and helpers for Recharts configuration
 */

export const CHART_COLORS = {
  primary: '#8b5cf6', // violet-500
  secondary: '#ec4899', // pink-500
  tertiary: '#06b6d4', // cyan-500
  success: '#22c55e', // green-500
  warning: '#eab308', // yellow-500
  danger: '#ef4444', // red-500
  background: 'transparent',
  grid: '#334155', // slate-700
  text: '#cbd5e1', // slate-300
};

export const commonChartProps = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
};

export const commonAxisProps = {
  stroke: CHART_COLORS.text,
  tick: { fill: CHART_COLORS.text, fontSize: 12 },
  tickLine: false,
  axisLine: false,
};

export const commonTooltipProps = {
  contentStyle: {
    backgroundColor: '#1e293b', // slate-800
    border: '1px solid #334155', // slate-700
    borderRadius: '0.5rem',
    color: '#f8fafc', // slate-50
  },
  itemStyle: {
    color: '#f8fafc',
  },
};
