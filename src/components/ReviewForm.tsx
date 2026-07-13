import { Check, Send, ShieldCheck, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { AppUser, Course, GradeKey, NewReviewForm, Review, SemesterName, StudentLevel } from '../types';

const grades: GradeKey[] = ['A', 'B', 'C', 'D', 'F'];
const levels: StudentLevel[] = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const availableTags = ['Easy exams', 'Heavy homework', 'Helpful professor', 'Strict grading', 'Attendance mandatory', 'Good lectures', 'Group projects', 'Lab heavy', 'Good for beginners', 'Fast-paced'];

type Props = { open: boolean; courses: Course[]; course: Course | null; user: AppUser | null; editingReview: Review | null; onClose: () => void; onLogin: () => void; onSubmit: (form: NewReviewForm, editingId?: string) => void };
export function ReviewForm({ open, courses, course, user, editingReview, onClose, onLogin, onSubmit }: Props) {
  const selected = course ?? courses[0];
  const initial = useMemo<NewReviewForm>(() => ({ courseId: selected?.id ?? '', professor: editingReview?.professor ?? selected?.professor ?? '', semester: editingReview?.semester ?? selected?.semester ?? 'Fall', year: editingReview?.year ?? selected?.year ?? 2026, rating: editingReview?.rating ?? 0, difficulty: editingReview?.difficulty ?? 0, workloadHours: editingReview?.workloadHours ?? 6, attendanceRequired: editingReview?.attendanceRequired ?? selected?.attendanceRequired ?? false, wouldTakeAgain: editingReview?.wouldTakeAgain ?? true, grade: editingReview?.grade ?? 'A', reviewerType: editingReview?.reviewerType ?? 'Sophomore', comment: editingReview?.comment ?? '', tags: editingReview?.tags ?? [] }), [selected, editingReview]);
  const [form, setForm] = useState(initial); const [errors, setErrors] = useState<string[]>([]);
  useEffect(() => { setForm(initial); setErrors([]); }, [initial, open]);
  if (!open || !selected) return null;
  const activeCourse = courses.find((item) => item.id === form.courseId) ?? selected;

  function chooseCourse(id: string) { const next = courses.find((item) => item.id === id); if (next) setForm({ ...form, courseId: id, professor: next.professor, semester: next.semester, year: next.year, attendanceRequired: next.attendanceRequired }); }
  function toggleTag(tag: string) { setForm({ ...form, tags: form.tags.includes(tag) ? form.tags.filter((item) => item !== tag) : [...form.tags, tag].slice(0, 4) }); }
  function submit(event: React.FormEvent) {
    event.preventDefault(); const next: string[] = [];
    if (!form.courseId) next.push('Course must be selected.'); if (!form.professor.trim()) next.push('Professor name is required.');
    if (form.rating < 1) next.push('Rating is required.'); if (form.difficulty < 1) next.push('Difficulty is required.');
    if (form.comment.trim().length < 20) next.push('Comment must be at least 20 characters.');
    const duplicate = !editingReview && activeCourse.reviews.some((review) => review.userId === user?.id && review.semester === form.semester && review.year === form.year);
    if (duplicate) next.push(`Duplicate review warning: you already reviewed this course for ${form.semester} ${form.year}.`);
    if (next.length) { setErrors(next); return; } onSubmit(form, editingReview?.id);
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="review-dialog card" role="dialog" aria-modal="true" aria-labelledby="review-title" onMouseDown={(e) => e.stopPropagation()}><button className="icon-button modal-close" onClick={onClose}><X /></button>
    <p className="eyebrow">Community contribution</p><h2 id="review-title">{editingReview ? 'Edit your review' : 'Share your course experience'}</h2><p className="muted">Specific, respectful reviews help the next student plan with confidence.</p>
    {!user ? <div className="login-gate"><ShieldCheck size={36} /><h3>Verified students only</h3><p>Sign in with your @srmist.edu.in email before submitting a review.</p><button className="button primary" onClick={onLogin}>Student login</button></div> : <form className="review-form" onSubmit={submit}>
      <label>Course<select value={form.courseId} onChange={(e) => chooseCourse(e.target.value)}>{courses.map((item) => <option value={item.id} key={item.id}>{item.code} — {item.title}</option>)}</select></label>
      <label>Professor<input value={form.professor} onChange={(e) => setForm({ ...form, professor: e.target.value })} /></label>
      <label>Semester<div className="inline-fields"><select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value as SemesterName })}>{['Fall', 'Spring', 'Summer'].map((value) => <option key={value}>{value}</option>)}</select><input type="number" min="2024" max="2030" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} /></div></label>
      <label>Grade received<select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value as GradeKey })}>{grades.map((value) => <option key={value}>{value}</option>)}</select></label>
      <fieldset><legend>Overall rating *</legend><div className="rating-picker">{[1,2,3,4,5].map((value) => <button type="button" className={form.rating >= value ? 'active' : ''} key={value} onClick={() => setForm({ ...form, rating: value })}>★</button>)}</div></fieldset>
      <fieldset><legend>Difficulty *</legend><div className="number-picker">{[1,2,3,4,5].map((value) => <button type="button" className={form.difficulty === value ? 'active' : ''} key={value} onClick={() => setForm({ ...form, difficulty: value })}>{value}</button>)}</div></fieldset>
      <label>Workload (hrs/week)<input type="number" min="1" max="40" value={form.workloadHours} onChange={(e) => setForm({ ...form, workloadHours: Number(e.target.value) })} /></label>
      <label>Student year<select value={form.reviewerType} onChange={(e) => setForm({ ...form, reviewerType: e.target.value as StudentLevel })}>{levels.map((value) => <option key={value}>{value}</option>)}</select></label>
      <fieldset><legend>Course policies</legend><div className="toggle-row"><label><input type="checkbox" checked={form.attendanceRequired} onChange={(e) => setForm({ ...form, attendanceRequired: e.target.checked })} />Attendance required</label><label><input type="checkbox" checked={form.wouldTakeAgain} onChange={(e) => setForm({ ...form, wouldTakeAgain: e.target.checked })} />Would take again</label></div></fieldset>
      <fieldset className="full-width"><legend>Review tags <span>(up to 4)</span></legend><div className="tag-picker">{availableTags.map((tag) => <button type="button" className={form.tags.includes(tag) ? 'active' : ''} key={tag} onClick={() => toggleTag(tag)}>{form.tags.includes(tag) && <Check size={14} />}{tag}</button>)}</div></fieldset>
      <label className="full-width">Comment *<textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="What were lectures, exams, grading, and workload really like?" /><span className={form.comment.trim().length < 20 ? 'char-count warn' : 'char-count'}>{form.comment.trim().length}/20 minimum</span></label>
      {errors.length > 0 && <div className="form-errors full-width" role="alert">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
      <div className="form-submit full-width"><span>Posting as {user.email}</span><button className="button primary" type="submit"><Send size={17} />{editingReview ? 'Save changes' : 'Submit for review'}</button></div>
    </form>}
  </section></div>;
}
