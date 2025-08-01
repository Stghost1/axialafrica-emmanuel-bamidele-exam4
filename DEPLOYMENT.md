# Deployment Guide for Render.com

## Quick Fix for "Not Found" Error

If you're getting a "not found" error on Render, follow these steps:

### 1. Check Render Configuration

In your Render dashboard, make sure:

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: `Node`

### 2. Environment Variables

Add these environment variables in Render dashboard:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
CORS_ORIGIN=*
```

### 3. Common Issues & Solutions

#### Issue: "Not Found" Error
**Solution**: The app now has a root route (`/`) that should resolve this.

#### Issue: Build Fails
**Solution**: 
- Remove `fs` from dependencies (already fixed)
- Make sure all files are committed to GitHub

#### Issue: App Crashes on Start
**Solution**: Check Render logs for specific error messages

### 4. Test Your Deployment

After deployment, test these endpoints:

- `https://your-app-name.onrender.com/` - Root endpoint
- `https://your-app-name.onrender.com/health` - Health check
- `https://your-app-name.onrender.com/api/upload/single` - Upload endpoint

### 5. Debugging

If still having issues:

1. Check Render logs in the dashboard
2. Make sure all files are pushed to GitHub
3. Verify environment variables are set correctly
4. Try redeploying the service

### 6. File Structure Check

Ensure your repository has these files:
```
├── server.js
├── package.json
├── routes/uploadRoutes.js
├── controllers/uploadController.js
├── middleware/upload.js
├── config/cloudinary.js
└── .gitignore
```

### 7. Alternative: Manual Deployment

If automatic deployment fails:

1. Go to Render dashboard
2. Create new Web Service
3. Connect your GitHub repo
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

The app should now work correctly on Render! 