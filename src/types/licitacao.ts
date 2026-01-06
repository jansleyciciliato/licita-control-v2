export type LicitacaoStatus = 
  | 'ANALISAR' 
  | 'PARTICIPAR' 
  | 'DESCARTADA' 
  | 'VENCEDOR' 
  | 'PERDIDA' 
  | 'SUSPENSA';

export interface ItemLicitacao {
  lote: string;
  item: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valor_estimado: number;
}

export interface Licitacao {
  id: string;
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
  documentos_habilitacao: Record<string, unknown>;
  itens: ItemLicitacao[];
  status: LicitacaoStatus;
  data_cadastro: string;
}

export const STATUS_CONFIG: Record<LicitacaoStatus, { label: string; color: string; bgColor: string }> = {
  ANALISAR: { label: 'Analisar', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  PARTICIPAR: { label: 'Participar', color: 'text-green-700', bgColor: 'bg-green-100' },
  DESCARTADA: { label: 'Descartada', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  VENCEDOR: { label: 'Vencedor', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  PERDIDA: { label: 'Perdida', color: 'text-red-700', bgColor: 'bg-red-100' },
  SUSPENSA: { label: 'Suspensa', color: 'text-orange-700', bgColor: 'bg-orange-100' },
};
