import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Busca a sessão ativa ao abrir o site
    supabase.auth.getSession().then(({ data: { session } }) => {
      atualizarUsuario(session);
      setLoading(false);
    });

    // 2. Escuta mudanças em tempo real (login, logout, token expirado)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      atualizarUsuario(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const atualizarUsuario = (session) => {
    if (session?.user) {
      const email = session.user.email || '';
      setUser({
        id: session.user.id,
        email: email,
        nome: email.includes('admin') ? 'Administrador' : 'Equipe de Produção',
        role: email.includes('admin') ? 'admin' : 'equipe'
      });
    } else {
      setUser(null);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Previne redirecionamentos falsos enquanto o Supabase valida o token
  if (loading) {
    return <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] flex items-center justify-center text-zinc-500">A carregar sistema...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);