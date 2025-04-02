import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import app from "./app";
import { Product } from "./entities/Product";

dotenv.config();

const PORT = process.env.PORT || 3000;

const initializeServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");

    // Insert sample products if none exist
    const productRepository = AppDataSource.getRepository(Product);
    const existingProducts = await productRepository.count();
    
    if (existingProducts === 0) {
      await productRepository.save([
        { name: "Laptop", price: 1200 },
        { name: "Headphones", price: 150 },
        { name: "Mouse", price: 50 }
      ]);
      console.log("📌 Sample products added.");
    }

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error connecting to database:", err);
  }
};

// Call the function to start the server
initializeServer();
























// import "reflect-metadata";
// import express from "express";
// import crypto from "crypto";
// import { DataSource } from "typeorm";
// import { Product } from "./entities/Product";
// import { Payment } from "./entities/Payment";
// import * as dotenv from "dotenv";
// import Razorpay from "razorpay";
// import cors from "cors";


// // Initialize Express app
// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// const PORT = 3000;

// dotenv.config();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY,
//   key_secret: process.env.RAZORPAY_API_SECRET,
// });

// // Database connection setup
// const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   entities: [Product, Payment ], // Ensure entity is properly loaded
//   synchronize: true,   // Automatically sync database schema
//   logging: true
// });

// // Initialize database and start server
// AppDataSource.initialize()
//   .then(async () => {
//     console.log("✅ Database connected successfully");

//     // Insert sample products if none exist
//     const productRepository = AppDataSource.getRepository(Product);
//     const existingProducts = await productRepository.count();
//     if (existingProducts === 0) {
//       await productRepository.save([
//         { name: "Laptop", price: 1200 },
//         { name: "Headphones", price: 150 },
//         { name: "Mouse", price: 50 }
//       ]);
//       console.log("📌 Sample products added.");
//     }

//     // Routes
//     app.get("/", (req, res) => {res.send("Hello World!")});

//     app.get("/products", async (req, res) => {
//       try {
//         const products = await AppDataSource.manager.find(Product);
//         res.json(products);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//       }
//     });

//     app.get("/getKey", (req, res) => {
//       res.json({ key: process.env.RAZORPAY_API_KEY });
//     });

//     app.post("/pay", async (req, res) => {
//       console.log("Received payment request:", req.body);
//       const { amount, productId } = req.body;
//       console.log("Amount:", amount); 
//       console.log("Product ID:", productId);
//       try {
//         const options = {
//           amount: amount*100, // Amount in paise
//           currency: "INR",
//           receipt: "receipt#1",
//           notes: {
//             productId: productId,
//           },
//         };
//         const order = await razorpay.orders.create(options);
//         res.status(200).json({
//           success: true,
//           order, 
//           productId
//         });

//       } catch (error) {
//         console.error("Error creating order:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//       }
//     });

//     app.post("/paymentVerification", async (req, res) => {
//       const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//       const order = await razorpay.orders.fetch(razorpay_order_id);
//       const expectedSignature = crypto
//         .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
//         .update(razorpay_order_id + "|" + razorpay_payment_id)
//         .digest("hex");
//       const transactionRepository = AppDataSource.getRepository(Payment);

//       if (expectedSignature === razorpay_signature) {
//         const transaction = new Payment();
//         transaction.razorpay_order_id = razorpay_order_id;
//         transaction.razorpay_payment_id = razorpay_payment_id;
//         transaction.amount = Number(order.amount)/100;
//         transaction.product_id = Number(order.notes?.productId) || 0;
//         transaction.status = "success";

//         await transactionRepository.save(transaction);
//         console.log("Transaction successful:", transaction);
//         res.json({ success: true, message: "Payment Verified", referenceId: razorpay_payment_id});
//       }
//       else {
//         const transaction = new Payment();
//         transaction.razorpay_order_id = razorpay_order_id;
//         transaction.razorpay_payment_id = razorpay_payment_id || "N/A";
//         transaction.amount = Number(order.amount)/100;
//         transaction.product_id = Number(order.notes?.productId) || 0;
//         transaction.status = "failed";

//         await transactionRepository.save(transaction);
//         console.log("Transaction failed:", transaction);
//         res.json({ success: false, message: "Payment Verification Failed" });
//       }
//     });



//     // Start Express server
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Error connecting to database:", err);
//   });
