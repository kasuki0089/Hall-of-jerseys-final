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

    // Verificar se email ja existe
    console.log('🔍 Verificando se email já existe...');
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() }
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

    // Gerar token de verificação
    console.log('🔑 Gerando token de verificação...');
    const tokenVerificacao = crypto.randomBytes(32).toString('hex');

    // Criar endereco se fornecido
    let enderecoId = null;
    if (endereco && endereco.endereco && endereco.numero && endereco.cidade && endereco.cep && endereco.estadoUf) {
      const novoEndereco = await prisma.endereco.create({
        data: {
          endereco: endereco.endereco,
          numero: endereco.numero,
          complemento: endereco.complemento || null,
          bairro: endereco.bairro || 'Centro',
          cidade: endereco.cidade,
          cep: endereco.cep.replace(/\D/g, ''), // Remove caracteres nao numericos
          estadoUf: endereco.estadoUf
        }
      });
      
      enderecoId = novoEndereco.id;
    }

    // Criar usuario
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone: telefone || null,
        cpf: cpf || null,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        role: 'user', // Sempre usuario comum por padrao
        enderecoId,
        emailVerificado: true, // Marcando como verificado automaticamente
        tokenVerificacao: null // Token removido
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        emailVerificado: true,
        criadoEm: true
      }
    });

    // Email de verificação removido para desenvolvimento local
    console.log('✅ Usuário criado sem necessidade de verificação de email');

    return new Response(JSON.stringify({
      success: true,
      message: 'Usuário criado com sucesso! Você já pode fazer login.',
      usuario,
      verificacaoNecessaria: false
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
