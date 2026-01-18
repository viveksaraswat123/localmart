import requests

MCP_URL = "http://localhost:9000"


def call_mcp(tool, params=None):

    if params is None:
        params = {}

    response = requests.get(f"{MCP_URL}/{tool}", params=params)

    return response.json()


def ai_agent(user_input):

    user_input = user_input.lower()

    if "show products" in user_input:
        return call_mcp("list_products")

    if "stock" in user_input:
        # simple demo
        product_id = 1
        return call_mcp("check_stock", {"product_id": product_id})

    if "expiry" in user_input:
        return call_mcp("expiring_products")

    return {"message": "I cannot understand this yet"}
