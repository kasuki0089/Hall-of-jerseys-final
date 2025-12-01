const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEstados() {
  try {
    const estados = await prisma.estado.findMany();
    console.log('Estados no banco:', estados);
    
    if (estados.length === 0) {
      console.log('\n⚠️ Não há estados cadastrados!');
      console.log('Criando estados...');
      
      const estadosBrasileiros = [
        { uf: 'AC', nome: 'Acre' },
        { uf: 'AL', nome: 'Alagoas' },
        { uf: 'AP', nome: 'Amapá' },
        { uf: 'AM', nome: 'Amazonas' },
        { uf: 'BA', nome: 'Bahia' },
        { uf: 'CE', nome: 'Ceará' },
        { uf: 'DF', nome: 'Distrito Federal' },
        { uf: 'ES', nome: 'Espírito Santo' },
        { uf: 'GO', nome: 'Goiás' },
        { uf: 'MA', nome: 'Maranhão' },
        { uf: 'MT', nome: 'Mato Grosso' },
        { uf: 'MS', nome: 'Mato Grosso do Sul' },
        { uf: 'MG', nome: 'Minas Gerais' },
        { uf: 'PA', nome: 'Pará' },
        { uf: 'PB', nome: 'Paraíba' },
        { uf: 'PR', nome: 'Paraná' },
        { uf: 'PE', nome: 'Pernambuco' },
        { uf: 'PI', nome: 'Piauí' },
        { uf: 'RJ', nome: 'Rio de Janeiro' },
        { uf: 'RN', nome: 'Rio Grande do Norte' },
        { uf: 'RS', nome: 'Rio Grande do Sul' },
        { uf: 'RO', nome: 'Rondônia' },
        { uf: 'RR', nome: 'Roraima' },
        { uf: 'SC', nome: 'Santa Catarina' },
        { uf: 'SP', nome: 'São Paulo' },
        { uf: 'SE', nome: 'Sergipe' },
        { uf: 'TO', nome: 'Tocantins' }
      ];
      
      await prisma.estado.createMany({
        data: estadosBrasileiros
      });
      
      console.log('✅ Estados criados com sucesso!');
    } else {
      console.log(`✅ Existem ${estados.length} estados cadastrados`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEstados();
