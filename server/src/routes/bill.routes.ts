import { Router } from "express";
import prisma from "../prisma/client";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);
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

router.delete("/:id", async (req, res) => {
  try {
    await prisma.bill.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Bill deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete bill",
    });
  }
});

// Update Bill
router.put("/:id", async (req, res) => {
  try {
    const { amount, note } = req.body;

    const bill = await prisma.bill.update({
      where: {
        id: req.params.id,
      },
      data: {
        amount,
        note,
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