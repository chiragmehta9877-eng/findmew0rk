import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    // 1. Check if keys exist explicitly inside the function
    // (Taaki build time par error na aaye)
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ RAZORPAY KEYS MISSING IN ENV");
      return NextResponse.json(
        { error: "Server misconfiguration: Missing Payment Keys" },
        { status: 500 }
      );
    }

    // 2. Initialize Razorpay inside the handler
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const body = await req.json();
    const { amount } = body;

    // 3. Create Order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });

  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}