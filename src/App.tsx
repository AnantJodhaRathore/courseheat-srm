import { useEffect, useMemo, useRef, useState } from 'react';
import { Clipboard, Download, FileUp, Plus, ShieldCheck } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthGate } from './components/AuthGate';
import { ComparisonPanel } from './components/ComparisonPanel';
import { CourseCards } from './components/CourseCards';
import { CourseDetail } from './components/CourseDetail';
import { Filters } from './components/Filters';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeatmapGrid } from './components/HeatmapGrid';
import { InsightsPanel } from './components/InsightsPanel';
import { GpaDashboard } from './components/GpaDashboard';
import { ProfessorComparison } from './components/ProfessorComparison';
import { ResourcesHub } from './components/ResourcesHub';
import { ReviewForm } from './components/ReviewForm';
import { SavedCourses } from './components/SavedCourses';
import { SemesterPlanner } from './components/SemesterPlanner';
import { TimetableCalendar } from './components/TimetableCalendar';
import { DashboardSkeleton } from './components/Skeletons';
import { StatCards } from './components/StatCards';
import { ToastStack } from './components/ToastStack';
import { addReviewToCourse, coursesToCsv, filterCourses, getARate, getRecommendationScore, updateReviewInCourse } from './lib/courseUtils';
import { loadCourses, loadGpaRecords, loadPlanner, loadSavedIds, loadTheme, loadTimetable, saveCourses, saveGpaRecords, savePlanner, saveSavedIds, saveTheme, saveTimetable } from './lib/storage';
import { supabase } from './lib/supabase';
import type { AppUser, Course, FiltersState, GpaRecord, NewReviewForm, PlannerItem, Review, TimetableEntry, ToastMessage } from './types';

type View = 'dashboard' | 'saved' | 'resources' | 'planner' | 'gpa' | 'timetable' | 'professors' | 'admin';
const defaultFilters: FiltersState = { search: '', department: 'All', professor: 'All', semester: 'All', metric: 'avgRating', sort: 'recommended-desc' };

