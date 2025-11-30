import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de consulta
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const liga = searchParams.get('liga');
    const time = searchParams.get('time');
    const cor = searchParams.get('cor');
    const tamanho = searchParams.get('tamanho');
    const precoMin = searchParams.get('precoMin') ? parseFloat(searchParams.get('precoMin')) : null;
    const precoMax = searchParams.get('precoMax') ? parseFloat(searchParams.get('precoMax')) : null;
    const ordenacao = searchParams.get('ordenacao') || 'nome';
    const pesquisa = searchParams.get('pesquisa');

    console.log('🔍 Buscando produtos com filtros:', {
      page, limit, liga, time, cor, tamanho, precoMin, precoMax, ordenacao, pesquisa
    });

    const skip = (page - 1) * limit;

    // Tentar buscar no banco primeiro
    try {
      // Construir filtros WHERE
      const where = {};

      if (liga) {
        where.time = {
          liga: {
            sigla: {
              equals: liga,
              mode: 'insensitive'
            }
          }
        };
      }

      if (time) {
        if (!where.time) where.time = {};
        where.time.nome = {
          contains: time,
          mode: 'insensitive'
        };
      }

      if (cor) {
        where.cor = {
          nome: {
            contains: cor,
            mode: 'insensitive'
          }
        };
      }

      if (precoMin !== null || precoMax !== null) {
        where.preco = {};
        if (precoMin !== null) where.preco.gte = precoMin;
        if (precoMax !== null) where.preco.lte = precoMax;
      }

      if (pesquisa) {
        where.OR = [
          {
            nome: {
              contains: pesquisa,
              mode: 'insensitive'
            }
          },
          {
            descricao: {
              contains: pesquisa,
              mode: 'insensitive'
            }
          },
          {
            time: {
              nome: {
                contains: pesquisa,
                mode: 'insensitive'
              }
            }
          }
        ];
      }

      // Definir ordenação
      let orderBy = {};
      switch (ordenacao) {
        case 'preco-asc':
          orderBy = { preco: 'asc' };
          break;
        case 'preco-desc':
          orderBy = { preco: 'desc' };
          break;
        case 'mais-recentes':
          orderBy = { criadoEm: 'desc' };
          break;
        case 'nome':
        default:
          orderBy = { nome: 'asc' };
          break;
      }

      // Buscar produtos
      const [produtos, total] = await Promise.all([
        prisma.produto.findMany({
          where,
          include: {
            time: {
              include: {
                liga: {
                  select: { id: true, nome: true, sigla: true }
                }
              }
            },
            cor: {
              select: { id: true, nome: true, codigo: true }
            },
            tamanho: {
              select: { id: true, nome: true, ordem: true }
            }
          },
          orderBy,
          skip,
          take: limit
        }),
        prisma.produto.count({ where })
      ]);

      // Calcular metadados de paginação
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return NextResponse.json({
        success: true,
        produtos,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPreviousPage
        },
        filters: {
          liga: liga || null,
          time: time || null,
          cor: cor || null,
          tamanho: tamanho || null,
          ordenacao: ordenacao || 'nome',
          pesquisa: pesquisa || null
        }
      });

    } catch (error) {
      console.error('❌ Erro de conexão com banco:', error.message);
      return NextResponse.json({
        success: false,
        error: 'Erro de conexão com o banco de dados. Verifique se o MySQL está rodando.'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// POST - Criar novo produto (apenas admin)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verificar autorização de admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      nome, 
      descricao, 
      preco, 
      ligaId,
      timeId, 
      corId, 
      imagemUrl,
      modelo,
      serie,
      year,
      codigo,
      estoques // Array com {tamanhoId, quantidade}
    } = body;

    // Validações obrigatórias
    if (!nome || !preco || !ligaId || !corId) {
      return NextResponse.json({ 
        error: 'Nome, preço, liga e cor são obrigatórios' 
      }, { status: 400 });
    }

    if (preco < 0) {
      return NextResponse.json({ 
        error: 'Preço não pode ser negativo' 
      }, { status: 400 });
    }

    if (!estoques || !Array.isArray(estoques) || estoques.length === 0) {
      return NextResponse.json({ 
        error: 'Pelo menos um tamanho com estoque deve ser informado' 
      }, { status: 400 });
    }

    // Validar estoques
    for (const estoque of estoques) {
      if (!estoque.tamanhoId || estoque.quantidade < 0) {
        return NextResponse.json({ 
          error: 'Todos os estoques devem ter tamanho e quantidade válidos' 
        }, { status: 400 });
      }
    }

    // Gerar código único se não fornecido
    const codigoProduto = codigo || `PROD-${Date.now()}`;

    // Criar produto e estoques em transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Criar produto
      const produto = await tx.produto.create({
        data: {
          nome,
          codigo: codigoProduto,
          descricao: descricao || '',
          modelo: modelo || 'CAMISA',
          preco: parseFloat(preco),
          year: parseInt(year) || new Date().getFullYear(),
          serie: serie || 'HOME',
          ligaId: parseInt(ligaId),
          timeId: timeId ? parseInt(timeId) : null,
          corId: parseInt(corId),
          imagemUrl: imagemUrl || null,
          ativo: true,
          sale: false
        }
      });

      // Criar registros de estoque
      const estoquesCreated = await Promise.all(
        estoques.map(estoque => 
          tx.estoquePorTamanho.create({
            data: {
              produtoId: produto.id,
              tamanhoId: parseInt(estoque.tamanhoId),
              quantidade: parseInt(estoque.quantidade)
            }
          })
        )
      );

      return { produto, estoques: estoquesCreated };
    });

    // Buscar produto completo para retorno
    const produtoCompleto = await prisma.produto.findUnique({
      where: { id: resultado.produto.id },
      include: {
        liga: true,
        time: {
          include: {
            liga: true
          }
        },
        cor: true,
        estoques: {
          include: {
            tamanho: true
          }
        }
      }
    });

    return NextResponse.json(produtoCompleto, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Código de produto já existe. Tente outro código.' 
      }, { status: 400 });
    }

    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: 'Liga, time, cor ou tamanho especificado não existe' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Erro ao criar produto',
      details: error.message 
    }, { status: 500 });
  }
}