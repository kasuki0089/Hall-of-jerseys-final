# 📊 Nova Estrutura do Banco de Dados - Hall of Jerseys

## 🎯 Resumo das Mudanças

### ✅ Normalizações Implementadas

**1. Produto**
- ➕ Adicionado campo `modelo` (Jersey Home, Jersey Away, Regata, etc.)
- ❌ Removido campo `sport` 
- 🔗 `cor` agora é FK para tabela `cores`
- 🔗 `tamanho` agora é FK para tabela `tamanhos`

**2. Usuário & Endereço**
- 📍 `endereco` normalizado em tabela separada com campos completos
- 🏢 Estados como tabela própria (UF como PK)
- 🔗 Usuario referencia Endereco via FK

**3. Formas de Pagamento**
- 💳 Nova tabela `formas_pagamento` vinculada ao usuário
- 🔒 Armazena dados de cartão de forma segura (apenas últimos 4 dígitos)
- 🎯 Suporte a múltiplos tipos: cartão_credito, cartão_debito, pix, boleto

**4. Ligas Simplificadas**
- 🏀 NBA (National Basketball Association)
- 🏈 NFL (National Football League) 
- 🏒 NHL (National Hockey League)
- ⚽ MLS (Major League Soccer)

---

## 📋 Estrutura Detalhada

### 🗺️ **Estados**
```sql
estados:
  - uf (PK, VARCHAR(2))
  - nome
```

### 🏠 **Endereços** 
```sql
enderecos:
  - id (PK)
  - endereco
  - numero  
  - complemento
  - bairro
  - cidade
  - cep
  - estadoUf (FK → estados.uf)
```

### 🎨 **Cores**
```sql
cores:
  - id (PK)
  - nome (unique)
  - codigo (hex color, ex: #FFFFFF)
```

### 👕 **Tamanhos**
```sql
tamanhos:
  - id (PK)
  - nome (unique: PP, P, M, G, GG, XGG)
  - ordem (para ordenação: 1, 2, 3...)
```

### 💳 **Formas de Pagamento**
```sql
formas_pagamento:
  - id (PK)
  - tipo (cartao_credito, cartao_debito, pix, boleto)
  - numeroCartao (apenas últimos 4 dígitos)
  - nomeCartao
  - validadeCartao (MM/YYYY)
  - bandeiraCartao (Visa, Mastercard, etc)
  - usuarioId (FK → usuarios.id)
  - ativo
  - criadoEm
```

### 🏆 **Ligas**
```sql
ligas:
  - id (PK)
  - nome (unique)
  - sigla (unique: NBA, NFL, NHL, MLS)
```

### 🏟️ **Times**
```sql
times:
  - id (PK)
  - nome
  - sigla
  - cidade
  - ligaId (FK → ligas.id)
```

### 👕 **Produtos** (ATUALIZADO)
```sql
produtos:
  - id (PK)
  - nome
  - codigo (unique)
  - descricao
  - modelo ✨ (Jersey Home, Jersey Away, Regata, etc)
  - preco
  - year
  - serie (Home, Away, Third, Special Edition)
  - estoque
  - ativo
  - sale
  - imagemUrl
  - criadoEm, atualizadoEm
  - ligaId (FK → ligas.id)
  - timeId (FK → times.id, optional)
  - corId (FK → cores.id) ✨
  - tamanhoId (FK → tamanhos.id) ✨
```

### 👤 **Usuários** (ATUALIZADO)
```sql
usuarios:
  - id (PK)
  - nome
  - email (unique)
  - senha (hash)
  - telefone
  - role (user, admin)
  - criadoEm, atualizadoEm
  - enderecoId (FK → enderecos.id, optional) ✨
```

### 🛒 **Pedidos** (ATUALIZADO)
```sql
pedidos:
  - id (PK)
  - usuarioId (FK → usuarios.id)
  - total
  - status
  - criadoEm, atualizadoEm
  - formaPagamentoId (FK → formas_pagamento.id, optional) ✨
```

---

## 🚀 Próximos Passos

### 1. **Configurar MySQL**
Siga as instruções em `MYSQL_SETUP.md`:
- Instalar MySQL Community Server OU XAMPP
- Criar database `hall_of_jerseys`
- Configurar usuário e senha

### 2. **Executar Migração**
```bash
npx prisma db push
npx prisma db seed
```

### 3. **Dados de Exemplo Criados**
- **10 Estados brasileiros** principais
- **12 Cores** com códigos hex
- **6 Tamanhos** ordenados (PP → XGG)
- **4 Ligas** principais (NBA, NFL, NHL, MLS)
- **Times representativos** de cada liga
- **5 Produtos exemplo** com nova estrutura
- **2 Usuários** (admin e comum) com endereços
- **2 Formas de pagamento** exemplo

### 4. **Credenciais de Teste**
- **Admin**: admin@hallofjerseyscom / admin123
- **User**: joao@email.com / user123

---

## 💡 Benefícios da Normalização

✅ **Consistência**: Cores e tamanhos padronizados  
✅ **Escalabilidade**: Fácil adição de novos valores  
✅ **Flexibilidade**: Endereços completos e formas de pagamento múltiplas  
✅ **Segurança**: Dados de pagamento armazenados de forma segura  
✅ **Organização**: Estrutura clara e bem relacionada  

---

🎉 **Estrutura pronta para desenvolvimento!**