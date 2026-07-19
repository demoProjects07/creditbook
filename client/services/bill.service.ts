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
  attachment?: File | null;
}) {
  const formData = new FormData();

  formData.append("customerId", data.customerId);
  formData.append("amount", data.amount.toString());

  if (data.note) {
    formData.append("note", data.note);
  }

  if (data.attachment) {
    formData.append("attachment", data.attachment);
  }

  const response = await apiFetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create bill");
  }

  return response.json();
}

export async function deleteBill(id: string) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

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
    attachment?: File | null;
  }
) {
  const formData = new FormData();

  formData.append("amount", data.amount.toString());

  if (data.note) {
    formData.append("note", data.note);
  }

  if (data.attachment) {
    formData.append("attachment", data.attachment);
  }

  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update bill");
  }

  return response.json();
}
