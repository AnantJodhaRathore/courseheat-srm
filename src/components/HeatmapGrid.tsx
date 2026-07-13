import type { Course, MetricKey } from '../types';
import { formatMetricValue, getHeatColorClass, metricDescriptions, metricLabels } from '../lib/courseUtils';
type Props = { courses: Course[]; metric: MetricKey; onSelectCourse: (course: Course) => void };
export function HeatmapGrid({ courses, metric, onSelectCourse }: Props) {
  return <section className="panel card heatmap-panel">
    <div className="section-heading"><div><p className="eyebrow">Visual overview</p><h2>{metricLabels[metric]} heatmap</h2><p>{metricDescriptions[metric]}</p></div><span className="result-count">{courses.length} courses</span></div>
    <div className="legend" aria-label="Heatmap legend"><span><i className="legend-good" />Good / easy</span><span><i className="legend-mid" />Average</span><span><i className="legend-hard" />Hard / low</span></div>
    {courses.length ? <div className="heatmap-grid">{courses.map((course) => <button key={course.id} className={getHeatColorClass(course, metric)} onClick={() => onSelectCourse(course)}><span>{course.code}</span><strong>{formatMetricValue(course, metric)}</strong><small>{course.professor}</small></button>)}</div>
      : <div className="empty-state"><strong>No courses found.</strong><span>Try changing your filters or search keyword.</span></div>}
  </section>;
}
