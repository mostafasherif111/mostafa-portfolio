export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  imageUrl?: string;
  tags: string[];
  link?: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'design' | 'technical' | 'marketing' | 'other';
  proficiency: number; // 0 to 100
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  imageUrl?: string;
}

export interface SiteSettings {
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  socialBehance: string;
  socialInstagram: string;
  socialLinkedin: string;
  enableWatermark: boolean;
  watermarkText: string;
  enableImageProtection: boolean;
}

export interface UserSession {
  email: string;
  role: 'super_admin' | 'editor' | 'viewer';
  name: string;
  token?: string;
}

export interface ActivityLog {
  id: string;
  user_email: string;
  action: string;
  details: string;
  timestamp: string;
}
