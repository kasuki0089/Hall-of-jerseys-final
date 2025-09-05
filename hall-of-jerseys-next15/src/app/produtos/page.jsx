'use client';
import { useEffect, useState } from 'react';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);

  useEffect(()=>{
    fetch('/api/produtos').then(r=>r.json()).then(setProdutos);
  },[]);

  return (
    <div style={{padding:20}}>
      <h1>Produtos</h1>
      <ul>
        {produtos.map(p=> (
          <li key={p.id}>{p.nome} - R$ {p.preco}</li>
        ))}
      </ul>
    </div>
  );
}
