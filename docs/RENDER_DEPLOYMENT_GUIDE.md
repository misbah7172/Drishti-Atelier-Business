# Drishti Atelier — Render Hosting Guide (Client & Server Separately)

This guide details how to deploy the **Server (Node.js API)** and **Client (React + Vite SPA)** separately on [Render](https://render.com).

---

## Architecture Overview

```
┌─────────────────────────────────┐       API Requests       ┌──────────────────────────────────┐
│  Client (Static Site)           │ ───────────────────────> │  Server (Web Service)            │
│  https://drishti-web.onrender.app│                         │  https://drishti-api.onrender.com│
└─────────────────────────────────┘                          └──────────────────────────────────┘
                 │                                                            │
                 │                                                            ▼
                 ▼                                              ┌───────────────────────────┐
     Patron Browser / Devices                                   │  Neon PostgreSQL Database │
                                                                └───────────────────────────┘
```

---

## Method 1: Automated Blueprint Deployment (Recommended)

The repository includes a ready-to-use [`render.yaml`](../render.yaml) blueprint file.

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository (`Drishti-Atelier-Business`).
4. Select the branch to deploy (`develop` or `main`).
5. Render will automatically discover both services:
   - `drishti-api` (Web Service)
   - `drishti-web` (Static Site)
6. Supply the required environment variables prompted in the wizard (see below).
7. Click **Apply**. Render will build and deploy both services automatically.

---

## Method 2: Manual Deployment (Step-by-Step)

If you prefer to configure each service individually in the Render dashboard:

### Step 1: Deploy the Server (Web Service)

1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your repository: `Drishti-Atelier-Business`.
3. Configure the service settings:
   - **Name**: `drishti-api` (or your preferred name)
   - **Region**: Choose closest to your database (e.g., `Oregon (US West)` or `Frankfurt`)
   - **Branch**: `develop`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Under **Advanced**, set **Health Check Path**:
   - `/health`
5. Under **Environment Variables**, add:
   | Key | Value / Example | Notes |
   |-----|-----------------|-------|
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `10000` | Auto-provided by Render |
   | `DATABASE_URL` | `postgresql://user:pass@host/neondb?sslmode=require` | Your Neon DB connection string |
   | `JWT_SECRET` | *(Generate a 32+ character random string)* | E.g. `your-jwt-secret-key-min-32-chars` |
   | `JWT_EXPIRES_IN` | `7d` | Token expiration duration |
   | `CLIENT_URL` | `https://drishti-web.onrender.com,http://localhost:5173` | Allowed frontend domains (comma-separated) |
   | `GOOGLE_CLIENT_ID` | `your-google-client-id-here.apps.googleusercontent.com` | Google OAuth Client ID |
   | `GOOGLE_CLIENT_SECRET` | `your-google-client-secret-here` | Google OAuth Client Secret |
   | `GOOGLE_REDIRECT_URI` | `https://drishti-api.onrender.com` | Your backend URL on Render |
6. Click **Create Web Service**. Wait for the build and deployment to succeed. Note down your API URL (e.g. `https://drishti-api.onrender.com`).

---

### Step 2: Deploy the Client (Static Site)

1. In Render Dashboard, click **New +** > **Static Site** *(Recommended: Static Sites are 100% free forever, do not count against Web Service hours, and never sleep!)*.
   > **Note**: If you created it as a **Web Service** instead of a **Static Site**, set **Start Command** to `npm start` (or `node serve.js`). It will automatically serve `dist/` on `0.0.0.0:$PORT` without timing out!
2. Connect your repository: `Drishti-Atelier-Business`.
3. Configure the settings:
   - **Name**: `drishti-web`
   - **Branch**: `develop`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (if using Static Site)
4. Under **Redirects/Rewrites**:
   - The repository includes [`client/public/_redirects`](../client/public/_redirects) which Vite automatically bundles into `dist/`.
   - You can also add a rewrite rule in the dashboard:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
5. Under **Environment Variables**, add:
   | Key | Value / Example | Notes |
   |-----|-----------------|-------|
   | `VITE_API_URL` | `https://drishti-api.onrender.com/api` | Your Render Server URL from Step 1 |
   | `VITE_GOOGLE_CLIENT_ID` | `your-google-client-id-here.apps.googleusercontent.com` | Google OAuth Client ID |
6. Click **Create Static Site**.

---

### Step 3: Google Cloud Console Configuration

To allow patrons to authenticate with Google on your Render domain:

1. Open [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Select your project: `drishti-510310`.
3. Click on your **OAuth 2.0 Web Client ID**.
4. Under **Authorized JavaScript Origins**, add:
   - `https://drishti-web.onrender.com` (your client Render URL)
   - `http://localhost:5173` (for local development)
5. Under **Authorized Redirect URIs**, add:
   - `https://drishti-api.onrender.com` (your server Render URL)
   - `https://drishti-api.onrender.com/api/auth/google/callback`
   - `http://localhost:5000`
6. Click **Save**.

---

## Verification Checklist

- [x] Client SPA rewrites configured (`client/public/_redirects`) to prevent 404s on subpaths (`/shop`, `/login`, etc.)
- [x] Node.js engine compatibility added (`>=18.0.0`) in both `package.json` files
- [x] Server bound to `0.0.0.0` for Linux container hosting
- [x] CORS updated to accept `*.onrender.com` domains automatically
- [x] Dedicated `/health` and `/api/health` endpoints available for Render health checks
- [x] Client `api.js` automatically handles `/api` path normalization
