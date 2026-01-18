from fastapi import FastAPI
from . import tools

MCP = FastAPI(title="LocalMart MCP Layer")


@MCP.get("/")
def home():
    return {"message": "LocalMart MCP Running"}


@MCP.get("/tools")
def available_tools():
    return {
        "tools": [
            "list_products",
            "check_stock",
            "expiring_products",
            "create_order",
            "my_orders"
        ]
    }


@MCP.get("/list_products")
def tool_list_products():
    return tools.list_products()


@MCP.get("/check_stock")
def tool_check_stock(product_id: int):
    return tools.check_stock(product_id)


@MCP.get("/expiring_products")
def tool_expiring():
    return tools.expiring_products()


@MCP.post("/create_order")
def tool_create_order(token: str, product_id: int, quantity: int):
    return tools.create_order(token, product_id, quantity)


@MCP.get("/my_orders")
def tool_my_orders(token: str):
    return tools.my_orders(token)
