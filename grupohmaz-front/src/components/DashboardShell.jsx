import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { 
  LayoutDashboard, Kanban, Users, Settings, Wrench, LogOut, ChevronLeft, Menu, User, MessageSquare, X
} from 'lucide-react';

export default function DashboardShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Estados de controlo do menu
  const [isCollapsed, setIsCollapsed] = useState(false); // Para Desktop
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Para Mobile

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Navega e fecha o menu mobile automaticamente
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getRoleLabel = (role) => {
    if (role === 'dev') return 'Desenvolvedor';
    if (role === 'admin') return 'Administrativo';
    return 'Operacional';
  };

  return (
    // Flex-col no mobile (header em cima, main em baixo), Flex-row no desktop
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300 flex-col md:flex-row">
      
      {/* HEADER MOBILE (Visível apenas em ecrãs pequenos) */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#121214] border-b border-zinc-200 dark:border-zinc-800 shrink-0 z-30">
        <div className="overflow-hidden whitespace-nowrap">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500 truncate">Grupo Hmaz</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* OVERLAY MOBILE (Fundo escuro ao abrir o menu) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* BARRA LATERAL (Adaptativa Mobile/Desktop) */}
      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-50 flex flex-col justify-between bg-white dark:bg-[#121214] border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out shrink-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 
          w-64 ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        `}
      >
        <div className="flex flex-col overflow-hidden">

          {/* Cabeçalho da Barra Lateral */}
          <div className={`h-16 p-4 flex items-center ${isCollapsed ? 'md:justify-center justify-between' : 'justify-between'} border-b border-zinc-200 dark:border-zinc-800 shrink-0`}>
            <div className={`overflow-hidden whitespace-nowrap ${isCollapsed ? 'block md:hidden' : 'block'}`}>
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500 truncate">Grupo Hmaz</h1>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block truncate mt-0.5 uppercase tracking-wider font-medium">Máquinas Customizadas</span>
            </div>
            
            {/* Botão de Recolher (Desktop) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expandir menu" : "Recolher menu"}
              className="hidden md:flex p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none"
            >
              {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Botão de Fechar Menu (Mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex md:hidden p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex flex-col gap-1.5 p-3 overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => handleNavigation('/pedidos')} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${isCollapsed ? 'md:justify-center md:px-0 md:w-11 md:h-11 md:mx-auto md:gap-0' : ''}
                ${isActive('/pedidos') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}
              `}
            >
              <Kanban size={18} className="shrink-0" />
              <span className={`truncate ${isCollapsed ? 'block md:hidden' : 'block'}`}>Pedidos</span>
            </button>

            {(user?.role === 'admin' || user?.role === 'dev') && (
              <button 
                onClick={() => handleNavigation('/analytics')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  ${isCollapsed ? 'md:justify-center md:px-0 md:w-11 md:h-11 md:mx-auto md:gap-0' : ''}
                  ${isActive('/analytics') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}
                `}
              >
                <LayoutDashboard size={18} className="shrink-0" />
                <span className={`truncate ${isCollapsed ? 'block md:hidden' : 'block'}`}>Análises</span>
              </button>
            )}

            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 mx-2"></div>

            <button 
              onClick={() => handleNavigation('/clientes')} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${isCollapsed ? 'md:justify-center md:px-0 md:w-11 md:h-11 md:mx-auto md:gap-0' : ''}
                ${isActive('/clientes') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}
              `}
            >
              <Users size={18} className="shrink-0" />
              <span className={`truncate ${isCollapsed ? 'block md:hidden' : 'block'}`}>Clientes</span>
            </button>

            <button 
              onClick={() => handleNavigation('/maquinas')} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${isCollapsed ? 'md:justify-center md:px-0 md:w-11 md:h-11 md:mx-auto md:gap-0' : ''}
                ${isActive('/maquinas') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}
              `}
            >
              <Wrench size={18} className="shrink-0" />
              <span className={`truncate ${isCollapsed ? 'block md:hidden' : 'block'}`}>Máquinas</span>
            </button>

            {/* Menu exclusivo Dev */}
            {user?.role === 'dev' && (
              <>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 mx-2"></div>
                <button 
                  onClick={() => handleNavigation('/configuracoes')} 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    ${isCollapsed ? 'md:justify-center md:px-0 md:w-11 md:h-11 md:mx-auto md:gap-0' : ''}
                    ${isActive('/configuracoes') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}
                  `}
                >
                  <Settings size={18} className="shrink-0" />
                  <span className={`truncate ${isCollapsed ? 'block md:hidden' : 'block'}`}>Configurações</span>
                </button>
              </>
            )}

            {/* Menu de Feedbacks (Admin e Dev) */}
            {(user?.role === 'admin' || user?.role === 'dev') && (
              <>
                {user?.role !== 'dev' && <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 mx-2"></div>}
                <button 
                  onClick={() => handleNavigation('/feedbacks')} 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    ${isCollapsed ? 'md:justify-center md:px-0 md:w-11 md:h-11 md:mx-auto md:gap-0' : ''}
                    ${isActive('/feedbacks') ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}
                  `}
                >
                  <MessageSquare size={18} className="shrink-0" />
                  <span className={`truncate ${isCollapsed ? 'block md:hidden' : 'block'}`}>Feedbacks</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Rodapé da barra lateral (Perfil e Logout) */}
        <div className={`p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white dark:bg-[#121214] ${isCollapsed ? 'md:flex-col md:justify-center md:gap-4' : ''}`}>
          <div className="flex items-center gap-3 overflow-hidden" title={getRoleLabel(user?.role)}>
            <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shrink-0">
              <User size={18} />
            </div>
            <div className={`overflow-hidden ${isCollapsed ? 'block md:hidden' : 'block'}`}>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {getRoleLabel(user?.role)}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            aria-label="Sair do sistema"
            className={`p-2 rounded-md transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 ${isCollapsed ? 'md:w-10 md:h-10 md:flex md:items-center md:justify-center md:mt-2 md:bg-zinc-50 md:dark:bg-zinc-900' : ''}`}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col bg-zinc-50 dark:bg-[#0a0a0a] transition-colors duration-300 min-w-0 z-10 relative">
        <div className="p-6 md:p-8 flex-1 overflow-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}