const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarUsuario() {
  try {
    const usuario = await prisma.usuario.findFirst({
      where: { 
        email: 'isaaccardoso@gmail.com' 
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        dataNascimento: true,
        genero: true,
        criadoEm: true
      }
    });

    console.log('Usuário encontrado:');
    console.log(JSON.stringify(usuario, null, 2));

    // Verificar todos os usuários
    const todos = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        dataNascimento: true,
        genero: true
      }
    });

    console.log('\n\nTodos os usuários:');
    console.log(JSON.stringify(todos, null, 2));

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarUsuario();
