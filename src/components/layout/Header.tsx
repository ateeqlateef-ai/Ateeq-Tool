import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 border-b border-[var(--color-brand-line)] flex items-center justify-between px-8 bg-[var(--color-brand-bg)]/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[var(--color-brand-primary)] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search leads, campaigns, or actions..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--color-brand-primary)]/50 focus:ring-4 focus:ring-[var(--color-brand-primary)]/5 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-brand-primary)] rounded-full border-2 border-[var(--color-brand-bg)]" />
        </button>
        <div className="h-8 w-[1px] bg-white/10 mx-2" />
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none">Ateeq User</p>
            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">Pro Developer</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-[var(--color-brand-primary)]/50 transition-all">
             <User size={20} className="text-white/40" />
          </div>
        </div>
      </div>
    </header>
  );
}
