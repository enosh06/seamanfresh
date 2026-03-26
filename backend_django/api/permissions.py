import os
from rest_framework import permissions

class SimpleAdminPermission(permissions.BasePermission):
    """
    Check for a secret key in the Authorization header.
    Format: 'Bearer <SECRET_ADMIN_TOKEN>'
    """
    def has_permission(self, request, view):
        # In a real "database-free" production app, this would be an ENV variable
        admin_token = os.getenv('ADMIN_SECRET_TOKEN', 'seaman_fresh_admin_2024')
        
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            return token == admin_token
        
        return False
