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
            id: 'M1-T2-sim-tube',
            type: 'simulation',
            title: 'Formação do Tubo Neural',
            simulationId: 'neuro-tube',
            description: 'Animação: placa neural → sulco → tubo → crista neural migrando',
          },
          {
            id: 'M1-T2-sim-synapse',
            type: 'simulation',
            title: 'Densidade Sináptica ao Longo da Vida',
            simulationId: 'neuro-synapse-timeline',
            description: 'Gráfico interativo: sinaptogênese → poda → mielinização → estabilidade',
          },
          {
            id: 'M1-T2-slides-periodos',
            type: 'slides',
            title: 'Períodos Críticos e Relevância Clínica',
            slides: [
              {
                title: 'Períodos Críticos / Sensíveis',
                bullets: [
                  'Janelas temporais em que o cérebro é maximamente responsivo a estímulos específicos',
                  'Visão binocular: primeiros 2 anos — privação causa ambliopia irreversível',
                  'Linguagem: pico até 5–7 anos — após essa janela, aquisição é muito mais difícil',
                  'Motricidade fina: moldada nos primeiros anos por interação sensório-motora',
                  'Após o período crítico, o circuito se estabiliza — a plasticidade diminui drasticamente',
                ],
                highlight: 'O que não é estimulado na janela certa pode não se desenvolver plenamente.',
              },
              {
                title: 'Falhas no Neurodesenvolvimento',
                bullets: [
                  'Defeitos de fechamento do tubo neural → anencefalia, espinha bífida',
                  'Falha na migração neuronal → lissencefalia (córtex liso, sem giros)',
                  'Déficit na poda sináptica → implicado no Transtorno do Espectro Autista',
                  'Mielinização incompleta → disfunção executiva, TDAH',
                  'Lesão perinatal → paralisia cerebral (PC), alvo central da fisioterapia neuropediátrica',
                ],
              },
              {
                title: 'Relevância para Fisioterapia',
                bullets: [
                  'Intervenção precoce aproveita janelas de plasticidade máxima',
                  'Estimulação sensório-motora guiada pode redirecionar circuitos em formação',
                  'Na PC, a fisioterapia trabalha com o que o neurodesenvolvimento preservou',
                  'Conhecer a timeline é essencial para definir metas realistas de reabilitação',
                  'O cérebro infantil é plástico mas não infinitamente — timing importa',
                ],
                highlight: 'Compreender o neurodesenvolvimento é a base para toda intervenção neurológica precoce.',
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
      {
        id: 'M1-T3',
        title: 'Base Celular e Fisiológica',
        blocks: [
          {
            id: 'M1-T3-slides-excitabilidade',
            type: 'slides',
            title: 'O Que é Uma Célula Excitável?',
            slides: [
              {
                title: 'Célula Excitável — Definição',
                bullets: [
                  'Nem toda célula viva é capaz de gerar sinais elétricos rápidos',
                  'Uma célula excitável é aquela cuja membrana consegue alterar rapidamente seu potencial elétrico em resposta a estímulos físicos ou químicos',
                  'Exemplos: neurônios, fibras musculares, células secretoras especializadas',
                  'O neurônio não é especial porque "pensa" — é especial porque transmite variação elétrica rapidamente e a longa distância',
                ],
                highlight: 'Excitabilidade nasce de: membrana isolante + gradientes iônicos + canais reguláveis.',
              },
              {
                title: 'A Base Física da Excitabilidade',
                bullets: [
                  '1. Membrana Isolante — separação de cargas (capacitor biológico)',
                  '2. Gradientes Iônicos — mantidos ativamente pela bomba Na⁺/K⁺-ATPase',
                  '3. Canais Iônicos — reguláveis por voltagem ou ligante',
                  'A membrana lipídica funciona como um capacitor: separa cargas, armazena diferença de potencial e permite descargas controladas',
                  'Sem qualquer uma dessas três propriedades, não existe sinal elétrico',
                ],
                highlight: 'A membrana como capacitor biológico — o fundamento de toda sinalização neural.',
              },
            ],
          },
          {
            id: 'M1-T3-slides-estrutura-sn',
            type: 'slides',
            title: 'Estrutura Celular do Sistema Nervoso',
            slides: [
              {
                title: 'Dois Tipos Fundamentais de Células',
                bullets: [
                  'Neurônios — unidades sinalizadoras básicas do sistema nervoso',
                  'Neuróglia (glia) — células de suporte que auxiliam e protegem os neurônios',
                  'A neuróglia representa mais da metade do peso encefálico',
                  'Pode haver 10 a 50 vezes mais neuróglia do que neurônios',
                  'O neurônio é a unidade funcional: menor estrutura que realiza as funções do sistema',
                ],
                highlight: 'Neurônios + Neuróglia = os dois pilares celulares do sistema nervoso.',
              },
              {
                title: 'O Cérebro como Sistema Regulatório',
                bullets: [
                  'Não é uma "máquina de pensamento" — é um sistema regulatório distribuído',
                  'Neurônios recebem estímulos, conduzem potenciais de ação e transmitem sinais',
                  'Neuróglia fornece suporte físico e bioquímico essencial',
                  'Ambos os tipos celulares são indispensáveis para o funcionamento neural',
                ],
              },
            ],
          },
          {
            id: 'M1-T3-slides-neuronio',
            type: 'slides',
            title: 'O Neurônio: Unidade Funcional',
            slides: [
              {
                title: 'Corpo Celular (Soma)',
                bullets: [
                  'Centro metabólico do neurônio — essencial para o bem-estar celular',
                  'Núcleo com DNA: molde para toda a síntese proteica',
                  'Retículo Endoplasmático: síntese de proteínas e lipídios',
                  'Mitocôndrias: produção de ATP — energia para o neurônio',
                  'Aparelho de Golgi: processamento e empacotamento de proteínas',
                ],
                highlight: 'O soma é o "centro de comando" — sem ele, o neurônio morre.',
              },
              {
                title: 'Dendritos — Receptores de Sinais',
                bullets: [
                  'Processos finos e ramificados que recebem informação de células vizinhas',
                  'Aumentam a área de superfície → comunicação com muitos outros neurônios',
                  'Variam de um único dendrito até ramificações de incrível complexidade',
                  'Espinhos dendríticos: variam de finos até formato de cogumelo',
                  'Espinhos podem alterar tamanho e formato em resposta a sinais (plasticidade)',
                ],
                highlight: 'Dendritos no SNC podem funcionar como compartimentos independentes — enviando sinais bidirecionais.',
              },
              {
                title: 'Funções Dendríticas por Localização',
                bullets: [
                  'SNP: receber informação de entrada e transferir para região integradora',
                  'SNC: função mais complexa — espinhos como compartimentos independentes',
                  'Espinhos dendríticos enviam sinais de ida e volta com outros neurônios',
                  'Muitos contêm polirribossomos e podem produzir suas próprias proteínas',
                  'Plasticidade dendrítica: base celular da aprendizagem e memória',
                ],
              },
              {
                title: 'Axônio — Condutor de Informação',
                bullets: [
                  'Forma, número e comprimento variam entre neurônios',
                  'Maioria dos neurônios periféricos: único axônio originado do cone axonal',
                  'Comprimento: de mais de 1 metro até poucos micrômetros',
                  'Função primária: transmitir sinais elétricos de saída até as células-alvo',
                  'Na porção distal: sinal elétrico → secreção de molécula mensageira (neurotransmissor)',
                ],
                highlight: 'O axônio NÃO possui ribossomos nem RE — proteínas são transportadas do soma via transporte axonal.',
              },
            ],
          },
          {
            id: 'M1-T3-sim-anatomy',
            type: 'simulation',
            title: 'Anatomia Interativa do Neurônio',
            simulationId: 'neuro-neuron-anatomy',
            description: 'Explore soma, dendritos, axônio, mielina, terminais — clique para detalhes',
          },
          {
            id: 'M1-T3-slides-transporte',
            type: 'slides',
            title: 'Transporte Axonal',
            slides: [
              {
                title: 'Transporte Lento — Fluxo Axoplasmático',
                bullets: [
                  'Velocidade: 0,2 – 2,5 mm/dia',
                  'Transporta enzimas e proteínas do citoesqueleto',
                  'Componentes que não são consumidos rapidamente',
                  'Movimento por fluxo citoplasmático contínuo',
                ],
              },
              {
                title: 'Transporte Rápido — Via Microtúbulos',
                bullets: [
                  'Velocidade: até 400 mm/dia (≈ 15,75 polegadas/dia)',
                  'Utiliza proteínas motoras (cinesina e dineína) sobre microtúbulos',
                  'Transporta organelas: mitocôndrias, vesículas sinápticas',
                  'O transporte rápido é 160× mais rápido que o lento!',
                  'Essencial para entregar componentes vitais aos terminais axonais distantes',
                ],
                highlight: '160× — transporte rápido vs. lento. Sem microtúbulos, o terminal sináptico morre.',
              },
            ],
          },
          {
            id: 'M1-T3-sim-transport',
            type: 'simulation',
            title: 'Transporte Axonal: Lento vs. Rápido',
            simulationId: 'neuro-axon-transport',
            description: 'Comparação visual: fluxo axoplasmático vs. transporte por microtúbulos (160×)',
          },
          {
            id: 'M1-T3-slides-conducao',
            type: 'slides',
            title: 'Condução Saltatória e Mielina',
            slides: [
              {
                title: 'Bainha de Mielina',
                bullets: [
                  'Isolante lipídico que envolve axônios em segmentos (internodos)',
                  'SNC: formada por oligodendrócitos (1 célula → até 50 axônios)',
                  'SNP: formada por células de Schwann (1 célula → 1 internodo)',
                  'Entre os segmentos: nós de Ranvier — gaps com canais iônicos expostos',
                  'A mielina impede a dissipação da corrente iônica ao longo do axônio',
                ],
                highlight: 'Mielina = velocidade + eficiência energética. Doenças desmielinizantes (ex: esclerose múltipla) destroem essa vantagem.',
              },
              {
                title: 'Condução Saltatória vs. Contínua',
                bullets: [
                  'Saltatória (mielinizada): sinal "salta" entre nós de Ranvier — até 120 m/s',
                  'Contínua (não-mielinizada): despolarização ponto a ponto — 0,5 a 2 m/s',
                  'Saltatória é ≈60× mais rápida e gasta menos energia (menos canais ativados)',
                  'Nós de Ranvier: concentração de canais de Na⁺ voltagem-dependentes',
                  'Entre os nós: corrente passiva (eletrotônica) sob a mielina',
                ],
                highlight: 'Condução saltatória: velocidade de 120 m/s com economia energética — evolução em ação.',
              },
            ],
          },
          {
            id: 'M1-T3-sim-saltatory',
            type: 'simulation',
            title: 'Condução Saltatória vs. Contínua',
            simulationId: 'neuro-saltatory-conduction',
            description: 'Compare a velocidade: mielinizada (120 m/s) vs. não-mielinizada (2 m/s)',
          },
          {
            id: 'M1-T3-slides-classificacao',
            type: 'slides',
            title: 'Classificação dos Neurônios',
            slides: [
              {
                title: 'Classificação Funcional',
                bullets: [
                  'Sensoriais (aferentes): conduzem potenciais de ação em direção ao SNC',
                  'Motores (eferentes): conduzem do SNC para músculos ou glândulas',
                  'Interneurônios: conduzem de um neurônio para outro dentro do SNC',
                ],
              },
              {
                title: 'Classificação Estrutural',
                bullets: [
                  'Multipolares: vários dendritos + 1 axônio longo — tipo mais comum no SNC',
                  'Pseudounipolares: corpo celular lateral em processo único em T (neurônios sensoriais)',
                  'Bipolares: 1 axônio + 1 dendrito — retina e epitélio olfatório',
                  'Anaxônicos: sem axônio identificável, dendritos difusos — células amácrinas na retina',
                ],
                highlight: 'Estrutura define função: a forma de cada neurônio é adaptada ao seu papel no circuito.',
              },
            ],
          },
          {
            id: 'M1-T3-sim-types',
            type: 'simulation',
            title: 'Tipos Estruturais de Neurônios',
            simulationId: 'neuro-neuron-types',
            description: 'Visualize multipolar, pseudounipolar, bipolar e anaxônico — clique para detalhes',
          },
          {
            id: 'M1-T3-slides-neuroglia',
            type: 'slides',
            title: 'Neuróglia — Células de Suporte',
            slides: [
              {
                title: 'Neuróglia do SNC',
                bullets: [
                  'Oligodendrócitos: produzem mielina no SNC (1 célula → até 50 axônios)',
                  'Astrócitos: sustentação, barreira hematoencefálica, regulação de K⁺, captação de neurotransmissores',
                  'Microglia: fagocitose, poda sináptica, resposta inflamatória — o "sistema imune" do SNC',
                  'Células ependimárias: revestem ventrículos, cílios circulam o LCR',
                ],
              },
              {
                title: 'Neuróglia do SNP',
                bullets: [
                  'Células de Schwann: produzem mielina no SNP (1 célula → 1 internodo)',
                  'Participam na regeneração axonal — formam tubos de regeneração',
                  'Células Satélite (anfícitos): envolvem corpos celulares nos gânglios',
                  'Regulação do microambiente ganglionar e suporte nutricional',
                ],
              },
              {
                title: 'Funções Integradas da Neuróglia',
                bullets: [
                  'Formação e permeabilidade da barreira hematoencefálica',
                  'Fagocitose de substâncias estranhas e debris celulares',
                  'Produção e circulação de líquido cerebrospinal (LCR)',
                  'Formação de bainha de mielina ao redor dos axônios',
                  'Apesar de não transmitirem sinais elétricos a longa distância, comunicam-se com neurônios',
                  'Fornecem suporte físico e bioquímico indispensável',
                ],
                highlight: 'Neuróglia: >50% do peso encefálico, 10–50× mais numerosas que neurônios — o sistema nervoso NÃO funciona sem elas.',
              },
            ],
          },
          {
            id: 'M1-T3-sim-glia',
            type: 'simulation',
            title: 'Ecossistema Neuroglial Interativo',
            simulationId: 'neuro-glia-ecosystem',
            description: 'Explore os 6 tipos de neuroglia: astrócitos, oligodendrócitos, microglia, ependimárias, Schwann e satélite',
          },
        ],
      },
      {
        id: 'M1-T4',
        title: 'Suporte, Nutrição e Proteção',
        blocks: [
          {
            id: 'M1-T4-slides-fundamento',
            type: 'slides',
            title: 'Princípio Fundamental',
            slides: [
              {
                title: 'O Cérebro Não É Um Processador Abstrato',
                bullets: [
                  'Os tratados clássicos (Guyton & Hall, Kandel, Purves, Bear) convergem:',
                  'O cérebro é um órgão biológico — metabolicamente caro, altamente vulnerável',
                  'Dependente de suprimento contínuo de O₂ e glicose',
                  'Pensar, decidir, aprender e regular emoção NÃO são propriedades "mágicas" da mente',
                  'São efeitos emergentes de uma cadeia de suporte metabólico',
                ],
                highlight: 'Não existe "vontade" forte o suficiente para superar falta de O₂ ou glicose. Não existe "força mental" capaz de substituir ATP.',
              },
              {
                title: 'A Cadeia Metabólica Neural',
                bullets: [
                  'O₂ + Glicose → ATP (fosforilação oxidativa)',
                  'ATP → Gradientes iônicos (Na⁺/K⁺-ATPase)',
                  'Gradientes → Potencial de Ação',
                  'Potencial de Ação → Função Neural',
                  'Quebrou qualquer elo → o sistema colapsa',
                ],
                highlight: 'Função cerebral não é produto da vontade. É produto de viabilidade metabólica.',
              },
              {
                title: 'Os Números da Dependência',
                bullets: [
                  'Cérebro = 2% do peso corporal total',
                  'Consome 20% de todo o O₂ do organismo',
                  'Consome 25% de toda a glicose circulante',
                  '60–80% do ATP cerebral vai para as bombas iônicas (Attwell & Laughlin, 2001)',
                  'Sem reserva significativa de glicose ou O₂ — dependência contínua do sangue',
                ],
                highlight: 'O cérebro é o órgão mais caro do corpo — e não tem reserva.',
              },
            ],
          },
          {
            id: 'M1-T4-sim-chain',
            type: 'simulation',
            title: 'Cadeia Metabólica Neural',
            simulationId: 'neuro-metabolic-chain',
            description: 'Visualize a cadeia O₂→ATP→Gradientes→PA→Função — clique para quebrar um elo e ver o colapso',
          },
          {
            id: 'M1-T4-slides-bhe',
            type: 'slides',
            title: 'Barreira Hematoencefálica (BHE)',
            slides: [
              {
                title: 'O Que é a BHE',
                bullets: [
                  'Não é uma "parede" — é uma interface regulatória ativa',
                  'Formada por células endoteliais altamente especializadas nos capilares cerebrais',
                  'Junções apertadas (tight junctions) entre células endoteliais',
                  'Pericitos e pés astrocitários completam a barreira',
                  'Forma a unidade neurovascular junto com neurônios e glia',
                ],
                highlight: 'A BHE é a fronteira inteligente entre o sangue e o tecido neural.',
              },
              {
                title: 'O Que Passa e o Que Não Passa',
                bullets: [
                  '✓ PASSA: O₂ (difusão livre), glicose (GLUT-1), aminoácidos essenciais (transportadores)',
                  '✓ PASSA: Hormônios lipofílicos, moléculas pequenas e apolares',
                  '✕ BLOQUEIA: Patógenos (bactérias, vírus), toxinas circulantes',
                  '✕ BLOQUEIA: Moléculas grandes, proteínas plasmáticas, maioria dos fármacos',
                  'Por isso muitos medicamentos não chegam ao cérebro — desafio farmacológico',
                ],
              },
              {
                title: 'Quando a BHE Falha',
                bullets: [
                  'Danos à BHE → entrada de substâncias neurotóxicas',
                  'Edema cerebral: acúmulo de líquido no tecido neural',
                  'Neuroinflamação: ativação descontrolada de micróglia',
                  'Presente em: esclerose múltipla, AVC, trauma craniano, meningite',
                  'Comprometimento funcional pode ser irreversível',
                ],
                highlight: 'BHE intacta = proteção. BHE comprometida = neurotoxicidade, edema, inflamação.',
              },
            ],
          },
          {
            id: 'M1-T4-sim-bhe',
            type: 'simulation',
            title: 'Barreira Hematoencefálica Interativa',
            simulationId: 'neuro-bhe',
            description: 'Veja moléculas passando ou sendo bloqueadas — alterne entre BHE íntegra e danificada',
          },
          {
            id: 'M1-T4-slides-glia',
            type: 'slides',
            title: 'Glia: A Infraestrutura Invisível',
            slides: [
              {
                title: 'Glia NÃO São Células Auxiliares Passivas',
                bullets: [
                  'Historicamente subestimadas — "cola" neural',
                  'Na realidade: sistemas ativos de suporte sem os quais neurônios NÃO funcionam',
                  'Representam >50% do peso encefálico',
                  '10 a 50× mais numerosas que neurônios',
                  'A função neural é emergência de um sistema INTEGRADO neurônio-glia',
                ],
                highlight: 'Sem glia funcional, o neurônio mais "inteligente" colapsa.',
              },
              {
                title: 'Astrócitos — O Sistema de Suporte Metabólico',
                bullets: [
                  'Regulação do K⁺ extracelular (previne hiperexcitabilidade)',
                  'Recaptação de glutamato (previne excitotoxicidade)',
                  'Fornecimento de lactato como combustível para neurônios',
                  'Manutenção do pH extracelular',
                  'Pés astrocitários formam parte da BHE',
                  'Sem astrócitos: K⁺ acumula → crises epilépticas, glutamato mata neurônios',
                ],
                highlight: 'Astrócitos: do capilar ao neurônio — a ponte metabólica essencial.',
              },
              {
                title: 'Oligodendrócitos e Schwann — Eficiência',
                bullets: [
                  'Oligodendrócitos (SNC): 1 célula mieliniza até 50 axônios',
                  'Células de Schwann (SNP): 1 célula → 1 internodo',
                  'Mielina: isolante lipídico que permite condução saltatória',
                  'Sem mielina: velocidade cai de 120 m/s para ~2 m/s',
                  'Esclerose múltipla: destruição autoimune da mielina do SNC',
                ],
              },
              {
                title: 'Micróglia — Vigilância e Manutenção',
                bullets: [
                  'Sistema imune residente do SNC',
                  'Vigilância contínua: monitora o microambiente 24h',
                  'Fagocitose: remove debris celulares e patógenos',
                  'Poda sináptica: marca e elimina sinapses fracas no desenvolvimento',
                  'Resposta inflamatória: ativação em lesão ou infecção',
                  'Ativação crônica: associada a doenças neurodegenerativas (Alzheimer, Parkinson)',
                ],
                highlight: 'Micróglia: zeladora, guardiã e escultora do cérebro.',
              },
            ],
          },
          {
            id: 'M1-T4-sim-support',
            type: 'simulation',
            title: 'Rede de Suporte Glial',
            simulationId: 'neuro-glia-support',
            description: 'Veja astrócitos alimentando neurônios, oligodendrócitos mielinizando e micróglia podando — filtre por tipo',
          },
          {
            id: 'M1-T4-slides-sintese',
            type: 'slides',
            title: 'Síntese: Infraestrutura como Pré-Requisito',
            slides: [
              {
                title: 'Conclusão do Capítulo',
                bullets: [
                  'Função cerebral NÃO é produto da vontade — é produto de viabilidade metabólica',
                  'Sem oxigênio, glicose, barreira e glia, não há cognição, decisão ou comportamento',
                  'O₂ + Glicose → ATP → Gradientes → PA → Função → Comportamento',
                  'A BHE protege mas também limita: desafio para tratamentos farmacológicos',
                  'Glia é infraestrutura ativa, não passiva — co-protagonista da função neural',
                ],
                highlight: 'Não existe função neural sem infraestrutura. O cérebro é um órgão biológico, não uma abstração.',
              },
              {
                title: 'Relevância Clínica',
                bullets: [
                  'AVC: interrupção de O₂ → morte neuronal em minutos',
                  'Hipoglicemia severa: sem glicose → convulsões, coma',
                  'Esclerose múltipla: perda de mielina → déficit motor e cognitivo',
                  'Meningite: BHE comprometida → neuroinflamação grave',
                  'Alzheimer: micróglia cronicamente ativada → neurodegeneração',
                  'Entender infraestrutura = entender vulnerabilidades do SN',
                ],
                highlight: 'Para o fisioterapeuta: conhecer a infraestrutura neural é saber ONDE e POR QUE o sistema falha.',
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
      {
        id: 'M2-T1',
        title: 'Anatomofisiologia Respiratória',
        blocks: [
          {
            id: 'M2-T1-slides-respiracao',
            type: 'slides',
            title: 'O Que é Respiração?',
            slides: [
              {
                title: 'Quatro Processos da Respiração',
                bullets: [
                  '1. Ventilação: movimento de entrada e saída de ar dos pulmões',
                  '2. Hematose (respiração externa): troca gasosa entre ar alveolar e sangue nos capilares pulmonares',
                  '3. Transporte: O₂ e CO₂ carregados pelo sangue (hemoglobina e plasma)',
                  '4. Respiração interna: troca gasosa entre sangue e tecidos',
                  'Esses 4 processos são distintos porém interdependentes',
                ],
                highlight: 'A respiração supre o O₂ para produção de ATP e elimina o CO₂ — ligação direta com respiração celular.',
              },
              {
                title: 'Hematose Alveolar',
                bullets: [
                  'Ponto central da respiração: alvéolos ⇄ capilares pulmonares',
                  'O₂ difunde do ar alveolar para o sangue (PO₂: 104 → 40 mmHg)',
                  'CO₂ difunde do sangue para o ar alveolar (PCO₂: 45 → 40 mmHg)',
                  'Difusão por gradiente de pressão parcial (Lei de Fick)',
                  'Membrana respiratória: apenas 0,2 µm de espessura',
                ],
              },
              {
                title: 'Transporte de O₂ no Sangue',
                bullets: [
                  'Hemoglobina (Hb): proteína com 4 sítios de ligação ao O₂',
                  'Hb + 4O₂ ⇄ Hb(O₂)₄ — reação reversível',
                  '98,5% do O₂ transportado ligado à Hb',
                  '1,5% dissolvido no plasma',
                  'CO₂ transportado: 7% dissolvido, 23% ligado à Hb, 70% como HCO₃⁻',
                ],
                highlight: 'Sem hemoglobina, o sangue carregaria apenas 1,5% do O₂ necessário.',
              },
            ],
          },
          {
            id: 'M2-T1-slides-funcoes',
            type: 'slides',
            title: 'Além da Respiração: 5 Funções Extras',
            slides: [
              {
                title: 'Funções Adicionais do Sistema Respiratório',
                bullets: [
                  '1. Regulação do pH sanguíneo — alterando níveis de CO₂ (tampão bicarbonato)',
                  '2. Produção de mediadores químicos — ECA (enzima conversora da angiotensina) → regulação da PA',
                  '3. Produção da voz — passagem do ar pelas pregas vocais gera som',
                  '4. Olfação — moléculas do ar alcançam epitélio olfatório na cavidade nasal',
                  '5. Proteção — barreiras contra microrganismos e partículas',
                ],
                highlight: 'O pulmão não é apenas para respirar — é órgão endócrino, imunológico e regulador de pH.',
              },
            ],
          },
          {
            id: 'M2-T1-slides-componentes',
            type: 'slides',
            title: 'Componentes do Sistema Respiratório',
            slides: [
              {
                title: 'Estruturas Anatômicas',
                bullets: [
                  'Nariz externo e cavidade nasal: filtração, aquecimento, umidificação',
                  'Faringe: via comum para ar e alimento (naso, oro e laringofaringe)',
                  'Laringe: pregas vocais + epiglote (proteção contra aspiração)',
                  'Traqueia: 16-20 anéis cartilaginosos em C, epitélio mucociliar',
                  'Brônquios: ramificação dicotômica em 23 gerações',
                  'Pulmões: direito (3 lobos) e esquerdo (2 lobos + incisura cardíaca)',
                ],
              },
              {
                title: 'Músculos da Respiração',
                bullets: [
                  'Diafragma: principal músculo inspiratório (inervação: nervo frênico C3-C5)',
                  'Intercostais externos: elevam as costelas na inspiração',
                  'Intercostais internos: auxiliam na expiração forçada',
                  'Músculos acessórios: escalenos, esternocleidomastóideo (inspiração forçada)',
                  'Abdominais: reto, oblíquos, transverso (expiração forçada/tosse)',
                ],
                highlight: 'A expiração em repouso é PASSIVA — retorno elástico dos pulmões. Apenas a inspiração requer contração muscular ativa.',
              },
            ],
          },
          {
            id: 'M2-T1-sim-system',
            type: 'simulation',
            title: 'Sistema Respiratório Interativo',
            simulationId: 'respiratory-system',
            description: 'Explore nariz, faringe, laringe, traqueia, brônquios e alvéolos — com fluxo de O₂ e CO₂ animado',
          },
          {
            id: 'M2-T1-slides-zonas',
            type: 'slides',
            title: 'Classificação Funcional: Zonas',
            slides: [
              {
                title: 'Zona Condutora',
                bullets: [
                  'Do nariz até os bronquíolos terminais',
                  'Função: movimento, limpeza, aquecimento e umidificação do ar',
                  'NÃO realiza troca gasosa — apenas conduz',
                  'Constitui o "espaço morto anatômico" (~150 mL)',
                  'Epitélio pseudoestratificado colunar ciliado com células caliciformes',
                ],
              },
              {
                title: 'Zona Respiratória',
                bullets: [
                  'Bronquíolos respiratórios → ductos alveolares → sacos alveolares → alvéolos',
                  'Local da hematose: troca gasosa entre ar e sangue',
                  '300-500 milhões de alvéolos nos dois pulmões',
                  'Superfície total de troca: ~70 m² (tamanho de quadra de tênis)',
                  'Pneumócitos tipo I (troca gasosa) e tipo II (surfactante)',
                ],
                highlight: 'Zona condutora = passagem e limpeza. Zona respiratória = hematose. São funcionalmente complementares.',
              },
            ],
          },
          {
            id: 'M2-T1-sim-exchange',
            type: 'simulation',
            title: 'Hematose Alveolar',
            simulationId: 'respiratory-gas-exchange',
            description: 'Visualize a difusão de O₂ e CO₂ através da membrana respiratória — com pressões parciais reais',
          },
          {
            id: 'M2-T1-slides-defesa',
            type: 'slides',
            title: 'Mecanismos de Defesa Respiratória',
            slides: [
              {
                title: '1ª Barreira: Nariz e Nasofaringe',
                bullets: [
                  'Pelos nasais (vibrissas): filtram partículas grossas',
                  'Muco: cobre septo e conchas nasais — aprisiona partículas e patógenos',
                  'Imunoglobulina A (IgA): primeira linha de defesa imunológica',
                  'Aquecimento: ar frio → temperatura corporal em milissegundos',
                  'Umidificação: ar seco → saturação de vapor (~100% umidade)',
                ],
              },
              {
                title: '2ª Barreira: Aparato Mucociliar',
                bullets: [
                  'Epitélio colunar pseudoestratificado ciliado',
                  'Células caliciformes produzem muco (camada gel + sol)',
                  'Cílios batem a 600-900 batimentos/min',
                  'Movimento rápido ascendente: "escada rolante mucociliar"',
                  'Transporta muco + partículas presas até a faringe (deglutição ou expectoração)',
                  'Fumo e poluição paralisam os cílios → comprometimento grave da defesa',
                ],
              },
              {
                title: '3ª Barreira: Defesa Bioquímica/Imunológica',
                bullets: [
                  'IgA: predominante nas mucosas — neutraliza patógenos na superfície',
                  'IgG: opsonização e ativação do complemento',
                  'IgM: resposta primária a novos patógenos',
                  'Macrófagos alveolares: "células de poeira" — fagocitose no alvéolo',
                  'Surfactante: além de reduzir tensão superficial, tem propriedades antimicrobianas',
                ],
                highlight: '3 barreiras integradas: física (pelos/muco) + mecânica (cílios) + bioquímica (imunoglobulinas + macrófagos).',
              },
            ],
          },
          {
            id: 'M2-T1-sim-defense',
            type: 'simulation',
            title: 'Sistema de Defesa Respiratória',
            simulationId: 'respiratory-defense',
            description: 'Veja patógenos sendo capturados pelas 3 barreiras: nasal, mucociliar e imunológica — filtre por camada',
          },
          {
            id: 'M2-T1-slides-sintese',
            type: 'slides',
            title: 'Síntese do Capítulo',
            slides: [
              {
                title: 'A Respiração como Processo Vital',
                bullets: [
                  'Não é apenas "inspirar e expirar" — são 4 processos integrados',
                  'Ventilação → Hematose → Transporte → Troca tecidual',
                  'O sistema tem dupla classificação: condutor (limpeza) + respiratório (troca)',
                  '3 camadas de defesa protegem contra invasão e contaminação',
                  'O pulmão produz ECA, regula pH e participa do sistema imunológico',
                ],
                highlight: 'Compreender anatomia e fisiologia respiratória é pré-requisito para toda intervenção em fisioterapia pneumofuncional.',
              },
            ],
          },
        ],
      },
      {
        id: 'M2-T2',
        title: 'Zona Condutora e Respiratória',
        blocks: [
          {
            id: 'M2-T2-slides-nariz',
            type: 'slides',
            title: 'Nariz e Cavidade Nasal',
            slides: [
              {
                title: 'Estrutura do Nariz',
                bullets: [
                  'Nariz externo: cartilagem hialina + osso nasal + extensões frontal e maxilar',
                  'Cavidade nasal: estende-se das narinas (externas) até as coanas (aberturas para faringe)',
                  'Vestíbulo: parte anterior, epitélio escamoso estratificado contínuo com a pele',
                  'Septo nasal: divisória — parte anterior cartilaginosa, posterior óssea (vômer + etmoide)',
                  'Palato duro: separa cavidade nasal da oral',
                ],
              },
              {
                title: '5 Funções da Cavidade Nasal',
                bullets: [
                  '1. Passagem de ar — permanece aberta mesmo com boca cheia de comida',
                  '2. Filtração — pelos no vestíbulo capturam partículas; conchas tornam fluxo turbulento',
                  '3. Aquecimento e umidificação — sangue aquecido nas conchas + muco + lágrimas do canal nasolacrimal',
                  '4. Olfato — células receptoras olfatórias na parte superior',
                  '5. Ressonância vocal — cavidade nasal e seios paranasais são câmaras de ressonância',
                ],
                highlight: 'Conchas nasais: 3 cristas ósseas que triplicam a área de superfície e criam fluxo turbulento para máximo contato com a mucosa.',
              },
              {
                title: 'Conchas e Meatos',
                bullets: [
                  'Conchas Superior, Média e Inferior — modificam paredes laterais da cavidade nasal',
                  'Abaixo de cada concha: meato (passagem) — superior, médio e inferior',
                  'Aumentam turbulência do ar inspirado → maior contato com mucosa',
                  'Mucosa: epitélio colunar pseudoestratificado ciliado com células caliciformes',
                  'Muco captura resíduos → cílios movem muco até faringe → deglutido',
                ],
              },
            ],
          },
          {
            id: 'M2-T2-slides-faringe',
            type: 'slides',
            title: 'Faringe — Via Comum',
            slides: [
              {
                title: 'Nasofaringe (Somente AR)',
                bullets: [
                  'Atrás das coanas, acima do palato mole',
                  'Úvula: extensão do palato mole — impede alimento de entrar na nasofaringe',
                  'Epitélio: colunar pseudoestratificado ciliado com caliciformes',
                  'Tubas auditivas: abrem-se aqui para equalizar pressão na orelha média',
                  'Tonsila faríngea (adenoide): defesa contra infecções',
                ],
              },
              {
                title: 'Orofaringe e Laringofaringe',
                bullets: [
                  'Orofaringe: do palato mole até epiglote — AR + ALIMENTO passam aqui',
                  'Epitélio: escamoso estratificado úmido (proteção contra abrasão)',
                  'Tonsilas palatinas e linguais nas fauces',
                  'Laringofaringe: da epiglote ao esôfago — BIFURCAÇÃO final',
                  'Anterior → Laringe (via aérea) | Posterior → Esôfago (via digestiva)',
                ],
                highlight: 'Deglutição: língua empurra → palato mole fecha nasofaringe → epiglote fecha laringe → alimento vai pro esôfago.',
              },
            ],
          },
          {
            id: 'M2-T2-slides-laringe',
            type: 'slides',
            title: 'Laringe — 9 Cartilagens',
            slides: [
              {
                title: 'Cartilagens Não-Pareadas (3)',
                bullets: [
                  'Tireoide: formato de escudo, maior cartilagem (pomo de Adão). Hialina',
                  'Cricoide: formato de anel completo, base da laringe. Hialina',
                  'Epiglote: aba livre que fecha a glote na deglutição. ÚNICA cartilagem ELÁSTICA',
                ],
              },
              {
                title: 'Cartilagens Pareadas (3 pares = 6)',
                bullets: [
                  'Aritenoides (2): formato de concha, articulam com cricoide. Movem pregas vocais',
                  'Corniculadas (2): formato de corno, sobre as aritenoides',
                  'Cuneiformes (2): formato de cunha, na membrana mucosa anterior às corniculadas',
                ],
              },
              {
                title: '4 Funções da Laringe',
                bullets: [
                  '1. Manter passagem livre — cartilagens tireoide e cricoide sustentam via aérea aberta',
                  '2. Proteção na deglutição — epiglote fecha a abertura da laringe',
                  '3. Fonação — pregas vocais vibram com passagem do ar; amplitude = intensidade, frequência = tom',
                  '4. Limpeza mucociliar — epitélio ciliado produz muco que captura detritos',
                ],
                highlight: 'Homens: pregas vocais maiores → voz mais grave. Sem laringe: possível produzir som com vibração do esôfago.',
              },
            ],
          },
          {
            id: 'M2-T2-slides-traqueia',
            type: 'slides',
            title: 'Traqueia — Anéis em C',
            slides: [
              {
                title: 'Estrutura da Traqueia',
                bullets: [
                  '15-20 anéis de cartilagem hialina em formato de "C"',
                  'Parede anterior/lateral: cartilagem sustenta via aérea aberta',
                  'Parede posterior: SEM cartilagem — membrana elástica + músculo traqueal',
                  'Músculo traqueal: contrai na tosse → estreita diâmetro → ar move mais rápido',
                  'Esôfago localizado logo atrás da parede posterior',
                ],
              },
              {
                title: 'Dimensões e Carina',
                bullets: [
                  'Diâmetro: ~12mm | Comprimento: 10-12cm',
                  'Bifurcação: nível da 5ª vértebra torácica (T5)',
                  'Carina: cartilagem mais inferior, forma "quilha" que separa brônquios principais',
                  'Mucosa da carina: MUITO sensível — estimula reflexo de tosse intenso',
                  'Partículas abaixo da carina NÃO estimulam esse reflexo tão intenso',
                ],
                highlight: 'Fumantes: epitélio traqueal se transforma em escamoso estratificado → perda de cílios e caliciformes → função de limpeza destruída.',
              },
            ],
          },
          {
            id: 'M2-T2-slides-reflexos',
            type: 'slides',
            title: 'Reflexos de Proteção',
            slides: [
              {
                title: 'Espirro e Tosse',
                bullets: [
                  'Espirro: receptores nasais/nasofaringe → velocidade até 150 km/h',
                  'Tosse: 5 fases — 1) Irritativa 2) Inspiratória (~2,5L) 3) Compressiva (glote fecha, pressão ↑300mmHg)',
                  '4) Expulsiva (glote abre, ar até 160 km/h) 5) Relaxamento',
                  'Tosse reflexa (involuntária) vs. voluntária | Produtiva vs. seca',
                  'Receptores mais sensíveis: laringe > traqueia > brônquios',
                ],
              },
              {
                title: 'Outros Mecanismos',
                bullets: [
                  'Broncoconstrição: contração da musculatura lisa brônquica, reduz passagem de ar',
                  'Reflexo epiglótico: interrompe ventilação brevemente durante deglutição',
                  'Na asma: contrações da musculatura lisa → ↓diâmetro → ↑resistência → ↓fluxo',
                  'Tratamento: albuterol relaxa musculatura lisa dos bronquíolos terminais',
                  'Exercício: diâmetro ↑ → resistência ↓ → volume de ar ↑',
                ],
                highlight: 'Asma grave: movimento de ar tão restrito que pode ser fatal. Medicamentos broncodilatadores são essenciais.',
              },
            ],
          },
          {
            id: 'M2-T2-sim-cough',
            type: 'simulation',
            title: 'Reflexo da Tosse — 5 Fases',
            simulationId: 'respiratory-cough',
            description: 'Visualize as 5 fases: irritação → inspiração → compressão (glote fecha) → expulsão (160 km/h) → relaxamento',
          },
          {
            id: 'M2-T2-slides-arvore',
            type: 'slides',
            title: 'Árvore Traqueobronquial — 23 Gerações',
            slides: [
              {
                title: 'Divisões da Árvore Bronquial',
                bullets: [
                  'Brônquios principais: traqueia divide-se em D (mais vertical/largo) e E',
                  'Brônquios lobares (secundários): D tem 3, E tem 2',
                  'Brônquios segmentares (terciários): suprem segmentos broncopulmonares (10D + 9E)',
                  'Bronquíolos: <1mm diâmetro, se subdividem até bronquíolos terminais',
                  'Total: ~16 gerações de ramificação da traqueia aos bronquíolos terminais',
                ],
                highlight: 'Brônquio D mais vertical e largo → substâncias aspiradas se alojam mais facilmente no lado direito.',
              },
              {
                title: 'Mudanças nas Paredes',
                bullets: [
                  'Brônquios principais: cartilagens em C + musculatura lisa',
                  'Brônquios lobares: placas de cartilagem substituem anéis em C',
                  'À medida que diminuem: cartilagem ↓, musculatura lisa ↑',
                  'Bronquíolos terminais: SEM cartilagem, camada muscular proeminente',
                  'Relaxamento/contração da musculatura lisa → modifica fluxo aéreo',
                ],
              },
              {
                title: '3 Zonas Funcionais',
                bullets: [
                  'Zona Condutora (gerações 0-16): condução, filtração, aquecimento — SEM troca gasosa',
                  'Zona de Transição (gerações 17-19): bronquíolos respiratórios, primeiros alvéolos',
                  'Zona Respiratória (gerações 20-23): ductos alveolares, sacos alveolares — TROCA GASOSA',
                  'Total: 2²³ = ~8 milhões de vias terminais',
                  'Área de superfície alveolar: 70-100 m²',
                ],
                highlight: '23 gerações: da traqueia (Ø12mm) até alvéolos (Ø250µm) — 300-500 milhões de unidades de troca.',
              },
            ],
          },
          {
            id: 'M2-T2-slides-alveolo',
            type: 'slides',
            title: 'Alvéolos e Membrana Respiratória',
            slides: [
              {
                title: 'Estrutura dos Alvéolos',
                bullets: [
                  '300-500 milhões nos dois pulmões',
                  'Diâmetro: ~250 µm | Área total: 70-100 m² (quadra de tênis)',
                  'Pneumócitos tipo I: células finas escamosas — 90% da superfície — TROCA GASOSA',
                  'Pneumócitos tipo II: células cuboides — produzem SURFACTANTE pulmonar',
                  'Surfactante: reduz tensão superficial → facilita expansão na inspiração',
                ],
              },
              {
                title: 'Membrana Respiratória — 6 Camadas',
                bullets: [
                  '1. Fluido alveolar (surfactante)',
                  '2. Epitélio alveolar (pneumócito tipo I)',
                  '3. Membrana basal do epitélio',
                  '4. Espaço intersticial',
                  '5. Membrana basal do endotélio',
                  '6. Endotélio capilar',
                ],
                highlight: 'Espessura total: ~0,5 µm. Difusão ∝ Área × ΔP / Espessura (Lei de Fick).',
              },
              {
                title: 'Limpeza na Zona Respiratória',
                bullets: [
                  'Epitélio dos alvéolos NÃO é ciliado',
                  'Macrófagos alveolares ("células de poeira"): fagocitam detritos na superfície',
                  'Macrófagos migram para vasos linfáticos ou bronquíolos terminais',
                  'Nos bronquíolos: ficam retidos no muco → "varridos" até a faringe',
                  'Fibras elásticas ao redor: expansão na inspiração, retração na expiração',
                ],
              },
            ],
          },
          {
            id: 'M2-T2-sim-membrane',
            type: 'simulation',
            title: 'Membrana Respiratória — 6 Camadas',
            simulationId: 'respiratory-membrane',
            description: 'Visualize as 6 camadas da membrana com O₂ e CO₂ difundindo — hover em cada camada para detalhes',
          },
          {
            id: 'M2-T2-slides-pulmoes',
            type: 'slides',
            title: 'Pulmões — Anatomia Macroscópica',
            slides: [
              {
                title: 'Estrutura dos Pulmões',
                bullets: [
                  'Formato cônico: base no diafragma, ápice ~2,5cm acima da clavícula',
                  'Pulmão Direito: 3 lobos (sup, méd, inf) — 2 fissuras — 10 segmentos — ~620g',
                  'Pulmão Esquerdo: 2 lobos (sup, inf) — 1 fissura — 9 segmentos — ~565g',
                  'Incisura cardíaca: acomodação do coração no pulmão esquerdo',
                  'Hilo: região medial onde entram/saem brônquios, vasos, nervos, linfáticos',
                ],
              },
              {
                title: 'Divisões Funcionais',
                bullets: [
                  'Lobos: separados por fissuras profundas, supridos por brônquios lobares',
                  'Segmentos broncopulmonares: 10D + 9E, separados por septos de tecido conectivo',
                  'Segmentos podem ser removidos cirurgicamente sem comprometer o restante',
                  'Lóbulos: subdivisão dos segmentos, supridos por bronquíolos',
                  'Pulmões muito elásticos — quando inflados, expelem ar e retornam ao estado original',
                ],
                highlight: 'Capacidade total: ~6L. Frequência respiratória em repouso: ~15 rpm. Volume corrente: ~500 mL.',
              },
            ],
          },
        ],
      },
      {
        id: 'M2-T3',
        title: 'Mecânica Respiratória',
        blocks: [
          {
            id: 'M2-T3-slides-ciclo',
            type: 'slides',
            title: 'Dinâmica do Ciclo Ventilatório',
            slides: [
              {
                title: 'Inspiração — Processo ATIVO',
                bullets: [
                  'Músculos inspiratórios contraem (diafragma principal)',
                  'Volume torácico e alveolar AUMENTA',
                  'Pressão alveolar DIMINUI (fica negativa)',
                  'P.alveolar < P.atmosférica → ar ENTRA nos pulmões',
                  'Volume corrente: ~500 mL de ar inspirado',
                ],
                highlight: 'Inspiração = contração muscular ativa. Sem contração, não há entrada de ar.',
              },
              {
                title: 'Expiração — Processo PASSIVO',
                bullets: [
                  'Músculos inspiratórios RELAXAM',
                  'Retração elástica dos pulmões e da caixa torácica',
                  'Volume torácico e alveolar DIMINUI',
                  'Pressão alveolar AUMENTA (fica positiva)',
                  'P.alveolar > P.atmosférica → ar SAI dos pulmões',
                ],
                highlight: 'Expiração em repouso é PASSIVA — não requer contração muscular. Apenas a expiração forçada (tosse, exercício) usa músculos.',
              },
            ],
          },
          {
            id: 'M2-T3-slides-pressoes',
            type: 'slides',
            title: 'Pressões Respiratórias',
            slides: [
              {
                title: 'Pressão Pleural',
                bullets: [
                  'Pressão do líquido no espaço entre pleura visceral e parietal',
                  'Normalmente NEGATIVA (sucção que mantém pulmões expandidos)',
                  'Início da inspiração: -5 cmH₂O',
                  'Durante inspiração normal: -7,5 cmH₂O (mais negativa)',
                  'A expansão da caixa torácica cria pressão mais negativa → puxa pulmões',
                ],
              },
              {
                title: 'Pressão Alveolar',
                bullets: [
                  'Pressão do ar dentro dos alvéolos',
                  'Com glote aberta e sem fluxo: igual à P.atmosférica (0 cmH₂O)',
                  'Inspiração: -1 cmH₂O (ligeiramente negativa → ar entra)',
                  'Expiração: +1 cmH₂O (positiva → empurra 500mL em 2-3 segundos)',
                  'O gradiente de pressão é PEQUENO: apenas ±1 cmH₂O move meio litro de ar',
                ],
                highlight: 'Apenas 1 cmH₂O de diferença é suficiente para mover 500mL de ar — a engenharia pulmonar é extraordinariamente eficiente.',
              },
            ],
          },
          {
            id: 'M2-T3-slides-musculos',
            type: 'slides',
            title: 'Músculos Respiratórios',
            slides: [
              {
                title: 'Músculos Inspiratórios',
                bullets: [
                  'Diafragma (C3-C5): PRINCIPAL músculo inspiratório. Movimento crânio-caudal',
                  'Intercostais Externos (T1-T12): elevam as costelas. Movimento ântero-posterior',
                  'Escalenos: elevam as duas primeiras costelas (acessório)',
                  'Esternocleidomastóideo (ECM): eleva o esterno (acessório)',
                  'Serráteis Anteriores: elevam várias costelas (acessório)',
                ],
                highlight: 'Diafragma = 75% do trabalho inspiratório. Lesão do nervo frênico (C3-C5) = paralisia diafragmática.',
              },
              {
                title: 'Músculos Expiratórios',
                bullets: [
                  'Em repouso: expiração é PASSIVA (retração elástica)',
                  'Expiração FORÇADA usa músculos ativamente:',
                  'Reto Abdominal: puxa costelas inferiores para baixo + comprime abdômen contra diafragma',
                  'Intercostais Internos: puxam a caixa torácica para baixo',
                  'Oblíquos e Transverso do Abdômen: comprimem conteúdo abdominal',
                ],
              },
              {
                title: 'Mecanismo Integrado',
                bullets: [
                  'Inspiração: diafragma desce + costelas sobem → ↑ volume → ↓ pressão → ar entra',
                  'Expiração: diafragma sobe + costelas descem → ↓ volume → ↑ pressão → ar sai',
                  'Lei de Boyle: P × V = constante (a mesma massa de gás)',
                  'O pulmão NÃO se expande sozinho — é puxado pela caixa torácica via pleura',
                  'O acoplamento pleural é essencial: pneumotórax rompe essa ligação → pulmão colapsa',
                ],
                highlight: 'Lei de Boyle: ↑Volume = ↓Pressão. ↓Volume = ↑Pressão. Toda a ventilação depende dessa relação.',
              },
            ],
          },
          {
            id: 'M2-T3-sim-ventilation',
            type: 'simulation',
            title: 'Mecânica Ventilatória Interativa',
            simulationId: 'respiratory-ventilation',
            description: 'Ciclo completo: caixa torácica expandindo/retraindo, diafragma subindo/descendo, fluxo de ar, pressões em tempo real',
          },
        ],
      },
      {
        id: 'M2-T4',
        title: 'Difusão e Transporte de Gases',
        blocks: [
          {
            id: 'M2-T4-slides-difusao',
            type: 'slides',
            title: 'Leis da Difusão Gasosa',
            slides: [
              {
                title: 'Lei de Fick',
                bullets: [
                  'Quantidade de gás que difunde é PROPORCIONAL à área de superfície da membrana',
                  'E INVERSAMENTE proporcional à espessura da membrana',
                  'Membrana respiratória: ~70-100 m² de área × 0,5 µm de espessura',
                  'Design evolutivo otimizado: máxima área, mínima espessura',
                  'Edema pulmonar: ↑ espessura → ↓ difusão → hipoxemia',
                ],
                highlight: 'Fick: Difusão ∝ (Área × ΔP × Solubilidade) / (Espessura × √Peso Molecular)',
              },
              {
                title: 'Lei de Henry e Coeficiente de Difusão',
                bullets: [
                  'Henry: quantidade de gás dissolvido é proporcional à pressão parcial',
                  'Diferença de pressão parcial = motor da difusão',
                  'ΔPO₂ = 104 (alveolar) - 40 (venoso) = 64 mmHg',
                  'ΔPCO₂ = 45 (venoso) - 40 (alveolar) = 5 mmHg',
                  'Coeficiente de difusão: depende da solubilidade e peso molecular',
                ],
              },
              {
                title: 'CO₂ vs O₂: Velocidade de Difusão',
                bullets: [
                  'CO₂ difunde ~20× mais rápido que O₂ (alta solubilidade)',
                  'Por isso, mesmo com ΔP pequeno (5 mmHg), CO₂ se equilibra facilmente',
                  'O₂ difunde ~2× mais rápido que N₂',
                  'Tempo de equilíbrio nos capilares: ~0,25 s (sangue fica ~0,75 s)',
                  'Há reserva funcional: mesmo em exercício, equilíbrio é alcançado',
                ],
                highlight: 'CO₂ difunde 20× mais rápido que O₂ — por isso, a retenção de CO₂ só ocorre em falha ventilatória grave.',
              },
            ],
          },
          {
            id: 'M2-T4-slides-transporte-o2',
            type: 'slides',
            title: 'Transporte de O₂',
            slides: [
              {
                title: 'Duas Formas de Transporte',
                bullets: [
                  'O₂ DISSOLVIDO no plasma: PaO₂ × 0,003 = 0,3 vol% (apenas 1,5% do total)',
                  'O₂ LIGADO à Hemoglobina: 98,5% do total — forma oxi-hemoglobina (HbO₂)',
                  'Cada molécula de Hb liga até 4 moléculas de O₂',
                  'HbA (adultos): 2 cadeias α + 2 cadeias β',
                  'HbF (fetal): 2 cadeias α + 2 cadeias γ — maior afinidade pelo O₂',
                ],
                highlight: 'Sem hemoglobina, o sangue carregaria apenas 0,3 vol% de O₂ — insuficiente para a vida.',
              },
              {
                title: 'Curva de Dissociação da Oxi-Hemoglobina',
                bullets: [
                  'Formato SIGMOIDE: cooperatividade positiva (ligação de 1 O₂ facilita as próximas)',
                  'P50 = 26-27 mmHg: PO₂ na qual Hb está 50% saturada (referência)',
                  'Pulmões (PO₂ ~100 mmHg): SaO₂ ~97-98% — carga eficiente',
                  'Tecidos (PO₂ ~40 mmHg): SaO₂ ~75% — liberação de ~22-23% do O₂',
                  'Equação de Hill: SaO₂ = PO₂ⁿ / (P50ⁿ + PO₂ⁿ), n ≈ 2,7',
                ],
                highlight: 'O formato sigmoide é genial: platô no topo protege contra variações da PO₂ alveolar; parte íngreme facilita liberação nos tecidos.',
              },
              {
                title: 'Desvios da Curva',
                bullets: [
                  'DESVIO DIREITA (Efeito Bohr): ↑P50, ↓afinidade → FACILITA LIBERAÇÃO nos tecidos',
                  'Causas: ↑temperatura, ↑PCO₂, ↑H⁺ (↓pH), ↑2,3-DPG',
                  'Ocorre nos tecidos metabolicamente ativos — exatamente onde O₂ é mais necessário',
                  'DESVIO ESQUERDA (Haldane): ↓P50, ↑afinidade → FACILITA CAPTAÇÃO nos pulmões',
                  'Causas: ↓temperatura, ↓PCO₂, ↓H⁺ (↑pH), HbF, monóxido de carbono (CO)',
                ],
              },
              {
                title: 'Graus de Hipoxemia',
                bullets: [
                  'Normal: PaO₂ 80-100 mmHg',
                  'Hipoxemia Leve: PaO₂ 60-80 mmHg',
                  'Hipoxemia Moderada: PaO₂ 40-60 mmHg',
                  'Hipoxemia Grave: PaO₂ 20-40 mmHg',
                  'Abaixo de 60 mmHg: SaO₂ cai rapidamente (parte íngreme da curva)',
                ],
                highlight: 'PaO₂ < 60 mmHg é o limiar crítico: a partir daí, pequenas quedas de PO₂ causam grandes quedas de saturação.',
              },
            ],
          },
          {
            id: 'M2-T4-sim-oxyhb',
            type: 'simulation',
            title: 'Curva de Dissociação Oxi-Hemoglobina',
            simulationId: 'respiratory-oxyhb-curve',
            description: 'Equação de Hill real • Desvios Bohr/Haldane • Hover para ver SaO₂ em qualquer PO₂ • Pontos arterial/venoso',
          },
          {
            id: 'M2-T4-slides-transporte-co2',
            type: 'slides',
            title: 'Transporte de CO₂',
            slides: [
              {
                title: 'Três Formas de Transporte',
                bullets: [
                  'CO₂ DISSOLVIDO no plasma (~8%): coeficiente 0,063 vol%/mmHg — muito mais solúvel que O₂',
                  'CARBAMINO-HEMOGLOBINA (~12%): CO₂ liga-se à Hb formando HbCO₂',
                  'BICARBONATO HCO₃⁻ (~80%): PRINCIPAL forma de transporte',
                  'Reação: CO₂ + H₂O ⇄ H₂CO₃ ⇄ HCO₃⁻ + H⁺',
                  'Catalisada pela anidrase carbônica dentro das hemácias',
                ],
                highlight: '80% do CO₂ viaja como bicarbonato (HCO₃⁻) — conecta diretamente a ventilação ao equilíbrio ácido-base.',
              },
              {
                title: 'Mecanismo do Bicarbonato',
                bullets: [
                  'CO₂ entra na hemácia → anidrase carbônica acelera reação (10.000×)',
                  'CO₂ + H₂O → H₂CO₃ (ácido carbônico, instável)',
                  'H₂CO₃ → HCO₃⁻ + H⁺ (dissociação rápida)',
                  'HCO₃⁻ sai da hemácia para o plasma (troca por Cl⁻ — shift de cloreto)',
                  'H⁺ é tamponado pela própria hemoglobina (Hb atua como tampão)',
                ],
              },
              {
                title: 'Integração Ventilação × Ácido-Base',
                bullets: [
                  'Hiperventilação → ↓PCO₂ → ↓H⁺ → alcalose respiratória',
                  'Hipoventilação → ↑PCO₂ → ↑H⁺ → acidose respiratória',
                  'O pulmão é o regulador RÁPIDO do pH sanguíneo',
                  'Rim é o regulador LENTO (horas/dias) — reabsorve/excreta HCO₃⁻',
                  'pH normal: 7,35-7,45 | PaCO₂ normal: 35-45 mmHg',
                ],
                highlight: 'Ventilação = controle rápido do pH. Toda alteração ventilatória tem consequência ácido-base imediata.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    moduleId: 'M3',
    topics: [
      { id: 'M3-T1', title: 'Cardio', blocks: [] },
    ],
  },
]
