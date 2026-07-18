import { Router } from "express";
import prisma from "../prisma/client";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);
// Create Payment
router.post("/", async (req, res) => {
  try {
    const { customerId, amount, note } = req.body;

    const payment = await prisma.payment.create({
      data: {
        customerId,
        amount,
        note,
      },
    });

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// Get Payments by Customer
router.get("/customer/:customerId", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        customerId: req.params.customerId,
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
    await prisma.payment.delete({
      where: {
        id: req.params.id,
      },
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

    const payment = await prisma.payment.update({
      where: {
        id: req.params.id,
      },
      data: {
        amount,
        note,
      },
    });

    res.json(payment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update payment",
    });
  }
});

export default router;