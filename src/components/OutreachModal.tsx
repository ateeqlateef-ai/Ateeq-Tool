import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Mail, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { Lead } from '../types';
import { outreachService } from '../services/outreachService';

interface OutreachModalProps {
  show: boolean;
  lead: Lead | null;
  type: 'email' | 'whatsapp';
  onClose: () => void;
  onSuccess: () => void;
}

export default function OutreachModal({ show, lead, type, onClose, onSuccess }: OutreachModalProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (lead) {
      if (type === 'email') {
        setSubject(`Partnership Inquiry for ${lead.companyName}`);
        setBody(`Hey ${lead.companyName.split(' ')[0]},\n\nI saw your work at ${lead.companyName} and was really impressed. I'd love to discuss how I can help you with your full-stack development needs.\n\nBest regards,\nAteeq`);
      } else {
        setBody(`Hey ${lead.companyName.split(' ')[0]}! Just checking in from Ateeq's dev service. Saw your work at ${lead.companyName}. Would love to chat!`);
      }
    }
    setSent(false); // Reset sent state when lead changes
  }, [lead, type]);

  const handleSend = async () => {
    if (!lead) return;
    setLoading(true);

    try {
      await outreachService.sendOutreach(lead, type, subject, body);

      setSent(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      alert(`Error sending outreach: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && lead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[var(--color-brand-surface)] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${type === 'email' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                  {type === 'email' ? <Mail size={20} /> : <MessageSquare size={20} />}
                </div>
                <div>
                  <h3 className="font-bold">Send {type === 'email' ? 'Email' : 'WhatsApp'}</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">To: {lead.companyName}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {type === 'email' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Subject Line</label>
                  <input 
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-[var(--color-brand-primary)] outline-none transition-all"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Message Body</label>
                <textarea 
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-sm focus:border-[var(--color-brand-primary)] outline-none transition-all resize-none"
                />
              </div>

              {/* Action */}
              <button
                onClick={handleSend}
                disabled={loading || sent}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50
                  ${sent ? 'bg-green-500 text-white' : 'bg-[var(--color-brand-primary)] text-black'}
                `}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : sent ? <CheckCircle2 size={18} /> : <Send size={18} />}
                {loading ? 'TRANSMITTING...' : sent ? 'SENT SUCCESSFULLY' : `SEND ${type.toUpperCase()}`}
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-black/20 border-t border-white/5 text-center">
              <p className="text-[9px] text-white/20 font-mono italic uppercase tracking-tighter">
                {type === 'email' 
                  ? 'Sent via ateeq05@yahoo.com SMTP node' 
                  : 'Opening secure WhatsApp link via +92 313 1822218'
                }
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
