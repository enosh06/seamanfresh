from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, OrderViewSet, BannerViewSet, 
    ContactMessageViewSet, MockLoginView, PingView, AIChatView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'banners', BannerViewSet, basename='banner')
router.register(r'messages', ContactMessageViewSet, basename='message')

urlpatterns = [
    path('ping/', PingView.as_view(), name='ping'),
    path('ai-chat/', AIChatView.as_view(), name='ai_chat'),
    path('auth/login/', MockLoginView.as_view(), name='login'),
    path('', include(router.urls)),
]
