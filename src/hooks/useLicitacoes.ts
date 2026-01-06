import { useState } from 'react';
import { Licitacao, LicitacaoStatus } from '@/types/licitacao';
import { mockLicitacoes } from '@/data/mockLicitacoes';

export function useLicitacoes() {
  const [licitacoes, setLicitacoes] = useState<Licitacao[]>(mockLicitacoes);

  const addLicitacao = (licitacao: Omit<Licitacao, 'id' | 'data_cadastro' | 'status'>) => {
    const newLicitacao: Licitacao = {
      ...licitacao,
      id: crypto.randomUUID(),
      status: 'ANALISAR',
      data_cadastro: new Date().toISOString(),
    };
    setLicitacoes(prev => [newLicitacao, ...prev]);
    return newLicitacao;
  };

  const updateLicitacao = (id: string, updates: Partial<Licitacao>) => {
    setLicitacoes(prev => 
      prev.map(l => l.id === id ? { ...l, ...updates } : l)
    );
  };

  const updateStatus = (id: string, status: LicitacaoStatus) => {
    updateLicitacao(id, { status });
  };

  const deleteLicitacao = (id: string) => {
    setLicitacoes(prev => prev.filter(l => l.id !== id));
  };

  const getLicitacaoById = (id: string) => {
    return licitacoes.find(l => l.id === id);
  };

  return {
    licitacoes,
    addLicitacao,
    updateLicitacao,
    updateStatus,
    deleteLicitacao,
    getLicitacaoById,
  };
}
