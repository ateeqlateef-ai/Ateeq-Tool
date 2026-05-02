import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory "Database" (Persistent during server runtime)
  const db_store = {
    leads: [] as any[],
    templates: [
      { id: '1', name: 'Initial Outreach', type: 'email', subject: 'Partnership with {company_name}', body: 'Hey, I saw your work...' }
    ],
    outreachLog: [] as any[]
  };

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Ateeq Tool API is running" });
  });

  // Get all saved leads
  app.get("/api/leads", (req, res) => {
    res.json(db_store.leads);
  });

  // Save a new lead
  app.post("/api/leads", (req, res) => {
    const lead = { ...req.body, id: Date.now().toString(), status: 'New' };
    db_store.leads.push(lead);
    res.status(201).json(lead);
  });

  // Update lead status
  app.patch("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const leadIdx = db_store.leads.findIndex(l => l.id === id);
    if (leadIdx > -1) {
      db_store.leads[leadIdx].status = status;
      db_store.leads[leadIdx].lastContacted = new Date().toISOString();
      res.json(db_store.leads[leadIdx]);
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  });

  // Delete lead
  app.delete("/api/leads/:id", (req, res) => {
    db_store.leads = db_store.leads.filter(l => l.id !== req.params.id);
    res.status(204).send();
  });

  // Handle Outreach Action (Email/WhatsApp)
  app.post("/api/outreach/send", (req, res) => {
    const { leadId, type, templateId } = req.body;
    const lead = db_store.leads.find(l => l.id === leadId);
    
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    // Simulate sending
    const logEntry = {
      id: Date.now().toString(),
      leadId,
      company: lead.companyName,
      type,
      timestamp: new Date().toISOString(),
      status: 'Sent'
    };
    
    db_store.outreachLog.push(logEntry);
    
    // Update lead status to Contacted if it was New
    if (lead.status === 'New') {
      lead.status = 'Contacted';
      lead.lastContacted = new Date().toISOString();
    }

    console.log(`[OUTREACH] ${type.toUpperCase()} sent to ${lead.companyName} (${lead.email})`);
    res.json({ message: `${type} sent successfully`, log: logEntry });
  });

  // Analytics endpoint
  app.get("/api/analytics", (req, res) => {
    res.json({
      totalLeads: db_store.leads.length,
      emailsSent: db_store.outreachLog.filter(l => l.type === 'email').length,
      whatsappSent: db_store.outreachLog.filter(l => l.type === 'whatsapp').length,
      repliesReceived: Math.floor(db_store.outreachLog.length * 0.15), // Mocked logic
      recentActivity: db_store.outreachLog.slice(-5).reverse()
    });
  });

  // Sample lead generation (mocking search)
  app.get("/api/leads/sample", (req, res) => {
    // Return sample data for the "Data Generation Task"
    const samples = Array.from({ length: 50 }, (_, i) => ({
      id: `lead-${i}`,
      companyName: `TechAgency ${i + 1}`,
      city: ["New York", "San Francisco", "Austin", "Seattle", "Chicago"][i % 5],
      website: `https://agency${i + 1}.example.com`,
      email: `contact@agency${i + 1}.example.com`,
      phone: `+1 (555) 000-${1000 + i}`,
      linkedIn: `https://linkedin.com/company/agency${i + 1}`,
      instagram: `https://instagram.com/agency${i + 1}`,
      specialization: ["Web Development", "SaaS", "Digital Services"][i % 3],
      status: "New"
    }));
    res.json(samples);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
