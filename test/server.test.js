const request = require('supertest');
const app = require('../server');

describe('3-Tier CI/CD Application Tests', () => {
  
  describe('Health Check and System Endpoints', () => {
    test('GET /health should return healthy status with database info', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('database');
      expect(response.body.database).toHaveProperty('users');
      expect(response.body.database).toHaveProperty('posts');
    });

    test('GET /version should return version information', async () => {
      const response = await request(app).get('/version');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('buildTime');
      expect(response.body).toHaveProperty('gitCommit');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('Users API (Data Tier)', () => {
    test('GET /api/users should return all users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('GET /api/users/:id should return specific user', async () => {
      const response = await request(app).get('/api/users/1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('role');
    });

    test('GET /api/users/:id should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/users/999');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('POST /api/users should create new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newUser.name);
      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data.role).toBe(newUser.role);
    });

    test('POST /api/users should return 400 for missing required fields', async () => {
      const invalidUser = {
        name: 'Test User'
        // missing email
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Name and email are required');
    });
  });

  describe('Posts API (Content Management)', () => {
    test('GET /api/posts should return all posts with authors', async () => {
      const response = await request(app).get('/api/posts');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('author');
    });

    test('GET /api/posts/:id should return specific post with author', async () => {
      const response = await request(app).get('/api/posts/1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('content');
      expect(response.body.data).toHaveProperty('author');
    });

    test('GET /api/posts/:id should return 404 for non-existent post', async () => {
      const response = await request(app).get('/api/posts/999');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Post not found');
    });

    test('POST /api/posts should create new post', async () => {
      const newPost = {
        title: 'Test Post',
        content: 'This is a test post content',
        userId: 1
      };

      const response = await request(app)
        .post('/api/posts')
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(newPost.title);
      expect(response.body.data.content).toBe(newPost.content);
      expect(response.body.data).toHaveProperty('author');
    });

    test('POST /api/posts should return 400 for missing required fields', async () => {
      const invalidPost = {
        title: 'Test Post'
        // missing content and userId
      };

      const response = await request(app)
        .post('/api/posts')
        .send(invalidPost);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title, content, and userId are required');
    });

    test('POST /api/posts should return 400 for invalid userId', async () => {
      const invalidPost = {
        title: 'Test Post',
        content: 'Test content',
        userId: 999 // non-existent user
      };

      const response = await request(app)
        .post('/api/posts')
        .send(invalidPost);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid userId');
    });
  });

  describe('Dashboard API (Business Logic)', () => {
    test('GET /api/dashboard should return combined statistics', async () => {
      const response = await request(app).get('/api/dashboard');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(response.body.data).toHaveProperty('totalPosts');
      expect(response.body.data).toHaveProperty('recentPosts');
      expect(response.body.data).toHaveProperty('recentUsers');
      expect(Array.isArray(response.body.data.recentPosts)).toBe(true);
      expect(Array.isArray(response.body.data.recentUsers)).toBe(true);
    });
  });

  describe('Frontend (Presentation Tier)', () => {
    test('GET / should return HTML frontend', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.type).toBe('text/html');
      expect(response.text).toContain('3-Tier CI/CD Demo Application');
    });
  });

  describe('Error Handling', () => {
    test('GET /nonexistent should return 404', async () => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Route not found');
      expect(response.body).toHaveProperty('path');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Data Management', () => {
    test('POST /api/reset should clear all data', async () => {
      const response = await request(app).post('/api/reset');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('All data cleared and counters reset to zero');
      
      // Verify data is cleared
      const usersResponse = await request(app).get('/api/users');
      expect(usersResponse.body.data).toHaveLength(0);
      
      const postsResponse = await request(app).get('/api/posts');
      expect(postsResponse.body.data).toHaveLength(0);
    });
  });

  describe('Integration Tests (3-Tier Flow)', () => {
    test('Complete user and post creation flow', async () => {
      // 1. Create a new user (Data Tier)
      const newUser = {
        name: 'Integration Test User',
        email: 'integration@test.com',
        role: 'admin'
      };

      const userResponse = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(userResponse.status).toBe(201);
      const createdUserId = userResponse.body.data.id;

      // 2. Create a new post for the user (Business Logic Tier)
      const newPost = {
        title: 'Integration Test Post',
        content: 'This post was created during integration testing',
        userId: createdUserId
      };

      const postResponse = await request(app)
        .post('/api/posts')
        .send(newPost);

      expect(postResponse.status).toBe(201);
      expect(postResponse.body.data.author).toBe(newUser.name);

      // 3. Verify dashboard updates (Presentation Tier)
      const dashboardResponse = await request(app).get('/api/dashboard');
      expect(dashboardResponse.status).toBe(200);
      expect(dashboardResponse.body.data.totalUsers).toBeGreaterThan(0);
      expect(dashboardResponse.body.data.totalPosts).toBeGreaterThan(0);
    });
  });
});