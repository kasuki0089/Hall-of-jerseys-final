const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testCadastro() {
  try {
    console.log('🔄 Testando criação de usuário...\n');

    // Dados de teste
    const dadosTeste = {
      nome: 'Usuario Teste',
      email: `teste${Date.now()}@email.com`,
      senha: '123456',
      telefone: '+55 (11) 99999-9999',
      cpf: '123.456.789-00',
      dataNascimento: '1990-01-01',
      endereco: {
        endereco: 'Rua Teste',
        numero: '123',
        complemento: 'Apto 1',
        bairro: 'Centro',
        cidade: 'São Paulo',
        cep: '01234567',
        estadoUf: 'SP'
      }
    };

    console.log('📋 Dados de teste:', dadosTeste);

    // Hash da senha
    console.log('\n🔐 Gerando hash da senha...');
    const senhaHash = await bcrypt.hash(dadosTeste.senha, 10);

    // Criar endereco
    console.log('\n🏠 Criando endereço...');
    const novoEndereco = await prisma.endereco.create({
      data: dadosTeste.endereco
    });
    console.log('✅ Endereço criado:', novoEndereco);

    // Criar usuario
    console.log('\n👤 Criando usuário...');
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: dadosTeste.nome,
        email: dadosTeste.email,
        senha: senhaHash,
        telefone: dadosTeste.telefone,
        cpf: dadosTeste.cpf,
        dataNascimento: new Date(dadosTeste.dataNascimento),
        role: 'user',
        enderecoId: novoEndereco.id,
        emailVerificado: false
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        role: true,
        criadoEm: true,
        endereco: true
      }
    });

    console.log('\n✅ Usuário criado com sucesso!');
    console.log(JSON.stringify(novoUsuario, null, 2));

  } catch (error) {
    console.error('\n❌ Erro:', error);
    console.error('\nDetalhes do erro:', error.message);
    if (error.meta) {
      console.error('Meta:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testCadastro();
