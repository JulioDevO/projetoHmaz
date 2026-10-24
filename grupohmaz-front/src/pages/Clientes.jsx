import { useState, useEffect } from 'react';
import { Search, Building2, MapPin, MoreVertical } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function carregarClientesEPedidos() {
      try {
        setLoading(true);
        
        // 1. Busca todos os clientes cadastrados na base
        const { data: clientesData, error: errClientes } = await supabase
          .from('clientes')
          .select('*');
          
        if (errClientes) throw errClientes;

        // 2. Busca todos os pedidos que estão na coluna "Concluído"
        const { data: pedidosData, error: errPedidos } = await supabase
          .from('pedidos')
          .select('cliente')
          .eq('status', 'Concluido');
          
        if (errPedidos) throw errPedidos;

        // 3. Cruza os dados: conta quantos pedidos concluídos pertencem a cada cliente
        const clientesComContagem = (clientesData || []).map(cliente => {
          const contagemConcluidos = (pedidosData || []).filter(p => p.cliente === cliente.nome).length;
          return {
            ...cliente,
            totalPedidos: contagemConcluidos
          };
        });

        // Ordena os clientes com mais pedidos para o topo (opcional)
        clientesComContagem.sort((a, b) => b.totalPedidos - a.totalPedidos);

        setClientes(clientesComContagem);
      } catch (error) {
        console.error('Erro ao carregar dados unificados:', error.message);
      } finally {
        setLoading(false);
      }
    }

    carregarClientesEPedidos();
  }, []);

  // Filtro de pesquisa por nome ou CNPJ
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.documento?.includes(busca)
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Clientes</h2>
          <p className="text-zinc-400 text-sm mt-1">Diretório de empresas e histórico de relacionamento</p>
        </div>
      </div>

      <div className="bg-[#121214] rounded-xl border border-zinc-800 overflow-hidden flex flex-col flex-1">
        
        {/* Barra de Pesquisa */}
        <div className="p-4 border-b border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Pesquisar cliente por nome ou CNPJ..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Tabela de Clientes */}
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/40 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Empresa</th>
                <th className="px-6 py-4 font-medium text-center">Localização</th>
                <th className="px-6 py-4 font-medium text-center">Total Pedidos</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">A carregar clientes...</td>
                </tr>
              ) : clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">Nenhum cliente encontrado.</td>
                </tr>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 group-hover:text-zinc-300">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-100">{cliente.nome}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {cliente.documento || 'CNPJ não informado'} | {cliente.email || 'Sem email'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5 text-zinc-400">
                        <MapPin size={14} />
                        {cliente.cidade || 'Não informada'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {/* Exibe dinamicamente a contagem de pedidos concluídos */}
                      <span className="font-semibold text-zinc-200">{cliente.totalPedidos}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className="text-emerald-400 border border-emerald-900/50 bg-emerald-950/30 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide">
                          Ativo
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-md hover:bg-zinc-800 transition-colors inline-flex">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}