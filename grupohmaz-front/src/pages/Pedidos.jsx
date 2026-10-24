import { useState, useEffect } from 'react';
import { Plus, MonitorPlay, MoreHorizontal, Package, Calendar, AlertCircle, GripVertical, Minimize2, Link2, Check, Edit2 } from 'lucide-react';
import OrderDrawer from '../components/OrderDrawer';
import { supabase } from '../supabaseClient';

const colunasIniciais = [
  { id: 'Pendente', titulo: 'A Fazer', cor: 'bg-zinc-500', borda: 'border-t-zinc-500', pedidos: [] },
  { id: 'Em Producao', titulo: 'Em Produção', cor: 'bg-blue-500', borda: 'border-t-blue-500', pedidos: [] },
  { id: 'Revisao', titulo: 'Revisão', cor: 'bg-amber-500', borda: 'border-t-amber-500', pedidos: [] },
  { id: 'Concluido', titulo: 'Concluído', cor: 'bg-emerald-500', borda: 'border-t-emerald-500', pedidos: [] },
  { id: 'Cancelado', titulo: 'Descartados', cor: 'bg-red-500', borda: 'border-t-red-500', pedidos: [] }
];

export default function Pedidos() {
  const [colunas, setColunas] = useState(colunasIniciais);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null); // Guarda o pedido que será editado
  
  const [dragInfo, setDragInfo] = useState(null);
  const [dropTarget, setDropTarget] = useState({ colId: null, index: null });
  
  const [modoTV, setModoTV] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function carregarPedidos() {
    try {
      const { data, error } = await supabase.from('pedidos').select('*');
      if (error) throw error;

      const pedidosFormatados = (data || []).map((p) => ({
        dbId: p.id,
        id: `PED-${p.id}`,
        cliente: p.cliente || 'Cliente não definido',
        maquina: p.produto || 'Produto não definido',
        tag: 'Geral',
        qtd: p.quantidade || 1,
        valorRaw: p.valor_total || 0, // Valor puro para o formulário de edição
        valor: `R$ ${p.valor_total || 0}`,
        prazo: new Date(p.created_at).toLocaleDateString(),
        dias: '',
        statusOriginal: p.status || 'Pendente'
      }));

      setColunas(colunasIniciais.map((coluna) => ({
        ...coluna,
        pedidos: pedidosFormatados.filter((ped) => ped.statusOriginal === coluna.id)
      })));
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err.message);
    }
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  const handleDragStart = (e, pedido, colId, index) => {
    setDragInfo({ pedido, sourceColId: colId, sourceIndex: index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverCard = (e, colId, index) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const targetIndex = e.clientY < (rect.top + rect.height / 2) ? index : index + 1;

    if (dropTarget.colId !== colId || dropTarget.index !== targetIndex) {
      setDropTarget({ colId, index: targetIndex });
    }
  };

  const handleDragOverColumn = (e, colId, totalPedidos) => {
    e.preventDefault();
    if (dropTarget.colId !== colId || dropTarget.index === null) {
      setDropTarget({ colId, index: totalPedidos });
    }
  };

  const handleDrop = async (e, targetColId) => {
    e.preventDefault();
    if (!dragInfo) return;

    const { pedido, sourceColId, sourceIndex } = dragInfo;
    let targetIndex = dropTarget.colId === targetColId && dropTarget.index !== null
      ? dropTarget.index : colunas.find((c) => c.id === targetColId).pedidos.length;

    setColunas((prevCols) => {
      const novasColunas = prevCols.map((col) => ({ ...col, pedidos: [...col.pedidos] }));
      const colOrigem = novasColunas.find((c) => c.id === sourceColId);
      const colDestino = novasColunas.find((c) => c.id === targetColId);

      colOrigem.pedidos.splice(sourceIndex, 1);
      if (sourceColId === targetColId && sourceIndex < targetIndex) targetIndex -= 1;
      
      colDestino.pedidos.splice(targetIndex, 0, { ...pedido, statusOriginal: targetColId });
      return novasColunas;
    });

    try {
      await supabase.from('pedidos').update({ status: targetColId }).eq('id', pedido.dbId);
    } catch (err) {
      console.error('Erro ao atualizar status:', err.message);
    }

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
    <div className={`flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 transition-colors duration-300 ${modoTV ? 'fixed inset-0 z-50 bg-zinc-50 dark:bg-[#0a0a0a] p-6' : ''}`}>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Pedidos</h2>
            {modoTV && <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800/60 text-xs px-2.5 py-0.5 rounded-full font-medium animate-pulse">Exibição Linha de Produção (TV)</span>}
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">Arraste os cartões para alterar a etapa ou definir a ordem de prioridade</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={copiarLinkTV} className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded-md font-medium text-xs transition-colors border border-zinc-300 dark:border-zinc-800 flex items-center gap-1.5 shadow-sm">
            {copiado ? <Check size={15} className="text-emerald-500" /> : <Link2 size={15} />} {copiado ? 'Link Copiado!' : 'Copiar Link TV'}
          </button>
          <button onClick={() => setModoTV(!modoTV)} className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-3.5 py-2 rounded-md font-medium text-xs transition-colors border border-zinc-300 dark:border-zinc-800 flex items-center gap-1.5 shadow-sm">
            {modoTV ? <Minimize2 size={15} /> : <MonitorPlay size={15} />} {modoTV ? 'Sair do Modo TV' : 'Modo TV'}
          </button>
          {!modoTV && (
            <button onClick={() => setIsDrawerOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 shadow-sm">
              <Plus size={16} /> Novo Pedido
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 min-h-0 overflow-y-auto xl:overflow-hidden pb-2">
        {colunas.map((coluna) => (
          <div key={coluna.id} onDragOver={(e) => handleDragOverColumn(e, coluna.id, coluna.pedidos.length)} onDrop={(e) => handleDrop(e, coluna.id)} className={`bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800/80 border-t-2 ${coluna.borda} p-3 flex flex-col h-full min-h-[280px] transition-colors shadow-sm ${dropTarget.colId === coluna.id ? 'bg-zinc-100 dark:bg-zinc-900/50 border-zinc-400 dark:border-zinc-700' : ''}`}>
            <div className="flex items-center justify-between mb-3 px-1 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${coluna.cor}`}></span>
                <h3 className="font-medium text-zinc-800 dark:text-zinc-200 text-sm">{coluna.titulo}</h3>
                <span className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 text-[11px] px-2 py-0.5 rounded-full font-medium">{coluna.pedidos.length}</span>
              </div>
              <MoreHorizontal size={16} className="text-zinc-400" />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2.5 pr-1">
              {coluna.pedidos.map((pedido, index) => {
                const isBeingDragged = dragInfo?.pedido.id === pedido.id;
                const showIndicatorTop = dropTarget.colId === coluna.id && dropTarget.index === index;

                return (
                  <div key={pedido.id} className="flex flex-col">
                    {showIndicatorTop && <div className="h-1 bg-blue-500 rounded-full mb-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                    <div draggable onDragStart={(e) => handleDragStart(e, pedido, coluna.id, index)} onDragOver={(e) => handleDragOverCard(e, coluna.id, index)} onDragEnd={handleDragEnd} className={`bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/90 p-3.5 rounded-lg cursor-grab active:cursor-grabbing hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm group ${isBeingDragged ? 'opacity-40 scale-[0.98] border-dashed' : ''}`}>
                      
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <div className="flex items-start gap-1.5 min-w-0">
                          <GripVertical size={14} className="text-zinc-400 dark:text-zinc-600 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-xs truncate">{pedido.cliente}</h4>
                            <p className="text-[11px] text-zinc-500 mt-0.5">{pedido.id}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="bg-zinc-200/70 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 text-[10px] px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700/50">{pedido.tag || 'Geral'}</span>
                          <button 
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); setPedidoEditando(pedido); setIsDrawerOpen(true); }}
                            className="text-zinc-400 hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400 p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/10 cursor-pointer relative z-10"
                          >
                            <Edit2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-3 pl-5 line-clamp-1">{pedido.maquina}</p>
                      <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-3 pl-5">
                        <span className="flex items-center gap-1"><Package size={13} /> {pedido.qtd} un.</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400/90">{pedido.valor}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] border-t border-zinc-200 dark:border-zinc-800/80 pt-2.5 text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {pedido.prazo}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {dropTarget.colId === coluna.id && dropTarget.index === coluna.pedidos.length && coluna.pedidos.length > 0 && <div className="h-1 bg-blue-500 rounded-full mt-0.5 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
              {coluna.pedidos.length === 0 && <div className="flex-1 border border-dashed border-zinc-300 dark:border-zinc-800/70 rounded-lg flex items-center justify-center p-4 text-xs text-zinc-400 dark:text-zinc-600 text-center min-h-[100px]">Arraste um pedido para cá</div>}
            </div>
          </div>
        ))}
      </div>

      <OrderDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => { setIsDrawerOpen(false); setPedidoEditando(null); }} 
        onSuccess={carregarPedidos} 
        pedidoParaEditar={pedidoEditando} 
      />
    </div>
  );
}