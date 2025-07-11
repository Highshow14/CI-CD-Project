# CI/CD Pipeline Project - 3-Tier Node.js Web Application

This project demonstrates a complete CI/CD pipeline implementation using **CircleCI**, **Docker**, and **Kubernetes** (optional), based on a pre-built 3-tier Node.js web application.

---

## 🚀 Project Overview

A fully functional 3-tier web application consisting of:

- **Frontend**: HTML/CSS/JavaScript (served via `public/index.html`)
- **Backend**: Node.js (Express)
- **Storage**: In-memory (no external DB required)

### Features

- REST API with 11+ endpoints
- Real-time stats & dashboard
- Data reset functionality
- Health & version endpoints

---

## 🧱 Architecture

```
User --> Web UI --> Express Backend --> In-Memory Store
                      ^
                      |
            CircleCI + Docker Build
                      |
                  Docker Hub
                      |
                   Deployment
```

---

## ⚙️ Tech Stack

- **Node.js** v18+
- **Jest** for testing
- **ESLint + Prettier** for code quality
- **Docker** for containerization
- **CircleCI** for CI/CD automation
- *(Optional)* Kubernetes / Render for deployment

---

## 📁 Folder Structure

```
your-repo/
├── .circleci/           # CI/CD configuration
│   └── config.yml
├── k8s/                 # Kubernetes manifests (optional)
├── public/              # Frontend assets
├── test/                # Jest test cases
├── Dockerfile
├── server.js            # Node.js backend
├── package.json
├── .env.example         # Sample env file
├── .gitignore
├── README.md
└── .eslintrc.js
```

---

## ✅ Prerequisites

- Node.js v18+
- Docker installed
- GitHub & Docker Hub account
- CircleCI account (linked to GitHub)

---

## 🔧 Local Development

```bash
# Clone the repo
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Install dependencies
npm install

# Run the app
npm start

# Run tests
npm test
```

Access the app at: `http://localhost:3000`

---

## 🧪 Testing

```bash
npm run lint        # Code linting
npm test            # Runs 18+ Jest test cases
```

---

## 🐳 Docker Commands

```bash
# Build the image
docker build -t your-dockerhub-username/app-name:latest .

# Run the container
docker run -p 3000:3000 your-dockerhub-username/app-name:latest
```

---

## 🔁 CircleCI Pipeline

**Steps Included:**

1. Install dependencies
2. Lint the code
3. Run tests
4. Build Docker image
5. Push to Docker Hub

### `.circleci/config.yml`

```yaml
version: 2.1

orbs:
  node: circleci/node@5.0.2

jobs:
  install-dependencies:
    docker:
      - image: cimg/node:18.20
    steps:
      - checkout
      - run: npm ci

  lint:
    docker:
      - image: cimg/node:18.20
    steps:
      - checkout
      - run: npm ci
      - run: npm run lint

  build-and-test:
    docker:
      - image: cimg/node:18.20
    steps:
      - checkout
      - run: npm ci
      - run: npm run lint
      - run: npm test

  docker-publish:
    docker:
      - image: cimg/base:stable
    steps:
      - checkout
      - setup_remote_docker
      - run:
          name: Build Docker Image
          command: docker build -t your-dockerhub-username/app-name:latest .
      - run:
          name: Push Docker Image
          command: |
            echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin
            docker push your-dockerhub-username/app-name:latest

workflows:
  version: 2
  build-test-deploy:
    jobs:
      - install-dependencies
      - lint:
          requires:
            - install-dependencies
      - build-and-test:
          requires:
            - lint
      - docker-publish:
          requires:
            - build-and-test
```

> **Environment Variables:** Add these in CircleCI project settings:
>
> - `DOCKERHUB_USER`
> - `DOCKERHUB_PASS`

---

## ☁️ Deployment (Optional)

You can deploy the Docker image to any platform:

- **Render** (simple GUI-based deployment)
- **AWS EKS / GKE / AKS** (via Kubernetes)

---

## 🧪 Health Check

- `GET /health` → Status, uptime, version
- `GET /version` → Version metadata
- `POST /api/reset` → Reset all data

---

## 📃 License

This project is licensed under the MIT License.

---

## 🙋 Support

Feel free to open issues or submit PRs. Happy DevOps-ing!
