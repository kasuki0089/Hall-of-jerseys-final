const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('📦 Verificando pedidos no banco de dados...\n');
    
    const pedidos = await prisma.pedido.findMany({
      include: {
        usuario: {
          select: { nome: true, email: true }
        },
        itens: {
          include: {
            produto: {
              select: { nome: true, preco: true }
            },
            tamanho: {
              select: { nome: true }
            }
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    if (pedidos.length === 0) {
      console.log('❌ Nenhum pedido encontrado no banco de dados.');
    } else {
      console.log(`✅ Encontrados ${pedidos.length} pedido(s):\n`);
      
      pedidos.forEach((pedido, index) => {
        console.log(`Pedido #${pedido.id}`);
        console.log(`  Usuário: ${pedido.usuario.nome} (${pedido.usuario.email})`);
        console.log(`  Status: ${pedido.status}`);
        console.log(`  Total: R$ ${pedido.total.toFixed(2)}`);
        console.log(`  Data: ${pedido.criadoEm.toLocaleString('pt-BR')}`);
        console.log(`  Itens: ${pedido.itens.length}`);
        pedido.itens.forEach(item => {
          console.log(`    - ${item.produto.nome} (Tamanho: ${item.tamanho?.nome || 'N/A'}) - ${item.quantidade}x R$ ${item.preco.toFixed(2)}`);
        });
        console.log('');
      });
    }

    // Verificar estoque
    console.log('\n📊 Verificando estoques...\n');
    const estoques = await prisma.estoquePorTamanho.findMany({
      include: {
        produto: {
          select: { nome: true }
        },
        tamanho: {
          select: { nome: true }
        }
      },
      orderBy: {
        produtoId: 'asc'
      }
    });

    estoques.forEach(estoque => {
      console.log(`${estoque.produto.nome} (${estoque.tamanho.nome}): ${estoque.quantidade} unidades`);
    });

  } catch (error) {
    console.error('❌ Erro ao verificar pedidos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
