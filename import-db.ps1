# Script para importar banco de dados MySQL
# Execute: .\import-db.ps1 [arquivo.sql]

param(
    [string]$backupFile = ""
)

Write-Host "🗄️  Importando banco de dados MySQL..." -ForegroundColor Cyan

if ($backupFile -eq "") {
    # Buscar arquivo de backup mais recente
    $backupFiles = Get-ChildItem -Filter "backup_hallofjerseys_*.sql" | Sort-Object LastWriteTime -Descending
    
    if ($backupFiles.Count -eq 0) {
        Write-Host "❌ Nenhum arquivo de backup encontrado!" -ForegroundColor Red
        Write-Host "💡 Use: .\import-db.ps1 arquivo.sql" -ForegroundColor Yellow
        exit 1
    }
    
    $backupFile = $backupFiles[0].Name
    Write-Host "📁 Usando backup mais recente: $backupFile" -ForegroundColor Yellow
}

if (-not (Test-Path $backupFile)) {
    Write-Host "❌ Arquivo não encontrado: $backupFile" -ForegroundColor Red
    exit 1
}

$dbName = "hallofjerseys"

try {
    Write-Host "🔨 Criando banco de dados '$dbName'..." -ForegroundColor Yellow
    
    # Criar banco se não existir
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS $dbName;"
    
    Write-Host "📥 Importando dados..." -ForegroundColor Yellow
    
    # Importar dump
    Get-Content $backupFile | mysql -u root $dbName
    
    Write-Host "✅ Banco importado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. Verifique o arquivo .env" -ForegroundColor White
    Write-Host "  2. Execute: npx prisma generate" -ForegroundColor White
    Write-Host "  3. Execute: npm run dev" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erro ao importar: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Certifique-se que:" -ForegroundColor Yellow
    Write-Host "  1. MySQL está rodando" -ForegroundColor White
    Write-Host "  2. Você tem permissões de criar bancos" -ForegroundColor White
}
