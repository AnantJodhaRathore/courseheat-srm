import { GitCompareArrows, Star, UserRoundSearch } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Course, ProfessorRecord } from '../types';
import { getProfessorRecords } from '../lib/courseUtils';
export function ProfessorComparison({ courses }: { courses: Course[] }) {
  const professors=useMemo(()=>getProfessorRecords(courses),[courses]); const [left,setLeft]=useState(professors[0]?.id??''); const [right,setRight]=useState(professors[1]?.id??''); const selected=professors.filter((item)=>item.id===left||item.id===right);
  const metrics:Array<[string,(item:ProfessorRecord)=>string]>=[['Average rating',(p)=>`${p.averageRating}/5`],['Difficulty',(p)=>`${p.difficulty}/5`],['Weekly workload',(p)=>`${p.workloadHours} hrs`],['A-rate',(p)=>`${p.aRate}%`],['Would take again',(p)=>`${p.wouldTakeAgain}%`],['Attendance strictness',(p)=>`${p.attendanceStrictness}%`],['Total reviews',(p)=>String(p.totalReviews)]];
  return <main className="page-shell subpage"><div className="page-heading"><div><p className="eyebrow"><UserRoundSearch size={16}/>Faculty intelligence</p><h1>Compare professors directly</h1><p>Select any two independent professor records—without first choosing course cards.</p></div></div>
    <section className="professor-selectors card"><label>First professor<select value={left} onChange={(e)=>setLeft(e.target.value)}>{professors.map((item)=><option value={item.id} key={item.id}>{item.name} · {item.department}</option>)}</select></label><GitCompareArrows/><label>Second professor<select value={right} onChange={(e)=>setRight(e.target.value)}>{professors.map((item)=><option value={item.id} key={item.id}>{item.name} · {item.department}</option>)}</select></label></section>
    <section className="professor-profile-grid">{selected.map((professor)=><article className="professor-profile card" key={professor.id}><div className="professor-avatar">{professor.name.split(' ').slice(-1)[0].slice(0,1)}</div><p className="eyebrow">{professor.department}</p><h2>{professor.name}</h2><div className="professor-rating"><Star fill="currentColor"/> {professor.averageRating}/5</div><p>{professor.courseCodes.join(' · ')}</p></article>)}</section>
    <section className="card professor-matrix"><table><thead><tr><th>Metric</th>{selected.map((item)=><th key={item.id}>{item.name}</th>)}</tr></thead><tbody>{metrics.map(([label,get])=><tr key={label}><td>{label}</td>{selected.map((item)=><td key={item.id}>{get(item)}</td>)}</tr>)}</tbody></table></section>
  </main>;
}
