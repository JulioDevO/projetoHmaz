import { useState, useEffect } from 'react';
import { 
  ClipboardList, CheckCircle2, 
  FileText, FileSpreadsheet, Users, TrendingUp, Award, DollarSign, Package
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Analytics() {
  const [abaAtiva, setAbaAtiva] = useState('operacional');

  return (
    <div className="flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Análises Financeiras e Operacionais</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">Inteligência de dados, faturamento e histórico de produção</p>
        </div>
      </div>

      {/* NAVEGAÇÃO POR ABAS */}
      <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 mb-4">
        <button 
          onClick={() => setAbaAtiva('operacional')}
          className={`pb-2.5 text-sm font-medium transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm ${abaAtiva === 'operacional' ? 'text-blue-600 dark:text-blue-500 font-semibold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          Visão Geral e Faturamento
          {abaAtiva === 'operacional' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t-md"></span>}
        </button>
        
        <button 
          onClick={() => setAbaAtiva('historico')}
          className={`pb-2.5 text-sm font-medium transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm ${abaAtiva === 'historico' ? 'text-blue-600 dark:text-blue-500 font-semibold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          Histórico e Exportação
          {abaAtiva === 'historico' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t-md"></span>}
        </button>

        <button 
          onClick={() => setAbaAtiva('clientes')}
          className={`pb-2.5 text-sm font-medium transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm ${abaAtiva === 'clientes' ? 'text-blue-600 dark:text-blue-500 font-semibold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          Faturamento por Cliente
          {abaAtiva === 'clientes' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t-md"></span>}
        </button>
      </div>

      {abaAtiva === 'operacional' && <VisaoOperacional />}
      {abaAtiva === 'historico' && <Historico />}
      {abaAtiva === 'clientes' && <AbaClientes />}
    </div>
  );
}

// ==================================================
// COMPONENTE: VISÃO OPERACIONAL (DASHBOARD ANUAL)
// ==================================================
function VisaoOperacional() {
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [periodoFiltro, setPeriodoFiltro] = useState('proximos_12');
  const [hoveredStatus, setHoveredStatus] = useState(null);

  useEffect(() => {
    async function carregarDadosAnalytics() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('pedidos').select('*');
        if (error) throw error;
        setPedidos(data || []);
      } catch (err) {
        console.error('Erro ao carregar Analytics:', err.message);
      } finally {
        setLoading(false);
      }
    }
    carregarDadosAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-skeleton"></div>
        <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-skeleton"></div>
        <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-skeleton"></div>
        <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-skeleton"></div>
        <div className="col-span-1 lg:col-span-4 h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-skeleton"></div>
      </div>
    );
  }

  // Extrai ano e mês locais sem sofrer deslocamento de fuso horário UTC
  const extrairAnoMesLocal = (dataStr) => {
    if (!dataStr) return null;
    const parteData = String(dataStr).split('T')[0];
    const [ano, mes] = parteData.split('-').map(Number);
    if (!ano || !mes) return null;
    return { ano, mesIndex: mes - 1 };
  };

  let totalReceita = 0;
  let maquinasVendidas = 0;
  let emProducao = 0;
  let aFazer = 0;
  let concluidos = 0;
  let revisao = 0;
  let descartados = 0;
  let faturamentoConcluido = 0;

  const anosDisponiveis = new Set([new Date().getFullYear(), new Date().getFullYear() + 1]);

  pedidos.forEach((p) => {
    maquinasVendidas += Number(p.quantidade) || 0;

    if (p.status === 'Em Producao') emProducao++;
    else if (p.status === 'Pendente') aFazer++;
    else if (p.status === 'Revisao') revisao++;
    else if (p.status === 'Cancelado') descartados++;
    else if (p.status === 'Concluido') {
      concluidos++;
      faturamentoConcluido += Number(p.valor_total) || 0;
    }

    if (p.status !== 'Cancelado') {
      totalReceita += Number(p.valor_total) || 0;
      const baseData = extrairAnoMesLocal(p.vencimento_inicial || p.created_at);
      if (baseData) {
        anosDisponiveis.add(baseData.ano);
        const parcelas = p.condicao_pagamento === 'parcelado' ? (Number(p.num_parcelas) || 1) : 1;
        const anoFinal = baseData.ano + Math.floor((baseData.mesIndex + parcelas - 1) / 12);
        anosDisponiveis.add(anoFinal);
      }
    }
  });

  const ticketMedio = concluidos > 0 ? faturamentoConcluido / concluidos : 0;
  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Monta a estrutura dos 12 meses conforme o filtro selecionado
  const hoje = new Date();
  const fluxoAnual = Array.from({ length: 12 }, (_, i) => {
    if (periodoFiltro === 'proximos_12') {
      const dataRef = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      const anoCurto = String(dataRef.getFullYear()).slice(-2);
      return {
        mes: `${mesesNomes[dataRef.getMonth()]}/${anoCurto}`,
        ano: dataRef.getFullYear(),
        mesIndex: dataRef.getMonth(),
        valor: 0
      };
    } else {
      const anoSelecionado = Number(periodoFiltro);
      return {
        mes: mesesNomes[i],
        ano: anoSelecionado,
        mesIndex: i,
        valor: 0
      };
    }
  });

  // Distribui entradas à vista e parcelas futuras ao longo dos 12 meses
  pedidos.forEach((p) => {
    if (p.status === 'Cancelado') return;

    if (p.condicao_pagamento === 'parcelado' && p.vencimento_inicial) {
      const inicio = extrairAnoMesLocal(p.vencimento_inicial);
      if (!inicio) return;

      const numParcelas = Number(p.num_parcelas) || 1;
      const valorParcela = Number(p.valor_parcela) || (Number(p.valor_total || 0) / numParcelas);

      for (let i = 0; i < numParcelas; i++) {
        const totalMeses = inicio.mesIndex + i;
        const anoParcela = inicio.ano + Math.floor(totalMeses / 12);
        const mesParcela = totalMeses % 12;

        const slot = fluxoAnual.find((f) => f.ano === anoParcela && f.mesIndex === mesParcela);
        if (slot) {
          slot.valor += valorParcela;
        }
      }
    } else {
      const dataVista = extrairAnoMesLocal(p.vencimento_inicial || p.created_at) || {
        ano: hoje.getFullYear(),
        mesIndex: hoje.getMonth()
      };
      const slot = fluxoAnual.find((f) => f.ano === dataVista.ano && f.mesIndex === dataVista.mesIndex);
      if (slot) {
        slot.valor += Number(p.valor_total || 0);
      }
    }
  });

  const maxValue = Math.max(...fluxoAnual.map((f) => f.valor), 1);
  const totalPeriodoAnual = fluxoAnual.reduce((acc, item) => acc + item.valor, 0);
  const projecao = fluxoAnual.map((f) => ({ ...f, height: (f.valor / maxValue) * 100 }));

  const formatarMoeda = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const totalPedidos = aFazer + emProducao + revisao + concluidos + descartados;

  const dadosStatus = [
    { id: 'todo', label: 'A Fazer', value: aFazer, cor: '#71717a', bg: 'bg-zinc-500' },
    { id: 'in_progress', label: 'Em Produção', value: emProducao, cor: '#3b82f6', bg: 'bg-blue-500' },
    { id: 'review', label: 'Revisão', value: revisao, cor: '#f59e0b', bg: 'bg-amber-500' },
    { id: 'done', label: 'Concluídos', value: concluidos, cor: '#10b981', bg: 'bg-emerald-500' },
    { id: 'discarded', label: 'Descartados', value: descartados, cor: '#ef4444', bg: 'bg-red-500' }
  ];
  let acumulado = 0;

  return (
    <div className="animate-slide-up duration-500">
      
      {/* KPIs SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Receita Bruta Global</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{formatarMoeda(totalReceita)}</h3></div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-500"><TrendingUp size={18} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Ticket Médio (Concluídos)</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{formatarMoeda(ticketMedio)}</h3></div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg text-blue-600 dark:text-blue-500"><ClipboardList size={18} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Máquinas Encomendadas</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{maquinasVendidas}</h3></div>
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300"><Package size={18} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-emerald-300 dark:border-emerald-900/50 flex flex-col justify-between bg-gradient-to-br from-emerald-50 dark:from-emerald-950/20 to-transparent shadow-sm">
          <div className="flex justify-between items-start">
            <div><p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Concluídos</p><h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{concluidos}</h3></div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-emerald-700 dark:text-emerald-400"><CheckCircle2 size={18} /></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Gráfico 1: Status */}
        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:col-span-1 flex flex-col items-center">
          <div className="w-full mb-6">
            <h4 className="text-zinc-900 dark:text-zinc-100 font-medium text-sm">Status dos Pedidos</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Proporção dos pedidos na base de dados</p>
          </div>
          
          <div className="relative w-36 h-36 flex items-center justify-center mb-6">
            <svg viewBox="-2 -2 44 44" className="w-full h-full -rotate-90 drop-shadow-sm overflow-visible">
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
                      className="transition-all duration-300 ease-out cursor-pointer outline-none focus:stroke-blue-500"
                      onMouseEnter={() => setHoveredStatus(item)}
                      onMouseLeave={() => setHoveredStatus(null)}
                      tabIndex="0"
                    />
                  );
                })
              )}
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold transition-colors duration-300 ${hoveredStatus ? 'text-zinc-900 dark:text-white' : 'text-zinc-800 dark:text-zinc-100'}`}>
                  {hoveredStatus ? hoveredStatus.value : totalPedidos}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium text-center leading-tight mt-0.5">
                  {hoveredStatus ? hoveredStatus.label : 'Total'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-sm text-zinc-700 dark:text-zinc-300 w-full">
            {dadosStatus.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${hoveredStatus?.id === item.id ? 'bg-zinc-100 dark:bg-zinc-800/70' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'}`}
                onMouseEnter={() => setHoveredStatus(item)}
                onMouseLeave={() => setHoveredStatus(null)}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${item.bg}`}></span>
                  <span className={`text-xs ${hoveredStatus?.id === item.id ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-700 dark:text-zinc-300'}`}>{item.label}</span>
                </div>
                <span className={`text-xs font-semibold ${hoveredStatus?.id === item.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gráfico 2: Projeção Anual de Fluxo de Caixa (12 Meses) */}
        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
            <div>
              <h4 className="text-zinc-900 dark:text-zinc-100 font-medium text-sm flex items-center gap-2">
                <DollarSign size={16} className="text-blue-500" /> Projeção Anual de Receita (12 Meses)
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Entradas à vista e cronograma mensal de parcelas — Total no período: <strong className="text-zinc-800 dark:text-zinc-200">{formatarMoeda(totalPeriodoAnual)}</strong>
              </p>
            </div>
            <select 
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
              className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs rounded-md px-2.5 py-1.5 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="proximos_12">Próximos 12 Meses</option>
              {[...anosDisponiveis].sort().map((ano) => (
                <option key={ano} value={String(ano)}>Ano {ano} (Jan–Dez)</option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 h-52 px-1 border-b border-zinc-200 dark:border-zinc-800/50 pb-2 mt-4">
            {projecao.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full group min-w-0">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-medium bg-zinc-900 dark:bg-zinc-800 text-white px-2 py-1 rounded shadow-md z-10 whitespace-nowrap mb-1 pointer-events-none">
                  {formatarMoeda(item.valor)}
                </div>
                <div 
                  className={`w-full max-w-[2.25rem] rounded-t-md transition-all duration-500 relative flex justify-center ${item.valor === 0 ? 'bg-zinc-200 dark:bg-zinc-800/40' : 'bg-blue-500/80 dark:bg-blue-600/70 group-hover:bg-blue-600 dark:group-hover:bg-blue-500'}`} 
                  style={{ height: `${item.valor === 0 ? 4 : Math.max(item.height, 8)}%` }}
                />
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-medium truncate max-w-full">
                  {item.mes}
                </span>
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

  const exportarExcel = () => { /* lógica de exportação */ };
  const exportarPDF = () => { /* lógica de exportação */ };

  return (
    <div className="animate-slide-up duration-500 flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-[#121214] p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Registo Geral Supabase</label>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={exportarPDF} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-md transition-colors border border-zinc-300 dark:border-zinc-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <FileText size={16} /> PDF
          </button>
          <button onClick={exportarExcel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-md transition-colors border border-zinc-300 dark:border-zinc-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <FileSpreadsheet size={16} /> Excel
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm">
            <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
              <tr>
                <th className="px-5 py-3 font-medium text-left">ID</th>
                <th className="px-5 py-3 font-medium text-left">Cliente</th>
                <th className="px-5 py-3 font-medium text-left">Produto</th>
                <th className="px-5 py-3 font-medium text-center">Quantidade</th>
                <th className="px-5 py-3 font-medium text-center">Data</th>
                <th className="px-5 py-3 font-medium text-center">Valor</th>
                <th className="px-5 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 text-zinc-700 dark:text-zinc-300">
              {loading ? (
                <tr><td colSpan="7" className="px-5 py-6 text-center text-zinc-500">A carregar histórico...</td></tr>
              ) : pedidos.length === 0 ? (
                <tr><td colSpan="7" className="px-5 py-6 text-center text-zinc-500">Nenhum registo encontrado.</td></tr>
              ) : (
                pedidos.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100 text-left">PED-{item.id}</td>
                    <td className="px-5 py-3 text-left font-medium text-zinc-800 dark:text-zinc-200">{item.cliente || 'N/D'}</td>
                    <td className="px-5 py-3 text-left text-zinc-500 dark:text-zinc-400">{item.produto || 'N/D'}</td>
                    <td className="px-5 py-3 text-center text-zinc-500 dark:text-zinc-400">{item.quantidade || 1} un.</td>
                    <td className="px-5 py-3 text-center text-zinc-500 dark:text-zinc-400">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatarMoeda(item.valor_total)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center">
                        <span className="text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center justify-center w-max">
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
                <td colSpan="5" className="px-5 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                  Total Geral ({pedidos.length}):
                </td>
                <td className="px-5 py-3 text-center font-bold text-emerald-600 dark:text-emerald-400 text-base">
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
    <div className="animate-slide-up duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-full"><Users size={20}/></div>
          <div><p className="text-zinc-500 dark:text-zinc-400 text-sm">Clientes Registados</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-0.5">{clientes.length}</h3></div>
        </div>
        <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full"><Award size={20}/></div>
          <div><p className="text-zinc-500 dark:text-zinc-400 text-sm">Base Ativa</p><h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">Supabase DB</h3></div>
        </div>
        <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full"><TrendingUp size={20}/></div>
          <div><p className="text-zinc-500 dark:text-zinc-400 text-sm">Estado</p><h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">Sincronizado</h3></div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-5 flex flex-col">
        <h4 className="text-zinc-900 dark:text-zinc-100 font-medium text-sm mb-3">Lista de Clientes Registados</h4>
        
        {loading ? (
          <div className="flex flex-col gap-3">
            <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-skeleton"></div>
            <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-skeleton"></div>
          </div>
        ) : clientes.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhum cliente encontrado.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {clientes.map((cliente, index) => (
              <div key={cliente.id || index} className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-[#18181b] rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold w-6 text-blue-600 dark:text-blue-500">{index + 1}º</span>
                    <div>
                      <p className="text-sm text-zinc-900 dark:text-zinc-200 font-medium">{cliente.nome}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Documento: {cliente.documento || 'N/D'} | Tel: {cliente.telefone || 'N/D'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-400 text-[11px]">{cliente.email || 'Sem email'}</p>
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