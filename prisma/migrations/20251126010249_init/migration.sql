-- CreateTable
CREATE TABLE "estados" (
    "uf" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "estadoUf" TEXT NOT NULL,
    CONSTRAINT "enderecos_estadoUf_fkey" FOREIGN KEY ("estadoUf") REFERENCES "estados" ("uf") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "codigo" TEXT
);

-- CreateTable
CREATE TABLE "tamanhos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "formas_pagamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "numeroCartao" TEXT,
    "nomeCartao" TEXT,
    "validadeCartao" TEXT,
    "bandeiraCartao" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "formas_pagamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ligas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "times" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "ligaId" INTEGER NOT NULL,
    CONSTRAINT "times_ligaId_fkey" FOREIGN KEY ("ligaId") REFERENCES "ligas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "modelo" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "year" INTEGER NOT NULL,
    "serie" TEXT,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "sale" BOOLEAN NOT NULL DEFAULT false,
    "imagemUrl" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "ligaId" INTEGER NOT NULL,
    "timeId" INTEGER,
    "corId" INTEGER NOT NULL,
    "tamanhoId" INTEGER NOT NULL,
    CONSTRAINT "produtos_ligaId_fkey" FOREIGN KEY ("ligaId") REFERENCES "ligas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "produtos_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "times" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "produtos_corId_fkey" FOREIGN KEY ("corId") REFERENCES "cores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "produtos_tamanhoId_fkey" FOREIGN KEY ("tamanhoId") REFERENCES "tamanhos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "enderecoId" INTEGER,
    CONSTRAINT "usuarios_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "confirmadoEm" DATETIME,
    "transacaoId" TEXT,
    "formaPagamentoId" INTEGER,
    CONSTRAINT "pedidos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pedidos_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "formas_pagamento" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pedidos_transacaoId_fkey" FOREIGN KEY ("transacaoId") REFERENCES "transacoes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "itens_pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco" REAL NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "itens_pedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "itens_pedido_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pedidoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "dadosGateway" TEXT,
    "erro" TEXT,
    "processadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "cores_nome_key" ON "cores"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tamanhos_nome_key" ON "tamanhos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tamanhos_ordem_key" ON "tamanhos"("ordem");

-- CreateIndex
CREATE UNIQUE INDEX "ligas_nome_key" ON "ligas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "ligas_sigla_key" ON "ligas"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_codigo_key" ON "produtos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_transacaoId_key" ON "pedidos"("transacaoId");
