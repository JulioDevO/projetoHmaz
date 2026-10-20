import { Plus, MonitorPlay, MoreHorizontal, Package, Calendar, AlertCircle, GripVertical, Minimize2, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import OrderDrawer from '../components/OrderDrawer';

const colunasIniciais = [
  { id: 'todo', titulo: 'A Fazer', cor: 'bg-zinc-500', borda: 'border-t-zinc-500', pedidos: [
    { id: 'PED-1043', cliente: 'Indústria Ferro & Aço Ltda.', maquina: 'Dobradeira CNC 160 ton', tag: 'Dobradeira', qtd: 3, valor: 'R$ 85.000', prazo: '15/09/2026', dias: '' },
    { id: 'PED-1048', cliente: 'Metalúrgica São Jorge', maquina: 'Calandra de 3 Rolos 2000mm', tag: 'Calandra', qtd: 1, valor: 'R$ 42.000', prazo: '22/09/2026', dias: '' },
    { id: 'PED-1052', cliente: 'Tubos & Perfis do Sul', maquina: 'Corte a Laser Fibra 3kW', tag: 'Corte a Laser', qtd: 2, valor: 'R$ 110.000', prazo: '28/09/2026', dias: '' }
  ]},
  { id: 'in_progress', titulo: 'Em Produção', cor: 'bg-blue-500', borda: 'border-t-blue-500', pedidos: [
    { id: 'PED-1042', cliente: 'Metalúrgica São Jorge', maquina: 'Corte a Laser Fibra 3kW', tag: 'Corte a Laser', qtd: 12, valor: 'R$ 190.000', prazo: '29/08/2026', dias: '2d', alerta: 'Falta de peça' }
  ]},
  { id: 'review', titulo: 'Revisão', cor: 'bg-amber-500', borda: 'border-t-amber-500', pedidos: [
    { id: 'PED-1045', cliente: 'Tubos & Perfis do Sul', maquina: 'Calandra de 4 Rolos', tag: 'Calandra', qtd: 1, valor: 'R$ 64.000', prazo: '10/09/2026', dias: '' }
  ]},
  { id: 'done', titulo: 'Concluído', cor: 'bg-emerald-500', borda: 'border-t-emerald-500', pedidos: [
    { id: 'PED-1046', cliente: 'Tubos & Perfis do Sul', maquina: 'Calandra de 3 Rolos 2000mm', tag: 'Calandra', qtd: 1, valor: 'R$ 42.000', prazo: '10/08/2026', dias: '' }
  ]},
  { id: 'discarded', titulo: 'Descartados', cor: 'bg-red-500', borda: 'border-t-red-500', pedidos: [
    { id: 'PED-1040', cliente: 'Metalúrgica São Jorge', maquina: 'Prensa Hidráulica 100t', tag: 'Prensa', qtd: 2, valor: 'R$ 70.000', prazo: 'Cancelado', dias: '' }
  ]}
];

export default function Pedidos() {
  const [colunas, setColunas] = useState(colunasIniciais);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Estados para controle preciso de coluna e posição (índice)
  const [dragInfo, setDragInfo] = useState(null);
  const [dropTarget, setDropTarget] = useState({ colId: null, index: null });
  
  const [modoTV, setModoTV] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const handleDragStart = (e, pedido, colId, index) => {
    setDragInfo({ pedido, sourceColId: colId, sourceIndex: index });
    e.dataTransfer.effectAllowed = 'move';
  };

  // Calcula se o mouse está na metade superior ou inferior do cartão alvo
  const handleDragOverCard = (e, colId, index) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const metadeAltura = rect.top + rect.height / 2;
    const targetIndex = e.clientY < metadeAltura ? index : index + 1;

    if (dropTarget.colId !== colId || dropTarget.index !== targetIndex) {
      setDropTarget({ colId, index: targetIndex });
    }
  };

  // Quando arrasta para o espaço vazio da coluna, joga para o final
  const handleDragOverColumn = (e, colId, totalPedidos) => {
    e.preventDefault();
    if (dropTarget.colId !== colId || dropTarget.index === null) {
      setDropTarget({ colId, index: totalPedidos });
    }
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    if (!dragInfo) return;

    const { pedido, sourceColId, sourceIndex } = dragInfo;
    let targetIndex = dropTarget.colId === targetColId && dropTarget.index !== null
      ? dropTarget.index
      : colunas.find((c) => c.id === targetColId).pedidos.length;

    setColunas((prevCols) => {
      const novasColunas = prevCols.map((col) => ({
        ...col,
        pedidos: [...col.pedidos],
      }));

      const colOrigem = novasColunas.find((c) => c.id === sourceColId);
      const colDestino = novasColunas.find((c) => c.id === targetColId);

      // Remove da posição original
      colOrigem.pedidos.splice(sourceIndex, 1);

      // Ajusta o índice caso esteja movendo para baixo dentro da mesma coluna
      if (sourceColId === targetColId && sourceIndex < targetIndex) {
        targetIndex -= 1;
      }

      // Insere na exata posição escolhida
      colDestino.pedidos.splice(targetIndex, 0, pedido);

      return novasColunas;
    });

    setDragInfo(null);
    setDropTarget({ colId: null, index: null });
  };

  const handleDragEnd = () => {
    setDragInfo(null);
    setDropTarget({ colId: null, index: null });
  };

  const copiarLinkTV = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/pedidos?tv=true`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden animate-in fade-in duration-500 ${modoTV ? 'fixed inset-0 z-50 bg-[#0a0a0a] p-6' : ''}`}>
      
      {/* Cabeçalho */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-white">Pedidos</h2>
            {modoTV && (
              <span className="bg-blue-950/80 text-blue-400 border border-blue-800/60 text-xs px-2.5 py-0.5 rounded-full font-medium animate-pulse">
                Exibição Linha de Produção (TV)
              </span>
            )}
          </div>
          <p className="text-zinc-400 text-sm mt-0.5">Arraste os cartões para alterar a etapa ou definir a ordem de prioridade</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={copiarLinkTV}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-2 rounded-md font-medium text-xs transition-colors border border-zinc-800 flex items-center gap-1.5"
            title="Copiar link público para a TV da fábrica"
          >
            {copiado ? <Check size={15} className="text-emerald-400" /> : <Link2 size={15} />}
            {copiado ? 'Link Copiado!' : 'Copiar Link TV'}
          </button>

          <button 
            onClick={() => setModoTV(!modoTV)}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-3.5 py-2 rounded-md font-medium text-xs transition-colors border border-zinc-800 flex items-center gap-1.5"
          >
            {modoTV ? <Minimize2 size={15} /> : <MonitorPlay size={15} />}
            {modoTV ? 'Sair do Modo TV' : 'Modo TV'}
          </button>

          {!modoTV && (
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={16} /> Novo Pedido
            </button>
          )}
        </div>
      </div>

      {/* Grid das 5 Colunas */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 min-h-0 overflow-y-auto xl:overflow-hidden pb-2">
        {colunas.map((coluna) => (
          <div 
            key={coluna.id} 
            onDragOver={(e) => handleDragOverColumn(e, coluna.id, coluna.pedidos.length)}
            onDrop={(e) => handleDrop(e, coluna.id)}
            className={`bg-[#121214] rounded-xl border border-zinc-800/80 border-t-2 ${coluna.borda} p-3 flex flex-col h-full min-h-[280px] transition-colors ${
              dropTarget.colId === coluna.id ? 'bg-zinc-900/50 border-zinc-700' : ''
            }`}
          >
            {/* Cabeçalho da Coluna */}
            <div className="flex items-center justify-between mb-3 px-1 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${coluna.cor}`}></span>
                <h3 className="font-medium text-zinc-200 text-sm">{coluna.titulo}</h3>
                <span className="bg-zinc-800/80 text-zinc-400 text-[11px] px-2 py-0.5 rounded-full font-medium">
                  {coluna.pedidos.length}
                </span>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Área dos Cartões */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2.5 pr-1">
              {coluna.pedidos.map((pedido, index) => {
                const isBeingDragged = dragInfo?.pedido.id === pedido.id;
                const showIndicatorTop = dropTarget.colId === coluna.id && dropTarget.index === index;

                return (
                  <div key={pedido.id} className="flex flex-col">
                    {/* Linha azul indicadora de posição (Topo do cartão) */}
                    {showIndicatorTop && (
                      <div className="h-1 bg-blue-500 rounded-full mb-2 transition-all shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    )}

                    <div 
                      draggable
                      onDragStart={(e) => handleDragStart(e, pedido, coluna.id, index)}
                      onDragOver={(e) => handleDragOverCard(e, coluna.id, index)}
                      onDragEnd={handleDragEnd}
                      className={`bg-[#18181b] border border-zinc-800/90 p-3.5 rounded-lg cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-all shadow-sm group ${
                        isBeingDragged ? 'opacity-40 scale-[0.98] border-dashed border-zinc-600' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <div className="flex items-start gap-1.5 min-w-0">
                          <GripVertical size={14} className="text-zinc-600 group-hover:text-zinc-400 mt-0.5 shrink-0 transition-colors" />
                          <div className="min-w-0">
                            <h4 className="font-medium text-zinc-100 text-xs leading-snug truncate" title={pedido.cliente}>
                              {pedido.cliente}
                            </h4>
                            <p className="text-[11px] text-zinc-500 mt-0.5">{pedido.id}</p>
                          </div>
                        </div>
                        <span className="bg-zinc-800/70 text-zinc-300 text-[10px] px-2 py-0.5 rounded border border-zinc-700/50 shrink-0">
                          {pedido.tag}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 mb-3 pl-5 line-clamp-1" title={pedido.maquina}>
                        {pedido.maquina}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-3 pl-5">
                        <span className="flex items-center gap-1">
                          <Package size={13} className="text-zinc-500" /> {pedido.qtd} un.
                        </span>
                        <span className="font-medium text-emerald-400/90">{pedido.valor}</span>
                      </div>

                      <div className="flex justify-between items-center text-[11px] border-t border-zinc-800/80 pt-2.5 text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-zinc-500" /> {pedido.prazo}
                        </span>
                        {pedido.dias && (
                          <span className="text-red-400 font-semibold bg-red-950/40 px-1.5 py-0.5 rounded text-[10px]">
                            +{pedido.dias}
                          </span>
                        )}
                      </div>

                      {pedido.alerta && (
                        <div className="mt-2.5 bg-red-950/30 border border-red-900/50 rounded p-1.5 flex items-center gap-1.5 text-red-400 text-[11px]">
                          <AlertCircle size={13} className="shrink-0" />
                          <span className="truncate">{pedido.alerta}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Linha azul indicadora quando solta no fim da lista */}
              {dropTarget.colId === coluna.id && dropTarget.index === coluna.pedidos.length && coluna.pedidos.length > 0 && (
                <div className="h-1 bg-blue-500 rounded-full mt-0.5 transition-all shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}

              {coluna.pedidos.length === 0 && (
                <div className="flex-1 border border-dashed border-zinc-800/70 rounded-lg flex items-center justify-center p-4 text-xs text-zinc-600 text-center min-h-[100px]">
                  Arraste um pedido para cá
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <OrderDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}