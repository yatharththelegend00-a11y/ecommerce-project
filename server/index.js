import dotenv from 'dotenv';
dotenv.config();

/* ======================= IMPORTS ======================= */
import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import { createClient } from '@libsql/client';
import { v2 as cloudinary } from 'cloudinary';

import multer from 'multer';
import streamifier from 'streamifier';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/* ======================= __dirname FIX ======================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- HEADERS ---
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// --- CONFIG ---
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

// --- DB INIT ---
async function initDB() {
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, category TEXT, base_price REAL, brand TEXT, rating REAL DEFAULT 4.5)`);
    await db.execute(`CREATE TABLE IF NOT EXISTS variants (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, color TEXT, size TEXT, price REAL, discount INTEGER DEFAULT 0, stock INTEGER DEFAULT 0, images TEXT, FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE)`);
    await db.execute(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'customer', gender TEXT, age INTEGER, phone TEXT, address TEXT)`);
    await db.execute(`CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_email TEXT, total_amount REAL, status TEXT DEFAULT 'Pending', address TEXT, payment_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await db.execute(`CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, product_name TEXT, variant_info TEXT, quantity INTEGER, price REAL, FOREIGN KEY(order_id) REFERENCES orders(id))`);
    await db.execute(`CREATE TABLE IF NOT EXISTS banners (id INTEGER PRIMARY KEY AUTOINCREMENT, image_url TEXT, title TEXT)`);

    // Master Admin Check
    const adminEmail = 'clickbasket2026@gmail.com';
    const adminCheck = await db.execute({ sql: "SELECT * FROM users WHERE email = ?", args: [adminEmail] });
    if (adminCheck.rows.length === 0) {
      const hashedAdminPass = await bcrypt.hash('admin123', 10);
      await db.execute({
        sql: "INSERT INTO users (name, email, password, role) VALUES ('Master Admin', ?, ?, 'admin')",
        args: [adminEmail, hashedAdminPass]
      });
      console.log(`👑 Master Admin Created`);
    }
    console.log("✅ Database Synced.");
  } catch (err) { console.error("DB Init Error:", err); }
}
initDB();

// --- EXCEL HELPERS ---

const appendToExcel = (orderData) => {
  try {
    const filePath = path.join(__dirname, 'orders.xlsx');
    let workbook;
    let worksheet;

    if (fs.existsSync(filePath)) {
      workbook = xlsx.readFile(filePath);
      if(!workbook.SheetNames.length) {
         workbook = xlsx.utils.book_new();
         worksheet = xlsx.utils.json_to_sheet([]); 
         xlsx.utils.book_append_sheet(workbook, worksheet, 'Orders');
      } else {
         worksheet = workbook.Sheets[workbook.SheetNames[0]];
      }
    } else {
      workbook = xlsx.utils.book_new();
      worksheet = xlsx.utils.json_to_sheet([]); 
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Orders');
    }

    const existingData = xlsx.utils.sheet_to_json(worksheet);
    existingData.push(orderData);
    const newWorksheet = xlsx.utils.json_to_sheet(existingData);
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    xlsx.writeFile(workbook, filePath);
    console.log(`📊 Excel Added: Order #${orderData['Order ID']}`);
  } catch (err) { console.error("Excel Error:", err.message); }
};

// NEW: Updates Status in Excel
const updateExcelStatus = (orderId, newStatus) => {
    try {
        const filePath = path.join(__dirname, 'orders.xlsx');
        if (!fs.existsSync(filePath)) return;
        const workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = xlsx.utils.sheet_to_json(worksheet);
        
        // Find row and update status
        const updatedJson = json.map(row => {
            if (String(row['Order ID']) === String(orderId)) {
                return { ...row, Status: newStatus };
            }
            return row;
        });

        const newSheet = xlsx.utils.json_to_sheet(updatedJson);
        workbook.Sheets[workbook.SheetNames[0]] = newSheet;
        xlsx.writeFile(workbook, filePath);
        console.log(`📊 Excel Updated: Order #${orderId} -> ${newStatus}`);
    } catch(e) { console.error("Excel Update Error:", e); }
};

// NEW: Deletes Row from Excel
const deleteFromExcel = (orderId) => {
    try {
        const filePath = path.join(__dirname, 'orders.xlsx');
        if (!fs.existsSync(filePath)) return;
        const workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = xlsx.utils.sheet_to_json(worksheet);
        
        // Filter out the deleted order
        const updatedJson = json.filter(row => String(row['Order ID']) !== String(orderId));

        const newSheet = xlsx.utils.json_to_sheet(updatedJson);
        workbook.Sheets[workbook.SheetNames[0]] = newSheet;
        xlsx.writeFile(workbook, filePath);
        console.log(`📊 Excel Deleted: Order #${orderId}`);
    } catch(e) { console.error("Excel Delete Error:", e); }
};
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});




// --- AUTH ROUTES ---
app.post('/api/google-login', async (req, res) => {
  const { email, name, googleId } = req.body;
  const ADMIN_EMAIL = 'clickbasket2026@gmail.com';
  try {
    let result = await db.execute({ sql: "SELECT * FROM users WHERE email = ?", args: [email] });
    let user;
    const role = (email === ADMIN_EMAIL) ? 'admin' : 'customer';

    if (result.rows.length === 0) {
      const dummyPass = await bcrypt.hash(googleId + "secret", 10);
      const insert = await db.execute({ sql: "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", args: [name, email, dummyPass, role] });
      user = { id: insert.lastInsertRowid.toString(), name, email, role };
    } else {
      user = result.rows[0];
      if (email === ADMIN_EMAIL && user.role !== 'admin') {
         await db.execute({ sql: "UPDATE users SET role = 'admin' WHERE email = ?", args: [email] });
         user.role = 'admin';
      }
    }
    const token = jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY_HERE');
    res.json({ token, role: user.role, name: user.name, email: user.email });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.execute({ sql: "SELECT * FROM users WHERE email = ?", args: [email] });
    if (result.rows.length === 0) return res.status(401).json({ error: "User not found" });
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });
    if (email === 'clickbasket2026@gmail.com' && user.role !== 'admin') {
       await db.execute({ sql: "UPDATE users SET role = 'admin' WHERE email = ?", args: [email] });
       user.role = 'admin';
    }
    const token = jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY_HERE');
    res.json({ token, role: user.role, name: user.name, email: user.email });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const role = (email === 'clickbasket2026@gmail.com') ? 'admin' : 'customer';
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute({ sql: "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", args: [name, email, hashedPassword, role] });
    res.json({ message: "Registration successful" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- UPLOAD ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  console.log('UPLOAD ROUTE HIT');

  if (!req.file) {
    return res.status(400).json({ error: 'No file received' });
  }

  console.log('FILE:', req.file.originalname);

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'ecommerce_pro' },
        (error, result) => {
          if (error) {
            console.error('CLOUDINARY ERROR:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    console.log('UPLOAD SUCCESS:', result.secure_url);
    res.json({ url: result.secure_url });

  } catch (err) {
    console.error('UPLOAD FAILED:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});


app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment order failed" });
  }
});

// --- PRODUCT ROUTES ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.execute("SELECT * FROM products");
    const prodsWithVariant = await Promise.all(products.rows.map(async (p) => {
      const v = await db.execute({ sql: "SELECT * FROM variants WHERE product_id = ? LIMIT 1", args: [p.id] });
      let variant = v.rows[0] || {};
      if (variant.images && typeof variant.images === 'string') { try { variant.images = JSON.parse(variant.images); } catch (e) { variant.images = []; } }
      return { ...p, mainVariant: variant };
    }));
    res.json(prodsWithVariant);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await db.execute({ sql: "SELECT * FROM products WHERE id = ?", args: [id] });
      if (product.rows.length === 0) return res.status(404).json({ error: "Not Found" });
      const variants = await db.execute({ sql: "SELECT * FROM variants WHERE product_id = ?", args: [id] });
      const parsedVariants = variants.rows.map(v => ({ ...v, images: v.images ? JSON.parse(v.images) : [] }));
      res.json({ ...product.rows[0], variants: parsedVariants });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/products', async (req, res) => {
  const { name, description, category, brand, variants } = req.body; 
  try {
    const pResult = await db.execute({ sql: "INSERT INTO products (name, description, category, brand, base_price) VALUES (?, ?, ?, ?, ?)", args: [name, description, category, brand, variants[0]?.price || 0] });
    const prodId = pResult.lastInsertRowid.toString();
    for (const v of variants) {
      const imagesJSON = JSON.stringify(v.images || []); 
      await db.execute({ sql: "INSERT INTO variants (product_id, color, size, price, discount, stock, images) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [prodId, v.color, v.size, v.price, v.discount || 0, v.stock, imagesJSON] });
    }
    res.status(201).json({ message: "Product Created" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute({
      sql: "DELETE FROM variants WHERE product_id = ?",
      args: [id],
    });

    await db.execute({
      sql: "DELETE FROM products WHERE id = ?",
      args: [id],
    });

    res.json({ message: "Product deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});


// --- AI BANNER ROUTES ---
app.post('/api/admin/generate-banner', async (req, res) => {
  const { prompt } = req.body;
  try {
    const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=600&model=flux&nologo=true`;
    const uploadResult = await cloudinary.uploader.upload(aiImageUrl, { folder: "ecommerce_banners" });
    await db.execute({ sql: "INSERT INTO banners (image_url, title) VALUES (?, ?)", args: [uploadResult.secure_url, prompt] });
    res.json({ message: "Banner Generated!", url: uploadResult.secure_url });
  } catch (e) { res.status(500).json({ error: "Generation failed." }); }
});

app.get('/api/banners', async (req, res) => { try { const result = await db.execute("SELECT * FROM banners ORDER BY id DESC"); res.json(result.rows); } catch (e) { res.status(500).json(e); } });

app.delete('/api/banners/:id', async (req, res) => { try { await db.execute({ sql: "DELETE FROM banners WHERE id = ?", args: [req.params.id] }); res.json({ message: "Deleted" }); } catch (e) { res.status(500).json(e); } });

// --- ORDERS ---
app.post('/api/orders', async (req, res) => {
  console.log("Processing Order...");

  const {
    email,
    user_name,
    phone,
    address,
    city,
    state,
    pincode,
    cart,
    items,
    total,
    total_amount,
    paymentId,
  } = req.body;

  const safeEmail = email || 'guest';
  const finalItems = cart || items || [];

  if (!Array.isArray(finalItems) || finalItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const cleanTotal = Number(total || total_amount || 0);

  const fullAddress = {
    name: user_name || 'Guest',
    phone: phone || '',
    street: address || '',
    city: city || '',
    state: state || '',
    pincode: pincode || '',
  };

  try {
    // 1️⃣ Save order
    const orderResult = await db.execute({
      sql:
        "INSERT INTO orders (user_email, total_amount, address, status, payment_id) VALUES (?, ?, ?, 'Pending', ?)",
      args: [
        safeEmail,
        cleanTotal,
        JSON.stringify(fullAddress),
        paymentId || 'COD',
      ],
    });

    const orderId = String(orderResult.lastInsertRowid);
    console.log("Order Saved:", orderId);

    // 2️⃣ Save order items
    let itemDescription = "";

    for (const item of finalItems) {
      const name = item.name || item.product_name || "Item";
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const variant = `${item.color || ''}/${item.size || ''}`;

      await db.execute({
        sql:
          "INSERT INTO order_items (order_id, product_name, variant_info, quantity, price) VALUES (?, ?, ?, ?, ?)",
        args: [orderId, name, variant, qty, price],
      });

      itemDescription += `${name} ${variant} x${qty}, `;
    }

    // 3️⃣ Excel logging (if function exists)
    if (typeof appendToExcel === "function") {
      appendToExcel({
        "Order ID": orderId,
        "Date": new Date().toLocaleString(),
        "Customer": fullAddress.name,
        "Email": safeEmail,
        "Phone": fullAddress.phone,
        "Address": `${fullAddress.street}, ${fullAddress.city}, ${fullAddress.state} - ${fullAddress.pincode}`,
        "Items": itemDescription,
        "Total": `₹${cleanTotal}`,
        "Status": "Pending",
      });
    }

    res.json({ message: "Order Placed Successfully", orderId });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/orders', async (req, res) => { 
  try { 
    const result = await db.execute(`
      SELECT orders.*, users.phone, users.name as user_name 
      FROM orders 
      LEFT JOIN users ON orders.user_email = users.email 
      ORDER BY orders.created_at DESC
    `); 
    const ordersWithItems = await Promise.all(result.rows.map(async (order) => {
        const items = await db.execute({ sql: "SELECT * FROM order_items WHERE order_id = ?", args: [order.id] });
        let checkoutPhone = "N/A";
        try {
            const fullAddress = JSON.parse(order.address);
            if (fullAddress.phone) checkoutPhone = fullAddress.phone;
        } catch(e) {}

        return { 
            ...order, 
            items: items.rows,
            final_phone: checkoutPhone !== "N/A" ? checkoutPhone : (order.profile_phone || "N/A") // Priority to checkout phone
        };
    }));
    res.json(ordersWithItems); 
  } catch (e) { res.status(500).json(e); } 
});

// UPDATE STATUS ROUTE (Fix: Now updates Excel too)
app.put('/api/orders/:id', async (req, res) => { 
  const { status } = req.body;
  const { id } = req.params;
  try { 
    await db.execute({ sql: "UPDATE orders SET status = ? WHERE id = ?", args: [status, id] }); 
    
    // UPDATE EXCEL
    updateExcelStatus(id, status);

    if (status === 'Confirmed' && process.env.GMAIL_USER) {
      const orderRes = await db.execute({ sql: "SELECT * FROM orders WHERE id = ?", args: [id] });
      const order = orderRes.rows[0];
      const mailOptions = { 
        from: process.env.GMAIL_USER, 
        to: order.user_email, 
        subject: `✅ Order #${id} Confirmed!`, 
        html: `<h2>Order #${id} Confirmed</h2><p>Your order for ₹${order.total_amount} has been approved!</p>` 
      };
      transporter.sendMail(mailOptions, (err) => { if (err) console.error("Email Error:", err); });
    }
    res.json({ message: "Status Updated" }); 
  } catch (e) { res.status(500).json(e); } 
});

// NEW: DELETE ORDER ROUTE (Deletes from DB AND Excel)
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Delete from DB (Cascade will delete items)
    await db.execute({ sql: "DELETE FROM order_items WHERE order_id = ?", args: [id] });
    await db.execute({ sql: "DELETE FROM orders WHERE id = ?", args: [id] });
    
    // Delete from Excel
    deleteFromExcel(id);

    res.json({ message: "Order Deleted" });
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});


app.get('/api/test-excel', (req, res) => {
    try {
       appendToExcel({ "Order ID": "TEST-000", "Date": new Date().toLocaleString(), "Customer": "Test", "Total": "100" });
       res.send("Excel Test Endpoint");
    } catch(e) { res.send(e.message); }
});

app.get('/api/nuke', async (req, res) => {
  try {
    await db.execute("DROP TABLE IF EXISTS banners"); await db.execute("DROP TABLE IF EXISTS order_items"); await db.execute("DROP TABLE IF EXISTS orders"); await db.execute("DROP TABLE IF EXISTS variants"); await db.execute("DROP TABLE IF EXISTS products"); await db.execute("DROP TABLE IF EXISTS users");
    await initDB();
    res.send("💥 Database Reset.");
  } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});