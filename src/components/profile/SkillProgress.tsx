import React from 'react';
import { Card } from '../common/Card';
import { TopicPerformance } from '../../types';

interface SkillProgressProps {
  skills: TopicPerformance[];
}

export const SkillProgress: React.FC<SkillProgressProps> = ({ skills }) => {
  return (
    <Card>
      <h3 className="font-semibold text-neutral-200 mb-4">Skill Mastery</h3>
      <div className="space-y-5">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-medium text-neutral-300">{skill.topic}</span>
              <span className="text-xs text-neutral-500">{skill.accuracy}% Accuracy</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  skill.accuracy >= 80 ? 'bg-green-500' : 
                  skill.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${skill.accuracy}%` }}
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1 text-right">
              Based on {skill.questionsAnswered} questions
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
