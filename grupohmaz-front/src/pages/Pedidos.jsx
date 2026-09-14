import { useState } from 'react';
import { AlertCircle, Calendar, Package, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
// 1. IMPORTAÇÃO DO MODAL AQUI:
import OrderDrawer from '../components/OrderDrawer';

const mockPedidos = [
  { id: 'PED-1043', cliente: 'Indústria Ferro & Aço Ltda.', maquina: 'Dobradeira CNC 160 ton', tag: 'Dobradeira', status: 'a-fazer', entrega: '15/09/2026', qty: 3, esp: '12 mm' },
  { id: 'PED-1042', cliente: 'Metalúrgica São Jorge', maquina: 'Corte a Laser Fibra 3kW', tag: 'Corte a Laser', status: 'em-producao', entrega: '29/08/2026', qty: 12, esp: '8 mm', pendencia: 'Falta de peça', atraso: '2d' },
  { id: 'PED-1046', cliente: 'Tubos & Perfis do Sul', maquina: 'Calandra de 3 Rolos 2000mm', tag: 'Calandra', status: 'concluido', entrega: '10/08/2026', qty: 1, esp: '10 mm' },
];

export default function Pedidos() {
  const filtrarPorStatus = (status) => mockPedidos.filter(p => p.status === status);

  // 2. ESTADO DO MODAL AQUI:
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Acompanhamento de Produção</h2>
          <p className="text-zinc-400 text-sm mt-1">Gerencie o fluxo de pedidos por etapa</p>
        </div>
        
        {/* 3. ONCLICK NO BOTÃO PARA ABRIR: */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2"
        >
          + Novo Pedido
        </button>
      </div>

      {/* 4. COMPONENTE DO MODAL RENDERIZADO AQUI: */}
      <OrderDrawer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Grid do Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
        <Coluna titulo="A Fazer" corBolha="bg-zinc-500" pedidos={filtrarPorStatus('a-fazer')} />
        <Coluna titulo="Em Produção" corBolha="bg-blue-500" pedidos={filtrarPorStatus('em-producao')} />
        <Coluna titulo="Concluído" corBolha="bg-emerald-500" pedidos={filtrarPorStatus('concluido')} />
      </div>
    </div>
  );
}

function Coluna({ titulo, corBolha, pedidos }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 transition-all ${isCollapsed ? 'h-auto' : 'min-h-[500px]'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${corBolha}`}></span>
          <h3 className="font-medium text-zinc-100">{titulo}</h3>
          <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-full font-medium ml-1">
            {pedidos.length}
          </span>
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 p-1 rounded-md transition-colors"
          title={isCollapsed ? "Expandir coluna" : "Recolher coluna"}
        >
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col gap-3">
          {pedidos.map(pedido => (
            <CartaoPedido key={pedido.id} pedido={pedido} />
          ))}
        </div>
      )}
    </div>
  );
}

function CartaoPedido({ pedido }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-md cursor-pointer hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-zinc-100 text-sm">{pedido.cliente}</h4>
          <span className="text-xs text-zinc-500">{pedido.id}</span>
        </div>
        <span className="bg-zinc-900 text-zinc-300 text-xs px-2 py-1 rounded-md border border-zinc-800">
          {pedido.tag}
        </span>
      </div>
      
      <p className="text-sm text-zinc-300 mb-3">{pedido.maquina}</p>
      
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <Package size={14} /> {pedido.qty} un.
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <Settings2 size={14} /> {pedido.esp}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-zinc-400 border-t border-zinc-800 pt-3">
        <div className="flex items-center gap-1">
          <Calendar size={14} /> Entrega: {pedido.entrega}
        </div>
        {pedido.atraso && <span className="text-red-400 font-medium">{pedido.atraso}</span>}
      </div>

      {pedido.pendencia && (
        <div className="mt-3 bg-red-950/30 border border-red-900/50 text-red-400 text-xs px-3 py-2 rounded flex items-center gap-2">
          <AlertCircle size={14} /> Pendência: {pedido.pendencia}
        </div>
      )}
    </div>
  );
}