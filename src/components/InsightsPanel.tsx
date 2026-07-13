import { Lightbulb } from 'lucide-react';
import type { Course } from '../types';
import { getARate } from '../lib/courseUtils';

type InsightsPanelProps = {
  courses: Course[];
};

export function InsightsPanel({ courses }: InsightsPanelProps) {
  const easiestHighRated = [...courses]
    .filter((course) => course.avgRating >= 4.2)
    .sort((a, b) => a.difficulty - b.difficulty)[0];

  const hardest = [...courses].sort((a, b) => b.difficulty - a.difficulty)[0];
  const bestGrade = [...courses].sort((a, b) => getARate(b) - getARate(a))[0];

  const insights = [
    easiestHighRated && {
      title: 'Best low-stress pick',
      body: `${easiestHighRated.code} has a ${easiestHighRated.avgRating}/5 rating with only ${easiestHighRated.difficulty}/5 difficulty.`
    },
    hardest && {
      title: 'Most challenging visible class',
      body: `${hardest.code} needs about ${hardest.workloadHours} hours/week and is rated ${hardest.difficulty}/5 difficulty.`
    },
    bestGrade && {
      title: 'Highest A-rate',
      body: `${bestGrade.code} currently shows a ${getARate(bestGrade)}% A rate.`
    }
  ].filter(Boolean) as Array<{ title: string; body: string }>;

  return (
    <section className="panel card insights-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><Lightbulb size={15} /> Auto insights</p>
          <h2>What the data suggests</h2>
          <p>Generated from the currently filtered course list.</p>
        </div>
      </div>

      <div className="insight-list">
        {insights.map((insight) => (
          <article key={insight.title}>
            <strong>{insight.title}</strong>
            <p>{insight.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
