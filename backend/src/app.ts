import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import paymentRoutes from "./routes/paymentRoutes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", productRoutes);
app.use("/", paymentRoutes);

export default app;
