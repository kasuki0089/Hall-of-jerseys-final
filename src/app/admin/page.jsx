import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return <div style={{padding:20}}>Acesso negado. Apenas admins.</div>;
  }
  return (
    <div style={{padding:20}}>
      <h1>Admin Dashboard</h1>
      <p>Bem-vindo supapo, {session.user.name}</p>
    </div>
  );
}
