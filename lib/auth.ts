import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

/**
 * NextAuth設定。Google OAuthで認証し、session.user.id に
 * Googleの sub (安定ID) を入れる。これを D1 の clients.uid と紐づける。
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === 'google' && profile) {
        // Googleの安定したユーザーIDを保持
        token.googleSub =
          (profile as { sub?: string }).sub ?? token.sub ?? token.googleSub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id =
          (token.googleSub as string | undefined) ??
          (token.sub as string | undefined) ??
          '';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
