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
      {
        id: 'M1-T2',
        title: 'Neurodesenvolvimento',
        blocks: [
          {
            id: 'M1-T2-slides-intro',
            type: 'slides',
            title: 'Decisões Moleculares que Constroem o Cérebro',
            slides: [
              {
                title: 'O que é Neurodesenvolvimento',
                bullets: [
                  'Processo de formação e maturação do SN, da 3ª semana de gestação até o início da vida adulta',
                  'Não é crescimento passivo nem proliferação desordenada',
                  'Coreografia molecular rigorosamente orquestrada',
                  'Transforma uma camada de células ectodérmicas em ~86 bilhões de neurônios + número equivalente de glia',
                  'Interconectados por trilhões de sinapses',
                ],
                highlight: 'O neurodesenvolvimento é uma sequência de decisões moleculares que transformam uma única camada de células no órgão mais complexo do universo conhecido.',
              },
            ],
          },
          {
            id: 'M1-T2-slides-neurulacao',
            type: 'slides',
            title: 'Indução e Neurulação (Semanas 3–4)',
            slides: [
              {
                title: 'O Sinalizador',
                bullets: [
                  'Após fecundação e formação do disco embrionário, o SN começa a ser "escrito"',
                  'A notocorda (bastão de células mesodérmicas) libera Sonic Hedgehog (SHH)',
                  'SHH inibe a BMP-4, forçando o ectoderma a se diferenciar',
                ],
              },
              {
                title: 'Placa → Tubo → Crista',
                bullets: [
                  'O sinal força o ectoderma a se espessar → Placa Neural',
                  'A placa se dobra em sulco que se fecha → Tubo Neural (futuro SNC)',
                  'Células nas bordas formam a Crista Neural → migram para criar o SNP (nervos e gânglios)',
                ],
                highlight: 'Semanas 3–4: o primeiro corte irreversível — define encéfalo, medula e hierarquia estrutural.',
              },
            ],
          },
          {
            id: 'M1-T2-slides-vesiculas',
            type: 'slides',
            title: 'Arquitetura das Vesículas (Semanas 4–6)',
            slides: [
              {
                title: 'De 3 para 5 Vesículas',
                bullets: [
                  'O tubo neural não cresce por igual — a parte frontal se expande em 3 vesículas primárias',
                  'Que se subdividem em 5 vesículas secundárias',
                ],
              },
              {
                title: 'As 5 Vesículas',
                bullets: [
                  'Telencéfalo — hemisférios cerebrais e córtex',
                  'Diencéfalo — tálamo e hipotálamo (comando hormonal)',
                  'Mesencéfalo — reflexos visuais e auditivos',
                  'Metencéfalo — ponte e cerebelo (equilíbrio e coordenação)',
                  'Mielencéfalo — bulbo (respiração e batimentos cardíacos)',
                ],
              },
            ],
          },
          {
            id: 'M1-T2-slides-proliferacao',
            type: 'slides',
            title: 'Proliferação e Migração',
            slides: [
              {
                title: 'A Explosão Celular',
                bullets: [
                  '250.000 neurônios fabricados por minuto no pico da neurogênese',
                  'Produz muito mais neurônios que o necessário',
                  '30–70% morrem por apoptose (morte celular programada)',
                  'Falha em receber fatores tróficos = morte celular',
                ],
                highlight: 'Seleção, não expansão — o cérebro elimina o que não é necessário.',
              },
              {
                title: 'Migração via Glia Radial',
                bullets: [
                  'Glia radial funciona como "andaime" ou trilho para neurônios recém-nascidos',
                  'Neurônios escalam as fibras gliais para chegar ao topo do córtex',
                  'Formação de camadas de dentro para fora (inside-out)',
                  'Se o "trilho" falha → malformações corticais graves',
                ],
                highlight: 'Erro = camada errada, função errada. Arquitetura define função.',
              },
            ],
          },
          {
            id: 'M1-T2-slides-conectividade',
            type: 'slides',
            title: 'Conectividade e Refinamento',
            slides: [
              {
                title: 'Sinaptogênese (0–3 anos)',
                bullets: [
                  'Criação de trilhões de sinapses entre neurônios',
                  '10.000+ sinapses por neurônio',
                  'Fase exploratória: alta instabilidade e custo energético',
                  'Liberdade alta + custo alto',
                ],
              },
              {
                title: 'Poda Sináptica (3–10 anos)',
                bullets: [
                  'O cérebro produz conexões em excesso e depois "corta" as não usadas',
                  '≈70% das sinapses são eliminadas',
                  'Competição por atividade e metabolismo',
                  'Microglia marca e elimina sinapses fracas',
                  'No autismo, acredita-se em falha nesse processo de limpeza',
                ],
                highlight: 'Eficiência sobre quantidade — esculpido por células imunes.',
              },
              {
                title: 'Mielinização (20–25 anos)',
                bullets: [
                  'Neurônios encapados com mielina (gordura isolante)',
                  'Células de Schwann (SNP) e Oligodendrócitos (SNC) envolvem axônios',
                  'Acelera condução saltatória em até 100x',
                  'Reduz custo energético por sinal',
                  'Última área: córtex pré-frontal (julgamento e controle de impulsos)',
                  'Explica a impulsividade na adolescência',
                ],
                highlight: 'Regime de eficiência vs. flexibilidade — mielina reduz plasticidade.',
              },
            ],
          },
          {
            id: 'M1-T2-slides-timeline',
            type: 'slides',
            title: 'Linha do Tempo Completa',
            slides: [
              {
                title: 'Tubo Neural (3ª–4ª semana)',
                bullets: [
                  'Define encéfalo e medula',
                  'Estabelece eixos rostro-caudal e dorso-ventral',
                  'Cria hierarquia estrutural',
                ],
                highlight: 'Arquitetura antes da experiência.',
              },
              {
                title: 'Neurogênese & Apoptose (2º trimestre)',
                bullets: [
                  'Produção massiva e eliminação seletiva de neurônios',
                  'Produz muito mais que necessário',
                  '30–70% morrem por apoptose',
                  'Falha em receber fatores tróficos = morte',
                ],
                highlight: 'Seleção, não expansão.',
              },
              {
                title: 'Sinaptogênese → Poda (0–10 anos)',
                bullets: [
                  'Trilhões de sinapses formadas (0–3 anos)',
                  'Alta instabilidade e custo energético',
                  'Eliminação de sinapses fracas pela microglia (3–10 anos)',
                ],
              },
              {
                title: 'Adolescência (11–20 anos)',
                bullets: [
                  'Maturação descompassada: emoção vs. razão',
                  'Sistema límbico hiper-reativo',
                  'Pré-frontal ainda maturando',
                  'Pertencimento social = prioridade biológica',
                ],
                highlight: 'Emoção > razão (adaptativo, não defeito).',
              },
              {
                title: 'Mielinização → Adulto (20–25+ anos)',
                bullets: [
                  'Otimização de circuitos pré-frontais pela bainha de mielina',
                  'Circuitos estabilizados — mudança exige mais energia',
                  'Identidade = circuito vencedor',
                  'Alta eficiência, baixo ruído, alto custo de mudança',
                ],
                highlight: 'Estabilidade sináptica.',
              },
            ],
          },
          {
            id: 'M1-T2-slides-marcos',
            type: 'slides',
            title: 'Marcos Pós-Natais',
            slides: [
              {
                title: 'Desenvolvimento Motor',
                bullets: [
                  'Ao nascer: reflexos primitivos (sucção, marcha reflexa)',
                  'Reflexos devem desaparecer para dar lugar a movimentos voluntários',
                  'Direção céfalo-caudal: da cabeça para os pés',
                  'Direção próximo-distal: do centro para as pontas',
                ],
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
