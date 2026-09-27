# Vercel Deployment Guide — Drishti Atelier Client

This guide explains how to deploy the **Drishti Atelier** frontend to [Vercel](https://vercel.com/) with zero configuration issues.

---

## Option 1: Deploy via Vercel Web Dashboard (Recommended)

1. **Sign in to Vercel**:
   Go to [vercel.com](https://vercel.com) and log in with your GitHub account.

2. **Import Project**:
   - Click **"Add New..."** → **"Project"**.
   - Select your repository: `misbah7172/Drishti-Atelier-Business`.

3. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (Auto-detected).
   - **Root Directory**: Click `Edit` and select `client` (or leave as root `./`, both work seamlessly due to root & client `vercel.json` configurations).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` (or `client/dist` if root was selected)
   - **Install Command**: `npm install`

4. **Environment Variables** (Optional):
   - `VITE_API_URL`: Set to your production backend URL (e.g. `https://your-backend.onrender.com/api` or `https://api.yourdomain.com`).
   - If not set, defaults to `/api`.

5. **Deploy**:
   - Click **"Deploy"**.
   - Vercel will build and deploy the application in ~30 seconds.

---

## Option 2: Deploy via Vercel CLI

From your terminal:

```bash
# 1. Install Vercel CLI globally (if not installed)
npm install -g vercel

# 2. Navigate to client directory
cd client

# 3. Deploy
vercel
```

Follow the interactive prompts:
- Set up and deploy: **Yes**
- Which scope: Select your personal or team account
- Link to existing project: **No** (first time) or **Yes**
- Project name: `drishti-atelier`
- In which directory is your code located: `./`

For production deployment:
```bash
vercel --prod
```

---

## Pre-configured Optimizations in this Repository

1. **SPA Rewrites (`vercel.json`)**:
   - All React Router client-side routes (`/shop`, `/product/:id`, `/about`, etc.) automatically rewrite to `index.html` preventing 404 errors on page refresh.

2. **Asset Caching Headers**:
   - Production bundle assets (`/assets/*`) have immutable 1-year caching headers for lightning-fast subsequent visits.
   - Images and SVGs have 24-hour cache with `stale-while-revalidate`.

3. **Social & SEO Open Graph Tags**:
   - `index.html` includes rich Open Graph and Twitter Card tags for link previews when sharing on social media, WhatsApp, Discord, or LinkedIn.
