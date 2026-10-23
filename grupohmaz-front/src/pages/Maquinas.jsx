import { useState, useEffect } from 'react';
import { Search, Plus, Settings2, MoreVertical, X, Pencil, Ban, CheckCircle } from 'lucide-react';
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
  const [precoUnitario, setPreprecoUnitario] = useState('');
  const [estoqueAtual, setEstoqueAtual] = useState('');
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
    setPreprecoUnitario(prod.preco_unitario ?? '');
    setEstoqueAtual(prod.estoque_atual ?? '');
    setProdutoEditando(prod.id);
    setIsModalOpen(true);
    setMenuAberto(null);
  };

  const handleFecharModal = () => {
    setCodigo('');
    setNome('');
    setDescricao('');
    setPreprecoUnitario('');
    setEstoqueAtual('');
    setProdutoEditando(null);
    setIsModalOpen(false);
  };

  const handleSuspenderProduto = async (prod) => {
    const novoEstoque = Number(prod.estoque_atual) === 0 ? 10 : 0;
    
    setProdutos(produtos.map(p => 
      p.id === prod.id ? { ...p, estoque_atual: novoEstoque } : p
    ));
    setMenuAberto(null);

    try {
      const { error } = await supabase
        .from('produtos')
        .update({ estoque_atual: novoEstoque })
        .eq('id', prod.id);

      if (error) {
        setProdutos(produtos.map(p => 
          p.id === prod.id ? { ...p, estoque_atual: prod.estoque_atual } : p
        ));
        throw error;
      }
    } catch (err) {
      console.error('Erro ao alterar status do produto:', err.message);
      alert(`Erro da Base de Dados: ${err.message}`);
    }
  };

  const handleSalvarMaquina = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      if (produtoEditando) {
        const { error } = await supabase
          .from('produtos')
          .update({
            codigo,
            nome,
            descricao,
            preco_unitario: Number(precoUnitario),
            estoque_atual: Number(estoqueAtual)
          })
          .eq('id', produtoEditando);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert([
            {
              codigo,
              nome,
              descricao,
              preco_unitario: Number(precoUnitario),
              estoque_atual: Number(estoqueAtual)
            }
          ]);

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

  const getStatusStyle = (estoque) => {
    if (estoque > 5) {
      return 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-900/50 bg-emerald-50 dark:bg-transparent';
    } else if (estoque > 0) {
      return 'text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-900/50 bg-blue-50 dark:bg-transparent';
    } else {
      return 'text-red-600 dark:text-red-400 border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-transparent';
    }
  };

  const getStatusTexto = (estoque) => {
    if (estoque > 5) return 'Disponível';
    if (estoque > 0) return 'Em Andamento';
    return 'Em Falta';
  };

  return (
    <div className="flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Máquinas & Produtos</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Registo de equipamentos e portfólio de fabrico</p>
        </div>
        <button 
          onClick={() => { handleFecharModal(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
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
              className="w-full bg-zinc-50 dark:bg-[#1e1e20] border border-zinc-300 dark:border-zinc-700 rounded-md pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-zinc-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full min-h-[240px] pb-12">
          <table className="w-full text-sm">
            <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-[#121214]">
              <tr>
                <th className="px-6 py-4 font-medium text-left">Modelo / Nome</th>
                <th className="px-6 py-4 font-medium text-center">Código</th>
                <th className="px-6 py-4 font-medium text-center">Preço Unitário</th>
                <th className="px-6 py-4 font-medium text-center">Estoque Atual</th>
                <th className="px-6 py-4 font-medium text-center">Status Catálogo</th>
                <th className="px-6 py-4 font-medium text-center w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 text-zinc-700 dark:text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-zinc-500">A carregar máquinas...</td>
                </tr>
              ) : produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-zinc-500">Nenhum registo encontrado.</td>
                </tr>
              ) : (
                produtosFiltrados.map((prod) => {
                  const statusLabel = getStatusTexto(prod.estoque_atual);
                  return (
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
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 text-center font-medium">R$ {Number(prod.preco_unitario).toFixed(2)}</td>
                      <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300 text-center font-medium">{prod.estoque_atual} un.</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center w-max border ${getStatusStyle(prod.estoque_atual)}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 relative dropdown-container">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => setMenuAberto(menuAberto === prod.id ? null : prod.id)}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
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
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer w-full text-left font-medium"
                              >
                                <Pencil size={15} />
                                Editar Máquina
                              </button>
                              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1 mx-2"></div>
                              <button 
                                onClick={() => handleSuspenderProduto(prod)}
                                className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors cursor-pointer w-full text-left font-medium ${
                                  Number(prod.estoque_atual) > 0 
                                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30' 
                                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                }`}
                              >
                                {Number(prod.estoque_atual) > 0 ? <Ban size={15} /> : <CheckCircle size={15} />}
                                {Number(prod.estoque_atual) > 0 ? 'Zerar Estoque' : 'Repor Estoque'}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
                  {produtoEditando ? 'Editar Máquina / Produto' : 'Nova Máquina / Produto'}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {produtoEditando ? 'Atualize as informações do equipamento.' : 'Cadastre um novo equipamento no catálogo.'}
                </p>
              </div>
              <button onClick={handleFecharModal} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-md cursor-pointer transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSalvarMaquina} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Código</label>
                <input 
                  type="text" 
                  required
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: MAQ-04" 
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome / Modelo</label>
                <input 
                  type="text" 
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Prensa Hidráulica 200t" 
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descrição</label>
                <textarea 
                  rows="2"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhes do equipamento..." 
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Preço Unitário (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={precoUnitario}
                    onChange={(e) => setPreprecoUnitario(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Estoque Atual</label>
                  <input 
                    type="number" 
                    required
                    value={estoqueAtual}
                    onChange={(e) => setEstoqueAtual(e.target.value)}
                    placeholder="0" 
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