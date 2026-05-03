import React from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, Mail } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Failed to sign in. Please check your browser's popup settings.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="w-20 h-20 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(var(--color-brand-primary-rgb),0.3)]">
          <ShieldCheck size={40} className="text-black" />
        </div>
        
        <h1 className="text-4xl font-serif italic font-black mb-4 tracking-tight">
          Ateeq <span className="text-[var(--color-brand-primary)] not-italic">Outreach</span>
        </h1>
        
        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] mb-12 leading-relaxed">
          SECURE PROSPECTING KERNEL <br /> v2.4.0_STABLE
        </p>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
          >
            <LogIn size={20} />
            AUTHORIZE WITH GOOGLE
          </button>
          
          <div className="pt-8">
            <p className="text-[9px] text-white/20 font-mono flex items-center justify-center gap-2">
              <Mail size={10} />
              SYSTEM PROTECTED FOR: ATEEQ05@YAHOO.COM
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
