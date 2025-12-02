-- Adicionar coluna desconto na tabela produtos se não existir
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS desconto INT DEFAULT 0;

-- Criar tabela carousel se não existir
CREATE TABLE IF NOT EXISTS carousel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagemUrl VARCHAR(500) NOT NULL,
    linkUrl VARCHAR(500),
    ativo BOOLEAN DEFAULT TRUE,
    ordem INT DEFAULT 0,
    criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizadoEm DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ativo (ativo),
    INDEX idx_ordem (ordem)
);
