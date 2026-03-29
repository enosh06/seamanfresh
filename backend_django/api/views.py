from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from . import data_manager
from .permissions import SimpleAdminPermission
import urllib.parse
import os

class MockLoginView(APIView):
    """
    Stateless login - just checks for a hardcoded password in .env or default.
    Useful for 'Database-Free' administration.
    """
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Hardcoded for DB-free mode (Default Admin)
        ADMIN_USER = os.getenv('ADMIN_USER', 'admin')
        ADMIN_PASS = os.getenv('ADMIN_PASS', 'seaman123')
        SECRET_TOKEN = os.getenv('ADMIN_SECRET_TOKEN', 'seaman_fresh_admin_2024')

        if username == ADMIN_USER and password == ADMIN_PASS:
            return Response({
                "access": SECRET_TOKEN,
                "user": {
                    "username": ADMIN_USER,
                    "is_staff": True,
                    "name": "Seaman Admin"
                }
            })
        
        # Also check users.json for registered users
        users = data_manager.get_users()
        user = next((u for u in users if u.get('username') == username or u.get('email') == username), None)
        
        if user and user.get('password') == password:
            return Response({
                "access": SECRET_TOKEN, # Simple token reuse for mock
                "user": {
                    "username": user['username'],
                    "is_staff": user.get('is_staff', False),
                    "name": user.get('name', user['username'])
                }
            })
            
        return Response({"error": "Invalid credentials for DB-free mode"}, status=status.HTTP_401_UNAUTHORIZED)

class MockRegisterView(APIView):
    """
    Stateless register - saves to users.json to allow frontend flow.
    """
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        SECRET_TOKEN = os.getenv('ADMIN_SECRET_TOKEN', 'seaman_fresh_admin_2024')
        user_data = request.data
        
        # Logic to save to users.json
        new_user = {
            "username": user_data.get('username', user_data.get('email', 'new_user')),
            "email": user_data.get('email', 'new_user@example.com'),
            "password": user_data.get('password', 'password123'),
            "is_staff": False,
            "name": user_data.get('name', 'New User')
        }
        
        data_manager.add_user(new_user)
        
        return Response({
            "token": SECRET_TOKEN,
            "user": {
                "username": new_user['username'],
                "email": new_user['email'],
                "is_staff": False,
                "name": new_user['name']
            },
            "message": "Registration successful (Mock Mode)"
        }, status=status.HTTP_201_CREATED)

class BannerViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [SimpleAdminPermission()]
    
    def list(self, request):
        return Response(data_manager.get_banners())

    def create(self, request):
        banners = data_manager.get_banners()
        new_banner = request.data
        new_banner['id'] = len(banners) + 1
        banners.append(new_banner)
        data_manager.save_data('banners.json', banners)
        return Response(new_banner, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        banners = data_manager.get_banners()
        banners = [b for b in banners if str(b['id']) != str(pk)]
        data_manager.save_data('banners.json', banners)
        return Response(status=status.HTTP_204_NO_CONTENT)

class ContactMessageViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [SimpleAdminPermission()]

    def create(self, request):
        msg = data_manager.add_message(request.data)
        return Response(msg, status=status.HTTP_201_CREATED)

    def list(self, request):
        return Response(data_manager.get_messages())

class ProductViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [SimpleAdminPermission()]

    def list(self, request):
        return Response(data_manager.get_products())

    def retrieve(self, request, pk=None):
        products = data_manager.get_products()
        product = next((p for p in products if str(p['id']) == str(pk)), None)
        if product:
            return Response(product)
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        products = data_manager.get_products()
        new_product = request.data.dict() if hasattr(request.data, 'dict') else request.data
        new_product['id'] = max([p['id'] for p in products] + [0]) + 1
        products.append(new_product)
        data_manager.save_data('products.json', products)
        return Response(new_product, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        products = data_manager.get_products()
        new_data = request.data.dict() if hasattr(request.data, 'dict') else request.data
        for i, p in enumerate(products):
            if str(p['id']) == str(pk):
                products[i].update(new_data)
                data_manager.save_data('products.json', products)
                return Response(products[i])
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        products = data_manager.get_products()
        products = [p for p in products if str(p['id']) != str(pk)]
        data_manager.save_data('products.json', products)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'], permission_classes=[SimpleAdminPermission])
    def stock(self, request, pk=None):
        products = data_manager.get_products()
        stock_quantity = request.data.get('stock_quantity')
        for i, p in enumerate(products):
            if str(p['id']) == str(pk):
                products[i]['stock_quantity'] = int(stock_quantity)
                data_manager.save_data('products.json', products)
                return Response({'status': 'stock updated', 'stock_quantity': products[i]['stock_quantity']})
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

class OrderViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        order_data = request.data
        data_manager.add_order(order_data)
        
        items_str = ""
        total = 0
        customer_name = order_data.get('customer_name', 'Guest')
        phone = order_data.get('phone', 'N/A')
        address = order_data.get('delivery_address', 'N/A')

        for item in order_data.get('items', []):
            quantity = item.get('quantity', 1)
            name = item.get('name', 'Product')
            price = item.get('price_at_purchase', item.get('price', 0))
            items_str += f"- {name} x{quantity} (${price}/kg)\n"
            total += float(price) * int(quantity)
        
        wa_message = f"📦 *New Order from Seaman Fresh*\n👤 {customer_name}\n📍 {address}\n🛒 Items:\n{items_str}\n💰 Total: ${total:.2f}\nPlease confirm!"
        wa_link = f"https://wa.me/919000000000?text={urllib.parse.quote(wa_message)}"
        
        return Response({
            "status": "success",
            "message": "Order Received via WhatsApp Link.",
            "whatsapp_link": wa_link
        }, status=status.HTTP_201_CREATED)

    def list(self, request):
        if SimpleAdminPermission().has_permission(request, self):
            return Response(data_manager.get_orders())
        return Response([], status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['get'], permission_classes=[SimpleAdminPermission])
    def stats(self, request):
        products = data_manager.get_products()
        orders = data_manager.get_orders()
        total_revenue = sum(float(o.get('total_amount', 0)) for o in orders)
        
        return Response({
            "total_revenue": total_revenue,
            "total_orders": len(orders),
            "total_products": len(products),
            "total_users": 0,
            "recent_orders": orders[-5:],
            "low_stock_products": [p for p in products if int(p.get('stock_quantity', 0)) < int(p.get('low_stock_threshold', 5))]
        })

class PingView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        return Response({"status": "ok", "message": "Serverless & DB-Free Backend Alive"})

class AIChatView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        query = request.data.get('query', '').lower()
        if not query: return Response({"response": "I didn't catch that."})
        
        products = data_manager.get_products()
        matched_product = next((p for p in products if query in p['name'].lower() or query in p['category'].lower()), None)

        if matched_product:
            response_text = f"We have fresh {matched_product['name']} available for ${matched_product['price']}/kg."
            extras = {'product': matched_product}
        else:
            response_text = "I'm still learning about our products. How else can I help?"
            extras = {}
            
        return Response({"response": response_text, "extras": extras})
