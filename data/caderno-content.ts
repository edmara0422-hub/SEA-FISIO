import type { CadernoModuleContent } from '@/types/caderno'

export const CADERNO_CONTENT: CadernoModuleContent[] = [
  {
    moduleId: 'M1',
    topics: [
      {
        id: 'M1-T1',
        title: 'O Organismo e o SN',
        blocks: [
          {
            id: 'M1-T1-slides',
            type: 'slides',
            title: 'O Organismo e o Sistema Nervoso',
            slides: [
              {
                title: 'Fundamentos',
                bullets: [
                  'O cérebro como sistema regulatório distribuído sob restrição energética e incerteza ambiental',
                  'Um organismo não existe porque pensa — ele pensa porque consegue manter estrutura',
                  'As leis da termodinâmica impõem consumo contínuo de energia e exportação de entropia',
                ],
                highlight: 'Todo sistema vivo enfrenta o mesmo problema físico básico: manter organização interna em um universo que tende à desordem.',
              },
              {
                title: 'Sistemas Dissipativos e ATP',
                bullets: [
                  'Sistemas vivos não estão em equilíbrio — lutam continuamente contra a entropia',
                  'Colapsam rapidamente quando o suprimento energético cessa',
                  'ATP (adenosina trifosfato) é a moeda universal de energia celular',
                  'ATP → ADP + Pi + energia',
                ],
                highlight: 'Mitocôndrias: glicose + O₂ → ATP + calor + CO₂',
              },
              {
                title: 'Custo Energético Cerebral',
                bullets: [
                  '60–80% da energia cerebral é consumida apenas para manter bombas iônicas (Attwell & Laughlin, 2001)',
                  'Sem ATP não há: síntese de proteínas, transporte ativo, gradientes, sinal elétrico',
                  'O cérebro não é caro porque pensa — ele pensa porque já é caro para existir',
                ],
              },
              {
                title: 'Membrana e Bomba Na⁺/K⁺',
                bullets: [
                  'Sem membrana não existe dentro/fora, gradiente, metabolismo ou vida',
                  'Bomba Na⁺/K⁺-ATPase: expulsa 3 Na⁺, traz 2 K⁺, consome 1 ATP por ciclo',
                  'Funciona 24h sem parar — o motor silencioso da vida',
                ],
                highlight: '3 Na⁺ (out) + 2 K⁺ (in) + 1 ATP → gradiente eletroquímico',
              },
              {
                title: 'Potencial de Repouso',
                bullets: [
                  'Uma célula excitável não está "em repouso" — gasta energia para permanecer pronta',
                  'Potencial de repouso: ~-70mV (tensão elétrica mantida artificialmente)',
                  'Pico do potencial de ação: +40mV',
                  'Hiperpolarização após o disparo',
                ],
                highlight: 'Estar vivo é estar em dívida energética constante.',
              },
            ],
          },
          {
            id: 'M1-T1-sim-pump',
            type: 'simulation',
            title: 'Bomba Na⁺/K⁺-ATPase Interativa',
            simulationId: 'neuro-pump',
            description: 'Visualize o transporte iônico transmembrana em tempo real',
          },
          {
            id: 'M1-T1-sim-potential',
            type: 'simulation',
            title: 'Potencial de Ação',
            simulationId: 'neuro-action-potential',
            description: 'Gráfico interativo das fases: repouso → despolarização → repolarização',
          },
          {
            id: 'M1-T1-slides-sn',
            type: 'slides',
            title: 'Seção 1.0 — O que é o Sistema Nervoso',
            slides: [
              {
                title: 'Definição',
                bullets: [
                  'Rede complexa e especializada de células distribuída por todo o organismo',
                  'Coordena todas as funções vitais e comportamentais',
                  'Capta informações, processa dados, integra sinais e gera respostas para sobrevivência',
                ],
              },
              {
                title: 'Funções Fundamentais',
                bullets: [
                  'Captar estímulos sensoriais do ambiente externo e meio interno',
                  'Processar e integrar informações em múltiplos níveis de complexidade',
                  'Coordenar respostas motoras voluntárias e involuntárias',
                  'Regular funções viscerais e autonômicas essenciais à homeostase',
                  'Permitir processos cognitivos: memória, linguagem e consciência',
                ],
              },
              {
                title: 'SNC — Sistema Nervoso Central',
                bullets: [
                  'Encéfalo: cérebro, cerebelo e tronco encefálico',
                  'Medula espinhal',
                  'Protegido por: crânio, coluna vertebral, meninges, LCR e barreira hematoencefálica',
                ],
              },
              {
                title: 'SNP — Sistema Nervoso Periférico',
                bullets: [
                  'Nervos cranianos e espinhais conectando SNC aos órgãos',
                  'Sistema Somático: controle voluntário da musculatura esquelética',
                  'Sistema Autônomo: controle involuntário (simpático + parassimpático)',
                ],
                highlight: 'Sistema Nervoso = SNC + SNP — sistema integrado de detecção, processamento e resposta.',
              },
            ],
          },
          {
            id: 'M1-T1-slides-intro',
            type: 'slides',
            title: 'Seção 1.1 — O Lugar do Cérebro na Biologia',
            slides: [
              {
                title: 'Perspectiva Clássica',
                bullets: [
                  'Em Guyton & Hall: SN como sistema de integração regulatória subordinado à manutenção do meio interno',
                  'Em Kandel: inicia na membrana e potencial de repouso, não em conceitos psicológicos',
                  'O SN existe primariamente para manter a viabilidade do organismo em ambiente incerto',
                ],
                highlight: 'Abordagens que colocam vontade consciente como motor primário partem de premissa biologicamente incorreta.',
              },
              {
                title: 'Funções Integradas',
                bullets: [
                  'Homeostase: regula trilhões de células para equilíbrio interno',
                  'Estímulos Sensoriais: monitora conscientes (visão, tato) e inconscientes (pH, gases, PA)',
                  'Integração: processa no encéfalo/medula → resposta, memória ou descarte',
                  'Controle Motor: comanda esqueléticos, lisos, cardíaco e secreção glandular',
                  'Atividade Mental: consciência, pensamento, memória e emoções',
                ],
              },
            ],
          },
          {
            id: 'M1-T1-slides-distrib',
            type: 'slides',
            title: 'Seção 1.2 — Sistema Regulatório Distribuído',
            slides: [
              {
                title: 'Arquitetura Distribuída',
                bullets: [
                  'Não existe centro único — múltiplos sistemas interconectados operam em paralelo',
                  'Operação limitada por recursos metabólicos e temporais',
                  'O cérebro não "pensa e manda" — é parte de um sistema corpo–cérebro',
                  'Função primária: regular estados internos e reduzir risco biológico',
                ],
                highlight: 'O cérebro é parte de um sistema corpo–cérebro cuja função primária é regular estados internos.',
              },
            ],
          },
          {
            id: 'M1-T1-slides-racional',
            type: 'slides',
            title: 'Seções 1.3–1.5 — Racionalidade, Predição e Conclusão',
            slides: [
              {
                title: '1.3 Racionalidade como Função Emergente',
                bullets: [
                  'Racionalidade, planejamento e decisão não são processos primários',
                  '"Decisão racional" é frequentemente justificativa post-hoc de processos implícitos',
                  'Aproximação heurística sob restrição temporal e computacional',
                  'Narrativa construída para coerência com a autoimagem',
                ],
              },
              {
                title: '1.4 Predição e Free Energy',
                bullets: [
                  'Teoria de Free Energy e Predictive Processing: cérebro como máquina de inferência bayesiana',
                  'O cérebro não reage — ele antecipa',
                  'Atividade neural é gerativa: prevê o que vai acontecer antes que aconteça',
                  'Permite ação eficiente, poupa energia metabólica e protege de riscos',
                ],
                highlight: 'O cérebro tenta continuamente minimizar a surpresa (prediction error).',
              },
              {
                title: '1.5 Conclusão Preliminar',
                bullets: [
                  'O SN existe para garantir sobrevivência metabólica e regulação sob incerteza',
                  'Racionalidade é ferramenta tardia e limitada, subordinada a funções mais antigas',
                  'Não existe "eu" central que decide',
                  'Existe uma rede distribuída que negocia recursos limitados para manter um organismo viável',
                ],
                highlight: 'Compreender isso é essencial para não projetar sobre o sistema nervoso propriedades que ele não possui.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    moduleId: 'M2',
    topics: [
      { id: 'M2-T1', title: 'Pneumo / VM', blocks: [] },
    ],
  },
  {
    moduleId: 'M3',
    topics: [
      { id: 'M3-T1', title: 'Cardio', blocks: [] },
    ],
  },
]
