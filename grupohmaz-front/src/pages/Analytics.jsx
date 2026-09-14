import { useState } from 'react';
import { 
  ClipboardList, Settings, AlertTriangle, CheckCircle2, ChevronDown, 
  FileText, FileSpreadsheet, Clock, Target, Eye, Users, TrendingUp, Award, ArrowRight
} from 'lucide-react';

export default function Analytics() {
  const [abaAtiva, setAbaAtiva] = useState('operacional');

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Central de Análises</h2>
        <p className="text-zinc-400 text-sm mt-1">Inteligência de dados e histórico de produção</p>
      </div>

      {/* Navegação das Abas */}
      <div className="flex gap-4 border-b border-zinc-800 mb-6">
        <button 
          onClick={() => setAbaAtiva('operacional')}
          className={`pb-3 text-sm font-medium transition-colors relative ${abaAtiva === 'operacional' ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Visão Operacional
          {abaAtiva === 'operacional' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-md"></span>}
        </button>
        
        <button 
          onClick={() => setAbaAtiva('historico')}
          className={`pb-3 text-sm font-medium transition-colors relative ${abaAtiva === 'historico' ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Histórico e Exportação
          {abaAtiva === 'historico' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-md"></span>}
        </button>

        <button 
          onClick={() => setAbaAtiva('clientes')}
          className={`pb-3 text-sm font-medium transition-colors relative ${abaAtiva === 'clientes' ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Desempenho por Cliente
          {abaAtiva === 'clientes' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-md"></span>}
        </button>
      </div>

      {/* Renderização Condicional das Abas */}
      {abaAtiva === 'operacional' && <VisaoOperacional />}
      {abaAtiva === 'historico' && <Historico />}
      {abaAtiva === 'clientes' && <AbaClientes />}
    </div>
  );
}

// ==========================================
// COMPONENTE: ABA 1 (Visão Operacional Corrigida)
// ==========================================
function VisaoOperacional() {
  const [ano, setAno] = useState('2026');
  
  const mockMensal = [
    { mes: 'Jan', valor: 30 }, { mes: 'Fev', valor: 45 }, { mes: 'Mar', valor: 40 },
    { mes: 'Abr', valor: 60 }, { mes: 'Mai', valor: 55 }, { mes: 'Jun', valor: 75 },
    { mes: 'Jul', valor: 85 }, { mes: 'Ago', valor: 90 }, { mes: 'Set', valor: 45 },
    { mes: 'Out', valor: 0 }, { mes: 'Nov', valor: 0 }, { mes: 'Dez', valor: 0 }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-400 text-sm font-medium">Total Ativos</p><h3 className="text-3xl font-bold text-white mt-1">12</h3></div>
            <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300"><ClipboardList size={20} /></div>
          </div>
        </div>

        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-400 text-sm font-medium">Em Produção</p><h3 className="text-3xl font-bold text-white mt-1">4</h3></div>
            <div className="p-2 bg-blue-900/20 border border-blue-900/50 rounded-lg text-blue-500"><Settings size={20} /></div>
          </div>
        </div>

        <div className="bg-zinc-900/50 p-5 rounded-xl border border-red-900/50 flex flex-col justify-between bg-gradient-to-br from-red-950/20 to-transparent">
          <div className="flex justify-between items-start">
            <div><p className="text-red-400 text-sm font-medium">Em Atraso</p><h3 className="text-3xl font-bold text-red-400 mt-1">1</h3></div>
            <div className="p-2 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400"><AlertTriangle size={20} /></div>
          </div>
        </div>

        <div className="bg-zinc-900/50 p-5 rounded-xl border border-emerald-900/50 flex flex-col justify-between bg-gradient-to-br from-emerald-950/20 to-transparent">
          <div className="flex justify-between items-start">
            <div><p className="text-emerald-400 text-sm font-medium">Concluídos</p><h3 className="text-3xl font-bold text-emerald-400 mt-1">3</h3></div>
            <div className="p-2 bg-emerald-900/30 border border-emerald-800/50 rounded-lg text-emerald-400"><CheckCircle2 size={20} /></div>
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Donut com Legenda Restaurada */}
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 lg:col-span-1 flex flex-col items-center">
          <div className="w-full mb-6">
            <h4 className="text-zinc-100 font-medium">Status dos Pedidos</h4>
            <p className="text-xs text-zinc-500">Proporção dos 12 pedidos ativos</p>
          </div>
          
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'conic-gradient(#52525b 0% 42%, #3b82f6 42% 75%, #10b981 75% 100%)' }}>
            <div className="w-24 h-24 bg-[#0a0a0a] rounded-full flex flex-col items-center justify-center shadow-inner">
              <span className="text-2xl font-bold text-white">12</span>
              <span className="text-xs text-zinc-400">Total</span>
            </div>
          </div>
          
          {/* A Legenda */}
          <div className="flex flex-col gap-3 mt-8 text-sm text-zinc-300 w-full">
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-zinc-500 shadow-[0_0_8px_rgba(82,82,91,0.5)]"></span>A Fazer</div><span className="font-semibold text-white">5 <span className="text-zinc-500 text-xs font-normal ml-1">(42%)</span></span></div>
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>Em Produção</div><span className="font-semibold text-white">4 <span className="text-zinc-500 text-xs font-normal ml-1">(33%)</span></span></div>
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>Concluídos</div><span className="font-semibold text-white">3 <span className="text-zinc-500 text-xs font-normal ml-1">(25%)</span></span></div>
          </div>
        </div>
        
        {/* Gráfico de Barras Corrigido (colunas mais finas) */}
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-zinc-100 font-medium">Volume de Produção</h4>
              <p className="text-xs text-zinc-500">Histórico de produção por mês</p>
            </div>
            <select className="bg-zinc-950 border border-zinc-700 text-zinc-300 text-sm rounded-md px-2 py-1"><option>2026</option></select>
          </div>
          <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 h-56 px-1 border-b border-zinc-800/50 pb-2 mt-4">
            {mockMensal.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full group">
                <div 
                  className={`w-full max-w-[2.5rem] rounded-t-md transition-all duration-500 relative flex justify-center ${item.valor === 0 ? 'bg-transparent' : 'bg-blue-900/40 group-hover:bg-blue-600'}`} 
                  style={{ height: `${item.valor === 0 ? 1 : item.valor}%` }}
                >
                  {item.valor > 0 && (
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-zinc-800 text-white text-xs px-2 py-1 rounded transition-opacity z-10">
                      {item.valor}
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

// ==========================================
// COMPONENTE: ABA 2 (Relatórios Original Restaurado)
// ==========================================
function Historico() {
  const relatoriosMock = [
    { id: 'PED-1046', cliente: 'Tubos & Perfis do Sul', maquina: 'Calandra de 3 Rolos 2000mm', emissao: '10/07/2026', conclusao: '10/08/2026', status: 'Concluído' },
    { id: 'PED-1047', cliente: 'Metalúrgica São Jorge', maquina: 'Corte a Laser Tubo 20-220mm', emissao: '28/06/2026', conclusao: '07/08/2026', status: 'Concluído' },
    { id: 'PED-1051', cliente: 'Indústria Ferro & Aço Ltda.', maquina: 'Calandra de 4 Rolos 3000mm', emissao: '05/07/2026', conclusao: '06/08/2026', status: 'Concluído' },
  ];

  return (
    <div className="animate-in fade-in duration-500 flex-1 flex flex-col">
      {/* Barra de Filtros e Exportação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-zinc-300">Período:</label>
          <select className="bg-zinc-950 border border-zinc-700 text-zinc-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="2026-08">2026-08 (Agosto)</option>
            <option value="2026-07">2026-07 (Julho)</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-md transition-colors border border-zinc-700">
            <FileText size={16} /> Exportar PDF
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-md transition-colors border border-zinc-700">
            <FileSpreadsheet size={16} /> Exportar Excel
          </button>
        </div>
      </div>

      {/* Tabela de Relatórios */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Máquina</th>
                <th className="px-6 py-4 font-medium">Emissão</th>
                <th className="px-6 py-4 font-medium">Conclusão</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {relatoriosMock.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-100">{item.id}</td>
                  <td className="px-6 py-4">{item.cliente}</td>
                  <td className="px-6 py-4">{item.maquina}</td>
                  <td className="px-6 py-4">{item.emissao}</td>
                  <td className="px-6 py-4">{item.conclusao}</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 px-2 py-1 rounded-full text-xs font-medium flex items-center justify-center w-max">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <button className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors" title="Visualizar Detalhes">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: ABA 3 (A Nova Ideia: Clientes)
// ==========================================
function AbaClientes() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-blue-900/20 text-blue-500 rounded-full"><Users size={24}/></div>
          <div><p className="text-zinc-400 text-sm">Clientes Ativos</p><h3 className="text-2xl font-bold text-white mt-1">28</h3></div>
        </div>
        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-900/20 text-emerald-400 rounded-full"><Award size={24}/></div>
          <div><p className="text-zinc-400 text-sm">Top Cliente (Mês)</p><h3 className="text-lg font-bold text-white mt-1 truncate">Met. São Jorge</h3></div>
        </div>
        <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-purple-900/20 text-purple-400 rounded-full"><TrendingUp size={24}/></div>
          <div><p className="text-zinc-400 text-sm">Taxa de Retenção</p><h3 className="text-2xl font-bold text-white mt-1">85%</h3></div>
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 flex flex-col">
        <h4 className="text-zinc-100 font-medium mb-4">Ranking de Clientes (Volume de Pedidos)</h4>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-blue-500 w-6">1º</span>
              <div><p className="text-zinc-200 font-medium">Metalúrgica São Jorge</p><p className="text-xs text-zinc-500">São Paulo, SP</p></div>
            </div>
            <div className="text-right"><p className="text-white font-bold">14 pedidos</p><p className="text-xs text-emerald-400">Tempo médio: 28 dias</p></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-zinc-400 w-6">2º</span>
              <div><p className="text-zinc-200 font-medium">Indústria Ferro & Aço Ltda.</p><p className="text-xs text-zinc-500">Campinas, SP</p></div>
            </div>
            <div className="text-right"><p className="text-white font-bold">9 pedidos</p><p className="text-xs text-yellow-400">Tempo médio: 35 dias</p></div>
          </div>
        </div>
        
        {/* Botão de Caminho para Todos os Clientes */}
        <button className="mt-4 w-full py-2.5 bg-zinc-950 border border-zinc-800 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors flex items-center justify-center gap-2">
          Acessar Diretório Completo de Clientes <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}