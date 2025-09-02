Hall of Jerseys - Backend (minimal server/app)

Arquivos criados:
- server.js        (inicia o app)
- app.js           (configura express, pool MySQL e rota /api/auth)
- routes/authRoutes.js (placeholders de rota /api/auth)
- .env.example     (exemplo de variáveis de ambiente)

Próximos passos para testar localmente:
1) criar um banco MySQL chamado 'HallofJerseys' (ou ajustar DB_NAME no .env)
2) copiar o arquivo .env.example para .env e ajustar credenciais
3) instalar dependências: npm init -y && npm i express mysql2 cors morgan helmet dotenv
4) rodar: node server.js
5) testar: GET http://localhost:3000/  e GET http://localhost:3000/api/auth/ping
