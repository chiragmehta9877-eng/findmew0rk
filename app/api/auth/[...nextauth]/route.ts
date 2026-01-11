import NextAuth, { NextAuthOptions } from "next-auth";
import { authOptions as baseAuthOptions } from "@/lib/auth"; 
import { connectToDB } from "@/lib/mongodb"; 
import User from "@/models/User"; 

// 🔥 STEP 1: Options ko alag variable banao aur EXPORT karo
export const authOptions: NextAuthOptions = {
  ...baseAuthOptions, 
  callbacks: {
    ...baseAuthOptions.callbacks, 
    
    // ID Injection Logic
    async session({ session }) {
      try {
        if (session.user?.email) {
          await connectToDB();
          const dbUser = await User.findOne({ email: session.user.email });

          if (dbUser) {
            // @ts-ignore
            session.user.id = dbUser._id.toString(); 
            // @ts-ignore
            session.user.role = dbUser.role; 
          }
        }
      } catch (error) {
        console.error("❌ Session Error:", error);
      }
      return session;
    },
  },
};

// 🔥 STEP 2: Handler me ye exported options pass karo
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };