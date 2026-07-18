import app from "./app";
import dashboardRoutes from "./routes/dashboard.routes";
import searchRoutes from "./routes/search.routes";
import authRoutes from "./routes/auth.routes";

const PORT = 5000;

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});