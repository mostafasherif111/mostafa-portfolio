'use client';

import { useEffect, useState } from 'react';
import { getSkills, addSkill, updateSkill, deleteSkill, initLocalStorage } from '@/services/db';
import type { Skill } from '@/services/db.types';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const CATS = ['design','technical','marketing','other'] as const;
const EMPTY: Omit<Skill,'id'> = { name:'', category:'design', proficiency:80 };

export default function SkillsPanel() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [modal, setModal] = useState<'add'|'edit'|null>(null);
  const [form, setForm] = useState<Omit<Skill,'id'>>(EMPTY);
  const [editId, setEditId] = useState<string|null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string|null>(null);

  const load = async () => { initLocalStorage(); setSkills(await getSkills()); };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setError(''); setModal('add'); };
  const openEdit = (s: Skill) => { setForm({ name:s.name, category:s.category, proficiency:s.proficiency }); setEditId(s.id); setError(''); setModal('edit'); };

  const save = async () => {
    if (!form.name.trim()) {
      setError('Skill name is required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (modal==='add') await addSkill(form);
      else if (modal==='edit' && editId) await updateSkill(editId, form);
      await load(); setModal(null);
    } catch (err) {
      setError((err as Error)?.message || 'Unable to save skill.');
    } finally { setSaving(false); }
  };

  const remove = async (id:string) => { await deleteSkill(id); await load(); setDeleteId(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily:'var(--font-poppins)',color:'var(--foreground)' }}>Skills</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Manage your skills and proficiency levels.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background:'linear-gradient(135deg,var(--primary),var(--accent))',color:'#fff',fontFamily:'var(--font-poppins)' }}>
          <Plus className="w-4 h-4"/> Add Skill
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {skills.map(s => (
          <div key={s.id} className="glass-panel rounded-2xl p-5 group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:'var(--emerald-glow)' }}>
                  <span className="text-xs font-bold" style={{ color:'var(--primary)' }}>{s.name.slice(0,2)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ fontFamily:'var(--font-poppins)',color:'var(--foreground)' }}>{s.name}</p>
                  <p className="text-xs capitalize" style={{ color:'var(--text-muted)' }}>{s.category}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={()=>openEdit(s)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'var(--emerald-glow)' }}>
                  <Pencil className="w-3.5 h-3.5" style={{ color:'var(--primary)' }}/>
                </button>
                <button onClick={()=>setDeleteId(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'rgba(239,68,68,0.1)' }}>
                  <Trash2 className="w-3.5 h-3.5" style={{ color:'#ef4444' }}/>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full" style={{ background:'var(--card-border)' }}>
                <div className="h-full rounded-full" style={{ width:`${s.proficiency}%`, background:'linear-gradient(90deg,var(--primary),#34d399)' }}/>
              </div>
              <span className="text-xs font-bold" style={{ color:'var(--primary)',fontFamily:'var(--font-poppins)' }}>{s.proficiency}%</span>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.8)',backdropFilter:'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl" style={{ background:'var(--background)',border:'1px solid var(--card-border)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:'1px solid var(--card-border)' }}>
              <h2 className="font-bold" style={{ fontFamily:'var(--font-poppins)',color:'var(--foreground)' }}>{modal==='add'?'Add Skill':'Edit Skill'}</h2>
              <button onClick={()=>setModal(null)}><X className="w-5 h-5" style={{ color:'var(--text-muted)' }}/></button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color:'var(--text-muted)',fontFamily:'var(--font-poppins)' }}>Skill Name</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Adobe Photoshop"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background:'var(--card-bg)',border:'1px solid var(--card-border)',color:'var(--foreground)' }}/>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color:'var(--text-muted)',fontFamily:'var(--font-poppins)' }}>Category</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value as Skill['category']}))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background:'var(--card-bg)',border:'1px solid var(--card-border)',color:'var(--foreground)' }}>
                  {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color:'var(--text-muted)',fontFamily:'var(--font-poppins)' }}>
                  Proficiency: <span style={{ color:'var(--primary)' }}>{form.proficiency}%</span>
                </label>
                <input type="range" min={10} max={100} value={form.proficiency} onChange={e=>setForm(f=>({...f,proficiency:+e.target.value}))}
                  className="w-full accent-emerald-500"/>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background:'var(--card-bg)',border:'1px solid var(--card-border)',color:'var(--foreground)',fontFamily:'var(--font-poppins)' }}>Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-60"
                  style={{ background:'linear-gradient(135deg,var(--primary),var(--accent))',color:'#fff',fontFamily:'var(--font-poppins)' }}>
                  {saving?<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<><Save className="w-4 h-4"/>Save</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.8)',backdropFilter:'blur(8px)' }}>
          <div className="glass-panel rounded-2xl p-7 max-w-sm w-full text-center">
            <Trash2 className="w-10 h-10 mx-auto mb-3" style={{ color:'#ef4444' }}/>
            <h3 className="font-bold mb-2" style={{ fontFamily:'var(--font-poppins)',color:'var(--foreground)' }}>Delete Skill?</h3>
            <p className="text-sm mb-6" style={{ color:'var(--text-muted)' }}>This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background:'var(--card-bg)',border:'1px solid var(--card-border)',color:'var(--foreground)' }}>Cancel</button>
              <button onClick={()=>remove(deleteId)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background:'#ef4444',color:'#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
