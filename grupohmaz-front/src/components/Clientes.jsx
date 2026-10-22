import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; 

export function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarClientes() {
      try {
        setLoading(true);
    
        const { data, error } = await supabase
          .from('clientes')
          .select('*');

        if (error) throw error;
        setClientes(data || []);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err.message);
        setErro('Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    }

    carregarClientes();
  }, []);

  if (loading) return <p>A carregar dados do ERP...</p>;
  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Gestão de Clientes - Grupo Hmaz</h2>
      {clientes.length === 0 ? (
        <p>Ainda não existem clientes registados na base de dados.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {clientes.map((cliente) => (
            <li 
              key={cliente.id} 
              style={{ padding: '10px', margin: '5px 0', background: '#f4f4f4', borderRadius: '4px' }}
            >
              <strong>{cliente.nome}</strong> — Documento: {cliente.documento || 'N/D'} | Email: {cliente.email || 'N/D'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}