import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { mascaraMoedaInput, converterParaNumero, formatarMoeda } from '../utils/formatters';

export default function OrderDrawer({ isOpen, onClose, onSuccess, pedidoParaEditar }) {
  const [cliente, setCliente] = useState('');
  const [itens, setItens] = useState([{ 
    produto: '', quantidade: 1, valorTotal: '', observacao: '', 
    condicaoPagamento: 'a_vista', numParcelas: 1, valorParcela: 0, vencimentoInicial: '' 
  }]);
  const [loading, setLoading] = useState(false);
  const [clientesLista, setClientesLista] = useState([]);
  const [maquinasLista, setMaquinasLista] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    async function carregarOpcoes() {
      if (!isOpen) return;
      const [{ data: clientes }, { data: maquinas }] = await Promise.all([
        supabase.from('clientes').select('nome').order('nome'),
        supabase.from('produtos').select('nome').order('nome')
      ]);
      setClientesLista(clientes || []);
      setMaquinasLista(maquinas || []);
    }
    carregarOpcoes();
  }, [isOpen]);

  useEffect(() => {
    if (pedidoParaEditar) {
      const condicao = pedidoParaEditar.condicao_pagamento || 'a_vista';
      const parcelas = Number(pedidoParaEditar.num_parcelas) || 1;
      const valorNum = Number(pedidoParaEditar.valorRaw) || 0;
      const valorParc = pedidoParaEditar.valor_parcela
        ? Number(pedidoParaEditar.valor_parcela).toFixed(2)
        : (parcelas > 0 ? (valorNum / parcelas).toFixed(2) : '0.00');

      setCliente(pedidoParaEditar.cliente !== 'Cliente não definido' ? pedidoParaEditar.cliente : '');
      setItens([{
        produto: pedidoParaEditar.maquina !== 'Produto não definido' ? pedidoParaEditar.maquina : '',
        quantidade: pedidoParaEditar.qtd || 1,
        valorTotal: formatarMoeda(valorNum),
        observacao: pedidoParaEditar.observacao || '',
        condicaoPagamento: condicao,
        numParcelas: parcelas,
        vencimentoInicial: pedidoParaEditar.vencimento_inicial
          ? String(pedidoParaEditar.vencimento_inicial).split('T')[0]
          : '',
        valorParcela: valorParc
      }]);
    } else {
      setCliente('');
      setItens([{
        produto: '',
        quantidade: 1,
        valorTotal: '',
        observacao: '',
        condicaoPagamento: 'a_vista',
        numParcelas: 1,
        valorParcela: 0,
        vencimentoInicial: ''
      }]);
    }
  }, [pedidoParaEditar, isOpen]);

  const handleItemChange = (index, field, value) => {
    const novosItens = [...itens];
    novosItens[index][field] = value;

    if (field === 'condicaoPagamento' && value === 'parcelado' && Number(novosItens[index].numParcelas) < 2) {
      novosItens[index].numParcelas = 2;
    }

    if (field === 'valorTotal' || field === 'numParcelas' || field === 'condicaoPagamento') {
      const valorNum = field === 'valorTotal'
        ? converterParaNumero(value)
        : converterParaNumero(novosItens[index].valorTotal);
      const parcelas = Number(novosItens[index].numParcelas) || 1;
      novosItens[index].valorParcela = parcelas > 0 ? (valorNum / parcelas).toFixed(2) : 0;
    }

    setItens(novosItens);
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = itens.map((item) => {
        const valorTotalNum = converterParaNumero(item.valorTotal);
        const isParcelado = item.condicaoPagamento === 'parcelado';
        const parcelas = isParcelado ? Number(item.numParcelas) : 1;
        const valorParcelaNum = isParcelado
          ? Number((valorTotalNum / parcelas).toFixed(2))
          : valorTotalNum;

        const registro = {
          cliente,
          produto: item.produto,
          quantidade: Number(item.quantidade),
          valor_total: valorTotalNum,
          observacao: item.observacao,
          condicao_pagamento: item.condicaoPagamento,
          num_parcelas: parcelas,
          valor_parcela: valorParcelaNum,
          vencimento_inicial: isParcelado
            ? item.vencimentoInicial
            : (pedidoParaEditar?.vencimento_inicial
                ? String(pedidoParaEditar.vencimento_inicial).split('T')[0]
                : new Date().toISOString().split('T')[0])
        };

        if (!pedidoParaEditar) {
          registro.status = 'Pendente';
        }

        return registro;
      });

      if (pedidoParaEditar) {
        const { error } = await supabase.from('pedidos').update(payload[0]).eq('id', pedidoParaEditar.dbId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pedidos').insert(payload);
        if (error) throw error;
      }

      showToast(pedidoParaEditar ? 'Pedido atualizado!' : 'Pedido criado com sucesso!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (error) {
      console.error(error);
      alert('Erro ao guardar o pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />}
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up">
          <CheckCircle2 size={18} /> <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white dark:bg-[#0a0a0a] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {pedidoParaEditar ? `Editar ${pedidoParaEditar.id}` : 'Novo Pedido'}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all active:scale-95">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="order-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Cliente</label>
              <select required value={cliente} onChange={(e) => setCliente(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors">
                <option value="">Selecione um cliente...</option>
                {clientesLista.map((c, i) => <option key={i} value={c.nome}>{c.nome}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              {itens.map((item, index) => (
                <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Equipamento #{index + 1}</span>
                    {!pedidoParaEditar && itens.length > 1 && (
                      <button type="button" onClick={() => setItens(itens.filter((_, i) => i !== index))} className="text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <select required value={item.produto} onChange={(e) => handleItemChange(index, 'produto', e.target.value)} className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500">
                    <option value="">Selecione o equipamento...</option>
                    {maquinasLista.map((m, i) => <option key={i} value={m.nome}>{m.nome}</option>)}
                  </select>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Quantidade</label>
                      <input type="number" min="1" required value={item.quantidade} onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)} className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Valor Total (R$)</label>
                      <input type="text" required value={item.valorTotal} onChange={(e) => handleItemChange(index, 'valorTotal', mascaraMoedaInput(e.target.value))} className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500" placeholder="0,00" />
                    </div>
                  </div>

                  {/* Fluxo Financeiro (À vista vs Parcelado) */}
                  <div className="p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md space-y-3">
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Condição de Pagamento</label>
                    <select value={item.condicaoPagamento} onChange={(e) => handleItemChange(index, 'condicaoPagamento', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500">
                      <option value="a_vista">À Vista (Integral)</option>
                      <option value="parcelado">Parcelado</option>
                    </select>

                    {item.condicaoPagamento === 'parcelado' && (
                      <div className="grid grid-cols-2 gap-3 animate-slide-up">
                        <div>
                          <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Nº de Parcelas</label>
                          <input type="number" min="2" max="48" required value={item.numParcelas} onChange={(e) => handleItemChange(index, 'numParcelas', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">1º Vencimento</label>
                          <input type="date" required value={item.vencimentoInicial} onChange={(e) => handleItemChange(index, 'vencimentoInicial', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md p-2 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500" />
                        </div>
                        <div className="col-span-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded border border-emerald-200 dark:border-emerald-900/50">
                          Valor estimado da parcela: {Number(item.valorParcela).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </div>
                    )}
                  </div>

                  <textarea rows={2} value={item.observacao} onChange={(e) => handleItemChange(index, 'observacao', e.target.value)} placeholder="Observações de montagem..." className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 text-sm text-zinc-900 dark:text-white resize-none outline-none focus:border-blue-500" />
                </div>
              ))}
              
              {!pedidoParaEditar && (
                <button type="button" onClick={() => setItens([...itens, { produto: '', quantidade: 1, valorTotal: '', observacao: '', condicaoPagamento: 'a_vista', numParcelas: 1, valorParcela: 0, vencimentoInicial: '' }])} className="w-full py-2.5 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-blue-600 hover:border-blue-500 rounded-md text-sm font-medium transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Plus size={16} /> Adicionar outro equipamento
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all active:scale-95">Cancelar</button>
          <button form="order-form" type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-all active:scale-95 flex items-center gap-2">
            <Save size={16} /> {loading ? 'A processar...' : 'Salvar Pedido'}
          </button>
        </div>
      </div>
    </>
  );
}