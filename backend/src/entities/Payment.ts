import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  razorpay_order_id: string;

  @Column()
  razorpay_payment_id: string;

  @Column()
  amount: number; // Amount in paise

  @Column()
  product_id: number;

  @Column()
  status: string; // "pending", "success", "failed"
}
