import Link from 'next/link'

export default function Home() {
  return (
    <main style={{padding: 20}}>
      <h1>Hall of Jerseys - Home</h1>
      <p>Projeto TCC - Next.js 15 skeleton</p>
      <Link href="/login">Login</Link>
    </main>
  );
}
