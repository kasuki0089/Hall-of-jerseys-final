const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function adicionarLigasETimes() {
  try {
    console.log('🏈 Adicionando ligas e times básicos...');

    // Verificar se ligas já existem
    const ligasExistentes = await prisma.liga.findMany();
    
    if (ligasExistentes.length === 0) {
      // Criar ligas
      await prisma.liga.createMany({
        data: [
          { nome: 'National Football League', sigla: 'NFL' },
          { nome: 'National Basketball Association', sigla: 'NBA' },
          { nome: 'National Hockey League', sigla: 'NHL' },
          { nome: 'Major League Soccer', sigla: 'MLS' }
        ]
      });
      console.log('✅ Ligas criadas');
    } else {
      console.log('ℹ️  Ligas já existem, limpando e recriando...');
      // Limpar ligas e times existentes
      await prisma.time.deleteMany();
      await prisma.liga.deleteMany();
      
      // Criar ligas
      await prisma.liga.createMany({
        data: [
          { nome: 'National Football League', sigla: 'NFL' },
          { nome: 'National Basketball Association', sigla: 'NBA' },
          { nome: 'National Hockey League', sigla: 'NHL' },
          { nome: 'Major League Soccer', sigla: 'MLS' }
        ]
      });
      console.log('✅ Ligas recriadas');
    }

    // Buscar as ligas criadas para pegar os IDs
    const ligasDB = await prisma.liga.findMany();

    // Criar times por liga
    const times = [];

    // NFL Times (32 times)
    const nfl = ligasDB.find(l => l.sigla === 'NFL');
    if (nfl) {
      times.push(
        // AFC East
        { nome: 'Buffalo Bills', sigla: 'BUF', cidade: 'Buffalo', ligaId: nfl.id },
        { nome: 'Miami Dolphins', sigla: 'MIA', cidade: 'Miami', ligaId: nfl.id },
        { nome: 'New England Patriots', sigla: 'NE', cidade: 'Boston', ligaId: nfl.id },
        { nome: 'New York Jets', sigla: 'NYJ', cidade: 'New York', ligaId: nfl.id },
        // AFC North
        { nome: 'Baltimore Ravens', sigla: 'BAL', cidade: 'Baltimore', ligaId: nfl.id },
        { nome: 'Cincinnati Bengals', sigla: 'CIN', cidade: 'Cincinnati', ligaId: nfl.id },
        { nome: 'Cleveland Browns', sigla: 'CLE', cidade: 'Cleveland', ligaId: nfl.id },
        { nome: 'Pittsburgh Steelers', sigla: 'PIT', cidade: 'Pittsburgh', ligaId: nfl.id },
        // AFC South
        { nome: 'Houston Texans', sigla: 'HOU', cidade: 'Houston', ligaId: nfl.id },
        { nome: 'Indianapolis Colts', sigla: 'IND', cidade: 'Indianapolis', ligaId: nfl.id },
        { nome: 'Jacksonville Jaguars', sigla: 'JAX', cidade: 'Jacksonville', ligaId: nfl.id },
        { nome: 'Tennessee Titans', sigla: 'TEN', cidade: 'Nashville', ligaId: nfl.id },
        // AFC West
        { nome: 'Denver Broncos', sigla: 'DEN', cidade: 'Denver', ligaId: nfl.id },
        { nome: 'Kansas City Chiefs', sigla: 'KC', cidade: 'Kansas City', ligaId: nfl.id },
        { nome: 'Las Vegas Raiders', sigla: 'LV', cidade: 'Las Vegas', ligaId: nfl.id },
        { nome: 'Los Angeles Chargers', sigla: 'LAC', cidade: 'Los Angeles', ligaId: nfl.id },
        // NFC East
        { nome: 'Dallas Cowboys', sigla: 'DAL', cidade: 'Dallas', ligaId: nfl.id },
        { nome: 'New York Giants', sigla: 'NYG', cidade: 'New York', ligaId: nfl.id },
        { nome: 'Philadelphia Eagles', sigla: 'PHI', cidade: 'Philadelphia', ligaId: nfl.id },
        { nome: 'Washington Commanders', sigla: 'WAS', cidade: 'Washington', ligaId: nfl.id },
        // NFC North
        { nome: 'Chicago Bears', sigla: 'CHI', cidade: 'Chicago', ligaId: nfl.id },
        { nome: 'Detroit Lions', sigla: 'DET', cidade: 'Detroit', ligaId: nfl.id },
        { nome: 'Green Bay Packers', sigla: 'GB', cidade: 'Green Bay', ligaId: nfl.id },
        { nome: 'Minnesota Vikings', sigla: 'MIN', cidade: 'Minneapolis', ligaId: nfl.id },
        // NFC South
        { nome: 'Atlanta Falcons', sigla: 'ATL', cidade: 'Atlanta', ligaId: nfl.id },
        { nome: 'Carolina Panthers', sigla: 'CAR', cidade: 'Charlotte', ligaId: nfl.id },
        { nome: 'New Orleans Saints', sigla: 'NO', cidade: 'New Orleans', ligaId: nfl.id },
        { nome: 'Tampa Bay Buccaneers', sigla: 'TB', cidade: 'Tampa Bay', ligaId: nfl.id },
        // NFC West
        { nome: 'Arizona Cardinals', sigla: 'ARI', cidade: 'Phoenix', ligaId: nfl.id },
        { nome: 'Los Angeles Rams', sigla: 'LAR', cidade: 'Los Angeles', ligaId: nfl.id },
        { nome: 'San Francisco 49ers', sigla: 'SF', cidade: 'San Francisco', ligaId: nfl.id },
        { nome: 'Seattle Seahawks', sigla: 'SEA', cidade: 'Seattle', ligaId: nfl.id }
      );
    }

    // NBA Times (30 times)
    const nba = ligasDB.find(l => l.sigla === 'NBA');
    if (nba) {
      times.push(
        // Eastern Conference - Atlantic
        { nome: 'Boston Celtics', sigla: 'BOS', cidade: 'Boston', ligaId: nba.id },
        { nome: 'Brooklyn Nets', sigla: 'BKN', cidade: 'Brooklyn', ligaId: nba.id },
        { nome: 'New York Knicks', sigla: 'NYK', cidade: 'New York', ligaId: nba.id },
        { nome: 'Philadelphia 76ers', sigla: 'PHI', cidade: 'Philadelphia', ligaId: nba.id },
        { nome: 'Toronto Raptors', sigla: 'TOR', cidade: 'Toronto', ligaId: nba.id },
        // Eastern Conference - Central
        { nome: 'Chicago Bulls', sigla: 'CHI', cidade: 'Chicago', ligaId: nba.id },
        { nome: 'Cleveland Cavaliers', sigla: 'CLE', cidade: 'Cleveland', ligaId: nba.id },
        { nome: 'Detroit Pistons', sigla: 'DET', cidade: 'Detroit', ligaId: nba.id },
        { nome: 'Indiana Pacers', sigla: 'IND', cidade: 'Indianapolis', ligaId: nba.id },
        { nome: 'Milwaukee Bucks', sigla: 'MIL', cidade: 'Milwaukee', ligaId: nba.id },
        // Eastern Conference - Southeast
        { nome: 'Atlanta Hawks', sigla: 'ATL', cidade: 'Atlanta', ligaId: nba.id },
        { nome: 'Charlotte Hornets', sigla: 'CHA', cidade: 'Charlotte', ligaId: nba.id },
        { nome: 'Miami Heat', sigla: 'MIA', cidade: 'Miami', ligaId: nba.id },
        { nome: 'Orlando Magic', sigla: 'ORL', cidade: 'Orlando', ligaId: nba.id },
        { nome: 'Washington Wizards', sigla: 'WAS', cidade: 'Washington', ligaId: nba.id },
        // Western Conference - Northwest
        { nome: 'Denver Nuggets', sigla: 'DEN', cidade: 'Denver', ligaId: nba.id },
        { nome: 'Minnesota Timberwolves', sigla: 'MIN', cidade: 'Minneapolis', ligaId: nba.id },
        { nome: 'Oklahoma City Thunder', sigla: 'OKC', cidade: 'Oklahoma City', ligaId: nba.id },
        { nome: 'Portland Trail Blazers', sigla: 'POR', cidade: 'Portland', ligaId: nba.id },
        { nome: 'Utah Jazz', sigla: 'UTA', cidade: 'Salt Lake City', ligaId: nba.id },
        // Western Conference - Pacific
        { nome: 'Golden State Warriors', sigla: 'GSW', cidade: 'San Francisco', ligaId: nba.id },
        { nome: 'Los Angeles Clippers', sigla: 'LAC', cidade: 'Los Angeles', ligaId: nba.id },
        { nome: 'Los Angeles Lakers', sigla: 'LAL', cidade: 'Los Angeles', ligaId: nba.id },
        { nome: 'Phoenix Suns', sigla: 'PHX', cidade: 'Phoenix', ligaId: nba.id },
        { nome: 'Sacramento Kings', sigla: 'SAC', cidade: 'Sacramento', ligaId: nba.id },
        // Western Conference - Southwest
        { nome: 'Dallas Mavericks', sigla: 'DAL', cidade: 'Dallas', ligaId: nba.id },
        { nome: 'Houston Rockets', sigla: 'HOU', cidade: 'Houston', ligaId: nba.id },
        { nome: 'Memphis Grizzlies', sigla: 'MEM', cidade: 'Memphis', ligaId: nba.id },
        { nome: 'New Orleans Pelicans', sigla: 'NOP', cidade: 'New Orleans', ligaId: nba.id },
        { nome: 'San Antonio Spurs', sigla: 'SA', cidade: 'San Antonio', ligaId: nba.id }
      );
    }

    // NHL Times (32 times)
    const nhl = ligasDB.find(l => l.sigla === 'NHL');
    if (nhl) {
      times.push(
        // Eastern Conference - Atlantic
        { nome: 'Boston Bruins', sigla: 'BOS', cidade: 'Boston', ligaId: nhl.id },
        { nome: 'Buffalo Sabres', sigla: 'BUF', cidade: 'Buffalo', ligaId: nhl.id },
        { nome: 'Detroit Red Wings', sigla: 'DET', cidade: 'Detroit', ligaId: nhl.id },
        { nome: 'Florida Panthers', sigla: 'FLA', cidade: 'Sunrise', ligaId: nhl.id },
        { nome: 'Montreal Canadiens', sigla: 'MTL', cidade: 'Montreal', ligaId: nhl.id },
        { nome: 'Ottawa Senators', sigla: 'OTT', cidade: 'Ottawa', ligaId: nhl.id },
        { nome: 'Tampa Bay Lightning', sigla: 'TB', cidade: 'Tampa', ligaId: nhl.id },
        { nome: 'Toronto Maple Leafs', sigla: 'TOR', cidade: 'Toronto', ligaId: nhl.id },
        // Eastern Conference - Metropolitan
        { nome: 'Carolina Hurricanes', sigla: 'CAR', cidade: 'Raleigh', ligaId: nhl.id },
        { nome: 'Columbus Blue Jackets', sigla: 'CBJ', cidade: 'Columbus', ligaId: nhl.id },
        { nome: 'New Jersey Devils', sigla: 'NJ', cidade: 'Newark', ligaId: nhl.id },
        { nome: 'New York Islanders', sigla: 'NYI', cidade: 'Elmont', ligaId: nhl.id },
        { nome: 'New York Rangers', sigla: 'NYR', cidade: 'New York', ligaId: nhl.id },
        { nome: 'Philadelphia Flyers', sigla: 'PHI', cidade: 'Philadelphia', ligaId: nhl.id },
        { nome: 'Pittsburgh Penguins', sigla: 'PIT', cidade: 'Pittsburgh', ligaId: nhl.id },
        { nome: 'Washington Capitals', sigla: 'WSH', cidade: 'Washington', ligaId: nhl.id },
        // Western Conference - Central
        { nome: 'Chicago Blackhawks', sigla: 'CHI', cidade: 'Chicago', ligaId: nhl.id },
        { nome: 'Colorado Avalanche', sigla: 'COL', cidade: 'Denver', ligaId: nhl.id },
        { nome: 'Dallas Stars', sigla: 'DAL', cidade: 'Dallas', ligaId: nhl.id },
        { nome: 'Minnesota Wild', sigla: 'MIN', cidade: 'Saint Paul', ligaId: nhl.id },
        { nome: 'Nashville Predators', sigla: 'NSH', cidade: 'Nashville', ligaId: nhl.id },
        { nome: 'St. Louis Blues', sigla: 'STL', cidade: 'St. Louis', ligaId: nhl.id },
        { nome: 'Utah Hockey Club', sigla: 'UTA', cidade: 'Salt Lake City', ligaId: nhl.id },
        { nome: 'Winnipeg Jets', sigla: 'WPG', cidade: 'Winnipeg', ligaId: nhl.id },
        // Western Conference - Pacific
        { nome: 'Anaheim Ducks', sigla: 'ANA', cidade: 'Anaheim', ligaId: nhl.id },
        { nome: 'Calgary Flames', sigla: 'CGY', cidade: 'Calgary', ligaId: nhl.id },
        { nome: 'Edmonton Oilers', sigla: 'EDM', cidade: 'Edmonton', ligaId: nhl.id },
        { nome: 'Los Angeles Kings', sigla: 'LA', cidade: 'Los Angeles', ligaId: nhl.id },
        { nome: 'San Jose Sharks', sigla: 'SJ', cidade: 'San Jose', ligaId: nhl.id },
        { nome: 'Seattle Kraken', sigla: 'SEA', cidade: 'Seattle', ligaId: nhl.id },
        { nome: 'Vancouver Canucks', sigla: 'VAN', cidade: 'Vancouver', ligaId: nhl.id },
        { nome: 'Vegas Golden Knights', sigla: 'VGK', cidade: 'Las Vegas', ligaId: nhl.id }
      );
    }

    // MLS Times (30 times)
    const mls = ligasDB.find(l => l.sigla === 'MLS');
    if (mls) {
      times.push(
        // Eastern Conference
        { nome: 'Atlanta United FC', sigla: 'ATL', cidade: 'Atlanta', ligaId: mls.id },
        { nome: 'Charlotte FC', sigla: 'CLT', cidade: 'Charlotte', ligaId: mls.id },
        { nome: 'Chicago Fire FC', sigla: 'CHI', cidade: 'Chicago', ligaId: mls.id },
        { nome: 'FC Cincinnati', sigla: 'CIN', cidade: 'Cincinnati', ligaId: mls.id },
        { nome: 'Columbus Crew', sigla: 'CLB', cidade: 'Columbus', ligaId: mls.id },
        { nome: 'D.C. United', sigla: 'DC', cidade: 'Washington', ligaId: mls.id },
        { nome: 'Inter Miami CF', sigla: 'MIA', cidade: 'Miami', ligaId: mls.id },
        { nome: 'Nashville SC', sigla: 'NSH', cidade: 'Nashville', ligaId: mls.id },
        { nome: 'New England Revolution', sigla: 'NE', cidade: 'Boston', ligaId: mls.id },
        { nome: 'New York City FC', sigla: 'NYC', cidade: 'New York', ligaId: mls.id },
        { nome: 'New York Red Bulls', sigla: 'NY', cidade: 'New York', ligaId: mls.id },
        { nome: 'Orlando City SC', sigla: 'ORL', cidade: 'Orlando', ligaId: mls.id },
        { nome: 'Philadelphia Union', sigla: 'PHI', cidade: 'Philadelphia', ligaId: mls.id },
        { nome: 'Toronto FC', sigla: 'TOR', cidade: 'Toronto', ligaId: mls.id },
        { nome: 'CF Montréal', sigla: 'MTL', cidade: 'Montreal', ligaId: mls.id },
        // Western Conference
        { nome: 'Austin FC', sigla: 'ATX', cidade: 'Austin', ligaId: mls.id },
        { nome: 'Colorado Rapids', sigla: 'COL', cidade: 'Denver', ligaId: mls.id },
        { nome: 'FC Dallas', sigla: 'DAL', cidade: 'Dallas', ligaId: mls.id },
        { nome: 'Houston Dynamo FC', sigla: 'HOU', cidade: 'Houston', ligaId: mls.id },
        { nome: 'LA Galaxy', sigla: 'LA', cidade: 'Los Angeles', ligaId: mls.id },
        { nome: 'Los Angeles FC', sigla: 'LAFC', cidade: 'Los Angeles', ligaId: mls.id },
        { nome: 'Minnesota United FC', sigla: 'MIN', cidade: 'Minneapolis', ligaId: mls.id },
        { nome: 'Portland Timbers', sigla: 'POR', cidade: 'Portland', ligaId: mls.id },
        { nome: 'Real Salt Lake', sigla: 'RSL', cidade: 'Salt Lake City', ligaId: mls.id },
        { nome: 'San Jose Earthquakes', sigla: 'SJ', cidade: 'San Jose', ligaId: mls.id },
        { nome: 'Seattle Sounders FC', sigla: 'SEA', cidade: 'Seattle', ligaId: mls.id },
        { nome: 'Sporting Kansas City', sigla: 'SKC', cidade: 'Kansas City', ligaId: mls.id },
        { nome: 'St. Louis CITY SC', sigla: 'STL', cidade: 'St. Louis', ligaId: mls.id },
        { nome: 'Vancouver Whitecaps FC', sigla: 'VAN', cidade: 'Vancouver', ligaId: mls.id },
        { nome: 'LAFC', sigla: 'LAFC', cidade: 'Los Angeles', ligaId: mls.id }
      );
    }

    // Verificar se times já existem
    const timesExistentes = await prisma.time.findMany();
    
    // Sempre criar os times (já limpos acima se necessário)
    await prisma.time.createMany({
      data: times
    });
    console.log(`✅ ${times.length} times criados`);

    console.log('');
    console.log('🏆 Ligas americanas disponíveis:');
    ligasDB.forEach(liga => {
      const timesLiga = times.filter(t => t.ligaId === liga.id);
      console.log(`  • ${liga.nome} (${liga.sigla}) - ${timesLiga.length} times`);
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

adicionarLigasETimes();