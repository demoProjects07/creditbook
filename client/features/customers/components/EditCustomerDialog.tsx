"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateCustomer } from "@/services/customer.service";

type Props = {
  customer: any;
  onUpdated: () => void;
};

export default function EditCustomerDialog({
  customer,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const [photo, setPhoto] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setMobile(customer.mobile || "");

      if (customer.photo) {
        setPreview(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/${customer.photo}`
        );
      } else {
        setPreview("");
      }
    }
  }, [customer]);

  function handlePhotoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setPhoto(file);

    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    try {
      if (!name.trim()) {
        alert("Customer name is required");
        return;
      }
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("mobile", mobile);

      if (photo) {
        formData.append("photo", photo);
      }

      await updateCustomer(customer.id, formData);

      setOpen(false);

      onUpdated();
    } catch (error) {
      console.error(error);
      alert("Failed to update customer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button>
            Edit Customer
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Customer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <Label>Name</Label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Mobile</Label>

            <Input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div>
            <Label>Photo</Label>

            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-24 rounded-full border object-cover"
            />
          )}

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}