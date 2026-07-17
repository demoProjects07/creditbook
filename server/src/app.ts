import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customer.routes";
import billRoutes from "./routes/bill.routes";
import paymentRoutes from "./routes/payment.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "CreditBook API is running 🚀",
  });
});

export default app;