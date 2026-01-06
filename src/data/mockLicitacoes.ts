import { Licitacao } from '@/types/licitacao';

export const mockLicitacoes: Licitacao[] = [
  {
    id: '1',
    numero_edital: 'PE 001/2024',
    numero_processo: '2024.001.001',
    orgao: 'Prefeitura Municipal de São Paulo',
    modalidade: 'Pregão Eletrônico',
    tipo_disputa: 'Aberto',
    registro_preco: true,
    tipo_lances: 'Fechado',
    data_abertura: '2024-02-15',
    data_hora_abertura: '2024-02-15T09:00:00',
    objeto: 'Contratação de empresa especializada para fornecimento de materiais de escritório para atender as necessidades da Secretaria de Administração.',
    objeto_resumido: 'Materiais de escritório',
    documentos_habilitacao: {
      habilitacao_juridica: [
        'Ato constitutivo, estatuto ou contrato social em vigor',
        'Documento de eleição dos administradores',
        'Cédula de identidade dos sócios'
      ],
      regularidade_fiscal: [
        'CNPJ - Cadastro Nacional de Pessoa Jurídica',
        'Certidão Negativa de Débitos Federais',
        'Certidão de Regularidade do FGTS',
        'Certidão Negativa de Débitos Trabalhistas (CNDT)',
        'Certidão Negativa de Débitos Estaduais',
        'Certidão Negativa de Débitos Municipais'
      ],
      qualificacao_tecnica: [
        'Atestado de capacidade técnica emitido por pessoa jurídica de direito público ou privado',
        'Registro ou inscrição na entidade profissional competente'
      ],
      qualificacao_economica: [
        'Balanço patrimonial e demonstrações contábeis do último exercício social',
        'Certidão negativa de falência ou recuperação judicial'
      ]
    },
    itens: [
      { lote: '1', item: '1', descricao: 'Papel A4 75g', unidade: 'Resma', quantidade: 1000, valor_estimado: 25.00 },
      { lote: '1', item: '2', descricao: 'Caneta esferográfica azul', unidade: 'Caixa', quantidade: 500, valor_estimado: 15.00 },
    ],
    status: 'ANALISAR',
    data_cadastro: '2024-01-10T14:30:00',
  },
  {
    id: '2',
    numero_edital: 'PE 015/2024',
    numero_processo: '2024.015.002',
    orgao: 'Tribunal de Justiça do Estado',
    modalidade: 'Pregão Eletrônico',
    tipo_disputa: 'Aberto e Fechado',
    registro_preco: false,
    tipo_lances: 'Aberto',
    data_abertura: '2024-02-20',
    data_hora_abertura: '2024-02-20T14:00:00',
    objeto: 'Aquisição de equipamentos de informática incluindo computadores, monitores e periféricos.',
    objeto_resumido: 'Equipamentos de TI',
    documentos_habilitacao: {
      habilitacao_juridica: [
        'Registro comercial, no caso de empresa individual',
        'Ato constitutivo, estatuto ou contrato social atualizado'
      ],
      regularidade_fiscal: [
        'Prova de inscrição no CNPJ',
        'Prova de regularidade fiscal perante a Fazenda Nacional',
        'Prova de regularidade relativa ao FGTS'
      ],
      qualificacao_tecnica: [
        'Comprovação de aptidão para o fornecimento de bens pertinentes e compatíveis',
        'Declaração de que tomou conhecimento de todas as condições do edital'
      ]
    },
    itens: [
      { lote: '1', item: '1', descricao: 'Computador Desktop i7', unidade: 'Unidade', quantidade: 50, valor_estimado: 4500.00 },
    ],
    status: 'PARTICIPAR',
    data_cadastro: '2024-01-15T10:00:00',
  },
  {
    id: '3',
    numero_edital: 'CC 003/2024',
    numero_processo: '2024.003.003',
    orgao: 'Ministério da Saúde',
    modalidade: 'Concorrência',
    tipo_disputa: 'Fechado',
    registro_preco: true,
    tipo_lances: 'Fechado',
    data_abertura: '2024-01-25',
    data_hora_abertura: '2024-01-25T10:00:00',
    objeto: 'Contratação de serviços de limpeza hospitalar.',
    objeto_resumido: 'Serviços de limpeza',
    documentos_habilitacao: {},
    itens: [],
    status: 'VENCEDOR',
    data_cadastro: '2024-01-05T08:00:00',
  },
];
