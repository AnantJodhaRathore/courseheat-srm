import { Bookmark, BookmarkCheck, CalendarDays, CheckCircle2, Clock3, Edit3, Flag, GitCompareArrows, GraduationCap, MapPin, Star, UsersRound, X } from 'lucide-react';
import type { AppUser, Course, Review } from '../types';
import { getARate, getRecommendationLabel, getRecommendationScore, getWouldTakeAgain } from '../lib/courseUtils';
import { GradeDistributionChart } from './GradeCharts';
type Props = { course: Course | null; user: AppUser | null; saved: boolean; compared: boolean; onClose: () => void; onSave: (course: Course) => void; onCompare: (course: Course) => void; onReview: (course: Course) => void; onEditReview: (review: Review) => void; onReportReview: (review: Review) => void };

export function CourseDetail({ course, user, saved, compared, onClose, onSave, onCompare, onReview, onEditReview, onReportReview }: Props) {
  if (!course) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <article className="course-modal card" role="dialog" aria-modal="true" aria-labelledby="course-modal-title" onMouseDown={(e) => e.stopPropagation()}>
      <div className="modal-hero">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close course details"><X /></button>
        <p className="eyebrow">{course.department} · {course.semester} {course.year}</p>
        <div className="modal-title-row"><div><span>{course.code}</span><h2 id="course-modal-title">{course.title}</h2><p>{course.professor}</p></div><div className="recommendation-orb"><strong>{getRecommendationScore(course)}</strong><span>match score</span></div></div>
        <div className="modal-actions"><button className="button primary" onClick={() => onReview(course)}>Write a review</button><button className="button ghost" onClick={() => onSave(course)}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}{saved ? 'Saved' : 'Save course'}</button><button className="button ghost" onClick={() => onCompare(course)}><GitCompareArrows size={18} />{compared ? 'In comparison' : 'Compare'}</button></div>
      </div>
      <div className="modal-body">
        <div className="detail-metrics">
          <div><Star /><span>Rating</span><strong>{course.avgRating}/5</strong></div><div><GraduationCap /><span>Difficulty</span><strong>{course.difficulty}/5</strong></div><div><Clock3 /><span>Workload</span><strong>{course.workloadHours} hrs/wk</strong></div><div><CheckCircle2 /><span>A-rate</span><strong>{getARate(course)}%</strong></div><div><UsersRound /><span>Take again</span><strong>{getWouldTakeAgain(course)}%</strong></div><div><MapPin /><span>Attendance</span><strong>{course.attendanceRequired ? 'Required' : 'Flexible'}</strong></div>
        </div>
        <div className="modal-two-col"><GradeDistributionChart course={course} /><section className="chart-card recommendation-card"><p className="eyebrow">Course verdict</p><h3>{getRecommendationLabel(course)}</h3><div className="score-meter"><span style={{ width: `${getRecommendationScore(course)}%` }} /></div><p>Balanced from rating, A-rate, difficulty, workload, and student recommendations.</p><div className="tag-list">{course.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section></div>
        <section className="reviews-section"><div className="section-heading"><div><p className="eyebrow">Student voices</p><h2>{course.reviews.length} reviews</h2></div><button className="button ghost compact" onClick={() => onReview(course)}>Add yours</button></div>
          <div className="review-list">{course.reviews.map((review) => <article key={review.id} className="review-card"><div className="review-meta"><strong>{review.rating}/5</strong><span><CalendarDays size={14} />{review.semester ?? course.semester} {review.year ?? course.year}</span><span>Grade {review.grade}</span>{review.status === 'pending' && <em>Pending moderation</em>}{review.status === 'reported' && <em>Reported for moderation</em>}{user && review.userId === user.id ? <button onClick={() => onEditReview(review)}><Edit3 size={14} />Edit</button> : <button onClick={() => onReportReview(review)} disabled={review.status === 'reported'}><Flag size={14} />{review.status === 'reported' ? 'Reported' : 'Report'}</button>}</div><p>{review.comment}</p><div className="review-tags">{(review.tags ?? []).map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div>
        </section>
      </div>
    </article>
  </div>;
}
