export const BASE_URL = "http://localhost:8080/api"; // adjust if needed

export function getToken() {
  return localStorage.getItem("token");
}

export function getAuthHeaders(extra = {}) {
  const token = getToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export function requireLogin() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

export async function handleApiResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Unexpected server response");
  }

  if (!res.ok || data.code !== 0) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}
