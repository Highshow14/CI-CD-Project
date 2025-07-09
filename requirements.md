# Project 2: CI/CD Pipeline Implementation Challenge
## Nebulance Systems DevOps BootCamp

## Assignment Overview

You are provided with a complete 3-tier Node.js web application that requires CI/CD pipeline implementation using CircleCI. Your task is to analyze the existing application, implement automated testing and deployment processes, and make the application accessible via the internet.

**This is a practical DevOps challenge - no step-by-step instructions provided. Demonstrate your ability to implement production-ready CI/CD pipelines.**

## Application Overview

### What You're Working With
A fully functional 3-tier web application with:
- **Interactive Web Dashboard**: User and post management interface
- **RESTful API**: Complete backend with 11 endpoints
- **Real-time Features**: Live statistics and data visualization
- **Reset Functionality**: Data management capabilities
- **Health Monitoring**: System status and version tracking

### Technical Stack
- **Frontend**: HTML5/CSS3/JavaScript (responsive design)
- **Backend**: Node.js 18+ with Express.js framework
- **Storage**: In-memory data store (no database setup required)
- **Testing**: Jest test suite (18 test cases, 88%+ coverage)
- **Quality**: ESLint + Prettier configuration included
- **Container**: Docker-ready with optimized Dockerfile

## Your Mission

### Primary Objective
Implement a complete CI/CD pipeline using CircleCI that:
1. **Automatically tests** the application on every code push
2. **Builds Docker images** and pushes to Docker Hub
3. **Makes the application accessible** via the internet
4. **Demonstrates DevOps best practices** with proper documentation

### Success Metrics
- ✅ **Pipeline Automation**: CircleCI triggers on GitHub commits
- ✅ **Quality Gates**: All 18 tests pass with 88%+ coverage
- ✅ **Container Deployment**: Docker images build and deploy successfully
- ✅ **Internet Access**: Application accessible via public URL
- ✅ **Monitoring**: Health checks validate deployment status

## Technical Requirements

### Tools You Must Use
- **GitHub**: Source code repository and version control
- **CircleCI**: CI/CD pipeline automation (free tier available)
- **Docker Hub**: Container image registry (free tier available)
- **Cloud Platform**: Deploy to AWS, Google Cloud, Azure, or similar

### Pipeline Expectations
1. **Continuous Integration**
   - Automated testing on every commit
   - Code quality validation (linting)
   - Test coverage reporting

2. **Continuous Deployment**
   - Docker image building and publishing
   - Automated deployment to cloud platform
   - Environment variable management

3. **Monitoring & Validation**
   - Health check endpoints
   - Deployment verification
   - Application accessibility testing

## Deliverables

### What You Must Submit
1. **GitHub Repository URL** with your implemented CI/CD pipeline
2. **Live Application URL** where the app is accessible on the internet
3. **CircleCI Dashboard** showing successful pipeline runs
4. **Docker Hub Repository** with your built images
5. **Documentation** explaining your implementation approach

### Demonstration Requirements
Your submission must prove:
- **Automated Pipeline**: Show CircleCI building and deploying on code changes
- **Live Application**: Provide working URL to access the web interface
- **Container Registry**: Docker Hub repository with tagged images
- **Health Monitoring**: Application health endpoint responding correctly
- **Reset Functionality**: Demonstrate the data reset feature works

## Evaluation Criteria

### Technical Implementation (70%)
- **CI/CD Pipeline**: Automated testing and deployment (30%)
- **Container Deployment**: Docker images and cloud deployment (25%)
- **Application Access**: Live, functional web application (15%)

### DevOps Practices (30%)
- **Documentation**: Clear setup and deployment instructions (15%)
- **Best Practices**: Proper CI/CD methodology and security (15%)

## Success Indicators

**You've succeeded when someone can:**
- Visit your live application URL and use all features
- View your CircleCI pipeline and see successful builds
- Access your Docker Hub repository and pull your images
- Follow your documentation to understand your approach
- See the congratulations message for completing Project 2

## Getting Started

### Explore the Application First
1. **Run Locally**: Get the application working on your machine
   ```bash
   npm install
   npm start
   # Visit http://localhost:3000
   ```

2. **Test the Features**: Understand what you're deploying
   - Create users and posts via the web interface
   - Test the reset functionality
   - Check health endpoints
   - Run the test suite: `npm test`

3. **Examine the Code Structure**: Understand the architecture
   - Review `server.js` for API endpoints
   - Check `public/index.html` for frontend
   - Look at `test/server.test.js` for test coverage
   - Study the existing `Dockerfile`

### Your Implementation Strategy
1. **Set up accounts** for GitHub, CircleCI, and Docker Hub
2. **Create your repository** and connect to CircleCI
3. **Configure the pipeline** for testing and building
4. **Deploy to a cloud platform** of your choice
5. **Document your approach** and provide access URLs

## Important Notes

- **No Step-by-Step Guide**: This tests your DevOps problem-solving skills
- **Use Free Tiers**: All required services offer free tiers for learning
- **Focus on Automation**: Manual deployment doesn't meet requirements
- **Document Everything**: Others should understand your implementation
- **Test Thoroughly**: Ensure all features work in production

## Final Reminder

**Success = Live Application + Automated Pipeline + Clear Documentation**

Your goal is to make this application accessible on the internet through a fully automated CI/CD pipeline. When complete, you should see the congratulations message for successfully implementing Project 2 of the Nebulance Systems DevOps BootCamp.
