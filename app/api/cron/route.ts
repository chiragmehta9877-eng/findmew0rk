import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import nodemailer from "nodemailer"; 

// 🔥 Important: Static caching hatane ke liye
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Database Connect
    await connectToDB();

    // 2. Subscribers Fetch
    const subscribers = await Subscriber.find({});

    if (!subscribers || subscribers.length === 0) {
        return NextResponse.json({ message: "No subscribers found" });
    }

    // 3. Brevo Setup
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: Number(process.env.BREVO_PORT),
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    // 4. Send Emails Loop
    let count = 0;
    for (const sub of subscribers) {
      const mailOptions = {
        from: `"FindMeWork AI" <admin@findmew0rk.com>`,
        to: sub.email,
        subject: `🎯 New ${sub.preference} Jobs Added!`, 
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px;">
              <h2 style="color: #0d9488; text-align: center;">New Jobs Alert! 🚨</h2>
              <p style="color: #4b5563; text-align: center;">
                Hello, <br/>
                We found new jobs for your preference: <b>${sub.preference}</b>.
              </p>
              <div style="text-align: center; margin-top: 20px;">
                  <a href="https://findmew0rk.com" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold;">
                    Check Now
                  </a>
              </div>
            </div>
          </div>
        `
      };
      
      try {
        await transporter.sendMail(mailOptions);
        count++;
      } catch (err) {
        console.error(`Failed for ${sub.email}`, err);
      }
    }

    return NextResponse.json({ success: true, sent: count });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}