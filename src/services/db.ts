import { ensureSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { Project, Skill, Experience, Testimonial, SiteSettings, ActivityLog } from './db.types';
import {
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_EXPERIENCE,
  DEFAULT_TESTIMONIALS,
  DEFAULT_SETTINGS,
  INITIAL_LOGS
} from './mockData';

function getSupabaseClient() {
  try {
    return ensureSupabaseClient();
  } catch (err) {
    console.error('getSupabaseClient: ensureSupabaseClient error', err);
    throw err;
  }
}

// Initialize local storage safely on client
export function initLocalStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem('mostafasherif_projects')) {
    localStorage.setItem('mostafasherif_projects', JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem('mostafasherif_skills')) {
    localStorage.setItem('mostafasherif_skills', JSON.stringify(DEFAULT_SKILLS));
  }
  if (!localStorage.getItem('mostafasherif_experience')) {
    localStorage.setItem('mostafasherif_experience', JSON.stringify(DEFAULT_EXPERIENCE));
  }
  if (!localStorage.getItem('mostafasherif_testimonials')) {
    localStorage.setItem('mostafasherif_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
  }
  if (!localStorage.getItem('mostafasherif_settings')) {
    localStorage.setItem('mostafasherif_settings', JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem('mostafasherif_logs')) {
    localStorage.setItem('mostafasherif_logs', JSON.stringify(INITIAL_LOGS));
  }
}

// Local helper to read/write state
const getLocal = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  initLocalStorage();
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : fallback;
};

const setLocal = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

const isString = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const toSafeDateString = (value: unknown): string => {
  if (typeof value === 'string' && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? new Date().toISOString() : value.toISOString();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }

  return new Date().toISOString();
};

const normalizeProject = (project: unknown): Project => {
  const raw = typeof project === 'object' && project !== null ? project as Record<string, unknown> : {};

  let rawImages = raw.images;
  if (typeof rawImages === 'string' && rawImages.trim().startsWith('[')) {
    try {
      rawImages = JSON.parse(rawImages);
    } catch (e) {
      console.error('Failed to parse raw.images JSON string:', e);
    }
  }

  let rawTags = raw.tags;
  if (typeof rawTags === 'string' && rawTags.trim().startsWith('[')) {
    try {
      rawTags = JSON.parse(rawTags);
    } catch (e) {
      console.error('Failed to parse raw.tags JSON string:', e);
    }
  }

  const imagesFromRaw = Array.isArray(rawImages)
    ? rawImages.filter(isString)
    : isString(rawImages)
      ? [rawImages]
      : [];

  const imageUrl = isString(raw.imageUrl) ? raw.imageUrl : imagesFromRaw[0] ?? '';
  const images = imagesFromRaw.length > 0 ? [...new Set(imagesFromRaw)] : (imageUrl ? [imageUrl] : []);

  return {
    id: isString(raw.id) ? raw.id : `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: isString(raw.title) ? raw.title : '',
    description: isString(raw.description) ? raw.description : '',
    category: isString(raw.category) ? raw.category : '',
    tags: Array.isArray(rawTags) ? rawTags.filter(isString) : [],
    link: isString(raw.link) ? raw.link : undefined,
    created_at: toSafeDateString(raw.created_at),
    images,
    imageUrl,
  };
};

const normalizeSkill = (skill: unknown): Skill => {
  const raw = typeof skill === 'object' && skill !== null ? skill as Record<string, unknown> : {};
  const category = isString(raw.category) && ['design', 'technical', 'marketing', 'other'].includes(raw.category as string)
    ? raw.category as Skill['category']
    : 'design';

  return {
    id: isString(raw.id) ? raw.id : `sk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: isString(raw.name) ? raw.name : '',
    category,
    proficiency: typeof raw.proficiency === 'number' ? Math.max(0, Math.min(100, raw.proficiency)) : 0,
  };
};

const normalizeExperience = (experience: unknown): Experience => {
  const raw = typeof experience === 'object' && experience !== null ? experience as Record<string, unknown> : {};

  let duration = isString(raw.duration) ? raw.duration : '';
  if (!duration) {
    const start = isString(raw.startdate) ? raw.startdate : '';
    const end = isString(raw.enddate) ? raw.enddate : '';
    duration = start && end ? `${start} - ${end}` : (start || end || '');
  }

  return {
    id: isString(raw.id) ? raw.id : `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: isString(raw.role) ? raw.role : '',
    company: isString(raw.company) ? raw.company : '',
    duration,
    description: Array.isArray(raw.description) ? raw.description.filter(isString) : [],
  };
};

const normalizeTestimonial = (testimonial: unknown): Testimonial => {
  const raw = typeof testimonial === 'object' && testimonial !== null ? testimonial as Record<string, unknown> : {};
  return {
    id: isString(raw.id) ? raw.id : `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: isString(raw.name) ? raw.name : '',
    role: isString(raw.role) ? raw.role : '',
    company: isString(raw.company) ? raw.company : '',
    content: isString(raw.content) ? raw.content : '',
    imageUrl: isString(raw.imageUrl) ? raw.imageUrl : (isString(raw.imageurl) ? raw.imageurl : ''),
  };
};

const normalizeProjects = (projects: unknown[]): Project[] => projects.map(normalizeProject);
const normalizeSkills = (skills: unknown[]): Skill[] => skills.map(normalizeSkill);
const normalizeExperienceList = (experience: unknown[]): Experience[] => experience.map(normalizeExperience);

// ----------------------------------------------------
// PROJECTS CRUD
// ----------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getProjects supabase error:', error.message);
      throw error;
    }
    return normalizeProjects(data ?? []);
  }

  return normalizeProjects(getLocal<Project[]>('mostafasherif_projects', DEFAULT_PROJECTS))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function addProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  const normalizedProject = normalizeProject(project);
  const newProj: Project = {
    ...normalizedProject,
    id: `proj-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const dbProj = {
      ...newProj,
      images: JSON.stringify(newProj.images),
      tags: JSON.stringify(newProj.tags),
    };
    const { data, error } = await supabase
      .from('projects')
      .insert([dbProj])
      .select()
      .single();
    if (error) {
      console.error('addProject supabase error:', error.message);
      throw error;
    }
    await addLog('System', 'Add Project', `Project "${project.title}" created in Supabase.`);
    return normalizeProject(data);
  }

  const list = getLocal<Project[]>('mostafasherif_projects', DEFAULT_PROJECTS);
  list.push(newProj);
  setLocal('mostafasherif_projects', list);
  await addLog('System', 'Add Project', `Project "${project.title}" created in LocalStorage.`);
  return newProj;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const updatesWithImages: Partial<Project> = { ...updates };
  if (!Array.isArray(updatesWithImages.images) || updatesWithImages.images.length === 0) {
    if (typeof updatesWithImages.imageUrl === 'string' && updatesWithImages.imageUrl) {
      updatesWithImages.images = [updatesWithImages.imageUrl];
    }
  }
  if (!updatesWithImages.imageUrl && Array.isArray(updatesWithImages.images) && updatesWithImages.images.length > 0) {
    updatesWithImages.imageUrl = updatesWithImages.images[0];
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const dbUpdates: Record<string, unknown> = {
      ...updatesWithImages,
    };
    if (Array.isArray(updatesWithImages.images)) {
      dbUpdates.images = JSON.stringify(updatesWithImages.images);
    }
    if (Array.isArray(updatesWithImages.tags)) {
      dbUpdates.tags = JSON.stringify(updatesWithImages.tags);
    }
    const { data, error } = await supabase
      .from('projects')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('updateProject supabase error:', error.message);
      throw error;
    }
    await addLog('System', 'Update Project', `Project ID: ${id} updated in Supabase.`);
    return normalizeProject(data);
  }

  const list = getLocal<Project[]>('mostafasherif_projects', DEFAULT_PROJECTS);
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Project not found');

  const updatedProj = normalizeProject({ ...list[idx], ...updatesWithImages });
  list[idx] = updatedProj;
  setLocal('mostafasherif_projects', list);
  await addLog('System', 'Update Project', `Project "${updatedProj.title}" updated in LocalStorage.`);
  return updatedProj;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('deleteProject supabase error:', error.message);
      throw error;
    }
    await addLog('System', 'Delete Project', `Project ID: ${id} deleted from Supabase.`);
    return true;
  }

  const list = getLocal<Project[]>('mostafasherif_projects', DEFAULT_PROJECTS);
  const filtered = list.filter(p => p.id !== id);
  if (filtered.length === list.length) return false;
  setLocal('mostafasherif_projects', filtered);
  await addLog('System', 'Delete Project', `Project ID: ${id} deleted from LocalStorage.`);
  return true;
}

// ----------------------------------------------------
// SKILLS CRUD
// ----------------------------------------------------
export async function getSkills(): Promise<Skill[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('proficiency', { ascending: false });
    if (error) {
      console.error('getSkills supabase error:', error.message);
      throw error;
    }
    return (data ?? []).map(normalizeSkill);
  }
  return normalizeSkills(getLocal<Skill[]>('mostafasherif_skills', DEFAULT_SKILLS))
    .sort((a, b) => b.proficiency - a.proficiency);
}

export async function addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
  const newSkill: Skill = normalizeSkill({
    ...skill,
    id: `sk-${Date.now()}`,
  });

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const dbSkill = {
      id: newSkill.id,
      name: newSkill.name,
      category: newSkill.category,
      proficiency: newSkill.proficiency,
    };
    const { data, error } = await supabase
      .from('skills')
      .insert([dbSkill])
      .select()
      .single();
    if (error) {
      console.error('addSkill supabase error:', error.message);
      throw error;
    }
    return normalizeSkill(data);
  }

  const list = getLocal<Skill[]>('mostafasherif_skills', DEFAULT_SKILLS);
  list.push(newSkill);
  setLocal('mostafasherif_skills', list);
  return newSkill;
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const dbUpdates = { ...updates };
    const { data, error } = await supabase
      .from('skills')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('updateSkill supabase error:', error.message);
      throw error;
    }
    return normalizeSkill(data);
  }

  const list = getLocal<Skill[]>('mostafasherif_skills', DEFAULT_SKILLS);
  const idx = list.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Skill not found');

  const updatedSkill = normalizeSkill({ ...list[idx], ...updates });
  list[idx] = updatedSkill;
  setLocal('mostafasherif_skills', list);
  return updatedSkill;
}

export async function deleteSkill(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('deleteSkill supabase error:', error.message);
      throw error;
    }
    return true;
  }

  const list = getLocal<Skill[]>('mostafasherif_skills', DEFAULT_SKILLS);
  const filtered = list.filter(s => s.id !== id);
  if (filtered.length === list.length) return false;
  setLocal('mostafasherif_skills', filtered);
  return true;
}

// ----------------------------------------------------
// EXPERIENCE CRUD
// ----------------------------------------------------
export async function getExperience(): Promise<Experience[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('getExperience supabase error:', error.message);
      throw error;
    }
    return (data ?? []).map(normalizeExperience);
  }
  return normalizeExperienceList(getLocal<Experience[]>('mostafasherif_experience', DEFAULT_EXPERIENCE));
}

export async function addExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
  const newExp: Experience = normalizeExperience({
    ...exp,
    id: `exp-${Date.now()}`,
  });

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const parts = (newExp.duration ?? '').split('-').map(s => s.trim());
    const startdate = parts[0] || '';
    const enddate = parts[1] || '';

    const dbExp = {
      id: newExp.id,
      role: newExp.role,
      company: newExp.company,
      startdate,
      enddate,
      description: newExp.description,
    };

    const { data, error } = await supabase
      .from('experience')
      .insert([dbExp])
      .select()
      .single();
    if (error) {
      console.error('addExperience supabase error:', error.message);
      throw error;
    }
    return normalizeExperience(data);
  }

  const list = getLocal<Experience[]>('mostafasherif_experience', DEFAULT_EXPERIENCE);
  list.push(newExp);
  setLocal('mostafasherif_experience', list);
  return newExp;
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const dbUpdates: Record<string, unknown> = { ...updates };
    if (updates.duration !== undefined) {
      const parts = (updates.duration ?? '').split('-').map(s => s.trim());
      dbUpdates.startdate = parts[0] || '';
      dbUpdates.enddate = parts[1] || '';
      delete dbUpdates.duration;
    }
    const { data, error } = await supabase
      .from('experience')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('updateExperience supabase error:', error.message);
      throw error;
    }
    return normalizeExperience(data);
  }

  const list = getLocal<Experience[]>('mostafasherif_experience', DEFAULT_EXPERIENCE);
  const idx = list.findIndex(e => e.id === id);
  if (idx === -1) throw new Error('Experience not found');

  const updatedExp = normalizeExperience({ ...list[idx], ...updates });
  list[idx] = updatedExp;
  setLocal('mostafasherif_experience', list);
  return updatedExp;
}

export async function deleteExperience(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('deleteExperience supabase error:', error.message);
      throw error;
    }
    return true;
  }

  const list = getLocal<Experience[]>('mostafasherif_experience', DEFAULT_EXPERIENCE);
  const filtered = list.filter(e => e.id !== id);
  if (filtered.length === list.length) return false;
  setLocal('mostafasherif_experience', filtered);
  return true;
}

// ----------------------------------------------------
// TESTIMONIALS CRUD
// ----------------------------------------------------
export async function getTestimonials(): Promise<Testimonial[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('getTestimonials supabase error:', error.message);
      throw error;
    }
    return (data ?? []).map(normalizeTestimonial);
  }
  return getLocal<Testimonial[]>('mostafasherif_testimonials', DEFAULT_TESTIMONIALS).map(normalizeTestimonial);
}

export async function addTestimonial(test: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  const newTest: Testimonial = normalizeTestimonial({
    ...test,
    id: `test-${Date.now()}`,
  });

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const dbTest = {
      id: newTest.id,
      name: newTest.name,
      role: newTest.role,
      company: newTest.company,
      content: newTest.content,
      imageurl: newTest.imageUrl,
    };
    const { data, error } = await supabase
      .from('testimonials')
      .insert([dbTest])
      .select()
      .single();
    if (error) {
      console.error('addTestimonial supabase error:', error.message);
      throw error;
    }
    return normalizeTestimonial(data);
  }

  const list = getLocal<Testimonial[]>('mostafasherif_testimonials', DEFAULT_TESTIMONIALS);
  list.push(newTest);
  setLocal('mostafasherif_testimonials', list);
  return newTest;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const dbUpdates: Record<string, unknown> = { ...updates };
    if (updates.imageUrl !== undefined) {
      dbUpdates.imageurl = updates.imageUrl;
      delete dbUpdates.imageUrl;
    }
    const { data, error } = await supabase
      .from('testimonials')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('updateTestimonial supabase error:', error.message);
      throw error;
    }
    return normalizeTestimonial(data);
  }

  const list = getLocal<Testimonial[]>('mostafasherif_testimonials', DEFAULT_TESTIMONIALS);
  const idx = list.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Testimonial not found');

  const updatedTest = { ...list[idx], ...updates };
  list[idx] = updatedTest;
  setLocal('mostafasherif_testimonials', list);
  return updatedTest;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('deleteTestimonial supabase error:', error.message);
      throw error;
    }
    return true;
  }

  const list = getLocal<Testimonial[]>('mostafasherif_testimonials', DEFAULT_TESTIMONIALS);
  const filtered = list.filter(t => t.id !== id);
  if (filtered.length === list.length) return false;
  setLocal('mostafasherif_testimonials', filtered);
  return true;
}

// ----------------------------------------------------
// SITE SETTINGS
// ----------------------------------------------------
export async function getSettings(): Promise<SiteSettings> {
  const localSettings = getLocal<SiteSettings>('mostafasherif_settings', DEFAULT_SETTINGS);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    if (error) {
      console.error('getSettings supabase error:', error.message);
      throw error;
    }
    return {
      contactEmail: isString(data.email) ? data.email : localSettings.contactEmail,
      contactPhone: isString(data.phone) ? data.phone : localSettings.contactPhone,
      contactLocation: isString(data.location) ? data.location : localSettings.contactLocation,
      socialBehance: isString(data.behance) ? data.behance : localSettings.socialBehance,
      socialInstagram: isString(data.instagram) ? data.instagram : localSettings.socialInstagram,
      socialLinkedin: isString(data.linkedin) ? data.linkedin : localSettings.socialLinkedin,
      enableWatermark: localSettings.enableWatermark,
      watermarkText: localSettings.watermarkText,
      enableImageProtection: localSettings.enableImageProtection,
    };
  }
  return localSettings;
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const currentLocal = getLocal<SiteSettings>('mostafasherif_settings', DEFAULT_SETTINGS);
  const updatedLocal = { ...currentLocal, ...updates };
  setLocal('mostafasherif_settings', updatedLocal);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const dbUpdates: Record<string, unknown> = {};
    if (updates.contactEmail !== undefined) dbUpdates.email = updates.contactEmail;
    if (updates.contactPhone !== undefined) dbUpdates.phone = updates.contactPhone;
    if (updates.contactLocation !== undefined) dbUpdates.location = updates.contactLocation;
    if (updates.socialBehance !== undefined) dbUpdates.behance = updates.socialBehance;
    if (updates.socialInstagram !== undefined) dbUpdates.instagram = updates.socialInstagram;
    if (updates.socialLinkedin !== undefined) dbUpdates.linkedin = updates.socialLinkedin;

    const { data, error } = await supabase
      .from('settings')
      .update(dbUpdates)
      .eq('id', 1)
      .select()
      .single();
    if (error) {
      console.error('updateSettings supabase error:', error.message);
      throw error;
    }
    await addLog('System', 'Update Settings', 'Site settings updated in Supabase.');
    return {
      contactEmail: data.email ?? updatedLocal.contactEmail,
      contactPhone: data.phone ?? updatedLocal.contactPhone,
      contactLocation: data.location ?? updatedLocal.contactLocation,
      socialBehance: data.behance ?? updatedLocal.socialBehance,
      socialInstagram: data.instagram ?? updatedLocal.socialInstagram,
      socialLinkedin: data.linkedin ?? updatedLocal.socialLinkedin,
      enableWatermark: updatedLocal.enableWatermark,
      watermarkText: updatedLocal.watermarkText,
      enableImageProtection: updatedLocal.enableImageProtection,
    };
  }

  await addLog('System', 'Update Settings', 'Site settings updated in LocalStorage.');
  return updatedLocal;
}

// ----------------------------------------------------
// ACTIVITY LOGS
// ----------------------------------------------------
export async function getLogs(): Promise<ActivityLog[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) {
      console.error('getLogs supabase error:', error.message);
      throw error;
    }
    return (data ?? []) as ActivityLog[];
  }
  return getLocal<ActivityLog[]>('mostafasherif_logs', INITIAL_LOGS)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function addLog(userEmail: string, action: string, details: string): Promise<ActivityLog> {
  const newLog: ActivityLog = {
    id: `log-${Date.now()}`,
    user_email: userEmail,
    action,
    details,
    timestamp: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('activity_logs').insert([newLog]);
    if (error) {
      console.error('addLog supabase error:', error.message);
      throw error;
    }
  }

  const logs = getLocal<ActivityLog[]>('mostafasherif_logs', INITIAL_LOGS);
  logs.push(newLog);
  setLocal('mostafasherif_logs', logs.slice(0, 100)); // Limit to last 100 logs
  return newLog;
}
