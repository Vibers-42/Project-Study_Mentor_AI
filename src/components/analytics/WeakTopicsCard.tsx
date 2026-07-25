import React from 'react';
import { Card } from '../common/Card';
import { TopicPerformance } from '../../types';
import { MdTrendingDown, MdTrendingUp } from 'react-icons/md';

interface TopicsCardProps {
  topics: TopicPerformance[];
  type: 'weak' | 'strong';
}

const TopicsCard: React.FC<TopicsCardProps> = ({ topics, type }) => {
  const isWeak = type === 'weak';
  
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        {isWeak ? (
          <MdTrendingDown className="w-5 h-5 text-red-500" />
        ) : (
          <MdTrendingUp className="w-5 h-5 text-green-500" />
        )}
        <h3 className="font-semibold text-neutral-200">
          {isWeak ? 'Areas to Improve' : 'Strongest Topics'}
        </h3>
      </div>
      
      <div className="space-y-4">
        {topics.slice(0, 3).map((topic, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-300">{topic.topic}</span>
              <span className={isWeak ? 'text-red-400' : 'text-green-400'}>
                {topic.accuracy}%
              </span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${isWeak ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${topic.accuracy}%` }}
              />
            </div>
          </div>
        ))}
        {topics.length === 0 && (
          <p className="text-sm text-neutral-500 italic">Not enough data yet.</p>
        )}
      </div>
    </Card>
  );
};

export const WeakTopicsCard: React.FC<{topics: TopicPerformance[]}> = ({ topics }) => <TopicsCard topics={topics} type="weak" />;
export const StrongTopicsCard: React.FC<{topics: TopicPerformance[]}> = ({ topics }) => <TopicsCard topics={topics} type="strong" />;
