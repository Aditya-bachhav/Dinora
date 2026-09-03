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
  const {
    items: cartItems,
    addItem,
    setQuantity,
    itemCount,
    subtotal,
  } = useCart();

  const [status, setStatus] = useState("loading");
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
          setError(
            err.detail ||
              err.message ||
              "Could not load the menu"
          );
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
          (i) =>
            i.name.toLowerCase().includes(q) ||
            (i.description || "").toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [menu.categories, search]);

  function quantityInCart(menuItemId) {
    const found = cartItems.find(
      (i) => i.menu_item_id === menuItemId
    );

    return found ? found.quantity : 0;
  }

  function scrollToCategory(id) {
    setActiveCategory(id);

    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  function openDetail(item) {
    setDetailItem(item);
    setDetailQty(
      Math.max(1, quantityInCart(item.id))
    );
  }

  function confirmAddFromDetail() {
    const alreadyInCart =
      quantityInCart(detailItem.id) > 0;

    if (alreadyInCart) {
      setQuantity(detailItem.id, detailQty);
    } else {
      for (let i = 0; i < detailQty; i++) {
        addItem(detailItem);
      }
    }

    toast.success(
      `${detailItem.name} × ${detailQty} in cart`
    );

    setDetailItem(null);
  }

  if (status === "loading") {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

          .dinora-guest-page {
            min-height: 100vh;
            background:
              radial-gradient(circle at 10% 0%, rgba(191,105,48,.05), transparent 27%),
              radial-gradient(circle at 100% 100%, rgba(38,57,45,.05), transparent 27%),
              #f6f3ed;
            font-family: "DM Sans", sans-serif;
            color: #202923;
          }

          .dinora-guest-loading {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
            padding: 22px 16px 100px;
          }

          .dinora-loading-brand {
            width: 110px;
            height: 22px;
            margin: 0 auto 22px;
            border-radius: 8px;
            background: #e7e5df;
            animation: dinoraGuestPulse 1.5s infinite ease-in-out;
          }

          .dinora-loading-search {
            height: 48px;
            border-radius: 14px;
            background: #e7e5df;
            margin-bottom: 18px;
            animation: dinoraGuestPulse 1.5s infinite ease-in-out;
          }

          .dinora-loading-category {
            width: 120px;
            height: 26px;
            margin: 27px 0 13px;
            border-radius: 8px;
            background: #e7e5df;
            animation: dinoraGuestPulse 1.5s infinite ease-in-out;
          }

          @keyframes dinoraGuestPulse {
            0%, 100% { opacity: .5; }
            50% { opacity: 1; }
          }
        `}</style>

        <div className="dinora-guest-page">
          <div className="dinora-guest-loading">
            <div className="dinora-loading-brand" />
            <div className="dinora-loading-search" />

            <div className="dinora-loading-category" />
            <MenuItemSkeleton />
            <MenuItemSkeleton />

            <div className="dinora-loading-category" />
            <MenuItemSkeleton />
          </div>
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <style>{`
          .dinora-menu-error-page {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            background: #f6f3ed;
          }

          .dinora-menu-error-card {
            width: 100%;
            max-width: 480px;
            padding: 28px;
            border-radius: 24px;
            background: rgba(255,255,255,.88);
            border: 1px solid rgba(38,57,45,.08);
            box-shadow: 0 24px 65px rgba(35,41,37,.07);
          }
        `}</style>

        <div className="dinora-menu-error-page">
          <div className="dinora-menu-error-card">
            <EmptyState
              icon="⚠️"
              title="Something went wrong"
              message={error}
              action={
                <button
                  className="dinora-primary-button"
                  onClick={() =>
                    navigate(`/t/${tableToken}`, {
                      replace: true,
                    })
                  }
                >
                  Start over
                </button>
              }
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
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(191,105,48,.055), transparent 28%),
            radial-gradient(circle at 100% 85%, rgba(38,57,45,.05), transparent 26%),
            #f6f3ed;
          color: #202923;
          font-family: "DM Sans", sans-serif;
          padding: 18px 16px 112px;
        }

        .dinora-menu-container {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
        }

        .dinora-menu-top {
          position: sticky;
          top: 0;
          z-index: 20;
          padding: 4px 0 13px;
          margin-bottom: 4px;
          background: linear-gradient(
            to bottom,
            rgba(246,243,237,.98) 78%,
            rgba(246,243,237,0)
          );
        }

        .dinora-menu-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 14px;
        }

        .dinora-menu-brand-mark {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #26392d;
          color: #fffdf8;
          font-family: "Playfair Display", serif;
          font-size: 17px;
          font-weight: 700;
          box-shadow: 0 7px 17px rgba(38,57,45,.13);
        }

        .dinora-menu-brand-name {
          font-family: "Playfair Display", serif;
          font-size: 23px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -.4px;
          color: #2a3a31;
        }

        .dinora-search-wrap {
          position: relative;
        }

        .dinora-search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #929993;
          font-size: 15px;
          pointer-events: none;
        }

        .dinora-menu-search {
          width: 100%;
          height: 49px;
          border: 1px solid rgba(38,57,45,.09);
          border-radius: 14px;
          outline: none;
          background: rgba(255,255,255,.88);
          padding: 0 15px 0 40px;
          font: 400 13px "DM Sans", sans-serif;
          color: #27342c;
          box-shadow: 0 9px 26px rgba(35,41,37,.055);
          transition:
            border-color .18s ease,
            box-shadow .18s ease,
            background .18s ease;
        }

        .dinora-menu-search::placeholder {
          color: #a5aba6;
        }

        .dinora-menu-search:focus {
          background: #fff;
          border-color: #aab6ac;
          box-shadow:
            0 9px 26px rgba(35,41,37,.055),
            0 0 0 4px rgba(76,101,84,.08);
        }

        .dinora-category-tabs {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          margin: 9px 0 19px;
          padding: 2px 1px 7px;
          scrollbar-width: none;
        }

        .dinora-category-tabs::-webkit-scrollbar {
          display: none;
        }

        .dinora-category-tab {
          flex: 0 0 auto;
          height: 33px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(38,57,45,.08);
          background: rgba(255,255,255,.68);
          color: #7c847e;
          font: 600 11px "DM Sans", sans-serif;
          cursor: pointer;
          white-space: nowrap;
          transition: .18s ease;
        }

        .dinora-category-tab:hover {
          background: #fff;
          color: #455249;
        }

        .dinora-category-tab.active {
          border-color: #26392d;
          background: #26392d;
          color: #fffdf8;
          box-shadow: 0 6px 15px rgba(38,57,45,.13);
        }

        .dinora-search-empty {
          padding: 16px;
          margin-top: 12px;
          border-radius: 22px;
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(38,57,45,.07);
        }

        .dinora-category {
          scroll-margin-top: 105px;
          margin-bottom: 26px;
        }

        .dinora-category-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 11px;
        }

        .dinora-category-title {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0;
          color: #293a30;
          font-family: "Playfair Display", serif;
          font-size: 23px;
          line-height: 1.1;
          letter-spacing: -.35px;
        }

        .dinora-category-title::before {
          content: "";
          width: 7px;
          height: 23px;
          border-radius: 999px;
          background: #a16b47;
        }

        .dinora-category-count {
          color: #9a9f9a;
          font-size: 10px;
          font-weight: 700;
        }

        .dinora-menu-items {
          display: grid;
          gap: 10px;
        }

        .dinora-menu-item {
          position: relative;
          display: flex;
          width: 100%;
          padding: 0;
          overflow: hidden;
          text-align: left;
          border: 1px solid rgba(38,57,45,.065);
          border-radius: 17px;
          background: rgba(255,255,255,.92);
          color: inherit;
          box-shadow:
            0 10px 28px rgba(35,41,37,.045),
            0 2px 7px rgba(35,41,37,.025);
          cursor: pointer;
          transition:
            transform .18s ease,
            box-shadow .18s ease,
            border-color .18s ease;
        }

        .dinora-menu-item:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: rgba(38,57,45,.10);
          box-shadow:
            0 15px 32px rgba(35,41,37,.065),
            0 3px 9px rgba(35,41,37,.03);
        }

        .dinora-menu-item:active:not(:disabled) {
          transform: translateY(0);
        }

        .dinora-menu-item.unavailable {
          cursor: not-allowed;
          opacity: .62;
        }

        .dinora-menu-item-image {
          width: 104px;
          height: 120px;
          flex: 0 0 104px;
          object-fit: cover;
          background: #ebe8df;
        }

        .dinora-menu-item-image-placeholder {
          width: 104px;
          height: 120px;
          flex: 0 0 104px;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              135deg,
              #eeeae1,
              #e4e0d6
            );
          color: #a19b90;
          font-size: 27px;
        }

        .dinora-menu-item-body {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 13px 14px 12px;
        }

        .dinora-menu-item-name {
          margin: 0;
          color: #334038;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.35;
        }

        .dinora-menu-item-description {
          display: -webkit-box;
          margin: 5px 0 0;
          overflow: hidden;
          color: #8b928c;
          font-size: 11px;
          line-height: 1.45;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .dinora-menu-item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 12px;
        }

        .dinora-menu-price {
          color: #2c4033;
          font-family: "Playfair Display", serif;
          font-size: 17px;
          font-weight: 700;
          white-space: nowrap;
        }

        .dinora-unavailable-label {
          color: #999d99;
          font-size: 10px;
          font-weight: 700;
        }

        .dinora-add-label {
          min-width: 57px;
          height: 31px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #26392d;
          color: #fffdf8;
          font: 700 11px "DM Sans", sans-serif;
          box-shadow: 0 6px 14px rgba(38,57,45,.13);
        }

        .dinora-qty-stepper {
          display: inline-flex;
          align-items: center;
          height: 31px;
          overflow: hidden;
          border: 1px solid #dfe2dc;
          border-radius: 10px;
          background: #fff;
        }

        .dinora-qty-stepper button {
          width: 30px;
          height: 31px;
          border: 0;
          background: transparent;
          color: #415047;
          font: 500 17px "DM Sans", sans-serif;
          cursor: pointer;
        }

        .dinora-qty-stepper button:hover {
          background: #f4f5f1;
        }

        .dinora-qty-stepper span {
          min-width: 25px;
          color: #37443c;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
        }

        .dinora-cart-fab {
          position: fixed;
          z-index: 30;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%);
          width: min(728px, calc(100% - 28px));
          min-height: 53px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          border-radius: 16px;
          background: #26392d;
          color: #fffdf8;
          text-decoration: none;
          box-shadow:
            0 16px 36px rgba(38,57,45,.20),
            0 4px 10px rgba(38,57,45,.10);
          transition:
            transform .18s ease,
            background .18s ease;
        }

        .dinora-cart-fab:hover {
          background: #31493a;
        }

        .dinora-cart-fab:active {
          transform: translateX(-50%) translateY(1px);
        }

        .dinora-cart-left {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 12px;
          font-weight: 700;
        }

        .dinora-cart-count {
          min-width: 23px;
          height: 23px;
          padding: 0 6px;
          display: inline-grid;
          place-items: center;
          border-radius: 999px;
          background: rgba(255,255,255,.14);
          font-size: 10px;
        }

        .dinora-cart-total {
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 700;
        }

        /* Detail sheet */

        .dinora-detail-image {
          width: 100%;
          max-height: 265px;
          display: block;
          object-fit: cover;
          border-radius: 17px;
          background: #ebe8df;
          margin-bottom: 16px;
        }

        .dinora-detail-image-placeholder {
          width: 100%;
          height: 220px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          background:
            linear-gradient(
              135deg,
              #eeeae1,
              #e4e0d6
            );
          color: #a19b90;
          font-size: 42px;
          margin-bottom: 16px;
        }

        .dinora-detail-price {
          color: #293c31;
          font-family: "Playfair Display", serif;
          font-size: 25px;
          font-weight: 700;
        }

        .dinora-detail-description {
          margin: 8px 0 0;
          color: #7e877f;
          font-size: 13px;
          line-height: 1.6;
        }

        .dinora-detail-footer {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 10px;
          margin-top: 21px;
          padding-top: 17px;
          border-top: 1px solid #eceae3;
        }

        .dinora-detail-footer .dinora-qty-stepper {
          height: 48px;
        }

        .dinora-detail-footer .dinora-qty-stepper button {
          width: 41px;
          height: 48px;
          font-size: 20px;
        }

        .dinora-detail-footer .dinora-qty-stepper span {
          min-width: 30px;
          font-size: 12px;
        }

        .dinora-detail-add-button,
        .dinora-primary-button {
          height: 48px;
          border: 0;
          border-radius: 12px;
          background: #26392d;
          color: #fffdf8;
          font: 700 12px "DM Sans", sans-serif;
          cursor: pointer;
          box-shadow: 0 9px 20px rgba(38,57,45,.14);
          transition: .18s ease;
        }

        .dinora-detail-add-button:hover,
        .dinora-primary-button:hover {
          background: #31493a;
          transform: translateY(-1px);
        }

        @media (min-width: 700px) {
          .dinora-menu-page {
            padding-top: 26px;
          }

          .dinora-menu-item-image,
          .dinora-menu-item-image-placeholder {
            width: 118px;
            flex-basis: 118px;
            height: 132px;
          }

          .dinora-menu-item-body {
            padding: 15px 17px 14px;
          }
        }

        @media (max-width: 500px) {
          .dinora-menu-page {
            padding-left: 12px;
            padding-right: 12px;
          }

          .dinora-menu-brand {
            margin-bottom: 12px;
          }

          .dinora-menu-item-image,
          .dinora-menu-item-image-placeholder {
            width: 92px;
            flex-basis: 92px;
            height: 116px;
          }

          .dinora-menu-item-body {
            padding: 12px 11px;
          }

          .dinora-menu-item-name {
            font-size: 13px;
          }

          .dinora-menu-price {
            font-size: 16px;
          }

          .dinora-cart-fab {
            bottom: 12px;
            width: calc(100% - 20px);
          }
        }

        @media (max-width: 360px) {
          .dinora-menu-item-image,
          .dinora-menu-item-image-placeholder {
            width: 78px;
            flex-basis: 78px;
          }

          .dinora-menu-item-description {
            -webkit-line-clamp: 1;
          }
        }
      `}</style>

      <div className="dinora-menu-page">
        <div className="dinora-menu-container">
          <div className="dinora-menu-top">
            <div className="dinora-menu-brand">
              <div
                className="dinora-menu-brand-mark"
                aria-hidden="true"
              >
                D
              </div>

              <div className="dinora-menu-brand-name">
                Dinora
              </div>
            </div>

            <div className="dinora-search-wrap">
              <span
                className="dinora-search-icon"
                aria-hidden="true"
              >
                ⌕
              </span>

              <input
                type="search"
                className="dinora-menu-search"
                placeholder="Search dishes, drinks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {!search &&
              menu.categories.length > 1 && (
                <div className="dinora-category-tabs">
                  {menu.categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`dinora-category-tab ${
                        activeCategory === cat.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        scrollToCategory(cat.id)
                      }
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
          </div>

          {filteredCategories.length === 0 && (
            <div className="dinora-search-empty">
              <EmptyState
                icon="🔍"
                title="No items found"
                message="Try a different search term."
              />
            </div>
          )}

          {filteredCategories.map((category) => (
            <section
              key={category.id}
              id={`cat-${category.id}`}
              className="dinora-category"
            >
              <div className="dinora-category-heading">
                <h2 className="dinora-category-title">
                  {category.name}
                </h2>

                <span className="dinora-category-count">
                  {category.items.length} items
                </span>
              </div>

              <div className="dinora-menu-items">
                {category.items.map((item) => {
                  const qty = quantityInCart(item.id);

                  return (
                    <button
                      key={item.id}
                      className={`dinora-menu-item ${
                        !item.available
                          ? "unavailable"
                          : ""
                      }`}
                      onClick={() =>
                        item.available && openDetail(item)
                      }
                      disabled={!item.available}
                    >
                      {item.image_url ? (
                        <img
                          className="dinora-menu-item-image"
                          src={item.image_url}
                          alt=""
                        />
                      ) : (
                        <div className="dinora-menu-item-image-placeholder">
                          🍽️
                        </div>
                      )}

                      <div className="dinora-menu-item-body">
                        <div>
                          <h3 className="dinora-menu-item-name">
                            {item.name}
                          </h3>

                          {item.description && (
                            <p className="dinora-menu-item-description">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="dinora-menu-item-footer">
                          <span className="dinora-menu-price">
                            ₹{item.price.toFixed(2)}
                          </span>

                          {!item.available ? (
                            <span className="dinora-unavailable-label">
                              Unavailable
                            </span>
                          ) : qty > 0 ? (
                            <div
                              className="dinora-qty-stepper"
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                              role="group"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuantity(
                                    item.id,
                                    qty - 1
                                  );
                                }}
                                aria-label="Decrease"
                              >
                                −
                              </button>

                              <span>{qty}</span>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuantity(
                                    item.id,
                                    qty + 1
                                  );
                                }}
                                aria-label="Increase"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="dinora-add-label">
                              Add
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {itemCount > 0 && (
          <Link
            to={`/t/${tableToken}/cart`}
            className="dinora-cart-fab"
          >
            <span className="dinora-cart-left">
              <span className="dinora-cart-count">
                {itemCount}
              </span>

              <span>View cart</span>
            </span>

            <span className="dinora-cart-total">
              ₹{subtotal.toFixed(2)}
            </span>
          </Link>
        )}
      </div>

      <Sheet
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.name}
      >
        {detailItem && (
          <>
            {detailItem.image_url ? (
              <img
                className="dinora-detail-image"
                src={detailItem.image_url}
                alt=""
              />
            ) : (
              <div className="dinora-detail-image-placeholder">
                🍽️
              </div>
            )}

            <div className="dinora-detail-price">
              ₹{detailItem.price.toFixed(2)}
            </div>

            {detailItem.description && (
              <p className="dinora-detail-description">
                {detailItem.description}
              </p>
            )}

            <div className="dinora-detail-footer">
              <div className="dinora-qty-stepper">
                <button
                  onClick={() =>
                    setDetailQty((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                  aria-label="Decrease"
                >
                  −
                </button>

                <span>{detailQty}</span>

                <button
                  onClick={() =>
                    setDetailQty((q) => q + 1)
                  }
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              <button
                className="dinora-detail-add-button"
                onClick={confirmAddFromDetail}
              >
                Add · ₹
                {(
                  detailItem.price * detailQty
                ).toFixed(2)}
              </button>
            </div>
          </>
        )}
      </Sheet>
    </>
  );
}