import json
import os
from django.conf import settings

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

def _get_path(filename):
    return os.path.join(DATA_DIR, filename)

def load_data(filename):
    path = _get_path(filename)
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_data(filename, data):
    path = _get_path(filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

def get_products():
    return load_data('products.json')

def get_banners():
    return load_data('banners.json')

def get_messages():
    return load_data('messages.json')

def add_message(message):
    messages = get_messages()
    message['id'] = len(messages) + 1
    messages.append(message)
    save_data('messages.json', messages)
    return message

def get_orders():
    return load_data('orders.json')

def add_order(order_data):
    orders = get_orders()
    order_data['id'] = len(orders) + 1
    # For WhatsApp integration, we just format the order and return the message string
    orders.append(order_data)
    save_data('orders.json', orders)
    return order_data
