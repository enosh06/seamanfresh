from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import (
    ProductViewSet, OrderViewSet, BannerViewSet, 
    ContactMessageViewSet, RegisterView, ProfileView,
    CustomTokenObtainPairView, PingView, AIChatView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'banners', BannerViewSet)
router.register(r'messages', ContactMessageViewSet)

urlpatterns = [
    path('ping/', PingView.as_view(), name='ping'),
    path('ai-chat/', AIChatView.as_view(), name='ai_chat'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    path('', include(router.urls)),
]
