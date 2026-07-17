import { Router } from "express";
import prisma from "../prisma/client";

const router = Router();

// Create Bill

router.post("/", async (req, res) => {
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

export default router;