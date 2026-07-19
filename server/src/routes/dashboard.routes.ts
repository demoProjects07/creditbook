import { Router } from "express";
import prisma from "../prisma/client";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        isActive: true,
      },
      include: {
        bills: true,
        payments: true,
      },
    });

    const totalCustomers = customers.length;

    const totalBills = customers.reduce(
      (sum, customer) =>
        sum +
        customer.bills.reduce(
          (billSum, bill) => billSum + bill.amount,
          0
        ),
      0
    );

    const totalPayments = customers.reduce(
      (sum, customer) =>
        sum +
        customer.payments.reduce(
          (paymentSum, payment) => paymentSum + payment.amount,
          0
        ),
      0
    );

    const totalOutstanding =
      totalBills - totalPayments;


    const recentBills = await prisma.bill.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            customer: {
              select: {
                id: true,
                name: true,
                isActive: true,
              },
            },
        },
        });

        const recentPayments = await prisma.payment.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            customer: {
              select: {
                id: true,
                name: true,
                isActive: true,
            },
            },
        },
        });

        const topCustomers = customers
        .map((customer) => {
            const bills = customer.bills.reduce(
            (sum, bill) => sum + bill.amount,
            0
            );

            const payments = customer.payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
            );

            return {
            id: customer.id,
            name: customer.name,
            isActive: customer.isActive,
            outstanding: bills - payments,
            };
        })
        .sort((a, b) => b.outstanding - a.outstanding)
        .slice(0, 5);


    res.json({
        totalCustomers,
        totalBills,
        totalPayments,
        totalOutstanding,
        recentBills,
        recentPayments,
        topCustomers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
});

export default router;