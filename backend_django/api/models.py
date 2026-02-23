from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    category = models.CharField(max_length=100, db_index=True)
    stock_quantity = models.IntegerField(default=0)
    wholesale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    wholesale_moq = models.IntegerField(default=0)
    low_stock_threshold = models.IntegerField(default=5)
    discount_percent = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.image:
            from PIL import Image
            img = Image.open(self.image.path)
            if img.height > 800 or img.width > 800:
                output_size = (800, 800)
                img.thumbnail(output_size)
                img.save(self.image.path, quality=85)

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending', db_index=True)
    delivery_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

class Banner(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='banners/', null=True, blank=True)
    link_url = models.CharField(max_length=255, null=True, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.image:
            from PIL import Image
            img = Image.open(self.image.path)
            if img.height > 600 or img.width > 1200:
                output_size = (1200, 600)
                img.thumbnail(output_size)
                img.save(self.image.path, quality=85)

class ContactMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255, null=True, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"
