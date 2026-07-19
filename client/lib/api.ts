export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Only add Content-Type when NOT sending FormData
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return response;
}