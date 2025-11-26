# Guia de Migração para NextAuth

Este documento descreve como migrar o sistema atual de autenticação baseado em bcrypt + localStorage para NextAuth.js.

## Estrutura Atual (Preparada para Migração)

O sistema atual foi projetado para facilitar a futura migração para NextAuth:

### 1. Componentes Compatíveis

- `AuthProvider` - Provider de contexto compatível com SessionProvider do NextAuth
- `useAuth()` - Hook compatível com `useSession()` do NextAuth  
- `withAuth()` - HOC para proteção de rotas
- `withAdminAuth()` - HOC para proteção de rotas admin

### 2. Estrutura de Dados

O formato de dados do usuário já segue o padrão NextAuth:

```javascript
{
  id: string,
  name: string,
  email: string,
  image: string | null,
  emailVerified: Date | null,
  tipo: 'ADMIN' | 'USUARIO'
}
```

## Passos para Migração

### 1. Instalar NextAuth

```bash
npm install next-auth
npm install @auth/prisma-adapter  # Para integração com Prisma
```

### 2. Configurar Providers OAuth (Opcional)

```bash
# Adicionar ao .env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
```

### 3. Criar Configuração NextAuth

Substituir `src/lib/auth.js` por:

```javascript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email }
        });

        if (user && await bcrypt.compare(credentials.password, user.senha)) {
          return {
            id: user.id.toString(),
            name: user.nome,
            email: user.email,
            tipo: user.tipo
          };
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.tipo = user.tipo;
      return token;
    },
    async session({ session, token }) {
      session.user.tipo = token.tipo;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
};

export default NextAuth(authOptions);
```

### 4. Criar Route Handler

`src/app/api/auth/[...nextauth]/route.js`:

```javascript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 5. Atualizar Schema Prisma

Adicionar tabelas necessárias para NextAuth:

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            Int
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user Usuario @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       Int
  expires      DateTime
  user         Usuario  @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Atualizar modelo Usuario
model Usuario {
  id            Int       @id @default(autoincrement())
  nome          String
  email         String    @unique
  emailVerified DateTime?
  image         String?
  senha         String?   // Opcional para OAuth users
  telefone      String?
  tipo          TipoUsuario @default(USUARIO)
  criadoEm      DateTime    @default(now())
  atualizadoEm  DateTime    @updatedAt

  // NextAuth relations
  accounts      Account[]
  sessions      Session[]

  // Existing relations...
  enderecos     Endereco[]
  pedidos       Pedido[]
  formasPagamento FormaPagamento[]
}
```

### 6. Substituir AuthProvider

Atualizar `src/providers/AuthProvider.jsx`:

```javascript
'use client';
import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Exportar hooks compatíveis
export { useSession as useAuth } from 'next-auth/react';
```

### 7. Atualizar Componentes de Login

Substituir chamadas customizadas por NextAuth:

```javascript
import { signIn, signOut } from 'next-auth/react';

// Login
const result = await signIn('credentials', {
  email,
  password,
  redirect: false
});

// Logout  
await signOut({ redirect: false });

// OAuth Login
await signIn('google');
await signIn('github');
```

### 8. Middleware para Proteção de Rotas

Criar `middleware.js` na raiz do projeto:

```javascript
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/admin/:path*', '/perfil/:path*', '/pedidos/:path*']
};
```

## Benefícios da Migração

### 1. Segurança Aprimorada
- Gerenciamento seguro de sessões
- Proteção contra CSRF
- Tokens JWT seguros

### 2. Funcionalidades Avançadas
- Login social (Google, GitHub, etc.)
- Verificação de email
- Recuperação de senha
- Múltiplas sessões

### 3. Menos Código
- Elimina gerenciamento manual de sessões
- Middleware automático
- Hooks prontos

### 4. Melhores Práticas
- Padrão da indústria
- Documentação extensa
- Comunidade ativa

## Checklist de Migração

- [ ] Instalar dependências NextAuth
- [ ] Configurar providers OAuth (opcional)
- [ ] Atualizar schema do banco
- [ ] Executar migrações
- [ ] Criar route handler
- [ ] Atualizar AuthProvider
- [ ] Migrar componentes de login/logout
- [ ] Configurar middleware
- [ ] Testar autenticação
- [ ] Testar OAuth (se configurado)
- [ ] Remover código antigo

## Rollback (se necessário)

Em caso de problemas, o sistema atual pode ser restaurado:

1. Reverter mudanças no `layout.js`
2. Restaurar `AuthProvider.jsx` original
3. Manter endpoints `/api/login` e `/api/usuarios`
4. Continuar usando localStorage/sessionStorage

## Compatibilidade

O design atual garante que:
- Hooks têm a mesma interface (`useAuth()`)
- Componentes de proteção funcionam igual
- Estrutura de dados é compatível
- Migração pode ser feita gradualmente

Isso permite uma transição suave sem quebrar funcionalidades existentes.