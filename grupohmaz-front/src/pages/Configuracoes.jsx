import { useState } from 'react';
import { CreditCard, Users, Plus, LayoutDashboard, Kanban, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Configuracoes() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarColapsada, setSidebarColapsada] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0a] text-zinc-100">
      
      <aside className={`${sidebarColapsada ? 'w-20' : 'w-64'} bg-[#121214] border-r border-zinc-800 flex flex-col justify-between p-4 flex-shrink-0 transition-all duration-300 relative`}>
        <div className="flex flex-col gap-6 overflow-hidden">
          
          <div className="flex items-center justify-between px-2 py-1">
            {!sidebarColapsada ? (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-sm flex-shrink-0">H</div>
                <span className="font-semibold text-base tracking-tight text-white truncate">Grupo Hmaz</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-2 h-7 bg-blue-600 rounded-r-full"></div>
              </div>
            )}

            <button 
              onClick={() => setSidebarColapsada(!sidebarColapsada)}
              className="text-zinc-400 hover:text-white transition-colors p-1"
              title={sidebarColapsada ? "Expandir barra" : "Recolher barra"}
            >
              {sidebarColapsada ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 mt-2">
            <button 
              onClick={() => navigate('/analytics')} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors text-left ${sidebarColapsada ? 'justify-center px-0' : ''}`}
              title="Analytics & Faturamento"
            >
              <LayoutDashboard size={18} className="flex-shrink-0" /> 
              {!sidebarColapsada && <span className="truncate">Analytics & Faturamento</span>}
            </button>

            <button 
              onClick={() => navigate('/pedidos')} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors text-left ${sidebarColapsada ? 'justify-center px-0' : ''}`}
              title="Pedidos (Kanban)"
            >
              <Kanban size={18} className="flex-shrink-0" /> 
              {!sidebarColapsada && <span className="truncate">Pedidos (Kanban)</span>}
            </button>

            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/configuracoes')} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-950/30 text-blue-400 transition-colors text-left border border-blue-900/50 ${sidebarColapsada ? 'justify-center px-0' : ''}`}
                title="Configurações"
              >
                <Settings size={18} className="flex-shrink-0" /> 
                {!sidebarColapsada && <span className="truncate">Configurações</span>}
              </button>
            )}
          </nav>
        </div>

        <div className={`text-xs text-zinc-600 px-2 ${sidebarColapsada ? 'text-center text-[10px]' : ''}`}>
          {sidebarColapsada ? 'v1.2' : 'ERP Gestão v1.2'}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto p-6">
        <div className="flex flex-col h-full overflow-y-auto pb-6">
          <div className="flex justify-between items-center mb-6 px-2">
            <div>
              <h2 className="text-2xl font-semibold text-white">Configurações</h2>
              <p className="text-zinc-400 text-sm mt-1">Gestão de usuários, acessos e parâmetros do ERP</p>
            </div>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-red-400 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut size={16} /> Sair
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
            <div className="bg-[#121214] rounded-xl border border-zinc-800 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/20 text-blue-500 rounded-lg"><Users size={20} /></div>
                  <h3 className="text-zinc-100 font-medium">Usuários e Acessos</h3>
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
                      <p className="text-sm font-medium text-white">Equipe de Chão de Fábrica</p>
                      <p className="text-xs text-zinc-500">producao@grupohmaz.com</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-950/50 text-blue-400 border border-blue-900/50 rounded-md text-xs font-medium">Visualizador (TV)</span>
                  </div>
                </div>
              </div>
            </div>

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
      </div>
    </div>
  );
}