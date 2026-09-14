import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Client-side cart. This is purely a UI convenience — the backend never
// trusts prices or item validity from the client. When the order is placed,
// only {menu_item_id, quantity} is sent; the backend re-fetches each item's
// current price and availability from the database. See
// services/order_service.create_order on the backend.

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{menu_item_id, name, price, quantity}]

  const addItem = useCallback((menuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menu_item_id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menu_item_id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menu_item_id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((menuItemId) => {
    setItems((prev) => prev.filter((i) => i.menu_item_id !== menuItemId));
  }, []);

  const setQuantity = useCallback((menuItemId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.menu_item_id !== menuItemId);
      return prev.map((i) => (i.menu_item_id === menuItemId ? { ...i, quantity } : i));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = { items, addItem, removeItem, setQuantity, clearCart, subtotal, itemCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
