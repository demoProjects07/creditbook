import { Router } from "express";
import prisma from "../prisma/client";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);

router.get("/", async (_req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        bills: true,
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const result = customers.map((customer) => {
      const totalBills = customer.bills.reduce(
        (sum, bill) => sum + bill.amount,
        0
      );

      const totalPayments = customer.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      return {
        id: customer.id,
        customerCode: customer.customerCode,
        name: customer.name,
        mobile: customer.mobile,
        photo: customer.photo,
        createdAt: customer.createdAt,
        totalBills,
        totalPayments,
        outstanding: totalBills - totalPayments,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        bills: true,
        payments: true,
      },
    });

    if (!customer) {
      res.status(404).json({
        message: "Customer not found",
      });
      return;
    }

    const totalBills = customer.bills.reduce(
      (sum, bill) => sum + bill.amount,
      0
    );

    const totalPayments = customer.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const outstanding = totalBills - totalPayments;

    res.json({
      ...customer,
      totalBills,
      totalPayments,
      outstanding,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customer",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, mobile } = req.body;

    if (!name) {
      res.status(400).json({
        message: "Customer name is required",
      });
      return;
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