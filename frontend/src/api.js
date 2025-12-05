const API = "http://localhost:5001/api";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const isNoContent = res.status === 204;

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message);
  }

  return isNoContent ? null : res.json();
}

export const api = {
  // -------------------
  // AUTH
  // -------------------

  login: async (email, password) => {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.token) setToken(res.token);

    return res; // { token, user }
  },

  register: (name, surename, email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, surename, email, password }),
    }),

  logout: () => clearToken(),

  // -------------------
  // LISTS
  // -------------------

  getLists: () => request("/lists"),
  getList: (id) => request(`/lists/${id}`),

  createList: (name) =>
    request("/lists", { method: "POST", body: JSON.stringify({ name }) }),

  updateList: (id, name) =>
    request(`/lists/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),

  shareList: (id, email) =>
    request(`/lists/${id}/share`, {
      method: "PUT",
      body: JSON.stringify({ email }),
    }),

  archiveList: (id) =>
    request(`/lists/${id}/archive`, {
      method: "PUT",
    }),

  deleteList: (id) =>
    request(`/lists/${id}`, {
      method: "DELETE",
    }),

  // -------------------
  // ITEMS
  // -------------------

  getItems: (listId) => request(`/lists/${listId}/items`),

  addItem: (listId, name, description = "", quantity = 1) =>
    request(`/lists/${listId}/items`, {
      method: "POST",
      body: JSON.stringify({ name, description, quantity }),
    }),

  updateItem: (listId, itemId, payload) =>
    request(`/lists/${listId}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  setBought: (listId, itemId, bought) =>
    request(`/lists/${listId}/items/${itemId}/bought`, {
      method: "PUT",
      body: JSON.stringify({ bought }),
    }),

  archiveItem: (listId, itemId) =>
    request(`/lists/${listId}/items/${itemId}/archive`, {
      method: "PUT",
    }),

  deleteItem: (listId, itemId) =>
    request(`/lists/${listId}/items/${itemId}`, {
      method: "DELETE",
    }),
};
