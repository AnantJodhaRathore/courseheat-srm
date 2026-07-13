# CourseHeat SRM

CourseHeat is a mobile-first course intelligence dashboard for SRM students. It combines searchable course data, professor and course comparisons, grade distributions, verified reviews, saved courses, resources, and semester planning in one privacy-conscious interface.

> CourseHeat never asks for SRM NetID or portal passwords. Student access uses an `@srmist.edu.in` email magic link through Supabase Auth.

## Product highlights

- Search course code, course name, professor, department, and tags.
- Filter by department, professor, and semester; sort by rating, difficulty, workload, A-rate, review count, or recommendation score.
- Six summary metrics, a labeled heatmap, responsive course cards, mobile layouts, and persistent light/dark themes.
- Rich course detail modal with grade chart, attendance, workload, review tags, recommendation score, and student reviews.
- Validated review flow with duplicate warnings, moderation status, and editing for a student's own review.
- Two- or three-way course and professor comparison with grade distribution and CSV export.
- Login-gated saved courses, a saved-courses view, community resources, and a semester planner.
- GPA dashboard with editable grades, semester GPA, cumulative GPA, credits, and SRM's 10-point scale.
- Weekly timetable calendar with rooms, class types, add/delete controls, and schedule-conflict detection.
- Independent professor records and direct two-professor comparison across rating, difficulty, workload, A-rate, recommendations, attendance, and review count.
- Student review reporting with a protected moderation queue.
- Authenticated Supabase synchronization for saved courses and planner items, with local demo fallback.
- CSV import for manual workload and attendance data, full course export, and copyable summaries.
- Admin moderation UI and a Supabase schema with RLS for catalog, reviews, profiles, saves, tags, and resources.
- Loading skeletons, empty states, user-friendly errors, and success/error toasts.

## Stack

- React 18 + TypeScript + Vite
- Chart.js + react-chartjs-2
- Supabase Auth and Postgres-ready data layer
- Lucide icons and responsive CSS
- Local-first demo state with `localStorage`

## Run locally

```bash
npm ci
npm run dev
```

The UI works immediately with sample data. When Supabase is not configured, the login panel offers an explicitly labeled local demo student session so reviewers can try authenticated flows without entering a real email.

## Validate and build

```bash
npm run validate
npm run build
```

The dependency versions and lockfile are committed so CI and local builds use the same packages.

## Configure Supabase

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. In Authentication settings, configure the Site URL and allowed redirect URLs for local and deployed environments.
4. Enable email magic-link authentication and configure an email provider.
5. Copy `.env.example` to `.env` and add the browser-safe project values:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Never expose a Supabase secret or `service_role` key in a `VITE_` environment variable. Admin authorization is intentionally based on trusted `app_metadata`, not user-editable metadata.

The database schema enables RLS on every exposed table. Students can create and edit only their own reviews, saves, planner items, profiles, reports, and resource submissions. Saved courses and planner items hydrate from Supabase after login and synchronize every add, update, and delete. Public users see approved community content. Admin moderation policies require `app_metadata.role = "admin"`.

## Manual CSV import

Use the **Import CSV** action on the dashboard with this header:

```csv
course_code,workload_hours,attendance_required
CS 203,9,required
MATH 241,7,false
```

This is deliberately a manual, user-controlled import. The project does not scrape SRM Academia and does not collect university credentials.

## Recommendation score

CourseHeat combines normalized student rating and A-rate, then applies smaller difficulty and workload penalties. The UI converts the 0–100 result into:

- Highly Recommended
- Good Option
- Average
- Challenging
- Avoid if possible

The score is guidance, not an academic outcome prediction.

## Security and privacy

- Accept only `@srmist.edu.in` addresses for student login.
- Use one-time magic links; never ask for an SRM password.
- Keep service keys out of frontend code.
- Moderate reviews and resources before public display.
- Use Supabase RLS ownership checks for every student-owned row.
- Assign admins only through a trusted server or the Supabase dashboard.

CourseHeat is an independent student project and is not affiliated with SRM Institute of Science and Technology.
