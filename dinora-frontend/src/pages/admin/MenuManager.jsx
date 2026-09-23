import { useEffect, useMemo, useState, useCallback } from "react";
import { animate, stagger } from "animejs";
import Pencil from "lucide-react/dist/esm/icons/pencil";
import { adminApi } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import Sheet from "../../components/ui/Sheet";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { IconMenu } from "../../components/ui/Icons";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

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

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const list = await adminApi.listCategories();
      setCategories(list);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.detail || err.message || "Could not load menu");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) || (item.description || "").toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, search]);

  useEffect(() => {
    if (status !== "ready" || visibleCategories.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-menu-item]").forEach((item) => {
        item.style.opacity = "1";
      });
      return;
    }

    const anim = animate("[data-menu-item]", {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(45),
      duration: 420,
      ease: "out(4)",
    });

    return () => anim?.cancel();
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
    const ok = await confirm(`Delete "${item.name}"? This can't be undone.`, {
      title: "Delete item",
      danger: true,
    });
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
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 animate-pulse" aria-busy="true">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 sm:pb-6">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-muted"></div>
            <div className="h-8 sm:h-10 w-40 bg-muted"></div>
            <div className="h-3 sm:h-4 w-56 bg-muted"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`h-24 bg-muted border border-border ${index === 3 ? "col-span-2 lg:col-span-1" : ""}`}></div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-64 bg-muted border border-border"></div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <EmptyState icon="⚠️" title="Something went wrong" message={error} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-background text-foreground flex flex-col gap-6 sm:gap-8 overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="text-[10px] sm:text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary"></span> Menu Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Menu</h1>
          <p className="text-sm font-medium text-muted-foreground">Keep every dish clear, current, and ready to order.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <Button variant="outline" className="flex-1 sm:flex-none font-bold rounded-none border-border" onClick={() => setCategorySheetOpen(true)}>
            + Category
          </Button>
          <Button className="flex-1 sm:flex-none font-bold rounded-none" onClick={() => openItemSheet()} disabled={categories.length === 0}>
            + Item
          </Button>
        </div>
      </div>

      {/* Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="border border-border bg-card p-4 sm:p-5 flex flex-col justify-between space-y-2">
          <span className="text-2xl sm:text-3xl font-black tracking-tight">{categories.length}</span>
          <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Categories</span>
        </div>
        <div className="border border-border bg-card p-4 sm:p-5 flex flex-col justify-between space-y-2">
          <span className="text-2xl sm:text-3xl font-black tracking-tight">
            {categories.reduce((sum, category) => sum + category.items.length, 0)}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Dishes</span>
        </div>
        <div className="border border-primary bg-primary/5 p-4 sm:p-5 flex flex-col justify-between space-y-2">
          <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            {categories.reduce((sum, category) => sum + category.items.filter((item) => item.available).length, 0)}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-primary/80 uppercase tracking-widest">Available Now</span>
        </div>
        <div className="col-span-2 lg:col-span-1 flex flex-col justify-center border border-border bg-card p-4 sm:p-5">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold" aria-hidden="true">
              ⌕
            </span>
            <Input
              type="search"
              placeholder="Find a dish..."
              className="pl-8 rounded-none border-border bg-background focus-visible:ring-primary h-10 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Find a dish"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {categories.length === 0 ? (
        <div className="mt-4 sm:mt-8 border border-border bg-card p-6 sm:p-12 flex items-center justify-center">
          <EmptyState
            icon={<span className="text-muted-foreground w-10 h-10 flex items-center justify-center"><IconMenu /></span>}
            title="No categories yet"
            message="Structure your menu by adding a category first, then populate it with dishes."
            action={
              <Button className="mt-4 rounded-none font-bold" onClick={() => setCategorySheetOpen(true)}>
                Add your first category
              </Button>
            }
          />
        </div>
      ) : visibleCategories.length === 0 ? (
        <div className="mt-4 sm:mt-8 border border-border bg-card p-6 sm:p-12 flex items-center justify-center">
          <EmptyState icon="⌕" title="No dishes found" message="Try adjusting your search terms." />
        </div>
      ) : (
        <div className="space-y-10 sm:space-y-12 pb-24">
          {visibleCategories.map((category) => (
            <div key={category.id} className="space-y-5 sm:space-y-6">
              {/* Category Header */}
              <div className="flex items-end justify-between border-b-2 border-primary/20 pb-2">
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-bold text-muted-foreground w-5 sm:w-6">
                    {String(categories.findIndex((entry) => entry.id === category.id) + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">{category.name}</h3>
                </div>
                <button
                  className="text-[10px] sm:text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest shrink-0"
                  onClick={() => openItemSheet(category.id)}
                >
                  + Add dish
                </button>
              </div>

              {category.items.length === 0 ? (
                <div className="border border-dashed border-border p-6 sm:p-8 bg-muted/30">
                  <EmptyState
                    icon="🍽️"
                    title="Category is empty"
                    action={
                      <Button variant="outline" className="mt-4 rounded-none font-bold" onClick={() => openItemSheet(category.id)}>
                        Add item
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-4 sm:pb-0 snap-x sm:snap-none">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-200 w-[260px] sm:w-auto shrink-0 snap-start"
                      data-menu-item
                    >
                      {/* Image / Placeholder */}
                      <div className="aspect-[4/3] bg-muted relative overflow-hidden border-b border-border">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-black text-muted-foreground/30">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <strong className="text-base sm:text-lg font-extrabold leading-tight tracking-tight">{item.name}</strong>
                          <span className="text-sm sm:text-base font-black text-primary shrink-0">
                            ₹{Number(item.price).toFixed(2)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-[13px] sm:text-sm font-medium text-muted-foreground line-clamp-2 mb-4 flex-1">
                            {item.description}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-2">
                          <button
                            className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider border transition-colors ${
                              item.available
                                ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground"
                                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                            }`}
                            onClick={() => handleToggleAvailable(item)}
                          >
                            {item.available ? "Available" : "Hidden"}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                              onClick={() => openEditItem(item)}
                              aria-label={`Edit ${item.name}`}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              onClick={() => handleDeleteItem(item)}
                              aria-label={`Delete ${item.name}`}
                            >
                              <span className="text-lg leading-none font-bold">✕</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sheet for Category creation */}
      <Sheet open={categorySheetOpen} onClose={() => setCategorySheetOpen(false)} title="Add category">
        <form className="flex flex-col gap-6 mt-6" onSubmit={handleCreateCategory}>
          <div className="space-y-4">
            <Label className="text-sm font-bold">Category name</Label>
            <div className="flex flex-wrap gap-2 mb-2" aria-label="Suggested categories">
              {CATEGORY_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider border transition-colors ${
                    newCategoryName === suggestion
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setNewCategoryName(suggestion)}
                >
                  + {suggestion}
                </button>
              ))}
            </div>
            <Input
              placeholder="e.g. Desserts"
              className="rounded-none border-border focus-visible:ring-primary font-medium"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full rounded-none font-bold" disabled={creatingCategory}>
            {creatingCategory ? <Spinner size={16} /> : "Add category"}
          </Button>
        </form>
      </Sheet>

      {/* Sheet for Item creation/editing */}
      <Sheet
        open={itemSheetOpen}
        onClose={() => {
          setItemSheetOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? "Edit menu item" : "Add menu item"}
      >
        <form className="flex flex-col gap-4 sm:gap-5 mt-6 pb-6" onSubmit={handleCreateItem}>
          <div className="flex gap-3 sm:gap-4 p-4 bg-muted/50 border border-border mb-2">
            <span className="text-primary font-black text-xl leading-none">+</span>
            <div className="flex flex-col">
              <strong className="text-sm font-extrabold">{editingItem ? "Edit dish details" : "Add a dish to your menu"}</strong>
              <span className="text-xs font-medium text-muted-foreground mt-1">Give guests the details they need to choose quickly.</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm">Name</Label>
            <Input
              className="rounded-none border-border focus-visible:ring-primary font-medium"
              value={itemForm.name}
              onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm">Category</Label>
            <Select
              className="w-full rounded-none border-border focus-visible:ring-primary font-medium"
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
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm">Price (₹)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              className="rounded-none border-border focus-visible:ring-primary font-medium"
              value={itemForm.price}
              onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm">Description <span className="text-muted-foreground font-medium">(optional)</span></Label>
            <Textarea
              rows="3"
              className="rounded-none border-border focus-visible:ring-primary resize-none font-medium"
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm">Image URL <span className="text-muted-foreground font-medium">(optional)</span></Label>
            <Input
              className="rounded-none border-border focus-visible:ring-primary font-medium"
              value={itemForm.image_url}
              onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full mt-4 rounded-none font-bold" disabled={creatingItem}>
            {creatingItem ? <Spinner size={16} /> : editingItem ? "Save changes" : "Add item"}
          </Button>
        </form>
      </Sheet>
    </div>
  );
}