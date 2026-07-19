"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const bill_routes_1 = __importDefault(require("./routes/bill.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const search_routes_1 = __importDefault(require("./routes/search.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve uploaded images
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// API Routes
app.use("/api/customers", customer_routes_1.default);
app.use("/api/bills", bill_routes_1.default);
app.use("/api/payments", payment_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api/search", search_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.get("/", (_req, res) => {
    res.json({
        message: "CreditBook API is running 🚀",
    });
});
exports.default = app;
