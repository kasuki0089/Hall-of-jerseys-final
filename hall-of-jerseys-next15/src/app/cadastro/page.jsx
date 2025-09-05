'use client';
import { useState } from 'react';

export default function Cadastro() {
  const [form, setForm] = useState({ nome:'', email:'', senha:'' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      alert('Cadastro realizado');
      window.location.href = '/login';
    } else {
      const err = await res.json();
      alert('Erro: ' + (err?.error || 'não foi possível cadastrar'));
    }
  };

  return (
    <div style={{maxWidth: 420, margin: '40px auto'}}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:8}}>
        <input placeholder='Nome' value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} />
        <input placeholder='Email' value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input placeholder='Senha' type='password' value={form.senha} onChange={e=>setForm({...form, senha:e.target.value})} />
        <button type='submit'>Cadastrar</button>
      </form>
    </div>
  );
}
