# Teste usando Invoke-RestMethod do PowerShell
$body = @{
    nome = "Teste Usuario"
    email = "teste$(Get-Date -Format 'yyyyMMddHHmmss')@email.com"
    senha = "123456"
    telefone = "+55 (11) 99999-9999"
    cpf = "123.456.789-00"
    dataNascimento = "1990-01-01"
    endereco = @{
        endereco = "Rua Teste"
        numero = "123"
        complemento = "Apto 1"
        bairro = "Centro"
        cidade = "São Paulo"
        cep = "01234567"
        estadoUf = "SP"
    }
} | ConvertTo-Json -Depth 10

Write-Host "Enviando dados de cadastro..." -ForegroundColor Cyan
Write-Host $body

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    Write-Host "Sucesso!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Erro!" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
