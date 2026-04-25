import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;

        return { id: user._id.toString(), name: user.name, email: user.email, username: user.username, image: user.avatar };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Auto-create user record for Google sign-ins
      if (account?.provider === "google") {
        await connectDB();
        const exists = await User.findOne({ email: user.email });
        if (!exists) {
          const username = user.email!.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
          await User.create({
            name: user.name,
            email: user.email,
            username,
            avatar: user.image ?? "",
          });
        }
      }
      return true;
    },

    async session({ session }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.id       = dbUser._id.toString();
        session.user.username = dbUser.username;
        session.user.image    = dbUser.avatar || session.user.image;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  session: { strategy: "jwt" },
});
