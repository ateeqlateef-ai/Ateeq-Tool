export enum LeadStatus {
  NEW = "New",
  CONTACTED = "Contacted",
  REPLIED = "Replied",
  CONVERTED = "Converted"
}

export interface Lead {
  id: string;
  companyName: string;
  city: string;
  website: string;
  email: string;
  phone: string;
  linkedIn?: string;
  instagram?: string;
  specialization: string;
  status: LeadStatus;
  lastContacted?: string;
  notes?: string;
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: "email" | "whatsapp";
}

export interface Analytics {
  totalLeads: number;
  emailsSent: number;
  whatsappSent: number;
  repliesReceived: number;
  openRate: number;
  pendingFollowups: number;
}
