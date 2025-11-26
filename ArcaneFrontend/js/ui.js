import { getToken } from "./config.js";

export function renderLayout() {
  renderNavbar();
  renderFooter();
}

function renderNavbar() {
  const header = document.querySelector("header");
  if (!header) return;

  const isLoggedIn = !!getToken();

  header.innerHTML = `
    <nav class="navbar">
      <div class="nav-left">
        <a href="index.html" class="brand">
          <div class="brand-logo">AF</div>
          <span>Arcane Footwear</span>
        </a>
        <a href="products.html" class="nav-link">Catalog</a>
        <a href="cart.html" class="nav-link">Cart</a>
        <a href="orders.html" class="nav-link">Orders</a>
      </div>
      <div class="nav-right">
        ${
          isLoggedIn
            ? `
        <button class="btn btn-ghost btn-sm" id="logoutBtn">Log out</button>
        `
            : `
        <a href="login.html" class="nav-link">Login</a>
        <a href="register.html" class="btn btn-primary btn-sm">Sign up</a>
        `
        }
      </div>
    </nav>
  `;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  }
}

function renderFooter() {
  const footer = document.querySelector("footer");
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.classList.add("footer");
  footer.innerHTML = `
    <div>© ${year} Arcane Footwear · Crafted for ITC-505 · Powered by a Spring Boot API</div>
  `;
}
