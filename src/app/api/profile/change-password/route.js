import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../lib/db";
import bcrypt from 'bcrypt';

// PUT /api/profile/change-password - Alterar senha do usuário
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { senhaAtual, novaSenha } = await request.json();

    if (!senhaAtual || !novaSenha) {
      return new Response(JSON.stringify({ 
        error: "Senha atual e nova senha são obrigatórias" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (novaSenha.length < 6) {
      return new Response(JSON.stringify({ 
        error: "A nova senha deve ter pelo menos 6 caracteres" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Buscar usuário com senha
    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email }
    });

    if (!usuario) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    
    if (!senhaValida) {
      return new Response(JSON.stringify({ 
        error: "Senha atual incorreta" 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Criptografar nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { senha: novaSenhaHash }
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: "Senha alterada com sucesso" 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return new Response(JSON.stringify({ 
      error: "Erro interno do servidor" 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
