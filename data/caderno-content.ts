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
            title: 'Fundamentos Biológicos',
            slides: [
              {
                title: 'Organismo e Termodinâmica',
                bullets: [
                  'Um organismo não existe porque pensa — ele pensa porque consegue manter estrutura',
                  'Todo sistema vivo enfrenta manter organização interna em um universo que tende à desordem',
                  'Sistemas vivos são dissipativos: não estão em equilíbrio, lutam contra a entropia',
                  'Colapsam rapidamente quando o suprimento energético cessa',
                ],
                highlight: 'O cérebro como sistema regulatório distribuído sob restrição energética e incerteza ambiental.',
              },
              {
                title: 'ATP — A Moeda Universal',
                bullets: [
                  'Toda energia utilizável nas células é intermediada por ATP (adenosina trifosfato)',
                  'ATP → ADP + Pi + energia',
                  'Mitocôndrias produzem ATP por fosforilação oxidativa: glicose + O₂ → ATP + calor + CO₂',
                  'Sem ATP não há: síntese de proteínas, transporte ativo, manutenção estrutural, gradientes, sinal elétrico, vida',
                ],
                highlight: 'Sem ATP, nenhum processo biológico se sustenta.',
              },
              {
                title: 'Membrana — O Nascimento da Vida',
                bullets: [
                  'A vida celular só é possível porque existe membrana',
                  'Sem membrana: não existe dentro e fora, não existe gradiente, não existe metabolismo, não existe vida',
                  'A membrana cria a fronteira que permite ao organismo ser um sistema — separado do ambiente',
                  'É a estrutura que torna possível acumular energia e manter organização',
                ],
                highlight: 'Membrana = nascimento da vida como sistema.',
              },
              {
                title: 'Bomba Na⁺/K⁺-ATPase',
                bullets: [
                  'Expulsa 3 Na⁺ para fora, traz 2 K⁺ para dentro, consome 1 ATP por ciclo',
                  'Funciona 24h por dia sem parar — o motor silencioso da vida',
                  '60–80% da energia cerebral é consumida apenas para manter essas bombas funcionando',
                  'Isso antes mesmo de qualquer processamento, pensamento ou sinalização',
                ],
                highlight: '3 Na⁺ (out) + 2 K⁺ (in) + 1 ATP → gradiente eletroquímico — Attwell & Laughlin, 2001.',
              },
              {
                title: 'Potencial de Repouso',
                bullets: [
                  'Uma célula excitável não está "em repouso" — gasta energia continuamente para permanecer pronta',
                  'O chamado potencial de repouso é um estado de tensão elétrica mantida artificialmente',
                  'Repouso: ~-70mV · Pico: +40mV · Hiperpolarização · Retorno',
                  'Estar vivo é estar em dívida energética constante',
                ],
                highlight: 'O cérebro não é caro porque pensa. Ele pensa porque já é caro para existir.',
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
                title: 'SNC e SNP',
                bullets: [
                  'SNC: encéfalo (cérebro, cerebelo, tronco) + medula espinhal',
                  'Protegido por crânio, coluna, meninges, LCR e barreira hematoencefálica',
                  'SNP: nervos cranianos e espinhais → somático (voluntário) + autônomo (simpático/parassimpático)',
                ],
                highlight: 'Sistema Nervoso = SNC + SNP — sistema integrado de detecção, processamento e resposta.',
              },
            ],
          },
          {
            id: 'M1-T1-slides-intro',
            type: 'slides',
            title: 'Seção 1.1 — O Lugar do Cérebro',
            slides: [
              {
                title: 'Perspectiva Clássica',
                bullets: [
                  'Em Guyton & Hall: SN como integração regulatória subordinada ao meio interno',
                  'Em Kandel: inicia na membrana e potencial de repouso, não em conceitos psicológicos',
                  'O SN existe para manter viabilidade do organismo em ambiente incerto',
                ],
                highlight: 'Abordagens que colocam vontade consciente como motor primário partem de premissa biologicamente incorreta.',
              },
              {
                title: 'Funções Integradas',
                bullets: [
                  'Homeostase: regula trilhões de células para equilíbrio interno',
                  'Estímulos: monitora conscientes (visão, tato) e inconscientes (pH, gases, PA)',
                  'Integração: encéfalo/medula → resposta, memória ou descarte',
                  'Motor: esqueléticos, lisos, cardíaco e secreção glandular',
                  'Mental: consciência, pensamento, memória e emoções',
                ],
              },
            ],
          },
          {
            id: 'M1-T1-slides-reg',
            type: 'slides',
            title: 'Seções 1.2–1.5 — Regulação, Racionalidade e Predição',
            slides: [
              {
                title: '1.2 Sistema Regulatório Distribuído',
                bullets: [
                  'O SN deve ser compreendido como um sistema de regulação distribuída',
                  'Sua função central é integrar sinais internos e externos e produzir respostas que mantenham o organismo dentro de faixas fisiológicas compatíveis com a vida',
                  'Não existe centro único de comando — múltiplos sistemas interconectados operam em paralelo',
                  'Operação limitada por recursos metabólicos e temporais',
                  'O cérebro não "pensa" e depois "manda" o corpo agir',
                ],
                highlight: 'Ele é parte de um sistema corpo–cérebro cuja função primária é regular estados internos e reduzir risco biológico.',
              },
              {
                title: '1.3 Racionalidade como Emergência',
                bullets: [
                  'Se o SN existe para regular e garantir viabilidade, racionalidade não pode ser processo primário',
                  'Ela emerge de sistemas regulatórios mais antigos',
                  '"Decisão racional" é frequentemente justificativa post-hoc de processos já ocorridos em nível implícito',
                  'Aproximação heurística sob restrição temporal e computacional',
                  'Narrativa construída para tornar o comportamento coerente com a autoimagem',
                ],
              },
              {
                title: '1.4 Predição e Free Energy',
                bullets: [
                  'Free Energy e Predictive Processing: cérebro como máquina de inferência bayesiana',
                  'O cérebro tenta continuamente minimizar a surpresa (prediction error)',
                  'A maior parte da atividade neural é gerativa — prevê o que vai acontecer antes que aconteça',
                ],
                highlight: 'O cérebro não reage. Ele antecipa.',
              },
              {
                title: '1.4 Vantagens da Antecipação',
                bullets: [
                  'Permite ação eficiente sem esperar pelo estímulo completo',
                  'Poupa energia metabólica ao preparar respostas antecipadas',
                  'Protege o organismo de riscos ao antecipar ameaças',
                  'Quando a predição falha (surpresa), o sistema gera aprendizado e atualiza seus modelos',
                ],
              },
              {
                title: '1.5 Conclusão Preliminar',
                bullets: [
                  'O SN não existe para implementar racionalidade, mas para garantir sobrevivência metabólica',
                  'Regulação interna sob incerteza é a função primária',
                  'Racionalidade é ferramenta tardia e limitada, subordinada a funções mais antigas',
                  'Não existe "eu" central que decide — existe uma rede distribuída de processos',
                  'Essa rede negocia constantemente recursos limitados para manter um organismo viável',
                ],
                highlight: 'Compreender isso é essencial para não projetar sobre o sistema nervoso propriedades que ele não possui.',
              },
            ],
          },
          {
            id: 'M1-T1-video-1',
            type: 'video',
            title: 'O Cérebro: Servo do Corpo',
            url: 'https://qvvqbngiwqfuxsbgcxtc.supabase.co/storage/v1/object/public/videos/SEA%20FISIO/O_Cerebro__Servo_do_Corpo.mp4',
            duration: '',
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
