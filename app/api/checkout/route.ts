import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { quantity } = await req.json();

    // Razorpay paise me deal karta hai (₹1 = 100 paise)
    // ₹150 per coffee (approx $2 equivalent)
    const amountPerCoffee = 150; 
    const totalAmount = amountPerCoffee * quantity * 100; // In Paise

    const order = await razorpay.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return NextResponse.json({ 
        orderId: order.id, 
        amount: totalAmount,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID 
    });

  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}