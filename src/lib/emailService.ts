import * as nodemailer from 'nodemailer';

// Interface para configuração de email
interface EmailConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized: boolean;
  };
}

// Função para criar transportador baseado no provedor
function createTransporter(): nodemailer.Transporter {
  const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
  const emailUser = process.env.EMAIL_USER || '';
  const emailPass = process.env.EMAIL_PASS || '';

  if (!emailUser || !emailPass) {
    console.warn('⚠️ Credenciais de email não configuradas. Usando modo de teste.');
    return nodemailer.createTransport({
      jsonTransport: true
    });
  }

  let config: EmailConfig;

  switch (emailProvider.toLowerCase()) {
    case 'gmail':
      config = {
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        },
        tls: {
          rejectUnauthorized: false
        }
      };
      break;

    case 'outlook':
    case 'hotmail':
      config = {
        service: 'hotmail',
        auth: {
          user: emailUser,
          pass: emailPass
        },
        tls: {
          rejectUnauthorized: false
        }
      };
      break;

    case 'smtp':
      config = {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: emailUser,
          pass: emailPass
        },
        tls: {
          rejectUnauthorized: false
        }
      };
      break;

    default:
      console.error('❌ Provedor de email não suportado:', emailProvider);
      throw new Error('Provedor de email inválido');
  }

  return nodemailer.createTransport(config);
}

// Criar transportador
const transporter = createTransporter();

// Nota: Verificação de email desabilitada para desenvolvimento local

