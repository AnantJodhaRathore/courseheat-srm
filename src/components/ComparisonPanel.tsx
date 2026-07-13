import { Download, GitCompareArrows, X } from 'lucide-react';
import type { Course } from '../types';
import { coursesToCsv, getARate, getRecommendationScore, getWouldTakeAgain } from '../lib/courseUtils';
type Props = { courses: Course[]; onRemove: (id: string) => void; onClear: () => void; onExport: (csv: string, filename: string) => void };
export function ComparisonPanel({ courses, onRemove, onClear, onExport }: Props) {
  if (!courses.length) return null;
  return <section className="comparison-panel card" id="compare"><div className="section-heading"><div><p className="eyebrow"><GitCompareArrows size={15} />Side-by-side</p><h2>Course & professor comparison</h2><p>Select up to three courses. Different sections naturally compare professors.</p></div><div className="heading-actions"><button className="button ghost compact" onClick={() => onExport(coursesToCsv(courses), 'courseheat-comparison.csv')}><Download size={16} />Export CSV</button><button className="icon-button" onClick={onClear} aria-label="Clear comparison"><X /></button></div></div>
    <div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>Metric</th>{courses.map((course) => <th key={course.id}><button onClick={() => onRemove(course.id)} aria-label={`Remove ${course.code}`}><X size={13} /></button><strong>{course.code}</strong><span>{course.professor}</span></th>)}</tr></thead><tbody>
      {[['Rating', (c: Course) => `${c.avgRating}/5`], ['Difficulty', (c: Course) => `${c.difficulty}/5`], ['Workload', (c: Course) => `${c.workloadHours} hrs/wk`], ['A-rate', (c: Course) => `${getARate(c)}%`], ['Would take again', (c: Course) => `${getWouldTakeAgain(c)}%`], ['Attendance', (c: Course) => c.attendanceRequired ? 'Strict' : 'Flexible'], ['Total reviews', (c: Course) => String(c.reviews.length)], ['Recommendation', (c: Course) => `${getRecommendationScore(c)}/100`]].map(([label, getValue]) => <tr key={label as string}><td>{label as string}</td>{courses.map((course) => <td key={course.id}>{(getValue as (c: Course) => string)(course)}</td>)}</tr>)}
      <tr><td>Grade distribution</td>{courses.map((course) => <td key={course.id}><div className="mini-grades">{Object.entries(course.gradeDistribution).map(([grade, value]) => <span key={grade}><b>{grade}</b><i style={{ height: `${Math.max(5, value)}px` }} title={`${grade}: ${value}%`} /></span>)}</div></td>)}</tr>
    </tbody></table></div>
  </section>;
}
