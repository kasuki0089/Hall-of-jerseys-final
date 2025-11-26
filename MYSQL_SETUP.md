# 🐬 Configuração MySQL - Hall of Jerseys

## 📋 Pré-requisitos

### 1. Instalar MySQL
**Windows:**
- Baixe MySQL Community Server: https://dev.mysql.com/downloads/mysql/
- Ou via Chocolatey: `choco install mysql`
- Ou XAMPP: https://www.apachefriends.org/

**Verificar instalação:**
```bash
mysql --version
```

### 2. Configurar Banco de Dados

**Conectar ao MySQL:**
```bash
mysql -u root -p
```

**Criar banco e usuário:**
```sql
-- Criar banco de dados
CREATE DATABASE hall_of_jerseys;

-- Criar usuário (opcional, para segurança)
CREATE USER 'halluser'@'localhost' IDENTIFIED BY 'senha123';

-- Dar permissões
GRANT ALL PRIVILEGES ON hall_of_jerseys.* TO 'halluser'@'localhost';
FLUSH PRIVILEGES;

-- Verificar
SHOW DATABASES;
USE hall_of_jerseys;
```

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env` com suas credenciais:

```env
# Opção 1: Usuário root
DATABASE_URL="mysql://root:sua_senha@localhost:3306/hall_of_jerseys"

# Opção 2: Usuário específico
DATABASE_URL="mysql://halluser:senha123@localhost:3306/hall_of_jerseys"

# Opção 3: XAMPP (sem senha)
DATABASE_URL="mysql://root:@localhost:3306/hall_of_jerseys"
```

### 4. Executar Migrações

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar schema ao banco
npx prisma db push

# Executar seed (popular dados)
npx prisma db seed

# Visualizar dados
npx prisma studio
```

## 🔧 Comandos Úteis

### MySQL Workbench
- Ferramenta visual para MySQL
- Download: https://dev.mysql.com/downloads/workbench/
- Ideal para visualizar DER automaticamente

### Troubleshooting

**Erro de conexão:**
```bash
# Verificar se MySQL está rodando
net start mysql80
# ou
service mysql start
```

**Resetar banco:**
```bash
npx prisma migrate reset
npx prisma db push
npx prisma db seed
```

**Ver schema atual:**
```bash
npx prisma db pull
```

## 📊 Gerando DER com MySQL Workbench

1. Abra MySQL Workbench
2. Conecte ao seu banco `hall_of_jerseys`
3. Database → Reverse Engineer
4. Selecione as tabelas
5. Gere o DER automaticamente

## 🎯 Próximos Passos

Após configurar o MySQL:
1. Execute: `npx prisma db push`
2. Execute: `npx prisma db seed`
3. Inicie o servidor: `npm run dev`
4. Acesse: http://localhost:3000/admin