import prisma from '@/lib/db';

export async function GET() {
  const produtos = await prisma.produto.findMany();
  return new Response(JSON.stringify(produtos), { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  const produto = await prisma.produto.create({ data: body });
  return new Response(JSON.stringify(produto), { status: 201 });
}
