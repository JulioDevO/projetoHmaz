import { useState, useEffect } from 'react';
import { Search, Plus, Settings2, MoreVertical, X, Pencil } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Maquinas() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuAberto, setMenuAberto] = useState(null);
  const [produtoEditando, setProdutoEditando] = useState(null);

  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setMenuAberto(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha o modal ao pressionar a tecla "Escape"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleFecharModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  async function carregarProdutos() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('produtos').select('*');
      if (error) throw error;
      setProdutos(data || []);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleAbrirEdicao = (prod) => {
    setCodigo(prod.codigo || '');
    setNome(prod.nome || '');
    setDescricao(prod.descricao || '');
    setProdutoEditando(prod.id);
    setIsModalOpen(true);
    setMenuAberto(null);
  };

  const handleFecharModal = () => {
    setCodigo('');
    setNome('');
    setDescricao('');
    setProdutoEditando(null);
    setIsModalOpen(false);
  };

  const handleSalvarMaquina = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      if (produtoEditando) {
        const { error } = await supabase
          .from('produtos')
          .update({ codigo, nome, descricao })
          .eq('id', produtoEditando);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert([{ codigo, nome, descricao }]);
        if (error) throw error;
      }

      handleFecharModal();
      carregarProdutos();
    } catch (err) {
      console.error('Erro ao salvar máquina:', err.message);
      alert('Erro ao registar máquina.');
    } finally {
      setSalvando(false);
    }
  };

  const produtosFiltrados = produtos.filter((prod) =>
    prod.nome.toLowerCase().includes(busca.toLowerCase()) ||
    prod.codigo.toLowerCase().includes(busca.toLowerCase()) ||
    (prod.descricao && prod.descricao.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Máquinas & Produtos</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Registo de equipamentos e portfólio de fabrico</p>
        </div>
        <button 
          onClick={() => { handleFecharModal(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          <Plus size={16} /> Nova Máquina
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
              placeholder="Pesquisar por código, nome ou descrição..." 
              className="w-full bg-zinc-50 dark:bg-[#1e1e20] border border-zinc-300 dark:border-zinc-700 rounded-md pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full min-h-[240px] pb-12">
          <table className="w-full text-sm">
            <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-[#121214]">
              <tr>
                <th className="px-6 py-4 font-medium text-left">Modelo / Nome</th>
                <th className="px-6 py-4 font-medium text-center">Código</th>
                <th className="px-6 py-4 font-medium text-center w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 text-zinc-700 dark:text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-zinc-500">A carregar máquinas...</td>
                </tr>
              ) : produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-zinc-500">Nenhum registo encontrado.</td>
                </tr>
              ) : (
                produtosFiltrados.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-md text-zinc-500 dark:text-zinc-400"><Settings2 size={16} /></div>
                        <div>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">{prod.nome}</span>
                          <p className="text-xs text-zinc-500">{prod.descricao || 'Sem descrição'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300">{prod.codigo}</span>
                    </td>
                    <td className="px-6 py-4 relative dropdown-container">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setMenuAberto(menuAberto === prod.id ? null : prod.id)}
                          aria-label={`Ações para ${prod.nome}`}
                          aria-expanded={menuAberto === prod.id}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            menuAberto === prod.id 
                              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' 
                              : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {menuAberto === prod.id && (
                          <div className="absolute right-12 top-10 w-44 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 flex flex-col py-1.5 animate-in fade-in zoom-in-95 duration-100">
                            <button 
                              onClick={() => handleAbrirEdicao(prod)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer w-full text-left font-medium focus:outline-none focus-visible:bg-zinc-100 dark:focus-visible:bg-zinc-800"
                            >
                              <Pencil size={15} />
                              Editar Máquina
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
          <div 
            className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" 
            onClick={handleFecharModal}
            aria-hidden="true" 
          />
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-maquina-title"
            className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl flex flex-col z-10 transition-colors"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 id="modal-maquina-title" className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {produtoEditando ? 'Editar Máquina / Produto' : 'Nova Máquina / Produto'}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {produtoEditando ? 'Atualize as informações do equipamento.' : 'Cadastre um novo equipamento no catálogo.'}
                </p>
              </div>
              <button 
                onClick={handleFecharModal} 
                aria-label="Fechar formulário"
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-md cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSalvarMaquina} className="p-6 flex flex-col gap-4">
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Código</label>
                <input 
                  id="codigo"
                  type="text" 
                  required
                  autoFocus
                  disabled={salvando}
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: MAQ-04" 
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-60 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome / Modelo</label>
                <input 
                  id="nome"
                  type="text" 
                  required
                  disabled={salvando}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Prensa Hidráulica 200t" 
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-60 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descrição</label>
                <textarea 
                  id="descricao"
                  rows="2"
                  disabled={salvando}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhes do equipamento..." 
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-60 resize-none transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button 
                  type="button"
                  onClick={handleFecharModal}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                >
                  {salvando ? 'A guardar...' : (produtoEditando ? 'Atualizar Máquina' : 'Salvar Máquina')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}