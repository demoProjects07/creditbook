export interface Bill {
  id: string;
  amount: number;
  note?: string;
  billDate: string;
  createdAt: string;
  customerId: string;
}