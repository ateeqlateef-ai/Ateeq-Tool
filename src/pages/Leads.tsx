import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  MessageSquare, 
  Trash2,
  ExternalLink,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Download,
  AlertCircle,
  Database
} from 'lucide-react';
import { motion } from 'motion/react';
import { Lead, LeadStatus } from '../types';
import ExcelUpload from '../components/ExcelUpload';
import OutreachModal from '../components/OutreachModal';
import AddLeadModal from '../components/AddLeadModal';
import { leadService } from '../services/leadService';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'All'>('All');

  // Modal State
  const [outreachModal, setOutreachModal] = useState<{
    show: boolean;
    lead: Lead | null;
    type: 'email' | 'whatsapp';
  }>({ show: false, lead: null, type: 'email' });

  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = leadService.subscribeToLeads((data) => {
      setLeads(data);
      setLoading(false);
      setError(null);
    });
    
    return () => unsubscribe();
  }, []);

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadService.deleteLead(id);
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete lead from Firestore.");
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = (l.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (l.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || l.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case LeadStatus.CONTACTED: return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case LeadStatus.REPLIED: return 'bg-green-500/10 text-green-400 border-green-500/20';
      case LeadStatus.CONVERTED: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic font-black">Lead <span className="text-[var(--color-brand-primary)] not-italic tracking-tighter">Inventory</span></h2>
          <p className="text-white/40 mt-2 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <Users size={12} />
            PROSPECT DATABASE & OUTREACH HUB
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-xl mr-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[9px] font-mono text-white/40 uppercase">Email: ateeq05@yahoo.com</span>
             </div>
             <div className="w-[1px] h-3 bg-white/10" />
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[9px] font-mono text-white/40 uppercase">WA: +923131822218</span>
             </div>
          </div>
          <ExcelUpload onSuccess={() => {}} />
          <button 
            onClick={() => setAddLeadModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-brand-primary)] text-black rounded-xl text-xs font-bold hover:scale-105 transition-all"
          >
            <Plus size={16} />
            ADD MANUAL
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by company, email, or niche..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-[var(--color-brand-primary)] outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1 overflow-x-auto">
          {['All', ...Object.values(LeadStatus)].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap
                ${filterStatus === status 
                  ? 'bg-[var(--color-brand-primary)] text-black shadow-lg shadow-[var(--color-brand-primary)]/20' 
                  : 'text-white/40 hover:text-white'}
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 font-mono">
                <th className="px-8 py-5">Company & Lead</th>
                <th className="px-8 py-5">Niche</th>
                <th className="px-8 py-5">Contact Details</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-10 bg-white/5 opacity-20" />
                  </tr>
                ))
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-white/20 italic">
                    <div className="flex flex-col items-center gap-4">
                      <Database size={48} className="opacity-10" />
                      <p>No leads found. Upload an Excel file to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <h4 className="font-bold text-sm group-hover:text-[var(--color-brand-primary)] transition-colors">{lead.companyName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {lead.website && (
                          <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="text-white/40 text-[10px] flex items-center gap-1 hover:text-white transition-all">
                            Website <ExternalLink size={10} />
                          </a>
                        )}
                        {lead.specialization && <span className="text-[10px] text-white/20">•</span>}
                        <span className="text-[10px] text-white/40">{lead.city}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded border border-white/10 text-white/60">
                      {lead.specialization || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-medium">{lead.email || 'No Email'}</p>
                      <p className="text-[10px] text-white/40 font-mono tracking-tight">{lead.phone || 'No Phone'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => setOutreachModal({ show: true, lead, type: 'email' })}
                         className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] transition-all group/btn" 
                         title="Send Email"
                       >
                         <Mail size={16} />
                       </button>
                       <button 
                         onClick={() => setOutreachModal({ show: true, lead, type: 'whatsapp' })}
                         className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:border-green-400 hover:text-green-400 transition-all group/btn" 
                         title="Send WhatsApp"
                       >
                         <MessageSquare size={16} />
                       </button>
                       <div className="h-4 w-[1px] bg-white/10 mx-1" />
                       <button 
                         onClick={() => deleteLead(lead.id)}
                         className="p-2.5 rounded-xl hover:bg-white/5 text-white/30 hover:text-red-500 transition-all"
                         title="Delete Lead"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filteredLeads.length > 0 && (
          <div className="p-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
            <span>SHOWING {filteredLeads.length} OF {leads.length} TOTAL PROSPECT NODES</span>
            <div className="flex gap-4">
               <button className="hover:text-white transition-colors">PREVIOUS</button>
               <button className="text-white hover:text-[var(--color-brand-primary)]">1</button>
               <button className="hover:text-white transition-colors">NEXT</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <OutreachModal 
        show={outreachModal.show}
        lead={outreachModal.lead}
        type={outreachModal.type}
        onClose={() => setOutreachModal({ ...outreachModal, show: false })}
        onSuccess={() => {}}
      />

      <AddLeadModal 
        show={addLeadModalOpen}
        onClose={() => setAddLeadModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
