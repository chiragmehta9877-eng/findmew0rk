import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // 🔥 Import Correct Path
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ isActive: true }); // Not logged in = No block check needed
    }

    await connectToDB();
    const user = await User.findOne({ email: session.user.email }).select("isActive");

    if (!user) {
      return NextResponse.json({ isActive: true });
    }

    return NextResponse.json({ isActive: user.isActive });

  } catch (error) {
    console.error("Status Check Error:", error);
    return NextResponse.json({ isActive: true }); // Error me block mat karo
  }
}