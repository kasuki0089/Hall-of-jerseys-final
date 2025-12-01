const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('🔄 Iniciando reset do banco de dados...');

    // Limpar todas as tabelas (exceto admins)
    console.log('🗑️  Limpando dados...');
    
    try { await prisma.movimentacaoEstoque.deleteMany(); } catch (e) { console.log('Tabela movimentacaoEstoque não encontrada'); }
    try { await prisma.estoquePorTamanho.deleteMany(); } catch (e) { console.log('Tabela estoquePorTamanho não encontrada'); }
    try { await prisma.configuracaoEstoque.deleteMany(); } catch (e) { console.log('Tabela configuracaoEstoque não encontrada'); }
    try { await prisma.avaliacao.deleteMany(); } catch (e) { console.log('Tabela avaliacao não encontrada'); }
    try { await prisma.itemPedido.deleteMany(); } catch (e) { console.log('Tabela itemPedido não encontrada'); }
    try { await prisma.pedido.deleteMany(); } catch (e) { console.log('Tabela pedido não encontrada'); }
    try { await prisma.carrinhoItem.deleteMany(); } catch (e) { console.log('Tabela carrinhoItem não encontrada'); }
    try { await prisma.carrinho.deleteMany(); } catch (e) { console.log('Tabela carrinho não encontrada'); }
    try { await prisma.endereco.deleteMany(); } catch (e) { console.log('Tabela endereco não encontrada'); }
    try { await prisma.produto.deleteMany(); } catch (e) { console.log('Tabela produto não encontrada'); }
    try { await prisma.time.deleteMany(); } catch (e) { console.log('Tabela time não encontrada'); }
    try { await prisma.liga.deleteMany(); } catch (e) { console.log('Tabela liga não encontrada'); }
    try { await prisma.cor.deleteMany(); } catch (e) { console.log('Tabela cor não encontrada'); }
    try { await prisma.tamanho.deleteMany(); } catch (e) { console.log('Tabela tamanho não encontrada'); }
    try { 
      await prisma.usuario.deleteMany({
        where: { role: { not: 'admin' } }
      }); 
    } catch (e) { console.log('Tabela usuario não encontrada'); }

    console.log('🗑️  Dados limpos com sucesso');

    // Verificar se existe admin, se não criar
    const adminExists = await prisma.usuario.findFirst({
      where: { role: 'admin' }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.usuario.create({
        data: {
          nome: 'Administrador',
          email: 'admin@hallofjerseys.com',
          senha: hashedPassword,
          cpf: '000.000.000-00',
          telefone: '(11) 99999-9999',
          dataNascimento: new Date('1990-01-01'),
          endereco: 'Rua Admin, 123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01000-000',
          role: 'admin',
          emailVerificado: true
        }
      });
      
      console.log('👤 Usuário administrador criado');
      console.log('📧 Email: admin@hallofjerseys.com');
      console.log('🔑 Senha: admin123');
    } else {
      console.log('👤 Usuário administrador já existe');
      console.log('📧 Email:', adminExists.email);
    }

    // Criar estrutura básica para funcionamento
    console.log('📦 Criando estrutura básica...');

    // Criar algumas cores básicas
    await prisma.cor.createMany({
      data: [
        { nome: 'Branco', codigo: '#FFFFFF' },
        { nome: 'Preto', codigo: '#000000' },
        { nome: 'Vermelho', codigo: '#FF0000' },
        { nome: 'Azul', codigo: '#0000FF' },
        { nome: 'Verde', codigo: '#008000' },
        { nome: 'Amarelo', codigo: '#FFFF00' }
      ]
    });

    // Criar tamanhos básicos
    await prisma.tamanho.createMany({
      data: [
        { nome: 'PP', ordem: 1 },
        { nome: 'P', ordem: 2 },
        { nome: 'M', ordem: 3 },
        { nome: 'G', ordem: 4 },
        { nome: 'GG', ordem: 5 },
        { nome: 'XG', ordem: 6 }
      ]
    });

    console.log('✅ Reset concluído com sucesso!');
    console.log('🏪 O sistema está pronto para uso');
    console.log('');
    console.log('📋 PRÓXIMOS PASSOS:');
    console.log('1. Adicione ligas e times através do painel admin');
    console.log('2. Cadastre produtos com suas respectivas imagens');
    console.log('3. Configure estoques para cada produto');
    console.log('');
    console.log('🔗 Acesse: http://localhost:3000/adm/home');

  } catch (error) {
    console.error('❌ Erro durante o reset:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();