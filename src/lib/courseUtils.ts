import type { Course, FiltersState, GradeDistribution, MetricKey, NewReviewForm, ProfessorRecord, Review, SortKey } from '../types';

export const metricLabels: Record<MetricKey, string> = {
  avgRating: 'Student rating', difficulty: 'Difficulty', workloadHours: 'Weekly workload',
  aRate: 'A grade rate', attendanceRequired: 'Attendance policy'
};

export const metricDescriptions: Record<MetricKey, string> = {
  avgRating: 'Higher is better, based on verified student reviews.',
  difficulty: 'Higher means harder, rated from 1 to 5.',
  workloadHours: 'Estimated study hours per week outside class.',
  aRate: 'Percentage of students receiving an A.',
  attendanceRequired: 'Whether attendance is required.'
};

export const sortLabels: Record<SortKey, string> = {
  'rating-desc': 'Highest rating', 'difficulty-asc': 'Lowest difficulty', 'workload-asc': 'Lowest workload',
  'a-rate-desc': 'Highest A-rate', 'reviews-desc': 'Most reviewed', 'recommended-desc': 'Most recommended'
};

export function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function getARate(course: Course) { return course.gradeDistribution.A; }
export function getWouldTakeAgain(course: Course) {
  if (!course.reviews.length) return Math.round(Math.min(96, course.avgRating * 19));
  return Math.round(course.reviews.filter((review) => review.wouldTakeAgain !== false).length / course.reviews.length * 100);
}

export function getRecommendationScore(course: Course) {
  const rating = course.avgRating * 20;
  const aRate = getARate(course);
  const difficultyPenalty = course.difficulty * 9;
  const workloadPenalty = Math.min(course.workloadHours, 20) * 1.6;
  return Math.max(0, Math.min(100, Math.round(rating * 0.58 + aRate * 0.62 - difficultyPenalty * 0.28 - workloadPenalty * 0.2 + 20)));
}

export function getRecommendationLabel(course: Course) {
  const score = getRecommendationScore(course);
  if (score >= 80) return 'Highly Recommended';
  if (score >= 68) return 'Good Option';
  if (score >= 55) return 'Average';
  if (score >= 42) return 'Challenging';
  return 'Avoid if possible';
}

export function getCourseBadges(course: Course) {
  const badges: string[] = [];
  if (getARate(course) >= 45 && course.difficulty <= 3) badges.push('Easy A');
  if (course.avgRating >= 4.5) badges.push('Highly Rated');
  if (course.workloadHours >= 11) badges.push('Heavy Workload');
  if (course.attendanceRequired) badges.push('Attendance Required');
  if (course.difficulty >= 4.2) badges.push('Challenging');
  return badges.slice(0, 2);
}

export function getMetricValue(course: Course, metric: MetricKey) {
  if (metric === 'aRate') return getARate(course);
  if (metric === 'attendanceRequired') return course.attendanceRequired ? 1 : 0;
  return course[metric];
}

export function formatMetricValue(course: Course, metric: MetricKey) {
  const value = getMetricValue(course, metric);
  if (metric === 'avgRating' || metric === 'difficulty') return `${Number(value).toFixed(1)}/5`;
  if (metric === 'workloadHours') return `${value} hrs/wk`;
  if (metric === 'aRate') return `${value}% A`;
  return course.attendanceRequired ? 'Required' : 'Flexible';
}

export function getHeatColorClass(course: Course, metric: MetricKey) {
  const value = getMetricValue(course, metric);
  if (metric === 'attendanceRequired') return value === 1 ? 'heat hot' : 'heat excellent';
  if (metric === 'avgRating') return value >= 4.4 ? 'heat excellent' : value >= 3.8 ? 'heat mid' : 'heat hot';
  if (metric === 'difficulty') return value >= 4 ? 'heat hot' : value >= 3 ? 'heat mid' : 'heat excellent';
  if (metric === 'workloadHours') return value >= 11 ? 'heat hot' : value >= 7 ? 'heat mid' : 'heat excellent';
  return value >= 45 ? 'heat excellent' : value >= 30 ? 'heat mid' : 'heat hot';
}

export function filterCourses(courses: Course[], filters: FiltersState) {
  const query = filters.search.trim().toLowerCase();
  const filtered = courses.filter((course) => {
    const haystack = [course.code, course.code.replace(/\s/g, ''), course.title, course.department, course.professor, ...course.tags].join(' ').toLowerCase();
    return (!query || haystack.includes(query))
      && (filters.department === 'All' || course.department === filters.department)
      && (filters.professor === 'All' || course.professor === filters.professor)
      && (filters.semester === 'All' || `${course.semester} ${course.year}` === filters.semester);
  });
  return sortCourses(filtered, filters.sort);
}

export function sortCourses(courses: Course[], sort: SortKey) {
  const sorted = [...courses];
  const sorters: Record<SortKey, (a: Course, b: Course) => number> = {
    'rating-desc': (a, b) => b.avgRating - a.avgRating,
    'difficulty-asc': (a, b) => a.difficulty - b.difficulty,
    'workload-asc': (a, b) => a.workloadHours - b.workloadHours,
    'a-rate-desc': (a, b) => getARate(b) - getARate(a),
    'reviews-desc': (a, b) => b.reviews.length - a.reviews.length,
    'recommended-desc': (a, b) => getRecommendationScore(b) - getRecommendationScore(a)
  };
  return sorted.sort(sorters[sort]);
}

