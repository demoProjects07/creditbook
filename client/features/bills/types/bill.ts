export interface Bill {
  id: string;
  customerId: string;

  amount: number;
  paidAmount: number;
  status: string;

  note?: string;
  attachment?: string | null;
  attachmentOriginal?: string | null;

  billDate: string;
  createdAt: string;

  payments: {
    id: string;
    amount: number;
    note?: string;
    paymentDate: string;
  }[];
}