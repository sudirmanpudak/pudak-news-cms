const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Middleware
app.use(cors());
app.use(express.json());

// Multer in-memory storage for Supabase upload
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

// --- AUTH ROUTES ---

app.post('/api/auth/login', async (req, res) => {
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

// Public: Get all published news
app.get('/api/news/public', async (req, res) => {
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

// Private: Get all news (for admin)
app.get('/api/news', authenticateToken, async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single news
app.get('/api/news/:id', async (req, res) => {
  try {
    const news = await prisma.news.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
    
    const news = await prisma.news.create({
      data: {
        title,
        tag,
        image,
        imageDescription,
        highlight,
        content,
        status: status || 'hold',
      },
    });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update news
app.put('/api/news/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, tag, imageDescription, highlight, content, status } = req.body;
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
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete news
app.delete('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.news.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle status
app.patch('/api/news/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  try {
    const news = await prisma.news.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stats for dashboard
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const totalNews = await prisma.news.count();
    const publishedNews = await prisma.news.count({ where: { status: 'published' } });
    const holdNews = await prisma.news.count({ where: { status: 'hold' } });
    
    res.json({ totalNews, publishedNews, holdNews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
