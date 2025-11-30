const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function atualizarUsuario() {
  try {
    const usuario = await prisma.usuario.update({
      where: { 
        email: 'isaaccardoso@gmail.com' 
      },
      data: {
        cpf: '123.456.789-00',
        dataNascimento: new Date('1995-06-15'),
        genero: 'Masculino'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        dataNascimento: true,
        genero: true
      }
    });

    console.log('Usuário atualizado com sucesso:');
    console.log(JSON.stringify(usuario, null, 2));

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarUsuario();
