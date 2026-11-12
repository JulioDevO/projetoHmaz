import { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WhatsNewModal({ forceOpen, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const CURRENT_VERSION = 'hmaz_v1.2';

  useEffect(() => {
    const isSeen = localStorage.getItem(CURRENT_VERSION);
    if (!isSeen) {
      setIsOpen(true);
      localStorage.setItem(CURRENT_VERSION, 'true');
    }
  }, []);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="bg-blue-600 p-6 text-white relative">
          <button onClick={handleClose} className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={24} className="text-blue-200" />
            <h2 className="text-xl font-bold">Novidades no HMAZ</h2>
          </div>
          <p className="text-blue-100 text-sm">Confira as ferramentas recém-adicionadas para melhorar sua gestão.</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Previsão Financeira & Parcelamento</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Agora você pode dividir o valor do pedido em parcelas e ver a projeção real de ganhos mês a mês no seu Dashboard.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Campos de Observação</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Adicione notas técnicas e exigências do cliente diretamente em cada máquina durante a criação do pedido.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Inserção Rápida em Lote</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Venda vários equipamentos para o mesmo cliente de uma só vez na tela de Novo Pedido.</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end">
          <button onClick={handleClose} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all active:scale-95">
            Entendi, vamos lá!
          </button>
        </div>
      </div>
    </div>
  );
}