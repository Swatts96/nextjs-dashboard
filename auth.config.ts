import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard && !isLoggedIn) {
        return false; // Redirect unauthenticated users
      }

      return true;
    },
  },
  providers: [], // NextAuth will automatically use the ones from the API
} satisfies NextAuthConfig;
