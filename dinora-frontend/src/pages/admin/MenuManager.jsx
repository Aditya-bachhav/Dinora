import { useEffect, useMemo, useState } from "react";
import { animate, stagger } from "animejs";
import Pencil from "lucide-react/dist/esm/icons/pencil";
import { adminApi } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import Sheet from "../../components/ui/Sheet";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { IconMenu } from "../../components/ui/Icons";

const EMPTY_ITEM_FORM = { name: "", category_id: "", price: "", description: "", image_url: "" };
const CATEGORY_SUGGESTIONS = ["Starters", "Main course", "Desserts", "Drinks", "Specials"];

export default function MenuManager() {
  const toast = useToast();
  const confirm = useConfirm();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [itemSheetOpen, setItemSheetOpen] = useState(false);
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM);
  const [creatingItem, setCreatingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");

  async function load() {
    setStatus("loading");
    try {
      const list = await adminApi.listCategories();
      setCategories(list);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.detail || err.message || "Could not load menu");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.name.toLowerCase().includes(query) || (item.description || "").toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, search]);

  useEffect(() => {
    if (status !== "ready" || visibleCategories.length === 0) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-menu-item]").forEach((item) => { item.style.opacity = "1"; });
      return undefined;
    }
    const animation = animate("[data-menu-item]", {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(45),
      duration: 420,
      ease: "outQuart",
    });
    return () => animation.cancel();
  }, [status, visibleCategories.length, search]);

  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      await adminApi.createCategory(newCategoryName.trim());
      setNewCategoryName("");
      setCategorySheetOpen(false);
      toast.success("Category added");
      await load();
    } catch (err) {
      toast.error(err.detail || err.message || "Could not create category");
    } finally {
      setCreatingCategory(false);
    }
  }

  function openItemSheet(defaultCategoryId) {
    setEditingItem(null);
    setItemForm({ ...EMPTY_ITEM_FORM, category_id: defaultCategoryId ? String(defaultCategoryId) : "" });
    setItemSheetOpen(true);
  }

  function openEditItem(item) {
    setEditingItem(item);
    setItemForm({
      name: item.name || "",
      category_id: String(item.category_id || ""),
      price: String(item.price ?? ""),
      description: item.description || "",
      image_url: item.image_url || "",
    });
    setItemSheetOpen(true);
  }

  async function handleCreateItem(e) {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.category_id) return;
    setCreatingItem(true);
    try {
      const payload = {
        name: itemForm.name.trim(),
        category_id: parseInt(itemForm.category_id, 10),
        price: parseFloat(itemForm.price) || 0,
        description: itemForm.description.trim() || null,
        image_url: itemForm.image_url.trim() || null,
      };
      if (editingItem) {
        await adminApi.updateMenuItem(editingItem.id, payload);
      } else {
        await adminApi.createMenuItem({ ...payload, available: true });
      }
      setItemSheetOpen(false);
      setEditingItem(null);
      toast.success(`${itemForm.name} ${editingItem ? "updated" : "added to menu"}`);
      await load();
    } catch (err) {
      toast.error(err.detail || err.message || "Could not create menu item");
    } finally {
      setCreatingItem(false);
    }
  }

  async function handleToggleAvailable(item) {
    try {
      await adminApi.updateMenuItem(item.id, { available: !item.available });
      await load();
    } catch (err) {
      toast.error(err.detail || err.message || "Could not update item");
    }
  }

  async function handleDeleteItem(item) {
    const ok = await confirm(`Delete "${item.name}"? This can't be undone.`, { title: "Delete item", danger: true });
    if (!ok) return;
    try {
      await adminApi.deleteMenuItem(item.id);
      toast.success(`${item.name} deleted`);
      await load();
    } catch (err) {
      toast.error(err.detail || err.message || "Could not delete item");
    }
  }

  if (status === "loading") {
    return (
      <div className="admin-menu-page admin-menu-loading" aria-busy="true">
        <div className="admin-page-head">
          <div>
            <div className="menu-page-kicker">MENU STUDIO</div>
            <h1>Menu</h1>
            <p>Loading your dishes…</p>
          </div>
          <div className="menu-loading-pulse" />
        </div>
        <div className="menu-loading-grid">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} />)}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <EmptyState icon="⚠️" title="Something went wrong" message={error} />;
  }

  return (
    <div className="admin-menu-page">
      <div className="admin-page-head">
        <div>
          <div className="menu-page-kicker"><span /> Menu studio</div>
          <h1>Menu</h1>
          <p>Keep every dish clear, current, and ready to order.</p>
        </div>
        <div className="admin-page-head-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setCategorySheetOpen(true)}>
            + Category
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => openItemSheet()} disabled={categories.length === 0}>
            + Item
          </button>
        </div>
      </div>

      <div className="menu-overview-bar">
        <div className="menu-overview-stat"><strong>{categories.length}</strong><span>categories</span></div>
        <div className="menu-overview-stat"><strong>{categories.reduce((sum, category) => sum + category.items.length, 0)}</strong><span>dishes</span></div>
        <div className="menu-overview-stat"><strong>{categories.reduce((sum, category) => sum + category.items.filter((item) => item.available).length, 0)}</strong><span>available now</span></div>
        <label className="menu-search-field">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Find a dish" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Find a dish" />
        </label>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={<span className="icon" style={{ width: 28, height: 28 }}><IconMenu /></span>}
          title="No categories yet"
          message="Add a category first, then add items to it."
          action={
            <button className="btn btn-primary" onClick={() => setCategorySheetOpen(true)}>
              Add category
            </button>
          }
        />
      ) : (
        visibleCategories.length === 0 ? (
          <EmptyState icon="⌕" title="No dishes found" message="Try another dish name or description." />
        ) : visibleCategories.map((category) => (
          <div key={category.id} className="admin-category-block">
            <div className="menu-category-heading">
              <div><span className="menu-category-index">{String(categories.findIndex((entry) => entry.id === category.id) + 1).padStart(2, "0")}</span><h3>{category.name}</h3></div>
              <button className="menu-add-inline" onClick={() => openItemSheet(category.id)}>+ Add dish</button>
            </div>
            {category.items.length === 0 ? (
              <EmptyState
                icon="🍽️"
                title="No items in this category"
                action={
                  <button className="btn btn-secondary btn-sm" onClick={() => openItemSheet(category.id)}>
                    Add item
                  </button>
                }
              />
            ) : (
              <div className="menu-dish-grid">
                {category.items.map((item) => (
                <div key={item.id} className="menu-dish-card" data-menu-item>
                  {item.image_url ? <img src={item.image_url} alt="" className="menu-dish-image" /> : <div className="menu-dish-image menu-dish-placeholder">{item.name.charAt(0).toUpperCase()}</div>}
                  <div className="menu-dish-body">
                    <div className="menu-dish-title-row"><strong>{item.name}</strong><span>₹{Number(item.price).toFixed(2)}</span></div>
                    {item.description && <p>{item.description}</p>}
                    <div className="menu-dish-actions">
                      <button className={`availability-toggle ${item.available ? "available" : "unavailable"}`} onClick={() => handleToggleAvailable(item)}>
                        {item.available ? "Available" : "Hidden"}
                      </button>
                      <button className="icon-btn-sm menu-edit-button" onClick={() => openEditItem(item)} aria-label={`Edit ${item.name}`}><Pencil size={14} /></button>
                      <button className="icon-btn-sm" onClick={() => handleDeleteItem(item)} aria-label={`Delete ${item.name}`}>✕</button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <Sheet open={categorySheetOpen} onClose={() => setCategorySheetOpen(false)} title="Add category">
        <form className="stacked-form" onSubmit={handleCreateCategory}>
          <div className="field">
            <label>Category name</label>
            <div className="category-suggestion-chips" aria-label="Suggested categories">
              {CATEGORY_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className={`category-suggestion-chip ${newCategoryName === suggestion ? "selected" : ""}`}
                  onClick={() => setNewCategoryName(suggestion)}
                >
                  + {suggestion}
                </button>
              ))}
            </div>
            <input
              placeholder="e.g. Desserts"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={creatingCategory}>
            {creatingCategory ? <Spinner size={16} /> : "Add category"}
          </button>
        </form>
      </Sheet>

      <Sheet open={itemSheetOpen} onClose={() => { setItemSheetOpen(false); setEditingItem(null); }} title={editingItem ? "Edit menu item" : "Add menu item"}>
        <form className="stacked-form menu-item-sheet-form" onSubmit={handleCreateItem}>
          <div className="menu-item-sheet-intro">
            <span className="menu-item-sheet-mark">+</span>
            <div>
              <strong>Add a dish to your menu</strong>
              <span>Give guests the details they need to choose quickly.</span>
            </div>
          </div>
          <div className="field">
            <label>Name</label>
            <input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Category</label>
            <select
              value={itemForm.category_id}
              onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={itemForm.price}
              onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Description (optional)</label>
            <textarea
              rows="3"
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Image URL (optional)</label>
            <input
              value={itemForm.image_url}
              onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={creatingItem}>
            {creatingItem ? <Spinner size={16} /> : editingItem ? "Save changes" : "Add item"}
          </button>
        </form>
      </Sheet>
    </div>
  );
}
