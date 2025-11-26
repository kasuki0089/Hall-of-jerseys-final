-- CreateTable
CREATE TABLE `configuracoes_estoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produtoId` INTEGER NOT NULL,
    `quantidadeMinima` INTEGER NOT NULL DEFAULT 5,
    `quantidadeMaxima` INTEGER NOT NULL DEFAULT 100,
    `pontoReposicao` INTEGER NOT NULL DEFAULT 10,
    `tempoMedioReposicao` INTEGER NULL,
    `fornecedor` VARCHAR(191) NULL,
    `custoUltimaCompra` DOUBLE NULL,
    `dataUltimaCompra` DATETIME(3) NULL,
    `observacoes` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `configuracoes_estoque_produtoId_key`(`produtoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movimentacoes_estoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produtoId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `quantidadeAntes` INTEGER NOT NULL,
    `quantidadeDepois` INTEGER NOT NULL,
    `motivo` VARCHAR(191) NULL,
    `custo` DOUBLE NULL,
    `valorTotal` DOUBLE NULL,
    `fornecedor` VARCHAR(191) NULL,
    `notaFiscal` VARCHAR(191) NULL,
    `responsavel` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `movimentacoes_estoque_produtoId_idx`(`produtoId`),
    INDEX `movimentacoes_estoque_tipo_idx`(`tipo`),
    INDEX `movimentacoes_estoque_criadoEm_idx`(`criadoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `configuracoes_estoque` ADD CONSTRAINT `configuracoes_estoque_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movimentacoes_estoque` ADD CONSTRAINT `movimentacoes_estoque_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
