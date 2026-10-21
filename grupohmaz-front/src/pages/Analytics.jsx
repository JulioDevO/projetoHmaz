import { useState } from 'react';
import { 
  ClipboardList, Settings, CheckCircle2, 
  FileText, FileSpreadsheet, Users, TrendingUp, Award, LogOut, Camera, LayoutDashboard, Kanban, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Analytics() {
  const [abaAtiva, setAbaAtiva] = useState('operacional');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [sidebarColapsada, setSidebarColapsada] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUploadFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFotoPerfil(imageUrl);
    }
  };

  const getIniciais = (nome) => {
    if (!nome) return 'US';
    const partes = nome.split(' ');
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {isAdmin && (
        <aside className={`${sidebarColapsada ? 'w-20' : 'w-64'} bg-white dark:bg-[#121214] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-4 flex-shrink-0 transition-all duration-300`}>
          <div className="flex flex-col gap-6 overflow-hidden">
            
            <div className="flex items-center justify-between px-2 py-1">
              {!sidebarColapsada ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-sm flex-shrink-0">H</div>
                  <span className="font-semibold text-base tracking-tight text-zinc-900 dark:text-white truncate">Grupo Hmaz</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-7 bg-blue-600 rounded-r-full"></div>
                </div>
              )}

              <button 
                onClick={() => setSidebarColapsada(!sidebarColapsada)}
                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors p-1"
                title={sidebarColapsada ? "Expandir barra" : "Recolher barra"}
              >
                {sidebarColapsada ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </div>

            <nav className="flex flex-col gap-1.5 mt-2">
              <button 
                onClick={() => navigate('/analytics')} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 transition-colors text-left ${sidebarColapsada ? 'justify-center px-0' : ''}`}
                title="Analytics & Faturamento"
              >
                <LayoutDashboard size={18} className="flex-shrink-0" /> 
                {!sidebarColapsada && <span className="truncate">Analytics & Faturamento</span>}
              </button>

              <button 
                onClick={() => navigate('/pedidos')} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-left ${sidebarColapsada ? 'justify-center px-0' : ''}`}
                title="Pedidos (Kanban)"
              >
                <Kanban size={18} className="flex-shrink-0" /> 
                {!sidebarColapsada && <span className="truncate">Pedidos (Kanban)</span>}
              </button>

              <button 
                onClick={() => navigate('/configuracoes')} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-left ${sidebarColapsada ? 'justify-center px-0' : ''}`}
                title="Configurações"
              >
                <Settings size={18} className="flex-shrink-0" /> 
                {!sidebarColapsada && <span className="truncate">Configurações</span>}
              </button>
            </nav>
          </div>

          <div className={`text-xs text-zinc-400 dark:text-zinc-600 px-2 ${sidebarColapsada ? 'text-center text-[10px]' : ''}`}>
            {sidebarColapsada ? 'v1.2' : 'ERP Gestão v1.2'}
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto custom-scrollbar p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Análises Financeiras e Operacionais</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Inteligência de dados, faturamento e histórico de produção</p>
          </div>

          {user && (
            <div className="flex items-center gap-3.5 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/80 px-3.5 py-2 rounded-lg shadow-sm">
              <div className="relative group cursor-pointer" title="Clique para alterar a foto de perfil">
                <label htmlFor="input-foto-perfil" className="cursor-pointer block">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-medium text-xs">
                    {fotoPerfil ? (
                      <img src={fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <span>{getIniciais(user.nome)}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <Camera size={14} />
                  </div>
                </label>
                <input 
                  id="input-foto-perfil" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleUploadFoto}
                />
              </div>

              <div className="text-left leading-tight">
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{user.nome}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 capitalize">{user.role === 'admin' ? 'Administrador' : 'Equipe'}</p>
              </div>

              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 px-2.5 py-1.5 rounded-md transition-colors"
                title="Encerrar sessão"
              >
                <LogOut size={15} /> Sair
              </button>
            </div>
          )}
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
    </div>
  );
}

function VisaoOperacional() {
  const mockFaturacao = [
    { mes: 'Jan', valor: 120 }, { mes: 'Fev', valor: 145 }, { mes: 'Mar', valor: 90 },
    { mes: 'Abr', valor: 160 }, { mes: 'Mai', valor: 155 }, { mes: 'Jun', valor: 175 },
    { mes: 'Jul', valor: 185 }, { mes: 'Ago', valor: 210 }, { mes: 'Set', valor: 145 },
    { mes: 'Out', valor: 0 }, { mes: 'Nov', valor: 0 }, { mes: 'Dez', valor: 0 }
  ];
  const maxValor = 210; 

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Faturamento Mensal</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">R$ 210k</h3></div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-500"><TrendingUp size={20} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Ticket Médio</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">R$ 45k</h3></div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg text-blue-600 dark:text-blue-500"><ClipboardList size={20} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Em Produção</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">4</h3></div>
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300"><Settings size={20} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-emerald-300 dark:border-emerald-900/50 flex flex-col justify-between bg-gradient-to-br from-emerald-50 dark:from-emerald-950/20 to-transparent shadow-sm">
          <div className="flex justify-between items-start">
            <div><p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Concluídos (Mês)</p><h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">3</h3></div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-emerald-700 dark:text-emerald-400"><CheckCircle2 size={20} /></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#121214] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:col-span-1 flex flex-col items-center">
          <div className="w-full mb-6">
            <h4 className="text-zinc-900 dark:text-zinc-100 font-medium">Status dos Pedidos</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Proporção dos pedidos ativos</p>
          </div>
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'conic-gradient(#a1a1aa 0% 42%, #3b82f6 42% 75%, #10b981 75% 100%)' }}>
            <div className="w-24 h-24 bg-white dark:bg-[#0a0a0a] rounded-full flex flex-col items-center justify-center shadow-inner">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">12</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Total</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-8 text-sm text-zinc-700 dark:text-zinc-300 w-full">
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-500"></span>A Fazer</div><span className="font-semibold text-zinc-900 dark:text-white">5</span></div>
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span>Em Produção</div><span className="font-semibold text-zinc-900 dark:text-white">4</span></div>
             <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span>Concluídos</div><span className="font-semibold text-zinc-900 dark:text-white">3</span></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#121214] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-zinc-900 dark:text-zinc-100 font-medium">Histórico de Faturamento</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Receita gerada por mês (em milhares de Reais)</p>
            </div>
            <select className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-sm rounded-md px-2 py-1"><option>2026</option></select>
          </div>
          <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 h-56 px-1 border-b border-zinc-200 dark:border-zinc-800/50 pb-2 mt-4">
            {mockFaturacao.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full group">
                <div 
                  className={`w-full max-w-[2.5rem] rounded-t-md transition-all duration-500 relative flex justify-center ${item.valor === 0 ? 'bg-transparent' : 'bg-emerald-600/70 dark:bg-emerald-900/60 group-hover:bg-emerald-600'}`} 
                  style={{ height: `${item.valor === 0 ? 1 : (item.valor / maxValor) * 100}%` }}
                >
                  {item.valor > 0 && (
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-zinc-800 text-white text-xs px-2 py-1 rounded transition-opacity z-10 whitespace-nowrap shadow">
                      R$ {item.valor}k
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
  const relatoriosMock = [
    { id: 'PED-1046', cliente: 'Tubos & Perfis do Sul', maquina: 'Calandra de 3 Rolos 2000mm', emissao: '10/07/2026', conclusao: '10/08/2026', valor: 42000, status: 'Concluído' },
    { id: 'PED-1047', cliente: 'Metalúrgica São Jorge', maquina: 'Corte a Laser Tubo 20-220mm', emissao: '28/06/2026', conclusao: '07/08/2026', valor: 190000, status: 'Concluído' },
    { id: 'PED-1051', cliente: 'Indústria Ferro & Aço Ltda.', maquina: 'Calandra de 4 Rolos 3000mm', emissao: '05/07/2026', conclusao: '06/08/2026', valor: 85000, status: 'Concluído' },
  ];

  const totalPeriodo = relatoriosMock.reduce((acc, item) => acc + item.valor, 0);

  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const exportarExcel = () => {
    let htmlTabela = `
      <table>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Máquina</th>
          <th>Emissão</th>
          <th>Conclusão</th>
          <th>Valor</th>
          <th>Status</th>
        </tr>
    `;

    relatoriosMock.forEach(item => {
      htmlTabela += `
        <tr>
          <td>${item.id}</td>
          <td>${item.cliente}</td>
          <td>${item.maquina}</td>
          <td>${item.emissao}</td>
          <td>${item.conclusao}</td>
          <td>${item.valor}</td>
          <td>${item.status}</td>
        </tr>
      `;
    });

    htmlTabela += `
        <tr>
          <td colspan="5" style="font-weight: bold; text-align: right;">Total Faturado:</td>
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
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} Período: Agosto/2026</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Máquina</th>
                <th>Emissão</th>
                <th>Conclusão</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${relatoriosMock.map(item => `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.cliente}</td>
                  <td>${item.maquina}</td>
                  <td>${item.emissao}</td>
                  <td>${item.conclusao}</td>
                  <td>${formatarMoeda(item.valor)}</td>
                  <td>${item.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            Total Faturado no Período: ${formatarMoeda(totalPeriodo)}
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
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Período:</label>
          <select className="bg-zinc-100 dark:bg-[#1e1e20] border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="2026-08">2026-08 (Agosto)</option>
            <option value="2026-07">2026-07 (Julho)</option>
          </select>
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
                <th className="px-6 py-4 font-medium text-left">Máquina</th>
                <th className="px-6 py-4 font-medium text-center">Emissão</th>
                <th className="px-6 py-4 font-medium text-center">Conclusão</th>
                <th className="px-6 py-4 font-medium text-center">Valor</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 text-zinc-700 dark:text-zinc-300">
              {relatoriosMock.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100 text-left">{item.id}</td>
                  <td className="px-6 py-4 text-left font-medium text-zinc-800 dark:text-zinc-200">{item.cliente}</td>
                  <td className="px-6 py-4 text-left text-zinc-500 dark:text-zinc-400">{item.maquina}</td>
                  <td className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">{item.emissao}</td>
                  <td className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">{item.conclusao}</td>
                  <td className="px-6 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatarMoeda(item.valor)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className="text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center w-max">
                        {item.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-right font-medium text-zinc-600 dark:text-zinc-400">
                  Total Faturado no Período ({relatoriosMock.length} pedidos):
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
  const faturamentoClientes = [
    { nome: 'Metalúrgica São Jorge', local: 'São Paulo, SP', pedidos: 14, valor: 450000, max: 450000 },
    { nome: 'Indústria Ferro & Aço Ltda.', local: 'Campinas, SP', pedidos: 9, valor: 280000, max: 450000 },
    { nome: 'Tubos & Perfis do Sul', local: 'Curitiba, PR', pedidos: 6, valor: 190000, max: 450000 }
  ];

  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-full"><Users size={24}/></div>
          <div><p className="text-zinc-500 dark:text-zinc-400 text-sm">Clientes Ativos</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">28</h3></div>
        </div>
        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full"><Award size={24}/></div>
          <div><p className="text-zinc-500 dark:text-zinc-400 text-sm">Top Cliente (Faturamento)</p><h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-1 truncate">Met. São Jorge</h3></div>
        </div>
        <div className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full"><TrendingUp size={24}/></div>
          <div><p className="text-zinc-500 dark:text-zinc-400 text-sm">Ticket Médio Geral</p><h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">R$ 45k</h3></div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col">
        <h4 className="text-zinc-900 dark:text-zinc-100 font-medium mb-4">Faturamento por Cliente</h4>
        
        <div className="flex flex-col gap-4">
          {faturamentoClientes.map((cliente, index) => (
            <div key={index} className="flex flex-col gap-2 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-bold w-6 ${index === 0 ? 'text-blue-600 dark:text-blue-500' : index === 1 ? 'text-zinc-500 dark:text-zinc-400' : 'text-amber-600'}`}>{index + 1}º</span>
                  <div>
                    <p className="text-zinc-900 dark:text-zinc-200 font-medium">{cliente.nome}</p>
                    <p className="text-xs text-zinc-500">{cliente.local} • {cliente.pedidos} pedidos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{formatarMoeda(cliente.valor)}</p>
                </div>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800/50 rounded-full h-2 mt-1">
                <div 
                  className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(cliente.valor / cliente.max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}