const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Limpa dados existentes (ordem importante devido às FK)
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.time.deleteMany();
  await prisma.liga.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('🗑️  Dados existentes removidos');

  // === CRIAR LIGAS ===
  const nba = await prisma.liga.create({
    data: { nome: 'National Basketball Association', sigla: 'NBA' }
  });

  const nfl = await prisma.liga.create({
    data: { nome: 'National Football League', sigla: 'NFL' }
  });

  const brasileirao = await prisma.liga.create({
    data: { nome: 'Campeonato Brasileiro Série A', sigla: 'BRASILEIRÃO' }
  });

  const championsLeague = await prisma.liga.create({
    data: { nome: 'UEFA Champions League', sigla: 'UCL' }
  });

  const premierLeague = await prisma.liga.create({
    data: { nome: 'Premier League', sigla: 'EPL' }
  });

  const laLiga = await prisma.liga.create({
    data: { nome: 'La Liga', sigla: 'LALIGA' }
  });

  const bundesliga = await prisma.liga.create({
    data: { nome: 'Bundesliga', sigla: 'BUNDESLIGA' }
  });

  const serieA = await prisma.liga.create({
    data: { nome: 'Serie A', sigla: 'SERIEA' }
  });

  const ligue1 = await prisma.liga.create({
    data: { nome: 'Ligue 1', sigla: 'LIGUE1' }
  });

  console.log('✅ Ligas criadas');

  // === CRIAR TIMES ===
  
  // NBA Teams
  const lakers = await prisma.time.create({
    data: { nome: 'Los Angeles Lakers', sigla: 'LAL', cidade: 'Los Angeles', ligaId: nba.id }
  });

  const warriors = await prisma.time.create({
    data: { nome: 'Golden State Warriors', sigla: 'GSW', cidade: 'San Francisco', ligaId: nba.id }
  });

  const heat = await prisma.time.create({
    data: { nome: 'Miami Heat', sigla: 'MIA', cidade: 'Miami', ligaId: nba.id }
  });

  const bulls = await prisma.time.create({
    data: { nome: 'Chicago Bulls', sigla: 'CHI', cidade: 'Chicago', ligaId: nba.id }
  });

  const celtics = await prisma.time.create({
    data: { nome: 'Boston Celtics', sigla: 'BOS', cidade: 'Boston', ligaId: nba.id }
  });

  // NFL Teams
  const chiefs = await prisma.time.create({
    data: { nome: 'Kansas City Chiefs', sigla: 'KC', cidade: 'Kansas City', ligaId: nfl.id }
  });

  const patriots = await prisma.time.create({
    data: { nome: 'New England Patriots', sigla: 'NE', cidade: 'Foxborough', ligaId: nfl.id }
  });

  const packers = await prisma.time.create({
    data: { nome: 'Green Bay Packers', sigla: 'GB', cidade: 'Green Bay', ligaId: nfl.id }
  });

  // Brasileirão Teams
  const flamengo = await prisma.time.create({
    data: { nome: 'Flamengo', sigla: 'FLA', cidade: 'Rio de Janeiro', ligaId: brasileirao.id }
  });

  const palmeiras = await prisma.time.create({
    data: { nome: 'Palmeiras', sigla: 'PAL', cidade: 'São Paulo', ligaId: brasileirao.id }
  });

  const corinthians = await prisma.time.create({
    data: { nome: 'Corinthians', sigla: 'COR', cidade: 'São Paulo', ligaId: brasileirao.id }
  });

  const santos = await prisma.time.create({
    data: { nome: 'Santos', sigla: 'SAN', cidade: 'Santos', ligaId: brasileirao.id }
  });

  // Premier League Teams
  const manchester_united = await prisma.time.create({
    data: { nome: 'Manchester United', sigla: 'MUN', cidade: 'Manchester', ligaId: premierLeague.id }
  });

  const liverpool = await prisma.time.create({
    data: { nome: 'Liverpool', sigla: 'LIV', cidade: 'Liverpool', ligaId: premierLeague.id }
  });

  const chelsea = await prisma.time.create({
    data: { nome: 'Chelsea', sigla: 'CHE', cidade: 'London', ligaId: premierLeague.id }
  });

  // La Liga Teams
  const real_madrid = await prisma.time.create({
    data: { nome: 'Real Madrid', sigla: 'RMA', cidade: 'Madrid', ligaId: laLiga.id }
  });

  const barcelona = await prisma.time.create({
    data: { nome: 'Barcelona', sigla: 'BAR', cidade: 'Barcelona', ligaId: laLiga.id }
  });

  const atletico_madrid = await prisma.time.create({
    data: { nome: 'Atlético Madrid', sigla: 'ATM', cidade: 'Madrid', ligaId: laLiga.id }
  });

  // Bundesliga Teams
  const bayern_munich = await prisma.time.create({
    data: { nome: 'Bayern Munich', sigla: 'BAY', cidade: 'Munich', ligaId: bundesliga.id }
  });

  const borussia_dortmund = await prisma.time.create({
    data: { nome: 'Borussia Dortmund', sigla: 'BVB', cidade: 'Dortmund', ligaId: bundesliga.id }
  });

  // Serie A Teams  
  const juventus = await prisma.time.create({
    data: { nome: 'Juventus', sigla: 'JUV', cidade: 'Turin', ligaId: serieA.id }
  });

  const ac_milan = await prisma.time.create({
    data: { nome: 'AC Milan', sigla: 'MIL', cidade: 'Milan', ligaId: serieA.id }
  });

  // Ligue 1 Teams
  const psg = await prisma.time.create({
    data: { nome: 'Paris Saint-Germain', sigla: 'PSG', cidade: 'Paris', ligaId: ligue1.id }
  });

  console.log('✅ Times criados');

  // === CRIAR PRODUTOS EXEMPLO ===
  const produtos = [
    {
      nome: 'Camisa Lakers Home 2024',
      codigo: 'LAL-HOME-2024',
      descricao: 'Camisa oficial dos Lakers temporada 2024',
      preco: 299.99,
      tamanho: 'M',
      cor: 'Amarelo',
      sport: 'Basquete',
      year: 2024,
      serie: 'Home',
      estoque: 50,
      ativo: true,
      sale: false,
      ligaId: nba.id,
      timeId: lakers.id,
      imagemUrl: '/images/lakers-home-2024.jpg'
    },
    {
      nome: 'Camisa Flamengo Home 2024',
      codigo: 'FLA-HOME-2024',
      descricao: 'Camisa oficial do Flamengo temporada 2024',
      preco: 249.99,
      tamanho: 'G',
      cor: 'Vermelho',
      sport: 'Futebol',
      year: 2024,
      serie: 'Home',
      estoque: 75,
      ativo: true,
      sale: true,
      ligaId: brasileirao.id,
      timeId: flamengo.id,
      imagemUrl: '/images/flamengo-home-2024.jpg'
    },
    {
      nome: 'Camisa Real Madrid Away 2024',
      codigo: 'RMA-AWAY-2024',
      descricao: 'Camisa oficial do Real Madrid temporada 2024',
      preco: 279.99,
      tamanho: 'M',
      cor: 'Azul',
      sport: 'Futebol',
      year: 2024,
      serie: 'Away',
      estoque: 30,
      ativo: true,
      sale: false,
      ligaId: laLiga.id,
      timeId: real_madrid.id,
      imagemUrl: '/images/real-madrid-away-2024.jpg'
    },
    {
      nome: 'Camisa Warriors Home 2024',
      codigo: 'GSW-HOME-2024',
      descricao: 'Camisa oficial dos Warriors temporada 2024',
      preco: 289.99,
      tamanho: 'L',
      cor: 'Azul',
      sport: 'Basquete',
      year: 2024,
      serie: 'Home',
      estoque: 40,
      ativo: true,
      sale: true,
      ligaId: nba.id,
      timeId: warriors.id,
      imagemUrl: '/images/warriors-home-2024.jpg'
    },
    {
      nome: 'Camisa PSG Home 2024',
      codigo: 'PSG-HOME-2024',
      descricao: 'Camisa oficial do PSG temporada 2024',
      preco: 269.99,
      tamanho: 'M',
      cor: 'Azul Marinho',
      sport: 'Futebol',
      year: 2024,
      serie: 'Home',
      estoque: 60,
      ativo: true,
      sale: false,
      ligaId: ligue1.id,
      timeId: psg.id,
      imagemUrl: '/images/psg-home-2024.jpg'
    }
  ];

  for (const produto of produtos) {
    await prisma.produto.create({ data: produto });
  }

  console.log('✅ Produtos exemplo criados');

  // === CRIAR USUÁRIO ADMIN ===
  const bcrypt = require('bcrypt');
  const senhaHash = await bcrypt.hash('admin123', 10);

  await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@hallofjerseyscom',
      senha: senhaHash,
      telefone: '(11) 99999-9999',
      endereco: 'Rua Admin, 123 - São Paulo/SP',
      role: 'admin'
    }
  });

  console.log('✅ Usuário admin criado (admin@hallofjerseyscom / admin123)');

  console.log('\n🎉 Seed executado com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`- ${await prisma.liga.count()} ligas criadas`);
  console.log(`- ${await prisma.time.count()} times criados`);
  console.log(`- ${await prisma.produto.count()} produtos criados`);
  console.log(`- ${await prisma.usuario.count()} usuário admin criado`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
