
import { useMemo, useReducer, useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Studio Headphones",
    category: "Tech",
    price: 2499,
    oldPrice: 3299,
    emoji: "🎧",
    color: "lavender",
    rating: 4.9,
    description: "Immersive sound, all-day comfort",
  },
  {
    id: 2,
    name: "Everyday Sneakers",
    category: "Fashion",
    price: 1899,
    oldPrice: 2499,
    emoji: "👟",
    color: "peach",
    rating: 4.8,
    description: "Lightweight style for every day",
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "Tech",
    price: 3999,
    oldPrice: 4999,
    emoji: "⌚",
    color: "mint",
    rating: 4.7,
    description: "Your day, right on your wrist",
  },
  {
    id: 4,
    name: "Daily Backpack",
    category: "Lifestyle",
    price: 1499,
    oldPrice: 1999,
    emoji: "🎒",
    color: "blue",
    rating: 4.8,
    description: "Room for everything that matters",
  },
  {
    id: 5,
    name: "Minimal Desk Lamp",
    category: "Home",
    price: 1199,
    oldPrice: 1599,
    emoji: "💡",
    color: "yellow",
    rating: 4.6,
    description: "A softer glow for focused moments",
  },
  {
    id: 6,
    name: "Travel Tumbler",
    category: "Lifestyle",
    price: 699,
    oldPrice: 899,
    emoji: "🥤",
    color: "pink",
    rating: 4.9,
    description: "Keep your favourite drink close",
  },
];

// Initial state of the shopping cart
const initialCart = [];

