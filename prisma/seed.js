import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const senhaAdmin = await bcrypt.hash('admin123', 10);
  const senhaCliente = await bcrypt.hash('cliente123', 10);

  await prisma.usuario.createMany({
    data: [
      { nome: 'Admin', email: 'admin@hallofjerseys.com', senha: senhaAdmin, role: 'admin' },
      { nome: 'Cliente Teste', email: 'cliente@hallofjerseys.com', senha: senhaCliente, role: 'cliente' }
    ],
    skipDuplicates: true
  });

  await prisma.produto.create({
    data: {
      nome: 'NBA Jersey - Los Angeles Lakers',
      descricao: 'Camisa oficial da NBA, personalizada.',
      preco: 299.90,
      estoque: 10,
      liga: 'NBA',
      tamanho: 'M'
    }
  });

  console.log('Seed concluído ✅');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
