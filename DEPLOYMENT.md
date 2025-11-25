# Deployment Guide for Quizify

This guide covers deploying your Quizify application to various free platforms.

## 🌐 Free Deployment Options

### Option 1: Railway (Recommended - Full Stack)
**Best for: Complete app deployment with persistent data**

1. **Prepare your project:**
```bash
# Run the deployment script
.\deploy.bat
```

2. **Create Railway account:**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub
   - Connect your GitHub repository

3. **Deploy:**
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect and deploy
   - Set environment variables in Railway dashboard:
     - `JWT_SECRET`: `your-super-secret-jwt-key`
     - `NODE_ENV`: `production`

### Option 2: Vercel (Full Stack)
**Best for: Serverless deployment**

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Set environment variables in Vercel dashboard:**
   - `JWT_SECRET`: `your-super-secret-jwt-key`

### Option 3: Render (Backend) + Netlify (Frontend)
**Best for: Separate frontend/backend hosting**

#### Backend on Render:
1. Go to [Render.com](https://render.com)
2. Connect GitHub repository
3. Create "Web Service"
4. Set build command: `cd server/server && npm install`
5. Set start command: `cd server/server && npm start`
6. Add environment variables

#### Frontend on Netlify:
1. Go to [Netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build directory: `client/build`
4. Set build command: `cd client && npm run build`

### Option 4: GitHub Pages (Frontend Only)
**Best for: Frontend with external backend API**

1. **Enable GitHub Actions** (already configured)
2. **Push to GitHub:**
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

3. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Source: "GitHub Actions"

## 🔧 Environment Variables

For all deployments, set these environment variables:

```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
PORT=4000
```

## 📦 Pre-deployment Checklist

- [ ] Run `.\deploy.bat` to build the project
- [ ] Commit and push all changes to GitHub
- [ ] Set up environment variables on your platform
- [ ] Test the deployed application
- [ ] Update README with your live URL

## 🌟 Platform Comparison

| Platform | Frontend | Backend | Database | Free Tier | Best For |
|----------|----------|---------|----------|-----------|----------|
| **Railway** | ✅ | ✅ | File-based | 500 hours/month | Full-stack apps |
| **Vercel** | ✅ | ✅ | File-based | Unlimited | Serverless apps |
| **Render** | ✅ | ✅ | File-based | 750 hours/month | Web services |
| **Netlify** | ✅ | ❌ | ❌ | Unlimited | Static sites |
| **GitHub Pages** | ✅ | ❌ | ❌ | Unlimited | Static sites |

## 🚀 Quick Deploy Commands

### Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### Vercel:
```bash
# Install and deploy
npm i -g vercel
vercel --prod
```

### Manual Deploy:
```bash
# Build and prepare
.\deploy.bat

# Then upload to your chosen platform
```

## 🔗 After Deployment

1. **Update API URL:** If frontend and backend are on different domains, update `REACT_APP_API_URL`
2. **Test all features:** Login, quiz creation, user management
3. **Monitor logs:** Check for any deployment issues
4. **Update README:** Add your live application URL

## 🆘 Troubleshooting

- **Build failures:** Check Node.js version (use Node 18+)
- **API errors:** Verify environment variables are set
- **CORS issues:** Update CORS settings in `app.js`
- **File permissions:** Ensure data directory is writable

Choose the platform that best fits your needs and follow the specific instructions above!