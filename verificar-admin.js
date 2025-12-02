const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarAdmin() {
  try {
    console.log('🔍 Buscando usuários admin...\n');

    // Buscar todos os usuários
    const todosUsuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        emailVerificado: true
      }
    });

    console.log(`📊 Total de usuários: ${todosUsuarios.length}\n`);

    if (todosUsuarios.length > 0) {
      console.log('👥 Todos os usuários:');
      todosUsuarios.forEach(u => {
        console.log(`   ${u.id}. ${u.nome} - ${u.email} - Role: ${u.role} - Verificado: ${u.emailVerificado}`);
      });
    }

    // Buscar admins especificamente
    const admins = await prisma.usuario.findMany({
      where: {
        role: 'admin'
      }
    });

    console.log(`\n👨‍💼 Administradores (role='admin'): ${admins.length}`);
    admins.forEach(a => {
      console.log(`   - ${a.nome} (${a.email})`);
    });

    // Buscar ADMIN maiúsculo
    const adminsUpper = await prisma.usuario.findMany({
      where: {
        role: 'ADMIN'
      }
    });

    console.log(`\n👨‍💼 Administradores (role='ADMIN'): ${adminsUpper.length}`);
    adminsUpper.forEach(a => {
      console.log(`   - ${a.nome} (${a.email})`);
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarAdmin();
