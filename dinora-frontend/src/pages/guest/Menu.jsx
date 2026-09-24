import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { guestApi, getStoredSessionId } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import Sheet from "../../components/ui/Sheet";
import EmptyState from "../../components/ui/EmptyState";
import { animate, stagger } from "animejs";

// Reusable Dish Card for both horizontal scrolling and vertical grids
function DishCard({ item, qty, onUpdateQty, onClick }) {
  return (
    <button
      className={`flex flex-col bg-card text-card-foreground border border-border shadow-sm rounded-2xl overflow-hidden transition-all hover:border-primary/50 text-left w-full h-full ${
        !item.available ? "opacity-60 grayscale cursor-not-allowed" : ""
      }`}
      data-guest-dish
      onClick={() => item.available && onClick(item)}
      disabled={!item.available}
    >
      {item.image_url ? (
        <img className="w-full aspect-[4/3] object-cover shrink-0" src={item.image_url} alt={item.name} loading="lazy" />
      ) : (
        <div className="w-full aspect-[4/3] bg-muted shrink-0 flex items-center justify-center">
          <span className="text-muted-foreground/50 text-xs font-medium">No image</span>
        </div>
      )}
      
      <div className="p-3 flex flex-col flex-1 w-full min-w-0">
        <h3 className="font-semibold text-sm truncate w-full">{item.name}</h3>
        {item.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
            {item.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-3 w-full">
          <span className="font-semibold text-sm">₹{item.price.toFixed(2)}</span>
          {!item.available ? (
            <span className="text-[10px] font-medium text-destructive px-1.5 py-0.5 bg-destructive/10 rounded">Out</span>
          ) : qty > 0 ? (
            <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-1 py-0.5" onClick={(e) => e.stopPropagation()} role="group">
              <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-black/20 transition-colors" onClick={() => onUpdateQty(item.id, qty - 1)} aria-label="Decrease">
                −
              </button>
              <span className="text-xs font-bold w-3 text-center">{qty}</span>
              <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-black/20 transition-colors" onClick={() => onUpdateQty(item.id, qty + 1)} aria-label="Increase">
                +
              </button>
            </div>
          ) : (
            <span className="text-[11px] font-bold bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors">Add</span>
          )}
        </div>
      </div>
    </button>
  );
}

// Compact skeleton for the 2-column layout
function CompactSkeleton() {
  return (
    <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/3] bg-muted" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full mt-1" />
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="flex justify-between items-center mt-3 pt-1">
          <div className="h-4 bg-muted rounded w-10" />
          <div className="h-6 bg-muted rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export default function Menu() {
  const { tableToken } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { items: cartItems, addItem, setQuantity, itemCount, subtotal } = useCart();

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [menu, setMenu] = useState({ categories: [] });
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [detailQty, setDetailQty] = useState(1);
  const menuRef = useRef(null);

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
        const data = await guestApi.getMenu(sessionId);
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

  // Derive some items for the "Chef's Specials" horizontal scroll 
  // (picks the first 5 items from across the menu as a showcase)
  const chefSpecials = useMemo(() => {
    if (!menu.categories) return [];
    return menu.categories.flatMap(c => c.items).slice(0, 5);
  }, [menu.categories]);

  useEffect(() => {
    if (status !== "ready" || !menuRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const animation = animate(menuRef.current.querySelectorAll("[data-guest-dish]"), {
      opacity: [0, 1],
      translateY: [10, 0],
      delay: stagger(35),
      duration: 420,
      ease: "outQuart",
    });
    return () => animation.revert();
  }, [status, filteredCategories.length, search]);

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
    navigate(`/t/${tableToken}/cart`);
  }

  if (status === "loading") {
    return (
      <div className="min-h-[100dvh] bg-background p-4 pt-8 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <CompactSkeleton />
          <CompactSkeleton />
          <CompactSkeleton />
          <CompactSkeleton />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4 sm:p-6 pb-32">
        <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl shadow-sm p-6 sm:p-8">
          <EmptyState
            icon="⚠️"
            title="Something went wrong"
            message={error}
            action={
              <button 
                className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                onClick={() => navigate(`/t/${tableToken}`, { replace: true })}
              >
                Start over
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-40" ref={menuRef}>
      <div className="px-4 pt-8 pb-6">
        <span className="text-sm font-semibold tracking-wider text-primary uppercase mb-2 block">
          Tonight's menu
        </span>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Find something<br />
          <em className="text-muted-foreground font-normal italic">worth sharing.</em>
        </h1>
        <p className="text-muted-foreground text-lg">Fresh from the kitchen, ready when you are.</p>
      </div>
      
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md px-4 py-3 border-b border-border/50 mb-6">
        <input
          type="search"
          placeholder="Search dishes, cuisines…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Category Pills */}
      {!search && menu.categories.length > 1 && (
        <div className="flex overflow-x-auto gap-2 px-4 pb-4 -mt-2 mb-2 scrollbar-width-none [&::-webkit-scrollbar]:hidden">
          {menu.categories.map((cat) => (
            <button
              key={cat.id}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                activeCategory === cat.id 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "border-border text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
              onClick={() => scrollToCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Horizontal Scroll for Chef's Specials (Hidden if searching) */}
      {!search && chefSpecials.length > 0 && (
        <section className="mb-10">
          <div className="px-4 mb-3">
            <h2 className="text-xl font-semibold tracking-tight">Chef's Specials ✨</h2>
          </div>
          <div className="flex overflow-x-auto gap-3 px-4 pb-4 scrollbar-width-none [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            {chefSpecials.map((item) => (
              <div key={`special-${item.id}`} className="w-[150px] sm:w-[180px] shrink-0 snap-start">
                <DishCard 
                  item={item} 
                  qty={quantityInCart(item.id)} 
                  onUpdateQty={setQuantity} 
                  onClick={openDetail} 
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {filteredCategories.length === 0 && (
        <div className="px-4 mt-8">
          <EmptyState icon="🔍" title="No items found" message="Try a different search term." />
        </div>
      )}

      {/* Main Vertical Grid (2 items per row on mobile) */}
      {filteredCategories.map((category) => (
        <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-32 mb-10">
          <h2 className="text-xl font-semibold tracking-tight px-4 mb-4">{category.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
            {category.items.map((item) => (
              <DishCard 
                key={item.id} 
                item={item} 
                qty={quantityInCart(item.id)} 
                onUpdateQty={setQuantity} 
                onClick={openDetail} 
              />
            ))}
          </div>
        </section>
      ))}

      {/* Floating View Cart Button */}
      {itemCount > 0 && (
        <Link 
          to={`/t/${tableToken}/cart`} 
          className="fixed bottom-20 left-4 right-4 md:bottom-8 md:left-auto md:right-6 md:w-96 bg-primary text-primary-foreground rounded-full shadow-lg px-6 py-4 flex items-center justify-between font-medium hover:bg-primary/90 transition-transform active:scale-[0.98] z-[60] animate-in slide-in-from-bottom-10 fade-in duration-300"
        >
          <span className="flex items-center">
            <span className="bg-primary-foreground text-primary rounded-full w-6 h-6 inline-flex items-center justify-center text-xs font-bold mr-3">
              {itemCount}
            </span>
            View cart
          </span>
          <span>₹{subtotal.toFixed(2)}</span>
        </Link>
      )}

      {/* Detail Modal */}
      <Sheet open={!!detailItem} onClose={() => setDetailItem(null)} title={detailItem?.name}>
        {detailItem && (
          <div className="pt-2">
            {detailItem.image_url ? (
              <img className="w-full aspect-video object-cover rounded-xl mb-4" src={detailItem.image_url} alt="" />
            ) : (
              <div className="w-full aspect-video bg-muted rounded-xl mb-4" />
            )}
            <div className="text-2xl font-semibold mb-2 text-foreground">₹{detailItem.price.toFixed(2)}</div>
            {detailItem.description && <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{detailItem.description}</p>}
            
            <div className="flex gap-4 items-center mt-6 pt-6 border-t border-border pb-16 md:pb-4">
              <div className="flex items-center gap-4 bg-secondary text-secondary-foreground rounded-lg p-1 h-11">
                <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-background/80 transition-colors" onClick={() => setDetailQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                  −
                </button>
                <span className="w-4 text-center font-bold">{detailQty}</span>
                <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-background/80 transition-colors" onClick={() => setDetailQty((q) => q + 1)} aria-label="Increase">
                  +
                </button>
              </div>
              <button 
                className="inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 flex-1"
                onClick={confirmAddFromDetail}
              >
                Add · ₹{(detailItem.price * detailQty).toFixed(2)}
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}