// Templates de email melhorados
const emailTemplates = {
  verification: {
    subject: '🔐 Verifique sua conta - Hall of Jerseys',
    getHtml: (nome: string, verificationUrl: string) => `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de Email</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; position: relative; }
          .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a"><stop offset="20%" stop-color="%23fff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23fff" stop-opacity="0"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>'); }
          .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; position: relative; z-index: 1; }
          .subtitle { font-size: 16px; opacity: 0.9; position: relative; z-index: 1; }
          .content { padding: 40px; }
          .greeting { font-size: 24px; color: #333; margin-bottom: 20px; font-weight: 600; }
          .message { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
          .cta-button { display: inline-block; background: linear-gradient(45deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; margin: 20px 0; }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5); }
          .link-fallback { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .link-text { color: #667eea; word-break: break-all; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
          .social-links { margin: 20px 0; }
          .social-links a { color: #667eea; text-decoration: none; margin: 0 10px; }
          @media (max-width: 600px) { .container { margin: 10px; } .content { padding: 20px; } .greeting { font-size: 20px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏀 Hall of Jerseys</div>
            <div class="subtitle">Sua loja de camisas favorita</div>
          </div>
          
          <div class="content">
            <div class="greeting">Olá, ${nome}! 👋</div>
            <div class="message">
              Que alegria ter você conosco! Bem-vindo à Hall of Jerseys, onde você encontra as melhores camisas de futebol do mundo.
            </div>
            <div class="message">
              Para garantir a segurança da sua conta e liberar todas as funcionalidades da nossa plataforma, precisamos verificar seu email.
            </div>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="cta-button">
                ✅ Verificar minha conta
              </a>
            </div>
            
            <div class="warning">
              <strong>⏰ Importante:</strong> Este link de verificação expira em 24 horas por motivos de segurança.
            </div>
            
            <div class="link-fallback">
              <strong>Link não funcionou?</strong> Copie e cole este endereço no seu navegador:
              <br><br>
              <span class="link-text">${verificationUrl}</span>
            </div>
            
            <div class="message" style="margin-top: 30px;">
              <strong>Por que verificar?</strong>
              <ul style="margin: 15px 0 0 20px; color: #666;">
                <li>🔒 Protege sua conta contra acesso não autorizado</li>
                <li>📧 Receba atualizações importantes sobre seus pedidos</li>
                <li>🎁 Tenha acesso a ofertas exclusivas</li>
                <li>💎 Desbloqueia funcionalidades premium</li>
              </ul>
            </div>
            
            <div class="message" style="margin-top: 30px; font-size: 14px; color: #888;">
              Se você não se cadastrou na Hall of Jerseys, pode ignorar este email com segurança.
            </div>
          </div>
          
          <div class="footer">
            <div><strong>Hall of Jerseys</strong></div>
            <div style="margin: 10px 0;">A sua paixão pelo futebol merece o melhor</div>
            <div class="social-links">
              <a href="#">📧 Contato</a> |
              <a href="#">📱 WhatsApp</a> |
              <a href="#">📘 Facebook</a> |
              <a href="#">📷 Instagram</a>
            </div>
            <div style="margin-top: 15px; font-size: 12px; color: #999;">
              © ${new Date().getFullYear()} Hall of Jerseys. Todos os direitos reservados.<br>
              Este é um email automático, não responda a esta mensagem.
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  welcome: {
    subject: '🎉 Conta verificada! Bem-vindo à Hall of Jerseys',
    getHtml: (nome: string) => `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo!</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 40px; }
          .greeting { font-size: 28px; color: #333; margin-bottom: 20px; font-weight: 600; text-align: center; }
          .message { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
          .features { background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 30px 0; }
          .feature-item { display: flex; align-items: center; margin: 15px 0; font-size: 16px; color: #333; }
          .feature-icon { margin-right: 15px; font-size: 20px; }
          .cta-section { text-align: center; margin: 40px 0; }
          .cta-button { display: inline-block; background: linear-gradient(45deg, #28a745, #20c997); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4); margin: 10px; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
          .highlight { background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%); padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center; color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
            <div style="font-size: 32px; font-weight: bold;">Parabéns!</div>
            <div style="font-size: 18px; opacity: 0.9; margin-top: 10px;">Sua conta foi verificada com sucesso</div>
          </div>
          
          <div class="content">
            <div class="greeting">Bem-vindo, ${nome}! 🏆</div>
            
            <div class="highlight">
              <strong>🔓 Sua conta está 100% ativa!</strong><br>
              Agora você tem acesso completo à Hall of Jerseys
            </div>
            
            <div class="message">
              Estamos muito felizes em tê-lo como parte da nossa família! Agora você pode aproveitar todas as vantagens de ser um membro verificado.
            </div>

            <div class="features">
              <h3 style="color: #333; margin-bottom: 20px; text-align: center;">🎯 O que você pode fazer agora:</h3>
              
              <div class="feature-item">
                <span class="feature-icon">🛒</span>
                <span><strong>Comprar com segurança</strong> - Acesso ao nosso catálogo completo de camisas</span>
              </div>
              
              <div class="feature-item">
                <span class="feature-icon">⭐</span>
                <span><strong>Avaliar produtos</strong> - Ajude outros clientes com suas opiniões</span>
              </div>
              
              <div class="feature-item">
                <span class="feature-icon">📦</span>
                <span><strong>Rastrear pedidos</strong> - Acompanhe suas compras em tempo real</span>
              </div>
              
              <div class="feature-item">
                <span class="feature-icon">💎</span>
                <span><strong>Ofertas exclusivas</strong> - Promoções especiais para membros</span>
              </div>
              
              <div class="feature-item">
                <span class="feature-icon">🏠</span>
                <span><strong>Múltiplos endereços</strong> - Gerencie seus locais de entrega</span>
              </div>
              
              <div class="feature-item">
                <span class="feature-icon">💳</span>
                <span><strong>Pagamento rápido</strong> - Salve seus métodos de pagamento</span>
              </div>
            </div>

            <div class="cta-section">
              <div style="margin-bottom: 20px; color: #666;">Pronto para começar?</div>
              <a href="${process.env.NEXTAUTH_URL || 'https://hallofjerseys.com'}/produtos" class="cta-button">
                🛍️ Explorar produtos
              </a>
              <a href="${process.env.NEXTAUTH_URL || 'https://hallofjerseys.com'}/perfil" class="cta-button">
                👤 Meu perfil
              </a>
            </div>

            <div class="message" style="text-align: center; margin-top: 30px;">
              <strong>🎁 Dica especial:</strong> Que tal começar explorando nossas camisas mais vendidas? Temos peças exclusivas de todos os grandes times!
            </div>
          </div>
          
          <div class="footer">
            <div><strong>Obrigado por escolher a Hall of Jerseys! 🙏</strong></div>
            <div style="margin: 15px 0;">Se tiver dúvidas, nossa equipe está sempre pronta para ajudar.</div>
            <div style="margin: 20px 0;">
              <a href="#" style="color: #28a745; text-decoration: none; margin: 0 10px;">📧 Suporte</a> |
              <a href="#" style="color: #28a745; text-decoration: none; margin: 0 10px;">💬 Chat</a> |
              <a href="#" style="color: #28a745; text-decoration: none; margin: 0 10px;">📱 WhatsApp</a>
            </div>
            <div style="margin-top: 15px; font-size: 12px; color: #999;">
              © ${new Date().getFullYear()} Hall of Jerseys. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  passwordReset: {
    subject: '🔐 Redefinir senha - Hall of Jerseys',
    getHtml: (nome: string, resetUrl: string) => `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinir Senha</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 40px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .cta-button { display: inline-block; background: linear-gradient(45deg, #dc3545, #fd7e14); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 48px; margin-bottom: 15px;">🔐</div>
            <div style="font-size: 24px; font-weight: bold;">Redefinição de Senha</div>
          </div>
          
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se foi você, clique no botão abaixo:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="cta-button">🔑 Redefinir senha</a>
            </div>
            
            <div class="warning">
              <strong>⏰ Atenção:</strong> Este link expira em 1 hora por motivos de segurança.
            </div>
            
            <p>Se você não solicitou esta redefinição, ignore este email. Sua senha permanecerá inalterada.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Função principal para enviar email com retry automático
async function sendEmailWithRetry(mailOptions: nodemailer.SendMailOptions, maxRetries = 3): Promise<{ success: boolean; error?: any; messageId?: string }> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado com sucesso para ${mailOptions.to} (tentativa ${attempt})`);
      console.log(`📧 Message ID: ${result.messageId}`);
      
      return { 
        success: true, 
        messageId: result.messageId 
      };
      
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Erro ao enviar email (tentativa ${attempt}/${maxRetries}):`, error.message);
      
      // Se não é a última tentativa, aguarda antes de tentar novamente
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`❌ Falha definitiva ao enviar email após ${maxRetries} tentativas`);
  return { 
    success: false, 
    error: lastError 
  };
}

// Função para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para sanitizar dados de entrada
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export async function sendVerificationEmail(email: string, token: string, nome: string) {
  // Validações de entrada
  if (!email || !token || !nome) {
    console.error('❌ Dados obrigatórios não fornecidos para envio de email de verificação');
    return { success: false, error: 'Dados obrigatórios não fornecidos' };
  }

  if (!isValidEmail(email)) {
    console.error('❌ Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  // Sanitizar entradas
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedNome = sanitizeInput(nome);
  const sanitizedToken = sanitizeInput(token);

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verificar-email?token=${sanitizedToken}`;
  
  const mailOptions: nodemailer.SendMailOptions = {
    from: {
      name: 'Hall of Jerseys',
      address: process.env.EMAIL_USER || 'noreply@hallofjerseys.com'
    },
    to: sanitizedEmail,
    subject: emailTemplates.verification.subject,
    html: emailTemplates.verification.getHtml(sanitizedNome, verificationUrl),
    priority: 'high',
    headers: {
      'X-Mailer': 'Hall of Jerseys v1.0',
      'X-Priority': '1',
      'X-MSMail-Priority': 'High'
    }
  };

  return await sendEmailWithRetry(mailOptions);
}

export async function sendWelcomeEmail(email: string, nome: string) {
  // Validações de entrada
  if (!email || !nome) {
    console.error('❌ Dados obrigatórios não fornecidos para envio de email de boas-vindas');
    return { success: false, error: 'Dados obrigatórios não fornecidos' };
  }

  if (!isValidEmail(email)) {
    console.error('❌ Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  // Sanitizar entradas
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedNome = sanitizeInput(nome);

  const mailOptions: nodemailer.SendMailOptions = {
    from: {
      name: 'Hall of Jerseys',
      address: process.env.EMAIL_USER || 'noreply@hallofjerseys.com'
    },
    to: sanitizedEmail,
    subject: emailTemplates.welcome.subject,
    html: emailTemplates.welcome.getHtml(sanitizedNome),
    priority: 'normal',
    headers: {
      'X-Mailer': 'Hall of Jerseys v1.0'
    }
  };

  return await sendEmailWithRetry(mailOptions);
}

export async function sendPasswordResetEmail(email: string, nome: string, resetToken: string) {
  // Validações de entrada
  if (!email || !nome || !resetToken) {
    console.error('❌ Dados obrigatórios não fornecidos para envio de email de reset de senha');
    return { success: false, error: 'Dados obrigatórios não fornecidos' };
  }

  if (!isValidEmail(email)) {
    console.error('❌ Email inválido:', email);
    return { success: false, error: 'Email inválido' };
  }

  // Sanitizar entradas
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedNome = sanitizeInput(nome);
  const sanitizedToken = sanitizeInput(resetToken);

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/redefinir-senha?token=${sanitizedToken}`;

  const mailOptions: nodemailer.SendMailOptions = {
    from: {
      name: 'Hall of Jerseys',
      address: process.env.EMAIL_USER || 'noreply@hallofjerseys.com'
    },
    to: sanitizedEmail,
    subject: emailTemplates.passwordReset.subject,
    html: emailTemplates.passwordReset.getHtml(sanitizedNome, resetUrl),
    priority: 'high',
    headers: {
      'X-Mailer': 'Hall of Jerseys v1.0',
      'X-Priority': '1',
      'X-MSMail-Priority': 'High'
    }
  };

  return await sendEmailWithRetry(mailOptions);
}

// Função para testar configuração de email
export async function testEmailConfig(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    console.log('🔍 Testando configuração de email...');
    
    // Verificar se as variáveis de ambiente estão definidas
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailUser || !emailPass) {
      return {
        success: false,
        message: 'Credenciais de email não configuradas nas variáveis de ambiente'
      };
    }

    // Verificar conexão
    await transporter.verify();
    
    return {
      success: true,
      message: 'Configuração de email válida e funcionando',
      details: {
        provider: process.env.EMAIL_PROVIDER || 'gmail',
        user: emailUser,
        transporterType: transporter.transporter?.name || 'unknown'
      }
    };
    
  } catch (error: any) {
    return {
      success: false,
      message: 'Erro na configuração de email',
      details: {
        error: error.message,
        code: error.code
      }
    };
  }
}

// Função para obter estatísticas de envio (para futuro dashboard admin)
export async function getEmailStats(): Promise<{
  configured: boolean;
  provider: string;
  lastTest?: Date;
  status: 'connected' | 'error' | 'not_configured';
}> {
  const emailUser = process.env.EMAIL_USER;
  const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
  
  if (!emailUser) {
    return {
      configured: false,
      provider: emailProvider,
      status: 'not_configured'
    };
  }

  try {
    await transporter.verify();
    return {
      configured: true,
      provider: emailProvider,
      lastTest: new Date(),
      status: 'connected'
    };
  } catch (error) {
    return {
      configured: true,
      provider: emailProvider,
      lastTest: new Date(),
      status: 'error'
    };
  }
}