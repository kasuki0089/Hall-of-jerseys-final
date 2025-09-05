Hall of Jerseys - Next.js 15 starter

Como usar:

1) Copie .env.example para .env e ajuste DATABASE_URL
2) Instale dependências:
   npm install
3) Gere prisma client e rode migração (local MySQL):
   npx prisma generate
   npx prisma migrate dev --name init
4) Rode seed:
   node prisma/seed.js
5) Rode em dev:
   npm run dev

Observações:
- NextAuth já configurado com Credentials provider.
- Seed cria um admin (admin@hallofjerseys.com / admin123) e um produto exemplo.
