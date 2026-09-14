import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { guestApi, getStoredSessionId } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import Sheet from "../../components/ui/Sheet";
import EmptyState from "../../components/ui/EmptyState";
import { MenuItemSkeleton } from "../../components/ui/Skeleton";

export default function Menu() {
  const { tableToken } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { items: cartItems, addItem, setQuantity, itemCount, subtotal } = useCart();

  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [error, setError] = useState("");
  const [menu, setMenu] = useState({ categories: [] });
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [detailQty, setDetailQty] = useState(1);

  useEffect(() => {
    const sessionId = getStoredSessionId(tableToken);
    if (!sessionId) {
      navigate(`/t/${tableToken}`, { replace: true });
      return;
    }

    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        await guestApi.getSession(sessionId);
        const data = await guestApi.getMenu();
        if (!cancelled) {
          setMenu(data);
          setActiveCategory(data.categories[0]?.id ?? null);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err.detail || err.message || "Could not load the menu");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tableToken, navigate]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return menu.categories;
    const q = search.trim().toLowerCase();
    return menu.categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (i) => i.name.toLowerCase().includes(q) || (i.description || "").toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [menu.categories, search]);

  function quantityInCart(menuItemId) {
    const found = cartItems.find((i) => i.menu_item_id === menuItemId);
    return found ? found.quantity : 0;
  }

  function scrollToCategory(id) {
    setActiveCategory(id);
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openDetail(item) {
    setDetailItem(item);
    setDetailQty(Math.max(1, quantityInCart(item.id)));
  }

  function confirmAddFromDetail() {
    const alreadyInCart = quantityInCart(detailItem.id) > 0;
    if (alreadyInCart) {
      setQuantity(detailItem.id, detailQty);
    } else {
      for (let i = 0; i < detailQty; i++) addItem(detailItem);
    }
    toast.success(`${detailItem.name} × ${detailQty} in cart`);
    setDetailItem(null);
  }

  if (status === "loading") {
    return (
      <div className="menu-page">
        <div className="menu-items">
          <MenuItemSkeleton />
          <MenuItemSkeleton />
          <MenuItemSkeleton />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <EmptyState
        icon="⚠️"
        title="Something went wrong"
        message={error}
        action={
          <button className="btn btn-primary" onClick={() => navigate(`/t/${tableToken}`, { replace: true })}>
            Start over
          </button>
        }
      />
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-search">
        <input
          type="search"
          placeholder="Search dishes, cuisines…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!search && menu.categories.length > 1 && (
        <div className="category-tabs">
          {menu.categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => scrollToCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {filteredCategories.length === 0 && (
        <EmptyState icon="🔍" title="No items found" message="Try a different search term." />
      )}

      {filteredCategories.map((category) => (
        <section key={category.id} id={`cat-${category.id}`} className="menu-category">
          <h2>{category.name}</h2>
          <div className="menu-items">
            {category.items.map((item) => {
              const qty = quantityInCart(item.id);
              return (
                <button
                  key={item.id}
                  className={`menu-item ${!item.available ? "unavailable" : ""}`}
                  onClick={() => item.available && openDetail(item)}
                  disabled={!item.available}
                >
                  {item.image_url ? (
                    <img className="menu-item-thumb" src={item.image_url} alt="" />
                  ) : (
                    <div className="menu-item-thumb-placeholder" />
                  )}
                  <div className="menu-item-body">
                    <h3>{item.name}</h3>
                    {item.description && <p>{item.description}</p>}
                    <div className="menu-item-footer">
                      <span className="price">₹{item.price.toFixed(2)}</span>
                      {!item.available ? (
                        <span className="unavailable-label">Unavailable</span>
                      ) : qty > 0 ? (
                        <div className="qty-stepper" onClick={(e) => e.stopPropagation()} role="group">
                          <button onClick={() => setQuantity(item.id, qty - 1)} aria-label="Decrease">
                            −
                          </button>
                          <span>{qty}</span>
                          <button onClick={() => setQuantity(item.id, qty + 1)} aria-label="Increase">
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="add-btn">Add</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {itemCount > 0 && (
        <Link to={`/t/${tableToken}/cart`} className="cart-fab">
          <span>
            <span className="cart-fab-count">{itemCount}</span>
            View cart
          </span>
          <span>₹{subtotal.toFixed(2)}</span>
        </Link>
      )}

      <Sheet open={!!detailItem} onClose={() => setDetailItem(null)} title={detailItem?.name}>
        {detailItem && (
          <>
            {detailItem.image_url ? (
              <img className="item-detail-thumb" src={detailItem.image_url} alt="" />
            ) : (
              <div className="item-detail-thumb-placeholder" />
            )}
            <div className="item-detail-price">₹{detailItem.price.toFixed(2)}</div>
            {detailItem.description && <p className="item-detail-desc">{detailItem.description}</p>}
            <div className="item-detail-footer">
              <div className="qty-stepper">
                <button onClick={() => setDetailQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                  −
                </button>
                <span>{detailQty}</span>
                <button onClick={() => setDetailQty((q) => q + 1)} aria-label="Increase">
                  +
                </button>
              </div>
              <button className="btn btn-primary" onClick={confirmAddFromDetail}>
                Add · ₹{(detailItem.price * detailQty).toFixed(2)}
              </button>
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
}
