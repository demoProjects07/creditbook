"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("../prisma/client"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = __importDefault(require("../config/multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get("/", async (_req, res) => {
    try {
        const customers = await client_1.default.customer.findMany({
            where: {
                isActive: true,
            },
            include: {
                bills: true,
                payments: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const result = customers.map((customer) => {
            const totalBills = customer.bills.reduce((sum, bill) => sum + bill.amount, 0);
            const totalPayments = customer.payments.reduce((sum, payment) => sum + payment.amount, 0);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch customers",
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const customer = await client_1.default.customer.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                bills: {
                    include: {
                        payments: {
                            orderBy: {
                                paymentDate: "asc",
                            },
                        },
                    },
                },
                payments: {
                    include: {
                        bill: true,
                    },
                },
            },
        });
        if (!customer) {
            res.status(404).json({
                message: "Customer not found",
            });
            return;
        }
        const totalBills = customer.bills.reduce((sum, bill) => sum + bill.amount, 0);
        const totalPayments = customer.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const outstanding = totalBills - totalPayments;
        const ledger = [
            ...customer.bills.map((bill) => ({
                id: bill.id,
                type: "BILL",
                date: bill.billDate,
                amount: bill.amount,
                note: bill.note,
                billId: bill.id,
            })),
            ...customer.payments.map((payment) => ({
                id: payment.id,
                type: "PAYMENT",
                date: payment.paymentDate,
                amount: payment.amount,
                note: payment.note,
                billId: payment.billId,
            })),
        ].sort((a, b) => new Date(a.date).getTime() -
            new Date(b.date).getTime());
        res.json({
            ...customer,
            totalBills,
            totalPayments,
            outstanding,
            ledger,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch customer",
        });
    }
});
router.post("/", multer_1.default.single("photo"), async (req, res) => {
    try {
        const { name, mobile } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Customer name is required",
            });
        }
        if (!name) {
            return res.status(400).json({
                message: "Customer name is required",
            });
        }
        const customer = await client_1.default.customer.create({
            data: {
                customerCode: `CB${Date.now()}`,
                name,
                mobile,
                photo: req.file?.filename || null,
            },
        });
        res.status(201).json(customer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create customer",
        });
    }
});
router.put("/:id", multer_1.default.single("photo"), async (req, res) => {
    try {
        const { name, mobile } = req.body;
        const existingCustomer = await client_1.default.customer.findUnique({
            where: {
                id: String(req.params.id),
            },
        });
        if (!existingCustomer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }
        let photo = existingCustomer.photo;
        if (req.file) {
            // Delete old photo if it exists
            if (existingCustomer.photo) {
                const oldPhotoPath = path_1.default.join(process.cwd(), "uploads", existingCustomer.photo);
                if (fs_1.default.existsSync(oldPhotoPath)) {
                    fs_1.default.unlinkSync(oldPhotoPath);
                }
            }
            photo = req.file.filename;
        }
        const customer = await client_1.default.customer.update({
            where: {
                id: String(req.params.id),
            },
            data: {
                name,
                mobile,
                photo,
            },
        });
        res.json(customer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update customer",
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const customer = await client_1.default.customer.findFirst({
            where: {
                id: req.params.id,
                isActive: true,
            },
            include: {
                bills: true,
                payments: true,
            },
        });
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }
        const totalBills = customer.bills.reduce((sum, bill) => sum + bill.amount, 0);
        const totalPayments = customer.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const outstanding = totalBills - totalPayments;
        if (outstanding > 0) {
            return res.status(400).json({
                message: "Customer has outstanding balance and cannot be deleted.",
            });
        }
        await client_1.default.customer.update({
            where: {
                id: customer.id,
            },
            data: {
                isActive: false,
            },
        });
        res.json({
            message: "Customer archived successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to archive customer",
        });
    }
});
router.patch("/:id/restore", async (req, res) => {
    try {
        const customer = await client_1.default.customer.update({
            where: {
                id: req.params.id,
            },
            data: {
                isActive: true,
            },
        });
        res.json({
            message: "Customer restored successfully",
            customer,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to restore customer",
        });
    }
});
router.get("/archived/all", async (_req, res) => {
    try {
        const customers = await client_1.default.customer.findMany({
            where: {
                isActive: false,
            },
            include: {
                bills: true,
                payments: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const result = customers.map((customer) => {
            const totalBills = customer.bills.reduce((sum, bill) => sum + bill.amount, 0);
            const totalPayments = customer.payments.reduce((sum, payment) => sum + payment.amount, 0);
            return {
                ...customer,
                totalBills,
                totalPayments,
                outstanding: totalBills - totalPayments,
            };
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch archived customers",
        });
    }
});
exports.default = router;
