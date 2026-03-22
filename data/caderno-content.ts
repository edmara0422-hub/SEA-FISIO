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
