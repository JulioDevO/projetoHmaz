import { useState, useEffect } from 'react';
import { 
  ClipboardList, Settings, CheckCircle2, 
  FileText, FileSpreadsheet, Users, TrendingUp, Award
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Analytics() {
  const [abaAtiva, setAbaAtiva] = useState('operacional');

  return (
    <div className="flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* 
        ==================================================
        CABEÇALHO DA PÁGINA DE ANÁLISES 
        ==================================================
      */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Análises Financeiras e Operacionais</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Inteligência de dados, faturamento e histórico de produção</p>
        </div>
      </div>

      {/* 
        ==================================================
        NAVEGAÇÃO POR ABAS 
        ==================================================
      */}
      <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 mb-6">
        <button 
          onClick={() => setAbaAtiva('operacional')}
          className={`pb-3 text-sm font-medium transition-colors relative ${abaAtiva === 'operacional' ? 'text-blue-600 dark:text-blue-500 font-semibold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          Visão Geral e Faturamento
          {abaAtiva === 'operacional' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t-md"></span>}
        </button>
        
        <button 
          onClick={() => setAbaAtiva('historico')}
          className={`pb-3 text-sm font-medium transition-colors relative ${abaAtiva === 'historico' ? 'text-blue-600 dark:text-blue-500 font-semibold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          Histórico e Exportação
          {abaAtiva === 'historico' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t-md"></span>}
        </button>

        <button 
          onClick={() => setAbaAtiva('clientes')}
          className={`pb-3 text-sm font-medium transition-colors relative ${abaAtiva === 'clientes' ? 'text-blue-600 dark:text-blue-500 font-semibold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          Faturamento por Cliente
          {abaAtiva === 'clientes' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t-md"></span>}
        </button>
      </div>

      {/* Renderiza o componente correspondente à aba ativa */}
      {abaAtiva === 'operacional' && <VisaoOperacional />}
      {abaAtiva === 'historico' && <Historico />}
      {abaAtiva === 'clientes' && <AbaClientes />}
    </div>
  );
}

// ==================================================
// COMPONENTE: VISÃO OPERACIONAL (DASHBOARD)
// ==================================================
function VisaoOperacional() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar o 'hover' interativo do Gráfico de Status
  const [hoveredStatus, setHoveredStatus] = useState(null);

  useEffect(() => {
    async function carregarDadosAnalytics() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('pedidos').select('*');
        if (error) throw error;
        setPedidos(data || []);
      } catch (err) {
        console.error('Erro ao carregar dados operacionais:', err.message);
      } finally {
        setLoading(false);
      }
    }
    carregarDadosAnalytics();
  }, []);

  // Variáveis para cálculos dos KPIs
  const totalPedidos = pedidos.length;
  const aFazer = pedidos.filter(p => p.status === 'Pendente').length;
  const emProducao = pedidos.filter(p => p.status === 'Em Producao').length;
  const revisao = pedidos.filter(p => p.status === 'Revisao').length;
  const concluidos = pedidos.filter(p => p.status === 'Concluido').length;
  const descartados = pedidos.filter(p => p.status === 'Cancelado').length;

  const faturamentoTotal = pedidos
    .filter(p => p.status === 'Concluido')
    .reduce((acc, p) => acc + Number(p.valor_total || 0), 0);

  const ticketMedio = concluidos > 0 ? faturamentoTotal / concluidos : 0;

  // --------------------------------------------------
  // DADOS DO GRÁFICO INTERATIVO DE STATUS DOS PEDIDOS
  // --------------------------------------------------
  const dadosStatus = [
    { id: 'todo', label: 'A Fazer', value: aFazer, cor: '#71717a', bg: 'bg-zinc-500' },
    { id: 'in_progress', label: 'Em Produção', value: emProducao, cor: '#3b82f6', bg: 'bg-blue-500' },
    { id: 'review', label: 'Revisão', value: revisao, cor: '#f59e0b', bg: 'bg-amber-500' },
    { id: 'done', label: 'Concluídos', value: concluidos, cor: '#10b981', bg: 'bg-emerald-500' },
    { id: 'discarded', label: 'Descartados', value: descartados, cor: '#ef4444', bg: 'bg-red-500' }
  ];

  let acumulado = 0; // Utilizado para calcular a rotação e tamanho das fatias SVG

  // --------------------------------------------------
  // CÁLCULOS DO GRÁFICO DE BARRAS DE FATURAMENTO
  // --------------------------------------------------
  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const faturamentoPorMes = mesesNomes.map((mes, index) => {
    const valorMes = pedidos
      .filter(p => {
        if (!p.created_at || p.status !== 'Concluido') return false;
        const dataPedido = new Date(p.created_at);
        return dataPedido.getMonth() === index;
      })
      .reduce((acc, p) => acc + Number(p.valor_total || 0), 0);
    return { mes, valor: valorMes / 1000 };
  });

  const maxValor = Math.max(...faturamentoPorMes.map(m => m.valor), 10);
  const formatarMoeda = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* SEÇÃO: KPIs SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Faturamento Total</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{formatarMoeda(faturamentoTotal)}</h3></div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-500"><TrendingUp size={20} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Ticket Médio</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{formatarMoeda(ticketMedio)}</h3></div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg text-blue-600 dark:text-blue-500"><ClipboardList size={20} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Em Produção</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{emProducao}</h3></div>
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300"><Settings size={20} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-emerald-300 dark:border-emerald-900/50 flex flex-col justify-between bg-gradient-to-br from-emerald-50 dark:from-emerald-950/20 to-transparent shadow-sm">
          <div className="flex justify-between items-start">
            <div><p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Concluídos</p><h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{concluidos}</h3></div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-emerald-700 dark:text-emerald-400"><CheckCircle2 size={20} /></div>
          </div>
        </div>
      </div>
      
      {/* SEÇÃO: GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico 1: Status dos Pedidos Interativo */}
        <div className="bg-white dark:bg-[#121214] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:col-span-1 flex flex-col items-center">
          <div className="w-full mb-8">
            <h4 className="text-zinc-900 dark:text-zinc-100 font-medium">Status dos Pedidos</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Proporção dos pedidos ativos na base</p>
          </div>
          
          <div className="relative w-44 h-44 flex items-center justify-center mb-8">
            {/* Elemento SVG do Gráfico de Círculo */}
            <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90 drop-shadow-md">
              {totalPedidos === 0 ? (
                <circle cx="20" cy="20" r="15.9155" fill="transparent" stroke="#27272a" strokeWidth="8" />
              ) : (
                dadosStatus.map((item) => {
                  if (item.value === 0) return null;
                  const percentual = (item.value / totalPedidos) * 100;
                  const dasharray = `${percentual} ${100 - percentual}`;
                  const offset = 100 - acumulado;
                  acumulado += percentual;

                  return (
                    <circle
                      key={item.id}
                      cx="20"
                      cy="20"
                      r="15.9155"
                      fill="transparent"
                      stroke={item.cor}
                      strokeWidth={hoveredStatus?.id === item.id ? "9.5" : "7.5"}
                      strokeDasharray={dasharray}
                      strokeDashoffset={offset}
                      className="transition-all duration-300 ease-out cursor-pointer"
                      onMouseEnter={() => setHoveredStatus(item)}
                      onMouseLeave={() => setHoveredStatus(null)}
                    />
                  );
                })
              )}
            </svg>
            
            {/* Texto Central Dinâmico (Altera conforme o hover) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold transition-colors duration-300 ${hoveredStatus ? 'text-zinc-900 dark:text-white' : 'text-zinc-800 dark:text-zinc-100'}`}>
                  {hoveredStatus ? hoveredStatus.value : totalPedidos}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium text-center leading-tight mt-1">
                  {hoveredStatus ? hoveredStatus.label : 'Total'}
                </span>
              </div>
            </div>
          </div>

          {/* Legenda Interativa */}
          <div className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300 w-full">
            {dadosStatus.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${hoveredStatus?.id === item.id ? 'bg-zinc-100 dark:bg-zinc-800/70' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'}`}
                onMouseEnter={() => setHoveredStatus(item)}
                onMouseLeave={() => setHoveredStatus(null)}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.bg}`}></span>
                  <span className={hoveredStatus?.id === item.id ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-700 dark:text-zinc-300'}>{item.label}</span>
                </div>
                <span className={`font-semibold ${hoveredStatus?.id === item.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gráfico 2: Faturamento Histórico (Barras) */}
        <div className="bg-white dark:bg-[#121214] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-zinc-900 dark:text-zinc-100 font-medium">Histórico de Faturamento</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Receita gerada por mês (em milhares de Reais)</p>
            </div>
            <select className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-sm rounded-md px-2 py-1 outline-none focus:border-blue-500"><option>2026</option></select>
          </div>
          <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 h-56 px-1 border-b border-zinc-200 dark:border-zinc-800/50 pb-2 mt-4">
            {faturamentoPorMes.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full group">
                <div 
                  className={`w-full max-w-[2.5rem] rounded-t-md transition-all duration-500 relative flex justify-center ${item.valor === 0 ? 'bg-zinc-200 dark:bg-zinc-800/40' : 'bg-emerald-600/70 dark:bg-emerald-900/60 group-hover:bg-emerald-600'}`} 
                  style={{ height: `${item.valor === 0 ? 4 : Math.max((item.valor / maxValor) * 100, 6)}%` }}
                >
                  {item.valor > 0 && (
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-zinc-800 text-white text-xs px-2 py-1 rounded transition-opacity z-10 whitespace-nowrap shadow">
                      R$ {item.valor.toFixed(1)}k
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 uppercase">{item.mes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================================================
// COMPONENTE: HISTÓRICO E EXPORTAÇÃO
// ==================================================
function Historico() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarHistorico() {
      try {
        setLoading(true);
        // Filtro adicionado para buscar apenas os pedidos com status 'Concluido'
        const { data, error } = await supabase
          .from('pedidos')
          .select('*')
          .eq('status', 'Concluido'); 
          
        if (error) throw error;
        setPedidos(data || []);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err.message);
      } finally {
        setLoading(false);
      }
    }
    carregarHistorico();
  }, []);

  const totalPeriodo = pedidos.reduce((acc, item) => acc + Number(item.valor_total || 0), 0);

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Funções de Exportação PDF/Excel...
  const exportarExcel = () => { /* ...lógica de exportação... */ };
  const exportarPDF = () => { /* ...lógica de exportação... */ };

  return (
    <div className="animate-in fade-in duration-500 flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#121214] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Registo Geral Supabase</label>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={exportarPDF} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-md transition-colors border border-zinc-300 dark:border-zinc-700 cursor-pointer">
            <FileText size={16} /> Exportar PDF
          </button>
          <button onClick={exportarExcel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-md transition-colors border border-zinc-300 dark:border-zinc-700 cursor-pointer">
            <FileSpreadsheet size={16} /> Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm">
            <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
              <tr>
                <th className="px-6 py-4 font-medium text-left">ID</th>
                <th className="px-6 py-4 font-medium text-left">Cliente</th>
                <th className="px-6 py-4 font-medium text-left">Produto</th>
                <th className="px-6 py-4 font-medium text-center">Quantidade</th>
                <th className="px-6 py-4 font-medium text-center">Data</th>
                <th className="px-6 py-4 font-medium text-center">Valor</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 text-zinc-700 dark:text-zinc-300">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-zinc-500">A carregar histórico...</td></tr>
              ) : pedidos.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-zinc-500">Nenhum registo encontrado.</td></tr>
              ) : (
                pedidos.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100 text-left">PED-{item.id}</td>
                    <td className="px-6 py-4 text-left font-medium text-zinc-800 dark:text-zinc-200">{item.cliente || 'N/D'}</td>
                    <td className="px-6 py-4 text-left text-zinc-500 dark:text-zinc-400">{item.produto || 'N/D'}</td>
                    <td className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">{item.quantidade || 1} un.</td>
                    <td className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatarMoeda(item.valor_total)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className="text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center w-max">
                          {item.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-right font-medium text-zinc-600 dark:text-zinc-400">
                  Total Geral ({pedidos.length} pedidos):
                </td>
                <td className="px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400 text-base">
                  {formatarMoeda(totalPeriodo)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================================================
// COMPONENTE: CLIENTES
// ==================================================
function AbaClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarClientesAnalytics() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('clientes').select('*');
        if (error) throw error;
        setClientes(data || []);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err.message);
      } finally {
        setLoading(false);
      }
    }
    carregarClientesAnalytics();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-full"><Users size={24}/></div>
          <div><p className="text-zinc-500 dark:text-zinc-400 text-sm">Clientes Registados</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{clientes.length}</h3></div>
        </div>
        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full"><Award size={24}/></div>
          <div><p className="text-zinc-500 dark:text-zinc-400 text-sm">Base Ativa</p><h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-1">Supabase DB</h3></div>
        </div>
        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full"><TrendingUp size={24}/></div>
          <div><p className="text-zinc-500 dark:text-zinc-400 text-sm">Estado</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">Sincronizado</h3></div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col">
        <h4 className="text-zinc-900 dark:text-zinc-100 font-medium mb-4">Lista de Clientes Registados</h4>
        
        {loading ? (
          <p className="text-sm text-zinc-500">A carregar clientes...</p>
        ) : clientes.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhum cliente encontrado.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {clientes.map((cliente, index) => (
              <div key={cliente.id || index} className="flex flex-col gap-2 p-4 bg-zinc-50 dark:bg-[#18181b] rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold w-6 text-blue-600 dark:text-blue-500">{index + 1}º</span>
                    <div>
                      <p className="text-zinc-900 dark:text-zinc-200 font-medium">{cliente.nome}</p>
                      <p className="text-xs text-zinc-500">Documento: {cliente.documento || 'N/D'} | Tel: {cliente.telefone || 'N/D'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-400 text-xs">{cliente.email || 'Sem email'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}