import { Award, BookOpen, Flame, GraduationCap, MessageSquareText, Star } from 'lucide-react';
import type { Course } from '../types';
import { getARate, getDashboardStats } from '../lib/courseUtils';
export function StatCards({ courses }: { courses: Course[] }) {
  const stats = getDashboardStats(courses);
  const items = [
    { label: 'Total courses', value: stats.courseCount, helper: 'across departments', icon: BookOpen, tone: 'blue' },
    { label: 'Student reviews', value: stats.totalReviews, helper: 'community insights', icon: MessageSquareText, tone: 'violet' },
    { label: 'Average rating', value: `${stats.avgRating}/5`, helper: 'all visible courses', icon: Star, tone: 'amber' },
    { label: 'Best rated', value: stats.bestRated?.code ?? '—', helper: stats.bestRated ? `${stats.bestRated.avgRating}/5 rating` : 'No data', icon: Award, tone: 'green' },
    { label: 'Hardest course', value: stats.hardest?.code ?? '—', helper: stats.hardest ? `${stats.hardest.difficulty}/5 difficulty` : 'No data', icon: Flame, tone: 'red' },
    { label: 'Highest A-rate', value: stats.highestARate ? `${getARate(stats.highestARate)}%` : '—', helper: stats.highestARate?.code ?? 'No data', icon: GraduationCap, tone: 'cyan' }
  ];
  return <section className="stats-grid" aria-label="Dashboard summary">{items.map(({ icon: Icon, ...item }) => <article className={`stat-card card ${item.tone}`} key={item.label}><div className="stat-icon"><Icon size={19} /></div><div><p>{item.label}</p><strong>{item.value}</strong><span>{item.helper}</span></div></article>)}</section>;
}
