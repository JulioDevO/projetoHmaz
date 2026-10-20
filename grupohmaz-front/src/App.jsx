import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardShell from './components/DashboardShell';
import Pedidos from './pages/Pedidos';
import Analytics from './pages/Analytics';
import Clientes from './pages/Clientes';
import Maquinas from './pages/Maquinas';
import Configuracoes from './pages/Configuracoes'; // <-- Importação adicionada
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Todas as páginas com o Menu Lateral ficam dentro do DashboardShell */}
        <Route path="/" element={<DashboardShell />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="maquinas" element={<Maquinas />} />
          <Route path="configuracoes" element={<Configuracoes />} /> {/* <-- Rota no lugar correto */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}