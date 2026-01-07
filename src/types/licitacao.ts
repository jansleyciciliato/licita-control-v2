// src/types/licitacao.ts
// Tipos unificados que usam a tipagem do Supabase como base

import type { Tables } from '@/integrations/supabase/types';

// Tipo base do Supabase
export type Licitacao = Tables<'licitacoes'>;

// Status da licitação
export type LicitacaoStatus = 
  | 'ANALISAR' 
  | 'PARTICIPAR' 
  | 'DESCARTADA' 
  | 'VENCEDOR' 
  | 'PERDIDA' 
  | 'SUSPENSA';

// Modalidades (extraído da constraint do banco)
export type Modalidade = 
  | 'eletronico'
  | 'presencial'
  | 'dispensa'
  | 'credenciamento';

// Tipos de disputa (extraído da constraint do banco)
export type TipoDisputa = 
  | 'global'
  | 'por lote'
  | 'por item';

// Interface para item de licitação (estrutura do JSONB)
export interface ItemLicitacao {
  lote?: string | number;
  item?: string | number;
  descricao?: string;
  unidade?: string;
  quantidade?: number;
  valor_estimado?: number;
}

// Alias para compatibilidade com código antigo
export type LicitacaoItem = ItemLicitacao;

// Interface para documento de habilitação (estrutura do JSONB)
export interface DocumentoHabilitacao {
  documento?: string;
  descricao?: string;
  obrigatorio?: boolean;
}

// Interface para formulário de licitação
export interface LicitacaoFormData {
  numero_edital: string;
  numero_processo: string;
  orgao: string;
  modalidade: string;
  tipo_disputa: string;
  registro_preco: boolean;
  tipo_lances: string;
  data_abertura: string;
  data_hora_abertura: string;
  objeto: string;
  objeto_resumido: string;
  status: LicitacaoStatus;
}

// Interface para criação de nova licitação (sem id e data_cadastro)
export type NovaLicitacao = Omit<Licitacao, 'id' | 'data_cadastro'>;

// Interface para atualização (campos opcionais)
export type AtualizarLicitacao = Partial<Omit<Licitacao, 'id' | 'data_cadastro'>>;

// Configuração de status para badges e visualização
export const STATUS_CONFIG: Record<LicitacaoStatus, { label: string; color: string; bgColor: string }> = {
  ANALISAR: { label: 'Analisar', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  PARTICIPAR: { label: 'Participar', color: 'text-green-700', bgColor: 'bg-green-100' },
  DESCARTADA: { label: 'Descartada', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  VENCEDOR: { label: 'Vencedor', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  PERDIDA: { label: 'Perdida', color: 'text-red-700', bgColor: 'bg-red-100' },
  SUSPENSA: { label: 'Suspensa', color: 'text-orange-700', bgColor: 'bg-orange-100' },
};

// Opções de status para selects e dropdowns
export const STATUS_OPTIONS: { value: LicitacaoStatus; label: string }[] = [
  { value: 'ANALISAR', label: 'Analisar' },
  { value: 'PARTICIPAR', label: 'Participar' },
  { value: 'DESCARTADA', label: 'Descartada' },
  { value: 'VENCEDOR', label: 'Vencedor' },
  { value: 'PERDIDA', label: 'Perdida' },
  { value: 'SUSPENSA', label: 'Suspensa' },
];

// Função helper para obter classe CSS do status
export const getStatusClassName = (status: LicitacaoStatus): string => {
  const statusClasses: Record<LicitacaoStatus, string> = {
    ANALISAR: 'status-analisar',
    PARTICIPAR: 'status-participar',
    DESCARTADA: 'status-descartada',
    VENCEDOR: 'status-vencedor',
    PERDIDA: 'status-perdida',
    SUSPENSA: 'status-suspensa',
  };
  return statusClasses[status];
};

// Helper type guards
export function isValidStatus(status: string): status is LicitacaoStatus {
  return ['ANALISAR', 'PARTICIPAR', 'DESCARTADA', 'VENCEDOR', 'PERDIDA', 'SUSPENSA'].includes(status);
}

export function isValidModalidade(modalidade: string): modalidade is Modalidade {
  return ['eletronico', 'presencial', 'dispensa', 'credenciamento'].includes(modalidade);
}

export function isValidTipoDisputa(tipo: string): tipo is TipoDisputa {
  return ['global', 'por lote', 'por item'].includes(tipo);
}