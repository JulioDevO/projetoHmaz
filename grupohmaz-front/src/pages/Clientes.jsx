import { useState, useEffect } from 'react';
import { Search, Building2, MapPin, MoreVertical, Plus, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function Clientes() {
  const { user } = useAuth();
  
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do formulário de novo cliente
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarClientesEPedidos();
  }, []);

  async function carregarClientesEPedidos() {
    try {
      setLoading(true);
      
      const { data: clientesData, error: errClientes } = await supabase
        .from('clientes')
        .select('*');
        
      if (errClientes) throw errClientes;

      const { data: pedidosData, error: errPedidos } = await supabase
        .from('pedidos')
        .select('cliente')
        .eq('status', 'Concluido');
        
      if (errPedidos) throw errPedidos;

      const clientesComContagem = (clientesData || []).map(cliente => {
        const contagemConcluidos = (pedidosData || []).filter(p => p.cliente === cliente.nome).length;
        return {
          ...cliente,
          totalPedidos: contagemConcluidos
        };
      });

      clientesComContagem.sort((a, b) => b.totalPedidos - a.totalPedidos);
      setClientes(clientesComContagem);
    } catch (error) {
      console.error('Erro ao carregar dados unificados:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCriarCliente = async (e) => {
    e.preventDefault();
    try {
      setSalvando(true);
      const { error } = await supabase
        .from('clientes')
        .insert([{ nome, documento, email, cidade }]);

      if (error) throw error;

      setNome('');
      setDocumento('');
      setEmail('');
      setCidade('');
      setIsModalOpen(false);
      carregarClientesEPedidos();
    } catch (err) {
      console.error('Erro ao criar cliente:', err.message);
      alert('Erro ao registar o cliente.');
    } finally {
      setSalvando(false);
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.documento?.includes(busca)
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 relative">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Clientes</h2>
          <p className="text-zinc-400 text-sm mt-1">Diretório de empresas e histórico de relacionamento</p>
        </div>
        
        {(user?.role === 'admin' || user?.role === 'dev') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm cursor-pointer"
          >
            <Plus size={18} />
            Novo Cliente
          </button>
        )}
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
                      <button className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-md hover:bg-zinc-800 transition-colors inline-flex cursor-pointer">
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

      {/* Modal de Novo Cliente com fecho ao clicar fora */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121214] border border-zinc-800 rounded-xl p-6 w-full max-w-lg shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Registar Novo Cliente</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCriarCliente} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Indústria Hmaz"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">CNPJ / Documento</label>
                <input
                  type="text"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                  placeholder="Ex: 00.000.000/0001-00"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                  placeholder="contacto@empresa.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Cidade</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Campina Grande"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {salvando ? 'A guardar...' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}a