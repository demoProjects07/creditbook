export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  mobile?: string;
  photo?: string | null;

  totalBills: number;
  totalPayments: number;
  outstanding: number;
}