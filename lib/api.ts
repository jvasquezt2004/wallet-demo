export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? "Error al cargar los datos.");
  }
  return response.json() as Promise<T>;
}

async function send<T>(url: string, method: "POST" | "PATCH", body: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Error al guardar.");
  return data as T;
}

export function postJson<T>(url: string, body: unknown) {
  return send<T>(url, "POST", body);
}

export function patchJson<T>(url: string, body: unknown) {
  return send<T>(url, "PATCH", body);
}
