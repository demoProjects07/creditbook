import { Router } from "express";
import prisma from "../prisma/client";

const router = Router();

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

export default router;