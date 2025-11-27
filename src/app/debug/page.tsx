"use client";
import { useState, useEffect } from "react";

export default function DebugPage() {
  const [produtos, setProdutos] = useState([]);
  const [ligas, setLigas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar produtos
        const prodResponse = await fetch('/api/produtos');
        const prodData = await prodResponse.json();
        setProdutos(prodData.produtos || []);

        // Buscar ligas
        const ligaResponse = await fetch('/api/ligas');
        const ligaData = await ligaResponse.json();
        setLigas(ligaData || []);

      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;

  const ligaStats = ligas.map(liga => {
    const produtosDaLiga = produtos.filter(p => 
      p.time?.liga?.id === liga.id ||
      p.time?.liga?.nome?.toLowerCase() === liga.nome.toLowerCase() ||
      p.time?.liga?.sigla?.toLowerCase() === liga.sigla.toLowerCase()
    );
    
    return {
      ...liga,
      totalProdutos: produtosDaLiga.length,
      produtos: produtosDaLiga.slice(0, 3) // Primeiros 3 para debug
    };
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔧 Debug - Sistema de Filtragem</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>📊 Resumo</h2>
        <p>Total de produtos: {produtos.length}</p>
        <p>Total de ligas: {ligas.length}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>🏆 Ligas e Produtos</h2>
        {ligaStats.map((liga, index) => (
          <div key={liga.id} style={{ 
            border: '1px solid #ccc', 
            margin: '10px 0', 
            padding: '15px',
            backgroundColor: liga.totalProdutos > 0 ? '#e8f5e8' : '#ffe6e6'
          }}>
            <h3>
              {liga.nome} ({liga.sigla}) - {liga.totalProdutos} produtos
            </h3>
            
            {liga.produtos.map(produto => (
              <div key={produto.id} style={{ 
                margin: '10px 0', 
                padding: '10px',
                backgroundColor: '#f9f9f9',
                fontSize: '14px'
              }}>
                <strong>{produto.nome}</strong><br/>
                Time: {produto.time?.nome}<br/>
                Liga do Time: {produto.time?.liga?.nome} ({produto.time?.liga?.sigla})<br/>
                Liga ID: {produto.time?.liga?.id}
              </div>
            ))}
            
            {liga.totalProdutos === 0 && (
              <p style={{ color: 'red', fontStyle: 'italic' }}>
                Nenhum produto encontrado para esta liga
              </p>
            )}
          </div>
        ))}
      </div>

      <div>
        <h2>🔍 URLs para Teste</h2>
        {ligas.map(liga => (
          <div key={liga.id} style={{ margin: '5px 0' }}>
            <a 
              href={`/liga/${liga.sigla.toLowerCase()}`}
              style={{ 
                color: ligaStats.find(l => l.id === liga.id)?.totalProdutos > 0 ? 'green' : 'red'
              }}
            >
              /liga/{liga.sigla.toLowerCase()} - {liga.nome}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}