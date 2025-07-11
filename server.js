const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
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

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Utility functions
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

// Metrics (NEW)
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
