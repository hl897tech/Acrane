import { BASE_URL, getAuthHeaders, handleApiResponse, requireLogin } from "./config.js";
import { renderLayout } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  renderLayout();
  const cartContainer = document.getElementById("cartContainer");
  const summaryContainer = document.getElementById("checkoutSummary");

  if (cartContainer) {
    requireLogin();
    loadCart(cartContainer);
  }
  if (summaryContainer) {
    requireLogin();
    loadCheckout(summaryContainer);
  }
});

async function fetchCart() {
  const res = await fetch(`${BASE_URL}/cart`, {
    headers: getAuthHeaders(),
  });
  const data = await handleApiResponse(res);
  return data.data || [];
}

async function loadCart(container) {
  container.innerHTML = "Loading your arcane stash…";

  try {
    const items = await fetchCart();
    if (!items.length) {
      container.innerHTML = `
        <div class="card">
          <p>Your cart is empty. Start enchanting your wardrobe from the <a class="nav-link" href="products.html">catalog</a>.</p>
        </div>
      `;
      return;
    }

    let total = 0;
    items.forEach((i) => {
      total += i.price * i.quantity;
    });

    container.innerHTML = `
      <div class="card">
        <h2 class="section-title">Your Cart</h2>
        <table class="table mt-4">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (i) => `
              <tr>
                <td>${i.name}</td>
                <td>$${i.price}</td>
                <td>${i.quantity}</td>
                <td>$${i.price * i.quantity}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" data-remove="${i.productId}">
                    Remove
                  </button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div class="mt-4" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>Total: <span class="product-price">$${total}</span></div>
          <a href="checkout.html" class="btn btn-primary">Proceed to checkout</a>
        </div>
      </div>
    `;

    container.querySelectorAll("[data-remove]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        await removeItem(btn.getAttribute("data-remove"));
        loadCart(container);
      })
    );
  } catch (err) {
    container.innerHTML = `<p class="msg msg-error">${err.message}</p>`;
  }
}

async function removeItem(productId) {
  await fetch(`${BASE_URL}/cart/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

// checkout

async function loadCheckout(container) {
  container.innerHTML = "Preparing your order…";

  try {
    const items = await fetchCart();
    if (!items.length) {
      container.innerHTML =
        '<p>Your cart is empty. Add items before checking out.</p>';
      return;
    }

    let total = 0;
    items.forEach((i) => (total += i.price * i.quantity));

    container.innerHTML = `
      <div class="card">
        <h2 class="section-title">Checkout</h2>
        <p class="section-subtitle">Review your items and confirm your order.</p>

        <table class="table mt-2">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (i) => `
              <tr>
                <td>${i.name}</td>
                <td>${i.quantity}</td>
                <td>$${i.price * i.quantity}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="mt-4">
          <div>Total: <span class="product-price">$${total}</span></div>
        </div>

        <form id="addressForm" class="mt-4">
          <label>Shipping address (demo text only)</label>
          <textarea name="address" rows="3" placeholder="Dorm, building, or an imaginary Arcane Tower…" required></textarea>
          <p class="helper-text">For the project, this is not actually stored; the backend just needs an addressId.</p>
          <button class="btn btn-primary mt-2" type="submit">Place order</button>
        </form>

        <p id="checkoutMsg" class="msg mt-2"></p>
      </div>
    `;

    const form = document.getElementById("addressForm");
    const msgEl = document.getElementById("checkoutMsg");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msgEl.textContent = "";
      msgEl.className = "msg";

      try {
        // Build items array for API from cart
        const orderItems = items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        }));

        const res = await fetch(`${BASE_URL}/orders`, {
          method: "POST",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({
            addressId: 1,
            items: orderItems,
          }),
        });

        const data = await handleApiResponse(res);
        msgEl.textContent = `Order #${data.data.orderId} created. Status: ${data.data.status}`;
        msgEl.className = "msg msg-success";

        setTimeout(() => (window.location.href = "orders.html"), 1400);
      } catch (err) {
        msgEl.textContent = err.message || "Failed to place order.";
        msgEl.className = "msg msg-error";
      }
    });
  } catch (err) {
    container.innerHTML = `<p class="msg msg-error">${err.message}</p>`;
  }
}
