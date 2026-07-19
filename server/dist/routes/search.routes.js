"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("../prisma/client"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
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
        const customers = await client_1.default.customer.findMany({
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
        const bills = await client_1.default.bill.findMany({
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
        const payments = await client_1.default.payment.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Search failed",
        });
    }
});
exports.default = router;
