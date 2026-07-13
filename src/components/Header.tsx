import { Bookmark, CalendarDays, Github, GraduationCap, LayoutDashboard, LogOut, Moon, Search, ShieldCheck, Sun, UserRound, UserRoundSearch } from 'lucide-react';
import type { AppUser } from '../types';

type View = 'dashboard' | 'saved' | 'resources' | 'planner' | 'gpa' | 'timetable' | 'professors' | 'admin';
type Props = { theme: 'light' | 'dark'; onThemeToggle: () => void; user: AppUser | null; onLogin: () => void; onLogout: () => void; view: View; onView: (view: View) => void; savedCount: number };

export function Header({ theme, onThemeToggle, user, onLogin, onLogout, view, onView, savedCount }: Props) {
  return (
    <header className="site-header">
      <nav className="nav">
        <button className="brand" onClick={() => onView('dashboard')}><img src="/logo.svg" alt="" /><span>CourseHeat</span><b>SRM</b></button>
        <div className="nav-links" aria-label="Primary navigation">
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => onView('dashboard')}><LayoutDashboard size={17} />Explore</button>
          <button className={view === 'saved' ? 'active' : ''} onClick={() => onView('saved')}><Bookmark size={17} />Saved <span className="nav-count">{savedCount}</span></button>
          <button className={view === 'gpa' ? 'active' : ''} onClick={() => onView('gpa')}><GraduationCap size={17} />GPA</button>
          <button className={view === 'timetable' ? 'active' : ''} onClick={() => onView('timetable')}><CalendarDays size={17} />Timetable</button>
          <button className={view === 'professors' ? 'active' : ''} onClick={() => onView('professors')}><UserRoundSearch size={17} />Professors</button>
          <button className={view === 'resources' ? 'active' : ''} onClick={() => onView('resources')}>Resources</button>
          <button className={view === 'planner' ? 'active' : ''} onClick={() => onView('planner')}>Planner</button>
          {user?.isAdmin && <button className={view === 'admin' ? 'active' : ''} onClick={() => onView('admin')}>Admin</button>}
        </div>
        <div className="nav-actions">
          <a className="icon-button" href="https://github.com/AnantJodhaRathore/course-review-heatmap" target="_blank" rel="noreferrer" aria-label="View GitHub repository"><Github size={19} /></a>
          <button className="icon-button" onClick={onThemeToggle} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}</button>
          {user ? <div className="account-chip"><UserRound size={17} /><span>{user.email.split('@')[0]}</span><button onClick={onLogout} aria-label="Log out"><LogOut size={16} /></button></div>
            : <button className="button login-button" onClick={onLogin}><ShieldCheck size={17} />Student login</button>}
        </div>
      </nav>
      {view === 'dashboard' && <section className="hero-content">
        <div className="hero-kicker"><GraduationCap size={17} /> Built for SRM students, powered by student insight</div>
        <h1>Choose your next course with confidence.</h1>
        <p>Compare professors, workload, grades, and honest reviews—without ever sharing your university password.</p>
        <a href="#course-browser" className="button primary"><Search size={18} />Explore courses</a>
      </section>}
    </header>
  );
}
