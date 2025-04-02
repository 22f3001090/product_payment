import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Product } from "../entities/Product";

export const getProducts = async (req:Request , res:Response) => {
      try {
        const products = await AppDataSource.manager.find(Product);
        res.json(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    };