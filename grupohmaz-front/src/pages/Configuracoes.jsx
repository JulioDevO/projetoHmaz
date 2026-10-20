import { Shield, CreditCard, Users, Plus } from 'lucide-react';

export default function Configuracoes() {
  return (
    <div className="flex flex-col h-full custom-scrollbar overflow-y-auto pb-6 animate-in fade-in duration-500">
      <div className="mb-6 px-2">
        <h2 className="text-2xl font-semibold text-white">Configurações</h2>
        <p className="text-zinc-400 text-sm mt-1">Gestão de utilizadores, acessos e parâmetros do ERP</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        {/* Gestão de Utilizadores */}
        <div className="bg-[#121214] rounded-xl border border-zinc-800 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/20 text-blue-500 rounded-lg"><Users size={20} /></div>
              <h3 className="text-zinc-100 font-medium">Utilizadores e Acessos</h3>
            </div>
            <button className="text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus size={14} /> Novo
            </button>
          </div>
          <div className="p-5 flex-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">Ricardo Campos</p>
                  <p className="text-xs text-zinc-500">admin@grupohmaz.com</p>
                </div>
                <span className="px-2 py-1 bg-purple-950/50 text-purple-400 border border-purple-900/50 rounded-md text-xs font-medium">Administrador</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">Equipa de Chão de Fábrica</p>
                  <p className="text-xs text-zinc-500">producao@grupohmaz.com</p>
                </div>
                <span className="px-2 py-1 bg-blue-950/50 text-blue-400 border border-blue-900/50 rounded-md text-xs font-medium">Visualizador (TV)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tipos de Pagamento */}
        <div className="bg-[#121214] rounded-xl border border-zinc-800 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900/20 text-emerald-500 rounded-lg"><CreditCard size={20} /></div>
              <h3 className="text-zinc-100 font-medium">Tipos de Pagamento</h3>
            </div>
            <button className="text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus size={14} /> Adicionar
            </button>
          </div>
          <div className="p-5 flex-1">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 border-b border-zinc-800/50">
                <span className="text-zinc-300">Transferência Bancária (TED/PIX)</span>
                <span className="text-emerald-400 text-xs">Ativo</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-zinc-800/50">
                <span className="text-zinc-300">Boleto a 30/60/90 dias</span>
                <span className="text-emerald-400 text-xs">Ativo</span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-zinc-300">Cartão BNDES</span>
                <span className="text-zinc-500 text-xs">Inativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}