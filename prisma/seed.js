const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Limpa dados existentes (ordem importante devido às FK)
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.formaPagamento.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.endereco.deleteMany();
  await prisma.estado.deleteMany();
  await prisma.time.deleteMany();
  await prisma.liga.deleteMany();
  await prisma.cor.deleteMany();
  await prisma.tamanho.deleteMany();

  console.log('🗑️  Dados existentes removidos');

  // === CRIAR ESTADOS ===
  const estados = [
    { uf: 'SP', nome: 'São Paulo' },
    { uf: 'RJ', nome: 'Rio de Janeiro' },
    { uf: 'MG', nome: 'Minas Gerais' },
    { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'PR', nome: 'Paraná' },
    { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'BA', nome: 'Bahia' },
    { uf: 'GO', nome: 'Goiás' },
    { uf: 'PE', nome: 'Pernambuco' },
    { uf: 'CE', nome: 'Ceará' }
  ];

  for (const estado of estados) {
    await prisma.estado.create({ data: estado });
  }

  console.log('✅ Estados criados');

  // === CRIAR CORES ===
  const cores = [
    { nome: 'Branco', codigo: '#FFFFFF' },
    { nome: 'Preto', codigo: '#000000' },
    { nome: 'Azul', codigo: '#0000FF' },
    { nome: 'Vermelho', codigo: '#FF0000' },
    { nome: 'Amarelo', codigo: '#FFFF00' },
    { nome: 'Verde', codigo: '#008000' },
    { nome: 'Roxo', codigo: '#800080' },
    { nome: 'Laranja', codigo: '#FFA500' },
    { nome: 'Rosa', codigo: '#FFC0CB' },
    { nome: 'Cinza', codigo: '#808080' },
    { nome: 'Azul Marinho', codigo: '#000080' },
    { nome: 'Dourado', codigo: '#FFD700' }
  ];

  for (const cor of cores) {
    await prisma.cor.create({ data: cor });
  }

  console.log('✅ Cores criadas');

  // === CRIAR TAMANHOS ===
  const tamanhos = [
    { nome: 'PP', ordem: 1 },
    { nome: 'P', ordem: 2 },
    { nome: 'M', ordem: 3 },
    { nome: 'G', ordem: 4 },
    { nome: 'GG', ordem: 5 },
    { nome: 'XGG', ordem: 6 }
  ];

  for (const tamanho of tamanhos) {
    await prisma.tamanho.create({ data: tamanho });
  }

  console.log('✅ Tamanhos criados');

  // === CRIAR LIGAS (APENAS MLS, NBA, NHL, NFL) ===
  const ligas = [
    { nome: 'National Basketball Association', sigla: 'NBA' },
    { nome: 'National Football League', sigla: 'NFL' },
    { nome: 'National Hockey League', sigla: 'NHL' },
    { nome: 'Major League Soccer', sigla: 'MLS' }
  ];

  const ligasCreated = {};
  for (const liga of ligas) {
    const created = await prisma.liga.create({ data: liga });
    ligasCreated[liga.sigla] = created;
  }

  console.log('✅ Ligas criadas');

  // === CRIAR TIMES ===
  
  // NBA Teams - TODOS OS 30 TIMES DA NBA
  const nbaTeams = [
    // CONFERÊNCIA LESTE
    { nome: 'Boston Celtics', sigla: 'BOS', cidade: 'Boston' },
    { nome: 'Brooklyn Nets', sigla: 'BKN', cidade: 'Brooklyn' },
    { nome: 'New York Knicks', sigla: 'NYK', cidade: 'New York' },
    { nome: 'Philadelphia 76ers', sigla: 'PHI', cidade: 'Philadelphia' },
    { nome: 'Toronto Raptors', sigla: 'TOR', cidade: 'Toronto' },
    { nome: 'Chicago Bulls', sigla: 'CHI', cidade: 'Chicago' },
    { nome: 'Cleveland Cavaliers', sigla: 'CLE', cidade: 'Cleveland' },
    { nome: 'Detroit Pistons', sigla: 'DET', cidade: 'Detroit' },
    { nome: 'Indiana Pacers', sigla: 'IND', cidade: 'Indianapolis' },
    { nome: 'Milwaukee Bucks', sigla: 'MIL', cidade: 'Milwaukee' },
    { nome: 'Atlanta Hawks', sigla: 'ATL', cidade: 'Atlanta' },
    { nome: 'Charlotte Hornets', sigla: 'CHA', cidade: 'Charlotte' },
    { nome: 'Miami Heat', sigla: 'MIA', cidade: 'Miami' },
    { nome: 'Orlando Magic', sigla: 'ORL', cidade: 'Orlando' },
    { nome: 'Washington Wizards', sigla: 'WAS', cidade: 'Washington' },
    
    // CONFERÊNCIA OESTE
    { nome: 'Denver Nuggets', sigla: 'DEN', cidade: 'Denver' },
    { nome: 'Minnesota Timberwolves', sigla: 'MIN', cidade: 'Minneapolis' },
    { nome: 'Oklahoma City Thunder', sigla: 'OKC', cidade: 'Oklahoma City' },
    { nome: 'Portland Trail Blazers', sigla: 'POR', cidade: 'Portland' },
    { nome: 'Utah Jazz', sigla: 'UTA', cidade: 'Salt Lake City' },
    { nome: 'Golden State Warriors', sigla: 'GSW', cidade: 'San Francisco' },
    { nome: 'Los Angeles Clippers', sigla: 'LAC', cidade: 'Los Angeles' },
    { nome: 'Los Angeles Lakers', sigla: 'LAL', cidade: 'Los Angeles' },
    { nome: 'Phoenix Suns', sigla: 'PHX', cidade: 'Phoenix' },
    { nome: 'Sacramento Kings', sigla: 'SAC', cidade: 'Sacramento' },
    { nome: 'Dallas Mavericks', sigla: 'DAL', cidade: 'Dallas' },
    { nome: 'Houston Rockets', sigla: 'HOU', cidade: 'Houston' },
    { nome: 'Memphis Grizzlies', sigla: 'MEM', cidade: 'Memphis' },
    { nome: 'New Orleans Pelicans', sigla: 'NOP', cidade: 'New Orleans' },
    { nome: 'San Antonio Spurs', sigla: 'SAS', cidade: 'San Antonio' }
  ];

  const timesCreated = {};
  for (const team of nbaTeams) {
    const created = await prisma.time.create({
      data: { ...team, ligaId: ligasCreated.NBA.id }
    });
    timesCreated[team.sigla] = created;
  }

  // NFL Teams
  const nflTeams = [
    { nome: 'Kansas City Chiefs', sigla: 'KC', cidade: 'Kansas City' },
    { nome: 'New England Patriots', sigla: 'NE', cidade: 'Foxborough' },
    { nome: 'Green Bay Packers', sigla: 'GB', cidade: 'Green Bay' },
    { nome: 'Dallas Cowboys', sigla: 'DAL', cidade: 'Dallas' }
  ];

  for (const team of nflTeams) {
    const created = await prisma.time.create({
      data: { ...team, ligaId: ligasCreated.NFL.id }
    });
    timesCreated[team.sigla] = created;
  }

  // NHL Teams
  const nhlTeams = [
    { nome: 'Boston Bruins', sigla: 'BOS', cidade: 'Boston' },
    { nome: 'Chicago Blackhawks', sigla: 'CHI', cidade: 'Chicago' },
    { nome: 'Toronto Maple Leafs', sigla: 'TOR', cidade: 'Toronto' }
  ];

  for (const team of nhlTeams) {
    const created = await prisma.time.create({
      data: { ...team, ligaId: ligasCreated.NHL.id }
    });
    timesCreated[team.sigla + '_NHL'] = created;
  }

  // MLS Teams
  const mlsTeams = [
    { nome: 'LA Galaxy', sigla: 'LAG', cidade: 'Los Angeles' },
    { nome: 'Inter Miami CF', sigla: 'MIA', cidade: 'Miami' },
    { nome: 'New York City FC', sigla: 'NYC', cidade: 'New York' }
  ];

  for (const team of mlsTeams) {
    const created = await prisma.time.create({
      data: { ...team, ligaId: ligasCreated.MLS.id }
    });
    timesCreated[team.sigla + '_MLS'] = created;
  }

  console.log('✅ Times criados');

  // === CRIAR ENDEREÇOS EXEMPLO ===
  const endereco1 = await prisma.endereco.create({
    data: {
      endereco: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      cep: '01234-567',
      estadoUf: 'SP'
    }
  });

  const endereco2 = await prisma.endereco.create({
    data: {
      endereco: 'Av. Copacabana',
      numero: '789',
      bairro: 'Copacabana',
      cidade: 'Rio de Janeiro', 
      cep: '22070-000',
      estadoUf: 'RJ'
    }
  });

  console.log('✅ Endereços exemplo criados');

  // === CRIAR USUÁRIOS ===
  const bcrypt = require('bcrypt');
  const senhaHash = await bcrypt.hash('admin123', 10);

  // Usuário Admin
  const usuarioAdmin = await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@hallofjerseyscom',
      senha: senhaHash,
      telefone: '(11) 99999-9999',
      role: 'admin',
      enderecoId: endereco1.id
    }
  });

  // Usuário comum  
  const senhaUserHash = await bcrypt.hash('user123', 10);
  const usuarioComum = await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: senhaUserHash,
      telefone: '(21) 88888-8888',
      role: 'user',
      enderecoId: endereco2.id
    }
  });

  console.log('✅ Usuários criados');

  // === CRIAR FORMAS DE PAGAMENTO ===
  await prisma.formaPagamento.create({
    data: {
      tipo: 'cartao_credito',
      numeroCartao: '**** **** **** 1234',
      nomeCartao: 'João Silva',
      validadeCartao: '12/2028',
      bandeiraCartao: 'Visa',
      usuarioId: usuarioComum.id
    }
  });

  await prisma.formaPagamento.create({
    data: {
      tipo: 'cartao_debito',
      numeroCartao: '**** **** **** 5678',
      nomeCartao: 'João Silva',
      validadeCartao: '08/2027',
      bandeiraCartao: 'Mastercard',
      usuarioId: usuarioComum.id
    }
  });

  console.log('✅ Formas de pagamento criadas');

  // === BUSCAR IDs PARA PRODUTOS ===
  const corAmarela = await prisma.cor.findFirst({ where: { nome: 'Amarelo' } });
  const corVermelho = await prisma.cor.findFirst({ where: { nome: 'Vermelho' } });
  const corAzul = await prisma.cor.findFirst({ where: { nome: 'Azul' } });
  const corBranco = await prisma.cor.findFirst({ where: { nome: 'Branco' } });
  
  const tamanhoM = await prisma.tamanho.findFirst({ where: { nome: 'M' } });
  const tamanhoG = await prisma.tamanho.findFirst({ where: { nome: 'G' } });
  const tamanhoL = tamanhoG; // Considerando G como L

  // === CRIAR PRODUTOS EXEMPLO ===
  const produtos = [
    {
      nome: 'Camisa Lakers Home 2024',
      codigo: 'LAL-HOME-2024-M-AMARELO',
      descricao: 'Camisa oficial dos Lakers temporada 2024',
      modelo: 'Jersey Home',
      preco: 299.99,
      year: 2024,
      serie: 'Home',
      estoque: 50,
      ativo: true,
      sale: false,
      ligaId: ligasCreated.NBA.id,
      timeId: timesCreated.LAL.id,
      corId: corAmarela.id,
      tamanhoId: tamanhoM.id,
      imagemUrl: '/images/lakers-home-2024.jpg'
    },
    {
      nome: 'Camisa Warriors Home 2024',
      codigo: 'GSW-HOME-2024-G-AZUL',
      descricao: 'Camisa oficial dos Warriors temporada 2024',
      modelo: 'Jersey Home',
      preco: 289.99,
      year: 2024,
      serie: 'Home',
      estoque: 40,
      ativo: true,
      sale: true,
      ligaId: ligasCreated.NBA.id,
      timeId: timesCreated.GSW.id,
      corId: corAzul.id,
      tamanhoId: tamanhoG.id,
      imagemUrl: '/images/warriors-home-2024.jpg'
    },
    {
      nome: 'Jersey Chiefs Home 2024',
      codigo: 'KC-HOME-2024-M-VERMELHO',
      descricao: 'Jersey oficial dos Chiefs temporada 2024',
      modelo: 'Jersey Home',
      preco: 319.99,
      year: 2024,
      serie: 'Home',
      estoque: 30,
      ativo: true,
      sale: false,
      ligaId: ligasCreated.NFL.id,
      timeId: timesCreated.KC.id,
      corId: corVermelho.id,
      tamanhoId: tamanhoM.id,
      imagemUrl: '/images/chiefs-home-2024.jpg'
    },
    {
      nome: 'Jersey Bruins Home 2024',
      codigo: 'BOS-NHL-HOME-2024-G-PRETO',
      descricao: 'Jersey oficial dos Bruins temporada 2024',
      modelo: 'Jersey Home',
      preco: 279.99,
      year: 2024,
      serie: 'Home',
      estoque: 25,
      ativo: true,
      sale: false,
      ligaId: ligasCreated.NHL.id,
      timeId: timesCreated.BOS_NHL.id,
      corId: await prisma.cor.findFirst({ where: { nome: 'Preto' } }).then(c => c.id),
      tamanhoId: tamanhoG.id,
      imagemUrl: '/images/bruins-home-2024.jpg'
    },
    {
      nome: 'Camisa LA Galaxy Home 2024',
      codigo: 'LAG-MLS-HOME-2024-M-BRANCO',
      descricao: 'Camisa oficial do LA Galaxy temporada 2024',
      modelo: 'Jersey Home',
      preco: 199.99,
      year: 2024,
      serie: 'Home',
      estoque: 60,
      ativo: true,
      sale: true,
      ligaId: ligasCreated.MLS.id,
      timeId: timesCreated.LAG_MLS.id,
      corId: corBranco.id,
      tamanhoId: tamanhoM.id,
      imagemUrl: '/images/galaxy-home-2024.jpg'
    }
  ];

  for (const produto of produtos) {
    await prisma.produto.create({ data: produto });
  }

  console.log('✅ Produtos exemplo criados');

  console.log('\n🎉 Seed executado com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`- ${await prisma.estado.count()} estados criados`);
  console.log(`- ${await prisma.endereco.count()} endereços criados`);
  console.log(`- ${await prisma.cor.count()} cores criadas`);
  console.log(`- ${await prisma.tamanho.count()} tamanhos criados`);
  console.log(`- ${await prisma.liga.count()} ligas criadas (NBA, NFL, NHL, MLS)`);
  console.log(`- ${await prisma.time.count()} times criados (30 NBA + outros)`);
  console.log(`- ${await prisma.produto.count()} produtos criados`);
  console.log(`- ${await prisma.usuario.count()} usuários criados`);
  console.log(`- ${await prisma.formaPagamento.count()} formas de pagamento criadas`);
  
  console.log('\n👤 Credenciais:');
  console.log('Admin: admin@hallofjerseyscom / admin123');
  console.log('User: joao@email.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
