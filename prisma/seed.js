import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const senhaAdmin = await bcrypt.hash('admin123', 10);
  const senhaCliente = await bcrypt.hash('cliente123', 10);

  // Criar usuários
  await prisma.usuario.createMany({
    data: [
      { nome: 'Admin', email: 'admin@hallofjerseys.com', senha: senhaAdmin, role: 'admin' },
      { nome: 'Cliente Teste', email: 'cliente@hallofjerseys.com', senha: senhaCliente, role: 'cliente' }
    ]
  });

  // Criar produtos - NBA
  await prisma.produto.createMany({
    data: [
      {
        nome: 'Lakers #23 LeBron James',
        descricao: 'Jersey oficial do Los Angeles Lakers - LeBron James. Tecido respirável de alta qualidade.',
        preco: 349.90,
        estoque: 15,
        liga: 'NBA',
        time: 'Los Angeles Lakers',
        tamanho: 'M',
        categoria: 'Jersey',
        imagemUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400',
        sku: 'NBA-LAL-23-M',
        ativo: true
      },
      {
        nome: 'Warriors #30 Stephen Curry',
        descricao: 'Jersey oficial do Golden State Warriors - Stephen Curry. Edição City Edition.',
        preco: 369.90,
        estoque: 8,
        liga: 'NBA',
        time: 'Golden State Warriors',
        tamanho: 'G',
        categoria: 'Jersey',
        imagemUrl: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=400',
        sku: 'NBA-GSW-30-G',
        ativo: true
      },
      {
        nome: 'Bulls #23 Michael Jordan',
        descricao: 'Jersey retrô do Chicago Bulls - Michael Jordan. Edição clássica anos 90.',
        preco: 399.90,
        estoque: 5,
        liga: 'NBA',
        time: 'Chicago Bulls',
        tamanho: 'M',
        categoria: 'Edição Especial',
        imagemUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400',
        sku: 'NBA-CHI-23-M-RETRO',
        ativo: true
      },
      {
        nome: 'Celtics #8 Jayson Tatum',
        descricao: 'Jersey oficial do Boston Celtics - Jayson Tatum. Temporada 2024/25.',
        preco: 329.90,
        estoque: 12,
        liga: 'NBA',
        time: 'Boston Celtics',
        tamanho: 'G',
        categoria: 'Jersey',
        imagemUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
        sku: 'NBA-BOS-8-G',
        ativo: true
      },
      // NFL
      {
        nome: 'Chiefs #15 Patrick Mahomes',
        descricao: 'Jersey oficial do Kansas City Chiefs - Patrick Mahomes. Super Bowl Champion.',
        preco: 389.90,
        estoque: 10,
        liga: 'NFL',
        time: 'Kansas City Chiefs',
        tamanho: 'M',
        categoria: 'Jersey',
        imagemUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
        sku: 'NFL-KC-15-M',
        ativo: true
      },
      {
        nome: '49ers #13 Brock Purdy',
        descricao: 'Jersey oficial do San Francisco 49ers - Brock Purdy. Edição Home.',
        preco: 359.90,
        estoque: 7,
        liga: 'NFL',
        time: 'San Francisco 49ers',
        tamanho: 'G',
        categoria: 'Jersey',
        imagemUrl: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400',
        sku: 'NFL-SF-13-G',
        ativo: true
      },
      // MLB
      {
        nome: 'Yankees #99 Aaron Judge',
        descricao: 'Jersey oficial do New York Yankees - Aaron Judge. Pinstripe clássico.',
        preco: 329.90,
        estoque: 9,
        liga: 'MLB',
        time: 'New York Yankees',
        tamanho: 'M',
        categoria: 'Jersey',
        imagemUrl: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400',
        sku: 'MLB-NYY-99-M',
        ativo: true
      },
      {
        nome: 'Dodgers #50 Mookie Betts',
        descricao: 'Jersey oficial do Los Angeles Dodgers - Mookie Betts. World Series Champion.',
        preco: 349.90,
        estoque: 11,
        liga: 'MLB',
        time: 'Los Angeles Dodgers',
        tamanho: 'G',
        categoria: 'Jersey',
        imagemUrl: 'https://images.unsplash.com/photo-1566577134630-2e3f464b4e92?w=400',
        sku: 'MLB-LAD-50-G',
        ativo: true
      },
      // Produtos diversos tamanhos
      {
        nome: 'Lakers #23 LeBron James',
        descricao: 'Jersey oficial do Los Angeles Lakers - LeBron James. Tecido respirável de alta qualidade.',
        preco: 349.90,
        estoque: 20,
        liga: 'NBA',
        time: 'Los Angeles Lakers',
        tamanho: 'P',
        categoria: 'Jersey',
        imagemUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400',
        sku: 'NBA-LAL-23-P',
        ativo: true
      },
      {
        nome: 'Lakers #23 LeBron James',
        descricao: 'Jersey oficial do Los Angeles Lakers - LeBron James. Tecido respirável de alta qualidade.',
        preco: 349.90,
        estoque: 18,
        liga: 'NBA',
        time: 'Los Angeles Lakers',
        tamanho: 'G',
        categoria: 'Jersey',
        imagemUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400',
        sku: 'NBA-LAL-23-G',
        ativo: true
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('📦 Usuários criados: admin@hallofjerseys.com (admin123) e cliente@hallofjerseys.com (cliente123)');
  console.log('👕 10 produtos de NBA, NFL e MLB criados');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