export function normalizeCourse(course: Course): Course {
  return {
    ...course,
    reviews: course.reviews.map((review) => ({
      ...review,
      professor: review.professor ?? course.professor,
      semester: review.semester ?? course.semester,
      year: review.year ?? course.year,
      attendanceRequired: review.attendanceRequired ?? course.attendanceRequired,
      wouldTakeAgain: review.wouldTakeAgain ?? review.rating >= 4,
      tags: review.tags ?? course.tags.slice(0, 2),
      status: review.status ?? 'approved'
    }))
  };
}

export function addReviewToCourse(course: Course, form: NewReviewForm, userId: string): Course {
  const newReview: Review = {
    id: `review-${crypto.randomUUID()}`, courseId: course.id, userId, professor: form.professor,
    semester: form.semester, year: form.year, rating: form.rating, difficulty: form.difficulty,
    workloadHours: form.workloadHours, attendanceRequired: form.attendanceRequired,
    wouldTakeAgain: form.wouldTakeAgain, grade: form.grade, reviewerType: form.reviewerType,
    comment: form.comment.trim(), tags: form.tags, createdAt: new Date().toISOString().slice(0, 10), status: 'pending'
  };
  const reviews = [newReview, ...course.reviews];
  const avgRating = roundOne(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length);
  const difficulty = roundOne(reviews.reduce((sum, review) => sum + review.difficulty, 0) / reviews.length);
  const workloadHours = Math.round(reviews.reduce((sum, review) => sum + review.workloadHours, 0) / reviews.length);
  return { ...course, reviews, avgRating, difficulty, workloadHours, attendanceRequired: form.attendanceRequired,
    tags: uniqueSorted([...course.tags, ...form.tags]).slice(0, 6),
    gradeDistribution: recalculateGradeDistribution(course.gradeDistribution, form.grade, course.reviews.length + course.enrollment) };
}

export function updateReviewInCourse(course: Course, reviewId: string, form: NewReviewForm) {
  const reviews = course.reviews.map((review) => review.id === reviewId ? { ...review, ...form, comment: form.comment.trim(), status: 'pending' as const } : review);
  return { ...course, reviews, avgRating: roundOne(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length),
    difficulty: roundOne(reviews.reduce((sum, review) => sum + review.difficulty, 0) / reviews.length),
    workloadHours: Math.round(reviews.reduce((sum, review) => sum + review.workloadHours, 0) / reviews.length) };
}

function recalculateGradeDistribution(current: GradeDistribution, newGrade: keyof GradeDistribution, estimatedTotal: number): GradeDistribution {
  const counts = Object.fromEntries(Object.entries(current).map(([grade, value]) => [grade, Math.round(value / 100 * estimatedTotal)])) as GradeDistribution;
  counts[newGrade] += 1;
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const result = Object.fromEntries(Object.entries(counts).map(([grade, count]) => [grade, Math.round(count / total * 100)])) as GradeDistribution;
  result.A += 100 - Object.values(result).reduce((sum, value) => sum + value, 0);
  return result;
}

function roundOne(value: number) { return Math.round(value * 10) / 10; }

export function getDashboardStats(courses: Course[]) {
  const courseCount = courses.length;
  const totalReviews = courses.reduce((sum, course) => sum + course.reviews.length, 0);
  const avgRating = courseCount ? roundOne(courses.reduce((sum, course) => sum + course.avgRating, 0) / courseCount) : 0;
  const bestRated = [...courses].sort((a, b) => b.avgRating - a.avgRating)[0];
  const hardest = [...courses].sort((a, b) => b.difficulty - a.difficulty)[0];
  const highestARate = [...courses].sort((a, b) => getARate(b) - getARate(a))[0];
  return { courseCount, totalReviews, avgRating, bestRated, hardest, highestARate };
}

export function coursesToCsv(courses: Course[]) {
  const rows = [['Code', 'Course', 'Professor', 'Department', 'Semester', 'Rating', 'Difficulty', 'Workload', 'A-rate', 'Reviews', 'Recommendation']];
  courses.forEach((course) => rows.push([course.code, course.title, course.professor, course.department, `${course.semester} ${course.year}`,
    String(course.avgRating), String(course.difficulty), String(course.workloadHours), String(getARate(course)), String(course.reviews.length), String(getRecommendationScore(course))]));
  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}

export function getProfessorRecords(courses: Course[]): ProfessorRecord[] {
  const groups = new Map<string, Course[]>();
  courses.forEach((course) => groups.set(course.professor, [...(groups.get(course.professor) ?? []), course]));
  return Array.from(groups.entries()).map(([name, taught]) => {
    const reviews = taught.flatMap((course) => course.reviews);
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, department: taught[0].department,
      courseCodes: taught.map((course) => course.code),
      averageRating: roundOne(taught.reduce((sum, course) => sum + course.avgRating, 0) / taught.length),
      difficulty: roundOne(taught.reduce((sum, course) => sum + course.difficulty, 0) / taught.length),
      workloadHours: Math.round(taught.reduce((sum, course) => sum + course.workloadHours, 0) / taught.length),
      aRate: Math.round(taught.reduce((sum, course) => sum + getARate(course), 0) / taught.length),
      wouldTakeAgain: reviews.length ? Math.round(reviews.filter((review) => review.wouldTakeAgain !== false).length / reviews.length * 100) : Math.round(taught[0].avgRating * 19),
      attendanceStrictness: Math.round(taught.filter((course) => course.attendanceRequired).length / taught.length * 100),
      totalReviews: reviews.length
    };
  }).sort((a, b) => b.averageRating - a.averageRating);
}
