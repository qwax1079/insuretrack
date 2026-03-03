import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("insuretrack.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    phone TEXT,
    category TEXT CHECK(category IN ('Cold', 'Warm', 'Hot')) DEFAULT 'Cold',
    status TEXT CHECK(status IN ('New', 'Follow Up', 'Meeting', 'Closing', 'Closed')) DEFAULT 'New',
    follow_up_date TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS commissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lead_id INTEGER,
    premium REAL NOT NULL,
    commission_rate REAL NOT NULL,
    commission_amount REAL NOT NULL,
    date TEXT DEFAULT (date('now')),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(lead_id) REFERENCES leads(id)
  );

  CREATE TABLE IF NOT EXISTS targets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    month TEXT NOT NULL, -- YYYY-MM
    target_amount REAL NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL
  );
`);

// Migration: Ensure user_id exists in tables (for existing databases)
const tablesToUpdate = ['leads', 'commissions', 'targets'];
tablesToUpdate.forEach(table => {
  try {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
    const hasUserId = columns.some(c => c.name === 'user_id');
    if (!hasUserId) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN user_id INTEGER NOT NULL DEFAULT 1`);
      console.log(`Added user_id to ${table}`);
    }
  } catch (e) {
    console.error(`Migration failed for ${table}:`, e);
  }
});

