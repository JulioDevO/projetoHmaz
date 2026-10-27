import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { MessageSquare, Plus, CheckCircle2, Clock, X, Send, AlertCircle } from 'lucide-react';

export default function Feedbacks() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Novos estados de UX/UI
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Erro ao procurar feedbacks:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpa erros anteriores
    if (!titulo.trim() || !descricao.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert([{ titulo, descricao }]);

      if (error) throw error;
      
      // Feedback visual de sucesso (UX)
      setIsSuccess(true);
      fetchFeedbacks(); 
      
      // Aguarda 2 segundos e fecha o modal suavemente
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
        setTitulo('');
        setDescricao('');
      }, 2000);

    } catch (error) {
      console.error('Erro ao criar feedback:', error.message);
      setErrorMessage(error.message); // Exibe o erro na UI
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAsCompleted = async (id) => {
    try {
      const { error } = await supabase
        .from('feedbacks')
        .update({ status: 'Concluído' })
        .eq('id', id);

      if (error) throw error;
      fetchFeedbacks();
    } catch (error) {
      console.error('Erro ao atualizar status:', error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-blue-500" />
            Sugestões e Melhorias
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Acompanhe as solicitações de alterações e novas funcionalidades do sistema.
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0a0a0a]"
          >
            <Plus size={18} />
            Nova Sugestão
          </button>
        )}
      </div>

      {/* Lista de Feedbacks */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors">
          <MessageSquare size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Nenhuma solicitação</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Ainda não existem feedbacks registados no sistema.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {feedbacks.map((item) => (
            <div key={item.id} className="bg-white dark:bg-[#121214] p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-4 justify-between sm:items-start transition-colors">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{item.titulo}</h3>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors ${
                    item.status === 'Concluído' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' 
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                  }`}>
                    {item.status === 'Concluído' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {item.status || 'Pendente'}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{item.descricao}</p>
                <div className="text-xs text-zinc-500 dark:text-zinc-500 pt-2">
                  Enviado a: {new Date(item.created_at).toLocaleDateString('pt-BR')} às {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {user?.role === 'dev' && item.status !== 'Concluído' && (
                <button
                  onClick={() => markAsCompleted(item.id)}
                  className="shrink-0 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <CheckCircle2 size={16} />
                  Marcar Concluído
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* O cabeçalho agora só aparece se não estiver no estado de sucesso */}
            {!isSuccess && (
              <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800/80">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <MessageSquare size={20} className="text-blue-500" />
                  Enviar Feedback
                </h2>
                <button 
                  onClick={() => !isSubmitting && setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            
            {isSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">Feedback Enviado!</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">A sua sugestão foi registada com sucesso.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                
                {/* Alerta de Erro */}
                {errorMessage && (
                  <div className="flex items-start gap-2 p-3 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-900/50">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Título da solicitação</label>
                  <input 
                    required
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Ex: Novo filtro na tela de pedidos"
                    className="w-full bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm rounded-lg p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Descrição</label>
                  <textarea 
                    required
                    rows={4}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Descreva a alteração ou melhoria desejada..."
                    className="w-full bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm rounded-lg p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-60"
                  />
                </div>
                
                <div className="mt-2 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !titulo.trim() || !descricao.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#121214] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    {isSubmitting ? 'A enviar...' : 'Enviar Sugestão'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}