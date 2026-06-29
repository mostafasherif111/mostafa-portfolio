'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getProjects,
  getSkills,
  getTestimonials,
  getExperience,
  getLogs,
  getMessages,
  initLocalStorage,
} from '@/services/db';
import { FolderOpen, Award, Briefcase, MessageSquare, Activity, TrendingUp, Eye, Clock } from 'lucide-react';
import type { ActivityLog, Message } from '@/services/db.types';

export default function AdminOverview() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, experience: 0, testimonials: 0 });
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
  initLocalStorage();

  Promise.all([
    getProjects(),
    getSkills(),
    getExperience(),
    getTestimonials(),
    getLogs(),
    getMessages(),
  ])
    .then(([p, sk, ex, t, l, m]) => {
      console.log("Messages:", m);

      setStats({
        projects: p.length,
        skills: sk.length,
        experience: ex.length,
        testimonials: t.length,
      });

      setLogs(l.slice(0, 8));
      setMessagesCount(m.length);
      setMessages(m.slice(0, 5));
    })
    .catch((err) => {
      console.error("Promise.all failed:", err);
    });
}, []);

  const cards = [
  { label: 'Total Projects', value: stats.projects, icon: FolderOpen, color: '#10b981' },
  { label: 'Skills Listed', value: stats.skills, icon: Award, color: '#3b82f6' },
  { label: 'Experience Entries', value: stats.experience, icon: Briefcase, color: '#8b5cf6' },
  { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, color: '#f59e0b' },
  { label: 'Messages', value: messagesCount, icon: MessageSquare, color: '#ef4444' },
];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
          Dashboard Overview
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Welcome back! Here&apos;s a summary of your portfolio content.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-panel rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 4px 24px ${color}22`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18` }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none"
                style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
            Quick Actions
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Add Project', href: '/admin/projects', icon: FolderOpen },
            { label: 'Edit Skills', href: '/admin/skills', icon: Award },
            { label: 'View Logs', href: '/admin/logs', icon: Activity },
          ].map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{ background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--foreground)', fontFamily: 'var(--font-poppins)' }}>
              <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              {label}
            </Link>
          ))}
        </div>
      </div>
      {/* Latest Messages */}
<div className="glass-panel rounded-2xl p-6">
  <div className="flex items-center gap-2 mb-5">
    <MessageSquare
      className="w-4 h-4"
      style={{ color: 'var(--primary)' }}
    />
    <h2
      className="font-semibold text-sm"
      style={{
        fontFamily: 'var(--font-poppins)',
        color: 'var(--foreground)',
      }}
    >
      Latest Messages
    </h2>
  </div>

  {messages.length === 0 ? (
    <p
      className="text-sm"
      style={{ color: 'var(--text-muted)' }}
    >
      No messages yet.
    </p>
  ) : (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="border rounded-xl p-4"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="font-semibold"
              style={{ color: 'var(--foreground)' }}
            >
              {msg.name}
            </h3>

            {!msg.is_read && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                New
              </span>
            )}
          </div>

          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {msg.subject}
          </p>

          <p
            className="text-xs mt-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {msg.email}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

      {/* Recent activity */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
            Recent Activity
          </h2>
        </div>
        <div className="space-y-3">
          {logs.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No activity yet.</p>
          )}
          {logs.map(log => (
            <div key={log.id} className="flex items-start gap-3 py-2.5 border-b last:border-b-0"
              style={{ borderColor: 'var(--card-border)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'var(--emerald-glow)' }}>
                <Eye className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-poppins)' }}>
                  {log.action}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{log.details}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <Clock className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
