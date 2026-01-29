# Seaman Fresh - Deployment Guide

This guide details how to deploy the Seaman Fresh application using the following stack:
- **Frontend**: Cloudflare Pages
- **Backend**: Render (Free tier)
- **Database**: TiDB Cloud (Free MySQL)
- **Object Storage**: Cloudinary (Free tier)

## Prerequisites
Ensure (or create) accounts for:
1. [GitHub](https://github.com/)
2. [Cloudflare](https://dash.cloudflare.com/)
3. [Render](https://dashboard.render.com/)
4. [TiDB Cloud](https://tidbcloud.com/)
5. [Cloudinary](https://cloudinary.com/)

---

## Step 1: Database Setup (TiDB Cloud)
1. **Create Cluster**: 
   - Log in to TiDB Cloud and create a "Serverless" Tier cluster (free).
   - Note the **Connection Details**: Host, Port (usually 4000), User, Password.
   - *Note: Ensure you allow traffic from "Anywhere" (0.0.0.0/0) or specifically from Render IPs if possible (0.0.0.0/0 is easiest for serverless).*

2. **Initialize Database**:
   - Use a SQL client (like DBeaver, MySQL Workbench) or the TiDB Cloud SQL Editor.
   - Run the contents of `schema.sql` (found in the root of this project) to create tables.

3. **Get CA Certificate (Optional)**:
   - TiDB connections are secure by default. Node.js usually handles the certificates automatically with standard SSL options, which we have configured in `server/config/db.js`.

---

## Step 2: Object Storage Setup (Cloudinary)
1. Log in to Cloudinary.
2. Go to the **Dashboard**.
3. Copy the **Cloud Name**, **API Key**, and **API Secret**.

---

## Step 3: Backend Deployment (Render)
1. **Push to GitHub**: Ensure your latest code is pushed to your repository.
2. **Create Web Service**:
   - In Render Dashboard, Click `New +` -> `Web Service`.
   - Connect your GitHub repository.
3. **Configuration**:
   - **Name**: `seaman-fresh-api` (or similar)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: Free
4. **Environment Variables**:
   Add the following variables under the "Environment" tab:
   
   | Key | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `DB_HOST` | *Your TiDB Host* |
   | `DB_USER` | *Your TiDB User* |
   | `DB_PASS` | *Your TiDB Password* |
   | `DB_NAME` | *Your Database Name (e.g. test)* |
   | `DB_PORT` | `4000` (or whatever TiDB provides) |
   | `DB_SSL` | `true` |
   | `CLOUDINARY_CLOUD_NAME` | *Your Cloud Name* |
   | `CLOUDINARY_API_KEY` | *Your API Key* |
   | `CLOUDINARY_API_SECRET` | *Your API Secret* |
   | `JWT_SECRET` | *Generate a random secure string* |

5. **Deploy**: Click "Create Web Service". Wait for the deployment to succeed. API URL will be something like `https://seaman-fresh-api.onrender.com`.

---

## Step 4: Frontend Deployment (Cloudflare Pages)
1. **Create Application**:
   - In Cloudflare Dashboard, go to "Workers & Pages" -> "Create Application" -> "Pages" -> "Connect to Git".
   - Select your repository.
2. **Build Settings**:
   - **Project Name**: `seaman-fresh` (or similar)
   - **Production branch**: `main`
   - **Framework Preset**: `Vite` (Cloudflare might auto-detect this).
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `client`  <-- **IMPORTANT**: Set this to `client`.
3. **Environment Variables**:
   - `VITE_API_URL`: *The URL of your deployed Render Backend* (e.g., `https://seaman-fresh-api.onrender.com`)
4. **Deploy**: Click "Save and Deploy".

---

## Step 5: Admin Panel Deployment (Cloudflare Pages)
*You can deploy the admin panel as a separate project or on a subpath. A separate project is easiest.*

1. **Create Application**:
   - Same steps as Frontend.
2. **Build Settings**:
   - **Framework Preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `admin-panel` <-- **IMPORTANT**
3. **Environment Variables**:
   - `VITE_API_URL`: *The URL of your deployed Render Backend*.
4. **Deploy**: Click "Save and Deploy".

---

## Verification
1. Open the Client URL.
2. Create an account/login.
3. Verify products load (database connection works).
4. Go to Admin Panel (you may need to manually update your user role in the DB to 'admin').
5. Try uploading a product image. If it works, Cloudinary and the Backend are connected correctly.
