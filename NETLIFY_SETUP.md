# Deploying to Netlify

Since your project contains two separate frontend applications (`client` and `admin-panel`), you should create **two separate sites** on Netlify, both linked to the same GitHub repository.

## Prerequisites
1. Ensure your latest code is pushed to GitHub.
2. Sign in to [Netlify](https://app.netlify.com/).

---

## 1. Deploying the Client App (Customer Facing)

1. On the Netlify Dashboard, click **"Add new site"** -> **"Import from existing project"**.
2. Select **GitHub**.
3. Choose your repository: `seaman-fresh`.
4. Configure the build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy**.

## 2. Deploying the Admin Panel

1. Go back to the Netlify Dashboard.
2. Click **"Add new site"** -> **"Import from existing project"** again.
3. Select **GitHub** and choose the **same repository** (`seaman-fresh`).
4. Configure the build settings:
   - **Base directory**: `admin-panel`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy**.

---

## 3. Environment Variables

You need to add your environment variables to Netlify for the apps to talk to your backend.

### For Client App:
1. Go to **Site Settings** > **Environment variables**.
2. Add the variables from your `client/.env` file:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-render-backend-url.onrender.com`)
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key

### For Admin Panel:
1. Go to **Site Settings** > **Environment variables**.
2. Add the variables from your `admin-panel/.env` file:
   - `VITE_API_URL`: Your backend URL (same as above)

---

## Important Note on Backend
Netlify is primarily for static files and frontend apps. Your **Node.js/Express Backend** (`server/` folder) should **NOT** be deployed to Netlify. It should remain on **Render**, **Railway**, or **Heroku**.

Your Frontends (on Netlify) will verify successfully but they need the Backend (on Render) to be running to fetch data.
