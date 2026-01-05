# Streamify Video Calls - Vercel Deployment Guide

## Backend Deployment (Deploy First)

### 1. Navigate to Backend
```bash
cd backend
```

### 2. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 3. Deploy Backend
```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: streamify-backend (or your choice)
- **Directory**: `./`
- **Override settings**: No

### 4. Set Environment Variables
After deployment, add these environment variables in Vercel Dashboard:
- Go to your project → Settings → Environment Variables
- Add each variable from `.env.example`:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `STREAM_API_KEY`
  - `STREAM_API_SECRET`
  - `PORT` (set to 5001)
  - `NODE_ENV` (set to production)
  - `FRONTEND_URL` (set this later after frontend deployment)

### 5. Get Backend URL
Copy your backend URL (e.g., `https://streamify-backend.vercel.app`)

### 6. Update FRONTEND_URL
- Go back to Environment Variables
- Update `FRONTEND_URL` after frontend is deployed

---

## Frontend Deployment (Deploy Second)

### 1. Navigate to Frontend
```bash
cd frontend
```

### 2. Create .env file
Create `.env` in the frontend folder:
```env
VITE_API_URL=https://your-backend.vercel.app/api
```
Replace with your actual backend URL from step 5 above.

### 3. Deploy Frontend
```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: streamify-frontend (or your choice)
- **Directory**: `./`
- **Override settings**: No

### 4. Set Environment Variable
After deployment, add environment variable in Vercel Dashboard:
- Go to your project → Settings → Environment Variables
- Add: `VITE_API_URL` with value `https://your-backend.vercel.app/api`

### 5. Get Frontend URL
Copy your frontend URL (e.g., `https://streamify-frontend.vercel.app`)

### 6. Update Backend CORS
- Go to your backend project in Vercel Dashboard
- Settings → Environment Variables
- Update `FRONTEND_URL` with your frontend URL
- Redeploy the backend

---

## Production Deployment Commands

For future updates:

**Backend:**
```bash
cd backend
vercel --prod
```

**Frontend:**
```bash
cd frontend
vercel --prod
```

---

## Important Notes

1. **Deploy Backend First**: The frontend needs the backend URL
2. **Update CORS**: After frontend deployment, update backend's `FRONTEND_URL`
3. **Environment Variables**: Must be set in Vercel Dashboard for each project
4. **Redeploy**: After changing environment variables, redeploy the affected service
5. **MongoDB**: Ensure MongoDB accepts connections from anywhere (0.0.0.0/0) for Vercel
6. **GetStream**: Ensure your Stream API keys are valid and have proper permissions

---

## Troubleshooting

### Backend Issues
- Check logs: `vercel logs <deployment-url>`
- Verify all environment variables are set
- Check MongoDB connection string and network access

### Frontend Issues
- Ensure `VITE_API_URL` is set correctly
- Check browser console for CORS errors
- Verify backend URL includes `/api` suffix

### CORS Errors
- Confirm `FRONTEND_URL` is set in backend environment variables
- Ensure it matches your frontend URL exactly (no trailing slash)
- Redeploy backend after updating CORS settings
