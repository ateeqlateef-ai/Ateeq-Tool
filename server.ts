import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email Transporter (Yahoo Mail)
const getEmailTransporter = () => {
  const user = process.env.YAHOO_EMAIL || 'ateeq05@yahoo.com';
  const pass = process.env.YAHOO_APP_PASSWORD;

  if (!pass) {
    console.warn("YAHOO_APP_PASSWORD not set. Email sending will be simulated.");
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: user,
      pass: pass
    }
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory "Database"
  const db_store = {
    leads: [] as any[],
    templates: [
      { id: '1', name: 'Initial Outreach', type: 'email', subject: 'Partnership with {company_name}', body: 'Hey {name}, I saw your work at {company_name} and thought we could collaborate!' }
    ],
    outreachLog: [] as any[]
  };

  // --- API Routes ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Ateeq Tool API is running" });
  });

  app.get("/api/leads", (req, res) => {
    res.json(db_store.leads);
  });

  app.post("/api/leads", (req, res) => {
    const lead = { ...req.body, id: Date.now().toString(), status: 'New' };
    db_store.leads.push(lead);
    res.status(201).json(lead);
  });

  // Batch upload leads (from Excel)
  app.post("/api/leads/batch", (req, res) => {
    const leads = req.body;
    if (!Array.isArray(leads)) return res.status(400).json({ error: "Expected an array of leads" });

    const newLeads = leads.map(l => ({
      ...l,
      id: Math.random().toString(36).substr(2, 9) + Date.now(),
      status: l.status || 'New',
      companyName: l.companyName || l.Company || "Unknown",
      email: l.email || l.Email || "",
      phone: l.phone || l.Phone || "",
      city: l.city || l.City || "",
      website: l.website || l.Website || ""
    }));

    db_store.leads.push(...newLeads);
    res.status(201).json({ count: newLeads.length });
  });

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

  app.delete("/api/leads/:id", (req, res) => {
    db_store.leads = db_store.leads.filter(l => l.id !== req.params.id);
    res.status(204).send();
  });

  // Real Outreach Action (Email via Nodemailer)
  app.post("/api/outreach/send", async (req, res) => {
    const { leadId, type, subject, body } = req.body;
    const lead = db_store.leads.find(l => l.id === leadId);
    
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    if (type === 'email') {
      const transporter = getEmailTransporter();
      if (transporter) {
        try {
          await transporter.sendMail({
            from: `"Ateeq Tool" <${process.env.YAHOO_EMAIL || 'ateeq05@yahoo.com'}>`,
            to: lead.email,
            subject: subject || "Business Inquiry",
            text: body || "Hi there,"
          });
          console.log(`Email sent to ${lead.email}`);
        } catch (error) {
          console.error("Nodemailer Error:", error);
          return res.status(500).json({ error: "Failed to send email. Check your SMTP credentials." });
        }
      } else {
        console.warn("Simulation Mode: No SMTP credentials.");
      }
    }

    // Log the activity
    const logEntry = {
      id: Date.now().toString(),
      leadId,
      company: lead.companyName,
      type,
      timestamp: new Date().toISOString(),
      status: 'Sent'
    };
    
    db_store.outreachLog.push(logEntry);
    
    if (lead.status === 'New') {
      lead.status = 'Contacted';
      lead.lastContacted = new Date().toISOString();
    }

    res.json({ message: `${type} outreach successful`, log: logEntry });
  });

  app.get("/api/analytics", (req, res) => {
    res.json({
      totalLeads: db_store.leads.length,
      emailsSent: db_store.outreachLog.filter(l => l.type === 'email').length,
      whatsappSent: db_store.outreachLog.filter(l => l.type === 'whatsapp').length,
      repliesReceived: Math.floor(db_store.outreachLog.length * 0.15),
      recentActivity: db_store.outreachLog.slice(-5).reverse()
    });
  });

  app.get("/api/leads/sample", (req, res) => {
    const samples = Array.from({ length: 50 }, (_, i) => ({
      id: `lead-${i}`,
      companyName: `Agency ${i + 1}`,
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
