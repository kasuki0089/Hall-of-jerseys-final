// NextAuth temporariamente desabilitado para evitar erros
// Este arquivo será reconfigurado posteriormente

export async function GET() {
  return new Response(JSON.stringify({ error: 'Auth temporariamente desabilitado' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST() {
  return new Response(JSON.stringify({ error: 'Auth temporariamente desabilitado' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
}
