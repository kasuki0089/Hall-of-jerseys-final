'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', { redirect: false, email, senha });
    if (res?.ok) {
      alert('Login bem-sucedido');
      window.location.href = '/';
    } else {
      alert('Erro ao logar');
    }
  };

  return (
    <div style={{maxWidth: 420, margin: '40px auto'}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:8}}>
        <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder='Senha' type='password' value={senha} onChange={e=>setSenha(e.target.value)} />
        <button type='submit'>Entrar</button>
      </form>
    </div>
  );
}
