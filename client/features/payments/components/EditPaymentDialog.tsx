"use client";

import { useState } from "react";

import { updatePayment } from "@/services/payment.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  payment: {
    id: string;
    amount: number;
    note?: string;
  };
  onUpdated: () => void;
};

export default function EditPaymentDialog({
  payment,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState(
    payment.amount.toString()
  );

  const [note, setNote] = useState(
    payment.note || ""
  );

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      await updatePayment(payment.id, {
        amount: Number(amount),
        note,
      });

      setOpen(false);

      onUpdated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Edit
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
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
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : "Update Payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}