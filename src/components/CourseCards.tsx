import { Bookmark, BookmarkCheck, Check, GitCompareArrows, Star, Users } from 'lucide-react';
import type { Course } from '../types';
import { getARate, getCourseBadges, getRecommendationLabel, getRecommendationScore } from '../lib/courseUtils';
type Props = { courses: Course[]; savedIds: string[]; comparisonIds: string[]; onOpen: (course: Course) => void; onSave: (course: Course) => void; onCompare: (course: Course) => void };
export function CourseCards({ courses, savedIds, comparisonIds, onOpen, onSave, onCompare }: Props) {
  if (!courses.length) return <div className="empty-state large"><strong>No courses found.</strong><span>Try changing your filters or search keyword.</span></div>;
  return <section className="course-grid" aria-label="Course results">{courses.map((course) => {
    const saved = savedIds.includes(course.id); const compared = comparisonIds.includes(course.id);
    return <article className="course-card card" key={course.id}>
      <div className="course-card-top"><div className="course-code">{course.code}</div><div className="course-actions"><button className={compared ? 'active' : ''} onClick={() => onCompare(course)} aria-label={`${compared ? 'Remove' : 'Add'} ${course.code} comparison`}>{compared ? <Check size={17} /> : <GitCompareArrows size={17} />}</button><button className={saved ? 'active' : ''} onClick={() => onSave(course)} aria-label={`${saved ? 'Remove' : 'Save'} ${course.code}`}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button></div></div>
      <button className="course-card-main" onClick={() => onOpen(course)}><span className="course-dept">{course.department}</span><h3>{course.title}</h3><p>{course.professor}</p><div className="score-row"><span><Star size={16} fill="currentColor" />{course.avgRating}</span><span>{course.difficulty}/5 difficulty</span><span>{course.workloadHours}h/week</span></div></button>
      <div className="metric-strip"><div><span>A-rate</span><strong>{getARate(course)}%</strong></div><div><span>Reviews</span><strong><Users size={14} />{course.reviews.length}</strong></div><div><span>Score</span><strong>{getRecommendationScore(course)}</strong></div></div>
      <div className="badge-row">{getCourseBadges(course).map((badge) => <span key={badge}>{badge}</span>)}<b>{getRecommendationLabel(course)}</b></div>
      <div className="tag-list compact-tags">{course.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
      <button className="view-details" onClick={() => onOpen(course)}>View course details <span>→</span></button>
    </article>;
  })}</section>;
}
