import os
import sys
import json
import urllib.parse
from pathlib import Path
from django.conf import settings
from django.core.management import execute_from_command_line
from django.urls import path, include
from django.http import JsonResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.routers import DefaultRouter

# ==========================================
# 1. SETUP CLASSIFIED SETTINGS
# ==========================================
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "backend_django" / "api" / "data"
if not DATA_DIR.exists():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

if not settings.configured:
    settings.configure(
        DEBUG=True,
        SECRET_KEY='django-insecure-single-file-backend',
        ROOT_URLCONF=__name__,
        ALLOWED_HOSTS=['*'],
        INSTALLED_APPS=[
            'django.contrib.staticfiles',
            'rest_framework',
            'corsheaders',
        ],
        MIDDLEWARE=[
            'django.middleware.security.SecurityMiddleware',
            'corsheaders.middleware.CorsMiddleware',
            'django.middleware.common.CommonMiddleware',
        ],
        CORS_ALLOW_ALL_ORIGINS=True, # For local dev simplicity
        CORS_ALLOW_CREDENTIALS=True,
        REST_FRAMEWORK={'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny']},
        STATIC_URL='/static/',
        MEDIA_URL='/media/',
        MEDIA_ROOT=BASE_DIR / 'media',
        DATABASES={'default': {}}, # No DB needed
    )

# ==========================================
# 2. DATA MANAGEMENT (JSON STORAGE)
# ==========================================
def _get_path(filename): return DATA_DIR / filename
def load_data(filename):
    path = _get_path(filename)
    if not path.exists(): return []
    with open(path, 'r', encoding='utf-8') as f:
        try: return json.load(f)
        except: return []
def save_data(filename, data):
    with open(_get_path(filename), 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

# ==========================================
# 3. PERMISSIONS & VIEWS
# ==========================================
class SimpleAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        admin_token = os.getenv('ADMIN_SECRET_TOKEN', 'seaman_fresh_admin_2024')
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            return auth_header.split(' ')[1] == admin_token
        return False

class MockLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        ADMIN_USER, ADMIN_PASS, SECRET_TOKEN = os.getenv('ADMIN_USER', 'admin'), os.getenv('ADMIN_PASS', 'seaman123'), os.getenv('ADMIN_SECRET_TOKEN', 'seaman_fresh_admin_2024')
        if username == ADMIN_USER and password == ADMIN_PASS:
            return Response({"access": SECRET_TOKEN, "user": {"username": ADMIN_USER, "is_staff": True, "name": "Seaman Admin"}})
        return Response({"error": "Invalid credentials"}, status=401)

class BannerViewSet(viewsets.ViewSet):
    def list(self, request): return Response(load_data('banners.json'))
    def create(self, request):
        banners = load_data('banners.json')
        new_banner = request.data; new_banner['id'] = len(banners) + 1
        banners.append(new_banner); save_data('banners.json', banners)
        return Response(new_banner, status=201)
    def destroy(self, request, pk=None):
        banners = [b for b in load_data('banners.json') if str(b['id']) != str(pk)]
        save_data('banners.json', banners)
        return Response(status=204)

class ProductViewSet(viewsets.ViewSet):
    def list(self, request): return Response(load_data('products.json'))
    def create(self, request):
        products = load_data('products.json')
        new_data = request.data.dict() if hasattr(request.data, 'dict') else request.data
        new_data['id'] = max([p['id'] for p in products] + [0]) + 1
        products.append(new_data); save_data('products.json', products)
        return Response(new_data, status=201)
    def destroy(self, request, pk=None):
        products = [p for p in load_data('products.json') if str(p['id']) != str(pk)]
        save_data('products.json', products)
        return Response(status=204)

class OrderViewSet(viewsets.ViewSet):
    def create(self, request):
        order_data = request.data; orders = load_data('orders.json')
        order_data['id'] = len(orders) + 1; orders.append(order_data); save_data('orders.json', orders)
        wa_message = f"📦 New Order from {order_data.get('customer_name', 'Guest')}\n💰 Total: ${order_data.get('total_amount', 0)}"
        wa_link = f"https://wa.me/919000000000?text={urllib.parse.quote(wa_message)}"
        return Response({"status": "success", "whatsapp_link": wa_link}, status=201)
    def list(self, request): return Response(load_data('orders.json'))
    @action(detail=False, methods=['get'])
    def stats(self, request):
        products, orders = load_data('products.json'), load_data('orders.json')
        return Response({"total_revenue": sum(float(o.get('total_amount', 0)) for o in orders), "total_orders": len(orders), "total_products": len(products)})

class PingView(APIView):
    def get(self, request): return Response({"status": "ok", "message": "Single-File Backend Alive"})

# ==========================================
# 4. URLS & ROUTER
# ==========================================
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'banners', BannerViewSet, basename='banner')

urlpatterns = [
    path('api/ping/', PingView.as_view()),
    path('api/auth/login/', MockLoginView.as_view()),
    path('api/', include(router.urls)),
]

# ==========================================
# 5. EXECUTION
# ==========================================
if __name__ == "__main__":
    import django
    django.setup()
    execute_from_command_line([sys.argv[0], 'runserver', '0.0.0.0:8000'])
