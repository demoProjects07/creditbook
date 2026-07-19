"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("../prisma/client"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = __importDefault(require("../config/multer"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Create Bill
router.post("/", multer_1.default.single("attachment"), async (req, res) => {
    try {
        const { customerId, amount, note } = req.body;
        const customer = await client_1.default.customer.findUnique({
            where: { id: customerId },
        });
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }
        const bill = await client_1.default.bill.create({
            data: {
                customerId,
                amount: Number(amount),
                note,
                attachment: req.file?.filename || null,
                attachmentOriginal: req.file?.originalname || null,
            },
        });
        return res.status(201).json(bill);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create bill",
        });
    }
});
router.get("/customer/:customerId", async (req, res) => {
    try {
        const bills = await client_1.default.bill.findMany({
            where: {
                customerId: req.params.customerId,
            },
            orderBy: {
                billDate: "desc",
            },
        });
        res.json(bills);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch bills",
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const bill = await client_1.default.bill.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                payments: true,
            },
        });
        if (!bill) {
            return res.status(404).json({
                message: "Bill not found",
            });
        }
        await client_1.default.$transaction(async (tx) => {
            // Delete all payments of this bill
            await tx.payment.deleteMany({
                where: {
                    billId: bill.id,
                },
            });
            // Delete the bill
            await tx.bill.delete({
                where: {
                    id: bill.id,
                },
            });
        });
        res.json({
            message: "Bill and related payments deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete bill",
        });
    }
});
// Update Bill
router.put("/:id", multer_1.default.single("attachment"), async (req, res) => {
    try {
        const { amount, note } = req.body;
        const existingBill = await client_1.default.bill.findUnique({
            where: {
                id: String(req.params.id),
            },
        });
        const bill = await client_1.default.bill.update({
            where: {
                id: String(req.params.id),
            },
            data: {
                amount: Number(amount),
                note,
                attachment: req.file?.filename ??
                    existingBill?.attachment ??
                    null,
                attachmentOriginal: req.file?.originalname ??
                    existingBill?.attachmentOriginal ??
                    null,
            },
        });
        res.json(bill);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update bill",
        });
    }
});
exports.default = router;
