import { X } from 'lucide-react';
import { useState } from 'react';

export default function OrderDrawer({ isOpen, onClose }) {
  const [cliente, setCliente] = useState('');
  const [maquina, setMaquina] = useState('');
  const [dataEmissao, setDataEmissao] = useState('2026-09-27');
  const [previsaoEntrega, setPrevisaoEntrega] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [notas, setNotas] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h3 className="text-lg font-semibold text-white">Novo Pedido</h3>
            <p className="text-sm text-zinc-400">Cadastre uma nova ordem de produção.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-2 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <form id="order-form" onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Cliente</label>
              <select 
                required
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Selecione um cliente...</option>
                <option value="CLI-001">Metalúrgica São Jorge</option>
                <option value="CLI-002">Indústria Ferro & Aço Ltda.</option>
                <option value="CLI-003">Tubos & Perfis do Sul</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Máquina / Equipamento</label>
              <select 
                required
                value={maquina}
                onChange={(e) => setMaquina(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Selecione uma máquina...</option>
                <option value="MAQ-01">Dobradeira CNC 160 ton</option>
                <option value="MAQ-02">Corte a Laser Fibra 3kW</option>
                <option value="MAQ-03">Calandra de 3 Rolos 2000mm</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Data de Emissão</label>
                <input 
                  type="date" 
                  required
                  value={dataEmissao}
                  onChange={(e) => setDataEmissao(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Previsão de Entrega</label>
                <input 
                  type="date" 
                  required
                  value={previsaoEntrega}
                  onChange={(e) => setPrevisaoEntrega(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Quantidade</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: 2 un."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Valor Total (R$)</label>
                <input 
                  type="text" 
                  required
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: 45.000,00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Notas Administrativas</label>
              <textarea 
                rows="3"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Adicione observações internas sobre o pedido..."
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-950 rounded-b-xl">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="order-form"
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Salvar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}