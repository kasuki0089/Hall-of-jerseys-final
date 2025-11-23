const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Limpa dados existentes
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.time.deleteMany();
  await prisma.liga.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('🗑️  Dados existentes removidos');

  // Criar ligas
  const nba = await prisma.liga.create({
    data: {
      nome: 'National Basketball Association',
      sigla: 'NBA',
      pais: 'Estados Unidos',
      ativo: true
    }
  });

  const nfl = await prisma.liga.create({
    data: {
      nome: 'National Football League',
      sigla: 'NFL', 
      pais: 'Estados Unidos',
      ativo: true
    }
  });

  const brasileirao = await prisma.liga.create({
    data: {
      nome: 'Campeonato Brasileiro',
      sigla: 'CBF',
      pais: 'Brasil',
      ativo: true
    }
  });

  const champions = await prisma.liga.create({
    data: {
      nome: 'UEFA Champions League',
      sigla: 'UCL',
      pais: 'Europa',
      ativo: true
    }
  });

  const premierLeague = await prisma.liga.create({
    data: {
      nome: 'Premier League',
      sigla: 'EPL',
      pais: 'Inglaterra',
      ativo: true
    }
  });

  const laLiga = await prisma.liga.create({
    data: {
      nome: 'La Liga',
      sigla: 'LL',
      pais: 'Espanha',
      ativo: true
    }
  });

  const bundesliga = await prisma.liga.create({
    data: {
      nome: 'Bundesliga',
      sigla: 'BL',
      pais: 'Alemanha',
      ativo: true
    }
  });

  const serieA = await prisma.liga.create({
    data: {
      nome: 'Serie A',
      sigla: 'SA',
      pais: 'Itália',
      ativo: true
    }
  });

  const ligue1 = await prisma.liga.create({
    data: {
      nome: 'Ligue 1',
      sigla: 'L1',
      pais: 'França',
      ativo: true
    }
  });

  console.log('🏆 Ligas criadas');

  // Criar times da NBA
  const lakers = await prisma.time.create({
    data: { nome: 'Los Angeles Lakers', cidade: 'Los Angeles', ligaId: nba.id }
  });

  const warriors = await prisma.time.create({
    data: { nome: 'Golden State Warriors', cidade: 'San Francisco', ligaId: nba.id }
  });

  const heat = await prisma.time.create({
    data: { nome: 'Miami Heat', cidade: 'Miami', ligaId: nba.id }
  });

  const bulls = await prisma.time.create({
    data: { nome: 'Chicago Bulls', cidade: 'Chicago', ligaId: nba.id }
  });

  const celtics = await prisma.time.create({
    data: { nome: 'Boston Celtics', cidade: 'Boston', ligaId: nba.id }
  });

  // Criar times do Brasileirão
  const flamengo = await prisma.time.create({
    data: { nome: 'Clube de Regatas do Flamengo', cidade: 'Rio de Janeiro', ligaId: brasileirao.id }
  });

  const palmeiras = await prisma.time.create({
    data: { nome: 'Sociedade Esportiva Palmeiras', cidade: 'São Paulo', ligaId: brasileirao.id }
  });

  const corinthians = await prisma.time.create({
    data: { nome: 'Sport Club Corinthians Paulista', cidade: 'São Paulo', ligaId: brasileirao.id }
  });

  // Times europeus
  const psg = await prisma.time.create({
    data: { nome: 'Paris Saint-Germain', cidade: 'Paris', ligaId: champions.id }
  });

  const barcelona = await prisma.time.create({
    data: { nome: 'FC Barcelona', cidade: 'Barcelona', ligaId: champions.id }
  });

  // Times da Premier League
  const arsenal = await prisma.time.create({
    data: { nome: 'Arsenal FC', cidade: 'Londres', ligaId: premierLeague.id }
  });

  const chelsea = await prisma.time.create({
    data: { nome: 'Chelsea FC', cidade: 'Londres', ligaId: premierLeague.id }
  });

  const liverpool = await prisma.time.create({
    data: { nome: 'Liverpool FC', cidade: 'Liverpool', ligaId: premierLeague.id }
  });

  const manCity = await prisma.time.create({
    data: { nome: 'Manchester City', cidade: 'Manchester', ligaId: premierLeague.id }
  });

  const manUtd = await prisma.time.create({
    data: { nome: 'Manchester United', cidade: 'Manchester', ligaId: premierLeague.id }
  });

  const tottenham = await prisma.time.create({
    data: { nome: 'Tottenham Hotspur', cidade: 'Londres', ligaId: premierLeague.id }
  });

  // Times da La Liga
  const realMadrid = await prisma.time.create({
    data: { nome: 'Real Madrid', cidade: 'Madrid', ligaId: laLiga.id }
  });

  const barcelonaLaLiga = await prisma.time.create({
    data: { nome: 'FC Barcelona', cidade: 'Barcelona', ligaId: laLiga.id }
  });

  const atleticoMadrid = await prisma.time.create({
    data: { nome: 'Atlético Madrid', cidade: 'Madrid', ligaId: laLiga.id }
  });

  const sevilla = await prisma.time.create({
    data: { nome: 'Sevilla FC', cidade: 'Sevilha', ligaId: laLiga.id }
  });

  const valencia = await prisma.time.create({
    data: { nome: 'Valencia CF', cidade: 'Valencia', ligaId: laLiga.id }
  });

  // Times da Bundesliga
  const bayernMunich = await prisma.time.create({
    data: { nome: 'Bayern Munich', cidade: 'Munique', ligaId: bundesliga.id }
  });

  const borussiaDortmund = await prisma.time.create({
    data: { nome: 'Borussia Dortmund', cidade: 'Dortmund', ligaId: bundesliga.id }
  });

  const rbLeipzig = await prisma.time.create({
    data: { nome: 'RB Leipzig', cidade: 'Leipzig', ligaId: bundesliga.id }
  });

  const bayerLeverkusen = await prisma.time.create({
    data: { nome: 'Bayer Leverkusen', cidade: 'Leverkusen', ligaId: bundesliga.id }
  });

  // Times da Serie A
  const juventus = await prisma.time.create({
    data: { nome: 'Juventus FC', cidade: 'Turim', ligaId: serieA.id }
  });

  const milan = await prisma.time.create({
    data: { nome: 'AC Milan', cidade: 'Milão', ligaId: serieA.id }
  });

  const inter = await prisma.time.create({
    data: { nome: 'Inter Milan', cidade: 'Milão', ligaId: serieA.id }
  });

  const napoli = await prisma.time.create({
    data: { nome: 'SSC Napoli', cidade: 'Nápoles', ligaId: serieA.id }
  });

  const roma = await prisma.time.create({
    data: { nome: 'AS Roma', cidade: 'Roma', ligaId: serieA.id }
  });

  // Times da Ligue 1
  const psgLigue1 = await prisma.time.create({
    data: { nome: 'Paris Saint-Germain', cidade: 'Paris', ligaId: ligue1.id }
  });

  const marseille = await prisma.time.create({
    data: { nome: 'Olympique Marseille', cidade: 'Marselha', ligaId: ligue1.id }
  });

  const lyon = await prisma.time.create({
    data: { nome: 'Olympique Lyonnais', cidade: 'Lyon', ligaId: ligue1.id }
  });

  const monaco = await prisma.time.create({
    data: { nome: 'AS Monaco', cidade: 'Monaco', ligaId: ligue1.id }
  });

  console.log('⚽🏀 Times criados');

  // Criar usuários
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Admin',
      email: 'admin@hallofjersey.com',
      senha: '$2a$10$xVH8ZLmKh3qDOYvZvKSCCOhGiKGhgG8BhkKtxWuWyGZrHGPqTrODe', // senha: admin123
      role: 'admin'
    }
  });

  const cliente = await prisma.usuario.create({
    data: {
      nome: 'Cliente Teste',
      email: 'cliente@teste.com',
      senha: '$2a$10$xVH8ZLmKh3qDOYvZvKSCCOhGiKGhgG8BhkKtxWuWyGZrHGPqTrODe', // senha: 123456
      role: 'cliente'
    }
  });

  console.log('👥 Usuários criados');

  // Criar produtos com ligas e times definidos
  const produtos = await prisma.produto.createMany({
    data: [
      // NBA Jerseys
      {
        nome: 'Jersey Lakers #24 Kobe Bryant',
        tamanho: 'M',
        preco: 350.00,
        codigo: 'LAK001',
        descricao: 'Jersey oficial dos Lakers - Kobe Bryant Legends Edition',
        sale: true,
        serie: 'Legends Collection',
        categoria: 'JERSEY',
        cor: 'Amarelo',
        sport: 'Basquete',
        year: 2020,
        estoque: 15,
        ativo: true,
        ligaId: nba.id,
        timeId: lakers.id
      },
      {
        nome: 'Jersey Warriors #30 Stephen Curry',
        tamanho: 'G',
        preco: 320.00,
        codigo: 'GSW001',
        descricao: 'Jersey atual do Golden State Warriors',
        sale: false,
        serie: 'Current Season 2024',
        categoria: 'JERSEY',
        cor: 'Azul',
        sport: 'Basquete',
        year: 2024,
        estoque: 20,
        ativo: true,
        ligaId: nba.id,
        timeId: warriors.id
      },
      {
        nome: 'Jersey Heat #6 LeBron James',
        tamanho: 'L',
        preco: 300.00,
        codigo: 'MIA001',
        descricao: 'Jersey histórica do Miami Heat era Championship',
        sale: true,
        serie: 'Championship Era',
        categoria: 'JERSEY',
        cor: 'Preto',
        sport: 'Basquete',
        year: 2012,
        estoque: 8,
        ativo: true,
        ligaId: nba.id,
        timeId: heat.id
      },
      {
        nome: 'Jersey Bulls #23 Michael Jordan',
        tamanho: 'M',
        preco: 450.00,
        codigo: 'CHI001',
        descricao: 'Jersey lendária do Chicago Bulls - Michael Jordan',
        sale: false,
        serie: 'Legends Collection',
        categoria: 'JERSEY',
        cor: 'Vermelho',
        sport: 'Basquete',
        year: 1996,
        estoque: 5,
        ativo: true,
        ligaId: nba.id,
        timeId: bulls.id
      },
      {
        nome: 'Jersey Celtics #33 Larry Bird',
        tamanho: 'G',
        preco: 380.00,
        codigo: 'BOS001',
        descricao: 'Jersey retrô do Boston Celtics',
        sale: true,
        serie: 'Retro Collection',
        categoria: 'JERSEY',
        cor: 'Verde',
        sport: 'Basquete',
        year: 1986,
        estoque: 12,
        ativo: true,
        ligaId: nba.id,
        timeId: celtics.id
      },

      // Camisas Brasileirão
      {
        nome: 'Camisa Flamengo #10 Zico',
        tamanho: 'M',
        preco: 220.00,
        codigo: 'FLA001',
        descricao: 'Camisa retrô do Flamengo - Zico',
        sale: false,
        serie: 'Brasileirão Legends',
        categoria: 'CAMISA',
        cor: 'Rubro-Negro',
        sport: 'Futebol',
        year: 1981,
        estoque: 18,
        ativo: true,
        ligaId: brasileirao.id,
        timeId: flamengo.id
      },
      {
        nome: 'Camisa Palmeiras Home 2024',
        tamanho: 'G',
        preco: 250.00,
        codigo: 'PAL001',
        descricao: 'Camisa oficial do Palmeiras temporada 2024',
        sale: false,
        serie: 'Temporada 2024',
        categoria: 'CAMISA',
        cor: 'Verde',
        sport: 'Futebol',
        year: 2024,
        estoque: 25,
        ativo: true,
        ligaId: brasileirao.id,
        timeId: palmeiras.id
      },
      {
        nome: 'Camisa Corinthians Away 2024',
        tamanho: 'M',
        preco: 240.00,
        codigo: 'COR001',
        descricao: 'Camisa visitante do Corinthians',
        sale: true,
        serie: 'Temporada 2024',
        categoria: 'CAMISA',
        cor: 'Preto',
        sport: 'Futebol',
        year: 2024,
        estoque: 30,
        ativo: true,
        ligaId: brasileirao.id,
        timeId: corinthians.id
      },

      // Camisas Europeias - La Liga
      {
        nome: 'Camisa Real Madrid #7 Cristiano Ronaldo',
        tamanho: 'M',
        preco: 350.00,
        codigo: 'RMA001',
        descricao: 'Camisa histórica do Real Madrid - Cristiano Ronaldo',
        sale: false,
        serie: 'Legends Collection',
        categoria: 'CAMISA',
        cor: 'Branco',
        sport: 'Futebol',
        year: 2017,
        estoque: 10,
        ativo: true,
        ligaId: laLiga.id,
        timeId: realMadrid.id
      },
      {
        nome: 'Camisa Barcelona #10 Messi Retro',
        tamanho: 'G',
        preco: 380.00,
        codigo: 'BAR001',
        descricao: 'Camisa histórica do Barcelona - Messi',
        sale: true,
        serie: 'Legends Collection',
        categoria: 'CAMISA',
        cor: 'Azul/Vermelho',
        sport: 'Futebol',
        year: 2015,
        estoque: 7,
        ativo: true,
        ligaId: laLiga.id,
        timeId: barcelona.id
      },

      // Ligue 1
      {
        nome: 'Camisa PSG #10 Neymar Jr',
        tamanho: 'M',
        preco: 280.00,
        codigo: 'PSG001',
        descricao: 'Camisa do Paris Saint-Germain - Neymar Jr',
        sale: false,
        serie: 'Champions League 2024',
        categoria: 'CAMISA',
        cor: 'Azul',
        sport: 'Futebol',
        year: 2023,
        estoque: 15,
        ativo: true,
        ligaId: ligue1.id,
        timeId: psg.id
      },

      // Bundesliga
      {
        nome: 'Camisa Bayern Munich #9 Lewandowski',
        tamanho: 'L',
        preco: 320.00,
        codigo: 'BAY001',
        descricao: 'Camisa do Bayern Munich - Lewandowski',
        sale: true,
        serie: 'Bundesliga Champions',
        categoria: 'CAMISA',
        cor: 'Vermelho',
        sport: 'Futebol',
        year: 2021,
        estoque: 12,
        ativo: true,
        ligaId: bundesliga.id,
        timeId: bayernMunich.id
      }
    ]
  });

  console.log('🏀⚽ Produtos criados');
  console.log('🌟 Seed concluído com sucesso!');
  console.log(`🏆 ${await prisma.liga.count()} ligas criadas`);
  console.log(`⚽🏀 ${await prisma.time.count()} times criados`);
  console.log(`📊 ${produtos.count} produtos criados`);
  console.log('👨‍💼 1 admin e 1 cliente criados');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
