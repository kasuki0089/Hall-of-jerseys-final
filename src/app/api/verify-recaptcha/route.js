import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token reCAPTCHA é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar token com Google reCAPTCHA
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.warn('⚠️ RECAPTCHA_SECRET_KEY não configurado, pulando validação');
      return NextResponse.json({ success: true });
    }

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'Verificação reCAPTCHA falhou' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erro na verificação reCAPTCHA:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}