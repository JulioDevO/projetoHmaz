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
    });

    // 2. Escuta mudanças em tempo real (login, logout, token expirado)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      atualizarUsuario(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const atualizarUsuario = async (session) => {
    if (session?.user) {
      try {
        // Busca o perfil real na tabela perfis do Supabase
        const { data: perfil, error } = await supabase
          .from('perfis')
          .select('nome, nivel_acesso')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        setUser({
          id: session.user.id,
          email: session.user.email,
          nome: perfil?.nome || 'Usuário',
          role: perfil?.nivel_acesso || 'equipe'
        });
      } catch (error) {
        console.error('Erro ao buscar perfil:', error.message);
        // Fallback de segurança
        setUser({
          id: session.user.id,
          email: session.user.email,
          nome: 'Usuário',
          role: 'equipe'
        });
      }
    } else {
      setUser(null);
    }
    setLoading(false);
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