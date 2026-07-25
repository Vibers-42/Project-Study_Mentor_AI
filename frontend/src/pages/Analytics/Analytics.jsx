import React, { useState, useEffect } from 'react';
import Card from '../../components/layout/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { buildAnalyticsData, EMPTY_ANALYTICS } from '../../data/analyticsData';
import { getStats, getSessions } from '../../services/progress.service';
import AccuracyChart from '../../components/analytics/AccuracyChart';
import TopicRadarChart from '../../components/analytics/TopicRadarChart';
import PerformanceChart from '../../components/analytics/PerformanceChart';
import { StrongTopicsCard, WeakTopicsCard } from '../../components/analytics/TopicBreakdownCards';

const Analytics = () => {
  const [data, setData] = useState(EMPTY_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [hasSessions, setHasSessions] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [stats, sessions] = await Promise.all([getStats(), getSessions()]);
        const list = Array.isArray(sessions) ? sessions : [];
        setHasSessions(list.length > 0);
        setData(buildAnalyticsData(stats, list));
      } catch (err) {
        setLoadError(err?.message || 'Could not load your analytics data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const ANALYTICS_DATA = data;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── PAGE HEADER ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>📊</span> Deep Analytics & Insights
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Detailed breakdown of your study velocity, topic mastery, and mock interview performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/interview">
            <Button variant="primary" size="sm">
              Take Practice Interview
            </Button>
          </Link>
        </div>
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-xs">
          <span className="shrink-0">⚠</span>
          <span>{loadError}</span>
        </div>
      )}

      {!loading && !hasSessions && !loadError && (
        <Card className="p-10 text-center border-slate-200/80 dark:border-slate-800">
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">No analytics yet</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Complete a mock interview and your charts will populate automatically.
          </p>
          <Link to="/interview">
            <Button variant="primary" size="md">Start an Interview</Button>
          </Link>
        </Card>
      )}

      {/* ── METRIC STAT CARDS ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Questions Solved</span>
            <span className="text-lg">📝</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">
            {loading ? '—' : ANALYTICS_DATA.questionsSolved}
          </p>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            {ANALYTICS_DATA.weeklyProgress.reduce((a, d) => a + d.questions, 0)} this week
          </span>
        </Card>

        <Card className="p-4 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overall Accuracy</span>
            <span className="text-lg">🎯</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">
            {loading ? '—' : `${ANALYTICS_DATA.overallAccuracy}%`}
          </p>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            Across {ANALYTICS_DATA.interviewsTaken} session{ANALYTICS_DATA.interviewsTaken === 1 ? '' : 's'}
          </span>
        </Card>

        <Card className="p-4 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Interview Score</span>
            <span className="text-lg">🏆</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">
            {loading ? '—' : `${ANALYTICS_DATA.averageScore}%`}
          </p>
          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
            {ANALYTICS_DATA.averageScore >= 70 ? 'On track' : ANALYTICS_DATA.averageScore > 0 ? 'Keep practising' : 'No scores yet'}
          </span>
        </Card>

        <Card className="p-4 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Interviews Completed</span>
            <span className="text-lg">🎤</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">
            {loading ? '—' : ANALYTICS_DATA.interviewsTaken}
          </p>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            {ANALYTICS_DATA.topicRadar.length} topic{ANALYTICS_DATA.topicRadar.length === 1 ? '' : 's'} covered
          </span>
        </Card>
      </div>

      {/* ── CHARTS ROW 1: Accuracy Donut + Topic Radar ─────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AccuracyChart accuracy={ANALYTICS_DATA.overallAccuracy} />
        <TopicRadarChart data={ANALYTICS_DATA.topicRadar} />
        <div className="md:col-span-2 lg:col-span-1 flex flex-col justify-between space-y-4">
          <Card className="p-5 flex-1 border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty Mastery</span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">Question Spectrum</h3>
            </div>
            <div className="space-y-3 my-4">
              {ANALYTICS_DATA.difficultyDistribution.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{d.name}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{d.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">Based on {ANALYTICS_DATA.questionsSolved} solved problems</p>
          </Card>
        </div>
      </div>

      {/* ── CHARTS ROW 2: Performance Trend ────────────────── */}
      <PerformanceChart data={ANALYTICS_DATA.performanceHistory} />

      {/* ── TOPIC BREAKDOWN: Strong vs Weak ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrongTopicsCard topics={ANALYTICS_DATA.strongTopics} />
        <WeakTopicsCard topics={ANALYTICS_DATA.weakTopics} />
      </div>

      {/* ── INTERVIEW HISTORY TABLE ───────────────────────── */}
      <Card className="border-slate-200/80 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Recent Interview Performance Log</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Historical AI-evaluated mock interview scores</p>
          </div>
          <Link to="/results">
            <Button variant="ghost" size="sm" className="text-xs">View Full Details →</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3">Role / Domain</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Difficulty</th>
                <th className="px-5 py-3 text-center">Score</th>
                <th className="px-5 py-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ANALYTICS_DATA.interviewHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">{row.role}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{row.date}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={row.difficulty === 'Advanced' ? 'danger' : row.difficulty === 'Intermediate' ? 'warning' : 'success'} size="sm">
                      {row.difficulty}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`font-bold ${row.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                      {row.score}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Badge variant={row.score >= 80 ? 'success' : 'primary'} size="sm" className="font-bold">
                      {row.grade}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default Analytics;
