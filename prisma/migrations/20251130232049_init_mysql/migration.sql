/*
  Warnings:

  - You are about to drop the column `estoque` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `tamanhoId` on the `produtos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `produtos` DROP FOREIGN KEY `produtos_tamanhoId_fkey`;

-- AlterTable
ALTER TABLE `itens_pedido` ADD COLUMN `tamanhoId` INTEGER NULL;

-- AlterTable
ALTER TABLE `produtos` DROP COLUMN `estoque`,
    DROP COLUMN `tamanhoId`;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `cpf` VARCHAR(191) NULL,
    ADD COLUMN `dataNascimento` DATETIME(3) NULL,
    ADD COLUMN `genero` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `estoque_por_tamanho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produtoId` INTEGER NOT NULL,
    `tamanhoId` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 0,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `estoque_por_tamanho_produtoId_tamanhoId_key`(`produtoId`, `tamanhoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carrinho_itens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `tamanhoId` INTEGER NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `carrinho_itens_usuarioId_produtoId_tamanhoId_key`(`usuarioId`, `produtoId`, `tamanhoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `nota` DOUBLE NOT NULL,
    `comentario` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    INDEX `avaliacoes_produtoId_idx`(`produtoId`),
    INDEX `avaliacoes_nota_idx`(`nota`),
    UNIQUE INDEX `avaliacoes_usuarioId_produtoId_key`(`usuarioId`, `produtoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contatos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `motivo` VARCHAR(191) NOT NULL,
    `mensagem` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'novo',
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `respondidoEm` DATETIME(3) NULL,

    INDEX `contatos_status_idx`(`status`),
    INDEX `contatos_criadoEm_idx`(`criadoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `estoque_por_tamanho` ADD CONSTRAINT `estoque_por_tamanho_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoque_por_tamanho` ADD CONSTRAINT `estoque_por_tamanho_tamanhoId_fkey` FOREIGN KEY (`tamanhoId`) REFERENCES `tamanhos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_pedido` ADD CONSTRAINT `itens_pedido_tamanhoId_fkey` FOREIGN KEY (`tamanhoId`) REFERENCES `tamanhos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carrinho_itens` ADD CONSTRAINT `carrinho_itens_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carrinho_itens` ADD CONSTRAINT `carrinho_itens_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carrinho_itens` ADD CONSTRAINT `carrinho_itens_tamanhoId_fkey` FOREIGN KEY (`tamanhoId`) REFERENCES `tamanhos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
