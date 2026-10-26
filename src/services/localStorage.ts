import type { Design } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const createDesign = (design: Design) =>
  request<Design>("/designs", { method: "POST", body: JSON.stringify(design) });

export const getDesigns = () => request<Design[]>("/designs");

export const getDesignById = (id: string) =>
  request<Design>(`/designs/${encodeURIComponent(id)}`);

export const updateDesign = (id: string, changes: Partial<Design>) =>
  request<Design>(`/designs/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });

export const deleteDesign = (id: string) =>
  request<void>(`/designs/${encodeURIComponent(id)}`, { method: "DELETE" });

export const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
