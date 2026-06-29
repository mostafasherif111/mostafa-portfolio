import { Project, Skill, Experience, Testimonial, SiteSettings, ActivityLog } from './db.types';

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Vision X Brand Identity',
    description: 'A complete branding overhaul for Vision X creative agency, focusing on modern minimalist typography, dark mode aesthetics, and professional Emerald Green branding system.',
    category: 'Branding',
    images: ['https://images.unsplash.com/photo-1561070791-26c113006238?w=800&auto=format&fit=crop&q=80'],
    tags: ['Brand Strategy', 'Logo Design', 'Visual Guidelines', 'Adobe Illustrator'],
    link: 'https://behance.net',
    created_at: '2026-01-10T12:00:00Z'
  },
  {
    id: 'proj-2',
    title: 'EduCreators Social Campaign',
    description: 'High-impact social media designs and promotional thumbnails crafted for prominent online educators. Increased click-through rates by 24% and visual engagement by 40%.',
    category: 'Social Media Design',
    images: ['https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80'],
    tags: ['Social Media Graphics', 'Thumbnails', 'Content Strategy', 'Adobe Photoshop'],
    link: 'https://behance.net',
    created_at: '2026-02-15T12:00:00Z'
  },
  {
    id: 'proj-3',
    title: 'Echoes of Tomorrow Poster Series',
    description: 'A series of futuristic sci-fi event posters blending AI-assisted visual generation tools with advanced compositing techniques in Photoshop.',
    category: 'Posters',
    images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80'],
    tags: ['Digital Art', 'Posters', 'Creative Direction', 'Photoshop'],
    link: 'https://behance.net',
    created_at: '2026-03-01T12:00:00Z'
  },
  {
    id: 'proj-4',
    title: 'Premium Tech YT Thumbnails',
    description: 'High-contrast, click-optimized custom YouTube thumbnails designed for tech creators, featuring rich lighting effects, 3D assets, and precise color grading.',
    category: 'Thumbnails',
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'],
    tags: ['Thumbnail Design', 'Visual Hierarchy', 'Photoshop', 'Color Grading'],
    link: 'https://behance.net',
    created_at: '2026-04-12T12:00:00Z'
  },
  {
    id: 'proj-5',
    title: 'Visionary Journal Print Edition',
    description: 'A beautifully structured editorial layout and print design for BrainX organization, utilizing premium paper stocks, spot UV detailing, and high-impact layouts.',
    category: 'Print Design',
    images: ['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80'],
    tags: ['Editorial Design', 'Print Collateral', 'Layout Typography', 'Adobe Illustrator'],
    link: 'https://behance.net',
    created_at: '2026-05-05T12:00:00Z'
  },
  {
    id: 'proj-6',
    title: 'Cairo SCIVerse Launch Campaign',
    description: 'A multi-channel digital advertising campaign for Cairo SCIVerse, featuring high-quality social graphics, flyers, promotional video assets, and uniform branding.',
    category: 'Advertising Campaigns',
    images: ['https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&auto=format&fit=crop&q=80'],
    tags: ['Marketing Strategy', 'Advertising Graphics', 'Creative Leadership', 'Premiere Pro'],
    link: 'https://behance.net',
    created_at: '2026-06-01T12:00:00Z'
  }
];

export const DEFAULT_SKILLS: Skill[] = [
  { id: 'sk-1', name: 'Adobe Photoshop', category: 'design', proficiency: 95 },
  { id: 'sk-2', name: 'Adobe Illustrator', category: 'design', proficiency: 90 },
  { id: 'sk-3', name: 'Premiere Pro', category: 'design', proficiency: 85 },
  { id: 'sk-4', name: 'After Effects', category: 'design', proficiency: 80 },
  { id: 'sk-5', name: 'Branding', category: 'design', proficiency: 92 },
  { id: 'sk-6', name: 'Social Media Design', category: 'design', proficiency: 95 },
  { id: 'sk-7', name: 'Thumbnail Design', category: 'design', proficiency: 98 },
  { id: 'sk-8', name: 'Print Design', category: 'design', proficiency: 88 },
  { id: 'sk-9', name: 'Visual Identity Design', category: 'design', proficiency: 92 },
  { id: 'sk-10', name: 'HTML & CSS', category: 'technical', proficiency: 75 },
  { id: 'sk-11', name: 'AI Design Tools (Midjourney, Stable Diffusion)', category: 'technical', proficiency: 88 }
];

