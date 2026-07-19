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

export async function createCustomer(data: FormData) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    throw new Error("Failed to create customer");
  }

  return response.json();
}

export async function updateCustomer(
  id: string,
  data: FormData
) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: data,
  });

  if (!response.ok) {
    throw new Error("Failed to update customer");
  }

  return response.json();
}

export async function deleteCustomer(id: string) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete customer");
  }

  return data;
}

export async function getArchivedCustomers() {
  const response = await apiFetch(`${API_URL}/archived/all`);

  if (!response.ok) {
    throw new Error("Failed to fetch archived customers");
  }

  return response.json();
}

export async function restoreCustomer(id: string) {
  const response = await apiFetch(`${API_URL}/${id}/restore`, {
    method: "PATCH",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
