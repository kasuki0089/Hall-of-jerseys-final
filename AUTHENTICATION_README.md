# Hall of Jerseys - Sistema de Autenticação

Sistema completo de autenticação com NextAuth.js, incluindo login, cadastro e painel administrativo.

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- **Login com credenciais** (email/senha)
- **Cadastro de usuários** com validação
- **Sessões gerenciadas** pelo NextAuth.js
- **Redirecionamento baseado em roles**

### ✅ Tipos de Usuário
- **Cliente**: Acesso básico às funcionalidades da loja
- **Administrador**: Acesso total incluindo painel administrativo

### ✅ Páginas Criadas/Atualizadas

1. **Login (`/login`)**
   - Design moderno e responsivo
   - Validação de formulário
   - Redirecionamento automático por role
   - Link para cadastro

2. **Cadastro (`/cadastro`)**
   - Validação de senha e confirmação
   - Verificação de email único
   - Interface intuitiva

3. **Painel Administrativo (`/admin`)**
   - Dashboard com estatísticas
   - Gestão de usuários (visualizar, editar roles, excluir)
   - Seções para produtos e pedidos (estrutura pronta)
   - Acesso restrito a administradores

4. **Perfil do Usuário (`/perfil`)**
   - Edição de informações pessoais
   - Visualização do tipo de conta
   - Opções de segurança

### ✅ Components

1. **Navbar Atualizada**
   - Menu contextual baseado em autenticação
   - Dropdown do usuário com opções
   - Links para admin (apenas para administradores)
   - Botões de login/cadastro para visitantes

2. **NextAuthProvider**
   - Provider de sessão para toda aplicação

### ✅ APIs Implementadas

1. **Autenticação (`/api/auth/[...nextauth]`)**
   - Configuração do NextAuth
   - Provider de credenciais com bcrypt
   - Callbacks para JWT e sessão

2. **Cadastro de usuários (`/api/usuarios`)**
   - Hash de senhas com bcrypt
   - Validação de dados

3. **APIs Administrativas**:
   - `/api/admin/users` - Listar usuários
   - `/api/admin/users/[userId]` - Editar/deletar usuário
   - `/api/admin/products` - Listar produtos
   - `/api/admin/orders` - Listar pedidos

4. **Perfil (`/api/profile`)**
   - Atualização de dados do usuário

## 🔧 Configuração

### 1. Banco de Dados
Certifique-se de que o banco MySQL está configurado e rodando. O schema Prisma já está definido com as tabelas:
- `Usuario` (id, nome, email, senha, role)
- `Produto` (estrutura básica)
- `Pedido` (estrutura básica)

### 2. Variáveis de Ambiente
Crie um arquivo `.env` baseado no `.env.example`:

```bash
DATABASE_URL="mysql://usuario:senha@localhost:3306/hallofjerseys"
NEXTAUTH_SECRET="sua-chave-secreta-muito-segura-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Instalação e Setup

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Popular banco com dados iniciais (opcional)
npx prisma db seed

# Iniciar servidor de desenvolvimento
npm run dev
```

## 👥 Usuários Padrão (após seed)

**Administrador:**
- Email: `admin@hallofjerseys.com`
- Senha: `admin123`

**Cliente de Teste:**
- Email: `cliente@hallofjerseys.com` 
- Senha: `cliente123`

## 🛠 Como Usar

### Para Clientes:
1. Acesse `/cadastro` para criar uma conta
2. Faça login em `/login`
3. Acesse `/perfil` para gerenciar suas informações
4. Navigate pela loja normalmente

### Para Administradores:
1. Faça login com conta de administrador
2. Acesse `/admin` através do menu do usuário
3. Gerencie usuários, produtos e pedidos
4. Visualize estatísticas do sistema

## 🔐 Segurança Implementada

- ✅ Hash de senhas com bcrypt
- ✅ Validação de sessões server-side
- ✅ Proteção de rotas administrativas
- ✅ Validação de dados nos formulários
- ✅ Prevenção de acesso não autorizado
- ✅ Tokens JWT seguros

## 📱 Design e UX

- ✅ Interface responsiva (mobile-first)
- ✅ Design consistente com Tailwind CSS
- ✅ Estados de loading e feedback
- ✅ Validações em tempo real
- ✅ Navegação intuitiva

## 🚀 Próximos Passos

1. **Funcionalidades de E-commerce**:
   - Carrinho de compras
   - Sistema de pedidos
   - Pagamentos

2. **Melhorias Administrativas**:
   - CRUD completo de produtos
   - Gestão de pedidos
   - Relatórios e analytics

3. **Recursos Avançados**:
   - Reset de senha por email
   - Autenticação social (Google, etc.)
   - Notificações push

## 🎯 Estrutura de Arquivos Criada

```
src/
├── app/
│   ├── admin/
│   │   ├── page.js
│   │   └── AdminDashboard.jsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js
│   │   ├── admin/
│   │   │   ├── users/route.js
│   │   │   ├── users/[userId]/route.js
│   │   │   ├── products/route.js
│   │   │   └── orders/route.js
│   │   ├── profile/route.js
│   │   └── usuarios/route.js
│   ├── cadastro/page.jsx
│   ├── login/page.jsx
│   ├── perfil/
│   │   ├── page.js
│   │   └── UserProfile.jsx
│   ├── layout.js
│   └── globals.css
├── components/
│   └── Navbar.jsx
├── providers/
│   └── NextAuthProvider.jsx
└── lib/
    └── db.js
```

O sistema está completo e pronto para uso! 🎉