// Seed templates if empty
const templateCount = db.prepare("SELECT COUNT(*) as count FROM templates").get() as { count: number };
if (templateCount.count === 0) {
  const seedTemplates = [
    { title: "Follow-up Halus", category: "Follow Up", content: "Halo [Nama], saya [Nama Agen] dari [Perusahaan]. Hanya ingin menyapa dan menanyakan apakah ada pertanyaan lebih lanjut mengenai rencana perlindungan yang kita bahas kemarin? 😊" },
    { title: "Handling Objection - Premi Mahal", category: "Objection", content: "Saya mengerti, [Nama]. Memang terlihat besar di awal, tapi jika dibagi per hari, ini hanya seharga secangkir kopi. Manfaatnya jauh lebih besar untuk ketenangan pikiran keluarga Anda." },
    { title: "Script Janji Temu", category: "Appointment", content: "Halo [Nama], saya ada waktu luang di hari Selasa jam 10 pagi atau Rabu jam 2 siang. Mana yang lebih nyaman untuk kita ngobrol santai sebentar?" }
  ];
  const insertTemplate = db.prepare("INSERT INTO templates (title, category, content) VALUES (?, ?, ?)");
  seedTemplates.forEach(t => insertTemplate.run(t.title, t.category, t.content));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email Transporter (Lazy loaded)
  const getTransporter = () => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not found. Email notifications will be logged to console only.");
      return null;
    }
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  };

  const sendWelcomeEmail = async (email: string, name: string) => {
    const transporter = getTransporter();
    const subject = "Selamat Bergabung di InsureTrack!";
    const text = `Halo ${name},\n\nSelamat bergabung di InsureTrack! Akun Anda telah berhasil didaftarkan.\n\nSekarang Anda dapat menggunakan seluruh layanan aplikasi kami untuk mengelola prospek, tracking komisi, dan meningkatkan closing rate Anda.\n\nSelamat bekerja dan semoga sukses!\n\nSalam,\nTim InsureTrack`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h1 style="color: #4f46e5;">Selamat Bergabung, ${name}!</h1>
        <p>Terima kasih telah mendaftar di <strong>InsureTrack</strong>.</p>
        <p>Akun Anda telah aktif dan siap digunakan untuk:</p>
        <ul>
          <li>Manajemen Prospek (Cold, Warm, Hot)</li>
          <li>Reminder Follow Up Otomatis</li>
          <li>Tracking Komisi & Target Bulanan</li>
          <li>Template Chat Closing</li>
        </ul>
        <p>Klik tombol di bawah ini untuk mulai menjelajah:</p>
        <a href="${process.env.APP_URL || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Mulai Sekarang</a>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 12px; color: #64748b;">Jika Anda tidak merasa mendaftar, silakan abaikan email ini.</p>
      </div>
    `;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"InsureTrack" <${process.env.SMTP_USER}>`,
          to: email,
          subject,
          text,
          html,
        });
        console.log(`Welcome email sent to ${email}`);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      console.log("--- SIMULATED EMAIL ---");
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text}`);
      console.log("-----------------------");
    }
  };

  const sendFollowUpReminderEmail = async (email: string, name: string, leads: any[]) => {
    const transporter = getTransporter();
    const subject = `Reminder: ${leads.length} Follow-up Hari Ini!`;
    const leadsList = leads.map(l => `- ${l.name} (${l.phone || 'No phone'})`).join('\n');
    const leadsHtml = leads.map(l => `
      <li style="margin-bottom: 10px;">
        <strong>${l.name}</strong><br/>
        <span style="color: #64748b; font-size: 13px;">Phone: ${l.phone || '-'} | Status: ${l.status}</span>
      </li>
    `).join('');

    const text = `Halo ${name},\n\nAnda memiliki ${leads.length} jadwal follow-up hari ini:\n\n${leadsList}\n\nJangan lupa untuk menghubungi mereka agar closing rate Anda meningkat!\n\nSalam,\nTim InsureTrack`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #4f46e5;">Reminder Follow-up Hari Ini</h2>
        <p>Halo <strong>${name}</strong>, Anda memiliki ${leads.length} prospek yang perlu dihubungi hari ini:</p>
        <ul style="padding-left: 20px;">
          ${leadsHtml}
        </ul>
        <p>Segera hubungi mereka untuk hasil maksimal!</p>
        <a href="${process.env.APP_URL || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Buka InsureTrack</a>
      </div>
    `;

    if (transporter) {
      try {
        await transporter.sendMail({ from: `"InsureTrack" <${process.env.SMTP_USER}>`, to: email, subject, text, html });
      } catch (error) {
        console.error("Failed to send reminder email:", error);
      }
    } else {
      console.log(`--- SIMULATED REMINDER EMAIL to ${email} ---`);
      console.log(text);
    }
  };

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name, company } = req.body;
    try {
      const result = db.prepare(
        "INSERT INTO users (email, password, name, company) VALUES (?, ?, ?, ?)"
      ).run(email, password, name, company);
      
      // Send welcome email in background
      sendWelcomeEmail(email, name);

      res.json({ id: result.lastInsertRowid, email, name, company });
    } catch (error) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ id: user.id, email: user.email, name: user.name, company: user.company });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // API Routes (Updated to be user-specific)
  app.get("/api/leads", (req, res) => {
    const userId = req.query.userId;
    const leads = db.prepare("SELECT * FROM leads WHERE user_id = ? ORDER BY created_at DESC").all(userId);
    res.json(leads);
  });

  app.post("/api/leads", (req, res) => {
    const { userId, name, age, phone, category, status, follow_up_date, notes } = req.body;
    const result = db.prepare(
      "INSERT INTO leads (user_id, name, age, phone, category, status, follow_up_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(userId, name, age, phone, category, status, follow_up_date, notes);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const { name, age, phone, category, status, follow_up_date, notes } = req.body;
    db.prepare(
      "UPDATE leads SET name = ?, age = ?, phone = ?, category = ?, status = ?, follow_up_date = ?, notes = ? WHERE id = ?"
    ).run(name, age, phone, category, status, follow_up_date, notes, id);
    res.json({ success: true });
  });

  app.delete("/api/leads/:id", (req, res) => {
    db.prepare("DELETE FROM leads WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/commissions", (req, res) => {
    const userId = req.query.userId;
    const commissions = db.prepare(`
      SELECT c.*, l.name as lead_name 
      FROM commissions c 
      LEFT JOIN leads l ON c.lead_id = l.id 
      WHERE c.user_id = ?
      ORDER BY date DESC
    `).all(userId);
    res.json(commissions);
  });

  app.post("/api/commissions", (req, res) => {
    const { userId, lead_id, premium, commission_rate, date } = req.body;
    const commission_amount = (premium * commission_rate) / 100;
    const result = db.prepare(
      "INSERT INTO commissions (user_id, lead_id, premium, commission_rate, commission_amount, date) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(userId, lead_id, premium, commission_rate, commission_amount, date);
    res.json({ id: result.lastInsertRowid, commission_amount });
  });

  app.get("/api/targets", (req, res) => {
    const userId = req.query.userId;
    const targets = db.prepare("SELECT * FROM targets WHERE user_id = ?").all(userId);
    res.json(targets);
  });

  app.post("/api/targets", (req, res) => {
    const { userId, month, target_amount } = req.body;
    const existing = db.prepare("SELECT id FROM targets WHERE user_id = ? AND month = ?").get(userId, month) as { id: number } | undefined;
    if (existing) {
      db.prepare("UPDATE targets SET target_amount = ? WHERE id = ?").run(target_amount, existing.id);
    } else {
      db.prepare("INSERT INTO targets (user_id, month, target_amount) VALUES (?, ?, ?)" ).run(userId, month, target_amount);
    }
    res.json({ success: true });
  });

  app.get("/api/templates", (req, res) => {
    const templates = db.prepare("SELECT * FROM templates ORDER BY id DESC").all();
    res.json(templates);
  });

  app.post("/api/templates", (req, res) => {
    const { title, category, content } = req.body;
    const result = db.prepare(
      "INSERT INTO templates (title, category, content) VALUES (?, ?, ?)"
    ).run(title, category, content);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/templates/:id", (req, res) => {
    db.prepare("DELETE FROM templates WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/reminders", (req, res) => {
    const userId = req.query.userId;
    const today = new Date().toISOString().slice(0, 10);
    const reminders = db.prepare(
      "SELECT * FROM leads WHERE user_id = ? AND follow_up_date = ? AND status != 'Closed'"
    ).all(userId, today);
    res.json(reminders);
  });

  app.post("/api/reminders/send", async (req, res) => {
    const { userId } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
    const leads = db.prepare(
      "SELECT * FROM leads WHERE user_id = ? AND follow_up_date = ? AND status != 'Closed'"
    ).all(userId, today);

    if (user && leads.length > 0) {
      await sendFollowUpReminderEmail(user.email, user.name, leads);
      res.json({ success: true, count: leads.length });
    } else {
      res.json({ success: false, message: "No leads to remind or user not found" });
    }
  });

  app.get("/api/stats", (req, res) => {
    const userId = req.query.userId;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyCommission = db.prepare(
      "SELECT SUM(commission_amount) as total FROM commissions WHERE user_id = ? AND strftime('%Y-%m', date) = ?"
    ).get(userId, currentMonth) as { total: number };
    
    const target = db.prepare(
      "SELECT target_amount FROM targets WHERE user_id = ? AND month = ?"
    ).get(userId, currentMonth) as { target_amount: number } | undefined;

    const leadStats = db.prepare(
      "SELECT status, COUNT(*) as count FROM leads WHERE user_id = ? GROUP BY status"
    ).all(userId);

    res.json({
      monthlyCommission: monthlyCommission.total || 0,
      monthlyTarget: target?.target_amount || 0,
      leadStats
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
