import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

import cors from "cors";

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
    secure: true,
    auth: {
      user: user,
      pass: pass
    }
  });
};

async function startServer() {
  try {
    const app = express();
    const PORT = 3000;

    app.use(cors());
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
      console.log("[SERVER] Health check hit");
      res.json({ status: "ok", message: "Ateeq Tool API is running" });
    });

    app.get("/api/leads", (req, res) => {
      console.log(`[SERVER] Fetching ${db_store.leads.length} leads`);
      res.json(db_store.leads);
    });

    app.post("/api/leads", (req, res) => {
      const lead = { ...req.body, id: Date.now().toString(), status: 'New', createdAt: new Date().toISOString() };
      db_store.leads.push(lead);
      console.log(`[SERVER] Lead added: ${lead.companyName}`);
      res.status(201).json(lead);
    });

    app.post("/api/leads/batch", (req, res) => {
      try {
        const leads = req.body;
        if (!Array.isArray(leads)) return res.status(400).json({ error: "Expected an array of leads" });

        const newLeads = leads.map(l => ({
          id: Math.random().toString(36).substr(2, 9) + Date.now(),
          status: 'New',
          companyName: l.companyName || "Unknown Entity",
          email: l.email || "",
          phone: l.phone || "",
          city: l.city || "",
          website: l.website || "",
          specialization: l.specialization || "",
          createdAt: new Date().toISOString()
        }));

        db_store.leads.push(...newLeads);
        console.log(`[SERVER] Batch upload: ${newLeads.length} leads`);
        res.status(201).json({ count: newLeads.length });
      } catch (err) {
        console.error("[SERVER] Batch upload error:", err);
        res.status(500).json({ error: "Batch upload failed" });
      }
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

    // Outreach Routes... (keeping existing)
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
          } catch (error) {
            console.error("[SERVER] Nodemailer Error:", error);
            return res.status(500).json({ error: "Failed to send email" });
          }
        }
      }

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

    // Vite middleware
    if (process.env.NODE_ENV !== "production") {
      console.log("[SERVER] Starting Vite in middleware mode");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      console.log("[SERVER] Production mode: Serving static files");
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[SERVER] Ready at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[SERVER] Critical startup error:", error);
  }
}

startServer();
