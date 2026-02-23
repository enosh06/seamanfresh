from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Product, Order, Banner, ContactMessage
from .serializers import (
    ProductSerializer, OrderSerializer, UserSerializer, 
    RegisterSerializer, BannerSerializer, ContactMessageSerializer
)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializer(self.user)
        data['user'] = serializer.data
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(active=True)
    serializer_class = BannerSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def stock(self, request, pk=None):
        product = self.get_object()
        stock_quantity = request.data.get('stock_quantity')
        if stock_quantity is not None:
            product.stock_quantity = stock_quantity
            product.save()
            return Response({'status': 'stock updated', 'stock_quantity': product.stock_quantity})
        return Response({'error': 'stock_quantity is required'}, status=status.HTTP_400_BAD_REQUEST)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related('user').prefetch_related('items', 'items__product').all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        base_qs = Order.objects.select_related('user').prefetch_related('items', 'items__product')
        if self.request.user.is_staff:
            return base_qs.all().order_by('-created_at')
        return base_qs.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-orders')
    def my_orders(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def stats(self, request):
        from django.db.models import Sum
        from django.contrib.auth.models import User
        
        total_revenue = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0
        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        total_users = User.objects.count()
        
        # Get recent 5 orders with optimized queries
        recent_orders_qs = Order.objects.select_related('user').all().order_by('-created_at')[:5]
        from .serializers import OrderSerializer
        recent_orders = OrderSerializer(recent_orders_qs, many=True).data

        # Get low stock products
        low_stock = Product.objects.filter(stock_quantity__lt=models.F('low_stock_threshold')).values('id', 'name', 'stock_quantity')

        return Response({
            "total_revenue": float(total_revenue),
            "total_orders": total_orders,
            "total_products": total_products,
            "total_users": total_users,
            "recent_orders": recent_orders,
            "low_stock_products": list(low_stock)
        })

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def analytics(self, request):
        from django.db.models import Sum
        from django.db.models.functions import TruncDate
        
        # Get last 7 days of revenue
        data = Order.objects.annotate(
            displayDate=TruncDate('created_at')
        ).values('displayDate').annotate(
            revenue=Sum('total_amount')
        ).order_by('displayDate')
        
        # Format for frontend
        formatted_data = [
            {
                "displayDate": item['displayDate'].strftime('%b %d'),
                "revenue": float(item['revenue'])
            } for item in data
        ]
        
        return Response(formatted_data)

    @action(detail=True, methods=['put'], permission_classes=[permissions.IsAdminUser])
    def status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            order.status = new_status
            order.save()
            return Response({'status': 'order status updated', 'new_status': order.status})
        return Response({'error': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)

class PingView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        return Response({"status": "ok", "message": "Server is awake"})

class AIChatView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        query = request.data.get('query', '').lower()
        if not query:
            return Response({"response": "I didn't catch that. How can I help?"})
            
        print(f"[AI Chat] Processing query: {query}")
        
        response_text = ""
        extras = {}
        
        # Simple Intent Detection
        if any(word in query for word in ['fish', 'product', 'catalog', 'buy', 'stock']):
            # Optimization: Search directly in DB
            from django.db.models import Q
            matched_product = Product.objects.filter(
                Q(name__icontains=query) | Q(category__icontains=query)
            ).first()

            if matched_product:
                response_text = f"We have fresh {matched_product.name} available for ${matched_product.price}/kg. Would you like to see it?"
                extras['product'] = {
                    'id': matched_product.id,
                    'name': matched_product.name,
                    'price': matched_product.price,
                    'image': matched_product.image.url if matched_product.image else None,
                    'category': matched_product.category
                }
            else:
                response_text = "We have a wide variety of fresh fish! You can check our products page or ask about a specific one like Salmon or Tuna."
        
        elif any(word in query for word in ['recipe', 'cook', 'make', 'eat']):
            response_text = "I have some great recipes! For example, Pan-Seared Salmon or Garlic Butter Shrimp. Which fish are you planning to cook?"
            
        elif any(word in query for word in ['delivery', 'ship', 'track', 'time']):
            response_text = "Experience 24-hour global delivery! We use temperature-controlled logistics to ensure maximum freshness."
            
        else:
            response_text = "Ahoy! 🌊 I'm still learning, but I can help you find products, recipes, or track your delivery. What's on your mind?"
            
        return Response({
            "response": response_text,
            "extras": extras
        })
