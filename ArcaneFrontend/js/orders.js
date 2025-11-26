import { BASE_URL, handleApiResponse, requireLogin } from "./config.js";
import { renderLayout } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  renderLayout();
  requireLogin();
  const container = document.getElementById("ordersContainer");
  if (container) loadOrders(container);
});

async function loadOrders(container) {
  container.innerHTML = "Fetching your order history…";

  const userId = localStorage.getItem("userId");
  if (!userId) {
    container.innerHTML = "Please log in.";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/orders/user/${userId}`);
    const data = await handleApiResponse(res);
    const orders = data.data || [];

    if (!orders.length) {
      container.innerHTML = `
        <div class="card">
          <p>No orders yet. Your Arcane wardrobe is waiting!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="card">
        <h2 class="section-title">Your Orders</h2>
        <table class="table mt-4">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            ${orders
              .map(
                (o) => `
              <tr>
                <td>${o.orderId}</td>
                <td>$${o.totalPrice}</td>
                <td>${o.status}</td>
                <td>${o.createdAt || ""}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p class="msg msg-error">${err.message}</p>`;
  }
}
