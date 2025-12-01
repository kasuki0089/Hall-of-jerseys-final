// API para testar configuração de email
import { NextResponse } from 'next/server';
import { testEmailConfig, sendVerificationEmail } from '@/lib/emailService';

export async function GET() {
  try {
    console.log('🧪 Iniciando teste de configuração de email...');
    
    // Testar configuração básica
    const configTest = await testEmailConfig();
    
    if (!configTest.success) {
      return NextResponse.json({
        success: false,
        message: 'Falha na configuração de email',
        details: configTest,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '✅ Email configurado corretamente!',
      details: configTest.details,
      instructions: {
        verification: 'Para testar envio de verificação, acesse: /api/test-email/send',
        environment: {
          provider: process.env.EMAIL_PROVIDER || 'gmail',
          user: process.env.EMAIL_USER || 'não configurado',
          hasPassword: !!process.env.EMAIL_PASS
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Erro no teste de email:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno no teste de email',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Endpoint para enviar email de teste
export async function POST(request: Request) {
  try {
    const { email, nome } = await request.json();
    
    if (!email || !nome) {
      return NextResponse.json({
        success: false,
        message: 'Email e nome são obrigatórios'
      }, { status: 400 });
    }

    console.log('📧 Enviando email de teste para:', email);
    
    // Gerar token de teste
    const testToken = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Enviar email de verificação de teste
    const result = await sendVerificationEmail(email, testToken, nome);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '✅ Email de teste enviado com sucesso!',
        details: {
          recipient: email,
          messageId: result.messageId,
          testToken: testToken
        },
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ Falha ao enviar email de teste',
        error: result.error,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Erro ao enviar email de teste:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno no envio de email',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}