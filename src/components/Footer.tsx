import { isSupabaseConfigured } from '../lib/supabase';
export function Footer() { return <footer className="footer"><p>CourseHeat is a student-built planning tool. It is not affiliated with SRM Institute of Science and Technology.</p><span>{isSupabaseConfigured ? 'Verified secure session' : 'Authentication setup required'}</span></footer>; }
