import { NextRequest, NextResponse } from 'next/server';

// POST /api/contato - Processar formulário de contato
export async function POST(req) {
  try {
    const { nome, email, telefone, motivo, problema } = await req.json();

    // Validações básicas
    if (!nome || !email || !motivo || !problema) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    console.log('📧 Nova mensagem de contato:');
    console.log({
      nome,
      email,
      telefone,
      motivo,
      problema,
      dataEnvio: new Date().toISOString()
    });

    // Aqui você pode implementar:
    // - Salvar no banco de dados
    // - Enviar email para administradores
    // - Integrar com serviços de email como SendGrid, Nodemailer, etc.
    
    // Por enquanto, vamos simular o salvamento
    const mensagem = {
      id: Date.now(),
      nome,
      email,
      telefone,
      motivo,
      problema,
      status: 'novo',
      criadoEm: new Date().toISOString()
    };

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Nossa equipe entrará em contato em até 24 horas.',
      id: mensagem.id
    });

  } catch (error) {
    console.error('❌ Erro ao processar contato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}