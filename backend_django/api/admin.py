from django.contrib import admin
from .models import Product, Order, OrderItem, Banner, ContactMessage

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'stock_quantity', 'created_at')
    search_fields = ('name', 'description', 'category')
    list_filter = ('category', 'created_at')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    list_editable = ('status',)
    search_fields = ('user__username', 'id')
    inlines = [OrderItemInline]

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'active', 'created_at')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    readonly_fields = ('created_at',)
