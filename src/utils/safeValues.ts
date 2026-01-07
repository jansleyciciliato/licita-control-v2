// src/utils/safeValues.ts
// Helpers para lidar com valores null/undefined de forma segura

import type { Tables } from '@/integrations/supabase/types';

type Licitacao = Tables<'licitacoes'>;

/**
 * Formata data de forma segura, tratando null/undefined
 */
export function formatarData(data: string | null | undefined): string {
  if (!data) return '';
  
  try {
    const date = new Date(data);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR');
  } catch {
    return '';
  }
}

/**
 * Formata data e hora de forma segura
 */
export function formatarDataHora(dataHora: string | null | undefined): string {
  if (!dataHora) return '';
  
  try {
    const date = new Date(dataHora);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('pt-BR');
  } catch {
    return '';
  }
}

/**
 * Formata número de forma segura
 */
export function formatarNumero(numero: number | null | undefined): string {
  if (numero === null || numero === undefined) return '';
  return numero.toLocaleString('pt-BR');
}

/**
 * Formata valor monetário de forma segura
 */
export function formatarMoeda(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Normaliza licitação do Supabase para uso no frontend
 * Converte todos os campos null em valores padrão
 */
export function normalizarLicitacao(licitacao: Licitacao): Licitacao {
  return {
    ...licitacao,
    numero_edital: licitacao.numero_edital || '',
    numero_processo: licitacao.numero_processo || '',
    orgao: licitacao.orgao || '',
    modalidade: licitacao.modalidade || '',
    tipo_disputa: licitacao.tipo_disputa || '',
    tipo_lances: licitacao.tipo_lances || '',
    data_abertura: licitacao.data_abertura || '',
    data_hora_abertura: licitacao.data_hora_abertura || '',
    objeto: licitacao.objeto || '',
    objeto_resumido: licitacao.objeto_resumido || '',
    registro_preco: licitacao.registro_preco ?? false,
    itens: licitacao.itens || null,
    documentos_habilitacao: licitacao.documentos_habilitacao || null,
  } as Licitacao;
}

/**
 * Verifica se uma string de data é válida
 */
export function isDataValida(data: string | null | undefined): boolean {
  if (!data) return false;
  const date = new Date(data);
  return !isNaN(date.getTime());
}