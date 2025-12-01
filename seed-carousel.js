const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedCarousel() {
  console.log('🎠 Adicionando carousels iniciais...');

  const carousels = [
    {
      titulo: 'NBA - Basquete Profissional',
      descricao: 'Os melhores jerseys da temporada da NBA',
      imagemUrl: '/images/Carousel/nba.jpeg',
      linkUrl: '/produtos?liga=NBA',
      ativo: true,
      ordem: 0
    },
    {
      titulo: 'NFL - Football Americano',
      descricao: 'Equipamentos oficiais dos times da NFL',
      imagemUrl: '/images/Carousel/nfl.jpeg',
      linkUrl: '/produtos?liga=NFL',
      ativo: true,
      ordem: 1
    },
    {
      titulo: 'NHL - Hockey no Gelo',
      descricao: 'Jerseys autênticos da NHL',
      imagemUrl: '/images/Carousel/nhl.jpeg',
      linkUrl: '/produtos?liga=NHL',
      ativo: true,
      ordem: 2
    },
    {
      titulo: 'MLS - Major League Soccer',
      descricao: 'Camisas dos melhores times de futebol americano',
      imagemUrl: '/images/Carousel/mls.jpeg',
      linkUrl: '/produtos?liga=MLS',
      ativo: true,
      ordem: 3
    }
  ];

  try {
    // Limpar carousels existentes
    await prisma.carousel.deleteMany();
    console.log('🗑️ Carousels existentes removidos');

    // Adicionar novos carousels
    for (const carousel of carousels) {
      await prisma.carousel.create({
        data: carousel
      });
      console.log(`✅ Carousel adicionado: ${carousel.titulo}`);
    }

    console.log('🎉 Carousels adicionados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao adicionar carousels:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se o arquivo for chamado diretamente
if (require.main === module) {
  seedCarousel()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

module.exports = { seedCarousel };