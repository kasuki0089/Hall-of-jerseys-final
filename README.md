# Hall of Jerseys - Next.js 15

Este é um projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) para e-commerce de camisetas esportivas.

## Como Começar

1) **Configuração do ambiente**:
   ```bash
   cp .env.example .env
   ```
   Ajuste a `DATABASE_URL` no arquivo `.env`

2) **Instalação de dependências**:
   ```bash
   npm install
   ```

3) **Configuração do banco de dados**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4) **Seed do banco (dados iniciais)**:
   ```bash
   node prisma/seed.js
   ```

5) **Executar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   # ou
   bun dev
   ```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Funcionalidades

- **NextAuth** já configurado com Credentials provider
- **Prisma** para ORM com MySQL
- **Tailwind CSS** para estilização
- **TypeScript** para tipagem
- Sistema completo de autenticação
- Painel administrativo
- Catálogo de produtos
- Sistema de pedidos

## Credenciais Padrão

Após executar o seed, você terá:
- **Admin**: admin@hallofjerseys.com / admin123
- Produtos de exemplo já cadastrados

## Tecnologias Utilizadas

Este projeto usa [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar automaticamente as fontes.

## Saiba Mais

Para aprender mais sobre Next.js:

- [Next.js Documentation](https://nextjs.org/docs) - aprenda sobre recursos e API do Next.js
- [Learn Next.js](https://nextjs.org/learn) - tutorial interativo do Next.js

## Deploy

A forma mais fácil de fazer deploy é usar a [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Confira a [documentação de deployment do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.
