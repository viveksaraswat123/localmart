import requests
from .config import BASE_URL


# TOOL 1 – List Products
def list_products():
    response = requests.get(f"{BASE_URL}/products/")
    return response.json()


# TOOL 2 – Check Stock
def check_stock(product_id: int):
    response = requests.get(f"{BASE_URL}/products/{product_id}")

    if response.status_code != 200:
        return {"error": "Product not found"}

    data = response.json()

    return {
        "product": data["name"],
        "quantity": data["quantity"]
    }


# TOOL 3 – Expiring Products
def expiring_products():
    response = requests.get(f"{BASE_URL}/products/")

    products = response.json()

    expiring = []

    for p in products:
        if p.get("expiry_date"):
            expiring.append({
                "name": p["name"],
                "expiry_date": p["expiry_date"]
            })

    return expiring


# TOOL 4 – Create Order
def create_order(token: str, product_id: int, quantity: int):

    headers = {
        "Authorization": f"Bearer {token}"
    }

    data = {
        "product_id": product_id,
        "quantity": quantity
    }

    response = requests.post(
        f"{BASE_URL}/orders/",
        json=data,
        headers=headers
    )

    return response.json()


# TOOL 5 – My Orders
def my_orders(token: str):

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(
        f"{BASE_URL}/orders/my",
        headers=headers
    )

    return response.json()
