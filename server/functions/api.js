const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
<<<<<<< HEAD:server/index.js
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
=======
const serverless = require('serverless-http');
const { getStore } = require('@netlify/blobs');
>>>>>>> 9d381ea (Final update for Netlify):server/functions/api.js
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Middleware
app.use(cors());
app.use(express.json());

<<<<<<< HEAD:server/index.js
// Multer in-memory storage for Supabase upload
=======
// Multer in-memory storage
>>>>>>> 9d381ea (Final update for Netlify):server/functions/api.js
const upload = multer({ storage: multer.memoryStorage() });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Helper to upload image to Netlify Blobs
const uploadToBlobs = async (file) => {
  const store = getStore('news-images');
  const fileName = `${Date.now()}-${file.originalname}`;
  
  await store.set(fileName, file.buffer, {
    contentType: file.mimetype
  });

  // Untuk Netlify Blobs, kita butuh endpoint khusus untuk membacanya
  // atau menggunakan URL publik jika dikonfigurasi. 
  // Agar simpel, kita simpan key-nya saja.
  return fileName;
};

const router = express.Router();

// --- AUTH ROUTES ---
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- NEWS ROUTES ---
router.get('/news/public', async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/news', authenticateToken, async (req, res) => {
  try {
    const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/news/:id', async (req, res) => {
  try {
    const news = await prisma.news.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD:server/index.js
// Helper to upload image to Supabase
async function uploadToSupabase(file) {
  if (!supabase || !file) return null;
  
  const fileName = `${Date.now()}-${file.originalname}`;
  const { data, error } = await supabase.storage
    .from('news-images') // User must create this bucket
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) throw error;
  
  const { data: publicUrlData } = supabase.storage
    .from('news-images')
    .getPublicUrl(fileName);
    
  return publicUrlData.publicUrl;
}

// Create news
app.post('/api/news', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, tag, imageDescription, highlight, content, status } = req.body;
  
  try {
    const image = req.file ? await uploadToSupabase(req.file) : null;
    
=======
router.post('/news', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, tag, imageDescription, highlight, content, status } = req.body;
  try {
    const imageKey = req.file ? await uploadToBlobs(req.file) : null;
>>>>>>> 9d381ea (Final update for Netlify):server/functions/api.js
    const news = await prisma.news.create({
      data: { title, tag, image: imageKey, imageDescription, highlight, content, status: status || 'hold' },
    });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/news/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, tag, imageDescription, highlight, content, status } = req.body;
<<<<<<< HEAD:server/index.js
  const updateData = {
    title,
    tag,
    imageDescription,
    highlight,
    content,
    status,
  };

  try {
    if (req.file) {
      updateData.image = await uploadToSupabase(req.file);
    }

    const news = await prisma.news.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
    });
=======
  const updateData = { title, tag, imageDescription, highlight, content, status };
  try {
    if (req.file) {
      updateData.image = await uploadToBlobs(req.file);
    }
    const news = await prisma.news.update({ where: { id: parseInt(req.params.id) }, data: updateData });
>>>>>>> 9d381ea (Final update for Netlify):server/functions/api.js
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint untuk mengambil gambar dari Blobs
router.get('/images/:key', async (req, res) => {
  try {
    const store = getStore('news-images');
    const blob = await store.get(req.params.key, { type: 'blob' });
    if (!blob) return res.status(404).send('Image not found');
    
    res.setHeader('Content-Type', blob.type);
    const buffer = Buffer.from(await blob.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete('/news/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.news.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/news/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  try {
    const news = await prisma.news.update({ where: { id: parseInt(req.params.id) }, data: { status } });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const totalNews = await prisma.news.count();
    const publishedNews = await prisma.news.count({ where: { status: 'published' } });
    const holdNews = await prisma.news.count({ where: { status: 'hold' } });
    res.json({ totalNews, publishedNews, holdNews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use('/api', router);

module.exports.handler = serverless(app);
