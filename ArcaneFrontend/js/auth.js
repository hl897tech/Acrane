import { BASE_URL, handleApiResponse } from "./config.js";
import { renderLayout } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  renderLayout();

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) setupLogin(loginForm);
  if (registerForm) setupRegister(registerForm);
});

function setMessage(id, message, isError = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `msg ${isError ? "msg-error" : "msg-success"}`;
}

function setupLogin(form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMessage("loginMsg", "");

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      setMessage("loginMsg", "Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await handleApiResponse(res);

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("userId", data.data.userId);

      setMessage("loginMsg", "Login successful. Redirecting…", false);
      setTimeout(() => (window.location.href = "index.html"), 800);
    } catch (err) {
      setMessage("loginMsg", err.message || "Login failed.");
    }
  });
}

function setupRegister(form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMessage("registerMsg", "");

    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!username || !email || !password) {
      setMessage("registerMsg", "All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await handleApiResponse(res);

      setMessage("registerMsg", data.message || "Registration success.", false);
      setTimeout(() => (window.location.href = "login.html"), 900);
    } catch (err) {
      setMessage("registerMsg", err.message || "Registration failed.");
    }
  });
}
