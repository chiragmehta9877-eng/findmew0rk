import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn({ user }) {
      try {
        await connectToDB();
        
        // Safety check: Agar email hi nahi hai to login mat karne do
        if (!user.email) return false;

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            name: user.name || "User", // 🔥 FIX: Fallback string added
            email: user.email,
            image: user.image || "",   // 🔥 FIX: Fallback empty string added
            role: "user",
            bookmarks: [],
          });
        }
        return true;
      } catch (error) {
        console.log("Error checking user:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/login', 
  },
  secret: process.env.NEXTAUTH_SECRET,
};