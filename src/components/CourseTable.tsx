import { ArrowDownUp } from 'lucide-react';
import type { Course } from '../types';
import { getARate } from '../lib/courseUtils';

type CourseTableProps = {
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (course: Course) => void;
};

export function CourseTable({ courses, selectedCourseId, onSelectCourse }: CourseTableProps) {
  const sorted = [...courses].sort((a, b) => b.avgRating - a.avgRating || a.workloadHours - b.workloadHours);

  return (
    <section id="compare" className="panel card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Professor comparison</p>
          <h2>Course ranking table</h2>
          <p>Sorted by highest rating, then lowest workload.</p>
        </div>
        <ArrowDownUp size={20} />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Professor</th>
              <th>Rating</th>
              <th>Difficulty</th>
              <th>Workload</th>
              <th>A rate</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((course) => (
              <tr
                key={course.id}
                className={selectedCourseId === course.id ? 'active-row' : ''}
                onClick={() => onSelectCourse(course)}
              >
                <td>
                  <strong>{course.code}</strong>
                  <span>{course.title}</span>
                </td>
                <td>{course.professor}</td>
                <td>{course.avgRating}/5</td>
                <td>{course.difficulty}/5</td>
                <td>{course.workloadHours} hrs</td>
                <td>{getARate(course)}%</td>
                <td>{course.attendanceRequired ? 'Required' : 'Flexible'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
