# Script para atualizar o banco de dados com avaliações

Write-Host "🔄 Aplicando mudanças no banco de dados..." -ForegroundColor Cyan

# Aplicar as mudanças do schema ao banco
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schema atualizado com sucesso!" -ForegroundColor Green
    
    Write-Host "`n📦 Criando dados de exemplo..." -ForegroundColor Cyan
    
    # Criar pedidos de exemplo
    Write-Host "`n🛒 Criando pedidos..." -ForegroundColor Yellow
    node prisma/seed-orders.js
    
    # Criar avaliações de exemplo
    Write-Host "`n⭐ Criando avaliações..." -ForegroundColor Yellow
    node prisma/seed-reviews.js
    
    Write-Host "`n✅ Banco de dados atualizado e populado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao atualizar schema" -ForegroundColor Red
    exit 1
}
