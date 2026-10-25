import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Hexagon, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/pedidos');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      setErro('Credenciais inválidas. Verifique seu e-mail e senha no Supabase.');
      setLoading(false);
    } else {
      // Redireciona sempre para pedidos, independentemente do tipo de utilizador
      navigate('/pedidos');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-blue-600 dark:text-blue-500">
          <Hexagon size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-zinc-900 dark:text-white">Grupo Hmaz</h2>
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400"></p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#121214] py-8 px-4 shadow-sm sm:rounded-xl border border-zinc-200 dark:border-zinc-800 sm:px-10 transition-colors duration-300">
          
          {erro && (
            <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-md p-3 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">E-mail Corporativo</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md pl-10 p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors" 
                  placeholder="seu.email@hmaz.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Senha</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input 
                  type="password" 
                  required 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md pl-10 p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors items-center cursor-pointer disabled:opacity-70"
              >
                {loading ? 'A verificar...' : 'Entrar no Sistema'} <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}