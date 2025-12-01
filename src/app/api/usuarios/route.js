import prisma from '../../../lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../../lib/emailService';

// POST /api/usuarios - Registrar novo usuario
export async function POST(req) {
  try {
    console.log('📝 Nova requisição de cadastro recebida');
    
    const {
      nome,
      email,
      senha,
      telefone,
      cpf,
      dataNascimento,
      endereco
    } = await req.json();

    console.log('📋 Dados recebidos:', { nome, email, telefone, cpf, temDataNascimento: !!dataNascimento, temEndereco: !!endereco });

    // Validacoes basicas
    if (!nome || !email || !senha) {
      return new Response(JSON.stringify({ 
        error: 'Nome, email e senha sao obrigatorios' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Sanitizar e validar inputs
    const nomeLimpo = nome.trim();
    const emailLimpo = email.toLowerCase().trim();
    
    // Validar tamanho dos campos
    if (nomeLimpo.length < 3 || nomeLimpo.length > 100) {
      return new Response(JSON.stringify({ 
        error: 'Nome deve ter entre 3 e 100 caracteres' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (emailLimpo.length > 255) {
      return new Response(JSON.stringify({ 
        error: 'Email muito longo' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validacao de email com regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLimpo)) {
      return new Response(JSON.stringify({ 
        error: 'Email invalido' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar senha
    if (senha.length > 100) {
      return new Response(JSON.stringify({ 
        error: 'Senha muito longa' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se email ja existe
    console.log('🔍 Verificando se email já existe...');
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: emailLimpo }
    });

    if (usuarioExistente) {
      console.log('❌ Email já existe:', email);
      return new Response(JSON.stringify({ 
        error: 'Email ja esta em uso' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar forca da senha
    if (senha.length < 6) {
      return new Response(JSON.stringify({ 
        error: 'Senha deve ter pelo menos 6 caracteres' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Criptografar senha
    console.log('🔐 Criptografando senha...');
    const senhaHash = await bcrypt.hash(senha, 10);

    // Preparar dados de endereço se fornecido
    let enderecoData = null;
    if (endereco && endereco.endereco && endereco.numero && endereco.cidade && endereco.cep && endereco.estadoUf) {
      // Sanitizar dados de endereço
      const enderecoLimpo = String(endereco.endereco).trim().substring(0, 200);
      const numeroLimpo = String(endereco.numero).trim().substring(0, 10);
      const complementoLimpo = endereco.complemento ? String(endereco.complemento).trim().substring(0, 100) : null;
      const bairroLimpo = endereco.bairro ? String(endereco.bairro).trim().substring(0, 100) : 'Centro';
      const cidadeLimpo = String(endereco.cidade).trim().substring(0, 100);
      const cepLimpo = String(endereco.cep).replace(/\D/g, '').substring(0, 8);
      const estadoUfLimpo = String(endereco.estadoUf).toUpperCase().trim().substring(0, 2);
      
      enderecoData = {
        create: {
          endereco: enderecoLimpo,
          numero: numeroLimpo,
          complemento: complementoLimpo,
          bairro: bairroLimpo,
          cidade: cidadeLimpo,
          cep: cepLimpo,
          estadoUf: estadoUfLimpo
        }
      };
    }

    // Criar usuario
    const usuario = await prisma.usuario.create({
      data: {
        nome: nomeLimpo,
        email: emailLimpo,
        senha: senhaHash,
        telefone: telefone ? String(telefone).trim().substring(0, 20) : null,
        cpf: cpf ? String(cpf).trim().substring(0, 14) : null,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        role: 'user', // Sempre usuario comum por padrao
        ...(enderecoData && { endereco: enderecoData })
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        criadoEm: true
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Usuario criado com sucesso! Você já pode fazer login.',
      usuario
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao criar usuario:', error);
    
    // Tratar erro especifico do Prisma para email unico
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return new Response(JSON.stringify({ 
        error: 'Email ja esta em uso' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// GET /api/usuarios - Listar usuarios (apenas admin)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        criadoEm: true,
        endereco: {
          select: {
            cidade: true,
            estado: {
              select: {
                uf: true
              }
            }
          }
        },
        _count: {
          select: {
            pedidos: true
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      },
      skip: offset,
      take: limit
    });

    const total = await prisma.usuario.count();

    return new Response(JSON.stringify({
      usuarios,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar usuarios:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
