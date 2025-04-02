import { Request, Response } from "express";
import crypto from "crypto";
import { AppDataSource } from "../config/database";
import { razorpay } from "../config/razorpay";
import { Payment } from "../entities/Payment";

export const getKey = (req: Request, res: Response) => {
  res.json({ key: process.env.RAZORPAY_API_KEY });
};

export const createPayment = async (req: Request, res: Response) => {
  const { amount, productId } = req.body;
  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        productId: productId,
      },
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      order,
      productId,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const order = await razorpay.orders.fetch(razorpay_order_id);
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
  const transactionRepository = AppDataSource.getRepository(Payment);

  if (expectedSignature === razorpay_signature) {
    const transaction = new Payment();
    transaction.razorpay_order_id = razorpay_order_id;
    transaction.razorpay_payment_id = razorpay_payment_id;
    transaction.amount = Number(order.amount) / 100;
    transaction.product_id = Number(order.notes?.productId) || 0;
    transaction.status = "success";

    await transactionRepository.save(transaction);
    console.log("Transaction successful:", transaction);
    res.json({
      success: true,
      message: "Payment Verified",
      referenceId: razorpay_payment_id,
    });
  } else {
    const transaction = new Payment();
    transaction.razorpay_order_id = razorpay_order_id;
    transaction.razorpay_payment_id = razorpay_payment_id || "N/A";
    transaction.amount = Number(order.amount) / 100;
    transaction.product_id = Number(order.notes?.productId) || 0;
    transaction.status = "failed";

    await transactionRepository.save(transaction);
    console.log("Transaction failed:", transaction);
    res.json({ success: false, message: "Payment Verification Failed" });
  }
};
