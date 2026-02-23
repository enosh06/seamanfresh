# 🚀 Professional Deployment Guide for Seaman Fresh

This project is now configured for professional production deployment using **Render** (Backend) and **Netlify/Vercel** (Frontend).

## 1. Backend (Django) - Deploying to Render

The backend is configured to run with `gunicorn` and `whitenoise`.

### Environment Variables to set on Render:
- `DEBUG`: `False`
- `DJANGO_SECRET_KEY`: A long random string (Generated automatically if using `render.yaml`)
- `DATABASE_URL`: Your Neon/TiDB/PostgreSQL connection string.
- `ALLOWED_HOSTS`: `seaman-fresh-api.onrender.com` (Your Render URL)
- `CSRF_TRUSTED_ORIGINS`: `https://your-frontend-domain.com`
- `CORS_ALLOWED_ORIGINS`: `https://your-frontend-domain.com`

### Deployment Steps:
1. Connect your GitHub repository to **Render**.
2. Select the `render.yaml` blueprint or create a new **Web Service**.
3. Point to the `backend_django` directory.
4. **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate`
5. **Start Command**: `gunicorn core.wsgi`

---

## 2. Frontend (Client & Admin Panel)

Both frontends are Vite-based and use dynamic API discovery.

### Environment Variables to set on Netlify/Vercel/Pages:
- `VITE_API_URL`: Your backend URL (e.g., `https://seaman-fresh-api.onrender.com`)

### Deployment Steps (Client):
1. Connect `client/` directory to your hosting provider.
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. Add the `VITE_API_URL` environment variable.

### Deployment Steps (Admin Panel):
1. Connect `admin-panel/` directory to your hosting provider.
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. Add the `VITE_API_URL` environment variable.

---

## 3. Production Checklist
- [ ] Set `DEBUG=False` in production.
- [ ] Ensure `ALLOWED_HOSTS` matches your domain.
- [ ] Use a managed database (Neon/TiDB) for persistent data.
- [ ] Use `HTTPS` only (Render/Netlify handles this automatically).
- [ ] Ensure all API endpoints are secured with JWT.
