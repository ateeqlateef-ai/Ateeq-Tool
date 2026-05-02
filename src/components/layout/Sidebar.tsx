import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Clock, 
  Settings, 
  Send,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/finder', label: 'Lead Finder', icon: Search },
  { path: '/leads', label: 'My Leads', icon: Users },
  { path: '/follow-ups', label: 'Follow-ups', icon: Clock },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-[var(--color-brand-line)] flex flex-col h-screen sticky top-0 bg-[var(--color-brand-bg)] hidden md:flex">
      <div className="p-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-[var(--color-brand-primary)] rounded-lg flex items-center justify-center glow-orange">
            <Zap className="text-black fill-black" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ATEEQ</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">Outreach OS</p>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item, idx) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-[var(--color-brand-primary)] text-black font-semibold' 
                : 'text-white/60 hover:text-white hover:bg-white/5'}
            `}
          >
            <item.icon size={20} />
            <span className="text-sm">{item.label}</span>
            {item.path === '/finder' && (
              <span className="ml-auto bg-[var(--color-brand-primary)]/20 text-[var(--color-brand-primary)] text-[10px] px-2 py-0.5 rounded-full font-mono font-bold group-[.text-black]:bg-black/10 group-[.text-black]:text-black">
                NEW
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-white/50 tracking-wider">SYSTEM ACTIVE</span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Ready for outreach. <br/>
            <span className="text-[var(--color-brand-primary)]">124 leads found</span> today.
          </p>
        </div>
      </div>
    </aside>
  );
}
