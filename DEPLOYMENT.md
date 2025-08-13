# Deployment Guide

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Setup

1. **Clone the repository**

2. **Set up the server**
   ```bash
   cd server
   cp .env.example .env  # Create and configure your .env file
   npm install
   npm run dev
   ```

3. **Set up the client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Steps

1. **Build and run the containers**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

3. **Stop the containers**
   ```bash
   docker-compose down
   ```

## Cloud Deployment

### Frontend (Vercel/Netlify)

#### Vercel Deployment

1. **Create a Vercel account** at https://vercel.com

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy from the client directory**
   ```bash
   cd client
   vercel
   ```

4. **Configure environment variables**
   - Set `VITE_API_URL` to your backend URL

#### Netlify Deployment

1. **Create a Netlify account** at https://netlify.com

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy from the client directory**
   ```bash
   cd client
   netlify deploy
   ```

4. **Configure environment variables**
   - Set `VITE_API_URL` to your backend URL

### Backend (Heroku/Railway)

#### Heroku Deployment

1. **Create a Heroku account** at https://heroku.com

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

3. **Login to Heroku**
   ```bash
   heroku login
   ```

4. **Create a new Heroku app**
   ```bash
   heroku create your-app-name
   ```

5. **Add MongoDB add-on**
   ```bash
   heroku addons:create mongodb:sandbox
   ```

6. **Configure environment variables**
   ```bash
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

7. **Deploy the backend**
   ```bash
   git subtree push --prefix server heroku main
   ```

#### Railway Deployment

1. **Create a Railway account** at https://railway.app

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login to Railway**
   ```bash
   railway login
   ```

4. **Initialize a new project**
   ```bash
   cd server
   railway init
   ```

5. **Add MongoDB plugin**
   ```bash
   railway add
   ```
   Select MongoDB from the list

6. **Configure environment variables**
   ```bash
   railway variables set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

7. **Deploy the backend**
   ```bash
   railway up
   ```

## Continuous Integration/Deployment

For CI/CD, you can use GitHub Actions to automatically test and deploy your application.

1. Create a `.github/workflows/ci.yml` file for testing
2. Create a `.github/workflows/deploy.yml` file for deployment

Refer to the GitHub Actions documentation for more details.