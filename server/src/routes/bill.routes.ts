import { Router } from "express";
import prisma from "../prisma/client";
import { authenticate } from "../middleware/auth.middleware";
import upload from "../config/multer";

const router = Router();
router.use(authenticate);
// Create Bill

router.post(
  "/",
  upload.single("attachment"),
  async (req, res) => {
  try {
    const { customerId, amount, note } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const bill = await prisma.bill.create({
      data: {
        customerId,
        amount: Number(amount),
        note,
        attachment: req.file?.filename || null,
        attachmentOriginal: req.file?.originalname || null,
      },
    });

    return res.status(201).json(bill);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create bill",
    });
  }
});

router.get("/customer/:customerId", async (req, res) => {
  try {
    const bills = await prisma.bill.findMany({
      where: {
        customerId: req.params.customerId,
      },
      orderBy: {
        billDate: "desc",
      },
    });

    res.json(bills);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch bills",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const bill = await prisma.bill.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        payments: true,
      },
    });

    if (!bill) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    await prisma.$transaction(async (tx) => {
      // Delete all payments of this bill
      await tx.payment.deleteMany({
        where: {
          billId: bill.id,
        },
      });

      // Delete the bill
      await tx.bill.delete({
        where: {
          id: bill.id,
        },
      });
    });

    res.json({
      message: "Bill and related payments deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete bill",
    });
  }
});

// Update Bill
router.put(
  "/:id",
  upload.single("attachment"),
  async (req, res) => {
  try {
    const { amount, note } = req.body;

    const existingBill = await prisma.bill.findUnique({
      where: {
        id: req.params.id,
      },
    });

    const bill = await prisma.bill.update({
      where: {
        id: req.params.id,
      },
      data: {
        amount: Number(amount),
        note,

        attachment:
          req.file?.filename ??
          existingBill?.attachment ??
          null,

        attachmentOriginal:
          req.file?.originalname ??
          existingBill?.attachmentOriginal ??
          null,
      },
    });

    res.json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update bill",
    });
  }
});

export default router;