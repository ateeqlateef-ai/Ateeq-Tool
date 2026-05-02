import React from 'react';
import { 
  Clock, 
  Calendar, 
  Mail, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';

const pendingActions = [
  { company: 'Nexus Digital', type: 'Email', subject: 'Follow-up #1', due: 'In 2 Hours', tone: 'Professional', priority: 'High' },
  { company: 'CloudScale AI', type: 'WhatsApp', subject: 'Bump Portfolio', due: 'In 5 Hours', tone: 'Friendly', priority: 'Medium' },
  { company: 'FinTech Flow', type: 'Email', subject: 'Case Study Follow-up', due: 'Tomorrow', tone: 'Technical', priority: 'High' },
  { company: 'GreenLeaf Marketing', type: 'Email', subject: 'Intro Follow-up', due: 'Tomorrow', tone: 'Casual', priority: 'Low' },
  { company: 'Spark Analytics', type: 'WhatsApp', subject: 'Checking In', due: '2 Days', tone: 'Short', priority: 'Medium' },
];

export default function FollowUps() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic font-black">Follow-up <span className="text-[var(--color-brand-primary)] not-italic tracking-tighter">Queue</span></h2>
          <p className="text-white/40 mt-2 font-mono text-xs uppercase tracking-widest">AUTOMATED RETENTION & CONVERSION SEQUENCES</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
            <Calendar size={16} />
            VIEW SCHEDULE
          </button>
          <div className="p-0.5 bg-gradient-to-r from-[var(--color-brand-primary)] to-orange-600 rounded-xl">
             <button className="flex items-center gap-2 px-5 py-2 bg-[var(--color-brand-bg)] rounded-[11px] text-xs font-bold hover:bg-transparent transition-all">
               <Zap size={16} fill="currentColor" className="text-[var(--color-brand-primary)]" />
               START AUTO-PILOT
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-4">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Priority Tasks</h4>
             <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase tracking-widest bg-green-400/10 px-2 py-1 rounded">
               <CheckCircle2 size={12} />
               12 Completed Today
             </div>
          </div>
          
          <div className="space-y-3">
            {pendingActions.map((task, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 group hover:border-[var(--color-brand-primary)]/50 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs
                    ${task.type === 'Email' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}
                  `}>
                    {task.type === 'Email' ? <Mail size={20} /> : <MessageSquare size={20} />}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{task.company}</h5>
                    <div className="flex items-center gap-3 text-[10px] text-white/40 font-mono mt-1 uppercase">
                      <span className="flex items-center gap-1"><Clock size={10} /> DUE {task.due}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="flex items-center gap-1 font-bold italic">{task.subject}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                     <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">TONE</p>
                     <p className="text-xs font-mono text-white/60">{task.tone}</p>
                  </div>
                  <button className="flex items-center gap-2 bg-[var(--color-brand-primary)] text-black px-4 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-all">
                    SEND NOW
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
             <div className="flex items-center gap-3 mb-2">
                 <AlertCircle size={20} className="text-orange-400" />
                 <h4 className="font-bold text-lg">Follow-up Logic</h4>
             </div>
             <p className="text-xs text-white/50 leading-relaxed font-mono">
               System detected <span className="text-[var(--color-brand-primary)]">3 responders</span> who haven't moved to "Converted" yet. Suggesting immediate technical deep-dive follow-up.
             </p>
             <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold text-white/30">Auto-Delay</span>
                   <span className="text-[10px] font-bold text-[var(--color-brand-primary)]">48 HOURS</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full">
                   <div className="w-2/3 h-full bg-[var(--color-brand-primary)] rounded-full" />
                </div>
                <p className="text-[9px] text-white/20 italic text-center">SEQUENCE PAUSED FOR WEEKEND NODES</p>
             </div>
             <button className="w-full py-3 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-all">
                CONFIGURE TRIGGERS
             </button>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 rounded-3xl p-8 overflow-hidden relative group">
             <div className="relative z-10">
               <h4 className="text-xl font-serif italic mb-4">Daily Insights</h4>
               <ul className="space-y-4">
                 {[
                   { label: 'Highest Reply Rate', value: 'Technical Tone', icon: Zap },
                   { label: 'Optimal Send Time', value: '10:00 AM EST', icon: Clock },
                   { label: 'Best Channel', value: 'WhatsApp', icon: MessageSquare },
                 ].map((insight, idx) => (
                   <li key={idx} className="flex items-center gap-3">
                     <div className="p-2 bg-[var(--color-brand-primary)]/10 rounded-lg">
                       <insight.icon size={14} className="text-[var(--color-brand-primary)]" />
                     </div>
                     <div>
                       <p className="text-[9px] text-white/30 uppercase tracking-widest">{insight.label}</p>
                       <p className="text-xs font-bold text-white/80">{insight.value}</p>
                     </div>
                   </li>
                 ))}
               </ul>
             </div>
             <ArrowUpRight className="absolute -top-4 -right-4 w-24 h-24 text-[var(--color-brand-primary)]/5 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
