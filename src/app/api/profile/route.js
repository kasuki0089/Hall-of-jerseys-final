import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/db";

// GET /api/profile - Obter dados do perfil do usuario
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        dataNascimento: true,
        genero: true,
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
            estadoUf: true,
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
          take: 10 // Ultimos 10 pedidos
        }
      }
    });

    if (!usuario) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(usuario), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT /api/profile - Atualizar dados do perfil
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const { nome, email, telefone, cpf, dataNascimento, genero } = data;

    // Buscar usuário atual
    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email }
    });

    if (!usuario) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Se estiver alterando email, verificar se já existe
    if (email && email !== usuario.email) {
      const emailExistente = await prisma.usuario.findUnique({
        where: { email }
      });

      if (emailExistente) {
        return new Response(JSON.stringify({ 
          error: "Este email já está em uso" 
        }), { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData = {};
    if (nome !== undefined) updateData.nome = nome;
    if (email !== undefined) updateData.email = email;
    if (telefone !== undefined) updateData.telefone = telefone;
    if (cpf !== undefined) updateData.cpf = cpf;
    if (dataNascimento !== undefined) {
      updateData.dataNascimento = dataNascimento ? new Date(dataNascimento) : null;
    }
    if (genero !== undefined) updateData.genero = genero;

    const updatedUser = await prisma.usuario.update({
      where: { id: usuario.id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        dataNascimento: true,
        genero: true,
        role: true,
      },
    });

    return new Response(JSON.stringify(updatedUser), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}