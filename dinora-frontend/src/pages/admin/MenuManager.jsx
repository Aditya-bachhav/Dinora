import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import Sheet from "../../components/ui/Sheet";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";

const EMPTY_ITEM_FORM = {
  name: "",
  category_id: "",
  price: "",
  description: "",
  image_url: "",
};

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
      toast.error(
        err.detail || err.message || "Could not create category"
      );
    } finally {
      setCreatingCategory(false);
    }
  }

  function openItemSheet(defaultCategoryId) {
    setItemForm({
      ...EMPTY_ITEM_FORM,
      category_id: defaultCategoryId
        ? String(defaultCategoryId)
        : "",
    });

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
      toast.error(
        err.detail || err.message || "Could not create menu item"
      );
    } finally {
      setCreatingItem(false);
    }
  }

  async function handleToggleAvailable(item) {
    try {
      await adminApi.updateMenuItem(item.id, {
        available: !item.available,
      });

      await load();
    } catch (err) {
      toast.error(
        err.detail || err.message || "Could not update item"
      );
    }
  }

  async function handleDeleteItem(item) {
    const ok = await confirm(
      `Delete "${item.name}"? This can't be undone.`,
      {
        title: "Delete item",
        danger: true,
      }
    );

    if (!ok) return;

    try {
      await adminApi.deleteMenuItem(item.id);
      toast.success(`${item.name} deleted`);
      await load();
    } catch (err) {
      toast.error(
        err.detail || err.message || "Could not delete item"
      );
    }
  }

  if (status === "loading") {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

          .dinora-menu-loading {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
            font-family: "DM Sans", sans-serif;
          }

          .dinora-loading-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 52px;
            border-radius: 16px;
            background: rgba(255,255,255,.82);
            border: 1px solid rgba(38,57,45,.08);
            box-shadow: 0 12px 30px rgba(35,41,37,.06);
          }
        `}</style>

        <div className="dinora-menu-loading">
          <div className="dinora-loading-box">
            <Spinner size={24} />
          </div>
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <style>{`
          .dinora-menu-error {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
          }

          .dinora-menu-error-card {
            width: 100%;
            max-width: 520px;
            padding: 34px;
            border-radius: 24px;
            background: rgba(255,255,255,.88);
            border: 1px solid rgba(38,57,45,.08);
            box-shadow: 0 25px 65px rgba(35,41,37,.07);
          }
        `}</style>

        <div className="dinora-menu-error">
          <div className="dinora-menu-error-card">
            <EmptyState
              icon="⚠️"
              title="Something went wrong"
              message={error}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        .dinora-menu-page {
          min-height: 100%;
          padding: 28px;
          background:
            radial-gradient(circle at 10% 0%, rgba(191,105,48,.05), transparent 25%),
            radial-gradient(circle at 100% 100%, rgba(38,57,45,.05), transparent 25%),
            #f6f3ed;
          font-family: "DM Sans", sans-serif;
          color: #202923;
        }

        .dinora-menu-container {
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
        }

        .dinora-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 28px;
        }

        .dinora-menu-heading {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-menu-eyebrow {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          color: #8c928d;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .dinora-menu-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 35px;
          line-height: 1;
          letter-spacing: -.8px;
          color: #26372d;
        }

        .dinora-menu-subtitle {
          margin: 2px 0 0;
          color: #858b86;
          font-size: 13px;
        }

        .dinora-menu-header-actions {
          display: flex;
          gap: 8px;
        }

        .dinora-menu-btn {
          height: 42px;
          padding: 0 15px;
          border-radius: 11px;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font: 700 12px "DM Sans", sans-serif;
          cursor: pointer;
          transition:
            transform .18s ease,
            box-shadow .18s ease,
            background .18s ease;
        }

        .dinora-menu-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .dinora-menu-btn-secondary {
          background: rgba(255,255,255,.78);
          color: #3d4b42;
          border-color: rgba(38,57,45,.10);
        }

        .dinora-menu-btn-secondary:hover:not(:disabled) {
          background: #fff;
          box-shadow: 0 8px 20px rgba(35,41,37,.06);
        }

        .dinora-menu-btn-primary {
          background: #26392d;
          color: #fffdf8;
          box-shadow: 0 8px 18px rgba(38,57,45,.14);
        }

        .dinora-menu-btn-primary:hover:not(:disabled) {
          background: #31493a;
          box-shadow: 0 11px 22px rgba(38,57,45,.18);
        }

        .dinora-menu-btn:disabled {
          cursor: not-allowed;
          opacity: .5;
        }

        .dinora-empty-state {
          padding: 20px;
          border-radius: 24px;
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(38,57,45,.08);
          box-shadow: 0 15px 40px rgba(35,41,37,.05);
        }

        .dinora-category {
          margin-bottom: 18px;
          border-radius: 22px;
          overflow: hidden;
          background: rgba(255,255,255,.88);
          border: 1px solid rgba(38,57,45,.07);
          box-shadow:
            0 13px 38px rgba(35,41,37,.055),
            0 2px 7px rgba(35,41,37,.025);
        }

        .dinora-category:last-child {
          margin-bottom: 0;
        }

        .dinora-category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 19px 21px;
          background:
            linear-gradient(
              90deg,
              rgba(248,246,240,.92),
              rgba(255,255,255,.65)
            );
          border-bottom: 1px solid #eceae3;
        }

        .dinora-category-title-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .dinora-category-marker {
          width: 9px;
          height: 27px;
          border-radius: 999px;
          background: #a06b47;
          flex: 0 0 auto;
        }

        .dinora-category-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 20px;
          color: #293a30;
          letter-spacing: -.2px;
        }

        .dinora-category-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 27px;
          height: 23px;
          padding: 0 8px;
          border-radius: 999px;
          background: #eeece5;
          color: #7f867f;
          font-size: 10px;
          font-weight: 700;
        }

        .dinora-category-add {
          height: 34px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid #e0e2dc;
          background: #fff;
          color: #526057;
          font: 700 11px "DM Sans", sans-serif;
          cursor: pointer;
          transition: .18s ease;
        }

        .dinora-category-add:hover {
          background: #f7f7f4;
          border-color: #ccd2cb;
        }

        .dinora-items {
          display: grid;
        }

        .dinora-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 20px;
          align-items: center;
          padding: 18px 21px;
          border-bottom: 1px solid #efede8;
          transition: background .18s ease;
        }

        .dinora-item:last-child {
          border-bottom: 0;
        }

        .dinora-item:hover {
          background: #fcfbf8;
        }

        .dinora-item-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-item-name {
          margin: 0;
          color: #344139;
          font-size: 14px;
          font-weight: 700;
        }

        .dinora-item-description {
          color: #929992;
          font-size: 12px;
          line-height: 1.45;
          max-width: 700px;
        }

        .dinora-item-price {
          color: #26392d;
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 700;
          margin-top: 1px;
        }

        .dinora-item-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .dinora-availability {
          min-width: 88px;
          height: 34px;
          padding: 0 10px;
          border-radius: 999px;
          border: 0;
          font: 700 11px "DM Sans", sans-serif;
          cursor: pointer;
          transition: .18s ease;
        }

        .dinora-availability.available {
          background: #edf4ed;
          color: #55745d;
        }

        .dinora-availability.available:hover {
          background: #e4efe4;
        }

        .dinora-availability.unavailable {
          background: #f1efeb;
          color: #92948f;
        }

        .dinora-availability.unavailable:hover {
          background: #e8e6e1;
        }

        .dinora-delete {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          border: 1px solid #e6e3dc;
          background: #fff;
          color: #9b9188;
          font-size: 12px;
          cursor: pointer;
          transition: .18s ease;
        }

        .dinora-delete:hover {
          color: #a04d42;
          background: #fff6f3;
          border-color: #ecd8d3;
        }

        .dinora-category-empty {
          padding: 17px;
        }

        @media (max-width: 700px) {
          .dinora-menu-page {
            padding: 18px 14px 24px;
          }

          .dinora-menu-header {
            flex-direction: column;
            align-items: stretch;
            gap: 17px;
          }

          .dinora-menu-title {
            font-size: 30px;
          }

          .dinora-menu-header-actions {
            width: 100%;
          }

          .dinora-menu-btn {
            flex: 1;
          }

          .dinora-category-header {
            padding: 16px;
          }

          .dinora-item {
            grid-template-columns: 1fr;
            gap: 13px;
            padding: 16px;
          }

          .dinora-item-actions {
            justify-content: space-between;
          }

          .dinora-availability {
            flex: 1;
          }
        }

        @media (max-width: 430px) {
          .dinora-category-title {
            font-size: 18px;
          }

          .dinora-category-add {
            font-size: 10px;
            padding: 0 10px;
          }
        }

        /* Sheets */

        .dinora-sheet-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .dinora-form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dinora-form-field label {
          color: #4a554d;
          font-size: 12px;
          font-weight: 700;
        }

        .dinora-form-input,
        .dinora-form-select {
          width: 100%;
          min-height: 48px;
          padding: 0 13px;
          border-radius: 12px;
          border: 1px solid #dfe3dd;
          background: #fbfbf9;
          color: #263129;
          font: 400 13px "DM Sans", sans-serif;
          outline: none;
          transition: .18s ease;
        }

        .dinora-form-input::placeholder {
          color: #a7ada8;
        }

        .dinora-form-input:hover,
        .dinora-form-select:hover {
          border-color: #cfd5cf;
          background: #fff;
        }

        .dinora-form-input:focus,
        .dinora-form-select:focus {
          border-color: #5b715f;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(91,113,95,.09);
        }

        .dinora-form-textarea {
          min-height: 88px;
          padding: 12px 13px;
          resize: vertical;
        }

        .dinora-form-hint {
          margin-top: -3px;
          color: #999f99;
          font-size: 11px;
          line-height: 1.45;
        }

        .dinora-form-submit {
          width: 100%;
          height: 50px;
          margin-top: 3px;
          border: 0;
          border-radius: 13px;
          background: #26392d;
          color: #fffdf8;
          font: 700 13px "DM Sans", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 9px 20px rgba(38,57,45,.14);
          transition: .18s ease;
        }

        .dinora-form-submit:hover:not(:disabled) {
          background: #31493a;
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(38,57,45,.18);
        }

        .dinora-form-submit:disabled {
          opacity: .6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="dinora-menu-page">
        <div className="dinora-menu-container">
          <header className="dinora-menu-header">
            <div className="dinora-menu-heading">
              <p className="dinora-menu-eyebrow">
                Restaurant configuration
              </p>

              <h1 className="dinora-menu-title">Menu</h1>

              <p className="dinora-menu-subtitle">
                Organize categories and control what's available to guests.
              </p>
            </div>

            <div className="dinora-menu-header-actions">
              <button
                className="dinora-menu-btn dinora-menu-btn-secondary"
                onClick={() => setCategorySheetOpen(true)}
              >
                <span>+</span>
                Category
              </button>

              <button
                className="dinora-menu-btn dinora-menu-btn-primary"
                onClick={() => openItemSheet()}
                disabled={categories.length === 0}
              >
                <span>+</span>
                Item
              </button>
            </div>
          </header>

          {categories.length === 0 ? (
            <div className="dinora-empty-state">
              <EmptyState
                icon="🍴"
                title="No categories yet"
                message="Add a category first, then add items to it."
                action={
                  <button
                    className="dinora-menu-btn dinora-menu-btn-primary"
                    onClick={() => setCategorySheetOpen(true)}
                  >
                    + Add category
                  </button>
                }
              />
            </div>
          ) : (
            categories.map((category) => (
              <section
                key={category.id}
                className="dinora-category"
              >
                <div className="dinora-category-header">
                  <div className="dinora-category-title-wrap">
                    <span
                      className="dinora-category-marker"
                      aria-hidden="true"
                    />

                    <h3 className="dinora-category-title">
                      {category.name}
                    </h3>

                    <span className="dinora-category-count">
                      {category.items.length}
                    </span>
                  </div>

                  <button
                    className="dinora-category-add"
                    onClick={() => openItemSheet(category.id)}
                  >
                    + Add item
                  </button>
                </div>

                {category.items.length === 0 ? (
                  <div className="dinora-category-empty">
                    <EmptyState
                      icon="🍽️"
                      title="No items in this category"
                      action={
                        <button
                          className="dinora-menu-btn dinora-menu-btn-secondary"
                          onClick={() =>
                            openItemSheet(category.id)
                          }
                        >
                          Add item
                        </button>
                      }
                    />
                  </div>
                ) : (
                  <div className="dinora-items">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="dinora-item"
                      >
                        <div className="dinora-item-info">
                          <strong className="dinora-item-name">
                            {item.name}
                          </strong>

                          {item.description && (
                            <span className="dinora-item-description">
                              {item.description}
                            </span>
                          )}

                          <span className="dinora-item-price">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </div>

                        <div className="dinora-item-actions">
                          <button
                            className={`dinora-availability ${
                              item.available
                                ? "available"
                                : "unavailable"
                            }`}
                            onClick={() =>
                              handleToggleAvailable(item)
                            }
                          >
                            {item.available
                              ? "Available"
                              : "Hidden"}
                          </button>

                          <button
                            className="dinora-delete"
                            onClick={() =>
                              handleDeleteItem(item)
                            }
                            aria-label={`Delete ${item.name}`}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </div>

      <Sheet
        open={categorySheetOpen}
        onClose={() => setCategorySheetOpen(false)}
        title="Add category"
      >
        <form
          className="dinora-sheet-form"
          onSubmit={handleCreateCategory}
        >
          <div className="dinora-form-field">
            <label htmlFor="category-name">
              Category name
            </label>

            <input
              id="category-name"
              className="dinora-form-input"
              placeholder="e.g. Desserts"
              value={newCategoryName}
              onChange={(e) =>
                setNewCategoryName(e.target.value)
              }
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="dinora-form-submit"
            disabled={creatingCategory}
          >
            {creatingCategory ? (
              <Spinner size={16} />
            ) : (
              "Add category"
            )}
          </button>
        </form>
      </Sheet>

      <Sheet
        open={itemSheetOpen}
        onClose={() => setItemSheetOpen(false)}
        title="Add menu item"
      >
        <form
          className="dinora-sheet-form"
          onSubmit={handleCreateItem}
        >
          <div className="dinora-form-field">
            <label htmlFor="item-name">Name</label>

            <input
              id="item-name"
              className="dinora-form-input"
              value={itemForm.name}
              onChange={(e) =>
                setItemForm({
                  ...itemForm,
                  name: e.target.value,
                })
              }
              placeholder="e.g. Truffle Pasta"
              required
            />
          </div>

          <div className="dinora-form-field">
            <label htmlFor="item-category">Category</label>

            <select
              id="item-category"
              className="dinora-form-select"
              value={itemForm.category_id}
              onChange={(e) =>
                setItemForm({
                  ...itemForm,
                  category_id: e.target.value,
                })
              }
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

          <div className="dinora-form-field">
            <label htmlFor="item-price">Price</label>

            <input
              id="item-price"
              className="dinora-form-input"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={itemForm.price}
              onChange={(e) =>
                setItemForm({
                  ...itemForm,
                  price: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="dinora-form-field">
            <label htmlFor="item-description">
              Description
            </label>

            <textarea
              id="item-description"
              className="dinora-form-input dinora-form-textarea"
              placeholder="Briefly describe the dish..."
              value={itemForm.description}
              onChange={(e) =>
                setItemForm({
                  ...itemForm,
                  description: e.target.value,
                })
              }
            />

            <span className="dinora-form-hint">
              Optional. Keep it short enough to scan quickly.
            </span>
          </div>

          <div className="dinora-form-field">
            <label htmlFor="item-image">Image URL</label>

            <input
              id="item-image"
              className="dinora-form-input"
              value={itemForm.image_url}
              onChange={(e) =>
                setItemForm({
                  ...itemForm,
                  image_url: e.target.value,
                })
              }
              placeholder="https://..."
            />

            <span className="dinora-form-hint">
              Optional. Paste the direct URL of the item image.
            </span>
          </div>

          <button
            type="submit"
            className="dinora-form-submit"
            disabled={creatingItem}
          >
            {creatingItem ? (
              <Spinner size={16} />
            ) : (
              "Add item"
            )}
          </button>
        </form>
      </Sheet>
    </>
  );
}