import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Lead } from '../types';

const LEADS_COLLECTION = 'leads';

export const leadService = {
  async addLead(lead: Omit<Lead, 'id'>) {
    const docRef = await addDoc(collection(db, LEADS_COLLECTION), {
      ...lead,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  },

  async addLeadsBatch(leads: Omit<Lead, 'id'>[]) {
    const promises = leads.map(l => this.addLead(l));
    return Promise.all(promises);
  },

  async deleteLead(id: string) {
    await deleteDoc(doc(db, LEADS_COLLECTION, id));
  },

  async updateLeadStatus(id: string, status: string) {
    await updateDoc(doc(db, LEADS_COLLECTION, id), {
      status,
      lastContacted: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  },

  subscribeToLeads(callback: (leads: Lead[]) => void) {
    const q = query(collection(db, LEADS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      callback(leads);
    }, (error) => {
      console.error("Firestore leads subscription error:", error);
    });
  }
};
