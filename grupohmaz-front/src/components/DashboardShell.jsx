import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, Kanban, Users, Settings, Wrench, LogOut
} from 'lucide-react';

export default function DashboardShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      <aside className="w-64 bg-white dark:bg-[#121214] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-4 flex-shrink-0 transition-colors duration-300">
        <div className="flex flex-col gap-6 overflow-hidden">
          <div className="px-2 py-1">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500">Grupo Hmaz</h1>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-1">Máquinas Customizadas</span>
          </div>
          
          <nav className="flex flex-col gap-1.5 mt-2">
            <button 
              onClick={() => navigate('/pedidos')} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${isActive('/pedidos') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              <Kanban size={18} className="flex-shrink-0" />
              <span className="truncate">Pedidos</span>
            </button>
            
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/analytics')} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${isActive('/analytics') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
              >
                <LayoutDashboard size={18} className="flex-shrink-0" />
                <span className="truncate">Análises</span>
              </button>
            )}
            
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 mx-2"></div>
            
            <button 
              onClick={() => navigate('/clientes')} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${isActive('/clientes') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              <Users size={18} className="flex-shrink-0" />
              <span className="truncate">Clientes</span>
            </button>
            
            <button 
              onClick={() => navigate('/maquinas')} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${isActive('/maquinas') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              <Wrench size={18} className="flex-shrink-0" />
              <span className="truncate">Máquinas</span>
            </button>
            
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 mx-2"></div>
            
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/configuracoes')} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${isActive('/configuracoes') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
              >
                <Settings size={18} className="flex-shrink-0" />
                <span className="truncate">Configurações</span>
              </button>
            )}
          </nav>
        </div>

        {/* Rodapé com Botão de Logout */}
        <div className="p-3 mt-auto border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase shrink-0">
              {user?.nome ? user.nome.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{user?.nome || 'Usuário'}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize truncate">{user?.role === 'admin' ? 'Administrador' : 'Equipe'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer shrink-0"
            title="Sair do sistema"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-zinc-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="p-6 md:p-8 flex-1 overflow-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}