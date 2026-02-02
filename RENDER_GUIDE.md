# Render Backend Deployment Guide

## 🚀 Step 3: Deploy Backend to Render

### Part A: Setup Database First (Neon.tech - 2 minutes)

1. Go to: https://neon.tech
2. Sign up (free, no credit card required)
3. Create a project named `seaman_fresh`
4. In the Dashboard, find the **Connection Details** section
5. Copy the **Connection String** (URI). It looks like:
   `postgresql://neondb_owner:password@ep-red-smoke-ah247bnx-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require`

---

### Part B: Deploy Backend to Render (5 minutes)

1. Go to: https://dashboard.render.com/
2. Sign up with GitHub (easiest)
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect a repository"** → Select `enosh06/seaman-fresh`
5. **Configure the service:**

   **Basic Settings:**
   - **Name**: `seaman-fresh-api`
   - **Region**: Oregon (US West) - Free tier
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free

6. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   
   Add these variables:
   
   ```
   DATABASE_URL = (paste your Neon connection string here)
   JWT_SECRET = (your-super-secret-key)
   DB_SSL = true
   ```

7. Click **"Create Web Service"**

8. Wait 5-10 minutes for deployment.

9. **Important**: Once deployed, visit `https://your-api.onrender.com/api/setup` once to initialize the database tables.

---

### Part C: Update Vercel Environment Variables

Once your backend is deployed:

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click on **seaman-fresh-client** project (and admin-panel)
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL` to your new Render URL.
5. Save and **Redeploy**.

---

## ✅ Final Result

- ✅ Database: Neon PostgreSQL (running)
- ✅ Backend: https://seaman-fresh-api.onrender.com
- ✅ Client: https://seaman-fresh-client.vercel.app
- ✅ Admin: https://seaman-fresh-admin.vercel.app

**Your app is LIVE! 🎉**
