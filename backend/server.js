
/**
 * BACKEND SERVER (Node.js / Express)
 * This file implements the API endpoints requested for the Vendor Interface.
 * 
 * Dependencies (install via npm): express, cors, helmet, body-parser, multer, stripe
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Security headers
const bodyParser = require('body-parser');
const multer = require('multer'); // File uploads
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARE ---
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend
app.use(bodyParser.json());

// Upload Config (Secure validation)
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
});

// --- MOCK DATABASE HELPER ---
// In production, replace with real SQL queries (see schema.sql)
const db = {
  users: [],
  products: [],
  sales: [],
  withdrawals: [],
  paymentMethods: []
};

// --- AUTH MIDDLEWARE (MOCK) ---
const requireAuth = (req, res, next) => {
  // Check Authorization header (Bearer token)
  // Decode JWT, check user role
  req.user = { id: 'u1', role: 'admin' }; // Mock user
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
};

// ==========================================
// VENDOR ENDPOINTS
// ==========================================

// 1. Get Vendor Products
app.get('/api/vendor/products', requireAuth, (req, res) => {
  const vendorId = req.user.id; // Or from query if admin impersonating
  const products = db.products.filter(p => p.instructorId === vendorId);
  res.json(products);
});

// 2. Create/Edit Product
app.post('/api/vendor/products', requireAuth, upload.single('media'), (req, res) => {
  const productData = req.body;
  const file = req.file;

  // Validation
  if (!productData.title || !productData.price) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Handle Logic (Save to DB)
  // If file exists, upload to cloud storage (S3/Cloudinary) and get URL
  const mediaUrl = file ? `https://storage.kadjolo.com/${file.filename}` : productData.mediaUrl;

  const newProduct = {
    id: Date.now().toString(),
    ...productData,
    mediaUrl,
    instructorId: req.user.id,
    createdAt: new Date()
  };
  
  db.products.push(newProduct);
  
  // Log Audit
  console.log(`[AUDIT] User ${req.user.id} created product ${newProduct.id}`);

  res.json({ success: true, product: newProduct });
});

// 3. Get Sales History (CSV Ready)
app.get('/api/vendor/sales', requireAuth, (req, res) => {
  const sales = db.sales.filter(s => s.vendorId === req.user.id);
  res.json(sales);
});

// 4. Request Withdrawal
app.post('/api/vendor/withdrawals', requireAuth, (req, res) => {
  const { amount, method, details } = req.body;
  // Check balance (Logic needed)
  const withdrawal = {
    id: Date.now().toString(),
    vendorId: req.user.id,
    amount,
    method,
    details,
    status: 'pending',
    date: new Date()
  };
  db.withdrawals.push(withdrawal);
  res.json({ success: true, withdrawal });
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// 1. Manage Payment Methods
app.get('/api/admin/payments', requireAuth, requireAdmin, (req, res) => {
  // Return methods but mask secrets!
  const safeMethods = db.paymentMethods.map(m => ({
    ...m,
    apiConfig: { ...m.apiConfig, secretKey: '***MASKED***' }
  }));
  res.json(safeMethods);
});

app.post('/api/admin/payments', requireAuth, requireAdmin, (req, res) => {
  const config = req.body;
  // Encrypt secrets before saving to DB
  db.paymentMethods.push(config);
  res.json({ success: true });
});

// 2. Impersonation (View As)
app.post('/api/admin/impersonate', requireAuth, requireAdmin, (req, res) => {
  const { targetUserId } = req.body;
  // Generate a temporary short-lived token with target user scopes
  const tempToken = "mock_impersonation_token_" + targetUserId;
  
  console.log(`[AUDIT] Admin ${req.user.id} impersonated ${targetUserId}`);
  
  res.json({ token: tempToken });
});

// 3. Process Withdrawal (Validate/Reject)
app.post('/api/admin/withdrawals/:id/process', requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { action, note } = req.body; // 'approve' | 'reject'
  
  // Logic: Update DB, trigger manual payment or API transfer
  res.json({ success: true, status: action === 'approve' ? 'paid' : 'rejected' });
});

// ==========================================
// WEBHOOKS (Payment Gateways)
// ==========================================

// PayPal Webhook
app.post('/webhook/paypal', (req, res) => {
  const event = req.body;
  // Verify signature
  if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    // 1. Find transaction in DB
    // 2. Update Status to 'completed'
    // 3. Calculate Commission (Split)
    // 4. Update Vendor Balance
    console.log("PayPal Payment Received:", event.resource.id);
  }
  res.sendStatus(200);
});

// Stripe Webhook
app.post('/webhook/stripe', bodyParser.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    // event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    event = req.body; // Mock
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    // Handle successful payment
    // If using Connect (Split payments), Stripe handles the split, just record it locally.
    console.log("Stripe Payment Completed");
  }

  res.json({received: true});
});

// Mobile Money Callback (Flooz/TMoney generic example)
app.post('/webhook/mobile-money', (req, res) => {
  const { tx_ref, status } = req.body;
  if (status === 'successful') {
     // Confirm transaction
  }
  res.sendStatus(200);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