export const DEFAULT_EXPERIENCE: Experience[] = [
  {
    id: 'exp-1',
    role: 'Founder & Lead Designer',
    company: 'Vision X',
    duration: '2023 - Present',
    description: [
      'Established Vision X design agency delivering premium branding, digital advertising, and high-impact visual identity solutions for digital creators, educators, and local businesses.',
      'Managed end-to-end design lifecycles, leading design strategy and creative direction for 20+ clients.',
      'Optimized creative workflows by integrating advanced generative AI tools and custom automation tools.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Freelance Graphic Designer',
    company: 'Self-employed',
    duration: '2020 - Present',
    description: [
      'Delivered 100+ bespoke visual communication projects including branding packages, custom presentation layouts, and print-ready graphic assets.',
      'Collaborated closely with educators and creators to develop click-optimized YouTube thumbnails and high-retention social media carousels.',
      'Maintained 100% on-time project delivery, fostering long-term relationships and high client satisfaction rates.'
    ]
  },
  {
    id: 'exp-3',
    role: 'Media Team Leader',
    company: 'BrainX',
    duration: '2022 - 2024',
    description: [
      'Directed a media team of 10+ designers, video editors, and content writers, aligning creative output with organizational goals.',
      'Oversaw visual guidelines across multiple social networks, standardizing typography, assets, and design grids.',
      'Planned and executed media coverage and promotional visuals for prominent regional events.'
    ]
  },
  {
    id: 'exp-4',
    role: 'Media Team Leader',
    company: 'Cairo SCIVerse',
    duration: '2022 - 2023',
    description: [
      'Spearheaded media assets and brand direction for Cairo SCIVerse campaign, increasing user reach and event registrations.',
      'Designed high-end marketing flyers, social media content calendars, and interactive visual aids for science communication projects.'
    ]
  },
  {
    id: 'exp-5',
    role: 'AI Delegate',
    company: 'SBS',
    duration: '2024',
    description: [
      'Presented findings and conducted workshops on the application of generative AI inside modern graphic design pipelines.',
      'Researched and integrated custom workflows utilizing AI models for layout generation and asset upscaling.'
    ]
  }
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Sarah Kamel',
    role: 'Founder & Lead Educator',
    company: 'EduAcademy',
    content: 'Mostafa transformed our educational brand completely. His designs for our social channels and landing pages brought a level of professionalism we had never seen before. Our student enrollment increased by 30% after launching the new visual identity.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'test-2',
    name: 'Omar Sherif',
    role: 'Creative Director',
    company: 'CreatorFlow Labs',
    content: 'Mostafa has an incredible eye for click-optimized thumbnail designs. He understands visual hierarchy and color harmony in a way that directly correlates to higher CTR. His work on our branding guidelines was flawless.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'test-3',
    name: 'Youssef El-Hadi',
    role: 'Operations Lead',
    company: 'LocalBite Ventures',
    content: 'Working with Vision X was an absolute game changer. Mostafa took our brand concept and turned it into an agency-level package. His knowledge of print standards and digital media layout saved us weeks of formatting.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const DEFAULT_SETTINGS: SiteSettings = {
  contactEmail: 'ms0400123@gmail.com',
  contactPhone: '+20 1122441064',
  contactLocation: 'Cairo, Egypt',
  socialBehance: 'https://behance.net',
  socialInstagram: 'https://instagram.com',
  socialLinkedin: 'https://linkedin.com',
  enableWatermark: true,
  watermarkText: '© Mostafa Sherif',
  enableImageProtection: true
};

export const MOCK_USERS = [
  { email: 'admin@mostafasherif.com', role: 'super_admin', password: 'mostafasherif', name: 'Super Admin' },
  { email: 'editor@mostafasherif.com', role: 'editor', password: 'editor123', name: 'Editor Agent' },
  { email: 'viewer@mostafasherif.com', role: 'viewer', password: 'viewer123', name: 'Guest Viewer' }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    user_email: 'admin@mostafasherif.com',
    action: 'System Initialized',
    details: 'Initial mockup database and site state seeded successfully in LocalStorage.',
    timestamp: '2026-06-19T14:00:00Z'
  }
];
