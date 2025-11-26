import { BASE_URL, handleApiResponse } from "./config.js";
import { renderLayout } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  renderLayout();

  const listContainer = document.getElementById("productList");
  const detailContainer = document.getElementById("productDetail");

  if (listContainer) loadProductList(listContainer);
  if (detailContainer) loadProductDetails(detailContainer);
});

async function loadProductList(container) {
  container.innerHTML = "Loading Arcane kicks…";

  try {
    const res = await fetch(`${BASE_URL}/products?page=1&size=24`);
    const data = await handleApiResponse(res);

    const products = data.data.list || [];
    if (!products.length) {
      container.innerHTML = "<p>No products available.</p>";
      return;
    }

    container.innerHTML = `
      <div class="section-title">Catalog</div>
      <div class="section-subtitle">
        Explore fantasy-inspired footwear infused with neon and arcane sigils.
      </div>
      <div class="grid grid-3">
        ${products
          .map(
            (p) => `
          <article class="card product-card">
            <img src="${p.imageUrl}" alt="${p.name}">
            <div class="product-name">${p.name}</div>
            <div class="product-price">$${p.price}</div>
            <div class="mt-2">
              <span class="badge">Stock: ${p.stock}</span>
            </div>
            <div class="mt-4">
              <button class="btn btn-primary btn-sm" onclick="viewProduct(${p.id})">
                View details
              </button>
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    `;

    window.viewProduct = (id) => {
      window.location.href = `product-details.html?id=${id}`;
    };
  } catch (err) {
    container.innerHTML = `<p class="msg msg-error">${err.message}</p>`;
  }
}

async function loadProductDetails(container) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    container.innerHTML = "<p>Missing product id.</p>";
    return;
  }

  container.innerHTML = "Summoning product details…";

  try {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    const data = await handleApiResponse(res);
    const p = data.data;

    container.innerHTML = `
      <article class="card card-soft">
        <div class="grid" style="grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.4fr); gap: 1.8rem;">
          <div>
            <img src="${p.imageUrl}" alt="${p.name}" style="border-radius: 18px; width: 100%; object-fit: cover;">
          </div>
          <div>
            <h1 class="section-title">${p.name}</h1>
            <div class="product-price" style="font-size: 1.2rem;">$${p.price}</div>
            <p class="mt-2">${p.description || "A rare drop from the Arcane realm."}</p>
            <p class="mt-2">
              <span class="badge">Stock: ${p.stock}</span>
            </p>

            <div class="mt-4">
              <label for="qty">Quantity</label>
              <input id="qty" type="number" min="1" value="1" style="max-width: 120px;">
            </div>

            <div class="mt-4">
              <button class="btn btn-primary" id="addToCartBtn">
                Add to cart
              </button>
            </div>

            <p id="detailMsg" class="msg"></p>
          </div>
        </div>
      </article>
    `;

    const btn = document.getElementById("addToCartBtn");
    const msgEl = document.getElementById("detailMsg");
    btn.addEventListener("click", async () => {
      const qty = parseInt(document.getElementById("qty").value || "1", 10);
      msgEl.textContent = "";
      msgEl.className = "msg";

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          msgEl.textContent = "Please log in before adding to cart.";
          msgEl.className = "msg msg-error";
          return;
        }

        const res2 = await fetch(`${BASE_URL}/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: p.id, quantity: qty }),
        });

        const result = await handleApiResponse(res2);
        msgEl.textContent = result.message || "Added to cart.";
        msgEl.className = "msg msg-success";
      } catch (err) {
        msgEl.textContent = err.message || "Failed to add to cart.";
        msgEl.className = "msg msg-error";
      }
    });
  } catch (err) {
    container.innerHTML = `<p class="msg msg-error">${err.message}</p>`;
  }
}
