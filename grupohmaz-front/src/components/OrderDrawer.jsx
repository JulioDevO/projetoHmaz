import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function OrderDrawer({ isOpen, onClose, onSuccess, pedidoParaEditar }) {
  const [cliente, setCliente] = useState('');
  const [itens, setItens] = useState([
    { produto: '', quantidade: 1, valorTotal: '', observacao: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const [clientesLista, setClientesLista] = useState([]);
  const [maquinasLista, setMaquinasLista] = useState([]);

  // Formata números vindos do banco (ex: 65000 -> "65.000,00")
  const formatarParaMoeda = (valor) => {
    if (valor === undefined || valor === null || valor === '') return '';
    const num = Number(valor);
    if (isNaN(num)) return '';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Máscara de digitação em tempo real (ex: digita 65000 -> "65.000,00")
  const handleMoedaChange = (index, value) => {
    const apenasDigitos = value.replace(/\D/g, '');
    if (!apenasDigitos) {
      handleItemChange(index, 'valorTotal', '');
      return;
    }
    const valorDecimal = Number(apenasDigitos) / 100;
    const valorFormatado = valorDecimal.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    handleItemChange(index, 'valorTotal', valorFormatado);
  };

  // Converte "65.000,00" de volta para 65000.00 antes de enviar ao Supabase
  const converterParaNumero = (valorFormatado) => {
    if (!valorFormatado) return 0;
    const limpo = String(valorFormatado).replace(/\./g, '').replace(',', '.');
    return parseFloat(limpo) || 0;
  };

  // Dispara a busca SEMPRE que a gaveta for aberta (isOpen)
  useEffect(() => {
    async function carregarOpcoes() {
      if (!isOpen) return;
      
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
          setMaquinasLista(maquinasData || []);
        }

      } catch (err) {
        console.error('Erro fatal ao carregar opções:', err.message);
      }
    }
    
    carregarOpcoes();
  }, [isOpen]);

  // Preenche o formulário se for edição ou reseta para novo pedido
  useEffect(() => {
    if (pedidoParaEditar) {
      setCliente(pedidoParaEditar.cliente !== 'Cliente não definido' ? pedidoParaEditar.cliente : '');
      setItens([
        {
          produto: pedidoParaEditar.maquina !== 'Produto não definido' ? pedidoParaEditar.maquina : '',
          quantidade: pedidoParaEditar.qtd || 1,
          valorTotal: formatarParaMoeda(pedidoParaEditar.valorRaw),
          observacao: pedidoParaEditar.observacao || ''
        }
      ]);
    } else {
      setCliente('');
      setItens([{ produto: '', quantidade: 1, valorTotal: '', observacao: '' }]);
    }
  }, [pedidoParaEditar, isOpen]);

  // Adiciona um novo bloco de equipamento
  const handleAddItem = () => {
    setItens([...itens, { produto: '', quantidade: 1, valorTotal: '', observacao: '' }]);
  };

  // Remove um equipamento específico da lista
  const handleRemoveItem = (index) => {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== index));
    }
  };

  // Atualiza os valores de um equipamento específico
  const handleItemChange = (index, field, value) => {
    const novosItens = [...itens];
    novosItens[index][field] = value;
    setItens(novosItens);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (pedidoParaEditar) {
        // Atualiza um único pedido existente
        const item = itens[0];
        const payload = {
          cliente,
          produto: item.produto,
          quantidade: Number(item.quantidade),
          valor_total: converterParaNumero(item.valorTotal),
          observacao: item.observacao,
        };
        const { error } = await supabase.from('pedidos').update(payload).eq('id', pedidoParaEditar.dbId);
        if (error) throw error;
      } else {
        // Insere múltiplos pedidos de uma só vez (Bulk Insert)
        const payload = itens.map((item) => ({
          cliente,
          produto: item.produto,
          quantidade: Number(item.quantidade),
          valor_total: converterParaNumero(item.valorTotal),
          observacao: item.observacao,
          status: 'Pendente'
        }));
        
        const { error } = await supabase.from('pedidos').insert(payload);
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
            
            {/* Cliente */}
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

            {/* Lista Dinâmica de Equipamentos */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {pedidoParaEditar ? 'Equipamento' : 'Equipamento(s) / Produto(s)'}
              </label>

              {itens.map((item, index) => (
                <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-3.5 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Equipamento #{index + 1}
                    </span>
                    {!pedidoParaEditar && itens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                        title="Remover este equipamento"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Máquina / Produto</label>
                    <select 
                      required
                      value={item.produto}
                      onChange={(e) => handleItemChange(index, 'produto', e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Selecione o equipamento...</option>
                      {maquinasLista.map((m, i) => (
                        <option key={i} value={m.nome}>{m.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Quantidade</label>
                      <input 
                        type="number" 
                        min="1"
                        required
                        value={item.quantidade}
                        onChange={(e) => handleItemChange(index, 'quantidade', Number(e.target.value))}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>

                    {/* Campo de Valor Total Formatado */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Valor Total</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 pointer-events-none">
                          R$
                        </span>
                        <input 
                          type="text" 
                          inputMode="numeric"
                          required
                          value={item.valorTotal}
                          onChange={(e) => handleMoedaChange(index, e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 pl-9 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Campo de Observações */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Observações</label>
                    <textarea 
                      rows={2}
                      value={item.observacao}
                      onChange={(e) => handleItemChange(index, 'observacao', e.target.value)}
                      placeholder="Especificações técnicas, detalhes de entrega ou observações..."
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                    />
                  </div>
                </div>
              ))}

              {!pedidoParaEditar && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2.5 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Adicionar outro equipamento
                </button>
              )}
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