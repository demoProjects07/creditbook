export interface Payment {
  id: string;
  amount: number;
  note?: string;
  paymentDate: string;

  customerId: string;
  billId?: string;

  bill?: {
    id: string;
    amount: number;
    paidAmount: number;
    status: string;
  };
}