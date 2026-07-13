import type { Course, GpaRecord, PlannerItem, TimetableEntry } from '../types';
import { mockCourses } from '../data/mockCourses';
import { normalizeCourse } from './courseUtils';

const keys = { courses: 'courseheat:courses:v2', saved: 'courseheat:saved', theme: 'courseheat:theme', planner: 'courseheat:planner', gpa: 'courseheat:gpa', timetable: 'courseheat:timetable', demoUser: 'courseheat:demo-user' };

function read<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}
export function loadCourses() { return read<Course[]>(keys.courses, mockCourses).map(normalizeCourse); }
export function saveCourses(courses: Course[]) { localStorage.setItem(keys.courses, JSON.stringify(courses)); }
export function resetSavedCourses() { localStorage.removeItem(keys.courses); return mockCourses.map(normalizeCourse); }
export function loadSavedIds() { return read<string[]>(keys.saved, []); }
export function saveSavedIds(ids: string[]) { localStorage.setItem(keys.saved, JSON.stringify(ids)); }
export function loadTheme() { return read<'light' | 'dark'>(keys.theme, 'light'); }
export function saveTheme(theme: 'light' | 'dark') { localStorage.setItem(keys.theme, JSON.stringify(theme)); }
export function loadPlanner() { return read<PlannerItem[]>(keys.planner, []); }
export function savePlanner(items: PlannerItem[]) { localStorage.setItem(keys.planner, JSON.stringify(items)); }
export function loadGpaRecords() { return read<GpaRecord[]>(keys.gpa, [
  { id: 'gpa-1', semester: 'Fall 2025', courseCode: 'CS 101', courseName: 'Introduction to Computer Science', credits: 4, grade: 'A+' },
  { id: 'gpa-2', semester: 'Fall 2025', courseCode: 'MATH 241', courseName: 'Calculus III', credits: 4, grade: 'A' },
  { id: 'gpa-3', semester: 'Fall 2025', courseCode: 'ECON 201', courseName: 'Microeconomics', credits: 3, grade: 'B+' },
  { id: 'gpa-4', semester: 'Spring 2026', courseCode: 'CS 203', courseName: 'Data Structures', credits: 4, grade: 'A' }
]); }
export function saveGpaRecords(items: GpaRecord[]) { localStorage.setItem(keys.gpa, JSON.stringify(items)); }
export function loadTimetable() { return read<TimetableEntry[]>(keys.timetable, [
  { id: 'tt-1', courseId: 'cs220-patel-spring-2025', day: 'Monday', startTime: '09:00', endTime: '10:00', room: 'TP-302', type: 'Lecture' },
  { id: 'tt-2', courseId: 'stat310-kim-spring-2025', day: 'Monday', startTime: '11:00', endTime: '12:00', room: 'UB-501', type: 'Lecture' },
  { id: 'tt-3', courseId: 'phys212-singh-spring-2025', day: 'Tuesday', startTime: '10:00', endTime: '11:00', room: 'Tech Park 204', type: 'Lecture' },
  { id: 'tt-4', courseId: 'cs220-patel-spring-2025', day: 'Wednesday', startTime: '14:00', endTime: '16:00', room: 'CSE Lab 3', type: 'Lab' },
  { id: 'tt-5', courseId: 'bio150-nguyen-spring-2025', day: 'Thursday', startTime: '09:00', endTime: '11:00', room: 'Mech Lab 1', type: 'Lab' },
  { id: 'tt-6', courseId: 'art105-thompson-spring-2025', day: 'Friday', startTime: '13:00', endTime: '14:00', room: 'Design Studio', type: 'Tutorial' }
]); }
export function saveTimetable(items: TimetableEntry[]) { localStorage.setItem(keys.timetable, JSON.stringify(items)); }
export function loadDemoUserEmail() { return read<string | null>(keys.demoUser, null); }
export function saveDemoUserEmail(email: string | null) { email ? localStorage.setItem(keys.demoUser, JSON.stringify(email)) : localStorage.removeItem(keys.demoUser); }
