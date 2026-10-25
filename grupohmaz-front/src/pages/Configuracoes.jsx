import { useState, useEffect } from 'react';
import { Users, Edit2, Check, X, UserPlus, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function Configuracoes() {
  const { user } = useAuth();

  const [perfis, setPerfis] = useState([]);
  const [loadingPerfis, setLoadingPerfis] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do formulário de convite
  const [novoEmail, setNovoEmail] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novoNivelAcesso, setNovoNivelAcesso] = useState('operador');
  const [enviandoConvite, setEnviandoConvite] = useState(false);

  // Estados para edição inline
  const [editingId, setEditingId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editNivelAcesso, setEditNivelAcesso] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carregarPerfis();
  }, []);

  async function carregarPerfis() {
    try {
      setLoadingPerfis(true);
      const { data, error } = await supabase.from('perfis').select('*').order('nome', { ascending: true });
      if (error) throw error;
      setPerfis(data || []);
    } catch (err) {
      console.error('Erro ao carregar perfis:', err.message);
    } finally {
      setLoadingPerfis(false);
    }
  }

  const handleConvidarUtilizador = async (e) => {
    e.preventDefault();
    try {
      setEnviandoConvite(true);
      const { data, error } = await supabase.functions.invoke('invite-user', {
        body: { email: novoEmail, nome: novoNome, nivel_acesso: novoNivelAcesso }
      });

      if (error) throw error;

      alert('Convite por e-mail enviado com sucesso!');
      setNovoEmail('');
      setNovoNome('');
      setNovoNivelAcesso('operador');
      setIsModalOpen(false);
      carregarPerfis();
    } catch (err) {
      console.error('Erro ao enviar convite:', err.message);
      alert('Erro ao enviar convite: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setEnviandoConvite(false);
    }
  };

  const handleExcluirUtilizador = async (id, nomeUtilizador) => {
    if (!window.confirm(`Tem certeza que deseja excluir o acesso de "${nomeUtilizador || 'Utilizador'}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId: id }
      });

      if (error) throw error;

      alert('Utilizador excluído com sucesso!');
      carregarPerfis();
    } catch (err) {
      console.error('Erro ao excluir utilizador:', err.message);
      alert('Erro ao excluir utilizador: ' + (err.message || 'Erro desconhecido'));
    }
  };

  const iniciarEdicao = (perfil) => {
    setEditingId(perfil.id);
    setEditNome(perfil.nome || '');
    setEditNivelAcesso(perfil.nivel_acesso || 'operador');
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setEditNome('');
    setEditNivelAcesso('');
  };

  const salvarEdicao = async (id) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('perfis')
        .update({ nome: editNome, nivel_acesso: editNivelAcesso })
        .eq('id', id);

      if (error) throw error;
      
      setPerfis(perfis.map(p => p.id === id ? { ...p, nome: editNome, nivel_acesso: editNivelAcesso } : p));
      cancelarEdicao();
    } catch (err) {
      console.error('Erro ao salvar perfil:', err.message);
      alert('Erro ao guardar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 transition-colors duration-300 relative">
      
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Configurações</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Gestão de utilizadores, equipas e níveis de acesso ao ERP</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm cursor-pointer"
        >
          <UserPlus size={18} />
          Convidar Utilizador
        </button>
      </div>

      <div className="px-2">
        <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-sm max-w-4xl">
          
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-lg">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-zinc-800 dark:text-zinc-100 font-medium">Utilizadores Sincronizados</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Contas registadas e respetivos papéis no sistema</p>
              </div>
            </div>
          </div>
          
          <div className="p-5">
            {loadingPerfis ? (
              <p className="text-sm text-zinc-500 text-center py-4">A carregar utilizadores...</p>
            ) : perfis.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">Nenhum perfil registado na base de dados.</p>
            ) : (
              <div className="space-y-4">
                {perfis.map((p) => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg gap-4">
                    
                    {editingId === p.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={editNome}
                          onChange={(e) => setEditNome(e.target.value)}
                          placeholder="Nome do Utilizador"
                          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                        <select
                          value={editNivelAcesso}
                          onChange={(e) => setEditNivelAcesso(e.target.value)}
                          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                        >
                          <option value="operador">Operador</option>
                          <option value="admin">Administrador</option>
                          <option value="dev">Desenvolvedor</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <button onClick={() => salvarEdicao(p.id)} disabled={saving} aria-label="Guardar alterações" className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-50 cursor-pointer">
                            <Check size={16} />
                          </button>
                          <button onClick={cancelarEdicao} disabled={saving} aria-label="Cancelar edição" className="p-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md transition-colors disabled:opacity-50 cursor-pointer">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase shrink-0">
                            {p.nome ? p.nome.charAt(0) : 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-800 dark:text-white">{p.nome || 'Utilizador sem nome'}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">ID: {p.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-md text-xs font-medium border capitalize ${
                            p.nivel_acesso === 'dev' 
                              ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50' 
                              : p.nivel_acesso === 'admin' 
                              ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                          }`}>
                            {p.nivel_acesso || 'Operador'}
                          </span>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => iniciarEdicao(p)} 
                              aria-label={`Editar perfil de ${p.nome || 'utilizador'}`}
                              className="p-2 text-zinc-400 hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors cursor-pointer"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleExcluirUtilizador(p.id, p.nome)} 
                              aria-label={`Excluir perfil de ${p.nome || 'utilizador'}`}
                              className="p-2 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Convidar Utilizador */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} aria-hidden="true" />
          <div className="relative bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg shadow-xl z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Convidar Novo Utilizador</h3>
              <button onClick={() => setIsModalOpen(false)} aria-label="Fechar modal" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white cursor-pointer p-1 rounded-md">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleConvidarUtilizador} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">E-mail do Utilizador</label>
                <input
                  type="email"
                  required
                  autoFocus
                  disabled={enviandoConvite}
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="exemplo@grupohmaz.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Nome do Utilizador</label>
                <input
                  type="text"
                  required
                  disabled={enviandoConvite}
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Ex: Júlio Santos"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Nível de Acesso Inicial</label>
                <select
                  disabled={enviandoConvite}
                  value={novoNivelAcesso}
                  onChange={(e) => setNovoNivelAcesso(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                  <option value="operador">Operador</option>
                  <option value="admin">Administrador</option>
                  <option value="dev">Desenvolvedor</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviandoConvite}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {enviandoConvite ? 'A enviar...' : 'Enviar Convite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}