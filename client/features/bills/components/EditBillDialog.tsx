"use client";

import { useState } from "react";

import { updateBill } from "@/services/bill.service";

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
  bill: {
    id: string;
    amount: number;
    note?: string;
    attachment?: string | null;
  };
  onUpdated: () => void;
};

export default function EditBillDialog({
  bill,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState(
    bill.amount.toString()
  );

  const [note, setNote] = useState(
    bill.note || ""
  );

  const [attachment, setAttachment] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      await updateBill(bill.id, {
        amount: Number(amount),
        note,
        attachment,
      });

      setOpen(false);

      onUpdated();
    } catch (error) {
      console.error(error);
      alert("Failed to update bill");
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
            <DialogTitle>Edit Bill</DialogTitle>
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
              <Label>Replace Attachment</Label>

              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  setAttachment(
                    e.target.files?.[0] || null
                  )
                }
              />

              {bill.attachment && !attachment && (
                <p className="mt-2 text-sm text-gray-500">
                  Current:{" "}
                  <span className="font-medium">
                    {bill.attachment}
                  </span>
                </p>
              )}

              {attachment && (
                <p className="mt-2 text-sm text-green-600">
                  New File:{" "}
                  <span className="font-medium">
                    {attachment.name}
                  </span>
                </p>
              )}
            </div>

            <Button
              className="w-full"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading
                ? "Saving..."
                : "Update Bill"}
            </Button>

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}