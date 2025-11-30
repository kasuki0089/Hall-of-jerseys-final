-- Script SQL para criar o banco de dados no MySQL
-- Execute este script no MySQL Workbench ou terminal MySQL

-- 1. Primeiro, conecte como root e execute:
CREATE DATABASE IF NOT EXISTS hallofjerseys 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Crie um usuário específico (opcional, mas recomendado)
CREATE USER IF NOT EXISTS 'hallofjerseys_user'@'localhost' IDENTIFIED BY 'sua_senha_aqui';

-- 3. Conceda permissões
GRANT ALL PRIVILEGES ON hallofjerseys.* TO 'hallofjerseys_user'@'localhost';
FLUSH PRIVILEGES;

-- 4. Verifique se o banco foi criado
SHOW DATABASES;

-- 5. Use o banco
USE hallofjerseys;