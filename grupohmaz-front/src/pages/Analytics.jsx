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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Análises Financeiras e Operacionais</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Inteligência de dados, faturamento e histórico de produção</p>
        </div>
      </div>

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

      {abaAtiva === 'operacional' && <VisaoOperacional />}
      {abaAtiva === 'historico' && <Historico />}
      {abaAtiva === 'clientes' && <AbaClientes />}
    </div>
  );
}

function VisaoOperacional() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Corrigido: Cálculo das percentagens para os 5 status
  const pAFazer = totalPedidos > 0 ? (aFazer / totalPedidos) * 100 : 0;
  const pEmProducao = totalPedidos > 0 ? (emProducao / totalPedidos) * 100 : 0;
  const pRevisao = totalPedidos > 0 ? (revisao / totalPedidos) * 100 : 0;
  const pConcluidos = totalPedidos > 0 ? (concluidos / totalPedidos) * 100 : 0;
  
  const deg1 = pAFazer;
  const deg2 = deg1 + pEmProducao;
  const deg3 = deg2 + pRevisao;
  const deg4 = deg3 + pConcluidos;

  // Corrigido: Adicionado os 5 limites de cor correspondentes ao Kanban
  const conicGradient = totalPedidos > 0 
    ? `conic-gradient(#71717a 0% ${deg1}%, #3b82f6 ${deg1}% ${deg2}%, #f59e0b ${deg2}% ${deg3}%, #10b981 ${deg3}% ${deg4}%, #ef4444 ${deg4}% 100%)`
    : 'conic-gradient(#3f3f46 0% 100%)';

  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const faturamentoPorMes = mesesNomes.map((mes, index) => {
    const valorMes = pedidos
      .filter(p => {
        if (!p.created_at) return false;
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#121214] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:col-span-1 flex flex-col items-center">
          <div className="w-full mb-6">
            <h4 className="text-zinc-900 dark:text-zinc-100 font-medium">Status dos Pedidos</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Proporção dos pedidos ativos na base</p>
          </div>
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-lg" style={{ background: conicGradient }}>
            <div className="w-24 h-24 bg-white dark:bg-[#0a0a0a] rounded-full flex flex-col items-center justify-center shadow-inner transition-colors duration-300">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">{totalPedidos}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Total</span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 mt-8 text-sm text-zinc-700 dark:text-zinc-300 w-full">
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-zinc-500"></span>A Fazer</div><span className="font-semibold text-zinc-900 dark:text-white">{aFazer}</span></div>
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span>Em Produção</div><span className="font-semibold text-zinc-900 dark:text-white">{emProducao}</span></div>
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span>Revisão</div><span className="font-semibold text-zinc-900 dark:text-white">{revisao}</span></div>
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span>Concluídos</div><span className="font-semibold text-zinc-900 dark:text-white">{concluidos}</span></div>
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span>Descartados</div><span className="font-semibold text-zinc-900 dark:text-white">{descartados}</span></div>
          </div>
        </div>
        
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

function Historico() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarHistorico() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('pedidos').select('*');
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

  const exportarExcel = () => {
    let htmlTabela = `
      <table>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Produto / Máquina</th>
          <th>Quantidade</th>
          <th>Data de Registo</th>
          <th>Valor Total</th>
          <th>Status</th>
        </tr>
    `;

    pedidos.forEach(item => {
      htmlTabela += `
        <tr>
          <td>PED-${item.id}</td>
          <td>${item.cliente || 'N/D'}</td>
          <td>${item.produto || 'N/D'}</td>
          <td>${item.quantidade || 1}</td>
          <td>${new Date(item.created_at).toLocaleDateString()}</td>
          <td>${item.valor_total || 0}</td>
          <td>${item.status}</td>
        </tr>
      `;
    });

    htmlTabela += `
        <tr>
          <td colspan="5" style="font-weight: bold; text-align: right;">Total Geral:</td>
          <td>${totalPeriodo}</td>
          <td></td>
        </tr>
      </table>
    `;

    const blob = new Blob([
      '\ufeff' + `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/1999/xlink">
          <head><meta charset="UTF-8"></head>
          <body>${htmlTabela}</body>
        </html>
      `
    ], { type: 'application/vnd.ms-excel' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historico_faturamento_hmaz.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarPDF = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const conteudoHTML = `
      <html>
        <head>
          <title>Relatório de Faturamento - Grupo Hmaz</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h2 { color: #111; margin-bottom: 5px; }
            p { color: #666; font-size: 12px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
            th { background-color: #f4f4f5; font-weight: bold; }
            .total { font-weight: bold; text-align: right; margin-top: 15px; font-size: 14px; }
          </style>
        </head>
        <body>
          <h2>Grupo Hmaz - Relatório de Faturamento e Histórico</h2>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${pedidos.map(item => `
                <tr>
                  <td>PED-${item.id}</td>
                  <td>${item.cliente || 'N/D'}</td>
                  <td>${item.produto || 'N/D'}</td>
                  <td>${item.quantidade || 1}</td>
                  <td>${new Date(item.created_at).toLocaleDateString()}</td>
                  <td>${formatarMoeda(item.valor_total)}</td>
                  <td>${item.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            Total Geral: ${formatarMoeda(totalPeriodo)}
          </div>
        </body>
      </html>
    `;

    iframe.contentDocument.write(conteudoHTML);
    iframe.contentDocument.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 400);
  };

  return (
    <div className="animate-in fade-in duration-500 flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#121214] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Registo Geral Supabase</label>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={exportarPDF}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-md transition-colors border border-zinc-300 dark:border-zinc-700 cursor-pointer"
          >
            <FileText size={16} /> Exportar PDF
          </button>
          <button 
            onClick={exportarExcel}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-md transition-colors border border-zinc-300 dark:border-zinc-700 cursor-pointer"
          >
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
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-zinc-500">A carregar histórico...</td>
                </tr>
              ) : pedidos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-zinc-500">Nenhum registo encontrado.</td>
                </tr>
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