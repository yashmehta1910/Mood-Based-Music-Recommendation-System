const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/** Returns the saved login token (or null when logged out). */
export const getToken = () => localStorage.getItem("token");

/**
 * Small fetch wrapper: adds JSON headers, attaches the login token when
 * auth is true, and turns server error messages into thrown Errors.
 */
async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const signup = (name, email, password) =>
  request("/auth/signup", { method: "POST", body: { name, email, password } });

export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: { email, password } });

export const fetchMe = () => request("/auth/me", { auth: true });

export const savePlaylist = (playlist) =>
  request("/playlists", { method: "POST", body: playlist, auth: true });

export const fetchPlaylists = () => request("/playlists", { auth: true });

export const deletePlaylist = (id) =>
  request(`/playlists/${id}`, { method: "DELETE", auth: true });
