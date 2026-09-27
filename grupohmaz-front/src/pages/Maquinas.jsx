import { Search, Plus, Settings2, MoreVertical } from 'lucide-react';

const mockMaquinas = [
  { id: 'MAQ-01', modelo: 'Dobradeira CNC 160 ton', categoria: 'Conformação', tempoMedio: '30 dias', status: 'Disponível' },
  { id: 'MAQ-02', modelo: 'Corte a Laser Fibra 3kW', categoria: 'Corte', tempoMedio: '25 dias', status: 'Em Andamento' },
  { id: 'MAQ-03', modelo: 'Calandra de 3 Rolos 2000mm', categoria: 'Conformação', tempoMedio: '40 dias', status: 'Em Falta' },
];

export default function Maquinas() {
  
  // Função para definir a cor da badge de status
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Disponível':
        return 'text-emerald-400 border-emerald-900/50 bg-transparent';
      case 'Em Andamento':
        return 'text-blue-400 border-blue-900/50 bg-transparent';
      case 'Em Falta':
        return 'text-red-400 border-red-900/50 bg-transparent';
      default:
        return 'text-zinc-400 border-zinc-700 bg-transparent';
    }
  };

  return (
    <div className="flex flex-col h-full custom-scrollbar overflow-y-auto pb-6">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-semibold text-white">Catálogo de Máquinas</h2>
          <p className="text-zinc-400 text-sm mt-1">Registo de equipamentos e portefólio de fabrico</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2">
          <Plus size={16} /> Nova Máquina
        </button>
      </div>

      {/* Tabela de Máquinas ajustada visualmente */}
      <div className="bg-[#121214] rounded-xl border border-zinc-800 flex flex-col flex-1 overflow-hidden w-full">
        <div className="p-4 border-b border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Pesquisar por modelo ou categoria..." 
              className="w-full bg-[#1e1e20] border border-zinc-700 rounded-md pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm">
            <thead className="text-xs text-zinc-400 uppercase border-b border-zinc-800 bg-[#121214]">
              <tr>
                <th className="px-6 py-4 font-medium text-left">Modelo</th>
                <th className="px-6 py-4 font-medium text-center">Categoria</th>
                <th className="px-6 py-4 font-medium text-center">Tempo Médio Fabrico</th>
                <th className="px-6 py-4 font-medium text-center">Status Catálogo</th>
                <th className="px-6 py-4 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              {mockMaquinas.map((maquina) => (
                <tr key={maquina.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-md text-zinc-400"><Settings2 size={16} /></div>
                      <span className="font-medium text-zinc-100">{maquina.modelo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className="bg-zinc-900 border border-zinc-700 px-2 py-1 rounded-md text-xs">{maquina.categoria}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-center">{maquina.tempoMedio}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center w-max border ${getStatusStyle(maquina.status)}`}>
                        {maquina.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button className="p-1.5 text-zinc-400 hover:text-white rounded-md transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
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