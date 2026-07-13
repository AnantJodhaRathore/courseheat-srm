import type { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: 'cs101-chen-fall-2025',
    code: 'CS 101',
    title: 'Introduction to Computer Science',
    department: 'CSE',
    professor: 'Dr. Maya Chen',
    semester: 'Fall',
    year: 2025,
    enrollment: 188,
    avgRating: 4.7,
    difficulty: 2.8,
    workloadHours: 6,
    attendanceRequired: false,
    gradeDistribution: { A: 42, B: 35, C: 16, D: 5, F: 2 },
    tags: ['beginner friendly', 'projects', 'Python'],
    reviews: [
      { id: 'r1', courseId: 'cs101-chen-fall-2025', rating: 5, difficulty: 3, workloadHours: 6, grade: 'A', reviewerType: 'Freshman', createdAt: '2025-10-04', comment: 'Clear lectures and useful labs. Great first CS class.' },
      { id: 'r2', courseId: 'cs101-chen-fall-2025', rating: 4, difficulty: 2, workloadHours: 5, grade: 'B', reviewerType: 'Sophomore', createdAt: '2025-11-12', comment: 'Homework is fair and projects are fun.' }
    ]
  },
  {
    id: 'cs220-patel-spring-2025',
    code: 'CS 203',
    title: 'Data Structures',
    department: 'CSE',
    professor: 'Prof. Arjun Patel',
    semester: 'Spring',
    year: 2026,
    enrollment: 142,
    avgRating: 4.3,
    difficulty: 3.7,
    workloadHours: 10,
    attendanceRequired: true,
    gradeDistribution: { A: 31, B: 38, C: 22, D: 6, F: 3 },
    tags: ['algorithms', 'Java', 'weekly quizzes'],
    reviews: [
      { id: 'r3', courseId: 'cs220-patel-spring-2025', rating: 4, difficulty: 4, workloadHours: 11, grade: 'B', reviewerType: 'Sophomore', createdAt: '2025-03-08', comment: 'Challenging but very organized. Start projects early.' },
      { id: 'r4', courseId: 'cs220-patel-spring-2025', rating: 5, difficulty: 4, workloadHours: 9, grade: 'A', reviewerType: 'Junior', createdAt: '2025-04-18', comment: 'Office hours saved me. Professor explains trees really well.' }
    ]
  },
  {
    id: 'math241-rivera-fall-2025',
    code: 'MATH 241',
    title: 'Calculus III',
    department: 'Mathematics',
    professor: 'Dr. Elena Rivera',
    semester: 'Fall',
    year: 2025,
    enrollment: 116,
    avgRating: 4.1,
    difficulty: 4.2,
    workloadHours: 9,
    attendanceRequired: false,
    gradeDistribution: { A: 27, B: 34, C: 25, D: 9, F: 5 },
    tags: ['proof practice', 'weekly worksheets', 'curve'],
    reviews: [
      { id: 'r5', courseId: 'math241-rivera-fall-2025', rating: 4, difficulty: 4, workloadHours: 8, grade: 'B', reviewerType: 'Sophomore', createdAt: '2025-09-30', comment: 'Fast-paced, but exams match the practice sets.' }
    ]
  },
  {
    id: 'stat310-kim-spring-2025',
    code: 'STAT 310',
    title: 'Applied Statistics',
    department: 'Mathematics',
    professor: 'Dr. Hannah Kim',
    semester: 'Spring',
    year: 2026,
    enrollment: 91,
    avgRating: 4.8,
    difficulty: 2.6,
    workloadHours: 5,
    attendanceRequired: false,
    gradeDistribution: { A: 48, B: 32, C: 14, D: 4, F: 2 },
    tags: ['R', 'labs', 'exam review'],
    reviews: [
      { id: 'r6', courseId: 'stat310-kim-spring-2025', rating: 5, difficulty: 2, workloadHours: 4, grade: 'A', reviewerType: 'Junior', createdAt: '2025-02-24', comment: 'One of the best courses I took. Labs make concepts click.' },
      { id: 'r7', courseId: 'stat310-kim-spring-2025', rating: 5, difficulty: 3, workloadHours: 6, grade: 'A', reviewerType: 'Senior', createdAt: '2025-05-02', comment: 'Great lectures and useful datasets.' }
    ]
  },
  {
    id: 'econ201-brooks-fall-2025',
    code: 'ECON 201',
    title: 'Microeconomics',
    department: 'Business',
    professor: 'Prof. Nolan Brooks',
    semester: 'Fall',
    year: 2025,
    enrollment: 204,
    avgRating: 3.7,
    difficulty: 3.1,
    workloadHours: 6,
    attendanceRequired: true,
    gradeDistribution: { A: 26, B: 37, C: 24, D: 9, F: 4 },
    tags: ['attendance clicks', 'case studies', 'midterm heavy'],
    reviews: [
      { id: 'r8', courseId: 'econ201-brooks-fall-2025', rating: 3, difficulty: 3, workloadHours: 7, grade: 'B', reviewerType: 'Freshman', createdAt: '2025-10-14', comment: 'Lectures are solid, attendance points matter a lot.' }
    ]
  },
  {
    id: 'bio150-nguyen-spring-2025',
    code: 'BIO 150',
    title: 'Cell Biology',
    department: 'Mechanical',
    professor: 'Dr. Linh Nguyen',
    semester: 'Spring',
    year: 2026,
    enrollment: 128,
    avgRating: 4.0,
    difficulty: 3.9,
    workloadHours: 11,
    attendanceRequired: true,
    gradeDistribution: { A: 29, B: 30, C: 27, D: 10, F: 4 },
    tags: ['lab reports', 'memorization', 'participation'],
    reviews: [
      { id: 'r9', courseId: 'bio150-nguyen-spring-2025', rating: 4, difficulty: 4, workloadHours: 12, grade: 'B', reviewerType: 'Sophomore', createdAt: '2025-03-17', comment: 'Lots of detail, but the study guides are accurate.' }
    ]
  },
  {
    id: 'eng210-williams-fall-2025',
    code: 'ENG 210',
    title: 'Technical Writing',
    department: 'Civil',
    professor: 'Dr. Kara Williams',
    semester: 'Fall',
    year: 2025,
    enrollment: 62,
    avgRating: 4.6,
    difficulty: 2.1,
    workloadHours: 4,
    attendanceRequired: false,
    gradeDistribution: { A: 54, B: 31, C: 11, D: 3, F: 1 },
    tags: ['portfolio', 'peer review', 'resume'],
    reviews: [
      { id: 'r10', courseId: 'eng210-williams-fall-2025', rating: 5, difficulty: 2, workloadHours: 4, grade: 'A', reviewerType: 'Senior', createdAt: '2025-09-18', comment: 'Practical assignments. Great for internship applications.' }
    ]
  },
  {
    id: 'phys212-singh-spring-2025',
    code: 'PHYS 212',
    title: 'Electricity and Magnetism',
    department: 'ECE',
    professor: 'Prof. Dev Singh',
    semester: 'Spring',
    year: 2026,
    enrollment: 107,
    avgRating: 3.5,
    difficulty: 4.7,
    workloadHours: 13,
    attendanceRequired: false,
    gradeDistribution: { A: 21, B: 29, C: 31, D: 13, F: 6 },
    tags: ['problem sets', 'curve', 'recitation'],
    reviews: [
      { id: 'r11', courseId: 'phys212-singh-spring-2025', rating: 3, difficulty: 5, workloadHours: 14, grade: 'C', reviewerType: 'Sophomore', createdAt: '2025-04-09', comment: 'Hardest class this semester. Recitation is very important.' }
    ]
  },
  {
    id: 'psych101-martinez-fall-2025',
    code: 'PSYCH 101',
    title: 'Introduction to Psychology',
    department: 'Humanities',
    professor: 'Dr. Sofia Martinez',
    semester: 'Fall',
    year: 2025,
    enrollment: 231,
    avgRating: 4.4,
    difficulty: 2.3,
    workloadHours: 5,
    attendanceRequired: true,
    gradeDistribution: { A: 45, B: 34, C: 15, D: 4, F: 2 },
    tags: ['research credits', 'multiple choice', 'engaging'],
    reviews: [
      { id: 'r12', courseId: 'psych101-martinez-fall-2025', rating: 4, difficulty: 2, workloadHours: 5, grade: 'A', reviewerType: 'Freshman', createdAt: '2025-11-02', comment: 'Interesting class. Do the research credits early.' }
    ]
  },
  {
    id: 'hist130-owens-summer-2025',
    code: 'HIST 130',
    title: 'Modern World History',
    department: 'Civil',
    professor: 'Prof. Avery Owens',
    semester: 'Summer',
    year: 2026,
    enrollment: 48,
    avgRating: 4.2,
    difficulty: 2.9,
    workloadHours: 7,
    attendanceRequired: false,
    gradeDistribution: { A: 39, B: 36, C: 17, D: 6, F: 2 },
    tags: ['essays', 'discussion boards', 'open notes'],
    reviews: [
      { id: 'r13', courseId: 'hist130-owens-summer-2025', rating: 4, difficulty: 3, workloadHours: 7, grade: 'B', reviewerType: 'Junior', createdAt: '2025-07-10', comment: 'Reading load is manageable if you keep up weekly.' }
    ]
  },
  {
    id: 'chem110-adams-fall-2025',
    code: 'CHEM 110',
    title: 'General Chemistry I',
    department: 'EEE',
    professor: 'Dr. Violet Adams',
    semester: 'Fall',
    year: 2025,
    enrollment: 176,
    avgRating: 3.9,
    difficulty: 4.1,
    workloadHours: 12,
    attendanceRequired: true,
    gradeDistribution: { A: 24, B: 33, C: 28, D: 10, F: 5 },
    tags: ['lab', 'ALEKS', 'attendance'],
    reviews: [
      { id: 'r14', courseId: 'chem110-adams-fall-2025', rating: 4, difficulty: 4, workloadHours: 12, grade: 'B', reviewerType: 'Freshman', createdAt: '2025-09-25', comment: 'Lab reports take time. Lecture examples are helpful.' }
    ]
  },
  {
    id: 'art105-thompson-spring-2025',
    code: 'ART 105',
    title: 'Digital Design Studio',
    department: 'Business',
    professor: 'Prof. Riley Thompson',
    semester: 'Spring',
    year: 2026,
    enrollment: 39,
    avgRating: 4.9,
    difficulty: 2.4,
    workloadHours: 6,
    attendanceRequired: true,
    gradeDistribution: { A: 61, B: 27, C: 9, D: 2, F: 1 },
    tags: ['portfolio', 'Figma', 'critique'],
    reviews: [
      { id: 'r15', courseId: 'art105-thompson-spring-2025', rating: 5, difficulty: 2, workloadHours: 6, grade: 'A', reviewerType: 'Senior', createdAt: '2025-05-06', comment: 'Super creative and portfolio-friendly.' }
    ]
  }
];
