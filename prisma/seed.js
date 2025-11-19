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
        preco: 35000, // R$ 350,00
        codigo: 1001,
        descricao: 'Jersey oficial dos Lakers - Kobe Bryant Legends Edition',
        sale: true,
        serie: 'Legends Collection',
        categoria: 'JERSEY',
        ligaId: nba.id,
        timeId: lakers.id
      },
      {
        nome: 'Jersey Warriors #30 Stephen Curry',
        tamanho: 'G',
        preco: 32000, // R$ 320,00
        codigo: 1002,
        descricao: 'Jersey atual do Golden State Warriors',
        sale: false,
        serie: 'Current Season 2024',
        categoria: 'JERSEY',
        ligaId: nba.id,
        timeId: warriors.id
      },
      {
        nome: 'Jersey Heat #6 LeBron James',
        tamanho: 'L',
        preco: 30000, // R$ 300,00
        codigo: 1003,
        descricao: 'Jersey histórica do Miami Heat era Championship',
        sale: true,
        serie: 'Championship Era',
        categoria: 'JERSEY',
        ligaId: nba.id,
        timeId: heat.id
      },
      {
        nome: 'Jersey Bulls #23 Michael Jordan',
        tamanho: 'M',
        preco: 45000, // R$ 450,00
        codigo: 1004,
        descricao: 'Jersey lendária do Chicago Bulls - Michael Jordan',
        sale: false,
        serie: 'Legends Collection',
        categoria: 'JERSEY',
        ligaId: nba.id,
        timeId: bulls.id
      },
      {
        nome: 'Jersey Celtics #33 Larry Bird',
        tamanho: 'G',
        preco: 38000, // R$ 380,00
        codigo: 1005,
        descricao: 'Jersey retrô do Boston Celtics',
        sale: true,
        serie: 'Retro Collection',
        categoria: 'JERSEY',
        ligaId: nba.id,
        timeId: celtics.id
      },

      // Camisas Brasileirão
      {
        nome: 'Camisa Flamengo #10 Zico',
        tamanho: 'M',
        preco: 22000, // R$ 220,00
        codigo: 2001,
        descricao: 'Camisa retrô do Flamengo - Zico',
        sale: false,
        serie: 'Brasileirão Legends',
        categoria: 'CAMISA',
        ligaId: brasileirao.id,
        timeId: flamengo.id
      },
      {
        nome: 'Camisa Palmeiras Home 2024',
        tamanho: 'G',
        preco: 25000, // R$ 250,00
        codigo: 2002,
        descricao: 'Camisa oficial do Palmeiras temporada 2024',
        sale: false,
        serie: 'Temporada 2024',
        categoria: 'CAMISA',
        ligaId: brasileirao.id,
        timeId: palmeiras.id
      },
      {
        nome: 'Camisa Corinthians Away 2024',
        tamanho: 'M',
        preco: 24000, // R$ 240,00
        codigo: 2003,
        descricao: 'Camisa visitante do Corinthians',
        sale: true,
        serie: 'Temporada 2024',
        categoria: 'CAMISA',
        ligaId: brasileirao.id,
        timeId: corinthians.id
      },

      // Camisas Europeias
      {
        nome: 'Camisa PSG #10 Neymar Jr',
        tamanho: 'M',
        preco: 28000, // R$ 280,00
        codigo: 3001,
        descricao: 'Camisa do Paris Saint-Germain - Neymar Jr',
        sale: false,
        serie: 'Champions League 2024',
        categoria: 'CAMISA',
        ligaId: champions.id,
        timeId: psg.id
      },
      {
        nome: 'Camisa Barcelona #10 Messi Retro',
        tamanho: 'G',
        preco: 35000, // R$ 350,00
        codigo: 3002,
        descricao: 'Camisa histórica do Barcelona - Messi',
        sale: true,
        serie: 'Legends Collection',
        categoria: 'CAMISA',
        ligaId: champions.id,
        timeId: barcelona.id
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
