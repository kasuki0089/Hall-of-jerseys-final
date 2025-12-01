// Script para testar cadastro de usuário
const testCadastro = async () => {
  const dadosTeste = {
    nome: 'Teste Usuario',
    email: `teste${Date.now()}@email.com`,
    senha: '123456',
    telefone: '+55 (11) 99999-9999',
    cpf: '123.456.789-00',
    dataNascimento: new Date('1990-01-01').toISOString(),
    endereco: {
      endereco: 'Rua Teste',
      numero: '123',
      complemento: 'Apto 1',
      bairro: 'Centro',
      cidade: 'São Paulo',
      cep: '01234-567',
      estadoUf: 'SP'
    }
  };

  console.log('📝 Testando cadastro com dados:', dadosTeste);

  try {
    const response = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosTeste),
    });

    const result = await response.json();
    
    console.log('\n📊 Status:', response.status);
    console.log('📋 Resposta:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ CADASTRO REALIZADO COM SUCESSO!');
    } else {
      console.log('\n❌ ERRO NO CADASTRO!');
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
};

testCadastro();
