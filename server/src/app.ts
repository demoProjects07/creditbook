import express from "express";
import cors from "cors";
import path from "path";

import customerRoutes from "./routes/customer.routes";
import billRoutes from "./routes/bill.routes";
import paymentRoutes from "./routes/payment.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import searchRoutes from "./routes/search.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// API Routes
app.use("/api/customers", customerRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "CreditBook API is running 🚀",
  });
});

export default app;