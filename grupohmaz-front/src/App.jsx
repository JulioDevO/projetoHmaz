import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import Pedidos from './pages/Pedidos';
import Configuracoes from './pages/Configuracoes';

function ProtectedRoute({ children, roleRequerida }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequerida && user.role !== roleRequerida) {
    return <Navigate to="/pedidos" replace />;
  }

  return children;
}

function RootRoute() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={user.role === 'admin' ? '/analytics' : '/pedidos'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute roleRequerida="admin">
                <Analytics />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pedidos" 
            element={
              <ProtectedRoute>
                <Pedidos />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/configuracoes" 
            element={
              <ProtectedRoute roleRequerida="admin">
                <Configuracoes />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}