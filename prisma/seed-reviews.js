const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleReviews() {
  try {
    console.log('⭐ Criando avaliações de exemplo...');

    // Buscar usuário comum
    const usuario = await prisma.usuario.findFirst({
      where: { role: 'user' }
    });

    if (!usuario) {
      console.log('❌ Usuário não encontrado. Execute o seed principal primeiro.');
      return;
    }

    // Buscar produtos
    const produtos = await prisma.produto.findMany({
      take: 3
    });

    if (produtos.length === 0) {
      console.log('❌ Produtos não encontrados. Execute o seed principal primeiro.');
      return;
    }

    // Criar avaliações de exemplo
    const avaliacoes = [
      {
        usuarioId: usuario.id,
        produtoId: produtos[0].id,
        nota: 4.5,
        comentario: 'A regata do Golden State Warriors é leve, confortável e bem-acabada, ótima para treinos ou uso casual. Com nota 4,5, destaca-se pela qualidade e estilo.',
        criadoEm: new Date('2025-11-26')
      }
    ];

    // Adicionar mais avaliações se houver mais produtos
    if (produtos.length > 1) {
      avaliacoes.push({
        usuarioId: usuario.id,
        produtoId: produtos[1].id,
        nota: 5.0,
        comentario: 'Produto excelente! Qualidade impecável, tamanho perfeito e entrega rápida. Superou minhas expectativas!',
        criadoEm: new Date('2025-11-20')
      });
    }

    if (produtos.length > 2) {
      avaliacoes.push({
        usuarioId: usuario.id,
        produtoId: produtos[2].id,
        nota: 4.0,
        comentario: 'Boa qualidade, mas o tecido poderia ser um pouco mais grosso. No geral, estou satisfeito com a compra.',
        criadoEm: new Date('2025-11-15')
      });
    }

    for (const avaliacao of avaliacoes) {
      await prisma.avaliacao.create({
        data: avaliacao
      });
    }

    console.log('✅ Avaliações de exemplo criadas com sucesso!');
    console.log(`- ${avaliacoes.length} avaliações criadas para ${usuario.nome}`);

  } catch (error) {
    console.error('❌ Erro ao criar avaliações:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleReviews();
