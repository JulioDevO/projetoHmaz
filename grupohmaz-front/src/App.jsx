import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardShell from './components/DashboardShell';
import Pedidos from './pages/Pedidos';
import Analytics from './pages/Analytics'; // <-- Nova página

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardShell />}>
          <Route index element={<Navigate to="/pedidos" replace />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="analytics" element={<Analytics />} /> {/* <-- Nova rota combinada */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}