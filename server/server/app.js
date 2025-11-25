const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { port } = require('./config');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quizzes');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Create data directory and files if they don't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const usersFile = path.join(dataDir, 'users.json');
const quizzesFile = path.join(dataDir, 'quizzes.json');
const attemptsFile = path.join(dataDir, 'attempts.json');

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}
if (!fs.existsSync(quizzesFile)) {
  fs.writeFileSync(quizzesFile, JSON.stringify([]));
}
if (!fs.existsSync(attemptsFile)) {
  fs.writeFileSync(attemptsFile, JSON.stringify([]));
}

console.log('Using file-based data storage');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
  
  // Handle React Router - send all non-API requests to index.html
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes or static assets
    if (req.path.startsWith('/api/') || 
        req.path.includes('.') ||
        req.path.startsWith('/static/')) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, message: 'Server is running' }));

// Start server without MongoDB
console.log('Starting server without MongoDB...');
app.listen(port, () => console.log(`Server running on port ${port}`));
