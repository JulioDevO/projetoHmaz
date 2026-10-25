import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import DashboardShell from './components/DashboardShell';
import Analytics from './pages/Analytics';
import Pedidos from './pages/Pedidos';
import Clientes from './pages/Clientes';
import Maquinas from './pages/Maquinas';
import Configuracoes from './pages/Configuracoes';

function ProtectedRoute({ children, rolesPermitidas }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se o utilizador tem uma das roles permitidas (ex: admin ou dev)
  if (rolesPermitidas && !rolesPermitidas.includes(user.role)) {
    return <Navigate to="/pedidos" replace />;
  }

  return children;
}

function RootRoute() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to="/pedidos" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute><DashboardShell /></ProtectedRoute>}>
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/maquinas" element={<Maquinas />} />
            
            {/* Agora permite tanto admin quanto dev */}
            <Route path="/configuracoes" element={
              <ProtectedRoute rolesPermitidas={['admin', 'dev']}>
                <Configuracoes />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}