const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleOrders() {
  try {
    console.log('🛒 Criando pedidos de exemplo...');

    // Buscar usuário comum
    const usuario = await prisma.usuario.findFirst({
      where: { role: 'user' }
    });

    if (!usuario) {
      console.log('❌ Usuário não encontrado. Execute o seed principal primeiro.');
      return;
    }

    // Buscar alguns produtos
    const produtos = await prisma.produto.findMany({
      take: 3
    });

    if (produtos.length === 0) {
      console.log('❌ Produtos não encontrados. Execute o seed principal primeiro.');
      return;
    }

    // Buscar forma de pagamento do usuário
    const formaPagamento = await prisma.formaPagamento.findFirst({
      where: { usuarioId: usuario.id }
    });

    // Criar 3 pedidos de exemplo
    const pedidos = [
      {
        status: 'enviado',
        total: 599.98,
        confirmadoEm: new Date('2025-11-20'),
        criadoEm: new Date('2025-11-15'),
        itens: [
          {
            produtoId: produtos[0].id,
            quantidade: 2,
            preco: produtos[0].preco
          }
        ]
      },
      {
        status: 'processando',
        total: 289.99,
        confirmadoEm: new Date('2025-11-25'),
        criadoEm: new Date('2025-11-24'),
        itens: [
          {
            produtoId: produtos[1].id,
            quantidade: 1,
            preco: produtos[1].preco
          }
        ]
      },
      {
        status: 'entregue',
        total: 898.97,
        confirmadoEm: new Date('2025-11-10'),
        criadoEm: new Date('2025-11-05'),
        itens: [
          {
            produtoId: produtos[0].id,
            quantidade: 1,
            preco: produtos[0].preco
          },
          {
            produtoId: produtos[2].id,
            quantidade: 2,
            preco: produtos[2].preco
          }
        ]
      }
    ];

    for (const pedidoData of pedidos) {
      const { itens, ...pedidoInfo } = pedidoData;
      
      await prisma.pedido.create({
        data: {
          ...pedidoInfo,
          usuarioId: usuario.id,
          formaPagamentoId: formaPagamento?.id,
          itens: {
            create: itens
          }
        }
      });
    }

    console.log('✅ Pedidos de exemplo criados com sucesso!');
    console.log(`- ${pedidos.length} pedidos criados para ${usuario.nome}`);

  } catch (error) {
    console.error('❌ Erro ao criar pedidos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleOrders();
