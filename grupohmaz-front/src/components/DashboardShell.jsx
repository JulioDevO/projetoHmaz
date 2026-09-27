import { Outlet, Link } from 'react-router-dom';

export default function DashboardShell() {
  return (
    <div className="flex h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      
      {/* Sidebar / Navegação Lateral */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-blue-500">Grupo Hmaz</h1>
            <span className="text-xs text-zinc-400 block mt-1">Máquinas Customizadas</span>
          </div>
          
          <nav className="flex flex-col gap-2">
            <Link to="/pedidos" className="px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors">
              Pedidos
            </Link>
            <Link to="/analytics" className="px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors">
              Análises
            </Link>
            
            <div className="h-px bg-zinc-800 my-2 mx-4"></div>
            
            <Link to="/clientes" className="px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors">
              Clientes
            </Link>
            <Link to="/maquinas" className="px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors">
              Máquinas
            </Link>
          </nav>
        </div>

        {/* Perfil do Usuário na Base */}
        <div className="p-6 border-t border-zinc-800 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold">
              N
            </div>
            <div>
              <p className="text-sm font-medium">Ricardo Campos</p>
              <p className="text-xs text-zinc-500">Gerente de Produção</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      {/* Área Principal */}
      <main className="flex-1 flex flex-col bg-[#0a0a0a]">
        {/* Conteúdo Dinâmico das Páginas (O header foi removido) */}
        <div className="p-8 flex-1 overflow-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}