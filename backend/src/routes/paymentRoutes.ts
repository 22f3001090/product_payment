import express from "express";
import { getKey, createPayment, verifyPayment } from "../controllers/paymentController";

const router = express.Router();

router.get("/getKey", getKey);
router.post("/pay", createPayment);
router.post("/paymentVerification", verifyPayment);

export default router;
