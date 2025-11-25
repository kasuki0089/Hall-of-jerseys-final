import prisma from '../../../lib/db';
import bcrypt from 'bcrypt';

// POST /api/login - Autenticar usuario
export async function POST(req) {
  try {
    const { email, senha } = await req.json();

    // Validacoes basicas
    if (!email || !senha) {
      return new Response(JSON.stringify({ 
        error: 'Email e senha sao obrigatorios' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true,
        telefone: true,
        role: true,
        criadoEm: true,
        endereco: {
          select: {
            id: true,
            endereco: true,
            numero: true,
            complemento: true,
            bairro: true,
            cidade: true,
            cep: true,
            estado: {
              select: {
                uf: true,
                nome: true
              }
            }
          }
        }
      }
    });

    if (!usuario) {
      return new Response(JSON.stringify({ 
        error: 'Email ou senha incorretos' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaValida) {
      return new Response(JSON.stringify({ 
        error: 'Email ou senha incorretos' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Remover senha do retorno
    const { senha: _, ...usuarioSeguro } = usuario;

    return new Response(JSON.stringify({
      success: true,
      message: 'Login realizado com sucesso',
      usuario: usuarioSeguro
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}