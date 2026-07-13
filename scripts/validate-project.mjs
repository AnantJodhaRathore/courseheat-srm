import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'package.json',
  'index.html',
  'vite.config.ts',
  'tsconfig.json',
  '.env.example',
  'README.md',
  'src/main.tsx',
  'src/App.tsx',
  'src/types.ts',
  'src/data/mockCourses.ts',
  'src/lib/courseUtils.ts',
  'src/lib/storage.ts',
  'src/lib/supabase.ts',
  'src/components/Header.tsx',
  'src/components/AuthDialog.tsx',
  'src/components/Filters.tsx',
  'src/components/StatCards.tsx',
  'src/components/HeatmapGrid.tsx',
  'src/components/CourseDetail.tsx',
  'src/components/CourseCards.tsx',
  'src/components/ComparisonPanel.tsx',
  'src/components/SavedCourses.tsx',
  'src/components/ResourcesHub.tsx',
  'src/components/SemesterPlanner.tsx',
  'src/components/AdminDashboard.tsx',
  'src/components/Skeletons.tsx',
  'src/components/ToastStack.tsx',
  'src/components/GradeCharts.tsx',
  'src/components/CourseTable.tsx',
  'src/components/ReviewForm.tsx',
  'src/components/InsightsPanel.tsx',
  'src/components/GpaDashboard.tsx',
  'src/components/TimetableCalendar.tsx',
  'src/components/ProfessorComparison.tsx',
  'src/components/Footer.tsx',
  'src/styles/index.css',
  'supabase/schema.sql'
];

let failed = false;

for (const file of requiredFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing file: ${file}`);
    failed = true;
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const scriptName of ['dev', 'build', 'preview', 'validate']) {
  if (!packageJson.scripts?.[scriptName]) {
    console.error(`Missing package.json script: ${scriptName}`);
    failed = true;
  }
}

const mockData = fs.readFileSync(path.join(root, 'src/data/mockCourses.ts'), 'utf8');
const courseCount = [...mockData.matchAll(/code: '[^']+'/g)].length;
if (courseCount < 10) {
  console.error(`Expected at least 10 mock courses, found ${courseCount}.`);
  failed = true;
}

const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
for (const feature of ['HeatmapGrid', 'CourseCards', 'ComparisonPanel', 'ReviewForm', 'CourseDetail', 'SavedCourses', 'ResourcesHub', 'SemesterPlanner', 'GpaDashboard', 'TimetableCalendar', 'ProfessorComparison', 'AdminDashboard', 'ToastStack']) {
  if (!app.includes(feature)) {
    console.error(`App does not include expected feature: ${feature}`);
    failed = true;
  }
}

const schema = fs.readFileSync(path.join(root, 'supabase/schema.sql'), 'utf8');
for (const table of ['courses', 'professors', 'reviews', 'users', 'saved_courses', 'planner_items', 'review_reports', 'review_tags']) {
  if (!schema.includes(`public.${table}`)) {
    console.error(`Supabase schema does not include expected table: ${table}`);
    failed = true;
  }
}

const auth = fs.readFileSync(path.join(root, 'src/lib/supabase.ts'), 'utf8');
if (!auth.includes('@srmist.edu.in') || !auth.includes('signInWithOtp')) {
  console.error('Expected SRM email-only magic link authentication.');
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log(`Project validation passed. ${requiredFiles.length} files checked, ${courseCount} courses found.`);
