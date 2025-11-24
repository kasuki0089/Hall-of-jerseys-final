// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/db";

// GET /api/profile - Obter dados do perfil do usuário
export async function GET(request) {
  try {
    // TODO: Implementar autenticação real
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return new Response(JSON.stringify({ error: "Não autenticado" }), { 
    //     status: 401 
    //   });
    // }

    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId'); // Por enquanto via query param

    if (!usuarioId) {
      return new Response(JSON.stringify({ error: 'usuarioId é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) },
      select: {
        id: true,
        nome: true,
        email: true,
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
        },
        formasPagamento: {
          where: { ativo: true },
          select: {
            id: true,
            tipo: true,
            numeroCartao: true,
            nomeCartao: true,
            bandeiraCartao: true,
            criadoEm: true
          }
        },
        pedidos: {
          select: {
            id: true,
            total: true,
            status: true,
            criadoEm: true,
            _count: {
              select: {
                itens: true
              }
            }
          },
          orderBy: {
            criadoEm: 'desc'
          },
          take: 10 // Últimos 10 pedidos
        }
      }
    });

    if (!usuario) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { 
        status: 404 
      });
    }

    return new Response(JSON.stringify(usuario), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
} 
        status: 400 
      });
    }

    const updatedUser = await prisma.usuario.update({
      where: { id: session.user.id },
      data: { nome, email },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}