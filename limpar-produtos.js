const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function limparProdutos() {
  try {
    // Deletar estoques primeiro (devido à FK)
    await prisma.estoquePorTamanho.deleteMany();
    console.log('✅ Estoques removidos');
    
    // Deletar produtos
    await prisma.produto.deleteMany();
    console.log('✅ Todos os produtos foram removidos');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

limparProdutos();
