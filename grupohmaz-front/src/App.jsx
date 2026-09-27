import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardShell from './components/DashboardShell';
import Pedidos from './pages/Pedidos';
import Analytics from './pages/Analytics';
import Clientes from './pages/Clientes'; // <-- Importar
import Maquinas from './pages/Maquinas'; // <-- Importar

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardShell />}>
          <Route index element={<Navigate to="/pedidos" replace />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="clientes" element={<Clientes />} /> {/* <-- Nova rota */}
          <Route path="maquinas" element={<Maquinas />} /> {/* <-- Nova rota */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}