const API = "http://localhost:5001/api";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const isNoContent = res.status === 204;
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({ message: "Request failed" }))).message
    );
  return isNoContent ? null : res.json();
}

export const api = {
  // auth
  register: (email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // lists
  getLists: () => request("/lists"),
  createList: (name) =>
    request("/lists", { method: "POST", body: JSON.stringify({ name }) }),
  archiveList: (id) => request(`/lists/${id}/archive`, { method: "PUT" }),
  deleteList: (id) => request(`/lists/${id}`, { method: "DELETE" }),
  shareList: (id, email) =>
    request(`/lists/${id}/share`, {
      method: "PUT",
      body: JSON.stringify({ email }),
    }),

  // items
  getItems: (listId) => request(`/lists/${listId}/items`),
  addItem: (listId, name) =>
    request(`/lists/${listId}/items`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  setBought: (listId, itemId, bought) =>
    request(`/lists/${listId}/items/${itemId}/bought`, {
      method: "PUT",
      body: JSON.stringify({ bought }),
    }),
  archiveItem: (listId, itemId) =>
    request(`/lists/${listId}/items/${itemId}/archive`, { method: "PUT" }),
};
