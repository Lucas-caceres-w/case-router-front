import { apiUrl } from "@/utils/routes";
import jwt from "json-web-token";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const res = await fetch(apiUrl + "/users/login", {
            method: "POST",
            body: JSON.stringify({ credentials }),
            headers: { "Content-Type": "application/json" },
          });
          const user = await res.json();
          /* if (res.ok && user) {
            return user;
          }
          return null; */
          return credentials;
        } catch (err) {
          console.log(err);
          return err;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.username;
        token.email = user.email;
        token.id = user.id;
        token.rol = user.rol;
        token.accessToken = new Date();
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.username = token.user;
        session.user.id = token.id;
        session.user.rol = token.rol;
      }
      return session;
    },
  },
};
