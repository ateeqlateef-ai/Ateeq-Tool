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

    // --- API Routes ---

    app.get("/api/health", (req, res) => {
      console.log("[SERVER] Health check hit");
      res.json({ status: "ok", message: "Ateeq Tool API is running" });
    });

    // Outreach Routes (Server handles SMTP)
    app.post("/api/outreach/send", async (req, res) => {
      const { leadEmail, subject, body } = req.body;
      
      const transporter = getEmailTransporter();
      if (transporter && leadEmail) {
        try {
          console.log(`[SERVER] Sending email to ${leadEmail}`);
          await transporter.sendMail({
            from: `"Ateeq Tool" <${process.env.YAHOO_EMAIL || 'ateeq05@yahoo.com'}>`,
            to: leadEmail,
            subject: subject || "Business Inquiry",
            text: body || "Hi there,"
          });
          res.json({ message: "Email sent successfully" });
        } catch (error) {
          console.error("[SERVER] Nodemailer Error:", error);
          res.status(500).json({ error: "Failed to send email. Check SMTP credentials." });
        }
      } else {
        if (!transporter) {
          console.warn("[SERVER] No transporter configured. Simulating success.");
          res.json({ message: "Email sending simulated (Credentials missing)" });
        } else {
          res.status(400).json({ error: "Missing leadEmail" });
        }
      }
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
