// src/hooks/useLicitacoes.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Licitacao = Tables<'licitacoes'>;

interface UseLicitacoesReturn {
  licitacoes: Licitacao[];
  loading: boolean;
  error: string | null;
  fetchLicitacoes: () => Promise<void>;
  fetchLicitacaoById: (id: string) => Promise<Licitacao | null>;
  createLicitacao: (licitacao: Omit<Licitacao, 'id' | 'data_cadastro'>) => Promise<Licitacao | null>;
  updateLicitacao: (id: string, updates: Partial<Licitacao>) => Promise<Licitacao | null>;
  deleteLicitacao: (id: string) => Promise<boolean>;
  filterByStatus: (status: string) => Licitacao[];
  filterByModalidade: (modalidade: string) => Licitacao[];
}

export const useLicitacoes = (): UseLicitacoesReturn => {
  const [licitacoes, setLicitacoes] = useState<Licitacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar todas as licitações
  const fetchLicitacoes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('licitacoes')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (fetchError) throw fetchError;

      setLicitacoes(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar licitações';
      setError(errorMessage);
      console.error('Erro ao buscar licitações:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar licitação por ID
  const fetchLicitacaoById = async (id: string): Promise<Licitacao | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('licitacoes')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar licitação';
      setError(errorMessage);
      console.error('Erro ao buscar licitação:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Criar nova licitação
  const createLicitacao = async (
    licitacao: Omit<Licitacao, 'id' | 'data_cadastro'>
  ): Promise<Licitacao | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('licitacoes')
        .insert([licitacao])
        .select()
        .single();

      if (insertError) throw insertError;

      // Atualiza a lista local
      if (data) {
        setLicitacoes(prev => [data, ...prev]);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar licitação';
      setError(errorMessage);
      console.error('Erro ao criar licitação:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar licitação
  const updateLicitacao = async (
    id: string,
    updates: Partial<Licitacao>
  ): Promise<Licitacao | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('licitacoes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Atualiza a lista local
      if (data) {
        setLicitacoes(prev =>
          prev.map(lic => (lic.id === id ? data : lic))
        );
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar licitação';
      setError(errorMessage);
      console.error('Erro ao atualizar licitação:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Deletar licitação
  const deleteLicitacao = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('licitacoes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Remove da lista local
      setLicitacoes(prev => prev.filter(lic => lic.id !== id));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar licitação';
      setError(errorMessage);
      console.error('Erro ao deletar licitação:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por status
  const filterByStatus = (status: string): Licitacao[] => {
    return licitacoes.filter(lic => lic.status === status);
  };

  // Filtrar por modalidade
  const filterByModalidade = (modalidade: string): Licitacao[] => {
    return licitacoes.filter(lic => lic.modalidade === modalidade);
  };

  // Carregar licitações ao montar o componente
  useEffect(() => {
    fetchLicitacoes();
  }, []);

  return {
    licitacoes,
    loading,
    error,
    fetchLicitacoes,
    fetchLicitacaoById,
    createLicitacao,
    updateLicitacao,
    deleteLicitacao,
    filterByStatus,
    filterByModalidade,
  };
};