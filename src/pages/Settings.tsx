import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Shield, 
  Code, 
  Layout, 
  Save, 
  CheckCircle2, 
  Trash2,
  Plus,
  Monitor,
  Zap,
  Globe,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('templates');

  const tabs = [
    { id: 'templates', label: 'Message Templates', icon: Layout },
    { id: 'connections', label: 'API Connections', icon: Globe },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="text-4xl font-serif italic font-black">System <span className="text-[var(--color-brand-primary)] not-italic tracking-tighter">Control</span></h2>
        <p className="text-white/40 mt-2 font-mono text-xs uppercase tracking-widest">GLOBAL CONFIGURATION & OUTREACH PRESETS</p>
      </div>

      <div className="flex border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-all relative
              ${activeTab === tab.id ? 'text-[var(--color-brand-primary)]' : 'text-white/30 hover:text-white'}
            `}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-brand-primary)] glow-orange"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-bold">Email & WhatsApp Templates</h4>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 text-[var(--color-brand-primary)]">
                  <Plus size={14} />
                  CREATE NEW
                </button>
              </div>

              {[
                { name: 'Initial Outreach (Agency Focus)', type: 'Email', subject: 'Collaboration Idea for {company_name}', body: 'Hey {name}, I saw your work at {company_name} and thought...' },
                { name: 'Quick WA Follow-up', type: 'WhatsApp', subject: '-', body: 'Hey {name}, just checking if you saw my email about the development partnership!' },
                { name: 'Technical Portfolio Deep-dive', type: 'Email', subject: 'Web Dev capabilities for {company_name}', body: 'I noticed {company_name} focuses on SaaS products. Here is how I can help...' },
              ].map((template, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border
                        ${template.type === 'Email' ? 'text-blue-400 border-blue-400/20 bg-blue-400/5' : 'text-green-400 border-green-400/20 bg-green-400/5'}
                       `}>
                         {template.type}
                       </span>
                       <h5 className="font-bold text-sm">{template.name}</h5>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"><monitor size={16}/></button>
                       <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-red-400 transition-all"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {template.subject !== '-' && (
                       <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                          <p className="text-[10px] font-mono text-white/20 uppercase mb-1">Subject</p>
                          <p className="text-xs italic text-[var(--color-brand-primary)]">{template.subject}</p>
                       </div>
                    )}
                    <div className="bg-black/40 rounded-lg p-4 border border-white/5">
                       <p className="text-[10px] font-mono text-white/20 uppercase mb-2">Message Body</p>
                       <p className="text-xs text-white/60 leading-relaxed">{template.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                      <Mail size={24} />
                    </div>
                    <h4 className="font-bold">Email Integration</h4>
                  </div>
                  <p className="text-xs text-white/50">Connect your SMTP or Gmail account for automated bulk mailing.</p>
                  <div className="space-y-4">
                    <input type="text" placeholder="SMTP Host" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-[var(--color-brand-primary)] transition-all" />
                    <input type="text" placeholder="Port" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-[var(--color-brand-primary)] transition-all" />
                    <input type="email" placeholder="Email Address" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-[var(--color-brand-primary)] transition-all" />
                    <input type="password" placeholder="Password / App Key" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-[var(--color-brand-primary)] transition-all" />
                  </div>
                  <button className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                    <Shield size={16} />
                    VERIFY CONNECTION
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/10 rounded-2xl text-green-400">
                      <MessageSquare size={24} />
                    </div>
                    <h4 className="font-bold">WhatsApp Cloud API</h4>
                  </div>
                  <p className="text-xs text-white/50">Connect via WhatsApp Business Cloud API or Twilio for messages.</p>
                  <div className="space-y-4">
                    <input type="text" placeholder="Phone Number ID" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-[var(--color-brand-primary)] transition-all" />
                    <input type="text" placeholder="Access Token" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-[var(--color-brand-primary)] transition-all" />
                    <div className="p-4 bg-orange-400/5 border border-orange-400/10 rounded-xl">
                       <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mb-1 font-mono">SANDBOX MODE</p>
                       <p className="text-[10px] text-white/40">Use +1 345 555 0199 for testing sequences before production.</p>
                    </div>
                  </div>
                  <button className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                    <Shield size={16} />
                    LINK ACCOUNT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
             <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Outreach Rules</h4>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <div className="space-y-1">
                      <p className="text-sm font-bold">Daily Limit</p>
                      <p className="text-[10px] text-white/30 uppercase font-mono">Max emails sent per node</p>
                   </div>
                   <span className="text-sm font-mono text-[var(--color-brand-primary)]">250</span>
                </div>
                <div className="flex justify-between items-center">
                   <div className="space-y-1">
                      <p className="text-sm font-bold">Smart Delay</p>
                      <p className="text-[10px] text-white/30 uppercase font-mono">Randomized inter-node wait</p>
                   </div>
                   <div className="w-10 h-5 bg-green-500/20 border border-green-500/40 rounded-full relative p-0.5">
                      <div className="w-4 h-4 bg-green-400 rounded-full ml-auto" />
                   </div>
                </div>
                <div className="flex justify-between items-center">
                   <div className="space-y-1">
                      <p className="text-sm font-bold">Open Tracking</p>
                      <p className="text-[10px] text-white/30 uppercase font-mono">Pixel-based node monitoring</p>
                   </div>
                   <div className="w-10 h-5 bg-green-500/20 border border-green-500/40 rounded-full relative p-0.5">
                      <div className="w-4 h-4 bg-green-400 rounded-full ml-auto" />
                   </div>
                </div>
             </div>
             <button className="w-full py-3 bg-[var(--color-brand-primary)] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(242,125,38,0.3)] transition-all">
                <Save size={16} />
                SAVE GLOBAL RULES
             </button>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-3xl p-8 space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-brand-primary)]">
               <Shield size={24} />
             </div>
             <h4 className="font-bold">Privacy & Data</h4>
             <p className="text-xs text-white/40 leading-relaxed">
               All lead data is encrypted at rest. Node interactions are purged every 30 days unless archived.
             </p>
             <button className="text-xs font-bold text-white/60 hover:text-white transition-all">DOWNLOAD ARCHIVE</button>
          </div>
        </div>
      </div>
    </div>
  );
}
