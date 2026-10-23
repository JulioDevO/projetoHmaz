import { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Building2, MapPin, X, Pencil, Ban, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuAberto, setMenuAberto] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);

  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setMenuAberto(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function carregarClientes() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('clientes').select('*');
      if (error) throw error;
      setClientes(data || []);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleAbrirEdicao = (cliente) => {
    setNome(cliente.nome || '');
    setDocumento(cliente.documento || '');
    setEmail(cliente.email || '');
    setTelefone(cliente.telefone || '');
    setCidade(cliente.cidade || '');
    setClienteEditando(cliente.id);
    setIsModalOpen(true);
    setMenuAberto(null);
  };

  const handleFecharModal = () => {
    setNome('');
    setDocumento('');
    setEmail('');
    setTelefone('');
    setCidade('');
    setClienteEditando(null);
    setIsModalOpen(false);
  };

  const handleSuspenderCliente = async (cliente) => {
    const novoStatus = cliente.ativo === false ? true : false;
    
    setClientes(clientes.map(c => 
      c.id === cliente.id ? { ...c, ativo: novoStatus } : c
    ));
    setMenuAberto(null);

    try {
      const { error } = await supabase
        .from('clientes')
        .update({ ativo: novoStatus })
        .eq('id', cliente.id);

      if (error) {
        setClientes(clientes.map(c => 
          c.id === cliente.id ? { ...c, ativo: cliente.ativo } : c
        ));
        throw error;
      }
    } catch (err) {
      console.error('Erro ao alterar status do cliente:', err.message);
      alert(`Erro da Base de Dados: ${err.message}`);
    }
  };

  const handleSalvarCliente = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      if (clienteEditando) {
        const { error } = await supabase
          .from('clientes')
          .update({
            nome,
            documento,
            email,
            telefone,
            cidade: cidade || 'Não informada'
          })
          .eq('id', clienteEditando);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clientes')
          .insert([{
            nome,
            documento,
            email,
            telefone,
            cidade: cidade || 'Não informada',
            ativo: true
          }]);

        if (error) throw error;
      }

      handleFecharModal();
      carregarClientes();
    } catch (err) {
      console.error('Erro ao salvar cliente:', err.message);
      alert(`Erro da Base de Dados: ${err.message}`); 
    } finally {
      setSalvando(false);
    }
  };

  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 11) value = value.slice(0, 11); 
    
    let formatted = value;
    if (value.length > 2) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 6) {
      if (value.length <= 10) {
        formatted = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
      } else {
        formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      }
    }
    setTelefone(formatted);
  };

  const clientesFiltrados = clientes.filter((cliente) => 
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (cliente.documento && cliente.documento.includes(busca))
  );

  return (
    <div className="flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Clientes</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Gestão de empresas e parceiros comerciais</p>
        </div>
        <button 
          onClick={() => { handleFecharModal(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col flex-1 overflow-hidden w-full shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input 
              type="text" 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar cliente por nome ou CNPJ..." 
              className="w-full bg-zinc-50 dark:bg-[#1e1e20] border border-zinc-300 dark:border-zinc-700 rounded-md pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-zinc-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full min-h-[240px] pb-12">
          <table className="w-full text-sm">
            <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-[#121214]">
              <tr>
                <th className="px-6 py-4 font-medium text-left">Empresa</th>
                <th className="px-6 py-4 font-medium text-center">Localização</th>
                <th className="px-6 py-4 font-medium text-center">Total Pedidos</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 text-zinc-700 dark:text-zinc-300">
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
                  <tr key={cliente.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-md text-zinc-500 dark:text-zinc-400"><Building2 size={16} /></div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">{cliente.nome}</p>
                          <p className="text-xs text-zinc-500">{cliente.documento || 'CNPJ não informado'} | {cliente.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400">
                        <MapPin size={14} /> {cliente.cidade || 'Local não definido'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-center text-zinc-700 dark:text-zinc-300">{cliente.pedidos || 0}</td>
                    
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center w-max border ${
                          cliente.ativo !== false 
                            ? 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-900/50 bg-emerald-50 dark:bg-transparent' 
                            : 'text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-transparent'
                        }`}>
                          {cliente.ativo !== false ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 relative dropdown-container">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setMenuAberto(menuAberto === cliente.id ? null : cliente.id)}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            menuAberto === cliente.id 
                              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' 
                              : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {menuAberto === cliente.id && (
                          <div className="absolute right-12 top-10 w-44 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 flex flex-col py-1.5 animate-in fade-in zoom-in-95 duration-100">
                            <button 
                              onClick={() => handleAbrirEdicao(cliente)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer w-full text-left font-medium"
                            >
                              <Pencil size={15} />
                              Editar Cliente
                            </button>
                            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1 mx-2"></div>
                            <button 
                              onClick={() => handleSuspenderCliente(cliente)}
                              className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors cursor-pointer w-full text-left font-medium ${
                                cliente.ativo !== false 
                                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30' 
                                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                              }`}
                            >
                              {cliente.ativo !== false ? <Ban size={15} /> : <CheckCircle size={15} />}
                              {cliente.ativo !== false ? 'Suspender' : 'Reativar'}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={handleFecharModal} />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl flex flex-col z-10 transition-colors">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {clienteEditando ? 'Atualize as informações do cadastro.' : 'Cadastre uma nova empresa ou parceiro comercial.'}
                </p>
              </div>
              <button onClick={handleFecharModal} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-md cursor-pointer transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSalvarCliente} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome da Empresa / Cliente</label>
                <input 
                  type="text" 
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Metalúrgica São Jorge" 
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">CNPJ / CPF</label>
                  <input 
                    type="text" 
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="00.000.000/0001-00" 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Cidade / Local</label>
                  <input 
                    type="text" 
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Ex: São Paulo, SP" 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@empresa.com" 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Telefone</label>
                  <input 
                    type="text" 
                    value={telefone}
                    onChange={handleTelefoneChange}
                    maxLength={15}
                    placeholder="(00) 00000-0000" 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button 
                  type="button"
                  onClick={handleFecharModal}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {salvando ? 'A guardar...' : (clienteEditando ? 'Atualizar Cliente' : 'Salvar Cliente')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}