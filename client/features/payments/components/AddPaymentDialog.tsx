"use client";

import { useState } from "react";

import { createPayment } from "@/services/payment.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { getBills } from "@/services/bill.service";

type Props = {
  customerId: string;
  onPaymentAdded: () => void;
};

export default function AddPaymentDialog({
  customerId,
  onPaymentAdded,
}: Props) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState<any[]>([]);
  const [billId, setBillId] = useState("");

  async function loadBills() {
    try {
      const data = await getBills(customerId);
      setBills(data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (open) {
      loadBills();
    }
  }, [open]);

  async function handleSubmit() {
    if (!billId) {
      alert("Please select a bill");
      return;
    }

    if (!amount) {
      alert("Amount is required");
      return;
    }

    try {
      setLoading(true);

      await createPayment({
        customerId,
        billId,
        amount: Number(amount),
        note,
      });;

      setAmount("");
      setNote("");
      setBillId("");

      setOpen(false);

      onPaymentAdded();
    } catch (error) {
      console.error(error);
      alert("Failed to create payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
      >
        + Add Payment
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Select Bill</Label>

            <select
              className="w-full rounded-md border p-2"
              value={billId}
              onChange={(e) => setBillId(e.target.value)}
            >
              <option value="">Choose a bill</option>

              {bills.map((bill) => (
                <option key={bill.id} value={bill.id}>
                  ₹{bill.amount.toLocaleString()} - {bill.note || "No note"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <Label>Note</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}