"use client";

import { useState } from "react";

import { createBill } from "@/services/bill.service";

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
  customerId: string;
  onBillAdded: () => void;
};

export default function AddBillDialog({
  customerId,
  onBillAdded,
}: Props) {
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [attachment, setAttachment] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!amount) {
      alert("Amount is required");
      return;
    }

    try {
      setLoading(true);

      await createBill({
        customerId,
        amount: Number(amount),
        note,
        attachment,
      });

      setAmount("");
      setNote("");
      setAttachment(null);

      setOpen(false);

      onBillAdded();
    } catch (error) {
      console.error(error);
      alert("Failed to create bill");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        + Outstanding Bill
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bill</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <Label>Amount</Label>

            <Input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Note</Label>

            <Input
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
            />
          </div>

          <div>
            <Label>
              Bill Image / PDF
            </Label>

            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                setAttachment(
                  e.target.files?.[0] || null
                )
              }
            />

            {attachment && (
              <p className="mt-2 text-sm text-gray-500">
                Selected:
                <span className="font-medium">
                  {" "}
                  {attachment.name}
                </span>
              </p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Bill"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}