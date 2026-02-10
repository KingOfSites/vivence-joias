-- Script SQL completo para criar todas as tabelas necessárias
-- Execute este script no seu banco MySQL se as migrations não foram aplicadas

-- Criar tabela User (se não existir)
CREATE TABLE IF NOT EXISTS `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela Cart (se não existir)
CREATE TABLE IF NOT EXISTS `Cart` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cart_sessionId_key`(`sessionId`),
    INDEX `Cart_userId_idx`(`userId`),
    INDEX `Cart_sessionId_idx`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Se a tabela Cart já existe mas não tem userId, adicionar
ALTER TABLE `Cart` 
    MODIFY COLUMN `sessionId` VARCHAR(191) NULL,
    ADD COLUMN IF NOT EXISTS `userId` VARCHAR(191) NULL;

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS `Cart_userId_idx` ON `Cart`(`userId`);
CREATE INDEX IF NOT EXISTS `Cart_sessionId_idx` ON `Cart`(`sessionId`);

-- Criar tabela CartItem (se não existir)
CREATE TABLE IF NOT EXISTS `CartItem` (
    `id` VARCHAR(191) NOT NULL,
    `cartId` VARCHAR(191) NOT NULL,
    `productId` INTEGER NOT NULL,
    `productSlug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `priceRaw` DOUBLE NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `size` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CartItem_cartId_idx`(`cartId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Adicionar foreign key se não existir
-- Nota: MySQL não suporta IF NOT EXISTS para foreign keys, então pode dar erro se já existir
-- Isso é normal, apenas ignore o erro se a foreign key já existir
SET @exist := (SELECT COUNT(*) FROM information_schema.table_constraints 
               WHERE constraint_schema = DATABASE() 
               AND constraint_name = 'CartItem_cartId_fkey' 
               AND table_name = 'CartItem');
SET @sqlstmt := IF(@exist = 0, 
    'ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
    'SELECT "Foreign key already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
