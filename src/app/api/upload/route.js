import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo foi enviado' }, { status: 400 });
    }

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Apenas arquivos de imagem são permitidos' }, { status: 400 });
    }

    // Limitar tamanho do arquivo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    
    // Caminho onde salvar o arquivo
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'prodImages');
    const filePath = path.join(uploadDir, fileName);

    // Salvar o arquivo
    await writeFile(filePath, buffer);

    // Retornar a URL da imagem
    const imageUrl = `/images/prodImages/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      fileName 
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}