import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { guestApi, getStoredSessionId } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";

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
      <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4 sm:p-6">
        <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl shadow-sm p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            message="Add something tasty from the menu to get started."
            action={
              <button 
                className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                onClick={() => navigate(`/t/${tableToken}/menu`)}
              >
                Browse menu
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-40 md:pb-24 pt-8 px-4 max-w-3xl mx-auto">
      <div className="mb-8">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-wider text-primary uppercase mb-2">
          <ShoppingBag size={13} /> Your table order
        </span>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Almost ready<br />
          <em className="text-muted-foreground font-normal italic">for the kitchen.</em>
        </h1>
        <p className="text-muted-foreground text-lg">Review your picks, then send them through.</p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <div key={item.menu_item_id} className="flex items-center justify-between p-4 bg-card text-card-foreground border border-border rounded-xl shadow-sm gap-4">
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-semibold text-base truncate">{item.name}</span>
              <span className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} each</span>
            </div>
            
            <div className="flex items-center gap-3 bg-secondary text-secondary-foreground rounded-md px-1 py-0.5">
              <button 
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-background/80 transition-colors"
                onClick={() => setQuantity(item.menu_item_id, item.quantity - 1)} 
                aria-label="Decrease"
              >
                −
              </button>
              <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
              <button 
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-background/80 transition-colors"
                onClick={() => setQuantity(item.menu_item_id, item.quantity + 1)} 
                aria-label="Increase"
              >
                +
              </button>
            </div>
            
            <button 
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors flex-shrink-0"
              onClick={() => handleRemove(item)} 
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-border gap-1">
          <strong className="font-semibold text-sm">Your summary</strong>
          <span className="text-muted-foreground text-xs">Prices confirmed at checkout</span>
        </div>
        
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-muted-foreground">Items</span>
          <span className="font-medium">{items.reduce((s, i) => s + i.quantity, 0)}</span>
        </div>
        
        <div className="flex justify-between items-center font-semibold text-lg mt-4 pt-4 border-t border-border">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground text-center mb-8">
        Final total is confirmed by the kitchen when your order is placed.
      </p>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border/50 flex flex-col gap-3 z-50 md:static md:bg-transparent md:border-0 md:p-0 md:backdrop-blur-none">
        <button 
          className="inline-flex items-center justify-center rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 w-full gap-2 shadow-sm"
          onClick={handlePlaceOrder} 
          disabled={placing}
        >
          {placing ? <Spinner size={20} /> : <>Send order · ₹{subtotal.toFixed(2)} <ArrowRight size={18} /></>}
        </button>
        <button 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-11 px-8 w-full"
          onClick={() => navigate(`/t/${tableToken}/menu`)} 
          disabled={placing}
        >
          Add more items
        </button>
      </div>
    </div>
  );
}