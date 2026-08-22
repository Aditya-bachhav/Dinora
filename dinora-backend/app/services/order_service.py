class OrderService:
    def __init__(self) -> None:
        self.orders = []

    def create_order(self, order_data: dict) -> dict:
        self.orders.append(order_data)
        return order_data
