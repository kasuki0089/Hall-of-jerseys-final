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
        console.log('🔐 Tentativa de login:', { email: credentials?.email, temSenha: !!credentials?.senha });
        
        if (!credentials?.email || !credentials?.senha) {
          console.log('❌ Credenciais incompletas');
          return null;
        }

        try {
          console.log('🔍 Buscando usuário no banco...');
          const user = await prisma.usuario.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            }
          });

          console.log('👤 Usuário encontrado:', user ? { id: user.id, email: user.email, emailVerificado: user.emailVerificado, role: user.role } : 'Nenhum');

          if (!user) {
            console.log('❌ Usuário não encontrado para email:', credentials.email);
            throw new Error("Usuário não encontrado");
          }

          console.log('🔓 Verificando senha...');
          const isValidPassword = await bcrypt.compare(credentials.senha, user.senha);

          if (!isValidPassword) {
            console.log('❌ Senha incorreta');
            throw new Error("Senha incorreta");
          }

          console.log('✅ Senha válida');

          // Verificar se o email foi verificado - temporariamente desabilitado para debug
          if (user.emailVerificado === false) {
            console.log('⚠️ Email não verificado, permitindo login mesmo assim');
            // Verificação de email removida para desenvolvimento local
          }

          console.log('✅ Login autorizado para:', user.email);
          return {
            id: user.id,
            email: user.email,
            nome: user.nome,
            role: user.role,
            emailVerificado: user.emailVerificado
          };
        } catch (error) {
          console.error("❌ Erro na autenticação:", error.message);
          throw error; // Propagate error to show specific message
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
