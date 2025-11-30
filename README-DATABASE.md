# 🗄️ Guia de Banco de Dados - Hall of Jerseys

## Enviar Banco para Outra Pessoa

### Método 1: Usando Prisma (Recomendado) ⭐

**Vantagens:**
- Não depende de dump SQL
- Funciona em qualquer banco (MySQL, PostgreSQL, etc)
- Dados de exemplo incluídos

**Passos:**

1. **Você envia:**
   - `prisma/schema.prisma`
   - `prisma/seed.js`
   - `.env.example` (sem senhas)

2. **A outra pessoa configura:**
   ```bash
   # 1. Configurar .env com suas credenciais MySQL
   DATABASE_URL="mysql://root:senha@localhost:3306/hallofjerseys"
   
   # 2. Criar estrutura do banco
   npx prisma db push
   
   # 3. Popular com dados
   npx prisma db seed
   
   # 4. Gerar cliente Prisma
   npx prisma generate
   ```

---

### Método 2: Dump SQL (Backup Completo)

**Vantagens:**
- Backup completo com todos os dados
- Preserva IDs e relacionamentos

#### Exportar (Você)

```powershell
# Opção 1: Usando script
.\export-db.ps1

# Opção 2: Manual
mysqldump -u root --no-tablespaces hallofjerseys > backup.sql
```

#### Importar (Outra Pessoa)

```powershell
# Opção 1: Usando script
.\import-db.ps1 backup.sql

# Opção 2: Manual
mysql -u root -p
CREATE DATABASE hallofjerseys;
exit

mysql -u root -p hallofjerseys < backup.sql
```

Depois:
```bash
npx prisma generate
npm run dev
```

---

### Método 3: Migração via Git

**Para desenvolvimento em equipe:**

1. **Commitar schema:**
   ```bash
   git add prisma/
   git commit -m "feat: database schema"
   git push
   ```

2. **Outro desenvolvedor:**
   ```bash
   git pull
   npx prisma db push
   npx prisma db seed
   ```

---

## Configuração do MySQL

### Windows

1. **Baixar MySQL:**
   - https://dev.mysql.com/downloads/installer/

2. **Durante instalação:**
   - Escolher "Developer Default"
   - Definir senha root
   - Porta padrão: 3306

3. **Configurar .env:**
   ```env
   DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/hallofjerseys"
   ```

### Comandos Úteis

```bash
# Ver bancos
mysql -u root -p -e "SHOW DATABASES;"

# Criar banco
mysql -u root -p -e "CREATE DATABASE hallofjerseys;"

# Deletar banco
mysql -u root -p -e "DROP DATABASE hallofjerseys;"

# Ver tabelas
mysql -u root -p hallofjerseys -e "SHOW TABLES;"
```

---

## Estrutura do Banco

### Tabelas Principais

- **usuarios** - Usuários e administradores
- **produtos** - Produtos/jerseys
- **estoques_por_tamanho** - Estoque por tamanho
- **pedidos** - Pedidos dos clientes
- **itens_pedido** - Itens de cada pedido
- **ligas** - NBA, NFL, NHL, MLS
- **times** - Times de cada liga
- **cores** - Cores dos produtos
- **tamanhos** - P, M, G, GG, XG, 2XG

### Dados do Seed

Quando executa `npx prisma db seed`:

- ✅ 27 estados brasileiros
- ✅ 4 ligas (NBA, NFL, NHL, MLS)
- ✅ 123 times
- ✅ 12 cores
- ✅ 6 tamanhos
- ✅ 5 produtos exemplo
- ✅ 2 usuários:
  - **Admin:** admin@hallofjerseyscom / admin123
  - **User:** joao@email.com / user123

---

## Troubleshooting

### "Access denied for user"
```bash
# Resetar senha do root
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nova_senha';
FLUSH PRIVILEGES;
```

### "Unknown database"
```bash
# Criar banco manualmente
mysql -u root -p -e "CREATE DATABASE hallofjerseys;"
```

### "Table already exists"
```bash
# Recriar do zero
npx prisma db push --force-reset
npx prisma db seed
```

### "Can't connect to MySQL server"
- Verificar se MySQL está rodando
- Verificar porta no .env (padrão: 3306)
- Verificar firewall

---

## Migração SQLite → MySQL

Se estava usando SQLite:

1. **Exportar dados do SQLite:**
   ```bash
   npx prisma db seed  # Dados estão no seed.js
   ```

2. **Atualizar schema.prisma:**
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Configurar MySQL no .env:**
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/hallofjerseys"
   ```

4. **Criar estrutura:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

---

## Contatos

Para dúvidas sobre o banco de dados, consulte a documentação do Prisma:
- https://www.prisma.io/docs
