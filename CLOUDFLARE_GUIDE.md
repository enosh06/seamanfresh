# Cloudflare Deployment Guide

This guide will help you publish the **Seaman Fresh** website (Client and Admin Panel) to **Cloudflare Pages**.

## Prerequisites
1. A Cloudflare account.
2. [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed (automatically handled by the scripts).

## Step 1: Login to Cloudflare
Before deploying, you need to log in to your Cloudflare account via the command line. Run this in your terminal:

```bash
npx wrangler login
```
A browser window will open for you to authorize the CLI.

## Step 2: Deploy the Client (Frontend)
The client is the public-facing website.

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Build and deploy:
   ```bash
   npm run deploy
   ```
3. During the first deployment, you will be asked to:
   - Create a new project: **Yes**
   - Project name: **seaman-fresh-client**
   - Production branch: **main** (or your active branch)

Once finished, you will receive a URL like `https://seaman-fresh-client.pages.dev`.

## Step 3: Deploy the Admin Panel
1. Navigate to the `admin-panel` directory:
   ```bash
   cd ../admin-panel
   ```
2. Build and deploy:
   ```bash
   npm run deploy
   ```
3. During the first deployment, you will be asked to:
   - Create a new project: **Yes**
   - Project name: **seaman-fresh-admin**
   - Production branch: **main**

Alternatively, you can run these from the project root:
- Deploy Client: `npm run deploy:client`
- Deploy Admin: `npm run deploy:admin`
- Deploy All: `npm run deploy:all`

## Environment Variables
The `wrangler.toml` files in each directory are already configured with the necessary environment variables:
- `VITE_API_URL`: Points to your backend (currently `https://seaman-fresh-final.onrender.com`).
- `VITE_STORE_URL`: (Admin Panel only) Points to your client website.

If you change your backend URL or client URL, update these in `wrangler.toml` and redeploy.

## Automated Deployments (Optional)
For automatic deployments whenever you push to GitHub:
1. Go to the [Cloudflare Pages Dashboard](https://dash.cloudflare.com/?to=/:account/pages).
2. Click **Connect to git**.
3. Select your repository.
4. Set the following for the **Client**:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `client`
5. Repeat for the **Admin Panel** with **Root directory**: `admin-panel`.
