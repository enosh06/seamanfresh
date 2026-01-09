# 🚀 Free Deployment Guide for Seaman Fresh

Your application is ready to be deployed! Because you have 3 parts (Client, Admin, Server), we will deploy them to the best free platforms.

## 📦 Architecture Overview
1.  **Database**: Holds all your data (MySQL). We'll use **TiDB Cloud** or **Aiven** (Free).
2.  **Server (Backend)**: The brain. We'll deploy to **Render.com** (Free).
3.  **Client & Admin (Frontend)**: The websites. We'll deploy to **Vercel** (Free).

---

## Step 1: Set up the Cloud Database (Free MySQL)
1.  Go to [TiDB Cloud](https://tidbcloud.com/) and sign up.
2.  Create a **Free Serverless Tier** Cluster.
3.  Once created, click **"Connect"** to get your credentials.
4.  You will need these value for Step 2:
    *   Host (e.g., `gateway01.us-east-1.prod.aws.tidbcloud.com`)
    *   Port (usually `4000`)
    *   User
    *   Password
    *   Database Name
5.  **Important**: You need to run your database tables SQL script on this new cloud database. You can use a tool like **DBeaver** or **HeidiSQL** to connect to it using the credentials above and run your `database.sql` content.

---

## Step 2: Deploy the Backend (Server)
1.  Push your code to **GitHub**.
2.  Go to [Render.com](https://render.com/) and sign up.
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repo.
5.  **Settings**:
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
    *   **Environment Variables** (Add these):
        *   `DB_HOST`: (from Step 1)
        *   `DB_USER`: (from Step 1)
        *   `DB_PASS`: (from Step 1)
        *   `DB_NAME`: (from Step 1)
        *   `DB_PORT`: `4000` (or whatever your provider gave)
        *   `PORT`: `5000`
        *   `JWT_SECRET`: `securesecretkey123` (Change this!)
6.  Click **Deploy**.
7.  Once done, Render will give you a URL (e.g., `https://seaman-fresh-api.onrender.com`). **Copy this URL.**

---

## Step 3: Deploy the Storefront (Client)
1.  Go to [Vercel.com](https://vercel.com/) and sign up.
2.  Click **"Add New..."** -> **Project**.
3.  Import your GitHub repo.
4.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Framework Preset**: Vite (should detect automatically).
    *   **Environment Variables**:
        *   `VITE_API_URL`: Paste your Render Backend URL (e.g., `https://seaman-fresh-api.onrender.com`). **Do not add a trailing slash.**
5.  Click **Deploy**.
6.  Vercel will give you a live URL (e.g., `https://seaman-fresh-store.vercel.app`). **Copy this URL.**

---

## Step 4: Deploy the Admin Panel
1.  Go back to **Vercel Dashboard**.
2.  Click **"Add New..."** -> **Project** (Import the SAME repo again).
3.  **Configure Project**:
    *   **Project Name**: `seaman-fresh-admin` (so it's different from client).
    *   **Root Directory**: Click "Edit" and select `admin-panel`.
    *   **Environment Variables**:
        *   `VITE_API_URL`: Paste your Render Backend URL.
        *   `VITE_STORE_URL`: Paste your Vercel Client URL (from Step 3).
4.  Click **Deploy**.

---

## 🎉 Done!
*   **Storefront**: `https://your-client-app.vercel.app`
*   **Admin Panel**: `https://your-admin-app.vercel.app`
*   **Backend**: `https://your-server.onrender.com`

**Note**: The free backend on Render spins down after 15 minutes of inactivity. The first request might take 30-50 seconds to verify. This is normal for the free tier.
