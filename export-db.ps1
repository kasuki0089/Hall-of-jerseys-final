# Script para exportar banco de dados MySQL
# Execute: .\export-db.ps1

Write-Host "🗄️  Exportando banco de dados MySQL..." -ForegroundColor Cyan

$dbName = "hallofjerseys"
$outputFile = "backup_hallofjerseys_$(Get-Date -Format 'yyyy-MM-dd_HH-mm').sql"

# Tentar exportar com mysqldump
try {
    Write-Host "📦 Criando dump do banco '$dbName'..." -ForegroundColor Yellow
    
    # Sem senha (ajuste se necessário)
    mysqldump -u root --no-tablespaces $dbName > $outputFile
    
    if (Test-Path $outputFile) {
        $fileSize = (Get-Item $outputFile).Length / 1KB
        Write-Host "✅ Backup criado com sucesso!" -ForegroundColor Green
        Write-Host "📁 Arquivo: $outputFile" -ForegroundColor White
        Write-Host "📊 Tamanho: $([math]::Round($fileSize, 2)) KB" -ForegroundColor White
        Write-Host ""
        Write-Host "Para restaurar em outro PC:" -ForegroundColor Cyan
        Write-Host "  mysql -u root -p hallofjerseys < $outputFile" -ForegroundColor Yellow
    } else {
        throw "Arquivo não foi criado"
    }
} catch {
    Write-Host "❌ Erro ao criar backup: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Certifique-se que:" -ForegroundColor Yellow
    Write-Host "  1. MySQL está instalado e no PATH" -ForegroundColor White
    Write-Host "  2. O banco 'hallofjerseys' existe" -ForegroundColor White
    Write-Host "  3. Você tem permissões adequadas" -ForegroundColor White
}
