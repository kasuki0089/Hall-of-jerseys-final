'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav style={{display:'flex',gap:12,padding:12,borderBottom:'1px solid #ddd'}}>
      <Link href='/'>Home</Link>
      <Link href='/produtos'>Produtos</Link>
      {!session && <Link href='/login'>Login</Link>}
      {session && <><Link href='/perfil'>Perfil</Link><button onClick={()=>signOut()}>Sair</button></>}
      {session?.user?.role === 'admin' && (
        <>
          <Link href='/admin'>Admin</Link>
          <Link href='/admin/produtos'>Gerenciar Produtos</Link>
        </>
      )}
    </nav>
  );
}
