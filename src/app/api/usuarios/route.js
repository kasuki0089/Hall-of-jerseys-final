import prisma from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const body = await req.json();
    const { nome, email, senha } = body;
    if (!nome || !email || !senha) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), { status: 400 });
    }
    const hashed = await bcrypt.hash(senha, 10);
    const user = await prisma.usuario.create({ data: { nome, email, senha: hashed } });
    return new Response(JSON.stringify({ ok: true, id: user.id }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
