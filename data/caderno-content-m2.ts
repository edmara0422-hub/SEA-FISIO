import type { CadernoModuleContent } from '@/types/caderno'

export const M2_CONTENT: CadernoModuleContent = {
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
      {
        id: 'M2-T5',
        title: 'Controle Respiratório',
        blocks: [
          {
            id: 'M2-T5-slides-centros',
            type: 'slides',
            title: 'Centro Respiratório no Tronco Cerebral',
            slides: [
              {
                title: 'Grupo Respiratório Dorsal (GRD)',
                bullets: [
                  'Localização: porção dorsal do bulbo (Núcleo do Trato Solitário — NTS)',
                  'Responsável principalmente pela INSPIRAÇÃO',
                  'Gera o "sinal em rampa": inicia fraco, eleva-se por ~2 segundos',
                  'Após 2s: interrompe abruptamente → expiração passiva por ~3 segundos',
                  'NTS recebe aferências dos nervos vago (X) e glossofaríngeo (IX)',
                ],
                highlight: 'O ritmo básico da respiração é gerado no GRD do bulbo — inspiração de 2s + expiração de 3s = 12 ciclos/min.',
              },
              {
                title: 'Grupo Respiratório Ventral (GRV)',
                bullets: [
                  'Localização: ventrolateral do bulbo',
                  'Encarregado basicamente da EXPIRAÇÃO',
                  'Contém neurônios inspiratórios E expiratórios',
                  'Inativo durante respiração tranquila (expiração é passiva)',
                  'Ativo na expiração FORÇADA: tosse, exercício, sopro',
                ],
              },
              {
                title: 'Centro Pneumotáxico (Ponte)',
                bullets: [
                  'Localização: dorsalmente no núcleo parabraquial da ponte superior',
                  'Controla o "ponto de desligamento" da rampa inspiratória',
                  'Sinal intenso → ↑frequência (30-40/min) — inspiração curta',
                  'Sinal débil → ↓frequência (3-5/min) — inspiração longa',
                  'Função: modular duração da fase inspiratória do ciclo',
                ],
                highlight: 'Centro pneumotáxico = "freio" da inspiração. Controla quanto tempo o GRD fica ativo.',
              },
            ],
          },
          {
            id: 'M2-T5-slides-hering',
            type: 'slides',
            title: 'Reflexo de Hering-Breuer',
            slides: [
              {
                title: 'Mecanismo de Proteção Pulmonar',
                bullets: [
                  'Receptores de estiramento nas paredes musculares de brônquios e bronquíolos',
                  'Sinais transmitidos via nervos vagos até o GRD no bulbo',
                  'Ativado quando volume corrente > 1,5L (3× o normal)',
                  'NÃO é ativado na respiração tranquila normal',
                  'Resposta: "desativa" a rampa inspiratória → interrompe inspiração',
                ],
                highlight: 'Hering-Breuer: reflexo protetor contra distensão excessiva dos pulmões. Só ativado em volumes muito altos (>1,5L).',
              },
            ],
          },
          {
            id: 'M2-T5-slides-quimio',
            type: 'slides',
            title: 'Quimiorreceptores',
            slides: [
              {
                title: 'Quimiorreceptores Centrais',
                bullets: [
                  'Localização: porção ventral do bulbo',
                  'Principal estímulo: aumento de H⁺ (acidose) no líquor (LCR)',
                  'CO₂ cruza a BHE → CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻',
                  'H⁺ estimula diretamente os quimiorreceptores centrais',
                  'São o principal regulador TÔNICO da ventilação',
                ],
                highlight: 'CO₂ é o principal regulador da ventilação em condições normais — via conversão em H⁺ no LCR.',
              },
              {
                title: 'Quimiorreceptores Periféricos',
                bullets: [
                  'Corpos carotídeos: bifurcação da artéria carótida comum → nervo glossofaríngeo (IX)',
                  'Corpos aórticos: arco aórtico → nervo vago (X)',
                  'Principal estímulo: diminuição de PaO₂ (hipoxemia)',
                  'Ativação significativa quando PaO₂ < 60 mmHg',
                  'Também respondem a ↑PCO₂ e ↑H⁺, mas são secundários nisso',
                ],
                highlight: 'Periféricos = sensor de O₂. Centrais = sensor de CO₂/H⁺. Juntos garantem homeostase dos gases sanguíneos.',
              },
              {
                title: 'Controle Voluntário vs. Automático',
                bullets: [
                  'Automático: centros no bulbo e ponte — opera 24h sem consciência',
                  'Voluntário: córtex cerebral pode sobrepor temporariamente (fala, canto, mergulho)',
                  'Limitação: controle voluntário NÃO supera o drive metabólico indefinidamente',
                  'Exemplo: é impossível se matar prendendo a respiração — acúmulo de CO₂ vence',
                  'Integração: quimiorreceptores + mecanorreceptores + córtex → resposta ventilatória final',
                ],
              },
            ],
          },
          {
            id: 'M2-T5-sim-control',
            type: 'simulation',
            title: 'Controle Neural da Respiração',
            simulationId: 'respiratory-control',
            description: 'Córtex, ponte, bulbo (GRD/GRV), quimiorreceptores centrais/periféricos, Hering-Breuer — clique para detalhes',
          },
        ],
      },
      {
        id: 'M2-T6',
        title: 'Volumes e Capacidades Pulmonares',
        blocks: [
          {
            id: 'M2-T6-slides-volumes',
            type: 'slides',
            title: 'Os 4 Volumes Pulmonares',
            slides: [
              {
                title: 'Volume Corrente e Reservas',
                bullets: [
                  'Volume Corrente (VC): ~500 mL — volume inspirado/expirado em cada respiração normal tranquila',
                  'Volume de Reserva Inspiratória (VRI): ~3.000 mL — volume EXTRA inspirável além do VC',
                  'Volume de Reserva Expiratória (VRE): ~1.100 mL — volume EXTRA expirável além do VC',
                  'Volume Residual (VR): ~1.200 mL — permanece nos pulmões MESMO após expiração máxima',
                  'VR NÃO pode ser medido por espirometria (pulmão nunca esvazia completamente)',
                ],
                highlight: 'Os 4 volumes são medidas fundamentais. VC × frequência = ventilação minuto (~6 L/min em repouso).',
              },
            ],
          },
          {
            id: 'M2-T6-slides-capacidades',
            type: 'slides',
            title: 'As 4 Capacidades Pulmonares',
            slides: [
              {
                title: 'Capacidades = Soma de 2+ Volumes',
                bullets: [
                  'Capacidade Inspiratória (CI): VC + VRI = ~3.500 mL — máximo inspirável do nível expiratório normal',
                  'Capacidade Residual Funcional (CRF): VRE + VR = ~2.300 mL — volume nos pulmões após expiração normal',
                  'Capacidade Vital (CV): VRI + VC + VRE = ~4.600 mL — máximo de ar mobilizável',
                  'Capacidade Pulmonar Total (CPT): CV + VR = ~5.800 mL — TODO o ar que os pulmões comportam',
                ],
                highlight: 'CV é a medida clínica mais importante na espirometria. CV reduzida indica doença restritiva.',
              },
            ],
          },
          {
            id: 'M2-T6-slides-espacos',
            type: 'slides',
            title: 'Espaços Mortos',
            slides: [
              {
                title: 'Ar Que Não Participa da Troca',
                bullets: [
                  'Espaço Morto Anatômico: ~150 mL — volume nas vias condutoras (nariz → bronquíolos terminais)',
                  'Espaço Morto Alveolar: ~0 mL em pessoa normal — alvéolos ventilados mas não perfundidos',
                  'Espaço Morto Fisiológico = Anatômico + Alveolar — em pessoa saudável ≈ anatômico',
                  'Em doença pulmonar: espaço morto fisiológico pode ser até 10× o anatômico (1-2 L)',
                  'Alvéolos não funcionantes (sem fluxo sanguíneo) aumentam o espaço morto alveolar',
                ],
                highlight: 'Ventilação alveolar efetiva = (VC - espaço morto) × frequência = (500-150) × 12 = 4.200 mL/min.',
              },
            ],
          },
          {
            id: 'M2-T6-slides-circulacao',
            type: 'slides',
            title: 'Circulação Pulmonar',
            slides: [
              {
                title: 'Sistêmica vs. Pulmonar',
                bullets: [
                  'Circulação Sistêmica: alta pressão (120/80 mmHg) — distribui sangue oxigenado ao corpo',
                  'Circulação Pulmonar: BAIXA pressão (25/10 mmHg) — leva sangue aos pulmões para hematose',
                  'Artéria pulmonar: sangue DESOXIGENADO (VD → pulmões)',
                  'Veias pulmonares: sangue OXIGENADO (pulmões → AE)',
                  'Baixa pressão pulmonar: evita edema, facilita troca gasosa',
                ],
                highlight: 'A circulação pulmonar opera com 1/5 da pressão sistêmica — design otimizado para troca gasosa sem edema.',
              },
            ],
          },
          {
            id: 'M2-T6-sim-volumes',
            type: 'simulation',
            title: 'Espirometria — Volumes e Capacidades',
            simulationId: 'respiratory-volumes',
            description: 'Traçado espirométrico em tempo real com 4 volumes e 4 capacidades — clique para destacar cada um',
          },
        ],
      },
      {
        id: 'M2-T7',
        title: 'Oxigenoterapia',
        blocks: [
          {
            id: 'M2-T7-slides-fundamentos',
            type: 'slides',
            title: 'Fundamentos da Oxigenoterapia',
            slides: [
              {
                title: 'Definição e Objetivo',
                bullets: [
                  'Definição: administrar O₂ em FiO₂ > 21% (acima da atmosférica)',
                  'Objetivo: aumentar SaO₂ > 90%, corrigindo hipoxemia',
                  'FiO₂ atmosférica normal: 21% (fração inspirada de oxigênio)',
                  'Meta terapêutica: SaO₂ entre 92-96% (maioria dos pacientes)',
                  'Em DPOC: meta SaO₂ 88-92% (evitar supressão do drive hipóxico)',
                ],
                highlight: 'Oxigenoterapia NÃO é "quanto mais, melhor". Hiperóxia causa toxicidade pulmonar e supressão ventilatória.',
              },
              {
                title: 'Definições Importantes',
                bullets: [
                  'Hipoxemia: redução de O₂ no sangue arterial (PaO₂ < 80 mmHg)',
                  'Hipóxia: redução de O₂ nos tecidos — consequência da hipoxemia',
                  'Disóxia: O₂ celular insuficiente para fosforilação oxidativa (produção de ATP)',
                  'Hiperoxemia: aumento excessivo de O₂ no sangue arterial (PaO₂ > 120 mmHg)',
                  'Hiperóxia: excesso de O₂ nos tecidos → toxicidade por radicais livres',
                ],
              },
              {
                title: 'Causas de Hipoxemia',
                bullets: [
                  'Altitude: pressão barométrica reduzida → ↓PiO₂',
                  'Distúrbios de difusão: espessamento da membrana alvéolo-capilar (edema, fibrose)',
                  'Alteração da relação V/Q: desequilíbrio ventilação-perfusão',
                  'Shunt: sangue passa pelo pulmão sem realizar hematose',
                  'Redução do débito cardíaco: ↓fluxo sanguíneo pulmonar',
                ],
                highlight: 'Sintomas: agitação, irritabilidade, dispneia, confusão mental, cianose, taquicardia, taquipneia.',
              },
            ],
          },
          {
            id: 'M2-T7-slides-dispositivos',
            type: 'slides',
            title: 'Classificação dos Dispositivos',
            slides: [
              {
                title: 'Baixo Fluxo — FiO₂ Variável',
                bullets: [
                  'Cânula Nasal: 1-6 L/min → FiO₂ 24-44%. Cada 1L/min ≈ +4% FiO₂',
                  'Máscara Facial Simples: 5-10 L/min → FiO₂ 40-60%. Mín. 5L (evitar reinalação CO₂)',
                  'Máscara com Reservatório: 10-15 L/min → FiO₂ 60-100%. Válvulas unidirecionais',
                  'Bolsa Reanimadora (AMBÚ): 15 L/min → FiO₂ 21-100%. Ventilação manual de emergência',
                  'Característica: FiO₂ VARIÁVEL, depende do padrão respiratório do paciente',
                ],
              },
              {
                title: 'Alto Fluxo — FiO₂ Controlada',
                bullets: [
                  'Máscara de Venturi: FiO₂ PRECISA (24-50%). Princípio Venturi: mescla O₂ com ar ambiente',
                  'Peças coloridas: Azul=24%, Amarelo=28%, Laranja=31%, Vermelho=35%, Rosa=40%, Roxo=50%',
                  'Dispositivo de ESCOLHA para DPOC com hipercapnia — evita supressão do drive hipóxico',
                  'Cateter Nasal de Alto Fluxo: até 60 L/min, FiO₂ 21-100%, aquecido e umidificado',
                  'Alto fluxo gera PEEP ~2-5 cmH₂O, reduz espaço morto, melhora mucociliar',
                ],
                highlight: 'Venturi = DPOC. Alto Fluxo = alternativa à VNI. Baixo Fluxo = maioria dos casos de hipoxemia leve-moderada.',
              },
            ],
          },
          {
            id: 'M2-T7-sim-devices',
            type: 'simulation',
            title: 'Dispositivos de Oxigenoterapia',
            simulationId: 'respiratory-oxytherapy',
            description: 'Explore todos os dispositivos: cânula nasal, máscaras, Venturi, alto fluxo — com fluxos, FiO₂ e indicações',
          },
          {
            id: 'M2-T7-slides-venturi',
            type: 'slides',
            title: 'Máscara de Venturi — Detalhes',
            slides: [
              {
                title: 'Princípio de Funcionamento',
                bullets: [
                  'O₂ sob pressão passa por um orifício estreito (jato)',
                  'Cria zona de baixa pressão que ASPIRA ar ambiente (efeito Venturi)',
                  'Mistura O₂ puro + ar ambiente = FiO₂ precisa e constante',
                  'Tamanho do orifício determina a FiO₂: menor orifício = mais ar aspirado = menor FiO₂',
                  'Independe do padrão respiratório do paciente (diferença do baixo fluxo)',
                ],
              },
              {
                title: 'Peças e Manejo Clínico',
                bullets: [
                  'Azul: 24% (3L/min) — início em DPOC grave',
                  'Amarelo: 28% (6L/min) — DPOC moderado',
                  'Laranja: 31% (8L/min) | Vermelho: 35% (10L/min)',
                  'Rosa: 40% (12L/min) | Roxo: 50% (15L/min)',
                  'Se SaO₂ não melhora: trocar para peça com maior FiO₂',
                ],
                highlight: 'Em DPOC com CO₂ retido: SEMPRE iniciar com FiO₂ baixa (24-28%) e titular conforme gasometria.',
              },
            ],
          },
        ],
      },
      {
        id: 'M2-T8',
        title: 'Semiologia Pulmonar',
        blocks: [
          {
            id: 'M2-T8-slides-dispneia',
            type: 'slides',
            title: 'Dispneia — Classificação',
            slides: [
              {
                title: 'Graus de Dispneia',
                bullets: [
                  'Grandes esforços: dispneia apenas em atividades intensas (corrida, escada)',
                  'Médios esforços: dispneia em atividades moderadas (caminhada rápida)',
                  'Pequenos esforços: dispneia em atividades leves (vestir-se, caminhar devagar)',
                  'Repouso: dispneia SEM qualquer esforço — gravidade máxima',
                ],
              },
              {
                title: 'Tipos Especiais de Dispneia',
                bullets: [
                  'Dispneia Paroxística Noturna: episódio súbito durante o sono (insuficiência cardíaca)',
                  'Ortopneia: piora em decúbito dorsal, melhora sentado/em pé (↑ retorno venoso → congestão pulmonar)',
                  'Trepopneia: piora em decúbito lateral específico',
                  'Platipneia: piora sentado/em pé, melhora deitado (rara, shunt intracardíaco)',
                ],
                highlight: 'Dispneia é SUBJETIVA — é o que o paciente sente. Não depende apenas da SpO₂ ou gasometria.',
              },
            ],
          },
          {
            id: 'M2-T8-slides-inspecao',
            type: 'slides',
            title: 'Inspeção do Tórax',
            slides: [
              {
                title: 'Inspeção Estática',
                bullets: [
                  'Expressão do paciente: sinais de angústia, desconforto, uso de musculatura acessória',
                  'Estrutura do tórax: simetria, deformidades (barril, escavatum, carinatum)',
                  'Características anatômicas: formato, postura, posicionamento preferencial',
                ],
              },
              {
                title: 'Inspeção Dinâmica',
                bullets: [
                  'Frequência Respiratória: normal 12-20 irpm. Taquipneia >20, bradipneia <12',
                  'Sincronismo: coordenação tóraco-abdominal (respiração paradoxal = fadiga)',
                  'Ritmo: regular ou irregular (Cheyne-Stokes, Biot, Kussmaul)',
                  'Tipo respiratório: torácico (costal), abdominal (diafragmático), misto',
                  'Tiragem: retração intercostal, subcostal, supraclavicular = esforço aumentado',
                  'Expansibilidade: simétrica ou assimétrica',
                ],
                highlight: 'Tiragem + uso de acessórios + respiração paradoxal = sinais de insuficiência respiratória.',
              },
            ],
          },
          {
            id: 'M2-T8-slides-espirometria',
            type: 'slides',
            title: 'Espirometria — Distúrbios Ventilatórios',
            slides: [
              {
                title: 'Parâmetros Principais',
                bullets: [
                  'CVF (Capacidade Vital Forçada): volume máximo exalado com esforço máximo',
                  'VEF₁ (Vol. Expiratório Forçado 1s): volume exalado no 1º segundo da CVF',
                  'VEF₁/CVF: relação — principal índice para classificar o distúrbio',
                  'PFE (Pico de Fluxo Expiratório): fluxo máximo durante a manobra',
                  'FEF₂₅₋₇₅%: fluxo médio (sensível para pequenas vias aéreas)',
                ],
              },
              {
                title: 'Distúrbio Obstrutivo (DVO)',
                bullets: [
                  'VEF₁/CVF REDUZIDA (< LIN — Limite Inferior da Normalidade)',
                  'Estreitamento de vias aéreas → resistência ao fluxo ↑',
                  'Curva volume-tempo: ascensão LENTA, achatada',
                  'Curva fluxo-volume: concavidade característica (scooped out)',
                  'Exemplos: DPOC, asma, bronquite crônica, bronquiectasias',
                ],
              },
              {
                title: 'Distúrbio Restritivo (DVR)',
                bullets: [
                  'VEF₁/CVF NORMAL ou aumentada',
                  'CVF REDUZIDA — pulmão não consegue expandir adequadamente',
                  'CPT reduzida (confirmação definitiva requer pletismografia)',
                  'Curva volume-tempo: curva CURTA (menos volume total)',
                  'Exemplos: fibrose pulmonar, doenças neuromusculares, cifoescoliose',
                ],
                highlight: 'Obstrutivo = dificuldade de SAÍDA do ar (VEF₁/CVF↓). Restritivo = dificuldade de ENTRADA (CVF↓, ratio normal).',
              },
            ],
          },
          {
            id: 'M2-T8-sim-spirometry',
            type: 'simulation',
            title: 'Espirometria — Curvas Volume-Tempo e Fluxo-Volume',
            simulationId: 'respiratory-spirometry',
            description: 'Compare padrões Normal × Obstrutivo × Restritivo com curvas SVG, parâmetros calculados e toggle entre visualizações',
          },
          {
            id: 'M2-T8-slides-manovac',
            type: 'slides',
            title: 'Manovacuometria e Peak Flow',
            slides: [
              {
                title: 'PImáx — Pressão Inspiratória Máxima',
                bullets: [
                  'Avalia força dos músculos INSPIRATÓRIOS (diafragma)',
                  'Técnica: expiração até VR → esforço inspiratório máximo contra válvula',
                  'Normal: -80 a -120 cmH₂O',
                  'Fraqueza: -70 a -45 cmH₂O',
                  'Fadiga: -45 a -25 cmH₂O | Falência: < -20 cmH₂O',
                ],
              },
              {
                title: 'PEmáx — Pressão Expiratória Máxima',
                bullets: [
                  'Avalia força dos músculos EXPIRATÓRIOS (abdominais)',
                  'Técnica: inspiração até CPT → esforço expiratório máximo contra válvula',
                  'Importante para avaliar capacidade de TOSSE e eliminação de secreções',
                  '3 repetições → considerar MAIOR valor',
                  'PEmáx baixa = risco de retenção de secreções',
                ],
              },
              {
                title: 'Peak Flow (PFE)',
                bullets: [
                  'Pico de fluxo expiratório — velocidade máxima do ar na expiração forçada',
                  'Técnica: inspirar profundamente → soprar o mais forte e rápido possível',
                  '3 medições → anotar MAIOR valor ou média',
                  'Uso clínico: monitorização de asma, resposta ao broncodilatador',
                  'Em VM: PFT > 60 L/min indica força adequada para desmame',
                ],
                highlight: 'PImáx avalia diafragma. PEmáx avalia tosse. Peak flow monitora asma. Os três são ferramentas essenciais do fisioterapeuta.',
              },
            ],
          },
          {
            id: 'M2-T8-slides-ventilometria',
            type: 'slides',
            title: 'Ventilometria e VVM',
            slides: [
              {
                title: 'Ventilação Voluntária Máxima (VVM)',
                bullets: [
                  'Reflete: cooperação, potência de via aérea, força muscular, expansão pulmonar',
                  'Técnica: respirar o mais rápido e profundamente possível por 12-15 segundos',
                  'Resultado extrapolado para 1 minuto (L/min)',
                  'Avalia capacidade de resposta ventilatória sob demanda',
                  'Valores de referência: CVL normal = 65-75 mL/Kg',
                ],
                highlight: 'VVM reduzida = limitação ventilatória ao exercício. Fundamental para prescrição de exercícios.',
              },
            ],
          },
        ],
      },
      {
        id: 'M2-T9',
        title: 'Patologias Respiratórias',
        blocks: [],
      },
      {
        id: 'M2-T10',
        title: 'VNI — Ventilação Não Invasiva',
        blocks: [
          {
            id: 'M2-T10-slides-definicao',
            type: 'slides',
            title: 'Definição e Objetivos da VNI',
            slides: [
              {
                title: 'O que é VNI?',
                bullets: [
                  'Suporte ventilatório através de máscara, sem necessidade de prótese (TOT/TQT)',
                  'Melhora ventilação e otimiza trocas gasosas',
                  'Promove repouso da musculatura respiratória',
                  'Reduz auto-PEEP e hiperinsuflação dinâmica',
                  'Alivia dispneia e desconforto respiratório',
                ],
                highlight: 'VNI = suporte ventilatório SEM intubação. Interface por máscara nasal, oronasal ou facial total.',
              },
              {
                title: 'Indicações da VNI',
                bullets: [
                  'Redução do trabalho respiratório (aumento de FR, uso de musculatura acessória)',
                  'Hipoxemia — SatO₂ < 90% ou PaO₂ < 60 mmHg',
                  'EAP — Edema Agudo de Pulmão (evidência forte)',
                  'DPOC exacerbada — acidose respiratória (pH < 7,35)',
                  'Asma grave — broncoespasmo refratário',
                  'SDRA leve — PaO₂/FiO₂ entre 200-300',
                  'PAC — Pneumonia Adquirida na Comunidade',
                  'Pós-operatório — prevenção de atelectasia',
                ],
              },
              {
                title: 'Critérios de Sucesso e Tempo',
                bullets: [
                  'Sessão recomendada: 30-120 minutos',
                  '✅ Redução da FR (frequência respiratória)',
                  '✅ Redução da PaCO₂',
                  '✅ Aumento do VC (volume corrente)',
                  '✅ Aumento da SatO₂',
                  '✅ Redução de tiragens e uso de musculatura acessória',
                  '⚠️ Reavaliar em 1-2 horas — se sem melhora → considerar IOT',
                ],
                highlight: 'Avaliar resposta em 1-2h. Sem melhora clínica = risco de falha. Escala HACOR > 5 = alto risco.',
              },
            ],
          },
          {
            id: 'M2-T10-slides-contraindicacoes',
            type: 'slides',
            title: 'Contraindicações da VNI',
            slides: [
              {
                title: 'Contraindicações Relativas',
                bullets: [
                  'RNC — Rebaixamento do nível de consciência (Glasgow < 10 recomendado)',
                  'Vômitos recentes ou ativos',
                  'Excesso de secreção nas vias aéreas',
                  'HOA — Hemorragia de vias aéreas',
                  'Ansiedade extrema / paciente não tolera máscara',
                  'Obesidade mórbida (considerar ajuste de interface)',
                ],
              },
              {
                title: 'Contraindicações Absolutas',
                bullets: [
                  '❌ PCR — Parada Cardiorrespiratória',
                  '❌ Instabilidade hemodinâmica grave',
                  '❌ Paciente totalmente não colaborativo',
                  '❌ PO de face, esôfago ou via digestiva alta',
                  '❌ Trauma ou queimadura de face',
                  '❌ Risco iminente de broncoaspiração',
                  '❌ Incapacidade de manter vias aéreas pérvias',
                ],
                highlight: 'Contraindicações absolutas = IOT imediata. Não insistir em VNI quando o risco supera o benefício.',
              },
            ],
          },
          {
            id: 'M2-T10-slides-cpap',
            type: 'slides',
            title: 'CPAP — Pressão Positiva Contínua',
            slides: [
              {
                title: 'CPAP — Um Nível de Pressão',
                bullets: [
                  'CPAP = Continuous Positive Airway Pressure',
                  'Pressão positiva CONSTANTE durante todo o ciclo (insp + exp)',
                  'Ventilação espontânea — o paciente respira sozinho',
                  'Mantém resistência (pressão) no fim da expiração',
                  'Um ÚNICO nível de pressão = sem diferença insp/exp',
                ],
              },
              {
                title: 'Indicações e Efeitos do CPAP',
                bullets: [
                  '🫁 Síndrome da Apneia Obstrutiva do Sono (SAOS)',
                  '❤️ Edema Agudo de Pulmão (EAP) — evidência nível A',
                  '🔴 Hipoxemia refratária',
                  '💨 Atelectasias pós-operatórias',
                  'Efeito: recruta alvéolos colapsados, melhora CRF',
                  'Efeito: redistribui líquido extravascular pulmonar',
                  'Efeito: reduz pré-carga e pós-carga (benefício no EAP)',
                ],
                highlight: 'CPAP no EAP: reduz edema + melhora oxigenação + reduz trabalho cardíaco. Triplo benefício.',
              },
            ],
          },
          {
            id: 'M2-T10-slides-bipap',
            type: 'slides',
            title: 'BIPAP — Dois Níveis de Pressão',
            slides: [
              {
                title: 'BIPAP — IPAP e EPAP',
                bullets: [
                  'BIPAP = Bilevel Positive Airway Pressure',
                  'Dois níveis pressóricos: IPAP (inspiração) e EPAP (expiração)',
                  'Fluxo contínuo e NÃO constante — alterna entre dois níveis',
                  'PS (Pressão de Suporte) = IPAP − EPAP',
                  'Exemplo: IPAP 15 / EPAP 5 → PS = 10 cmH₂O',
                ],
              },
              {
                title: 'IPAP — Pressão Inspiratória',
                bullets: [
                  'Pressão positiva durante a INSPIRAÇÃO',
                  'Provoca aumento do volume corrente (VC)',
                  'Melhora a ventilação alveolar',
                  'Diminui o trabalho respiratório',
                  'Profundidade relacionada ao nível de esforço',
                  'Quanto maior o IPAP → maior o suporte ventilatório',
                ],
              },
              {
                title: 'EPAP — Pressão Expiratória',
                bullets: [
                  'É uma das formas de aplicar PEEP',
                  'Pressão positiva durante a EXPIRAÇÃO',
                  'Mantém vias aéreas e alvéolos abertos',
                  'Melhora a oxigenação (recruta alvéolos)',
                  'Permite movimentação de ar por trás dos tampões mucosos',
                  'Aumenta ventilação colateral',
                ],
                highlight: 'IPAP = ventilação (↑VC, ↓trabalho). EPAP = oxigenação (recruta alvéolos, ↓auto-PEEP).',
              },
            ],
          },
          {
            id: 'M2-T10-sim-cpap-bipap',
            type: 'simulation',
            title: 'CPAP vs BIPAP — Curvas de Pressão',
            simulationId: 'respiratory-vni-modes',
            description: 'Compare em tempo real os modos CPAP e BIPAP — ajuste IPAP, EPAP e veja o efeito no volume corrente',
          },
          {
            id: 'M2-T10-slides-hacor',
            type: 'slides',
            title: 'Escala HACOR — Predição de Falha',
            slides: [
              {
                title: 'Escala HACOR',
                bullets: [
                  'H — Heart Rate (FC): taquicardia indica falha',
                  'A — Acidosis (pH): acidose não corrigida',
                  'C — Consciousness (Glasgow): rebaixamento',
                  'O — Oxygenation (PaO₂/FiO₂): oxigenação inadequada',
                  'R — Respiratory Rate (FR): taquipneia persistente',
                  'Pontuação > 5 após 1-2h de VNI = ALTO RISCO de falha',
                  '⚠️ Considerar IOT precoce se HACOR > 5',
                ],
                highlight: 'HACOR > 5 em 1-2h = falha provável. Não aguardar deterioração — IOT precoce salva vidas.',
              },
            ],
          },
          {
            id: 'M2-T10-slides-protocolos',
            type: 'slides',
            title: 'Protocolos por Patologia',
            slides: [
              {
                title: 'DPOC Exacerbada',
                bullets: [
                  'Modo: BIPAP ou PS',
                  'VC: 6 mL/kg peso predito',
                  'PEEP: ajustar para reduzir auto-PEEP sem piorar hiperinsuflação',
                  'FR: ajustada pela gasometria (pH e PaCO₂)',
                  'I:E: fluxo alto → tempo expiratório prolongado',
                  'Rise time: baixo (fluxo alto, Ti baixo)',
                  'Objetivo: corrigir acidose respiratória (pH > 7,35)',
                ],
              },
              {
                title: 'EAP — Edema Agudo de Pulmão',
                bullets: [
                  'Modo: CPAP ou BIPAP ou PS',
                  'VC: 6 mL/kg peso predito',
                  'PEEP/EPAP: 10 cmH₂O (avaliar resposta)',
                  'FR: ajustada pela gasometria',
                  'Benefício hemodinâmico: ↓ pré-carga + ↓ pós-carga',
                  'CPAP isolado já tem forte evidência no EAP',
                  'Reavaliar em 30-60 min',
                ],
              },
              {
                title: 'Asma Grave',
                bullets: [
                  'Modo: BIPAP ou PS',
                  'VC: 6 mL/kg peso predito',
                  'PEEP: ajustar sem piorar hiperinsuflação (ZEEP ou PEEP baixa)',
                  'FR: ajustada pela gasometria',
                  'I:E: fluxo alto → tempo expiratório prolongado (↓air trapping)',
                  'Rise time: baixo — fluxo alto, Ti baixo',
                  'Cuidado: auto-PEEP pode estar muito elevada',
                ],
                highlight: 'DPOC e Asma: priorizar tempo expiratório longo + PEEP que não piore hiperinsuflação. Rise time baixo = fluxo rápido.',
              },
              {
                title: 'SDRA, Trauma, Pós-operatório',
                bullets: [
                  'SDRA leve: CPAP ou BIPAP — VC 6 mL/kg (leve) ou 4 mL/kg (moderada-grave)',
                  'SDRA: PEEP pela tabela ARDS Network (avaliar tipo)',
                  'Trauma torácico: avaliar pneumotórax, hemotórax, contusão antes de iniciar',
                  'PO: CPAP ou BIPAP — PEEP 5 cmH₂O, VC 6 mL/kg',
                  'TEP: CPAP ou BIPAP — PEEP 10 cmH₂O',
                  'Obesidade: CPAP ou BIPAP — PEEP 10 cmH₂O',
                ],
              },
              {
                title: 'Doenças Neuromusculares',
                bullets: [
                  'Miastenia: BIPAP ou PS — CV <40%, PImáx <30 cmH₂O → iniciar VNI',
                  'ELA: BIPAP ou PS — CV <50%, PImáx <30, pH ácido → VNI imediata',
                  'Distrofia: VNI para hipoventilação noturna ou CV <1L',
                  'EPAP/PEEP: <10 cmH₂O',
                  'Monitorar sinais de falha: piora da CV, PImáx, gasometria',
                  'AOS: CPAP — manter perviedade da via aérea durante sono',
                ],
                highlight: 'Neuromusculares: CV e PImáx são indicadores-chave para iniciar VNI. Monitorar evolução da fraqueza.',
              },
            ],
          },
        ],
      },
      {
        id: 'M2-T11',
        title: 'VMI — Ventilação Mecânica Invasiva',
        blocks: [
          {
            id: 'M2-T11-slides-objetivos',
            type: 'slides',
            title: 'Objetivos e Ciclo da VM',
            slides: [
              {
                title: 'Objetivos da Ventilação Mecânica',
                bullets: [
                  'Manutenção da troca gasosa — garantir oxigenação adequada e remoção de CO₂',
                  'Aliviar trabalho respiratório — reduzir esforço da musculatura respiratória',
                  'Correção hipoxemia/hipercapnia — normalizar níveis gasométricos',
                  'Reverter fadiga muscular — evitar e tratar falência muscular respiratória',
                  'Reduzir desconforto — melhorar confort e dispneia do paciente',
                  'Prevenir complicações — evitar barotrauma e lesões associadas',
                ],
              },
              {
                title: '4 Fases do Ciclo Ventilatório',
                bullets: [
                  '1. DISPARO — Início do ciclo: detecção do esforço (assistido) ou tempo programado (controlado)',
                  '2. INSPIRAÇÃO — Ar entra nos pulmões por pressão positiva: entrega de VC ou atingir TI',
                  '3. CICLAGEM — Transição inspiração → expiração: por volume, tempo, fluxo ou pressão',
                  '4. EXPIRAÇÃO — Ar sai dos pulmões (PASSIVA): retração elástica até PEEP',
                ],
                highlight: 'Sequência contínua: 4 → 1 → 2 → 3 → 4 → ...',
              },
              {
                title: 'Disparo (Trigger)',
                bullets: [
                  'Modo controlado: ventilador inicia pelo tempo programado',
                  'Modo assistido: detecta esforço inspiratório do paciente',
                  'Sensibilidade a pressão: −0,5 a −2 cmH₂O',
                  'Sensibilidade a fluxo: 2 a 4 L/min',
                ],
              },
              {
                title: 'Ciclagem',
                bullets: [
                  'VCV: cicla por VOLUME — quando VC programado é entregue',
                  'PCV: cicla por TEMPO — quando TI programado é atingido',
                  'PSV: cicla por FLUXO — quando fluxo cai a 25% do pico',
                  'Ciclagem por pressão: raramente usada, limite de segurança',
                ],
              },
            ],
          },
          {
            id: 'M2-T11-sim-ventilator',
            type: 'simulation',
            title: 'Monitor de Ventilador Mecânico — VCV / PCV / PSV',
            simulationId: 'respiratory-vmi-ventilator',
            description: 'Simulação em tempo real com curvas de Pressão, Fluxo e Volume para VCV, PCV e PSV. Ajuste parâmetros e veja os efeitos.',
          },
          {
            id: 'M2-T11-slides-modos',
            type: 'slides',
            title: 'Modos Ventilatórios — VCV, PCV, PSV',
            slides: [
              {
                title: 'VCV — Volume Controlado',
                bullets: [
                  'Volume corrente FIXO — entrega o VC programado a cada ciclo',
                  'Fluxo CONSTANTE (onda quadrada) durante a inspiração',
                  'Pressão VARIA conforme complacência e resistência do paciente',
                  'Vantagem: garante ventilação alveolar mínima',
                  'Desvantagem: pressão pode subir se complacência cair',
                  'Ciclagem: por VOLUME (quando VC é entregue)',
                ],
                highlight: 'VCV: Volume fixo + Fluxo quadrado → Pressão varia',
              },
              {
                title: 'PCV — Pressão Controlada',
                bullets: [
                  'Pressão inspiratória FIXA (onda quadrada) — mantém PIP programada',
                  'Fluxo DESACELERANTE — pico no início da inspiração, decai exponencialmente',
                  'Volume VARIA conforme complacência e resistência do paciente',
                  'Vantagem: limita pressão alveolar, melhor distribuição de gás',
                  'Desvantagem: VC pode cair se complacência piorar',
                  'Ciclagem: por TEMPO (quando TI é atingido)',
                ],
                highlight: 'PCV: Pressão fixa + Fluxo desacelerante → Volume varia',
              },
              {
                title: 'PSV — Pressão de Suporte',
                bullets: [
                  'Modo de ventilação ESPONTÂNEA assistida',
                  'Paciente DISPARA cada ciclo (sensibilidade)',
                  'Ventilador entrega pressão de suporte programada',
                  'Fluxo desacelerante — paciente controla FR, TI e VC',
                  'Ciclagem: por FLUXO — quando cai a 25% do pico inspiratório',
                  'Usado em desmame ventilatório e transição para extubação',
                ],
                highlight: 'PSV: Paciente dispara + PS fixa → Cicla por fluxo (25% do pico)',
              },
            ],
          },
          {
            id: 'M2-T11-slides-co2o2',
            type: 'slides',
            title: 'Efeitos Vasculares de CO₂ e O₂',
            slides: [
              {
                title: 'CO₂ — Efeitos Vasculares',
                bullets: [
                  'CO₂ alto (hipercapnia) → vasodilatação cerebral → ↑ fluxo sanguíneo cerebral',
                  'CO₂ baixo (hipocapnia) → vasoconstrição cerebral → ↓ fluxo sanguíneo cerebral',
                  'Na circulação pulmonar: CO₂ alto → vasodilatação local',
                  'Hiperventilação excessiva → hipocapnia → isquemia cerebral',
                ],
              },
              {
                title: 'O₂ — Efeitos Vasculares',
                bullets: [
                  'O₂ alto (hiperóxia) → vasoconstrição cerebral',
                  'O₂ baixo (hipoxemia) → vasodilatação cerebral',
                  'Na circulação pulmonar: resposta OPOSTA ao sistêmico',
                  'Hipóxia alveolar → vasoconstrição pulmonar hipóxica (mecanismo de Euler-Liljestrand)',
                  'Hiperóxia → vasodilatação pulmonar',
                ],
                highlight: 'Sistêmico: CO₂↑ = vasodilata, O₂↑ = vasocontrai | Pulmonar: O₂↓ = vasocontrai (HPV)',
              },
            ],
          },
          {
            id: 'M2-T11-slides-trigger-cycle',
            type: 'slides',
            title: 'Disparo, Ciclagem, TI e JT',
            slides: [
              {
                title: 'Fórmulas do Ciclo Respiratório',
                bullets: [
                  'FR (f) = respiratory rate em bpm',
                  'JT (tempo total) = 60 / FR segundos por ciclo',
                  'Ex: FR = 15 bpm → JT = 60/15 = 4,00 s/ciclo',
                  'TI (tempo inspiratório): tempo entre disparo e ciclagem',
                  'TE (tempo expiratório): JT − TI',
                  'Relação I:E = TI : TE (ex: 1:2, 1:3)',
                ],
              },
              {
                title: 'Trigger & Cycle — Controle',
                bullets: [
                  'Control = Ventilator-triggered: ventilador controla início (trigger) e término (cycle)',
                  'Assistido = Patient-triggered: paciente inicia, ventilador completa o ciclo',
                  'A FR é determinada pelo tempo entre cada trigger',
                  'Sensibilidade: ajusta o limiar de detecção do esforço do paciente',
                ],
              },
            ],
          },
          {
            id: 'M2-T11-sim-peep',
            type: 'simulation',
            title: 'PEEP — Recrutamento Alveolar Interativo',
            simulationId: 'respiratory-vmi-peep',
            description: 'Visualize alvéolos sendo recrutados conforme a PEEP aumenta. Alvéolos abertos respiram, colapsados mostram atelectasia.',
          },
          {
            id: 'M2-T11-slides-peep',
            type: 'slides',
            title: 'PEEP — Conceitos e Efeitos',
            slides: [
              {
                title: 'PEEP — Pressão Expiratória Final Positiva',
                bullets: [
                  'Mantém alvéolos abertos ao final da expiração → previne colapso e atelectasia',
                  'Aumenta superfície de troca gasosa disponível (recrutamento)',
                  'Redistribui edema alveolar para espaços intersticiais',
                  'Torna a ventilação mais homogênea em zonas dependentes',
                  'Diminui o shunt intrapulmonar (↑ oxigenação)',
                ],
              },
              {
                title: 'PEEP e Hemodinâmica',
                bullets: [
                  'PEEP ↑ → ↑ pressão intratorácica → ↓ retorno venoso → ↓ DC',
                  'Principal mecanismo de comprometimento: ↓ retorno venoso pela ↑ PAD',
                  'Também: ↓ contratilidade, ↑ pós-carga VD e VE, mediadores humorais',
                  'Em SDRA: PEEP pode ↓ VS, ↓ DC, ↓ FC, ↑ RVS, ↑ RVP',
                  'Individualizar: balancear recrutamento alveolar vs efeito hemodinâmico',
                ],
                highlight: 'PEEP elevada pode comprometer o DC — monitorar VS, DC e PAM ao ajustar.',
              },
            ],
          },
          {
            id: 'M2-T11-sim-mechanics',
            type: 'simulation',
            title: 'Mecânica Respiratória — Calculadora',
            simulationId: 'respiratory-vmi-mechanics',
            description: 'Calculadora interativa: ΔP (Driving Pressure), Cest, Cdyn, RAW. Ajuste Platô, Pico, PEEP, VC e Fluxo.',
          },
          {
            id: 'M2-T11-slides-mechanics',
            type: 'slides',
            title: 'Pressões, Complacências e Resistência',
            slides: [
              {
                title: 'ΔP (Driving Pressure)',
                bullets: [
                  'Fórmula: ΔP = Platô − PEEP',
                  'Diferença entre pressão de platô e PEEP',
                  'Representa a pressão necessária para ventilar os pulmões',
                  'Alvo: < 15 cmH₂O (proteção pulmonar)',
                  'Melhor preditor de mortalidade em SDRA',
                ],
                highlight: 'ΔP < 15 cmH₂O: associado a menor mortalidade em SDRA.',
              },
              {
                title: 'Pressão Platô e Pressão de Pico',
                bullets: [
                  'Platô: pressão medida após pausa inspiratória — reflete pressão alveolar real',
                  'Alvo Platô: < 30 cmH₂O (evitar barotrauma)',
                  'Pico (PIP): pressão máxima no final da inspiração — inclui resistência VA + pressão alveolar',
                  'Diferença Pico − Platô: reflete a resistência das vias aéreas (RAW)',
                ],
              },
              {
                title: 'Complacência Estática (Cest)',
                bullets: [
                  'Fórmula: Cest = VC / (Platô − PEEP)',
                  'Componentes: Pulmão + Caixa Torácica',
                  'Precisa de pausa inspiratória para medir',
                  'Normal: > 50 mL/cmH₂O',
                  'Cest baixa: ↓ distensibilidade (SDRA, fibrose, atelectasia, edema)',
                ],
              },
              {
                title: 'Complacência Dinâmica (Cdyn)',
                bullets: [
                  'Fórmula: Cdyn = VC / (Pico − PEEP)',
                  'Inclui Vias Aéreas (não precisa pausa)',
                  'Referência: ~10 mL/cmH₂O abaixo da Cest',
                  'Cdyn baixa: indica ↑ resistência das vias aéreas (broncoespasmo, secreção)',
                ],
              },
              {
                title: 'RAW — Resistência das Vias Aéreas',
                bullets: [
                  'Fórmula: RAW = (Pico − Platô) / Fluxo (L/s)',
                  'Normal: 7−10 cmH₂O/L/s',
                  'RAW elevada: broncoconstrição, secreções, edema, tubo OT pequeno',
                  'Atenção: Fluxo em L/min precisa ser dividido por 60 para converter em L/s',
                ],
              },
            ],
          },
          {
            id: 'M2-T11-slides-cardiopulmonar',
            type: 'slides',
            title: 'Interação Cardiopulmonar na VM',
            slides: [
              {
                title: 'Pressão Intratorácica (PIT)',
                bullets: [
                  'Qualquer mudança na PIT interfere no retorno venoso ao VD e no fluxo do VE',
                  '↑ PIT (pressão positiva): ↑ PAD, ↓ pressão transmural, ↓ retorno venoso',
                  'Respiração espontânea: PIT negativa → favorece retorno venoso',
                  'VM com pressão positiva: altera fundamentalmente a hemodinâmica cardíaca',
                ],
              },
              {
                title: 'Ventrículo Direito (VD)',
                bullets: [
                  'VM ↑ volumes pulmonares → ↑ RVP → ↑ pós-carga do VD',
                  'Inspiração: ↓ retorno venoso → ↓ VS do VD → ↓ dimensões VD',
                  'Expiração: ↑ retorno venoso → ↑ VS do VD → ↑ dimensões VD',
                  'Parede livre fina: não adaptado para pressões elevadas',
                  'Vulnerável a dissincronia e BRE',
                ],
              },
              {
                title: 'Ventrículo Esquerdo (VE)',
                bullets: [
                  'Alteração no retorno venoso do VD → altera pré-carga do VE',
                  '↑ PIT pode reduzir enchimento VD → repercute no VS do VE',
                  'VS do VE afetado por: volume sanguíneo, FR e VC',
                  'Pressão positiva pode alterar geometria ventricular',
                  'Um único ciclo com pressão positiva pode provocar variação no DC',
                ],
              },
              {
                title: 'Lei de Frank-Starling e Compensações',
                bullets: [
                  '↑ Pós-carga → aumenta contratilidade miocárdica',
                  '↑ Pré-carga → recruta reserva contrátil (Lei de Frank-Starling)',
                  'VM com pressão positiva: ↑ pressão pleural e ↓ pressão vascular pulmonar transmural',
                  'Consequência: ↑ pós-carga VD, aumenta zonas de West 1 ou 2',
                ],
                highlight: 'Monitorar VS, DC e PAM ao ajustar parâmetros ventilatórios. PEEP elevada + hipovolemia = risco.',
              },
            ],
          },
          {
            id: 'M2-T11-slides-p01',
            type: 'slides',
            title: 'P0.1 — Drive Respiratório',
            slides: [
              {
                title: 'P0.1 — Pressão de Oclusão (100ms)',
                bullets: [
                  'Pressão de oclusão medida em 0,1 s após início do esforço inspiratório contra VA ocluída',
                  'Avalia atividade do centro respiratório → diretamente relacionada ao estímulo neural',
                  'Boa correlação com trabalho da respiração',
                  'Valores de referência: 2 a 4 cmH₂O',
                  'Normal/adulto saudável: 0,5 − 1,5 cmH₂O (~1 cmH₂O)',
                ],
              },
              {
                title: 'Interpretação do P0.1',
                bullets: [
                  '< 2 cmH₂O: drive diminuído — centro respiratório hipoestimulado',
                  '> 4 cmH₂O: drive aumentado — risco de fadiga e falha no desmame',
                  '> 3,5 cmH₂O: SUB-ASSISTÊNCIA — esforço excessivo, ↑ suporte',
                  '< 1,6 cmH₂O: SOBRE-ASSISTÊNCIA — esforço insuficiente, ↓ suporte',
                  'Início contração do ECMT: associado a P0.1 > 2,9 cmH₂O',
                ],
                highlight: 'P0.1 é não-invasivo, reprodutível e preditor de sucesso no desmame (< 4 cmH₂O).',
              },
            ],
          },
          {
            id: 'M2-T11-slides-psili',
            type: 'slides',
            title: 'P-SILI — Lesão Autoinfligida',
            slides: [
              {
                title: 'P-SILI — Patient Self-Inflicted Lung Injury',
                bullets: [
                  'Lesão pulmonar causada pelo esforço respiratório excessivo do próprio paciente durante VM',
                  '4 mecanismos principais:',
                  '1. Pressão transpulmonar aumentada → hiperdistensão regional',
                  '2. Duplo disparo + Pendelluft → volutrauma por empilhamento aéreo',
                  '3. Pressão pleural negativa → extravasamento capilar → edema pulmonar',
                  '4. VIDD (miotrauma diafragmático) → fraqueza muscular → dificulta desmame',
                ],
                highlight: 'Ciclo vicioso: esforço excessivo → lesão → piora oxigenação → ↑ dependência de VM.',
              },
              {
                title: 'Prevenção da P-SILI',
                bullets: [
                  'Monitorar esforço: P0.1, Pmusc, ΔPes, swing de pressão',
                  'Ajustar PS/PEEP: evitar sub-assistência (esforço excessivo)',
                  'Detectar assincronia: duplo disparo, reverse triggering',
                  'Sedação apropriada: controlar drive respiratório quando necessário',
                  'Ventilação protetora: VC baixo, Platô < 30, ΔP < 15',
                  'Bloqueio neuromuscular: SDRA grave com assincronia refratária',
                ],
              },
            ],
          },
          {
            id: 'M2-T11-slides-vili',
            type: 'slides',
            title: 'VILI — Lesão Induzida pelo Ventilador',
            slides: [
              {
                title: '6 Mecanismos da VILI',
                bullets: [
                  '1. Barotrauma: altas pressões → ruptura espaços aéreos → pneumotórax',
                  '2. Volutrauma: VC alto → hiperdistensão alveolar (mais lesivo que pressão isolada)',
                  '3. Atelectrauma: VM em baixos volumes → abertura/fechamento cíclicos de alvéolos',
                  '4. Biotrauma: forças biofísicas → mediadores inflamatórios → lesão sistêmica (SIRS)',
                  '5. Fratura por fadiga: altas FR → microfraturas progressivas no parênquima',
                  '6. TI aumentado: piora V/Q, ↓ complacência, ↑ edema pulmonar',
                ],
              },
              {
                title: 'Ventilação Protetora — Prevenindo VILI',
                bullets: [
                  'VC: 6 mL/kg peso predito',
                  'Platô: < 30 cmH₂O',
                  'ΔP (Driving Pressure): < 15 cmH₂O',
                  'PEEP: individualizada (ARDSnet ou decremental)',
                  'FiO₂: menor possível (SpO₂ 88−95%)',
                ],
                highlight: 'VILI é prevenível. Driving Pressure é o melhor preditor de mortalidade em SDRA.',
              },
              {
                title: 'Stress e Strain',
                bullets: [
                  'Stress (tensão mecânica): distribuição de forças por unidade de área de pulmão',
                  'Strain (deformação): estiramento em relação ao estado de relaxamento (ΔV / V basal)',
                  'Deformação excessiva → morte celular',
                  'Pulmões doentes (SDRA): expansão heterogênea → concentração regional de forças',
                  'VILI disparada por: tensões elevadas globais OU tensões locais pela heterogeneidade',
                ],
              },
            ],
          },
          {
            id: 'M2-T11-slides-esforco',
            type: 'slides',
            title: 'Esforço Muscular Respiratório',
            slides: [
              {
                title: 'Pmusc, Pdi, Pes — Medidas de Esforço',
                bullets: [
                  'Pmusc: pressão dos músculos respiratórios = 0,75 × Pocc',
                  'Normal: 3−15 cmH₂O | > 15: excessivo | < 3−5: insuficiente',
                  'Pdi (transdiafragmática): Pdi = Pga − Pes (requer 2 cateteres)',
                  'ΔPes (esofágica): monitoramento da interação paciente-ventilador',
                  'Normal: −2 a −8 cmH₂O | < −8 a −12: excessivo | > −2 a −3: insuficiente',
                ],
              },
              {
                title: 'TFdi e Pocc',
                bullets: [
                  'TFdi (Thickening Fraction): fração de espessamento diafragmático por ultrassom',
                  'Método não invasivo, à beira do leito',
                  '< 15%: esforço insuficiente / disfunção diafragmática | > 15%: normal',
                  'Pocc (pressão de oclusão): deflexão de pressão negativa durante oclusão expiratória',
                  'Pmusc ≈ 0,75 × Pocc — desmascara o esforço da musculatura respiratória',
                ],
                highlight: 'Objetivo: detectar esforço excessivo (risco P-SILI) ou insuficiente (risco VIDD).',
              },
            ],
          },
          {
            id: 'M2-T11-slides-parametros',
            type: 'slides',
            title: 'Parâmetros Ventilatórios — VMI',
            slides: [
              {
                title: 'Parâmetros de Entrada',
                bullets: [
                  'FiO₂: fração inspirada de O₂ (21% a 100%)',
                  'PEEP: pressão expiratória final positiva (0 a 20 cmH₂O típico)',
                  'FR: frequência respiratória (6−30 rpm)',
                  'Sensibilidade (Trigger): pressão (−0,5 a −2 cmH₂O) ou fluxo (2−4 L/min)',
                  'PI: pressão inspiratória (determinada pela complacência)',
                  'TI: tempo inspiratório (0,8 a 1,2 s)',
                ],
              },
              {
                title: 'Parâmetros de Saída e Derivados',
                bullets: [
                  'VC: volume corrente (450−500 mL, 6−8 mL/kg)',
                  'Fluxo: velocidade do ar na via aérea (40−60 L/min)',
                  'VM (volume minuto): VC × FR (5−8 L/min)',
                  'Drive respiratório: comando cerebral à musculatura respiratória',
                  'Auto-PEEP (intrínseca): pressão patológica por ar aprisionado (DPOC, asma)',
                  'PEEP extrínseca: pressão positiva gerada pelo ventilador no final da expiração',
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'M2-T12',
        title: 'Assincronias Paciente-Ventilador',
        blocks: [
          {
            id: 'M2-T12-slides-intro',
            type: 'slides',
            title: 'O que são Assincronias?',
            slides: [
              {
                title: 'Assincronia Paciente-Ventilador',
                bullets: [
                  'Incoordenação entre esforços/necessidades do paciente e o suporte do ventilador',
                  'Prevalência: 25-80% dos pacientes ventilados mecanicamente',
                  'Consequências: ↑ trabalho respiratório, desconforto, maior tempo de VM',
                  'Risco de lesão pulmonar (VILI/P-SILI) e maior uso de sedação',
                  'Detecção: análise de curvas de pressão, fluxo e volume',
                ],
                highlight: 'Assincronias são frequentes e subdiagnosticadas — monitorização contínua é essencial.',
              },
            ],
          },
          // ═══ DISPARO INEFICAZ ═══
          {
            id: 'M2-T12-slides-ineffective',
            type: 'slides',
            title: 'Disparo Ineficaz',
            slides: [
              {
                title: 'Disparo Ineficaz',
                bullets: [
                  'Esforço do paciente NÃO inicia ciclo ventilatório',
                  'Na curva: deflexão negativa na pressão SEM fluxo correspondente',
                  'Fatores ventilador: mau ajuste de sensibilidade, TI prolongado',
                  'Fatores paciente: ↑ FR muscular, depleção VC, hiperinsuflação (auto-PEEP)',
                  'Correção: ajustar sensibilidade, ↓ TI, titular PEEP externa < auto-PEEP, ↓ PS no PSV',
                ],
              },
            ],
          },
          {
            id: 'M2-T12-sim-ineffective',
            type: 'simulation',
            title: 'Curva — Disparo Ineficaz',
            simulationId: 'async-ineffective',
            description: 'Esforço do paciente sem ciclo — deflexão na pressão sem fluxo.',
          },
          // ═══ DUPLO DISPARO ═══
          {
            id: 'M2-T12-slides-double',
            type: 'slides',
            title: 'Duplo Disparo',
            slides: [
              {
                title: 'Duplo Disparo',
                bullets: [
                  'Dois ciclos ventilatórios consecutivos com intervalo muito curto',
                  'Segundo ciclo antes da expiração completa do primeiro → empilhamento aéreo',
                  'Fatores ventilador: TI muito curto vs tempo neural, VC baixo em VCV',
                  'Fator paciente: alto drive neural',
                  'Correção: ↑ TI (VCV/PCV) ou ↓ limiar de ciclagem (PSV), sedação em SDRA grave, PCV (volume variável)',
                ],
                highlight: 'Duplo disparo → empilhamento aéreo (air stacking) → volutrauma',
              },
            ],
          },
          {
            id: 'M2-T12-sim-double',
            type: 'simulation',
            title: 'Curva — Duplo Disparo',
            simulationId: 'async-double',
            description: 'Dois ciclos consecutivos com empilhamento de volume (air stacking).',
          },
          // ═══ DISPARO REVERSO ═══
          {
            id: 'M2-T12-slides-reverse',
            type: 'slides',
            title: 'Disparo Reverso',
            slides: [
              {
                title: 'Disparo Reverso',
                bullets: [
                  'Contração muscular que ocorre DURANTE a expiração, como resposta reflexa à insuflação passiva',
                  'Reflexo induzido pela distensão pulmonar',
                  'Correção: ↓ Ti, ↓ FR, ↓ VC (minimizar distensão)',
                  'Diminuir sedação para permitir respirações espontâneas',
                  'BNM em casos graves de SDRA',
                ],
              },
            ],
          },
          {
            id: 'M2-T12-sim-reverse',
            type: 'simulation',
            title: 'Curva — Disparo Reverso',
            simulationId: 'async-reverse',
            description: 'Contração reflexa durante a fase expiratória — perturbação no fluxo.',
          },
          // ═══ AUTODISPARO ═══
          {
            id: 'M2-T12-slides-auto',
            type: 'slides',
            title: 'Autodisparo',
            slides: [
              {
                title: 'Autodisparo',
                bullets: [
                  'Ventilador inicia ciclo SEM esforço do paciente',
                  'Causas: sensibilidade excessiva, vazamento no sistema, água no circuito',
                  'Fator paciente: oscilações de pressão/fluxo por batimentos cardíacos',
                  'Correção: otimizar sensibilidade, corrigir vazamentos, remover condensados',
                ],
              },
            ],
          },
          {
            id: 'M2-T12-sim-auto',
            type: 'simulation',
            title: 'Curva — Autodisparo',
            simulationId: 'async-auto',
            description: 'Ciclo fantasma disparado por oscilação cardíaca — sem esforço real.',
          },
          // ═══ CICLAGEM PREMATURA ═══
          {
            id: 'M2-T12-slides-premature',
            type: 'slides',
            title: 'Ciclagem Prematura',
            slides: [
              {
                title: 'Ciclagem Prematura',
                bullets: [
                  'TI do ventilador < TI neural do paciente — ventilador cicla antes',
                  'Paciente continua esforço inspiratório após início da expiração',
                  'Padrão restritivo (fibrose pulmonar) em PSV',
                  'VCV: ↓ fluxo para ↑ TI, ↑ VC ou pausa inspiratória',
                  'PCV: ↑ TI',
                  'PSV: ↓ % de ciclagem ou ↑ PS ou ↑ Rise Time',
                ],
              },
            ],
          },
          {
            id: 'M2-T12-sim-premature',
            type: 'simulation',
            title: 'Curva — Ciclagem Prematura',
            simulationId: 'async-premature',
            description: 'TI curto — esforço inspiratório residual na fase expiratória.',
          },
          // ═══ CICLAGEM TARDIA ═══
          {
            id: 'M2-T12-slides-delayed',
            type: 'slides',
            title: 'Ciclagem Tardia',
            slides: [
              {
                title: 'Ciclagem Tardia',
                bullets: [
                  'TI do ventilador > TI neural — ventilador demora a ciclar',
                  'Paciente tenta expirar enquanto ventilador ainda insufla',
                  'Padrão obstrutivo (DPOC) em PSV — overshoot e fluxo excessivo',
                  'VCV: ↑ fluxo inspiratório',
                  'PCV: ↓ TI',
                  'PSV: ↑ % de ciclagem, ↓ PS, ↑ ou ↓ Rise Time',
                ],
                highlight: 'Ciclagem tardia: PCV/PSV → ↓ PC ou ↓ PS ou ↑ Rise Time para reduzir fluxo.',
              },
            ],
          },
          {
            id: 'M2-T12-sim-delayed',
            type: 'simulation',
            title: 'Curva — Ciclagem Tardia',
            simulationId: 'async-delayed',
            description: 'TI prolongado — paciente tentando expirar durante inspiração mecânica.',
          },
          // ═══ FLUXO INSUFICIENTE ═══
          {
            id: 'M2-T12-slides-flowstarve',
            type: 'slides',
            title: 'Fluxo Insuficiente (Flow Starvation)',
            slides: [
              {
                title: 'Fluxo Insuficiente (Flow Starvation)',
                bullets: [
                  'Demanda ventilatória > fluxo ofertado pelo ventilador',
                  'Curva de pressão com CONCAVIDADE (scooping) — assinatura clássica',
                  'VCV: fluxo ajustado muito baixo',
                  'PCV/PSV: pressão muito baixa ou Rise Time muito longo',
                  'Correção VCV: ↑ fluxo inspiratório ou mudar para PCV/PSV (fluxo livre)',
                  'Correção PCV/PSV: ↓ Rise Time e/ou ↑ pressões',
                  'Tratar causa: dor, acidose, ansiedade, febre → ↑ demanda',
                ],
                highlight: 'Concavidade na curva de pressão (scooping) = fluxo insuficiente. Assinatura patognomônica.',
              },
            ],
          },
          {
            id: 'M2-T12-sim-flowstarve',
            type: 'simulation',
            title: 'Curva — Fluxo Insuficiente',
            simulationId: 'async-flow-starve',
            description: 'Concavidade (scooping) na curva de pressão — demanda > oferta.',
          },
          // ═══ FLUXO EXCESSIVO ═══
          {
            id: 'M2-T12-slides-flowexcess',
            type: 'slides',
            title: 'Fluxo Excessivo',
            slides: [
              {
                title: 'Fluxo Excessivo',
                bullets: [
                  'Fluxo/pressão aplicado excessivamente alto',
                  'Overshoot de pressão no início da inspiração',
                  'VCV: fluxo ajustado muito alto',
                  'PCV/PSV: pressão muito alta ou Rise Time muito curto',
                  'Correção VCV: ↓ fluxo inspiratório',
                  'Correção PCV/PSV: ↓ pressão, ↑ Rise Time',
                ],
              },
            ],
          },
          {
            id: 'M2-T12-sim-flowexcess',
            type: 'simulation',
            title: 'Curva — Fluxo Excessivo',
            simulationId: 'async-flow-excess',
            description: 'Overshoot de pressão no início — fluxo/pressão alto demais.',
          },
          // ═══ IMPACTO CLÍNICO ═══
          {
            id: 'M2-T12-slides-impacto',
            type: 'slides',
            title: 'Impacto Clínico e Manejo',
            slides: [
              {
                title: 'Impacto Clínico das Assincronias',
                bullets: [
                  '↑ Trabalho respiratório → fadiga muscular',
                  'Desconforto, agitação → maior necessidade de sedação',
                  'Maior tempo de VM → dificulta desmame',
                  'Lesão pulmonar (VILI/P-SILI) → barotrauma, volutrauma',
                  'Disfunção hemodinâmica → alteração PIT, retorno venoso, DC',
                ],
              },
              {
                title: 'Detecção e Monitorização',
                bullets: [
                  'Análise de curvas ventilatórias: pressão × fluxo × volume × tempo',
                  'Inspeção visual do paciente e do ventilador',
                  'Pressão esofágica (Pes): medida direta do esforço',
                  'EAdi (atividade elétrica do diafragma): NAVA',
                  'Ultrassonografia diafragmática: função e movimento',
                ],
              },
              {
                title: 'Estratégia Geral de Manejo',
                bullets: [
                  '1. Identificação precoce: monitorização contínua + vigilância clínica',
                  '2. Ajuste de parâmetros: sensibilidade, fluxo, TI, ciclagem',
                  '3. Tratar causa base: dor, febre, ansiedade, acidose, auto-PEEP',
                  '4. Mudança de modo se necessário: PAV, NAVA, modos adaptativos',
                ],
                highlight: 'Assincronias são tratáveis: identificar tipo → corrigir parâmetros → tratar causa base.',
              },
            ],
          },
          // ═══ VISÃO GERAL (todos os tipos) ═══
          {
            id: 'M2-T12-sim-all',
            type: 'simulation',
            title: 'Todas as Assincronias — Seletor Completo',
            simulationId: 'respiratory-vmi-asynchrony',
            description: 'Compare todos os 8 tipos de assincronia com seletor de tipos.',
          },
        ],
      },
      {
        id: 'M2-T13',
        title: 'Modalidades & Análise Gráfica',
        blocks: [
          {
            id: 'M2-T13-slides-classificacao',
            type: 'slides',
            title: 'Classificação dos Modos Ventilatórios',
            slides: [
              {
                title: 'Modos Controlados, Assistidos e Mistos',
                bullets: [
                  'Controlados: ventilador controla tudo (VCV, PCV) — paciente passivo',
                  'Assistidos: paciente dispara, ventilador entrega suporte (A/C, PSV)',
                  'Mistos: ciclos mandatórios + respirações espontâneas (APRV, híbridos)',
                ],
              },
              {
                title: 'Regra de Ouro do Disparo',
                bullets: [
                  'Paciente PASSIVO (sedado/curarizado): modo CONTROLADO → disparo por TEMPO (JT)',
                  'Paciente ATIVO (drive respiratório): modo ASSISTIDO → disparo por SENSIBILIDADE',
                  'Sensibilidade: Fluxo (2-4 L/min) ou Pressão (-0,5 a -2 cmH₂O)',
                ],
                highlight: 'Paciente ativo na VM? Disparo = Sensibilidade. Passivo? Disparo = Tempo.',
              },
            ],
          },
          {
            id: 'M2-T13-slides-vcv',
            type: 'slides',
            title: 'VCV — Volume Controlado',
            slides: [
              {
                title: 'VCV — Características',
                bullets: [
                  'Volume Corrente é a variável CONTROLADA — entrega VC programado',
                  'Fluxo CONSTANTE (onda quadrada) durante inspiração',
                  'Pressão VARIÁVEL — depende da complacência e resistência do paciente',
                  'Disparo: Tempo ou Fluxo ou Pressão | Ciclagem: Volume ou Tempo',
                  'Parâmetros: VC (6-8 mL/kg), FR, Fluxo (40-60 L/min), PEEP, Sensibilidade, FiO₂',
                ],
                highlight: 'VCV: Volume garantido + Fluxo quadrado → Pressão varia. Risco de barotrauma se complacência cai.',
              },
              {
                title: 'Análise Gráfica VCV',
                bullets: [
                  'Pressão × Tempo: ascensão progressiva até Pico, pausa para Platô',
                  'Stress Index: SI=1 linear (ideal), SI>1 côncava (sobredistensão), SI<1 convexa (recrutamento)',
                  'Fluxo × Tempo: onda QUADRADA constante (inspiração), exponencial (expiração)',
                  'Volume × Tempo: rampa ascendente LINEAR',
                  'Ppico = Resistência + Complacência | Pplatô = Complacência apenas',
                ],
              },
            ],
          },
          {
            id: 'M2-T13-sim-vcv-analysis',
            type: 'simulation',
            title: 'VCV Análise Gráfica Completa — Pressão, Fluxo e Volume',
            simulationId: 'respiratory-vmi-vcv-analysis',
            description: 'Curvas VCV com 8 pontos legendados (PEEP, Disparo, Resistivo, SI, Pico, Platô, Ciclagem, ΔP). Modos: Com/Sem Pausa, Stress Index (SI=1, >1, <1) e P1/P2 (Normal vs Pendelluft).',
          },
          {
            id: 'M2-T13-slides-pcv',
            type: 'slides',
            title: 'PCV — Pressão Controlada',
            slides: [
              {
                title: 'PCV — Características',
                bullets: [
                  'Pressão é a variável CONTROLADA — mantém pressão programada',
                  'Fluxo DESACELERANTE — pico alto que cai progressivamente',
                  'Volume VARIÁVEL — depende da complacência e resistência',
                  'Disparo: Tempo (CMV) ou Sensibilidade (ACV) | Ciclagem: sempre por TEMPO (Tinsp)',
                  'Parâmetros: PC (~15 cmH₂O acima PEEP), FR, Tinsp, PEEP, Rise Time, Sensibilidade, FiO₂',
                ],
                highlight: 'PCV: Pressão limitada + Fluxo desacelerante → Volume varia. ↓ Risco barotrauma, volume não garantido.',
              },
              {
                title: 'Rise Time em PCV',
                bullets: [
                  'Rise Time (RT): tempo de subida até atingir a pressão determinada',
                  'RT BAIXO → fluxo ALTO → Ti BAIXO → ↑ VC em PCV',
                  'RT ALTO → fluxo BAIXO → Ti ALTO',
                  'Rise Time NÃO altera o Tinsp em PCV',
                  'Cuidado: Pinsp é diferente de Pressão Controlada (PC) — PC = Pinsp - PEEP',
                ],
              },
            ],
          },
          {
            id: 'M2-T13-sim-pcv-analysis',
            type: 'simulation',
            title: 'PCV Análise Gráfica — Pressão, Fluxo e Volume',
            simulationId: 'respiratory-vmi-pcv-analysis',
            description: 'Curvas PCV com pontos legendados. Pressão quadrada, fluxo desacelerante, volume curvilíneo. CC vs A/C.',
          },
          {
            id: 'M2-T13-slides-psv',
            type: 'slides',
            title: 'PSV — Pressão de Suporte',
            slides: [
              {
                title: 'PSV — Características',
                bullets: [
                  'Modo 100% ESPONTÂNEO — paciente dispara e controla FR e Ti',
                  'Ventilador fornece pressão de suporte (PS) para auxiliar esforço',
                  'Fluxo desacelerante — cicla quando fluxo cai a 25% do pico',
                  'Disparo: sempre por SENSIBILIDADE | Ciclagem: sempre por FLUXO',
                  'Ideal para desmame — requer drive respiratório preservado',
                ],
              },
              {
                title: 'Ciclagem em PSV (% do Fluxo de Pico)',
                bullets: [
                  'Quanto MAIOR o % de ciclagem → MENOR o Ti (cicla mais cedo)',
                  'Quanto MENOR o % de ciclagem → MAIOR o Ti (cicla mais tarde)',
                  '10%: ciclagem tardia → Ti aumentado → risco de assincronia',
                  '25%: ciclagem padrão → Ti normal (recomendado)',
                  '40%: ciclagem precoce → Ti diminuído → risco de assincronia',
                ],
                highlight: 'Padrão típico: 25% do fluxo de pico inspiratório.',
              },
            ],
          },
          {
            id: 'M2-T13-sim-psv-analysis',
            type: 'simulation',
            title: 'PSV Análise Gráfica — Pressão, Fluxo e Volume',
            simulationId: 'respiratory-vmi-psv-analysis',
            description: 'Curvas PSV com pontos legendados. 100% espontânea. Ciclagem por fluxo (10%, 25%, 40%). Veja como % altera Ti.',
          },
          {
            id: 'M2-T13-slides-loops',
            type: 'slides',
            title: 'Loops P-V e Interpretação',
            slides: [
              {
                title: 'Alça Pressão-Volume (P-V)',
                bullets: [
                  'Gráfico que relaciona Pressão (X) com Volume (Y) durante um ciclo completo',
                  'LIP (Lower Inflection Point): ponto de recrutamento alveolar',
                  'UIP (Upper Inflection Point): início da hiperdistensão',
                  'Complacência: inclinação da curva (ΔV/ΔP)',
                  'Histerese: diferença entre curvas inspiratória e expiratória',
                ],
              },
              {
                title: 'Aplicação Clínica dos Loops',
                bullets: [
                  'PEEP ideal: acima do LIP (manter recrutamento)',
                  'Pplatô seguro: abaixo do UIP (evitar hiperdistensão)',
                  '↓ Complacência: curva achatada (SDRA, fibrose, edema)',
                  '↑ Complacência: curva inclinada (DPOC, enfisema)',
                  'Driving Pressure < 15 cmH₂O: melhor preditor de mortalidade em SDRA',
                ],
                highlight: 'PEEP acima do LIP + Pplatô abaixo do UIP = ventilação protetora otimizada.',
              },
            ],
          },
          {
            id: 'M2-T13-sim-loops',
            type: 'simulation',
            title: 'Loops P×V e F×V — Análise Interativa',
            simulationId: 'respiratory-vmi-loops',
            description: 'Loop P×V com histerese e WOB. Loop F×V (Normal / Restritivo / Obstrutivo) com auto-PEEP.',
          },
          {
            id: 'M2-T13-sim-peep-test',
            type: 'simulation',
            title: 'PEEP Test — Limitação de Fluxo Expiratório',
            simulationId: 'respiratory-peep-test',
            description: 'Reduza PEEP em 3 cmH₂O: sem limitação (fluxo aumenta) vs com limitação (fluxo não muda)',
          },
          {
            id: 'M2-T13-slides-formulas',
            type: 'slides',
            title: 'Cálculos e Fórmulas',
            slides: [
              {
                title: 'Parâmetros Derivados das Curvas',
                bullets: [
                  'Cest = VC / (Pplatô − PEEP) | Normal: 50-100 mL/cmH₂O',
                  'RAW = (Ppico − Pplatô) / Fluxo | Normal: 5-10 cmH₂O/L/s',
                  'ΔP = Pplatô − PEEP | Meta: < 15 cmH₂O (ideal < 12)',
                  'VM = VC × FR | Normal: 5-10 L/min (determina eliminação de CO₂)',
                ],
              },
              {
                title: 'Escolha do Modo Ventilatório',
                bullets: [
                  'Fase aguda / SDRA grave: VCV ou PCV — controle total, VC 6 mL/kg, Pplatô < 30',
                  'Fase de melhora: A/C ou SIMV+PSV — paciente desperta, redução gradual FR',
                  'Desmame: PSV — 100% espontâneo, PS progressivamente ↓, meta PS 5-8 cmH₂O',
                  'TRE (Teste Respiratório Espontâneo): avaliar capacidade de extubação',
                ],
                highlight: 'Ventilação protetora: VC 6 mL/kg, Pplatô < 30, ΔP < 15, PEEP individualizada.',
              },
            ],
          },
        ],
      },
      {
        id: 'M2-T14',
        title: 'Desmame Ventilatório',
        blocks: [
          {
            id: 'M2-T14-slides-classificacao',
            type: 'slides',
            title: 'Classificação dos Tipos de Desmame',
            slides: [
              {
                title: 'O que é Desmame Ventilatório',
                bullets: [
                  'Processo de transição da ventilação mecânica para a respiração espontânea',
                  'Classificado em 3 tipos com base no número de tentativas e tempo necessário',
                  'Objetivo: retirar o suporte ventilatório o mais rápido e seguro possível',
                ],
                highlight: 'O desmame pode representar até 40-50% do tempo total de VM. Abreviá-lo reduz complicações.',
              },
              {
                title: 'Desmame SIMPLES',
                bullets: [
                  'Sucesso no 1º TRE (Teste de Respiração Espontânea)',
                  'Paciente permanece 48h fora da VM sem necessidade de reintubação',
                  'Prevalência: ~70% dos casos',
                  'Geralmente não necessitam de preditores complexos',
                ],
                highlight: '70% dos pacientes desmamam no primeiro TRE — a busca ativa diária é essencial.',
              },
              {
                title: 'Desmame DIFÍCIL',
                bullets: [
                  'Falha no 1º TRE',
                  'Necessita de até 3 TREs ou ≤ 7 dias após o primeiro TRE',
                  'Prevalência: ~20% dos casos',
                  'Requer avaliação cuidadosa das causas da falha',
                ],
              },
              {
                title: 'Desmame PROLONGADO',
                bullets: [
                  'Falha em > 3 TREs consecutivos',
                  'Ou necessidade de > 7 dias de desmame após o primeiro TRE',
                  'Prevalência: ~10% dos casos',
                  'Pior prognóstico, maior morbidade',
                ],
                highlight: 'Simples 70% · Difícil 20% · Prolongado 10% — quanto mais prolongado, pior o desfecho.',
              },
            ],
          },
          {
            id: 'M2-T14-slides-conceitos',
            type: 'slides',
            title: 'Conceitos Fundamentais do Desmame',
            slides: [
              {
                title: 'Busca Ativa Diária',
                bullets: [
                  'Triagem DIÁRIA identificando pacientes capazes de realizar o desmame',
                  'Avaliação sistemática dos critérios de elegibilidade em todos os pacientes ventilados',
                  'Deve ser realizada ao menos uma vez ao dia',
                  'Reduz tempo de VM e complicações associadas',
                ],
              },
              {
                title: 'Despertar Diário',
                bullets: [
                  'Interrupção diária da sedação para avaliação do nível de consciência',
                  'Permite avaliar a capacidade do paciente de manter drive respiratório',
                  'Avalia proteção de vias aéreas (tosse, deglutição)',
                  'Associado à busca ativa: SAT (Spontaneous Awakening Trial) + SBT',
                ],
                highlight: 'SAT + SBT combinados reduzem tempo de VM e mortalidade.',
              },
              {
                title: 'Sucesso de Desmame vs. Sucesso de Extubação',
                bullets: [
                  'Sucesso de Desmame: paciente tolera o TRE (ainda conectado ao ventilador)',
                  'Sucesso de Extubação: paciente extubado (ou desconectado se TQT) e NÃO reintubado em 48h',
                  'TOT: prótese endolaríngea retirada com sucesso',
                  'TQT: tolerou desconexão do ventilador por 48h',
                ],
                highlight: 'Sucesso no TRE ≠ sucesso na extubação. A avaliação de via aérea é etapa separada.',
              },
            ],
          },
          {
            id: 'M2-T14-slides-elegibilidade',
            type: 'slides',
            title: 'Critérios de Elegibilidade para Desmame',
            slides: [
              {
                title: 'Busca Ativa — Critérios Obrigatórios',
                bullets: [
                  'O paciente deve atender a TODOS os critérios para ser elegível ao TRE',
                  'Realizar a busca ativa DIÁRIA incluindo todos os seguintes',
                  'A ausência de qualquer critério adia o TRE',
                ],
                highlight: 'TODOS os critérios devem ser atendidos simultaneamente.',
              },
              {
                title: 'Oxigenação e Hemodinâmica',
                bullets: [
                  'Oxigenação adequada: PaO₂ ≥ 60 mmHg, FiO₂ ≤ 0,4 (40%), PEEP ≤ 5-8 cmH₂O',
                  'Estabilidade hemodinâmica: boa perfusão tecidual',
                  'Sem ou com doses baixas de vasopressores',
                  'Ausência de ICC descompensada',
                  'Ausência de arritmias graves',
                ],
              },
              {
                title: 'Causa, Drive e Balanço',
                bullets: [
                  'Resolução da causa: falência respiratória resolvida ou controlada',
                  'Drive respiratório: paciente capaz de iniciar esforços inspiratórios espontâneos',
                  'Balanço hídrico: zerado ou negativo nas últimas 24h',
                  'Equilíbrio metabólico: ácido-básico e eletrolítico normais',
                ],
                highlight: 'Contraindicação relativa: adiar extubação quando houver transporte para exames programado.',
              },
            ],
          },
          {
            id: 'M2-T14-slides-tre',
            type: 'slides',
            title: 'TRE — Teste de Respiração Espontânea',
            slides: [
              {
                title: 'O que é o TRE?',
                bullets: [
                  'Avalia a capacidade do paciente de manter ventilação espontânea adequada',
                  'Sem o suporte total do ventilador',
                  'Existem 5 formas principais de realizar o TRE',
                  'Duração: 30-120 minutos (estudos recentes: 30 min podem ser suficientes)',
                ],
              },
              {
                title: 'Método 1: Tubo T',
                bullets: [
                  'Desconexão total do ventilador',
                  'Paciente conectado a fonte de O₂ umidificado via TOT ou TQT',
                  'Simula condição real pós-extubação',
                  'Desvantagem: sem monitorização contínua, não compensa resistência do TOT',
                ],
              },
              {
                title: 'Método 2: PSV 5-8 cmH₂O + PEEP 5',
                bullets: [
                  'Pressão de suporte mínima — método MAIS UTILIZADO atualmente',
                  'PS 5-8 cmH₂O compensa resistência do TOT',
                  'PEEP 5 cmH₂O mantém recrutamento alveolar',
                  'Monitorização contínua pelo ventilador — mais seguro',
                ],
                highlight: 'PSV é o método preferido: compensa o TOT, monitora continuamente e é mais seguro.',
              },
              {
                title: 'Método 3: CPAP + ATC',
                bullets: [
                  'ATC = Automatic Tube Compensation',
                  'Mede pressão no início e final do tubo a cada ciclo',
                  'Calcula e compensa a resistência automaticamente',
                  'Mais fisiológico — compensa variações (secreções, posição do TOT)',
                  'Requer ventiladores modernos com essa tecnologia',
                ],
              },
              {
                title: 'Método 4: PS 0 + PEEP 5 (CPAP puro)',
                bullets: [
                  'PS = 0 (sem suporte pressórico na inspiração)',
                  'PEEP = 5 cmH₂O mantém recrutamento',
                  'Mais exigente que PSV (não compensa resistência do TOT)',
                  'Equivale ao CPAP',
                ],
              },
              {
                title: 'Método 5: PS 0 + PEEP 0 (ZEEP)',
                bullets: [
                  'Teste MAIS EXIGENTE — sem qualquer suporte',
                  'Apenas Bias Flow (fluxo contínuo)',
                  'Risco de atelectasia e dessaturação',
                  'Raramente utilizado',
                ],
                highlight: 'Preferir métodos que mantenham ao menos PEEP 5 cmH₂O. ZEEP = maior risco.',
              },
            ],
          },
          {
            id: 'M2-T14-slides-criterios-tre',
            type: 'slides',
            title: 'Critérios de Sucesso e Falha do TRE',
            slides: [
              {
                title: 'Critérios de SUCESSO do TRE',
                bullets: [
                  'FR < 35 ipm',
                  'SpO₂ > 90%',
                  'FC < 140 bpm ou variação < 20%',
                  'PAS 90-180 mmHg',
                  'Sem sinais de desconforto respiratório',
                  'Sem sudorese, agitação ou alteração do nível de consciência',
                ],
                highlight: 'Manter observação contínua por 30-120 minutos. Sucesso = elegível para extubação.',
              },
              {
                title: 'Critérios de FALHA — Interromper TRE',
                bullets: [
                  'FR > 35 ipm por > 5 minutos',
                  'SpO₂ < 90%',
                  'FC > 140 bpm ou variação > 20%',
                  'Arritmias graves',
                  'PAS > 180 ou < 90 mmHg',
                  'Sinais de desconforto respiratório',
                  'Sudorese, agitação, alteração do nível de consciência',
                ],
                highlight: 'Na falha: retornar ao suporte anterior, investigar causa e reavaliar em 24h.',
              },
            ],
          },
          {
            id: 'M2-T14-slides-estrategias',
            type: 'slides',
            title: 'Estratégias para Otimizar o Desmame',
            slides: [
              {
                title: 'Protocolo de Desmame',
                bullets: [
                  '1. Busca ativa diária',
                  '2. Despertar diário (SAT)',
                  '3. Redução gradual do suporte ventilatório',
                  '4. TRE quando critérios atingidos',
                  '5. Extubação se sucesso no TRE',
                ],
              },
              {
                title: 'Preparo do Paciente',
                bullets: [
                  'Fisioterapia respiratória e motora',
                  'Mobilização precoce',
                  'Controle hídrico (balanço negativo)',
                  'Suporte nutricional adequado',
                  'Manejo da dor',
                ],
              },
              {
                title: 'Causas Comuns de Falha no Desmame',
                bullets: [
                  'Fraqueza muscular respiratória (VIDD — Ventilator-Induced Diaphragmatic Dysfunction)',
                  'Sobrecarga hídrica',
                  'Disfunção cardíaca (weaning-induced cardiac failure)',
                  'Broncoespasmo',
                  'Secreções excessivas',
                  'Delirium / agitação',
                ],
                highlight: 'Avaliação multidisciplinar: médico, fisio, enfermagem, nutrição, fono.',
              },
            ],
          },
          {
            id: 'M2-T14-slides-cuff-leak',
            type: 'slides',
            title: 'Cuff-Leak Test — Teste de Vazamento do Balonete',
            slides: [
              {
                title: 'O que é o Cuff-Leak Test?',
                bullets: [
                  'Avalia o risco de estridor pós-extubação por edema de laringe',
                  'Mede a diferença entre volume inspirado e expirado com o cuff desinsuflado',
                  'Realizado em modo VCV (volume controlado)',
                ],
              },
              {
                title: 'Como Realizar',
                bullets: [
                  '1. Aspirar secreções traqueais e orais',
                  '2. Ajustar ventilador para VCV',
                  '3. Com cuff inflado: registrar VCi e VCe (devem ser similares)',
                  '4. Desinsuflar o cuff',
                  '5. Registrar VCe durante 6 ciclos (VCe atinge platô após poucos ciclos)',
                  '6. Se VCe < VCi em > 10% → teste POSITIVO',
                ],
              },
              {
                title: 'Interpretação',
                bullets: [
                  'NEGATIVO (tem vazamento): diferença > 110 mL ou > 10%',
                  '→ BAIXA possibilidade de estridor pós-extubação',
                  'POSITIVO (não tem vazamento): diferença < 110 mL ou < 10%',
                  '→ PODEM desenvolver estridor pós-extubação',
                ],
                highlight: 'Sensibilidade 27% · Especificidade 88% · Alta especificidade: reconhece quem NÃO tem obstrução.',
              },
              {
                title: 'Fatores de Risco para Estridor',
                bullets: [
                  'Intubação traumática',
                  'VM > 6 dias',
                  'Tubo com calibre largo',
                  'Sexo feminino (pregas vocais mais finas, menos colágeno e ácido hialurônico)',
                  'Reintubação após extubação não planejada',
                ],
              },
              {
                title: 'Diferenças Anatômicas — Sexo Feminino',
                bullets: [
                  'Pregas vocais mais finas',
                  'Menor quantidade de colágeno nas pregas vocais',
                  'Menor quantidade de ácido hialurônico',
                  'Testosterona nos homens → músculos da laringe mais fortes',
                  'Colágeno e ácido hialurônico conferem maior resistência nos homens',
                ],
                highlight: 'Mulheres têm maior risco de estridor pós-extubação por características anatômicas das pregas vocais.',
              },
              {
                title: 'Limitações e Cuidados',
                bullets: [
                  'Baixa sensibilidade (27%) — pode não detectar todos os casos',
                  'Alta especificidade (88%) — útil para identificar quem NÃO terá estridor',
                  'Não é obrigatório para todos os pacientes',
                  'Risco: aspiração de secreção contaminada acima do cuff',
                  'Cuidado: aspirar secreções ANTES do teste',
                  'Inalação com adrenalina: recomendada como coadjuvante, baixa evidência',
                ],
              },
            ],
          },
          {
            id: 'M2-T14-sim-cuff-leak',
            type: 'simulation',
            title: 'Simulador Cuff-Leak Test',
            simulationId: 'respiratory-cuff-leak',
            description: 'Volume × Tempo com cuff insuflado vs desinsuflado. Teste Negativo (seguro) vs Positivo (risco de estridor).',
          },
        ],
      },
    ],
}
