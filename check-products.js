const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarProdutos() {
  try {
    const produtos = await prisma.produto.findMany({
      select: {
        id: true,
        nome: true,
        codigo: true,
        preco: true,
        ativo: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`📦 PRODUTOS NO BANCO: ${produtos.length}`);
    console.log('=' + '='.repeat(50));
    
    produtos.forEach((produto) => {
      const status = produto.ativo ? "✅ Ativo" : "❌ Inativo";
      console.log(`${produto.id.toString().padStart(2)}. ${produto.nome} (${produto.codigo}) - R$ ${produto.preco.toFixed(2)} - ${status}`);
    });
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verificarProdutos();