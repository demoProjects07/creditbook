"use client";

import { useState } from "react";

import { createCustomer } from "@/services/customer.service";

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

type AddCustomerDialogProps = {
  onCustomerAdded: () => void;
};

export default function AddCustomerDialog({
  onCustomerAdded,
}: AddCustomerDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const [mobile, setMobile] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) {
      alert("Customer name is required");
      return;
    }

    try {
      setLoading(true);

      await createCustomer({
        name,
        mobile,
      });

      setName("");
      setMobile("");

      setOpen(false);

      onCustomerAdded();
    } catch (error) {
      console.error(error);
      alert("Failed to create customer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        + Add Customer
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
            />
          </div>

          <div>
            <Label>Mobile</Label>

            <Input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile number"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Save Customer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}