import { apiFetch } from "@/lib/api";

const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`;

export async function getDashboard() {
  const response = await apiFetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return response.json();
}