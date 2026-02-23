# Django + React Migration Plan

Phase 1: Database Setup
- Your serverless database is already provisioned (TiDB/Neon).
- You can use the `DATABASE_URL` from your `.env` file directly in Django.

Phase 2: Backend Development (Python/Django)
- I have created the `backend_django` folder.
- **Models**: Located in `api/models.py`. Includes Product, Order, and OrderItems.
- **API**: Built using Django Rest Framework (DRF) in `api/views.py`.
- **Database Connection**: Configured in `core/settings.py` using `dj-database-url`.

Phase 3: Frontend Integration
- Your React frontend remains in the `client` folder.
- You only need to update the `API_URL` to point to the Django server.

Phase 4: Running Locally
1. Install Python 3.10+
2. `cd backend_django`
3. `pip install -r requirements.txt`
4. `python manage.py makemigrations`
5. `python manage.py migrate`
6. `python manage.py runserver`

Phase 5: Deploying
- **Backend (Python)**: Can be deployed to Render, Railway, or Fly.io.
- **Frontend (React)**: Cloudflare Pages (already set up).
- **Database**: Serverless (TiDB/Neon - already set up).
