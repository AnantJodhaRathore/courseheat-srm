import { BookOpenText, Download, FileQuestion, Search, UploadCloud } from 'lucide-react';
import { useState } from 'react';
const resources = [
  { course: 'CS 203', type: 'PYQ', title: 'Data Structures end-sem papers', meta: '2023–2025 · 8 files', icon: FileQuestion },
  { course: 'MATH 241', type: 'Notes', title: 'Calculus III visual formula guide', meta: 'Community verified · PDF', icon: BookOpenText },
  { course: 'CHEM 110', type: 'Lab', title: 'General Chemistry lab checklist', meta: 'Updated Spring 2026', icon: BookOpenText },
  { course: 'STAT 310', type: 'Notes', title: 'Applied Statistics R cheat sheet', meta: '4.8 student rating', icon: BookOpenText }
];
export function ResourcesHub({ loggedIn, onLogin, onNotice }: { loggedIn: boolean; onLogin: () => void; onNotice: (message: string) => void }) {
  const [query, setQuery] = useState(''); const visible = resources.filter((item) => `${item.course} ${item.type} ${item.title}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="page-shell subpage"><div className="page-heading"><div><p className="eyebrow"><BookOpenText size={16} />Community library</p><h1>Notes, PYQs & study resources</h1><p>Student-contributed materials with clear course labels and moderation status.</p></div><button className="button primary" onClick={() => loggedIn ? onNotice('Upload flow ready for Supabase Storage integration.') : onLogin()}><UploadCloud size={17} />Contribute a resource</button></div>
    <label className="resource-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by course, resource, or type" /></label>
    <section className="resource-grid">{visible.map(({ icon: Icon, ...item }) => <article className="resource-card card" key={item.title}><div className="resource-icon"><Icon /></div><span>{item.course} · {item.type}</span><h3>{item.title}</h3><p>{item.meta}</p><button onClick={() => onNotice('Sample resource preview opened.')}><Download size={16} />Preview resource</button></article>)}</section>
  </main>;
}
