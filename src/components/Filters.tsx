import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import type { Course, FiltersState } from '../types';
import { metricLabels, sortLabels, uniqueSorted } from '../lib/courseUtils';

type Props = { courses: Course[]; filters: FiltersState; onChange: (filters: FiltersState) => void; onClear: () => void };
export function Filters({ courses, filters, onChange, onClear }: Props) {
  const departments = ['All', ...uniqueSorted(courses.map((course) => course.department))];
  const professors = ['All', ...uniqueSorted(courses.map((course) => course.professor))];
  const semesters = ['All', ...uniqueSorted(courses.map((course) => `${course.semester} ${course.year}`))];
  return <section id="course-browser" className="filters card" aria-label="Course filters">
    <div className="filter-title"><SlidersHorizontal size={18} /><span>Find your fit</span></div>
    <label className="search-box"><span>Search</span><div><Search size={18} /><input value={filters.search} onChange={(e) => onChange({ ...filters, search: e.target.value })} placeholder="Course, code, professor…" /></div></label>
    <label>Department<select value={filters.department} onChange={(e) => onChange({ ...filters, department: e.target.value })}>{departments.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label>Professor<select value={filters.professor} onChange={(e) => onChange({ ...filters, professor: e.target.value })}>{professors.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label>Semester<select value={filters.semester} onChange={(e) => onChange({ ...filters, semester: e.target.value })}>{semesters.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label>Sort by<select value={filters.sort} onChange={(e) => onChange({ ...filters, sort: e.target.value as FiltersState['sort'] })}>{Object.entries(sortLabels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
    <label>Heatmap<select value={filters.metric} onChange={(e) => onChange({ ...filters, metric: e.target.value as FiltersState['metric'] })}>{Object.entries(metricLabels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
    <button className="clear-filters" onClick={onClear}><RotateCcw size={16} />Clear all filters</button>
  </section>;
}
