import { DefaultSession, NextAuthOptions, } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { connectionToDatabase } from "./db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

declare module "next-auth" {
    interface Session {
      user: {
        id: string;
      } & DefaultSession["user"];
    }
  }

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Email and Password required")
                }
                try {
                    await connectionToDatabase();
                    const user = await UserModel.findOne({email: credentials.email});
                    if(!user) {
                        throw new Error("user not found")
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password, 
                        user.password
                    );
                    if(!isValid) {
                        throw new Error("Invalid Password")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch(e) {
                    throw new Error(`Something went wrong:- ${e}`)
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({session, token}) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXT_AUTH_SECRET
}
