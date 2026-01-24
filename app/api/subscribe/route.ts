import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import nodemailer from "nodemailer"; 

export async function POST(req: Request) {
  try {
    await connectToDB();
    
    // 🔥 NOTE: Frontend se ab { email, preference } hi aana chahiye
    const { email, preference } = await req.json();

    if (!email || !preference) {
      return NextResponse.json({ success: false, error: "Email & Preference required" }, { status: 400 });
    }

    // 1. Database Logic: Check Duplicate
    const existing = await Subscriber.findOne({ email, preference });
    
    // Sirf naye user ko save karo (Duplicate entry avoid karne ke liye)
    // Agar user pehle se hai, to DB me kuch mat karo, bas EMAIL bhejo 👇
    if (!existing) {
      await Subscriber.create({ email, preference });
    }

    // 2. 🔥 BREVO SMTP CONFIGURATION
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST, // smtp-relay.brevo.com
      port: Number(process.env.BREVO_PORT), // 587
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.BREVO_USER, // Apka Brevo Login Email
        pass: process.env.BREVO_PASS, // Apki SMTP Key (Master Password)
      },
    });

    const mailOptions = {
      // 🔥 VERIFIED SENDER EMAIL USE KARO
      from: `"FindMeWork AI" <admin@findmew0rk.com>`, 
      to: email,
      subject: "Job Alerts Activated! 🚀",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #0d9488; margin: 0; font-size: 24px;">FindMeWork</h2>
                <p style="font-size: 14px; color: #9ca3af; margin-top: 5px;">AI Job Hunter</p>
            </div>

            <h2 style="color: #1f2937; margin-bottom: 15px; text-align: center;">You're on the list! ✅</h2>
            
            <p style="font-size: 16px; color: #4b5563; text-align: center; line-height: 1.6;">
              We have successfully activated daily alerts for:
            </p>
            
            <div style="background: #f0fdfa; padding: 20px; border: 1px solid #ccfbf1; margin: 25px 0; border-radius: 12px; text-align: center;">
              <p style="font-size: 20px; font-weight: bold; color: #0f766e; margin: 0; text-transform: capitalize;">✨ ${preference}</p>
            </div>

            <p style="font-size: 15px; color: #6b7280; text-align: center; line-height: 1.6;">
              Our AI is now scanning <b>Twitter (X) & Top Communities</b>. We will send you a direct link as soon as we find a match.
            </p>

            <div style="text-align: center; margin-top: 30px;">
                <a href="https://findmew0rk.com" style="background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(13, 148, 136, 0.2);">Browse Live Jobs</a>
            </div>
            
            <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af;">FindMeWork AI • Hunting Jobs 24/7</p>
            </div>
          </div>
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Alerts Activated!" });

  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}