function App() {
  const [courses, setCourses] = useState<Course[]>(() => loadCourses());
  const [filters, setFilters] = useState(defaultFilters);
  const [savedIds, setSavedIds] = useState<string[]>(() => loadSavedIds());
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>(() => loadPlanner());
  const [gpaRecords, setGpaRecords] = useState<GpaRecord[]>(() => loadGpaRecords());
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>(() => loadTimetable());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [reviewCourse, setReviewCourse] = useState<Course | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [view, setView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => { document.documentElement.dataset.theme = theme; saveTheme(theme); }, [theme]);
  useEffect(() => { saveCourses(courses); }, [courses]);
  useEffect(() => { saveSavedIds(savedIds); }, [savedIds]);
  useEffect(() => { savePlanner(plannerItems); }, [plannerItems]);
  useEffect(() => { saveGpaRecords(gpaRecords); }, [gpaRecords]);
  useEffect(() => { saveTimetable(timetableEntries); }, [timetableEntries]);
  useEffect(() => { const id = window.setTimeout(() => setLoading(false), 550); return () => clearTimeout(id); }, []);
  useEffect(() => {
    if (!supabase) { setAuthReady(true); return; }
    supabase.auth.getSession().then(({ data }) => {
      const authUser = data.session?.user;
      if (authUser?.email?.endsWith('@srmist.edu.in')) setUser({ id: authUser.id, email: authUser.email, isAdmin: authUser.app_metadata?.role === 'admin' });
      else setUser(null);
    }).catch(() => notify('Could not restore your login session.', 'error')).finally(() => setAuthReady(true));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user;
      if (authUser?.email?.endsWith('@srmist.edu.in')) setUser({ id: authUser.id, email: authUser.email, isAdmin: authUser.app_metadata?.role === 'admin' });
      else setUser(null);
      setAuthReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => { function escape(event: KeyboardEvent) { if (event.key === 'Escape') { setSelectedCourse(null); setReviewOpen(false); } } window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, []);
  useEffect(() => {
    if (!supabase || !user || user.isDemo) return;
    let active = true;
    async function hydrateCloudData() {
      const [savedResult, plannerResult] = await Promise.all([
        supabase!.from('saved_courses').select('course_id').eq('user_id', user!.id),
        supabase!.from('planner_items').select('id, course_id, task, due_date, done').eq('user_id', user!.id)
      ]);
      if (!active) return;
      if (savedResult.error) notify(`Could not load saved courses: ${savedResult.error.message}`, 'error');
      else setSavedIds(savedResult.data.map((row) => row.course_id));
      if (plannerResult.error) notify(`Could not load planner: ${plannerResult.error.message}`, 'error');
      else setPlannerItems(plannerResult.data.map((row) => ({ id: row.id, courseId: row.course_id, task: row.task, dueDate: row.due_date, done: row.done })));
    }
    void hydrateCloudData();
    return () => { active = false; };
  }, [user?.id, user?.isDemo]);

  const filteredCourses = useMemo(() => filterCourses(courses, filters), [courses, filters]);
  const comparisonCourses = courses.filter((course) => comparisonIds.includes(course.id));
  const visibleSelected = selectedCourse ? courses.find((course) => course.id === selectedCourse.id) ?? selectedCourse : null;

  function notify(message: string, kind: ToastMessage['kind'] = 'info') {
    const id = crypto.randomUUID(); setToasts((items) => [...items, { id, message, kind }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3600);
  }
  function requireLogin(action: () => void) { if (!user) { notify('Your verified session has expired. Please sign in again.', 'error'); return; } action(); }
  function toggleSaved(course: Course) { requireLogin(async () => {
    const saved = savedIds.includes(course.id); const previous = savedIds;
    setSavedIds((ids) => saved ? ids.filter((id) => id !== course.id) : [...ids, course.id]);
    try {
      if (supabase && user && !user.isDemo) {
        const result = saved
          ? await supabase.from('saved_courses').delete().eq('user_id', user.id).eq('course_id', course.id)
          : await supabase.from('saved_courses').upsert({ user_id: user.id, course_id: course.id }, { onConflict: 'user_id,course_id' });
        if (result.error) throw result.error;
      }
      notify(saved ? 'Course removed from saved list.' : 'Course saved and synchronized.', 'success');
    } catch (reason) { setSavedIds(previous); notify(reason instanceof Error ? `Could not sync saved course: ${reason.message}` : 'Could not sync saved course.', 'error'); }
  }); }
  function toggleComparison(course: Course) { if (comparisonIds.includes(course.id)) { setComparisonIds((ids) => ids.filter((id) => id !== course.id)); return; } if (comparisonIds.length >= 3) { notify('Compare up to three courses at a time.', 'error'); return; } setComparisonIds((ids) => [...ids, course.id]); notify(`${course.code} added to comparison.`, 'success'); }
  function openReview(course: Course) { setSelectedCourse(null); setReviewCourse(course); setEditingReview(null); setReviewOpen(true); }
  function editReview(review: Review) { const course = courses.find((item) => item.id === review.courseId) ?? null; setSelectedCourse(null); setReviewCourse(course); setEditingReview(review); setReviewOpen(true); }
  async function submitReview(form: NewReviewForm, editingId?: string) {
    if (!user) return;
    try {
      if (supabase && !user.isDemo) {
        const payload = { course_id: form.courseId, professor_name: form.professor, semester: form.semester, year: form.year, rating: form.rating, difficulty: form.difficulty, workload_hours: form.workloadHours, attendance_required: form.attendanceRequired, would_take_again: form.wouldTakeAgain, grade: form.grade, reviewer_type: form.reviewerType, comment: form.comment.trim(), status: 'pending' };
        const query = editingId ? supabase.from('reviews').update(payload).eq('id', editingId).eq('user_id', user.id) : supabase.from('reviews').insert(payload);
        const { error } = await query; if (error) throw error;
      }
      setCourses((items) => items.map((course) => course.id === form.courseId ? (editingId ? updateReviewInCourse(course, editingId, form) : addReviewToCourse(course, form, user.id)) : course));
      setReviewOpen(false); setEditingReview(null); notify(editingId ? 'Review updated and sent for moderation.' : 'Review added successfully and sent for moderation.', 'success');
    } catch (reason) { notify(reason instanceof Error ? `Review submission failed: ${reason.message}` : 'Review submission failed. Please try again.', 'error'); }
  }
  async function logout() { if (supabase) await supabase.auth.signOut(); setUser(null); setSavedIds([]); setPlannerItems([]); setView('dashboard'); }
  function exportFile(content: string, filename: string) { const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url); notify('CSV export created.', 'success'); }
  async function copySummary() { const top = filteredCourses.slice(0, 5).map((course) => `${course.code} — ${course.title} · ${course.avgRating}/5 · ${getARate(course)}% A · ${getRecommendationScore(course)}/100 recommendation`).join('\n'); try { await navigator.clipboard.writeText(top); notify('Course summary copied.', 'success'); } catch { notify('Could not copy the course summary.', 'error'); } }
  function importCsv(event: React.ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const lines = String(reader.result).trim().split(/\r?\n/).slice(1); let updated = 0; setCourses((items) => items.map((course) => { const row = lines.map((line) => line.split(',').map((cell) => cell.trim())).find(([code]) => code?.replace(/"/g, '').toLowerCase() === course.code.toLowerCase()); if (!row) return course; updated += 1; const attendance = row[2]?.replace(/"/g, '').toLowerCase(); return { ...course, workloadHours: Number(row[1]) || course.workloadHours, attendanceRequired: ['yes','true','required'].includes(attendance) }; })); notify(updated ? `Imported manual data for ${updated} courses.` : 'No matching course codes were found in the CSV.', updated ? 'success' : 'error'); } catch { notify('Could not import that CSV. Use columns: course_code, workload_hours, attendance_required.', 'error'); } }; reader.onerror = () => notify('Could not read the selected CSV.', 'error'); reader.readAsText(file); event.target.value = ''; }
  function moderate(courseId: string, reviewId: string, action: 'approve' | 'delete') { setCourses((items) => items.map((course) => course.id !== courseId ? course : { ...course, reviews: action === 'delete' ? course.reviews.filter((review) => review.id !== reviewId) : course.reviews.map((review) => review.id === reviewId ? { ...review, status: 'approved' } : review) })); notify(action === 'approve' ? 'Review approved.' : 'Review deleted.', 'success'); }
  async function updatePlanner(next: PlannerItem[]) {
    const previous = plannerItems; setPlannerItems(next);
    if (!supabase || !user || user.isDemo) return;
    try {
      const removed = previous.filter((item) => !next.some((entry) => entry.id === item.id));
      const writes = next.length ? [supabase.from('planner_items').upsert(next.map((item) => ({ id: item.id, user_id: user.id, course_id: item.courseId, task: item.task, due_date: item.dueDate, done: item.done })), { onConflict: 'id' })] : [];
      const deletes = removed.map((item) => supabase!.from('planner_items').delete().eq('id', item.id).eq('user_id', user.id));
      const results = await Promise.all([...writes, ...deletes]); const failed = results.find((result) => result.error);
      if (failed?.error) throw failed.error;
    } catch (reason) { setPlannerItems(previous); notify(reason instanceof Error ? `Could not sync planner: ${reason.message}` : 'Could not sync planner.', 'error'); }
  }
  function reportReview(review: Review) { requireLogin(async () => {
    try {
      if (supabase && user && !user.isDemo) { const { error } = await supabase.from('review_reports').upsert({ review_id: review.id, user_id: user.id, reason: 'Community standards review requested' }, { onConflict: 'review_id,user_id' }); if (error) throw error; }
      setCourses((items) => items.map((course) => course.id !== review.courseId ? course : { ...course, reviews: course.reviews.map((item) => item.id === review.id ? { ...item, status: 'reported' } : item) }));
      notify('Review reported to moderators.', 'success');
    } catch (reason) { notify(reason instanceof Error ? `Could not report review: ${reason.message}` : 'Could not report review.', 'error'); }
  }); }

  if (!user) return <><AuthGate checking={!authReady} onNotice={notify} /><ToastStack toasts={toasts} onDismiss={(id) => setToasts((items) => items.filter((item) => item.id !== id))} /></>;

  return <>
    <Header theme={theme} onThemeToggle={() => setTheme((value) => value === 'light' ? 'dark' : 'light')} user={user} onLogin={() => undefined} onLogout={logout} view={view} onView={setView} savedCount={savedIds.length} />
    {view === 'dashboard' && (loading ? <DashboardSkeleton /> : <main className="page-shell">
      <div className="trust-banner"><ShieldCheck size={20} /><div><strong>Private by design</strong><span>SRM email verification only. We never collect NetID or university portal passwords.</span></div></div>
      <Filters courses={courses} filters={filters} onChange={setFilters} onClear={() => { setFilters(defaultFilters); notify('Filters cleared.', 'success'); }} />
      <StatCards courses={filteredCourses} />
      <div className="dashboard-toolbar"><div><strong>{filteredCourses.length} courses</strong><span>Sorted by {filters.sort.replace(/-/g, ' ')}</span></div><div><input ref={fileInput} type="file" accept=".csv,text/csv" hidden onChange={importCsv} /><button onClick={() => fileInput.current?.click()}><FileUp size={16} />Import CSV</button><button onClick={() => exportFile(coursesToCsv(filteredCourses), 'courseheat-courses.csv')}><Download size={16} />Export courses</button><button onClick={copySummary}><Clipboard size={16} />Copy summary</button></div></div>
      <CourseCards courses={filteredCourses} savedIds={savedIds} comparisonIds={comparisonIds} onOpen={setSelectedCourse} onSave={toggleSaved} onCompare={toggleComparison} />
      <ComparisonPanel courses={comparisonCourses} onRemove={(id) => setComparisonIds((ids) => ids.filter((value) => value !== id))} onClear={() => setComparisonIds([])} onExport={exportFile} />
      <HeatmapGrid courses={filteredCourses} metric={filters.metric} onSelectCourse={setSelectedCourse} />
      <InsightsPanel courses={filteredCourses} />
      <section className="review-cta card"><div><p className="eyebrow">Pay it forward</p><h2>Taken one of these courses?</h2><p>Your experience can make someone else's semester easier.</p></div><button className="button primary" onClick={() => { setReviewCourse(filteredCourses[0] ?? courses[0]); setReviewOpen(true); }}><Plus size={18} />Write a review</button></section>
    </main>)}
    {view === 'saved' && <><SavedCourses courses={courses} savedIds={savedIds} comparisonIds={comparisonIds} onOpen={setSelectedCourse} onSave={toggleSaved} onCompare={toggleComparison} onExplore={() => setView('dashboard')} /><div className="page-shell comparison-only"><ComparisonPanel courses={comparisonCourses} onRemove={(id) => setComparisonIds((ids) => ids.filter((value) => value !== id))} onClear={() => setComparisonIds([])} onExport={exportFile} /></div></>}
    {view === 'resources' && <ResourcesHub loggedIn onLogin={() => undefined} onNotice={(message) => notify(message, 'info')} />}
    {view === 'planner' && <SemesterPlanner courses={courses} items={plannerItems} onChange={(items) => void updatePlanner(items)} loggedIn onLogin={() => undefined} onNotice={(message) => notify(message, 'info')} />}
    {view === 'gpa' && <GpaDashboard courses={courses} records={gpaRecords} onChange={setGpaRecords} />}
    {view === 'timetable' && <TimetableCalendar courses={courses} entries={timetableEntries} onChange={setTimetableEntries} onNotice={(message, error) => notify(message, error ? 'error' : 'success')} />}
    {view === 'professors' && <ProfessorComparison courses={courses} />}
    {view === 'admin' && user?.isAdmin && <AdminDashboard courses={courses} onModerate={moderate} />}
    <Footer />
    <CourseDetail course={visibleSelected} user={user} saved={visibleSelected ? savedIds.includes(visibleSelected.id) : false} compared={visibleSelected ? comparisonIds.includes(visibleSelected.id) : false} onClose={() => setSelectedCourse(null)} onSave={toggleSaved} onCompare={toggleComparison} onReview={openReview} onEditReview={editReview} onReportReview={reportReview} />
    <ReviewForm open={reviewOpen} courses={courses} course={reviewCourse} user={user} editingReview={editingReview} onClose={() => { setReviewOpen(false); setEditingReview(null); }} onLogin={() => undefined} onSubmit={submitReview} />
    <ToastStack toasts={toasts} onDismiss={(id) => setToasts((items) => items.filter((item) => item.id !== id))} />
  </>;
}
export default App;
