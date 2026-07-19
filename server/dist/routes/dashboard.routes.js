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
        const customers = await client_1.default.customer.findMany({
            where: {
                isActive: true,
            },
            include: {
                bills: true,
                payments: true,
            },
        });
        const totalCustomers = customers.length;
        const totalBills = customers.reduce((sum, customer) => sum +
            customer.bills.reduce((billSum, bill) => billSum + bill.amount, 0), 0);
        const totalPayments = customers.reduce((sum, customer) => sum +
            customer.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0), 0);
        const totalOutstanding = totalBills - totalPayments;
        const recentBills = await client_1.default.bill.findMany({
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
        const recentPayments = await client_1.default.payment.findMany({
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
            const bills = customer.bills.reduce((sum, bill) => sum + bill.amount, 0);
            const payments = customer.payments.reduce((sum, payment) => sum + payment.amount, 0);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to load dashboard",
        });
    }
});
exports.default = router;
