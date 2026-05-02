import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Globe, 
  Zap, 
  Loader2, 
  Building2, 
  Mail, 
  Phone, 
  Linkedin, 
  Instagram,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

interface FinderLead {
  companyName: string;
  city: string;
  website: string;
  email: string;
  phone: string;
  linkedIn: string;
  instagram: string;
  specialization: string;
}

const getAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({ apiKey: key });
};

export default function LeadFinder() {
  const [niche, setNiche] = useState('Web Development Agencies');
  const [city, setCity] = useState('New York');
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<FinderLead[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const aiInstance = getAI();
    if (!aiInstance) {
      alert("Please configure your GEMINI_API_KEY in the Secrets panel.");
      return;
    }
    setLoading(true);
    setLeads([]);

    try {
      const prompt = `Generate a JSON list of 10 realistic (but fake) high-quality lead entries for ${niche} specifically in ${city}, USA. 
      Target: Full Stack Web Development agencies, SaaS companies, or Digital Marketing firms.
      Ensure the data looks very professional.
      
      Schema:
      - companyName: string
      - city: string
      - website: string
      - email: string
      - phone: string
      - linkedIn: string
      - instagram: string
      - specialization: string`;

      const response = await aiInstance.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                companyName: { type: Type.STRING },
                city: { type: Type.STRING },
                website: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                linkedIn: { type: Type.STRING },
                instagram: { type: Type.STRING },
                specialization: { type: Type.STRING },
              },
              required: ["companyName", "city", "website", "email", "phone", "linkedIn", "instagram", "specialization"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      setLeads(data);
    } catch (err) {
      console.error("AI Generation Error:", err);
      alert("AI Search failed. Using local fallback.");
      // Fallback
      fetch('/api/leads/sample')
        .then(res => res.json())
        .then(data => setLeads(data.slice(0, 5)));
    } finally {
      setLoading(false);
    }
  };

  const saveLead = async (lead: FinderLead, index: number) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      
      if (response.ok) {
        setSavedIds(prev => new Set(prev).add(`${lead.companyName}-${index}`));
      }
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="text-4xl font-serif italic font-black">Lead <span className="text-[var(--color-brand-primary)] not-italic tracking-tighter">Scanner</span></h2>
        <p className="text-white/40 mt-2 font-mono text-xs uppercase tracking-widest">ADVANCED AI-POWERED SEARCH ENGINE v4.1</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Zap size={120} className="fill-[var(--color-brand-primary)]" />
        </div>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Target Niche</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                value={niche}
                onChange={e => setNiche(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-[var(--color-brand-primary)] outline-none transition-all"
                placeholder="e.g. SaaS Agencies"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Location City</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-[var(--color-brand-primary)] outline-none transition-all"
                placeholder="e.g. Austin"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Results Range</label>
            <select className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-[var(--color-brand-primary)] outline-none transition-all appearance-none cursor-pointer">
              <option>10 Results (Standard)</option>
              <option>25 Results (Pro)</option>
              <option>50 Results (Elite)</option>
            </select>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-[var(--color-brand-primary)] text-black font-bold h-[46px] rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {loading ? "SCANNING GRID..." : "INITIATE SCAN"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <AnimatePresence>
          {loading && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="col-span-full py-20 flex flex-col items-center justify-center space-y-4"
             >
               <div className="w-16 h-16 border-4 border-[var(--color-brand-primary)]/20 border-t-[var(--color-brand-primary)] rounded-full animate-spin" />
               <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] active-scan-text">Analyzing database records...</p>
               <style>{`
                 .active-scan-text {
                   animation: blink 1s step-end infinite;
                 }
                 @keyframes blink { 50% { opacity: 0; } }
               `}</style>
             </motion.div>
          )}

          {!loading && leads.length === 0 && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="col-span-full py-32 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center px-4"
             >
               <div className="p-4 bg-white/5 rounded-full mb-4">
                 <Building2 size={40} className="text-white/20" />
               </div>
               <h3 className="text-xl font-bold">Awaiting Input</h3>
               <p className="text-white/40 text-sm max-w-sm mt-2">Enter keywords above to start scanning for high-intent agencies in the USA.</p>
            </motion.div>
          )}

          {leads.map((lead, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 group hover:border-[var(--color-brand-primary)]/50 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl font-black group-hover:bg-[var(--color-brand-primary)] group-hover:text-black transition-colors">
                    {lead.companyName[0]}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-[var(--color-brand-primary)] transition-colors">{lead.companyName}</h4>
                    <div className="flex items-center gap-2 text-white/40 text-xs mt-1">
                      <MapPin size={12} />
                      {lead.city}, USA
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/5">
                    {lead.specialization}
                  </span>
                  <a href={lead.website} target="_blank" rel="noreferrer" className="text-[var(--color-brand-primary)] p-1 hover:bg-[var(--color-brand-primary)]/10 rounded-lg transition-all">
                    <Globe size={16} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <Mail size={14} className="text-white/20" />
                    {lead.email}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <Phone size={14} className="text-white/20" />
                    {lead.phone}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-white/60 group-hover:text-white transition-colors cursor-pointer">
                    <Linkedin size={14} className="text-white/20" />
                    LinkedIn Profile
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/60 group-hover:text-white transition-colors cursor-pointer">
                    <Instagram size={14} className="text-white/20" />
                    Instagram Feed
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => saveLead(lead, idx)}
                  disabled={savedIds.has(`${lead.companyName}-${idx}`)}
                  className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-bold transition-all
                    ${savedIds.has(`${lead.companyName}-${idx}`) 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'}
                  `}
                >
                  {savedIds.has(`${lead.companyName}-${idx}`) ? <CheckCircle2 size={16} /> : <Save size={16} />}
                  {savedIds.has(`${lead.companyName}-${idx}`) ? 'SAVED TO CRM' : 'SAVE LEAD'}
                </button>
                <button className="w-11 h-11 flex items-center justify-center bg-[var(--color-brand-primary)] text-black rounded-xl hover:shadow-[0_0_15px_rgba(242,125,38,0.3)] transition-all">
                  <Zap size={18} fill="currentColor" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!loading && leads.length > 0 && (
         <div className="flex justify-center mt-8">
           <button 
             onClick={handleSearch}
             className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-[0.3em] hover:text-[var(--color-brand-primary)] transition-colors"
           >
             <Loader2 size={14} className="animate-spin-slow" />
             Scouring additional nodes...
           </button>
           <style>{`
             .animate-spin-slow { animation: spin 3s linear infinite; }
             @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
           `}</style>
         </div>
      )}
    </div>
  );
}
