const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removerEnderecos() {
  try {
    // Primeiro, remover a referência de endereços dos usuários
    await prisma.usuario.updateMany({
      where: {
        enderecoId: {
          not: null
        }
      },
      data: {
        enderecoId: null
      }
    });

    console.log('Referências de endereços removidas dos usuários');

    // Agora deletar todos os endereços
    const result = await prisma.endereco.deleteMany({});

    console.log(`${result.count} endereço(s) removido(s) com sucesso`);

  } catch (error) {
    console.error('Erro ao remover endereços:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removerEnderecos();
