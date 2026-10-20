import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Hexagon } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

 const handleLogin = (e) => {
    e.preventDefault();
    navigate('/analytics'); 
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-blue-500">
          <Hexagon size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">Grupo Hmaz</h2>
        <p className="mt-2 text-center text-sm text-zinc-400">Acesse o sistema de gestão ERP</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-950 py-8 px-4 shadow sm:rounded-xl border border-zinc-800 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-zinc-300">E-mail Corporativo</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input 
                  type="email" 
                  required 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md pl-10 p-2.5 text-sm text-white focus:outline-none focus:border-blue-500" 
                  placeholder="admin@grupohmaz.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">Senha</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input 
                  type="password" 
                  required 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md pl-10 p-2.5 text-sm text-white focus:outline-none focus:border-blue-500" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors items-center"
              >
                Entrar no Sistema <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}