export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    Authorization: token ? `Bearer ${token}` : "",
    ...(options.headers || {}),
  };

  // Only add Content-Type when NOT sending FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
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