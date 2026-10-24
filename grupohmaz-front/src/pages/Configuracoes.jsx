import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Edit2, Check, X, Plus } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function Configuracoes() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [perfis, setPerfis] = useState([]);
  const [loadingPerfis, setLoadingPerfis] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [novoId, setNovoId] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novoNivelAcesso, setNovoNivelAcesso] = useState('dev');
  const [salvando, setSalvando] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editNivelAcesso, setEditNivelAcesso] = useState('');
  const [saving, setSaving] = useState(false);

  // Permite acesso se for admin OU dev
  const temAcesso = user?.role === 'admin' || user?.role === 'dev';

  useEffect(() => {
    if (user && !temAcesso) {
      navigate('/pedidos');
    }
  }, [user, navigate, temAcesso]);

  useEffect(() => {
    carregarPerfis();
  }, [user]);

  async function carregarPerfis() {
    if (!temAcesso) return; 
    try {
      setLoadingPerfis(true);
      const { data, error } = await supabase.from('perfis').select('*').order('id', { ascending: true });
      if (error) throw error;
      setPerfis(data || []);
    } catch (err) {
      console.error('Erro ao carregar perfis:', err.message);
    } finally {
      setLoadingPerfis(false);
    }
  }

  const handleCriarPerfil = async (e) => {
    e.preventDefault();
    try {
      setSalvando(true);
      const { error } = await supabase.from('perfis').insert([{ id: novoId, nome: novoNome, nivel_acesso: novoNivelAcesso }]);
      if (error) throw error;
      setNovoId(''); setNovoNome(''); setNovoNivelAcesso('dev'); setIsModalOpen(false); carregarPerfis();
    } catch (err) {
      alert('Erro ao registar o perfil.');
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (perfil) => {
    setEditingId(perfil.id); setEditNome(perfil.nome || ''); setEditNivelAcesso(perfil.nivel_acesso || '');
  };

  const cancelarEdicao = () => {
    setEditingId(null); setEditNome(''); setEditNivelAcesso('');
  };

  const salvarEdicao = async (id) => {
    try {
      setSaving(true);
      const { error } = await supabase.from('perfis').update({ nome: editNome, nivel_acesso: editNivelAcesso }).eq('id', id);
      if (error) throw error;
      setPerfis(perfis.map(p => p.id === id ? { ...p, nome: editNome, nivel_acesso: editNivelAcesso } : p));
      cancelarEdicao();
    } catch (err) {
      alert('Erro ao guardar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (!temAcesso) return null;

  return (
    <div className="flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 transition-colors duration-300 relative">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Configurações</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Gestão de utilizadores e acessos ao ERP</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm cursor-pointer">
          <Plus size={18} /> Novo Perfil
        </button>
      </div>

      <div className="px-2">
        <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-sm max-w-4xl">
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-lg"><Users size={20} /></div>
              <h3 className="text-zinc-800 dark:text-zinc-100 font-medium">Utilizadores e Acessos</h3>
            </div>
          </div>
          
          <div className="p-5">
            {loadingPerfis ? <p className="text-sm text-zinc-500 text-center py-4">A carregar utilizadores...</p> : perfis.length === 0 ? <p className="text-sm text-zinc-500 text-center py-4">Nenhum perfil registado na base de dados.</p> : (
              <div className="space-y-4">
                {perfis.map((p) => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg gap-4">
                    {editingId === p.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-3">
                        <input type="text" value={editNome} onChange={(e) => setEditNome(e.target.value)} placeholder="Nome" className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        <input type="text" value={editNivelAcesso} onChange={(e) => setEditNivelAcesso(e.target.value)} placeholder="Acesso (admin, dev)" className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        <div className="flex items-center gap-2">
                          <button onClick={() => salvarEdicao(p.id)} disabled={saving} className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-50 cursor-pointer"><Check size={16} /></button>
                          <button onClick={cancelarEdicao} disabled={saving} className="p-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md transition-colors disabled:opacity-50 cursor-pointer"><X size={16} /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm font-medium text-zinc-800 dark:text-white">{p.nome || 'Utilizador sem nome'}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">ID: {p.id}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-md text-xs font-medium border ${p.nivel_acesso === 'admin' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' : 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'}`}>
                            {p.nivel_acesso || 'Sem acesso'}
                          </span>
                          <button onClick={() => iniciarEdicao(p)} className="p-2 text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer"><Edit2 size={16} /></button>
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

      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Adicionar Novo Perfil</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleCriarPerfil} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">ID da Conta (UUID)</label>
                <input type="text" required value={novoId} onChange={(e) => setNovoId(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Nome do Utilizador</label>
                <input type="text" required value={novoNome} onChange={(e) => setNovoNome(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Nível de Acesso</label>
                <select value={novoNivelAcesso} onChange={(e) => setNovoNivelAcesso(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md px-3 py-2 text-sm cursor-pointer">
                  <option value="dev">dev</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white cursor-pointer">{salvando ? 'A guardar...' : 'Salvar Perfil'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}