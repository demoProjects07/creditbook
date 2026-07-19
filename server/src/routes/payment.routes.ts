import { Router } from "express";
import prisma from "../prisma/client";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);
// Create Payment
router.post("/", async (req, res) => {
  try {
    const { customerId, billId, amount, note } = req.body;
    console.log("Request body:", req.body);
    console.log("Bill ID:", billId);
    console.log("Amount:", amount);
    const paymentAmount = Number(amount);

    const bill = await prisma.bill.findUnique({
      where: {
        id: billId,
      },
    });
    console.log("Bill from DB:", bill);

    if (!bill) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    const remaining = bill.amount - bill.paidAmount;

    if (paymentAmount > remaining) {
      return res.status(400).json({
        message: `Payment cannot exceed remaining amount (₹${remaining})`,
      });
    }

    const result = await prisma.$transaction(async (tx) => {

      const payment = await tx.payment.create({
        data: {
          customerId,
          billId,
          amount: paymentAmount,
          note,
        },
      });

      const newPaidAmount = bill.paidAmount + paymentAmount;

      let status = "UNPAID";

      if (newPaidAmount === 0) {
        status = "UNPAID";
      } else if (newPaidAmount < bill.amount) {
        status = "PARTIAL";
      } else {
        status = "PAID";
      }
      console.log("Updating bill with:");
      console.log({
        paidAmount: newPaidAmount,
        status,
      });
      await tx.bill.update({
        where: {
          id: billId,
        },
        data: {
          paidAmount: newPaidAmount,
          status,
        },
      });

      return payment;
    });

    res.json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create payment",
    });
  }
});

// Get Payments by Customer
router.get("/customer/:customerId", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        customerId: req.params.customerId,
      },
      include: {
        bill: true,
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// Delete Payment
router.delete("/:id", async (req, res) => {
  try {

    const payment = await prisma.payment.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    if (!payment.billId) {
      await prisma.payment.delete({
        where: {
          id: payment.id,
        },
      });

      return res.json({
        message: "Payment deleted",
      });
    }

    await prisma.$transaction(async (tx) => {

      const bill = await tx.bill.findUnique({
        where: {
          id: payment.billId,
        },
      });

      if (!bill) {
        throw new Error("Bill not found");
      }

      const newPaidAmount = Math.max(
        0,
        bill.paidAmount - payment.amount
      );

      let status = "UNPAID";

      if (newPaidAmount === 0) {
        status = "UNPAID";
      } else if (newPaidAmount < bill.amount) {
        status = "PARTIAL";
      } else {
        status = "PAID";
      }

      await tx.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          paidAmount: newPaidAmount,
          status,
        },
      });

      await tx.payment.delete({
        where: {
          id: payment.id,
        },
      });

    });

    res.json({
      message: "Payment deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete payment",
    });
  }
});

// Update Payment
router.put("/:id", async (req, res) => {
  try {
    const { amount, note } = req.body;

    const newAmount = Number(amount);

    const oldPayment = await prisma.payment.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!oldPayment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    if (!oldPayment.billId) {
      const payment = await prisma.payment.update({
        where: {
          id: req.params.id,
        },
        data: {
          amount: newAmount,
          note,
        },
      });

      return res.json(payment);
    }

    const result = await prisma.$transaction(async (tx) => {

      const bill = await tx.bill.findUnique({
        where: {
          id: oldPayment.billId,
        },
      });

      if (!bill) {
        throw new Error("Bill not found");
      }

      // Remove old payment, then add new payment
      const newPaidAmount =
        bill.paidAmount - oldPayment.amount + newAmount;

      let status = "UNPAID";

      if (newPaidAmount === 0) {
        status = "UNPAID";
      } else if (newPaidAmount < bill.amount) {
        status = "PARTIAL";
      } else {
        status = "PAID";
      }

      await tx.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          paidAmount: newPaidAmount,
          status,
        },
      });

      const payment = await tx.payment.update({
        where: {
          id: req.params.id,
        },
        data: {
          amount: newAmount,
          note,
        },
      });

      return payment;
    });

    res.json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update payment",
    });
  }
});

export default router;