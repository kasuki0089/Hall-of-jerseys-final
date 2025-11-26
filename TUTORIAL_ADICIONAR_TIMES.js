/**
 * COMO ADICIONAR MAIS TIMES OU LIGAS
 * 
 * Este arquivo mostra como você pode adicionar novos times ou ligas ao sistema.
 * Existem duas maneiras principais:
 * 
 * 1. EDITANDO O ARQUIVO SEED.JS (para dados permanentes)
 * 2. USANDO SCRIPTS SEPARADOS (para adicionar dados específicos)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// =============================================================================
// MÉTODO 1: ADICIONANDO UMA NOVA LIGA (ex: Bundesliga)
// =============================================================================

async function adicionarNovaLiga() {
  // 1. Criar a liga
  const bundesliga = await prisma.liga.create({
    data: {
      nome: 'Bundesliga',
      sigla: 'BUN'
    }
  });

  // 2. Adicionar times da Bundesliga
  const timesBundesliga = [
    { nome: 'Bayern Munich', sigla: 'BAY', cidade: 'Munich' },
    { nome: 'Borussia Dortmund', sigla: 'BVB', cidade: 'Dortmund' },
    { nome: 'RB Leipzig', sigla: 'RBL', cidade: 'Leipzig' },
    { nome: 'Bayer Leverkusen', sigla: 'B04', cidade: 'Leverkusen' },
    { nome: 'Eintracht Frankfurt', sigla: 'SGE', cidade: 'Frankfurt' }
  ];

  for (const team of timesBundesliga) {
    await prisma.time.create({
      data: {
        ...team,
        ligaId: bundesliga.id
      }
    });
  }

  console.log(`✅ Liga ${bundesliga.nome} criada com ${timesBundesliga.length} times`);
}

// =============================================================================
// MÉTODO 2: ADICIONANDO TIMES A UMA LIGA EXISTENTE
// =============================================================================

async function adicionarTimesNFL() {
  // 1. Encontrar a liga NFL
  const nfl = await prisma.liga.findUnique({
    where: { sigla: 'NFL' }
  });

  if (!nfl) {
    console.error('Liga NFL não encontrada');
    return;
  }

  // 2. Adicionar mais times NFL
  const novosTimesNFL = [
    { nome: 'Buffalo Bills', sigla: 'BUF', cidade: 'Buffalo' },
    { nome: 'Miami Dolphins', sigla: 'MIA', cidade: 'Miami' },
    { nome: 'New York Jets', sigla: 'NYJ', cidade: 'New York' },
    { nome: 'Pittsburgh Steelers', sigla: 'PIT', cidade: 'Pittsburgh' },
    { nome: 'Baltimore Ravens', sigla: 'BAL', cidade: 'Baltimore' }
  ];

  for (const team of novosTimesNFL) {
    // Verificar se o time já existe
    const timeExistente = await prisma.time.findFirst({
      where: {
        sigla: team.sigla,
        ligaId: nfl.id
      }
    });

    if (!timeExistente) {
      await prisma.time.create({
        data: {
          ...team,
          ligaId: nfl.id
        }
      });
      console.log(`✅ Time ${team.nome} adicionado à NFL`);
    } else {
      console.log(`⚠️  Time ${team.nome} já existe`);
    }
  }
}

// =============================================================================
// MÉTODO 3: FUNÇÃO PARA LISTAR TIMES POR LIGA
// =============================================================================

async function listarTimesPorLiga(siglaLiga) {
  const times = await prisma.time.findMany({
    where: {
      liga: {
        sigla: siglaLiga
      }
    },
    include: {
      liga: true
    },
    orderBy: {
      nome: 'asc'
    }
  });

  console.log(`\n📊 TIMES DA ${siglaLiga}: ${times.length}`);
  console.log('=' + '='.repeat(50));
  
  times.forEach((team, i) => {
    console.log(`${(i + 1).toString().padStart(2)}. ${team.nome} (${team.sigla}) - ${team.cidade}`);
  });
}

// =============================================================================
// COMO USAR ESTE ARQUIVO:
// =============================================================================

async function exemploDeUso() {
  try {
    console.log('🚀 Iniciando exemplo de adição de times/ligas...\n');
    
    // Exemplo 1: Adicionar nova liga
    // await adicionarNovaLiga();
    
    // Exemplo 2: Adicionar times a liga existente
    // await adicionarTimesNFL();
    
    // Exemplo 3: Listar times
    await listarTimesPorLiga('NBA');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Descomentar a linha abaixo para executar
// exemploDeUso();

module.exports = {
  adicionarNovaLiga,
  adicionarTimesNFL,
  listarTimesPorLiga
};