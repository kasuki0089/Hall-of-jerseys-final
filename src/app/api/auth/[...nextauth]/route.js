import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          return null;
        }

        try {
          const user = await prisma.usuario.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(credentials.senha, user.senha);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            nome: user.nome,
            role: user.role
          };
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.nome = user.nome;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.nome = token.nome;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
