"""
Order status is staff-driven, not automatic — see routes/orders.py's
PATCH /api/orders/{id} and order_service.update_order_status.

This module previously ran a background loop that advanced every order
through pending -> preparing -> ready -> served purely based on elapsed
time, regardless of whether the kitchen had actually done anything. That
made the status shown to guests meaningless (an order could say "ready"
because 21 seconds had passed, not because food was ready) and gave admins
nothing real to do with the status dropdown. It has been removed; nothing
in app/main.py starts a background task any more.

order_service.advance_orders() (the timer logic itself) has also been
removed — see services/order_service.py.
"""
