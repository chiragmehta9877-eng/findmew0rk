import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // 🔥 Import from lib/auth

export async function GET(req: Request) {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        headline: user.headline || "",
        location: user.location || "",
        lookingFor: user.lookingFor || "", // 🔥 Send back to frontend
        linkedin: user.linkedin || "",
        x_handle: user.x_handle || "",
        instagram: user.instagram || "",
      },
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // 🔥 Receive 'lookingFor' from frontend
    const { headline, location, lookingFor, linkedin, x_handle, instagram } = body;

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        // 🔥 Save 'lookingFor' to database
        $set: { headline, location, lookingFor, linkedin, x_handle, instagram } 
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedUser });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}