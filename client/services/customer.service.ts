import { apiFetch } from "@/lib/api";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/customers`;

export async function getCustomers() {
  const response = await apiFetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  return response.json();
}

export async function getCustomer(id: string) {
  const response = await apiFetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch customer");
  }

  return response.json();
}

export async function createCustomer(data: {
  name: string;
  mobile?: string;
}) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create customer");
  }

  return response.json();
}