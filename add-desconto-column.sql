-- Verificar e adicionar coluna desconto se não existir
ALTER TABLE produtos ADD COLUMN desconto INT DEFAULT 0;

-- Verificar estrutura da tabela produtos
DESCRIBE produtos;
