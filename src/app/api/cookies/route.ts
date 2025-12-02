import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET - Ler cookies
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Ler um cookie específico
    const userPreference = cookieStore.get('userPreference');
    const cartItems = cookieStore.get('shopping-cart');
    
    // Ler todos os cookies
    const allCookies = cookieStore.getAll();
    
    return NextResponse.json({
      userPreference: userPreference?.value || null,
      cartItems: cartItems?.value || null,
      allCookies: allCookies.map((cookie: any) => ({
        name: cookie.name,
        value: cookie.value
      }))
    });
    
  } catch (error) {
    console.error('Erro ao ler cookies:', error);
    return NextResponse.json(
      { error: 'Erro ao ler cookies' }, 
      { status: 500 }
    );
  }
}

// POST - Definir cookies
export async function POST(request: NextRequest) {
  try {
    const { name, value, options } = await request.json();
    
    if (!name || !value) {
      return NextResponse.json(
        { error: 'Nome e valor são obrigatórios' }, 
        { status: 400 }
      );
    }
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Cookie definido com sucesso' 
    });
    
    // Definir o cookie na resposta
    response.cookies.set(name, value, {
      httpOnly: false, // Permite acesso via JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
      ...options
    });
    
    return response;
    
  } catch (error) {
    console.error('Erro ao definir cookie:', error);
    return NextResponse.json(
      { error: 'Erro ao definir cookie' }, 
      { status: 500 }
    );
  }
}

// DELETE - Remover cookies
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cookieName = searchParams.get('name');
    
    if (!cookieName) {
      return NextResponse.json(
        { error: 'Nome do cookie é obrigatório' }, 
        { status: 400 }
      );
    }
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Cookie removido com sucesso' 
    });
    
    // Remover o cookie
    response.cookies.delete(cookieName);
    
    return response;
    
  } catch (error) {
    console.error('Erro ao remover cookie:', error);
    return NextResponse.json(
      { error: 'Erro ao remover cookie' }, 
      { status: 500 }
    );
  }
}