import { Bookmark, GitCompareArrows } from 'lucide-react';
import type { Course } from '../types';
import { CourseCards } from './CourseCards';
type Props = { courses: Course[]; savedIds: string[]; comparisonIds: string[]; onOpen: (course: Course) => void; onSave: (course: Course) => void; onCompare: (course: Course) => void; onExplore: () => void };
export function SavedCourses(props: Props) {
  const saved = props.courses.filter((course) => props.savedIds.includes(course.id));
  return <main className="page-shell subpage"><div className="page-heading"><div><p className="eyebrow"><Bookmark size={16} />Your shortlist</p><h1>My saved courses</h1><p>Keep promising options together, then add up to three to a quick comparison.</p></div>{saved.length > 1 && <div className="tip"><GitCompareArrows /><span>Use the compare icon on any card to build a side-by-side view.</span></div>}</div>
    {saved.length ? <CourseCards courses={saved} savedIds={props.savedIds} comparisonIds={props.comparisonIds} onOpen={props.onOpen} onSave={props.onSave} onCompare={props.onCompare} /> : <div className="empty-state saved-empty"><Bookmark size={38} /><strong>No saved courses yet.</strong><span>Save courses from Explore to build your shortlist.</span><button className="button primary" onClick={props.onExplore}>Explore courses</button></div>}
  </main>;
}
