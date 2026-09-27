import { Search, Plus, MoreVertical, Building2, MapPin } from 'lucide-react';

const mockClientes = [
  { id: 'CLI-001', nome: 'Metalúrgica São Jorge', cnpj: '12.345.678/0001-90', cidade: 'São Paulo, SP', pedidos: 14, status: 'Ativo' },
  { id: 'CLI-002', nome: 'Indústria Ferro & Aço Ltda.', cnpj: '98.765.432/0001-10', cidade: 'Campinas, SP', pedidos: 9, status: 'Ativo' },
  { id: 'CLI-003', nome: 'Tubos & Perfis do Sul', cnpj: '45.678.901/0001-23', cidade: 'Curitiba, PR', pedidos: 5, status: 'Inativo' },
];

export default function Clientes() {
  return (
    <div className="flex flex-col h-full custom-scrollbar overflow-y-auto pb-6">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-2xl font-semibold text-white">Diretório de Clientes</h2>
          <p className="text-zinc-400 text-sm mt-1">Gestão de empresas e parceiros comerciais</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2">
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      {/* Tabela de Clientes ajustada visualmente */}
      <div className="bg-[#121214] rounded-xl border border-zinc-800 flex flex-col flex-1 overflow-hidden w-full">
        <div className="p-4 border-b border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Pesquisar cliente por nome ou CNPJ..." 
              className="w-full bg-[#1e1e20] border border-zinc-700 rounded-md pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm">
            <thead className="text-xs text-zinc-400 uppercase border-b border-zinc-800 bg-[#121214]">
              <tr>
                <th className="px-6 py-4 font-medium text-left">Empresa</th>
                <th className="px-6 py-4 font-medium text-center">Localização</th>
                <th className="px-6 py-4 font-medium text-center">Total Pedidos</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              {mockClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-md text-zinc-400"><Building2 size={16} /></div>
                      <div>
                        <p className="font-medium text-zinc-100">{cliente.nome}</p>
                        <p className="text-xs text-zinc-500">{cliente.cnpj}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1 text-zinc-400">
                      <MapPin size={14} /> {cliente.cidade}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-center">{cliente.pedidos}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center w-max border ${cliente.status === 'Ativo' ? 'text-emerald-400 border-emerald-900/50 bg-transparent' : 'text-zinc-400 border-zinc-700 bg-transparent'}`}>
                        {cliente.status}
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