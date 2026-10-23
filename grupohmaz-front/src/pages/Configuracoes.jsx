import { useState, useEffect } from 'react';
import { CreditCard, Users, Plus } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Configuracoes() {
  const [perfis, setPerfis] = useState([]);
  const [loadingPerfis, setLoadingPerfis] = useState(true);

  useEffect(() => {
    async function carregarPerfis() {
      try {
        setLoadingPerfis(true);
        const { data, error } = await supabase.from('perfis').select('*');
        if (error) throw error;
        setPerfis(data || []);
      } catch (err) {
        console.error('Erro ao carregar perfis:', err.message);
      } finally {
        setLoadingPerfis(false);
      }
    }
    carregarPerfis();
  }, []);

  return (
    <div className="flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Configurações</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Gestão de usuários, acessos e parâmetros do ERP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-sm">
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-lg"><Users size={20} /></div>
              <h3 className="text-zinc-800 dark:text-zinc-100 font-medium">Usuários e Acessos (Supabase)</h3>
            </div>
          </div>
          <div className="p-5 flex-1">
            {loadingPerfis ? (
              <p className="text-xs text-zinc-500">A carregar utilizadores...</p>
            ) : perfis.length === 0 ? (
              <p className="text-xs text-zinc-500">Nenhum perfil registado na base de dados.</p>
            ) : (
              <div className="space-y-4">
                {perfis.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-white">{p.nome}</p>
                      <p className="text-xs text-zinc-500">Cargo: {p.cargo}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${p.cargo === 'Administrador' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' : 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'}`}>
                      {p.cargo}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-sm">
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 rounded-lg"><CreditCard size={20} /></div>
              <h3 className="text-zinc-800 dark:text-zinc-100 font-medium">Tipos de Pagamento</h3>
            </div>
            <button className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700">
              <Plus size={14} /> Adicionar
            </button>
          </div>
          <div className="p-5 flex-1">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 border-b border-zinc-200 dark:border-zinc-800/50">
                <span className="text-zinc-700 dark:text-zinc-300">Transferência Bancária (TED/PIX)</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Ativo</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-zinc-200 dark:border-zinc-800/50">
                <span className="text-zinc-700 dark:text-zinc-300">Boleto a 30/60/90 dias</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Ativo</span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-zinc-700 dark:text-zinc-300">Cartão BNDES</span>
                <span className="text-zinc-400 dark:text-zinc-500 text-xs font-medium">Inativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}