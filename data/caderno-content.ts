import type { CadernoModuleContent } from '@/types/caderno'

// Estrutura dos sub-módulos — conteúdo (blocos) será adicionado depois
export const CADERNO_CONTENT: CadernoModuleContent[] = [
  {
    moduleId: 'M1',
    topics: [
      { id: 'M1-T1', title: 'Plasticidade Neural', blocks: [] },
      { id: 'M1-T2', title: 'Mapas Funcionais Corticais', blocks: [] },
      { id: 'M1-T3', title: 'Avaliação Neurológica', blocks: [] },
      { id: 'M1-T4', title: 'Correlações Clínicas', blocks: [] },
    ],
  },
  {
    moduleId: 'M2',
    topics: [
      { id: 'M2-T1', title: 'Ventilação Protetora', blocks: [] },
      { id: 'M2-T2', title: 'PEEP e Mecânica Pulmonar', blocks: [] },
      { id: 'M2-T3', title: 'Curvas Ventilatórias', blocks: [] },
      { id: 'M2-T4', title: 'Desmame Ventilatório', blocks: [] },
    ],
  },
  {
    moduleId: 'M3',
    topics: [
      { id: 'M3-T1', title: 'ECG — Leitura Sistemática', blocks: [] },
      { id: 'M3-T2', title: 'Ritmos e Arritmias', blocks: [] },
      { id: 'M3-T3', title: 'Hemodinâmica Clínica', blocks: [] },
      { id: 'M3-T4', title: 'Raciocínio Clínico em Cardio', blocks: [] },
    ],
  },
]
