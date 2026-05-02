import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Ateeq Tool API is running" });
  });

  // Mock API for leads (will transition to Firestore/Real API later)
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
