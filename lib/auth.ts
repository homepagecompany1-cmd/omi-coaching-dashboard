import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * NextAuth v5 設定。Google OAuthで認証し、session.user.id に
 * Googleの sub (安定ID) を入れる。これを D1 の clients.uid と紐づける。
 *
 * Edge Runtime 対応（Cloudflare Workers/Pagesで動作）。
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
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
  trustHost: true, // Cloudflare背後で動作するため必須
});
