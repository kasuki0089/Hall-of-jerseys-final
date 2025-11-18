import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../../lib/db';
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: { label: 'Email', type: 'text' }, senha: { label: 'Senha', type: 'password' } },
      async authorize(credentials) {
        const user = await prisma.usuario.findUnique({ where: { email: credentials.email } });
        if (user && await bcrypt.compare(credentials.senha, user.senha)) {
          return { id: user.id, name: user.nome, email: user.email, role: user.role };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      if (user) token.name = user.name || user.nome;
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.role = token.role;
      session.user.name = token.name || session.user.name;
      return session;
    }
  },
  pages: { signIn: '/login' }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
