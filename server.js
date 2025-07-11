const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
// eslint-disable-next-line no-unused-vars
const PORT = process.env.PORT || 3000;

// Data Tier - Simple in-memory database
const database = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
  ],
  posts: [
    { id: 1, title: 'Welcome to Our App', content: 'This is a 3-tier application demo', userId: 1 },
    { id: 2, title: 'CI/CD Best Practices', content: 'Learn about continuous integration', userId: 2 }
  ],
  nextUserId: 3,
  nextPostId: 3
};

const startTime = Date.now();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Utility
const formatUptime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
};

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: formatUptime(Date.now() - startTime),
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      users: database.users.length,
      posts: database.posts.length
    }
  });
});

// Version Info
app.get('/version', (req, res) => {
  res.json({
    version: process.env.APP_VERSION || '1.0.0',
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
    gitCommit: process.env.GIT_COMMIT || 'unknown',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Metrics
app.get('/metrics', (req, res) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${Math.round(uptime)} seconds`,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
    }
  });
});

// Users API
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: database.users, count: database.users.length });
});

app.get('/api/users/:id', (req, res) => {
  const user = database.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

app.post('/api/users', (req, res) => {
  const { name, email, role = 'user' } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email are required' });

  const newUser = { id: database.nextUserId++, name, email, role };
  database.users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// Posts API
app.get('/api/posts', (req, res) => {
  const postsWithUsers = database.posts.map(post => {
    const user = database.users.find(u => u.id === post.userId);
    return { ...post, author: user ? user.name : 'Unknown' };
  });
  res.json({ success: true, data: postsWithUsers, count: postsWithUsers.length });
});

app.get('/api/posts/:id', (req, res) => {
  const post = database.posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  const user = database.users.find(u => u.id === post.userId);
  res.json({ success: true, data: { ...post, author: user ? user.name : 'Unknown' } });
});

app.post('/api/posts', (req, res) => {
  const { title, content, userId } = req.body;
  if (!title || !content || !userId) {
    return res.status(400).json({ success: false, message: 'Title, content, and userId are required' });
  }

  const user = database.users.find(u => u.id === parseInt(userId));
  if (!user) return res.status(400).json({ success: false, message: 'Invalid userId' });

  const newPost = { id: database.nextPostId++, title, content, userId: user.id };
  database.posts.push(newPost);
  res.status(201).json({ success: true, data: { ...newPost, author: user.name } });
});

// Dashboard
app.get('/api/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: database.users.length,
      totalPosts: database.posts.length,
      recentPosts: database.posts.slice(-3).map(post => {
        const user = database.users.find(u => u.id === post.userId);
        return { ...post, author: user ? user.name : 'Unknown' };
      }),
      recentUsers: database.users.slice(-3)
    }
  });
});

// Reset
app.post('/api/reset', (req, res) => {
  database.users = [];
  database.posts = [];
  database.nextUserId = 1;
  database.nextPostId = 1;
  res.json({ success: true, message: 'All data cleared and counters reset to zero' });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl, timestamp: new Date().toISOString() });
});

// Error Handling
app.use((err, req, res, _next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
    console.log(`Version Info: http://localhost:${PORT}/version`);
    console.log(`Metrics: http://localhost:${PORT}/metrics`);
  });
}

module.exports = app;
