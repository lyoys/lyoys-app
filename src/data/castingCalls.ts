export type CastingCall = {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  requisitos: string[];
  local: string;
  dataLimite: string; // ISO date
  status: 'aberta' | 'encerrada';
  origem: 'lyoys' | 'terceiros';
  parceiro?: string; // nome do parceiro, obrigatório quando origem = 'terceiros'
};

// Dados padrão, embutidos no app: aparecem antes da primeira busca na planilha remota
// terminar, e servem de fallback se o dispositivo nunca conseguiu buscar dados online
// (sem internet e sem cache salvo ainda). A fonte que atualiza sem nova versão do app é
// a planilha configurada em CASTING_DATA_URL (src/config.ts) — ver
// src/services/castingSource.ts e README.md, seção "Atualizar vagas sem lançar nova
// versão".
export const defaultCastingCalls: CastingCall[] = [
  {
    id: 'corvo-elenco-2026',
    titulo: 'Elenco — Projeto Corvo',
    categoria: 'Teatro',
    descricao:
      'Chamada para atores e atrizes (16-29 anos) para integrar o elenco da montagem teatral do Projeto Corvo, com oficinas formativas e apresentações.',
    requisitos: [
      'Idade entre 16 e 29 anos',
      'Disponibilidade para ensaios de segunda a sábado',
      'Morar em Taguatinga ou regiões próximas (DF)',
      'Não é necessária experiência prévia'
    ],
    local: 'Taguatinga - DF',
    dataLimite: '2026-08-15',
    status: 'aberta',
    origem: 'lyoys'
  },
  {
    id: 'reels-modelos-2026',
    titulo: 'Modelos para reels institucionais',
    categoria: 'Audiovisual',
    descricao:
      'Busca de modelos e talentos para participar de gravações de reels institucionais e campanhas de marca da Lyoys.',
    requisitos: [
      'Maiores de 18 anos',
      'Disponibilidade em horário comercial',
      'Envio de fotos e vídeo de apresentação de 30s'
    ],
    local: 'Águas Claras / Taguatinga - DF',
    dataLimite: '2026-09-01',
    status: 'aberta',
    origem: 'lyoys'
  },
  {
    id: 'curta-parceiro-2026',
    titulo: 'Figurantes para curta-metragem',
    categoria: 'Audiovisual',
    descricao:
      'A Lyoys está apenas divulgando esta oportunidade em parceria: seleção e produção são de responsabilidade da produtora parceira, não da Lyoys.',
    requisitos: [
      'Maiores de 16 anos',
      'Disponibilidade para 1 diária de gravação',
      'Inscrição e processo seletivo conduzidos pela produtora parceira'
    ],
    local: 'Brasília - DF',
    dataLimite: '2026-08-30',
    status: 'aberta',
    origem: 'terceiros',
    parceiro: 'Produtora Vetor Filmes'
  }
];
