import { apiFetch } from "@/lib/api";

const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api/search`;

export async function search(query: string) {
  const response = await apiFetch(
    `${API_URL}?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
}