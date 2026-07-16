import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customer.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "CreditBook API is running 🚀",
  });
});

export default app;