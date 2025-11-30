## 🔧 CONFIGURAÇÃO MYSQL - PASSO A PASSO

### 📋 **PRÉ-REQUISITOS**
1. ✅ MySQL instalado e rodando na porta 3306
2. ✅ MySQL Workbench instalado (mostrado na sua imagem)
3. ✅ Usuário root com acesso

### 🚀 **PASSO 1: Verificar MySQL**
```bash
# No PowerShell, verificar se MySQL está rodando:
Get-Service MySQL*
# Ou iniciar o serviço:
Start-Service MySQL80
```

### 🗄️ **PASSO 2: Criar banco via Workbench**
1. Abra o MySQL Workbench
2. Conecte na sua instância local
3. Execute este script:
```sql
CREATE DATABASE IF NOT EXISTS hallofjerseys 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE hallofjerseys;
SHOW TABLES;
```

### ⚙️ **PASSO 3: Configurar .env**
Edite o arquivo `.env`:
```env
# Para MySQL sem senha:
DATABASE_URL="mysql://root:@localhost:3306/hallofjerseys"

# Para MySQL com senha:
DATABASE_URL="mysql://root:sua_senha@localhost:3306/hallofjerseys"
```

### 🔄 **PASSO 4: Executar migração**
```bash
# 1. Gerar e aplicar migração
npx prisma migrate dev --name init_mysql

# 2. Gerar cliente
npx prisma generate

# 3. Verificar conexão
npx prisma db pull
```

### 🌱 **PASSO 5: Popular banco**
```bash
npx prisma db seed
```

### ❌ **RESOLUÇÃO DE PROBLEMAS**

**Erro: Can't reach database server**
- ✅ Verifique se MySQL está rodando: `Get-Service MySQL*`
- ✅ Teste conexão no Workbench primeiro
- ✅ Verifique porta no MySQL Workbench (3306)

**Erro: Access denied**
- ✅ Confirme usuário/senha no .env
- ✅ Teste login no Workbench com as mesmas credenciais

**Erro: Database doesn't exist**
- ✅ Crie o banco primeiro no Workbench
- ✅ Execute: `CREATE DATABASE hallofjerseys;`