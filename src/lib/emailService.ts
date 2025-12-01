import nodemailer from 'nodemailer';

// Configuração do transportador de email (exemplo com Gmail)
// Em produção, use variáveis de ambiente para as credenciais
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'seu-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'sua-senha-de-aplicativo'
  }
});

export async function sendVerificationEmail(email: string, token: string, nome: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verificar-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'Hall of Jerseys <noreply@hallofjerseys.com>',
    to: email,
    subject: 'Verificação de Email - Hall of Jerseys',
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de Email</title>
        <style>
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 30px;
            background: #f9f9f9;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🏀 Hall of Jerseys</h1>
            <p>Bem-vindo ao nosso time!</p>
          </div>
          
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Obrigado por se cadastrar na Hall of Jerseys! Para completar seu cadastro e ter acesso a todas as funcionalidades da nossa loja, precisamos verificar seu email.</p>
            
            <p>Clique no botão abaixo para verificar sua conta:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">
                ✅ Verificar minha conta
              </a>
            </div>
            
            <p>Ou copie e cole este link no seu navegador:</p>
            <p style="background: #e9ecef; padding: 10px; border-radius: 4px; word-break: break-all;">
              ${verificationUrl}
            </p>
            
            <p><strong>Este link expira em 24 horas.</strong></p>
            
            <p>Se você não se cadastrou em nossa loja, pode ignorar este email com segurança.</p>
            
            <p>Att,<br>Equipe Hall of Jerseys</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Hall of Jerseys. Todos os direitos reservados.</p>
            <p>Este é um email automático, não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de verificação enviado para:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error };
  }
}

export async function sendWelcomeEmail(email: string, nome: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'Hall of Jerseys <noreply@hallofjerseys.com>',
    to: email,
    subject: 'Bem-vindo à Hall of Jerseys! 🏀',
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo!</title>
      </head>
      <body>
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>🏀 Bem-vindo à Hall of Jerseys!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Olá, ${nome}!</h2>
            <p>Sua conta foi verificada com sucesso! 🎉</p>
            <p>Agora você pode aproveitar todas as funcionalidades da nossa loja:</p>
            
            <ul>
              <li>🛒 Comprar camisas dos seus times favoritos</li>
              <li>⭐ Avaliar produtos</li>
              <li>📦 Acompanhar seus pedidos</li>
              <li>💳 Gerenciar suas formas de pagamento</li>
              <li>📍 Salvar endereços de entrega</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/produtos" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                🛍️ Começar a comprar
              </a>
            </div>
            
            <p>Obrigado por escolher a Hall of Jerseys!</p>
            <p>Att,<br>Equipe Hall of Jerseys</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de boas-vindas enviado para:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email de boas-vindas:', error);
    return { success: false, error: error };
  }
}