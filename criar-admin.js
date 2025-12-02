const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function criarAdmin() {
  try {
    console.log('👤 Criando usuário administrador...\n');

    const senhaHash = await bcrypt.hash('admin123', 10);

    const admin = await prisma.usuario.create({
      data: {
        nome: 'Administrador',
        email: 'admin@hallofjerseys.com',
        senha: senhaHash,
        telefone: '(11) 99999-9999',
        cpf: '000.000.000-00',
        role: 'ADMIN',
        emailVerificado: true
      }
    });

    console.log('✅ Administrador criado com sucesso!');
    console.log('\n📧 Email: admin@hallofjerseys.com');
    console.log('🔑 Senha: admin123\n');

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ Usuário admin já existe!');
    } else {
      console.error('❌ Erro:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

criarAdmin();
