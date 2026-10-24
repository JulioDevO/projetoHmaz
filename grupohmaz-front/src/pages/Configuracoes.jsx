import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function Configuracoes() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [perfis, setPerfis] = useState([]);
  const [loadingPerfis, setLoadingPerfis] = useState(true);

  // Estados para edição inline
  const [editingId, setEditingId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editCargo, setEditCargo] = useState('');
  const [saving, setSaving] = useState(false);

  // Redireciona se não for admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/pedidos');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function carregarPerfis() {
      // Segurança: Só carrega os dados se for admin
      if (user?.role !== 'admin') return; 
      
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
    carregarPerfis();
  }, [user]);

  const iniciarEdicao = (perfil) => {
    setEditingId(perfil.id);
    setEditNome(perfil.nome || '');
    setEditCargo(perfil.cargo || '');
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setEditNome('');
    setEditCargo('');
  };

  const salvarEdicao = async (id) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('perfis')
        .update({ nome: editNome, cargo: editCargo })
        .eq('id', id);

      if (error) throw error;
      
      setPerfis(perfis.map(p => p.id === id ? { ...p, nome: editNome, cargo: editCargo } : p));
      cancelarEdicao();
    } catch (err) {
      console.error('Erro ao salvar perfil:', err.message);
      alert('Erro ao guardar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  // Se não for admin, não renderiza nada para não piscar a tela antes de redirecionar
  if (user?.role !== 'admin') return null;

  return (
    <div className="flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Configurações</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Gestão de utilizadores e acessos ao ERP</p>
        </div>
      </div>

      <div className="px-2">
        <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-sm max-w-4xl">
          
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-lg">
                <Users size={20} />
              </div>
              <h3 className="text-zinc-800 dark:text-zinc-100 font-medium">Utilizadores e Acessos (Admin)</h3>
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
                          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={editCargo}
                          onChange={(e) => setEditCargo(e.target.value)}
                          placeholder="Cargo (ex: Administrador)"
                          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <button onClick={() => salvarEdicao(p.id)} disabled={saving} className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-50">
                            <Check size={16} />
                          </button>
                          <button onClick={cancelarEdicao} disabled={saving} className="p-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md transition-colors disabled:opacity-50">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm font-medium text-zinc-800 dark:text-white">{p.nome || 'Utilizador sem nome'}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">ID da conta: {p.id}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-md text-xs font-medium border ${p.cargo === 'Administrador' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' : 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'}`}>
                            {p.cargo || 'Sem cargo'}
                          </span>
                          <button onClick={() => iniciarEdicao(p)} className="p-2 text-zinc-400 hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors">
                            <Edit2 size={16} />
                          </button>
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
    </div>
  );
}