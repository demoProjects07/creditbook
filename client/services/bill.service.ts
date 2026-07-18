import { apiFetch } from "@/lib/api";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/bills`;

export async function getBills(customerId: string) {
  const response = await apiFetch(`${API_URL}/customer/${customerId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch bills");
  }

  return response.json();
}

export async function createBill(data: {
  customerId: string;
  amount: number;
  note?: string;
}) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create bill");
  }

  return response.json();
}

export async function deleteBill(id: string) {
  const response = await apiFetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete bill");
  }

  return response.json();
}

export async function updateBill(
  id: string,
  data: {
    amount: number;
    note?: string;
  }
) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update bill");
  }

  return response.json();
}
