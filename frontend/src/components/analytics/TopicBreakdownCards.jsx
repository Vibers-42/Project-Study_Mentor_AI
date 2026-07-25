import React from 'react';
import Card from '../layout/Card';
import Badge from '../common/Badge';

export const StrongTopicsCard = ({ topics = [] }) => (
  <Card className="p-5 border-slate-200/80 dark:border-slate-800">
    <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
      <span>💪</span>
      <h2>Top Performing Topics</h2>
    </div>
    <div className="space-y-3">
      {topics.map((t) => (
        <div key={t.topic} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.topic}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{t.questionsAnswered} questions • Avg speed: {t.avgTime}</p>
          </div>
          <Badge variant="success" className="font-bold">{t.accuracy}%</Badge>
        </div>
      ))}
    </div>
  </Card>
);

export const WeakTopicsCard = ({ topics = [] }) => (
  <Card className="p-5 border-slate-200/80 dark:border-slate-800">
    <div className="flex items-center gap-2 mb-3 text-rose-600 dark:text-rose-400 font-bold text-sm">
      <span>⚠️</span>
      <h2>Focus Needed Topics</h2>
    </div>
    <div className="space-y-3">
      {topics.map((t) => (
        <div key={t.topic} className="flex items-center justify-between p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.topic}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{t.questionsAnswered} questions • Avg speed: {t.avgTime}</p>
          </div>
          <Badge variant="danger" className="font-bold">{t.accuracy}%</Badge>
        </div>
      ))}
    </div>
  </Card>
);
