import { Router } from "express";
import prisma from "../prisma/client";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(customers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, mobile } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Customer name is required",
      });
    }

    const customer = await prisma.customer.create({
      data: {
        customerCode: `CB${Date.now()}`,
        name,
        mobile,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create customer",
    });
  }
});

export default router;