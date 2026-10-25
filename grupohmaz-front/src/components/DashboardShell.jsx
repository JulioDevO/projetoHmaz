import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { 
  LayoutDashboard, Kanban, Users, Settings, Wrench, LogOut, ChevronLeft, Menu, User
} from 'lucide-react';

export default function DashboardShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado que controla se a barra lateral está aberta ou fechada
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Função para definir o rótulo do perfil
  const getRoleLabel = (role) => {
    if (role === 'dev') return 'Desenvolvedor';
    if (role === 'admin') return 'Administrativo';
    return 'Operacional';
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Barra Lateral Adaptativa */}
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-[#121214] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between flex-shrink-0 transition-all duration-300 ease-in-out z-20`}
      >
        <div className="flex flex-col overflow-hidden">
          
          {/* Cabeçalho da Barra Lateral */}
          <div className={`h-16 p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-zinc-200 dark:border-zinc-800 shrink-0`}>
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500 truncate">Grupo Hmaz</h1>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block truncate mt-0.5 uppercase tracking-wider font-medium">Máquinas Customizadas</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
              title={isCollapsed ? "Expandir menu" : "Recolher menu"}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer shrink-0"
            >
              {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
          
          {/* Navegação */}
          <nav className="flex flex-col gap-1.5 p-3 overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => navigate('/pedidos')} 
              title={isCollapsed ? "Pedidos" : undefined}
              aria-label="Pedidos"
              className={`flex items-center ${isCollapsed ? 'justify-center px-0 w-11 h-11 mx-auto' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive('/pedidos') 
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Kanban size={18} className="shrink-0" />
              {!isCollapsed && <span className="truncate">Pedidos</span>}
            </button>
            
            {(user?.role === 'admin' || user?.role === 'dev') && (
              <button 
                onClick={() => navigate('/analytics')}
                title={isCollapsed ? "Análises" : undefined}
                aria-label="Análises"
                className={`flex items-center ${isCollapsed ? 'justify-center px-0 w-11 h-11 mx-auto' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive('/analytics') 
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <LayoutDashboard size={18} className="shrink-0" />
                {!isCollapsed && <span className="truncate">Análises</span>}
              </button>
            )}
            
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 mx-2"></div>
            
            <button 
              onClick={() => navigate('/clientes')} 
              title={isCollapsed ? "Clientes" : undefined}
              aria-label="Clientes"
              className={`flex items-center ${isCollapsed ? 'justify-center px-0 w-11 h-11 mx-auto' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive('/clientes') 
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Users size={18} className="shrink-0" />
              {!isCollapsed && <span className="truncate">Clientes</span>}
            </button>
            
            <button 
              onClick={() => navigate('/maquinas')} 
              title={isCollapsed ? "Máquinas" : undefined}
              aria-label="Máquinas"
              className={`flex items-center ${isCollapsed ? 'justify-center px-0 w-11 h-11 mx-auto' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive('/maquinas') 
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Wrench size={18} className="shrink-0" />
              {!isCollapsed && <span className="truncate">Máquinas</span>}
            </button>
            
            {user?.role === 'dev' && (
              <>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 mx-2"></div>
                <button 
                  onClick={() => navigate('/configuracoes')} 
                  title={isCollapsed ? "Configurações" : undefined}
                  aria-label="Configurações"
                  className={`flex items-center ${isCollapsed ? 'justify-center px-0 w-11 h-11 mx-auto' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive('/configuracoes') 
                      ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Settings size={18} className="shrink-0" />
                  {!isCollapsed && <span className="truncate">Configurações</span>}
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Rodapé da barra lateral (Perfil e Logout) */}
        <div className={`p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center ${isCollapsed ? 'flex-col justify-center gap-4' : 'justify-between'} shrink-0 bg-white dark:bg-[#121214]`}>
          <div className="flex items-center gap-3 overflow-hidden" title={getRoleLabel(user?.role)}>
            <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shrink-0">
              <User size={18} />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {getRoleLabel(user?.role)}
                </p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            aria-label="Sair do sistema"
            title={isCollapsed ? "Sair do sistema" : undefined}
            className={`p-2 rounded-md transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 ${isCollapsed ? 'w-10 h-10 flex items-center justify-center mt-2 bg-zinc-50 dark:bg-zinc-900' : ''}`}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col bg-zinc-50 dark:bg-[#0a0a0a] transition-colors duration-300 min-w-0">
        <div className="p-6 md:p-8 flex-1 overflow-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}