import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { leadService } from './leadService';

const LOGS_COLLECTION = 'outreachLogs';

export const outreachService = {
  async logOutreach(leadId: string, company: string, type: 'email' | 'whatsapp', status: string = 'Sent') {
    await addDoc(collection(db, LOGS_COLLECTION), {
      leadId,
      company,
      type,
      status,
      timestamp: new Date().toISOString()
    });
    
    // Also update lead status
    await leadService.updateLeadStatus(leadId, 'Contacted');
  },

  async sendOutreach(lead: any, type: 'email' | 'whatsapp', subject: string, body: string) {
    if (type === 'email') {
      const response = await fetch('/api/outreach/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadEmail: lead.email,
          subject,
          body
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to send email');
      }

      await this.logOutreach(lead.id, lead.companyName, 'email');
    } else {
      // WhatsApp - open link and log
      const waUrl = `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(body)}`;
      window.open(waUrl, '_blank');
      await this.logOutreach(lead.id, lead.companyName, 'whatsapp');
    }
  },

  subscribeToLogs(callback: (logs: any[]) => void) {
    const q = query(collection(db, LOGS_COLLECTION), orderBy('timestamp', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(logs);
    });
  }
};
