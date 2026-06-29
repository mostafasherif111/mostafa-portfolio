'use client';

import { useEffect, useState } from 'react';
import { getExperience, addExperience, updateExperience, deleteExperience, initLocalStorage } from '@/services/db';
import type { Experience } from '@/services/db.types';
import { Plus, Pencil, Trash2, X, Save, Briefcase, PlusCircle, Trash } from 'lucide-react';

const EMPTY: Omit<Experience, 'id'> = { role: '', company: '', duration: '', description: [] };

export default function ExperiencePanel() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [form, setForm] = useState<Omit<Experience, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [descInput, setDescInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    initLocalStorage();
    setExperience(await getExperience());
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setDescInput('');
    setEditId(null);
    setError('');
    setModal('add');
  };

  const openEdit = (e: Experience) => {
    setForm({
      role: e.role,
      company: e.company,
      duration: e.duration,
      description: [...e.description],
    });
    setDescInput('');
    setEditId(e.id);
    setError('');
    setModal('edit');
  };

  const addDescPoint = () => {
    const d = descInput.trim();
    if (d) {
      setForm((f) => ({ ...f, description: [...f.description, d] }));
      setDescInput('');
    }
  };

  const removeDescPoint = (idx: number) => {
    setForm((f) => ({
      ...f,
      description: f.description.filter((_, i) => i !== idx),
    }));
  };

  const save = async () => {
    if (!form.role.trim() || !form.company.trim()) {
      setError('Role and company are required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (modal === 'add') await addExperience(form);
      else if (modal === 'edit' && editId) await updateExperience(editId, form);
      await load();
      setModal(null);
    } catch (err) {
      setError((err as Error)?.message || 'Unable to save experience.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await deleteExperience(id);
    await load();
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
            Experience
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage your career history and descriptions.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontFamily: 'var(--font-poppins)' }}
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {experience.map((e) => (
          <div key={e.id} className="glass-panel rounded-2xl p-6 group flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--emerald-glow)' }}>
                    <Briefcase className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
                      {e.role}
                    </h3>
                    <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                      {e.company}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {e.duration}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(e)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--emerald-glow)' }}>
                    <Pencil className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                  </button>
                  <button onClick={() => setDeleteId(e.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                  </button>
                </div>
              </div>
              <ul className="space-y-1.5 list-disc pl-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                {e.description.map((desc, idx) => (
                  <li key={idx} className="leading-relaxed">{desc}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto" style={{ background: 'var(--background)', border: '1px solid var(--card-border)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
                {modal === 'add' ? 'Add Experience' : 'Edit Experience'}
              </h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                  Role / Position
                </label>
                <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="e.g. Lead Designer"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                    Company
                  </label>
                  <input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="e.g. Vision X"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                    Duration
                  </label>
                  <input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 2023 - Present"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>
                  Responsibilities & Achievements
                </label>
                <div className="flex gap-2 mb-3">
                  <input placeholder="Add accomplishment..." value={descInput} onChange={(e) => setDescInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDescPoint())}
                    className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
                  <button onClick={addDescPoint} className="px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-center" style={{ background: 'var(--emerald-glow)', color: 'var(--primary)' }}>
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {form.description.map((desc, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-2 rounded-xl border text-xs" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                      <span className="flex-1 leading-normal" style={{ color: 'var(--foreground)' }}>{desc}</span>
                      <button onClick={() => removeDescPoint(idx)} className="p-0.5 rounded text-red-400 hover:bg-red-500/10">
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', fontFamily: 'var(--font-poppins)' }}>
                  Cancel
                </button>
                <button onClick={save} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontFamily: 'var(--font-poppins)' }}>
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" />Save</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel rounded-2xl p-7 max-w-sm w-full text-center">
            <Trash2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#ef4444' }} />
            <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>Delete Entry?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}>Cancel</button>
              <button onClick={() => remove(deleteId)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
