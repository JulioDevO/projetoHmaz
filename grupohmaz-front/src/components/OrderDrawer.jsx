import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function OrderDrawer({ isOpen, onClose, onSuccess, pedidoParaEditar }) {
  const [cliente, setCliente] = useState('');
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [valorTotal, setValorTotal] = useState('');
  const [loading, setLoading] = useState(false);

  const [clientesLista, setClientesLista] = useState([]);
  const [maquinasLista, setMaquinasLista] = useState([]);

  // Dispara a busca SEMPRE que a gaveta for aberta (isOpen)
  useEffect(() => {
    async function carregarOpcoes() {
      if (!isOpen) return; // Só busca se a gaveta estiver aberta
      
      try {
        console.log("A buscar dados no Supabase...");
        
        // 1. Busca Clientes
        const { data: clientesData, error: erroClientes } = await supabase
          .from('clientes')
          .select('nome')
          .order('nome');
          
        if (erroClientes) {
          console.error('Erro Supabase (Clientes):', erroClientes.message);
        } else {
          console.log("Clientes recebidos:", clientesData);
          setClientesLista(clientesData || []);
        }

        // 2. Busca Produtos
        const { data: maquinasData, error: erroMaquinas } = await supabase
          .from('produtos')
          .select('nome')
          .order('nome');
          
        if (erroMaquinas) {
          console.error('Erro Supabase (Produtos):', erroMaquinas.message);
        } else {
          console.log("Produtos recebidos:", maquinasData);
          setMaquinasLista(maquinasData || []);
        }

      } catch (err) {
        console.error('Erro fatal ao carregar opções:', err.message);
      }
    }
    
    carregarOpcoes();
  }, [isOpen]);

  // Preenche o formulário se for edição
  useEffect(() => {
    if (pedidoParaEditar) {
      setCliente(pedidoParaEditar.cliente !== 'Cliente não definido' ? pedidoParaEditar.cliente : '');
      setProduto(pedidoParaEditar.maquina !== 'Produto não definido' ? pedidoParaEditar.maquina : '');
      setQuantidade(pedidoParaEditar.qtd);
      setValorTotal(pedidoParaEditar.valorRaw);
    } else {
      setCliente('');
      setProduto('');
      setQuantidade(1);
      setValorTotal('');
    }
  }, [pedidoParaEditar, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        cliente,
        produto,
        quantidade,
        valor_total: valorTotal,
      };

      if (pedidoParaEditar) {
        const { error } = await supabase.from('pedidos').update(payload).eq('id', pedidoParaEditar.dbId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pedidos').insert([payload]);
        if (error) throw error;
      }

      onSuccess(); 
      onClose();   
    } catch (error) {
      console.error('Erro ao salvar pedido:', error.message);
      alert('Erro ao guardar o pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-[#0a0a0a] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/30">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {pedidoParaEditar ? `Editar ${pedidoParaEditar.id}` : 'Novo Pedido'}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {pedidoParaEditar ? 'Atualize as informações do pedido' : 'Preencha os dados de produção'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="order-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Cliente</label>
              <select 
                required
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Selecione um cliente...</option>
                {clientesLista.map((c, i) => (
                  <option key={i} value={c.nome}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Máquina / Produto</label>
              <select 
                required
                value={produto}
                onChange={(e) => setProduto(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Selecione o equipamento...</option>
                {maquinasLista.map((m, i) => (
                  <option key={i} value={m.nome}>{m.nome}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Quantidade</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Valor Total (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: 45000"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors">
            Cancelar
          </button>
          <button form="order-form" type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2">
            <Save size={16} />
            {loading ? 'A processar...' : (pedidoParaEditar ? 'Atualizar Pedido' : 'Criar Pedido')}
          </button>
        </div>
      </div>
    </>
  );
}