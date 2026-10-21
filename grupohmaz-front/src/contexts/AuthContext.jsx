import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, senha) => {
    if (email === 'admin@hmaz.com' && senha === 'admin123') {
      setUser({ nome: 'Administrador', role: 'admin' });
      return true;
    }
    if (email === 'equipe@hmaz.com' && senha === 'equipe123') {
      setUser({ nome: 'Equipe de Produção', role: 'equipe' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);