// Reducer handles all cart actions
function cartReducer(state, action) {
  switch (action.type) {
    // ACTION 1: Add an item
    case "ADD_ITEM": {
      const existing = state.find(
        (item) => item.id === action.product.id
      );

      // If already in cart, increase quantity
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Otherwise, add it with quantity 1
      return [
        ...state,
        { ...action.product, quantity: 1 },
      ];
    }

    // ACTION 2: Increase quantity
    case "INCREASE_ITEM":
      return state.map((item) =>
        item.id === action.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    // ACTION 3: Decrease quantity
    case "DECREASE_ITEM":
      return state
        .map((item) =>
          item.id === action.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

    // ACTION 4: Remove an item completely
    case "REMOVE_ITEM":
      return state.filter(
        (item) => item.id !== action.id
      );

    // ACTION 5: Clear the entire cart
    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

// Format prices in Indian rupees
const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function App() {
  const [cart, dispatch] = useReducer(
    cartReducer,
    initialCart
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category)),
  ];

  // Filter products by search and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "All" || product.category === category;

    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Calculate cart values
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const shipping =
    subtotal === 0 || subtotal >= 2500 ? 0 : 99;

  const total = subtotal + shipping;

  // Dispatch ADD_ITEM action
  function addToCart(product) {
    dispatch({ type: "ADD_ITEM", product });
    setNotice(`${product.name} added to your bag!`);

    window.setTimeout(() => setNotice(""), 2000);
  }

  function checkout() {
    if (cart.length === 0) return;

    window.alert(
      `ShopEasy checkout demo\n\n` +
      `Items: ${cartCount}\n` +
      `Total: ${money(total)}\n\n` +
      `Thank you for shopping with ShopEasy!`
    );
  }

  return (
    <div className="app">
      <div className="announcement">
        ✦ FREE SHIPPING ON ORDERS OVER ₹2,500 ✦
      </div>

      <header className="navbar">
        <a className="logo" href="#home">
          <span className="logo-icon">s</span>
          <span>
            shop<span className="logo-accent">easy</span>
            <small>GOOD FINDS. GOOD FEELINGS.</small>
          </span>
        </a>

        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search for something lovely..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="cart-button"
          onClick={() => setCartOpen(true)}
        >
          🛍️ Your bag
          <span className="cart-count">{cartCount}</span>
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <span className="eyebrow">
              ✦ THE LITTLE THINGS, BETTER
            </span>

            <h1>
              Find your next
              <br />
              <em>favourite thing.</em>
            </h1>

            <p>
              Thoughtfully picked essentials to make
              everyday feel a little more extraordinary.
            </p>

            <a className="hero-button" href="#shop">
              Explore the collection <span>↗</span>
            </a>

            <div className="hero-proof">
              <span>😊 😎 🥰</span>
              <span>2,400+ happy shoppers</span>
              <span>★ 4.9/5 rating</span>
            </div>
          </div>

          <div className="hero-art">
            <div className="sun-circle"></div>
            <span className="floating-star star-one">✳</span>
            <span className="floating-star star-two">✦</span>

            <div className="shopping-bag bag-back">
              <span>the<br />good<br />stuff.</span>
            </div>

            <div className="shopping-bag bag-front">
              <span className="bag-heart">♡</span>
              <b>SHOP<br />HAPPY</b>
            </div>

            <span className="hero-caption">
              little joys, delivered ♡
            </span>
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                YOUR NEXT LITTLE OBSESSION
              </span>
              <h2>
                Good things, <em>right this way.</em>
              </h2>
            </div>

            <span className="product-count">
              {filteredProducts.length} lovely finds
            </span>
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => {
              const cartItem = cart.find(
                (item) => item.id === product.id
              );

              return (
                <article className="product-card" key={product.id}>
                  <div
                    className={`product-art ${product.color}`}
                  >
                    <span className="product-label">
                      HANDPICKED
                    </span>

                    <span className="product-emoji">
                      {product.emoji}
                    </span>

                    <button
                      className="quick-add"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>

                  <div className="product-info">
                    <div className="product-meta">
                      {product.category}
                      <span>★ {product.rating}</span>
                    </div>

                    <h3>{product.name}</h3>
                    <p>{product.description}</p>

                    <div className="product-bottom">
                      <div className="price">
                        <strong>{money(product.price)}</strong>
                        <del>{money(product.oldPrice)}</del>
                      </div>

                      <button
                        className="add-button"
                        onClick={() => addToCart(product)}
                      >
                        {cartItem
                          ? `Add more (${cartItem.quantity})`
                          : "Add to bag"}
                        <span> ↗</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <span>🔎</span>
              <h3>No finds just yet!</h3>
              <p>Try another search or choose a different category.</p>
              <button
                className="category-button active"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Show all products
              </button>
            </div>
          )}
        </section>

        <section className="benefits">
          <div>
            <span>📦</span>
            <p><b>Carefully packed</b><small>A little joy at your door</small></p>
          </div>
          <div>
            <span>♡</span>
            <p><b>Good quality, always</b><small>Things worth keeping</small></p>
          </div>
          <div>
            <span>↺</span>
            <p><b>Easy returns</b><small>Love it or send it back</small></p>
          </div>
          <div>
            <span>☻</span>
            <p><b>Here to help</b><small>We're happy to help</small></p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="footer-logo" href="#home">
          shop<span>easy</span>
        </a>
        <p>Little things. Big happy. © 2026 ShopEasy</p>
        <a href="#home">Back to top ↑</a>
      </footer>

      {notice && (
        <div className="toast">
          <span>✓</span> {notice}
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}

      {cartOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <span className="eyebrow">YOUR GOODIES</span>
                <h2>Your bag ({cartCount})</h2>
              </div>

              <button
                className="close-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span className="empty-cart-icon">🛍️</span>
                <h3>Your bag is taking a nap.</h3>
                <p>Let's find something that'll make it smile.</p>
                <button
                  className="checkout-button"
                  onClick={() => setCartOpen(false)}
                >
                  Explore goodies ↗
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div
                        className={`cart-item-art ${item.color}`}
                      >
                        {item.emoji}
                      </div>

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>{money(item.price)}</p>

                        <div className="quantity-control">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() =>
                              dispatch({
                                type: "DECREASE_ITEM",
                                id: item.id,
                              })
                            }
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            aria-label="Increase quantity"
                            onClick={() =>
                              dispatch({
                                type: "INCREASE_ITEM",
                                id: item.id,
                              })
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-end">
                        <b>{money(item.price * item.quantity)}</b>

                        <button
                          className="remove-button"
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_ITEM",
                              id: item.id,
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="clear-button"
                  onClick={() =>
                    dispatch({ type: "CLEAR_CART" })
                  }
                >
                  Clear entire bag
                </button>

                <div className="order-summary">
                  <h3>Order summary</h3>

                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "free" : ""}>
                      {shipping === 0 ? "FREE" : money(shipping)}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <p className="shipping-hint">
                      Add {money(2500 - subtotal)} more for free shipping!
                    </p>
                  )}

                  <div className="summary-total">
                    <b>Total</b>
                    <b>{money(total)}</b>
                  </div>

                  <button
                    className="checkout-button full-width"
                    onClick={checkout}
                  >
                    Continue to checkout ↗
                  </button>

                  <p className="secure-note">
                    ♡ A happy purchase, every time
                  </p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
