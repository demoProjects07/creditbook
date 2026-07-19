import { apiFetch } from "@/lib/api";
const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api/payments`;

export async function getPayments(customerId: string) {
  const response = await apiFetch(
    `${API_URL}/customer/${customerId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return response.json();
}

export async function createPayment(data: {
  customerId: string;
  billId: string;
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
    throw new Error("Failed to create payment");
  }

  return response.json();
}

export async function deletePayment(id: string) {
  const response = await apiFetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete payment");
  }

  return response.json();
}

export async function updatePayment(
  id: string,
  data: {
    billId?: string;
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
    throw new Error("Failed to update payment");
  }

  return response.json();
}
