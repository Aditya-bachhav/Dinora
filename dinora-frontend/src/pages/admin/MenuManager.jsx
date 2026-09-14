import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import Sheet from "../../components/ui/Sheet";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { IconMenu } from "../../components/ui/Icons";

const EMPTY_ITEM_FORM = { name: "", category_id: "", price: "", description: "", image_url: "" };

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
    setItemForm({ ...EMPTY_ITEM_FORM, category_id: defaultCategoryId ? String(defaultCategoryId) : "" });
    setItemSheetOpen(true);
  }

  async function handleCreateItem(e) {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.category_id) return;
    setCreatingItem(true);
    try {
      await adminApi.createMenuItem({
        name: itemForm.name.trim(),
        category_id: parseInt(itemForm.category_id, 10),
        price: parseFloat(itemForm.price) || 0,
        description: itemForm.description.trim() || null,
        image_url: itemForm.image_url.trim() || null,
        available: true,
      });
      setItemSheetOpen(false);
      toast.success(`${itemForm.name} added to menu`);
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
      <div className="page-loading">
        <Spinner size={24} />
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
          <h1>Menu</h1>
          <p>Manage your categories and items</p>
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
        categories.map((category) => (
          <div key={category.id} className="admin-category-block">
            <h3>{category.name}</h3>
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
              category.items.map((item) => (
                <div key={item.id} className="menu-item-row">
                  <div className="menu-item-row-info">
                    <strong>{item.name}</strong>
                    <span>₹{item.price.toFixed(2)}</span>
                  </div>
                  <div className="menu-item-row-actions">
                    <button
                      className={`availability-toggle ${item.available ? "available" : "unavailable"}`}
                      onClick={() => handleToggleAvailable(item)}
                    >
                      {item.available ? "Available" : "Hidden"}
                    </button>
                    <button className="icon-btn-sm" onClick={() => handleDeleteItem(item)} aria-label="Delete">
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      )}

      <Sheet open={categorySheetOpen} onClose={() => setCategorySheetOpen(false)} title="Add category">
        <form className="stacked-form" onSubmit={handleCreateCategory}>
          <div className="field">
            <label>Category name</label>
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

      <Sheet open={itemSheetOpen} onClose={() => setItemSheetOpen(false)} title="Add menu item">
        <form className="stacked-form" onSubmit={handleCreateItem}>
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
            <input
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
            {creatingItem ? <Spinner size={16} /> : "Add item"}
          </button>
        </form>
      </Sheet>
    </div>
  );
}
