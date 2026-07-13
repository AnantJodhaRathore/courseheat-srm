export type GradeKey = 'A' | 'B' | 'C' | 'D' | 'F';
export type GradeDistribution = Record<GradeKey, number>;
export type SemesterName = 'Fall' | 'Spring' | 'Summer' | 'Winter';
export type StudentLevel = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';

export type Review = {
  id: string;
  courseId: string;
  userId?: string;
  professor?: string;
  semester?: SemesterName;
  year?: number;
  rating: number;
  difficulty: number;
  workloadHours: number;
  attendanceRequired?: boolean;
  wouldTakeAgain?: boolean;
  grade: GradeKey;
  comment: string;
  tags?: string[];
  reviewerType: StudentLevel;
  createdAt: string;
  status?: 'pending' | 'approved' | 'reported';
};

export type Course = {
  id: string;
  code: string;
  title: string;
  department: string;
  professor: string;
  semester: SemesterName;
  year: number;
  enrollment: number;
  avgRating: number;
  difficulty: number;
  workloadHours: number;
  attendanceRequired: boolean;
  gradeDistribution: GradeDistribution;
  tags: string[];
  reviews: Review[];
};

export type MetricKey = 'avgRating' | 'difficulty' | 'workloadHours' | 'aRate' | 'attendanceRequired';
export type SortKey = 'rating-desc' | 'difficulty-asc' | 'workload-asc' | 'a-rate-desc' | 'reviews-desc' | 'recommended-desc';

export type FiltersState = {
  search: string;
  department: string;
  professor: string;
  semester: string;
  metric: MetricKey;
  sort: SortKey;
};

export type NewReviewForm = {
  courseId: string;
  professor: string;
  semester: SemesterName;
  year: number;
  rating: number;
  difficulty: number;
  workloadHours: number;
  attendanceRequired: boolean;
  wouldTakeAgain: boolean;
  grade: GradeKey;
  reviewerType: StudentLevel;
  comment: string;
  tags: string[];
};

export type AppUser = {
  id: string;
  email: string;
  isAdmin: boolean;
  isDemo?: boolean;
};

export type PlannerItem = {
  id: string;
  courseId: string;
  task: string;
  dueDate: string;
  done: boolean;
};

export type GpaRecord = {
  id: string;
  semester: string;
  courseCode: string;
  courseName: string;
  credits: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
};

export type TimetableEntry = {
  id: string;
  courseId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
};

export type ProfessorRecord = {
  id: string;
  name: string;
  department: string;
  courseCodes: string[];
  averageRating: number;
  difficulty: number;
  workloadHours: number;
  aRate: number;
  wouldTakeAgain: number;
  attendanceStrictness: number;
  totalReviews: number;
};

export type ToastMessage = { id: string; kind: 'success' | 'error' | 'info'; message: string };
