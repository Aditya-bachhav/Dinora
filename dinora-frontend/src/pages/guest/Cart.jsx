import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { guestApi, getStoredSessionId } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";

export default function Cart() {
  const { tableToken } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const { items, setQuantity, removeItem, subtotal, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);

  async function handleRemove(item) {
    const ok = await confirm(`Remove ${item.name} from your cart?`, { title: "Remove item" });
    if (ok) removeItem(item.menu_item_id);
  }

  async function handlePlaceOrder() {
    const sessionId = getStoredSessionId(tableToken);
    if (!sessionId) {
      navigate(`/t/${tableToken}`, { replace: true });
      return;
    }
    if (items.length === 0) return;

    setPlacing(true);
    try {
      // Server re-derives table/restaurant from the session and re-prices
      // every item from the database — the client's `subtotal` here is
      // display-only and never sent as part of the request.
      await guestApi.placeOrder(sessionId, items);
      clearCart();
      toast.success("Order placed!");
      navigate(`/t/${tableToken}/orders`, { replace: true });
    } catch (err) {
      toast.error(err.detail || err.message || "Could not place your order");
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        message="Add something tasty from the menu to get started."
        action={
          <button className="btn btn-primary" onClick={() => navigate(`/t/${tableToken}/menu`)}>
            Browse menu
          </button>
        }
      />
    );
  }

  return (
    <div className="cart-page">
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Your order</h1>

      <div className="cart-items">
        {items.map((item) => (
          <div key={item.menu_item_id} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">₹{item.price.toFixed(2)} each</span>
            </div>
            <div className="qty-stepper">
              <button onClick={() => setQuantity(item.menu_item_id, item.quantity - 1)} aria-label="Decrease">
                −
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => setQuantity(item.menu_item_id, item.quantity + 1)} aria-label="Increase">
                +
              </button>
            </div>
            <button className="cart-item-remove" onClick={() => handleRemove(item)} aria-label="Remove">
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="card summary-card">
        <div className="summary-row">
          <span>Items</span>
          <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
        </div>
        <div className="summary-row total">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
      </div>
      <p className="cart-note">Final total is confirmed by the kitchen when your order is placed.</p>

      <div className="cart-actions">
        <button className="btn btn-primary btn-block" onClick={handlePlaceOrder} disabled={placing}>
          {placing ? <Spinner size={16} /> : `Place order · ₹${subtotal.toFixed(2)}`}
        </button>
        <button className="btn btn-ghost btn-block" onClick={() => navigate(`/t/${tableToken}/menu`)} disabled={placing}>
          Add more items
        </button>
      </div>
    </div>
  );
}
