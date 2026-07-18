import { Router } from "express";
import prisma from "../prisma/client";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const query = String(req.query.q || "");

    if (!query.trim()) {
      return res.json({
        customers: [],
        bills: [],
        payments: [],
      });
    }

    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            mobile: {
              contains: query,
            },
          },
          {
            customerCode: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 5,
    });

    const bills = await prisma.bill.findMany({
        where: {
            OR: [
            {
                note: {
                contains: query,
                mode: "insensitive",
                },
            },
            {
                customer: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
                },
            },
            ],
        },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    const payments = await prisma.payment.findMany({
        where: {
            OR: [
            {
                note: {
                contains: query,
                mode: "insensitive",
                },
            },
            {
                customer: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
                },
            },
            ],
        },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      customers,
      bills,
      payments,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Search failed",
    });
  }
});

export default router;