export const ICU_REFERENCE_SYSTEMS = [
{
    "id": "cardiovascular",
    "name": "Sistema Cardiovascular",
    "icon": "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
    "color": "#f87171",
    "problems": [
      {
        "name": "C1.P1 — Hipoperfusão tecidual",
        "desc": "Crítico. PAM < alvo, extremidades frias, TEC > 3s, lactato elevado, oligúria, rebaixamento de consciência",
        "assess": ["Manter PAM ≥ alvo (≥ 65 mmHg), SpO₂ ≥ 92%, FR < 30", "Iniciar verticalização progressiva segura"],
        "interv": ["O₂ para SpO₂ 92-96% (Titular)", "Cabeceira elevada (30-60°) (Contínuo)", "Mobilização passiva + bomba muscular (Degrau 0)", "Sedestação no leito se PAM ≥ alvo (Degrau 1)", "PARADA: queda PAM + sintomas, tontura, sudorese, taquicardia sustentada"],
        "block": "❤️ BLOCO C1 — Choque e instabilidade hemodinâmica",
        "goals": ["Manter PAM ≥ alvo (≥ 65 mmHg), SpO₂ ≥ 92%, FR < 30", "Iniciar verticalização progressiva segura"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Oxigenoterapia para SpO₂ 92-96% (Titular)", "CNAF: fluxo 40-60 L/min se FR ≥ 28-30 (Se indicado)", "VNI conservadora: EPAP 5-8 cmH₂O, atenção ao retorno venoso (Se fadiga)", "Cabeceira elevada (30-60°) (Contínuo)", "Evitar decúbito totalmente horizontal prolongado (Preventivo)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização passiva + bomba muscular (Degrau 0)", "Sedestação no leito se PAM ≥ alvo (Degrau 1)", "Sedestação beira-leito (Degrau 2)", "Poltrona (Degrau 3)", "Ortostatismo curto (30-120s) (Degrau 4)", "PARADA: queda PAM + sintomas, tontura, sudorese, taquicardia sustentada (Critérios)"]}
        ]
      },
      {
        "name": "C1.P2 — Instabilidade hemodinâmica ao esforço/mudança postural",
        "desc": "Grave. Queda de PAM > 10-20 mmHg ao elevar cabeceira/sentar, taquicardia reacional, tontura, sudorese fria, palidez",
        "assess": ["Permitir mudanças posturais seguras"],
        "interv": ["Exercícios de bomba muscular em leito antes de verticalizar (Preparação)", "Elevação progressiva: 30° → 45° → 60° → 90° (Gradual 3-5 min/estágio)", "Monitorar PA a cada mudança (Vigilância)"],
        "block": "❤️ BLOCO C1 — Choque e instabilidade hemodinâmica",
        "goals": ["Permitir mudanças posturais seguras"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["Exercícios de bomba muscular em leito antes de verticalizar (Preparação)", "Elevação progressiva: 30° → 45° → 60° → 90° (Gradual 3-5 min/estágio)", "Monitorar PA a cada mudança (Vigilância)"]}
        ]
      },
      {
        "name": "C1.P3 — Aumento do trabalho respiratório e consumo de O₂",
        "desc": "Grave. FR > 28-30, uso de musculatura acessória, dispneia, taquicardia associada ao esforço respiratório",
        "assess": ["Reduzir trabalho respiratório e consumo metabólico"],
        "interv": ["CNAF prioritário: reduz FR e esforço, PEEP fisiológica ~3-5 cmH₂O (Tratamento principal)", "Evitar VNI/VM com PEEP alta (↓ retorno venoso) (Cautela)", "Posicionamento: sentado/cabeceira elevada (Terapêutico)"],
        "block": "❤️ BLOCO C1 — Choque e instabilidade hemodinâmica",
        "goals": ["Reduzir trabalho respiratório e consumo metabólico"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["CNAF prioritário: reduz FR e esforço, PEEP fisiológica ~3-5 cmH₂O (Tratamento principal)", "Evitar VNI/VM com PEEP alta (↓ retorno venoso) (Cautela)", "Posicionamento: sentado/cabeceira elevada (Terapêutico)"]}
        ]
      },
      {
        "name": "C1.P4 — Dependência de suporte ventilatório (O₂, CNAF, VNI ou VM)",
        "desc": "Grave. SpO₂ < alvo em ar ambiente, fadiga respiratória, necessidade de poupar musculatura",
        "assess": ["Reduzir suporte ventilatório gradualmente"],
        "interv": ["Titular O₂: menor suporte que mantém SpO₂ alvo (Gradual)", "CNAF conservador: menor fluxo eficaz (Ajuste fino)", "Evitar PEEP excessiva em cardiopata (Cautela)", "Desmame progressivo guiado por SpO₂ e trabalho respiratório"],
        "block": "❤️ BLOCO C1 — Choque e instabilidade hemodinâmica",
        "goals": ["Reduzir suporte ventilatório gradualmente"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Titular O₂: menor suporte que mantém SpO₂ alvo (Gradual)", "CNAF conservador: menor fluxo eficaz (Ajuste fino)", "Evitar PEEP excessiva em cardiopata (Cautela)"]},
          {"timeframe": "24-72h", "interv": ["Reduzir fluxo/FiO₂ progressivamente conforme tolerância (Desmame)", "Monitorar hemodinâmica ao reduzir suporte (Vigilância)"]}
        ]
      },
      {
        "name": "C1.P5 — Intolerância à mobilização / risco de colapso hemodinâmico",
        "desc": "Crítico. Instabilidade com pequenas mudanças de posição, síncope prévia, piora de perfusão ao esforço mínimo",
        "assess": ["Verticalizar com segurança hemodinâmica"],
        "interv": ["Aguardar PAM ≥ 65 mmHg estável antes de mobilizar (Pré-condição)", "Exercícios passivos em leito: bomba muscular, flexo-extensão MMII (Início)", "Elevação de cabeceira em degraus de 10-15° com pausa de 3-5 min (Progressivo)"],
        "block": "❤️ BLOCO C1 — Choque e instabilidade hemodinâmica",
        "goals": ["Verticalizar com segurança hemodinâmica"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Aguardar PAM ≥ 65 mmHg estável antes de mobilizar (Pré-condição)", "Exercícios passivos em leito: bomba muscular, flexo-extensão MMII (Início)", "Elevação de cabeceira em degraus de 10-15° com pausa de 3-5 min (Progressivo)", "PARADA: PAM < 55 ou queda > 20 mmHg com sintomas (Critério de parada)"]}
        ]
      },
      {
        "name": "C2.P1 — Congestão pulmonar / edema intersticial ou alveolar",
        "desc": "Crítico. Dispneia, ortopneia, crepitações difusas, RX com congestão/edema, SpO₂ reduzida, PaO₂/FiO₂ reduzida",
        "assess": ["Reduzir congestão", "Melhorar SpO₂ e mecânica ventilatória"],
        "interv": ["Posição sentada (90°) ou semi-Fowler (Imediato)", "O₂ suplementar titulado para SpO₂ 92-96%", "CNAF/VNI (CPAP 5-10 cmH₂O) se SpO₂ não melhora com O₂ convencional", "Exercícios respiratórios progressivos após estabilização"],
        "block": "💧 BLOCO C2 — Insuficiência cardíaca e edema agudo de pulmão",
        "goals": ["Reduzir congestão", "Melhorar SpO₂ e mecânica ventilatória"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Posição sentada (90°) ou semi-Fowler (Imediato)", "O₂ suplementar titulado para SpO₂ 92-96% (Titular)", "CNAF: fluxo 40-60 L/min se persistência de hipoxemia (Se indicado)", "VNI com CPAP 5-10 cmH₂O ou BiPAP se hipercapnia (Se necessário)"]},
          {"timeframe": "24-48h", "interv": ["Exercícios respiratórios: respiração diafragmática, expansão costal (Sessões)", "Monitorar SpO₂, FR e congestão (Contínuo)", "Mobilização progressiva conforme tolerância (Degraus)"]}
        ]
      },
      {
        "name": "C2.P2 — Aumento importante do trabalho respiratório",
        "desc": "Crítico. FR > 28-30 irpm, uso de musculatura acessória, tiragem/batimento de asa nasal, dispneia intensa (Borg ≥ 6)",
        "assess": ["Reduzir FR para < 25 irpm", "Reduzir uso de musculatura acessória"],
        "interv": ["Posição sentada (90°) (Imediato)", "VNI com CPAP ou BiPAP (Primeira linha para EAP)", "O₂ alto fluxo (Se aguardando VNI)", "Controle de ansiedade e conforto (Contínuo)"],
        "block": "💧 BLOCO C2 — Insuficiência cardíaca e edema agudo de pulmão",
        "goals": ["Reduzir FR para < 25 irpm", "Reduzir uso de musculatura acessória"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Posição sentada (90°) (Imediato)", "VNI: CPAP 5-10 cmH₂O (EAP) ou BiPAP IPAP 12-16/EPAP 5-8 se hipercapnia (Primeira linha)", "O₂ alto fluxo se VNI indisponível (Temporário)", "Controle de ansiedade e conforto (Contínuo)"]},
          {"timeframe": "24-48h", "interv": ["Desmame gradual do suporte (Progressivo)", "Monitorar sinais de fadiga muscular (Vigilância)"]}
        ]
      },
      {
        "name": "C2.P3 — Hipoxemia",
        "desc": "Grave. SpO₂ < 92% em ar ambiente ou O₂ baixo fluxo, PaO₂ < 60 mmHg",
        "assess": ["SpO₂ ≥ 92-96%"],
        "interv": ["O₂ titulado: cateter nasal → máscara simples → máscara com reservatório (Escalonar)", "CNAF se SpO₂ < 92% apesar de máscara com reservatório", "VNI se persistência de hipoxemia"],
        "block": "💧 BLOCO C2 — Insuficiência cardíaca e edema agudo de pulmão",
        "goals": ["SpO₂ ≥ 92-96%"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["O₂ titulado: cateter nasal → máscara simples → máscara com reservatório (Escalonar)", "CNAF se SpO₂ < 92% apesar de O₂ convencional (Se indicado)", "VNI se persistência de hipoxemia (Escalonar)"]},
          {"timeframe": "24-48h", "interv": ["Reduzir suporte progressivamente conforme melhora (Desmame)", "Posicionamento sentado para facilitar mecânica (Terapêutico)"]}
        ]
      },
      {
        "name": "C2.P4 — Baixa tolerância ao esforço / intolerância ao ortostatismo",
        "desc": "Moderado. Queda de SpO₂ ou aumento de FR/FC ao sentar/ficar em pé, dispneia desproporcional, fadiga precoce",
        "assess": ["Progredir mobilização com segurança"],
        "interv": ["Elevar cabeceira gradualmente: 30° → 45° → 60° → 90° (Progressivo)", "Sedestação assistida beira-leito (Degrau 2)", "Monitorar SpO₂, FC, PA e Borg ao mobilizar (Vigilância)"],
        "block": "💧 BLOCO C2 — Insuficiência cardíaca e edema agudo de pulmão",
        "goals": ["Progredir mobilização com segurança"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Elevar cabeceira gradualmente: 30° → 45° → 60° → 90° (Progressivo)", "Sedestação assistida beira-leito (Degrau 2)", "Ortostatismo curto com monitoração (Degrau 3)", "Monitorar SpO₂, FC, PA e Borg ao mobilizar (Vigilância)", "PARADA: SpO₂ < 88%, Borg ≥ 8, queda PA > 20 mmHg, arritmia (Critérios)"]}
        ]
      },
      {
        "name": "C2.P5 — Risco de fadiga respiratória e falência ventilatória",
        "desc": "Crítico. FR persistentemente > 30, uso intenso de musculatura acessória, taquicardia associada, queda de consciência",
        "assess": ["Prevenir fadiga", "Manter ventilação adequada"],
        "interv": ["Suporte ventilatório precoce: VNI ou VM (Urgente)", "Monitorar sinais de fadiga: FR, uso acessória, rebaixamento (Contínuo)", "Posição sentada, O₂ máximo enquanto prepara suporte (Imediato)"],
        "block": "💧 BLOCO C2 — Insuficiência cardíaca e edema agudo de pulmão",
        "goals": ["Prevenir fadiga", "Manter ventilação adequada"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Suporte ventilatório precoce: VNI ou VM se rápida deterioração (Urgente)", "Posição sentada, O₂ máximo enquanto prepara suporte (Imediato)", "Monitorar sinais de fadiga: FR, uso acessória, rebaixamento (Contínuo)", "Baixo limiar para intubação se piora (Vigilância)"]}
        ]
      },
      {
        "name": "C3.P1 — Taquiarritmias (FA/Flutter, TSV, TV não sustentada)",
        "desc": "Grave. FC persistentemente > 120-130 bpm, palpitações, dispneia, tontura, queda de PA, ECG com ritmo patológico",
        "assess": ["Controlar FC", "Mobilização segura quando FC controlada"],
        "interv": ["Repouso relativo durante taquiarritmia ativa (Imediato)", "O₂ se SpO₂ < 94% (Titular)", "Monitorar ECG contínuo (Vigilância)", "Mobilização cautelosa quando FC < 110 bpm em repouso"],
        "block": "⚡ BLOCO C3 — Arritmias e instabilidade elétrica",
        "goals": ["Controlar FC", "Mobilização segura quando FC controlada"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Repouso relativo durante taquiarritmia ativa (Imediato)", "O₂ se SpO₂ < 94% (Titular)", "Monitorar ECG contínuo (Vigilância)", "Controle de ansiedade e conforto (Contínuo)"]},
          {"timeframe": "24-48h", "interv": ["Mobilização progressiva quando FC controlada (< 110 bpm repouso)", "Escalonamento cuidadoso: sedestação → ortostatismo → marcha", "Monitorar telemetria durante exercício (Vigilância)"]}
        ]
      },
      {
        "name": "C3.P2 — Bradiarritmias e distúrbios de condução (BAV, pausas)",
        "desc": "Grave. FC < 50 bpm com sintomas, tontura, síncope, hipotensão, pausas em monitorização",
        "assess": ["Manter FC e PA adequadas", "Segurança na mobilização"],
        "interv": ["Repouso até avaliação e tratamento médico (Imediato)", "Monitorar telemetria contínua (Vigilância)", "Mobilização muito progressiva quando FC estabilizada e sem pausas"],
        "block": "⚡ BLOCO C3 — Arritmias e instabilidade elétrica",
        "goals": ["Manter FC e PA adequadas", "Segurança na mobilização"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Repouso até avaliação e tratamento médico (Imediato)", "Monitorar telemetria contínua (Vigilância)", "Exercícios passivos MMII em leito se estável (Mínimo)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização progressiva quando FC e ritmo estabilizados", "Monitorar FC resposta ao esforço (Vigilância)", "PARADA: pausas > 3s, síncope, tontura intensa, queda PA (Critérios)"]}
        ]
      },
      {
        "name": "C3.P3 — Instabilidade hemodinâmica induzida por arritmia",
        "desc": "Crítico. Queda de PAM < alvo, alteração de consciência, dor torácica isquêmica, dispneia súbita, hipoperfusão",
        "assess": ["Estabilizar hemodinâmica", "Suporte ventilatório se necessário"],
        "interv": ["Repouso absoluto durante instabilidade (Imediato)", "O₂ alto fluxo (Urgente)", "Monitorização contínua de PA, FC, ECG, SpO₂ (Contínuo)", "Comunicar equipe imediatamente (URGENTE)"],
        "block": "⚡ BLOCO C3 — Arritmias e instabilidade elétrica",
        "goals": ["Estabilizar hemodinâmica", "Suporte ventilatório se necessário"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Repouso absoluto durante instabilidade (Imediato)", "O₂ alto fluxo (Urgente)", "Monitorização contínua de PA, FC, ECG, SpO₂ (Contínuo)", "Comunicar equipe imediatamente (URGENTE)", "Preparo para cardioversão/desfibrilação se indicado (Suporte)"]}
        ]
      },
      {
        "name": "C3.P4 — Baixa tolerância ao esforço por instabilidade cronotrópica",
        "desc": "Moderado. FC sobe excessivamente ou não sobe adequadamente, intolerância ao ortostatismo/marcha",
        "assess": ["Mobilização segura com FC adequada ao esforço"],
        "interv": ["Aquecimento progressivo antes de cada sessão (Preparo)", "Escalonamento lento: sedestação → ortostatismo → marcha pausada (Progressivo)", "Monitorar FC antes/durante/após (Vigilância)"],
        "block": "⚡ BLOCO C3 — Arritmias e instabilidade elétrica",
        "goals": ["Mobilização segura com FC adequada ao esforço"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Aquecimento progressivo antes de cada sessão (Preparo)", "Escalonamento lento: sedestação → ortostatismo → marcha pausada (Progressivo)", "Monitorar FC antes/durante/após (Vigilância)", "PARADA: FC > 130 bpm ou queda FC com piora sintomática (Critérios)"]}
        ]
      },
      {
        "name": "C3.P5 — Hipoxemia/alto trabalho respiratório como gatilho arrítmico",
        "desc": "Grave. SpO₂ < 92%, FR > 28-30, uso de musculatura acessória, piora do ritmo com hipóxia/esforço",
        "assess": ["Corrigir hipoxemia para estabilizar ritmo"],
        "interv": ["O₂/CNAF titulado para SpO₂ 92-96% (Imediato)", "Posicionamento sentado (Terapêutico)", "Controle de dor, febre e ansiedade (Tratar causas gatilho)"],
        "block": "⚡ BLOCO C3 — Arritmias e instabilidade elétrica",
        "goals": ["Corrigir hipoxemia para estabilizar ritmo"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["O₂/CNAF titulado para SpO₂ 92-96% (Imediato)", "Posicionamento sentado (Terapêutico)", "Controle de dor, febre e ansiedade (Tratar causas gatilho)", "Monitorar ECG ao corrigir hipóxia (Vigilância)"]}
        ]
      },
      {
        "name": "C4.P1 — Dor torácica/incisional com limitação ventilatória",
        "desc": "Moderado. EVA > 5-6, respiração superficial, tosse ineficaz, proteção excessiva da ferida",
        "assess": ["Controlar dor", "Expandir pulmões", "Tosse eficaz"],
        "interv": ["Analgesia adequada com equipe antes de exercícios (Fundamental)", "Contenção manual/almofada da ferida para tosse e respiração profunda (Técnica)", "Exercícios ventilatórios: inspiração profunda, fracionada (Sessões)", "Orientar sobre proteção segura da ferida durante tosse (Educação)"],
        "block": "🔪 BLOCO C4 — Pós-operatório cardíaco e torácico",
        "goals": ["Controlar dor", "Expandir pulmões", "Tosse eficaz"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Analgesia adequada com equipe antes de exercícios (Fundamental)", "Contenção manual/almofada da ferida para tosse e respiração profunda (Técnica)", "Exercícios ventilatórios: inspiração profunda, fracionada (Sessões)", "Orientar sobre proteção segura da ferida durante tosse (Educação)"]},
          {"timeframe": "24-72h", "interv": ["Treino de tosse eficaz com contenção (2-3x/dia)", "Inspirometria de incentivo (se EVA ≤ 4) (Uso progressivo)", "Mobilização progressiva conforme controle da dor"]}
        ]
      },
      {
        "name": "C4.P2 — Hipoventilação e risco de atelectasia",
        "desc": "Grave. FR superficial, ausculta com redução de murmúrio, RX com atelectasia, queda de SpO₂",
        "assess": ["Manter VC adequado", "Prevenir/reverter atelectasia"],
        "interv": ["Exercícios ventilatórios: inspiração lenta e profunda (Sessões)", "Inspirometria de incentivo (Uso)", "Posicionamento: sedestação/cabeceira ≥ 30° (Contínuo)", "Higiene brônquica se secreção (PRN)"],
        "block": "🔪 BLOCO C4 — Pós-operatório cardíaco e torácico",
        "goals": ["Manter VC adequado", "Prevenir/reverter atelectasia"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Exercícios ventilatórios: inspiração lenta e profunda (Sessões)", "Inspirometria de incentivo (Uso)", "Posicionamento: sedestação/cabeceira ≥ 30° (Contínuo)", "O₂ suplementar se SpO₂ < 92% (Titular)"]},
          {"timeframe": "24-72h", "interv": ["Higiene brônquica se secreção (PRN)", "Mobilização precoce: sedestação beira-leito, ortostatismo (Progressivo)", "Reavaliar ausculta e SpO₂ (Diário)"]}
        ]
      },
      {
        "name": "C4.P3 — Secreção retida / tosse ineficaz",
        "desc": "Moderado. Tosse fraca/dolorosa, ruídos adventícios, aspiração frequente, pico de fluxo reduzido",
        "assess": ["Eliminar secreção", "PCF > 160 L/min"],
        "interv": ["Medir PCF (Inicial)", "Técnica de tosse assistida com contenção da ferida (Sessões)", "Huffing dirigido (Técnica)", "Higiene brônquica: posicionamento, tapotagem se não contraindicado"],
        "block": "🔪 BLOCO C4 — Pós-operatório cardíaco e torácico",
        "goals": ["Eliminar secreção", "PCF > 160 L/min"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Medir PCF (Inicial)", "Higiene brônquica: posicionamento, vibração manual (Sessões)", "Técnica de tosse assistida com contenção da ferida (Sessões)", "Huffing dirigido (Técnica)"]},
          {"timeframe": "24-72h", "interv": ["Treino de tosse progressiva (2-3x/dia)", "Mobilização: melhora clearance (Diário)", "Reavaliar PCF (A cada 48-72h)"]}
        ]
      },
      {
        "name": "C4.P4 — Fraqueza global e intolerância à mobilização",
        "desc": "Moderado. Dificuldade para sentar/levantar, queda de PA ou SpO₂ ao mobilizar, fadiga precoce",
        "assess": ["Progredir mobilização", "Alta funcional"],
        "interv": ["Sedestação beira-leito assistida (Degrau 2)", "Ortostatismo progressivo (Degrau 3)", "Marcha assistida crescente (Degrau 4)", "Monitorar PA, SpO₂ e FC ao mobilizar"],
        "block": "🔪 BLOCO C4 — Pós-operatório cardíaco e torácico",
        "goals": ["Progredir mobilização", "Alta funcional"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Sedestação beira-leito assistida (Degrau 2)", "Ortostatismo progressivo (Degrau 3)", "Monitorar PA, SpO₂ e FC ao mobilizar (Vigilância)"]},
          {"timeframe": "3-7 dias", "interv": ["Marcha assistida crescente (Degrau 4)", "Escada se necessário para alta (Funcional)", "Orientação para reabilitação fase II (Pré-alta)"]}
        ]
      },
      {
        "name": "C4.P5 — Restrição de movimento por esternotomia/toracotomia",
        "desc": "Leve. Medo de mover MMSS/tronco, limitação funcional, postura protetora",
        "assess": ["Mobilidade funcional com proteção da ferida"],
        "interv": ["Orientação sobre movimentos permitidos e protegidos (Educação)", "MMSS: mobilização passiva/ativo-assistida respeitando restrições de esternotomia (Sessões)", "Exercícios de MMII sem restrição (Contínuo)"],
        "block": "🔪 BLOCO C4 — Pós-operatório cardíaco e torácico",
        "goals": ["Mobilidade funcional com proteção da ferida"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Orientação sobre movimentos permitidos e protegidos (Educação)", "MMSS: mobilização passiva/ativo-assistida respeitando restrições de esternotomia (Sessões)", "Exercícios de MMII sem restrição (Contínuo)"]},
          {"timeframe": "24-72h", "interv": ["Progredir MMSS conforme protocolo da instituição (Gradual)", "Postura ereta segura: orientar para não cruzar braços, não apoiar (Educação)"]}
        ]
      },
      {
        "name": "C4.P6 — Risco tromboembólico por imobilismo",
        "desc": "Moderado. Longo tempo em leito, baixa mobilidade, edema de MMII, fatores de risco clínicos",
        "assess": ["Prevenir TVP/TEP"],
        "interv": ["Exercícios de bomba muscular MMII: flexo-extensão tornozelo, panturrilha (Contínuo)", "Mobilização precoce: sedestação beira-leito (24-48h pós-operatório)", "Meias de compressão graduada (Contínuo)", "Deambulação progressiva o quanto antes (Prioridade)"],
        "block": "🔪 BLOCO C4 — Pós-operatório cardíaco e torácico",
        "goals": ["Prevenir TVP/TEP"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Exercícios de bomba muscular MMII: flexo-extensão tornozelo, panturrilha (Contínuo)", "Meias de compressão graduada (Contínuo)", "Elevar MMII 30° se edema sem contraindicação hemodinâmica"]},
          {"timeframe": "24-72h", "interv": ["Sedestação beira-leito (Degrau 2)", "Ortostatismo e marcha progressiva (Prioritário)", "Monitorar sinais TVP: edema, calor, dor panturrilha (Vigilância)"]}
        ]
      },
      {
        "name": "C5.P1 — Hipoxemia por mismatch V/Q",
        "desc": "Grave. SpO₂ < 92%, PaO₂ reduzida, gradiente A-a aumentado, necessidade de O₂ suplementar",
        "assess": ["SpO₂ ≥ 92-96%"],
        "interv": ["O₂ suplementar titulado (Escalonar)", "CNAF se SpO₂ < 90% com O₂ convencional (Se indicado)", "Posicionamento sentado (Terapêutico)", "Reduzir O₂ gradualmente conforme melhora"],
        "block": "🩸 BLOCO C5 — Tromboembolismo pulmonar (TEP)",
        "goals": ["SpO₂ ≥ 92-96%"],
        "phases": [
          {"timeframe": "0-6h", "interv": ["O₂ suplementar titulado: cateter → máscara → reservatório (Escalonar)", "CNAF se SpO₂ < 90% com O₂ convencional (Se indicado)", "Posicionamento sentado (Terapêutico)"]},
          {"timeframe": "24-48h", "interv": ["Reduzir O₂ gradualmente conforme melhora (Desmame)", "Exercícios respiratórios: respiração profunda (Sessões)", "Monitorar SpO₂ ao repouso e esforço (Vigilância)"]}
        ]
      },
      {
        "name": "C5.P2 — Aumento do trabalho respiratório",
        "desc": "Grave. FR > 28-30 irpm, uso de musculatura acessória, dispneia súbita/desproporcional",
        "assess": ["Reduzir FR", "Reduzir trabalho respiratório"],
        "interv": ["O₂/CNAF (Imediato)", "Posição sentada ou semi-Fowler (Terapêutico)", "Monitorar FR, SpO₂ e esforço (Contínuo)", "Mobilização muito lenta após estabilização"],
        "block": "🩸 BLOCO C5 — Tromboembolismo pulmonar (TEP)",
        "goals": ["Reduzir FR", "Reduzir trabalho respiratório"],
        "phases": [
          {"timeframe": "0-6h", "interv": ["O₂/CNAF (Imediato)", "Posição sentada ou semi-Fowler (Terapêutico)", "Monitorar FR, SpO₂ e esforço (Contínuo)"]},
          {"timeframe": "24-48h", "interv": ["Mobilização muito lenta após estabilização clínica", "Exercícios respiratórios passivos/ativos (Sessões)"]}
        ]
      },
      {
        "name": "C5.P3 — Sobrecarga aguda de ventrículo direito (VD)",
        "desc": "Crítico. Taquicardia persistente, hipotensão, ECO com VD dilatado/septo em D, baixo débito",
        "assess": ["Preservar função do VD", "Manter PAM ≥ alvo"],
        "interv": ["Repouso absoluto (Imediato)", "O₂ máximo para reduzir vasoconstrição hipóxica do VD (Urgente)", "Evitar PEEP alta (piora pós-carga VD) (Cautela)", "Mobilização muito cautelosa somente após estabilização hemodinâmica"],
        "block": "🩸 BLOCO C5 — Tromboembolismo pulmonar (TEP)",
        "goals": ["Preservar função do VD", "Manter PAM ≥ alvo"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Repouso absoluto (Imediato)", "O₂ máximo para reduzir vasoconstrição hipóxica (Urgente)", "Evitar PEEP alta (piora pós-carga VD) (Cautela)", "Monitorar PAM, FC, SpO₂ contínuos (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização muito cautelosa somente após estabilização hemodinâmica", "Elevar cabeceira em degraus de 10° com monitoração de PA (Progressivo)"]}
        ]
      },
      {
        "name": "C5.P4 — Baixa tolerância ao esforço / risco de colapso",
        "desc": "Grave. Queda de PA ou SpO₂ ao sentar/ficar em pé, tontura, pré-síncope, dispneia intensa",
        "assess": ["Verticalizar com segurança após estabilização"],
        "interv": ["Aguardar estabilização clínica (PAM > 65, SpO₂ > 92%) (Pré-condição)", "Elevar cabeceira gradualmente monitorando PA (Progressivo)", "Sedestação assistida beira-leito com monitoração"],
        "block": "🩸 BLOCO C5 — Tromboembolismo pulmonar (TEP)",
        "goals": ["Verticalizar com segurança após estabilização"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Aguardar estabilização clínica (PAM > 65, SpO₂ > 92%) (Pré-condição)", "Elevar cabeceira gradualmente monitorando PA (Progressivo)", "Sedestação assistida beira-leito com monitoração", "PARADA: queda PA > 20 mmHg, SpO₂ < 88%, tontura intensa (Critérios)"]}
        ]
      },
      {
        "name": "C5.P5 — Dor torácica pleurítica e limitação ventilatória",
        "desc": "Moderado. Dor ventilatório-dependente, respiração superficial, hipoventilação regional",
        "assess": ["Controlar dor", "Manter expansão pulmonar"],
        "interv": ["Analgesia adequada com equipe (Fundamental)", "Exercícios ventilatórios: inspiração profunda com suporte manual (Sessões)", "Posicionamento para melhor conforto respiratório"],
        "block": "🩸 BLOCO C5 — Tromboembolismo pulmonar (TEP)",
        "goals": ["Controlar dor", "Manter expansão pulmonar"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Analgesia adequada com equipe (Fundamental)", "Exercícios ventilatórios: inspiração profunda com suporte manual (Sessões)", "Posicionamento para melhor conforto respiratório (Terapêutico)"]}
        ]
      },
      {
        "name": "C5.P6 — Risco de progressão tromboembólica",
        "desc": "Grave. TVP associada, instabilidade clínica, imobilidade prolongada",
        "assess": ["Prevenir novos eventos", "Mobilização segura"],
        "interv": ["Anticoagulação pela equipe médica (Fundamental)", "Exercícios de bomba muscular MMII em leito (Contínuo)", "Mobilização precoce quando estável (Prioritário)", "Monitorar sinais de TVP: edema, calor, dor panturrilha"],
        "block": "🩸 BLOCO C5 — Tromboembolismo pulmonar (TEP)",
        "goals": ["Prevenir novos eventos", "Mobilização segura"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Exercícios de bomba muscular MMII em leito (Contínuo)", "Elevar MMII 30° se não comprometer hemodinâmica", "Monitorar sinais de TVP e embolia (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização precoce quando estável (Prioritário)", "Ortostatismo e marcha progressiva (Escalonar)", "Orientação sobre sinais de alerta (Educação)"]}
        ]
      },
      {
        "name": "C6.P1 — Queda de retorno venoso induzida por PEEP/pressão positiva",
        "desc": "Grave. Queda de PAM após aumento de PEEP/EPAP, redução débito urinário, taquicardia reacional, baixo débito",
        "assess": ["Manter débito cardíaco com suporte ventilatório"],
        "interv": ["Usar menor PEEP eficaz (Princípio)", "Testar redução de PEEP se PA cai após aumento (Imediato)", "Avaliar responsividade a fluidos com equipe (Coordenação)", "Monitorar PAM ao ajustar PEEP (Contínuo)"],
        "block": "🫀 BLOCO C6 — Interação coração-ventilação",
        "goals": ["Manter débito cardíaco com suporte ventilatório"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Usar menor PEEP eficaz (Princípio)", "Testar redução de PEEP se PA cai após aumento (Imediato)", "Avaliar responsividade a fluidos com equipe (Coordenação)"]},
          {"timeframe": "Contínuo", "interv": ["Monitorar PAM ao ajustar PEEP (Contínuo)", "Ajustar PEEP em degraus de 2 cmH₂O com intervalo de avaliação (Gradual)"]}
        ]
      },
      {
        "name": "C6.P2 — Aumento de pós-carga de ventrículo direito (VD)",
        "desc": "Crítico. PEEP elevada, hipercapnia, hipóxia, ECO com VD dilatado/septo em D, piora hemodinâmica",
        "assess": ["Reduzir pós-carga do VD", "Normalizar hemodinâmica"],
        "interv": ["Corrigir hipóxia: O₂ alvo SpO₂ 92-96% (Imediato)", "Corrigir hipercapnia: ajustar ventilação (Imediato)", "Usar menor PEEP eficaz (Princípio)", "Evitar acidose respiratória (pH > 7,30)"],
        "block": "🫀 BLOCO C6 — Interação coração-ventilação",
        "goals": ["Reduzir pós-carga do VD", "Normalizar hemodinâmica"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Corrigir hipóxia: O₂ alvo SpO₂ 92-96% (Imediato)", "Corrigir hipercapnia: ajustar ventilação (Imediato)", "Usar menor PEEP eficaz (Princípio)", "Evitar acidose respiratória (pH > 7,30)", "Monitorar função VD por ECO e hemodinâmica (Vigilância)"]}
        ]
      },
      {
        "name": "C6.P3 — Hipotensão associada a manobras ventilatórias",
        "desc": "Grave. Queda de PA durante recrutamento alveolar, aumento de PEEP, início de VNI/VM",
        "assess": ["Manter PAM ≥ alvo durante manobras ventilatórias"],
        "interv": ["Avaliar hemodinâmica ANTES de iniciar manobra (Pré-condição)", "Se PA cai: interromper manobra, reduzir PEEP (Imediato)", "Ajustes de PEEP em degraus pequenos (2 cmH₂O) com avaliação hemodinâmica entre cada degrau"],
        "block": "🫀 BLOCO C6 — Interação coração-ventilação",
        "goals": ["Manter PAM ≥ alvo durante manobras ventilatórias"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Avaliar hemodinâmica ANTES de iniciar manobra (Pré-condição)", "Se PA cai: interromper manobra, reduzir PEEP (Imediato)", "Coordenar volume/vasopressor com equipe antes de recrutar (Preparo)", "Ajustes em degraus pequenos com avaliação entre cada degrau (Gradual)"]}
        ]
      },
      {
        "name": "C6.P4 — Dependência de suporte ventilatório em cardiopata grave",
        "desc": "Crítico. Falha repetida de desmame, edema pulmonar recorrente no TRE, dispneia/congestão ao reduzir suporte",
        "assess": ["Desmame progressivo respeitando função cardíaca"],
        "interv": ["TRE com monitorização de PA, SpO₂, FC (Protocolo)", "HFNC pós-extubação se edema ou alto risco (Estratégia)", "Coordenar desmame com otimização cardíaca (equipe multidisciplinar)", "Discutir TQT se VM prolongada > 10-14 dias"],
        "block": "🫀 BLOCO C6 — Interação coração-ventilação",
        "goals": ["Desmame progressivo respeitando função cardíaca"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["TRE com monitorização de PA, SpO₂, FC (Protocolo)", "HFNC pós-extubação se edema ou alto risco (Estratégia)", "Observar sinais de congestão durante TRE (Vigilância)"]},
          {"timeframe": "> 7 dias", "interv": ["Discutir TQT se VM prolongada > 10-14 dias (Multidisciplinar)", "Otimizar função cardíaca com equipe antes de novo TRE"]}
        ]
      },
      {
        "name": "C6.P5 — Hipoxemia/hipercapnia com impacto hemodinâmico",
        "desc": "Grave. SpO₂ < 92%, PaCO₂ > 50 mmHg, piora de PA/FC/perfusão associada",
        "assess": ["Corrigir gases", "Estabilizar hemodinâmica"],
        "interv": ["O₂/VNI para normalizar gases (Imediato)", "Titulação rigorosa: evitar hiperoxia e hipercapnia (Cuidado)", "Monitorar hemodinâmica ao corrigir gases (Vigilância)"],
        "block": "🫀 BLOCO C6 — Interação coração-ventilação",
        "goals": ["Corrigir gases", "Estabilizar hemodinâmica"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["O₂/VNI para normalizar gases (Imediato)", "SpO₂ alvo 92-96% (evitar hiperoxia) (Titular)", "VNI para CO₂ se hipercapnia com pH < 7,30 (Se indicado)", "Monitorar hemodinâmica ao corrigir gases (Vigilância)"]}
        ]
      },
      {
        "name": "C7.P1 — Hipovolemia funcional / dependência de pré-carga",
        "desc": "Grave. Hipotensão/labilidade pressórica, taquicardia, extremidades frias, TEC > 3s, oligúria, queda PA com cabeceira elevada/PEEP",
        "assess": ["Restabelecer volemia", "Estabilizar PA"],
        "interv": ["Posição supina/Trendelenburg se PA cai ao sentar (Imediato)", "Elevar MMII (retorno venoso) (Imediato)", "Coordenar reposição hídrica com equipe (Fundamental)", "Mobilização apenas quando hemodinâmica estável"],
        "block": "💧 BLOCO C7 — Distúrbios de volume",
        "goals": ["Restabelecer volemia", "Estabilizar PA"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Posição supina/Trendelenburg se PA cai ao sentar (Imediato)", "Elevar MMII (retorno venoso) (Imediato)", "Coordenar reposição hídrica com equipe (Fundamental)"]},
          {"timeframe": "24-48h", "interv": ["Mobilização progressiva quando hemodinâmica estável", "Elevar cabeceira lentamente monitorando PA (Gradual)"]}
        ]
      },
      {
        "name": "C7.P2 — Sobrecarga hídrica / congestão pulmonar e sistêmica",
        "desc": "Grave. Edema periférico/anasarca, balanço hídrico positivo, estertores/congestão, RX com congestão, ganho ponderal",
        "assess": ["Reduzir congestão", "Melhorar tolerância ao esforço"],
        "interv": ["Posição sentada: melhora mecânica respiratória e drenagem venosa (Terapêutico)", "O₂ titulado (Titular)", "VNI se SpO₂ < 92% com O₂ convencional (Se indicado)", "Mobilização progressiva conforme tolerância"],
        "block": "💧 BLOCO C7 — Distúrbios de volume",
        "goals": ["Reduzir congestão", "Melhorar tolerância ao esforço"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Posição sentada: melhora mecânica respiratória e drenagem venosa (Terapêutico)", "O₂ titulado para SpO₂ 92-96% (Titular)", "VNI se SpO₂ < 92% com O₂ convencional (Se indicado)"]},
          {"timeframe": "24-72h", "interv": ["Exercícios respiratórios: respiração diafragmática, expansão costal (Sessões)", "Mobilização progressiva: sedestação → ortostatismo → marcha", "Monitorar congestão ao mobilizar (Vigilância)"]}
        ]
      },
      {
        "name": "C7.P3 — Hipoxemia secundária a distúrbio de volume",
        "desc": "Grave. SpO₂ < 92%, PaO₂ reduzida, aumento necessidade O₂, relação com congestão/colapso",
        "assess": ["SpO₂ ≥ 92%"],
        "interv": ["O₂ titulado (Imediato)", "CNAF se persistência de hipoxemia (Se indicado)", "Tratar causa (congestão ou hipovolemia) com equipe", "Posicionamento adequado conforme causa"],
        "block": "💧 BLOCO C7 — Distúrbios de volume",
        "goals": ["SpO₂ ≥ 92%"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["O₂ titulado para SpO₂ 92-96% (Imediato)", "CNAF se persistência de hipoxemia (Se indicado)", "Tratar causa com equipe médica (Fundamental)"]},
          {"timeframe": "24-48h", "interv": ["Reduzir suporte progressivamente conforme melhora (Desmame)", "Posicionamento terapêutico conforme causa do distúrbio"]}
        ]
      },
      {
        "name": "C7.P4 — Instabilidade hemodinâmica induzida por ajustes ventilatórios/posturais",
        "desc": "Grave. Queda de PA após aumento PEEP/EPAP, início VNI, mudanças posturais, taquicardia, baixo débito",
        "assess": ["Manter PA estável durante ajustes"],
        "interv": ["Ajustes graduais de PEEP em degraus de 2 cmH₂O (Gradual)", "Mudanças posturais lentas com pausa de avaliação (Progressivo)", "Monitorar PA continuamente durante ajustes (Vigilância)"],
        "block": "💧 BLOCO C7 — Distúrbios de volume",
        "goals": ["Manter PA estável durante ajustes"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Ajustes graduais de PEEP em degraus de 2 cmH₂O (Gradual)", "Mudanças posturais lentas com pausa de avaliação (Progressivo)", "Monitorar PA continuamente durante ajustes (Vigilância)", "Se PA cai: reverter ajuste e avaliar volume (Imediato)"]}
        ]
      },
      {
        "name": "C7.P5 — Intolerância à mobilização por desequilíbrio de volume",
        "desc": "Moderado. Tontura, queda PA ao sentar/ficar em pé, dessaturação associada à congestão, fadiga precoce",
        "assess": ["Mobilização segura após otimização de volume"],
        "interv": ["Aguardar otimização de volume com equipe (Pré-condição)", "Elevar cabeceira progressivamente com monitoração de PA (Gradual)", "Monitorar SpO₂ e FC ao mobilizar (Vigilância)"],
        "block": "💧 BLOCO C7 — Distúrbios de volume",
        "goals": ["Mobilização segura após otimização de volume"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Aguardar otimização de volume com equipe (Pré-condição)", "Elevar cabeceira progressivamente com monitoração de PA (Gradual)", "Monitorar SpO₂ e FC ao mobilizar (Vigilância)", "PARADA: queda PA > 20 mmHg, SpO₂ < 88%, tontura intensa (Critérios)"]}
        ]
      },
      {
        "name": "C8.P1 — Queda de PA ao sentar ou ficar em pé (hipotensão ortostática)",
        "desc": "Grave. Queda PAS ≥ 20 mmHg ou PAD ≥ 10 mmHg em até 3 min, sintomas: tontura, escurecimento visual, sudorese fria, náusea, síncope",
        "assess": ["Tolerância ao ortostatismo sem sintomas"],
        "interv": ["Elevar cabeceira gradualmente: 30° → 45° → 60° → 90° (Progressivo, 3-5 min/estágio)", "Exercícios de bomba muscular MMII antes de verticalizar (Preparo)", "Meias de compressão graduada ou bandagem elástica MMII (Usar)", "Monitorar PA imediatamente e 1-3 min após mudança postural"],
        "block": "🧍 BLOCO C8 — Hipotensão ortostática e intolerância postural",
        "goals": ["Tolerância ao ortostatismo sem sintomas"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Elevar cabeceira gradualmente: 30° → 45° → 60° → 90° (Progressivo, 3-5 min/estágio)", "Exercícios de bomba muscular MMII antes de verticalizar: dorsiflexão, flexo-extensão joelho (Preparo)", "Monitorar PA imediatamente e 1-3 min após mudança postural (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Ortostatismo com suporte (barras, andador) (Progressivo)", "Meias de compressão graduada ou bandagem elástica MMII (Usar)", "Marcha progressiva quando tolera ortostatismo (Escalonamento)"]}
        ]
      },
      {
        "name": "C8.P2 — Intolerância à verticalização",
        "desc": "Grave. Incapacidade de manter sedestação/ortostatismo, sintomas neurovegetativos importantes",
        "assess": ["Manter sedestação/ortostatismo sem sintomas"],
        "interv": ["Protocolo de ortostatismo progressivo com inclinação gradual (Protocolo)", "Compressão elástica MMII antes de verticalizar (Preparo)", "Exercícios de bomba muscular MMII em cada estágio (Ativo)"],
        "block": "🧍 BLOCO C8 — Hipotensão ortostática e intolerância postural",
        "goals": ["Manter sedestação/ortostatismo sem sintomas"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Protocolo de ortostatismo progressivo: 30° → 45° → 60° → 90° com 3-5 min em cada estágio", "Compressão elástica MMII antes de verticalizar (Preparo)", "Exercícios de bomba muscular MMII em cada estágio (Ativo)", "PARADA: sintomas intensos (síncope, escurecimento visual, palidez, hipotensão) (Critérios)"]}
        ]
      },
      {
        "name": "C8.P3 — Baixo retorno venoso por desacondicionamento e bomba muscular ineficiente",
        "desc": "Moderado. Fraqueza de MMII, edema de MMII, longo tempo de leito, queda de PA ao mínimo esforço postural",
        "assess": ["Melhora de bomba muscular e retorno venoso"],
        "interv": ["Exercícios isométricos e isotônicos MMII em leito (2-3x/dia)", "Pompeamento de panturrilha: 30 rep/série (Contínuo)", "Progressão para ortostatismo com suporte (Gradual)", "Meias de compressão e elevação de MMII"],
        "block": "🧍 BLOCO C8 — Hipotensão ortostática e intolerância postural",
        "goals": ["Melhora de bomba muscular e retorno venoso"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Exercícios isométricos e isotônicos MMII em leito (2-3x/dia)", "Pompeamento de panturrilha: 30 rep/série (Contínuo)", "Meias de compressão e elevação de MMII (Usar)"]},
          {"timeframe": "24-72h", "interv": ["Progressão para sedestação beira-leito com bomba muscular ativa (Gradual)", "Ortostatismo com suporte (Progressivo)", "Marcha beira-leito (Escalonamento)"]}
        ]
      },
      {
        "name": "C8.P4 — Baixa tolerância ao esforço funcional",
        "desc": "Moderado. Fadiga precoce, tontura, queda de PA com pequenas atividades",
        "assess": ["Progredir funcionalidade"],
        "interv": ["Escalonamento progressivo de atividades (Protocolo)", "Monitorar PA e FC antes/durante/após (Vigilância)", "PARADA: queda PA > 20 mmHg ou aumento FC > 40 bpm acima repouso com sintomas (Critérios)"],
        "block": "🧍 BLOCO C8 — Hipotensão ortostática e intolerância postural",
        "goals": ["Progredir funcionalidade"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Escalonamento progressivo: sedestação → ortostatismo → marcha beira-leito → corredor (Protocolo)", "Monitorar PA e FC antes/durante/após (Vigilância)", "PARADA: queda PA > 20 mmHg ou aumento FC > 40 bpm com sintomas (Critérios)", "Exercícios aeróbicos leves (Cicloergômetro, caminhada) conforme tolerância"]}
        ]
      },
      {
        "name": "C9.P1 — Isquemia miocárdica aguda / risco de reinfarto",
        "desc": "Crítico. Dor torácica típica/recorrente, alterações ECG/telemetria, troponina elevada, instabilidade hemodinâmica",
        "assess": ["Reduzir consumo O₂ miocárdico", "Prevenir reinfarto"],
        "interv": ["Repouso estrito nas primeiras 12-24h (Protocolo SCA)", "O₂ se SpO₂ < 94% (Evitar hiperoxia)", "Controle de dor, ansiedade e FC (Reduz demanda O₂)", "Mobilização muito progressiva após estabilização e reperfusão"],
        "block": "🚨 BLOCO C9 — Síndrome coronariana aguda (SCA)",
        "goals": ["Reduzir consumo O₂ miocárdico", "Prevenir reinfarto"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Repouso estrito nas primeiras 12-24h (Protocolo SCA)", "O₂ se SpO₂ < 94% (Evitar hiperoxia - causa vasoconstrição coronariana)", "Controle de dor, ansiedade e FC (Reduz demanda O₂)", "Monitorar ECG e telemetria (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização muito progressiva após estabilização e reperfusão", "Sedestação beira-leito quando PA e ritmo estáveis (Degrau 2)", "Monitorar PA, FC, ECG ao mobilizar (Vigilância)"]}
        ]
      },
      {
        "name": "C9.P2 — Desequilíbrio oferta/consumo de O₂ do miocárdio",
        "desc": "Grave. Taquicardia, hipoxemia, anemia/hipovolemia, dor/ansiedade, febre/sepse concomitante",
        "assess": ["Reduzir demanda", "Aumentar oferta de O₂ miocárdico"],
        "interv": ["O₂ se SpO₂ < 94% (Aumentar oferta)", "Controle de FC: analgesia, ansiolítico, temperatura (Reduzir demanda)", "Tratar causas reversíveis: febre, anemia, hipovolemia (Equipe)"],
        "block": "🚨 BLOCO C9 — Síndrome coronariana aguda (SCA)",
        "goals": ["Reduzir demanda", "Aumentar oferta de O₂ miocárdico"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["O₂ se SpO₂ < 94% (Aumentar oferta - evitar hiperoxia)", "Controle de FC: analgesia, ansiolítico, temperatura (Reduzir demanda)", "Tratar causas reversíveis: febre, anemia, hipovolemia (Equipe)", "Repouso relativo para reduzir consumo (Protocolo)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização progressiva após controle do desequilíbrio", "Monitorar FC resposta ao esforço (Vigilância)"]}
        ]
      },
      {
        "name": "C9.P3 — Dispneia/hipoxemia associada (congestão, edema, atelectasia, dor)",
        "desc": "Grave. SpO₂ < 92%, FR elevada, crepitações/congestão, RX sugestivo",
        "assess": ["SpO₂ ≥ 94%", "Reduzir FR"],
        "interv": ["O₂/CNAF titulado (Imediato)", "Posição sentada ou semi-Fowler (Terapêutico)", "Tratar causa com equipe (congestão, dor, atelectasia)"],
        "block": "🚨 BLOCO C9 — Síndrome coronariana aguda (SCA)",
        "goals": ["SpO₂ ≥ 94%", "Reduzir FR"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["O₂/CNAF titulado para SpO₂ 92-96% (Imediato)", "Posição sentada ou semi-Fowler (Terapêutico)", "Tratar causa com equipe: congestão, dor, atelectasia (Fundamental)", "VNI se hipoxemia grave ou EAP associado (Se indicado)"]}
        ]
      },
      {
        "name": "C9.P4 — Risco de arritmias malignas no contexto de SCA",
        "desc": "Grave. Extrassístoles frequentes, TVNS, FA, instabilidade elétrica, sintomas (palpitação, síncope, tontura)",
        "assess": ["Prevenir arritmias por hipóxia/esforço excessivo"],
        "interv": ["O₂ se SpO₂ < 94% (Prevenir hipóxia gatilho)", "Repouso quando arritmia ativa (Imediato)", "Monitorar telemetria durante mobilização (Vigilância)"],
        "block": "🚨 BLOCO C9 — Síndrome coronariana aguda (SCA)",
        "goals": ["Prevenir arritmias por hipóxia/esforço excessivo"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["O₂ se SpO₂ < 94% (Prevenir hipóxia gatilho)", "Repouso quando arritmia ativa (Imediato)", "Monitorar telemetria durante mobilização (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização quando ritmo estável (Progressivo)", "PARADA: TV sustentada, FA com FC > 130, síncope, queda PA (Critérios)"]}
        ]
      },
      {
        "name": "C9.P5 — Baixa tolerância ao esforço / restrição funcional inicial",
        "desc": "Moderado. Dispneia e fadiga ao mínimo esforço, medo de mobilizar, fraqueza e descondicionamento",
        "assess": ["Progressão segura da mobilização"],
        "interv": ["Sedestação beira-leito quando PA e ritmo estáveis (Degrau 2)", "Ortostatismo progressivo (Degrau 3)", "Marcha crescente no corredor (Degrau 4)", "Orientação e educação sobre segurança do movimento"],
        "block": "🚨 BLOCO C9 — Síndrome coronariana aguda (SCA)",
        "goals": ["Progressão segura da mobilização"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Sedestação beira-leito quando PA e ritmo estáveis (Degrau 2)", "Ortostatismo progressivo (Degrau 3)", "Marcha beira-leito (Degrau 4)", "Orientação e educação sobre segurança do movimento (Educação)"]},
          {"timeframe": "3-5 dias", "interv": ["Marcha no corredor crescente (Progressivo)", "Subir degraus se necessário para alta (Funcional)", "Orientar para reabilitação cardíaca fase II (Pré-alta)"]}
        ]
      },
      {
        "name": "C9.P6 — Pós-cateterismo/angioplastia com restrições e risco de sangramento",
        "desc": "Moderado. Punção femoral/radial recente, dor local/hematoma, restrição de mobilidade do membro puncionado",
        "assess": ["Mobilização respeitando restrições do acesso vascular"],
        "interv": ["Repouso do membro puncionado conforme protocolo (femoral: 4-6h; radial: 2-4h) (Protocolo)", "Exercícios MMII/MMSS não puncionados durante repouso (Ativo)", "Deambulação progressiva após liberação do sítio de punção"],
        "block": "🚨 BLOCO C9 — Síndrome coronariana aguda (SCA)",
        "goals": ["Mobilização respeitando restrições do acesso vascular"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Repouso do membro puncionado conforme protocolo (femoral: 4-6h; radial: 2-4h) (Protocolo)", "Exercícios MMII/MMSS não puncionados durante repouso (Ativo)", "Monitorar sítio de punção: hematoma, sangramento, pulso (Vigilância)"]},
          {"timeframe": "24-48h", "interv": ["Deambulação progressiva após liberação do sítio de punção", "Monitorar hematoma ao mobilizar (Vigilância)"]}
        ]
      },
      {
        "name": "C10.P1 — Baixo débito / intolerância ao esforço por limitação valvar",
        "desc": "Grave. Fadiga/dispneia desproporcionais, hipotensão/labilidade ao ortostatismo, queda de performance funcional",
        "assess": ["Mobilização segura dentro dos limites hemodinâmicos"],
        "interv": ["Elevar cabeceira gradualmente com monitoração de PA/FC (Progressivo)", "Sedestação assistida beira-leito (Degrau 2)", "Ortostatismo progressivo com monitoração (Degrau 3)", "Intensidade leve a moderada: Borg ≤ 5 (Limite)"],
        "block": "🫀 BLOCO C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": ["Mobilização segura dentro dos limites hemodinâmicos"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Elevar cabeceira gradualmente com monitoração de PA/FC (Progressivo)", "Sedestação assistida beira-leito (Degrau 2)", "Ortostatismo progressivo com monitoração (Degrau 3)", "Intensidade leve: Borg ≤ 5 (Limite)", "PARADA: queda PA > 20 mmHg, Borg > 6, síncope (Critérios)"]}
        ]
      },
      {
        "name": "C10.P2 — Congestão pulmonar/edema por falência esquerda (IM/EM/EAo avançada)",
        "desc": "Crítico. Ortopneia, DPN, crepitações, RX com congestão, hipoxemia, FR elevada",
        "assess": ["Reduzir congestão", "Melhorar SpO₂"],
        "interv": ["Posição sentada imediata (90°) (Terapêutico)", "O₂ titulado para SpO₂ 92-96% (Imediato)", "VNI com CPAP 5-10 cmH₂O (Se indicado)", "Exercícios respiratórios após estabilização"],
        "block": "🫀 BLOCO C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": ["Reduzir congestão", "Melhorar SpO₂"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Posição sentada imediata (90°) (Terapêutico)", "O₂ titulado para SpO₂ 92-96% (Imediato)", "VNI com CPAP 5-10 cmH₂O (Se indicado)"]},
          {"timeframe": "24-48h", "interv": ["Exercícios respiratórios progressivos (Sessões)", "Mobilização progressiva conforme tolerância"]}
        ]
      },
      {
        "name": "C10.P3 — Isquemia/síncope em estenose aórtica grave (EAo)",
        "desc": "Crítico. Síncope/presíncope ao esforço, angina/dor torácica, PA não sustenta em mudanças posturais",
        "assess": ["Prevenir síncope ao esforço"],
        "interv": ["Evitar esforço brusco e manobra de Valsalva (Sempre)", "Elevação de cabeceira lenta (< 10°/vez) com pausa de 3 min (Muito gradual)", "Monitorar PA rigorosamente ao mobilizar (Vigilância)", "Mobilização de intensidade muito leve (Borg ≤ 3)"],
        "block": "🫀 BLOCO C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": ["Prevenir síncope ao esforço"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Evitar esforço brusco e manobra de Valsalva (Sempre)", "Elevação de cabeceira muito lenta com pausa de 3 min (Muito gradual)", "Monitorar PA rigorosamente ao mobilizar (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização de intensidade muito leve (Borg ≤ 3) (Limite rígido)", "PARADA: síncope, queda PA > 10 mmHg com sintomas, angina (Critérios)"]}
        ]
      },
      {
        "name": "C10.P4 — Taquicardia como inimiga (especialmente EM e IAo)",
        "desc": "Grave. FC elevada reduz enchimento diastólico (EM) e piora congestão, FC elevada encurta diástole (IAo)",
        "assess": ["Controlar FC", "Evitar esforços que aumentem FC"],
        "interv": ["Evitar manobras/exercícios que acelerem FC excessivamente (Cautela)", "Aquecimento lento (5-10 min) antes de qualquer atividade (Preparo)", "Monitorar FC continuamente: limite conforme patologia (Vigilância)"],
        "block": "🫀 BLOCO C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": ["Controlar FC", "Evitar esforços que aumentem FC"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Repouso relativo, evitar esforços que acelerem FC (Cautela)", "O₂ se necessário (Titular)", "Monitorar FC e ritmo (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização progressiva com FC monitorada (Vigilância)", "Intensidade baixa: manter FC dentro do limite definido com equipe", "PARADA: FC acima do limite com sintomas (Critérios)"]}
        ]
      },
      {
        "name": "C10.P5 — Hipoxemia e alto trabalho respiratório aumentando carga cardíaca",
        "desc": "Grave. FR > 28-30, uso de musculatura acessória, dessaturação ao mobilizar/deitar, piora FC/PA",
        "assess": ["SpO₂ ≥ 92%", "Reduzir trabalho respiratório"],
        "interv": ["O₂/CNAF titulado (Imediato)", "Posição sentada (Terapêutico)", "VNI se indicado (Escalonar)", "Exercícios respiratórios após estabilização"],
        "block": "🫀 BLOCO C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": ["SpO₂ ≥ 92%", "Reduzir trabalho respiratório"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["O₂/CNAF titulado para SpO₂ 92-96% (Imediato)", "Posição sentada (Terapêutico)", "VNI se indicado (Escalonar)"]},
          {"timeframe": "24-48h", "interv": ["Exercícios respiratórios progressivos (Sessões)", "Monitorar SpO₂ ao mobilizar (Vigilância)"]}
        ]
      },
      {
        "name": "C10.P6 — Pós-intervenção valvar (TAVI/valva cirúrgica) com risco de complicações",
        "desc": "Grave. Pós-op imediato, drenos, dor, restrições, risco de distúrbios condução/arritmias, sangramento",
        "assess": ["Mobilização segura pós-procedimento", "Prevenir complicações"],
        "interv": ["Exercícios respiratórios: inspiração profunda, tosse assistida (0-24h)", "Mobilização passiva MMII (0-24h)", "Monitorar ritmo/PA/drenos (Vigilância)", "Sedestação beira-leito quando PA e ritmo estáveis"],
        "block": "🫀 BLOCO C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": ["Mobilização segura pós-procedimento", "Prevenir complicações"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Exercícios respiratórios: inspiração profunda, tosse assistida (Sessões)", "Mobilização passiva MMII: bomba muscular, flexo-extensão (Contínuo)", "Monitorar ritmo/PA/drenos/sítio de punção (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Sedestação beira-leito quando PA e ritmo estáveis (Degrau 2)", "Ortostatismo progressivo com monitoração (Degrau 3)", "Marcha progressiva conforme protocolo (Degrau 4)"]}
        ]
      },
      {
        "name": "C10.P7 — Insuficiência tricúspide / falência direita (IT importante)",
        "desc": "Grave. Dependência de pré-carga, edema periférico, baixa tolerância postural, hipotensão com pressão positiva",
        "assess": ["Manter pré-carga adequada", "Evitar pressão positiva excessiva"],
        "interv": ["Menor PEEP eficaz (Princípio VD)", "Elevar cabeceira lentamente monitorando PAM (Muito gradual)", "Monitorar PAM ao mobilizar (Vigilância)", "Mobilização muito progressiva e cautelosa"],
        "block": "🫀 BLOCO C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": ["Manter pré-carga adequada", "Evitar pressão positiva excessiva"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Menor PEEP eficaz (Princípio VD)", "Elevar cabeceira lentamente: 10°/vez com pausa de 3 min (Muito gradual)", "Monitorar PAM ao mobilizar (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização muito progressiva e cautelosa", "PARADA: queda PAM < 55 ou queda > 15 mmHg com sintomas (Critérios)"]}
        ]
      },
      {
        "name": "C11.P1 — Hipoxemia com alto impacto sobre o VD (vasoconstrição hipóxica)",
        "desc": "Crítico. SpO₂ < 92%, PaO₂ reduzida, piora hemodinâmica associada à hipóxia",
        "assess": ["SpO₂ ≥ 92-94%", "Evitar vasoconstrição hipóxica do VD"],
        "interv": ["O₂ titulado alvo SpO₂ 92-94% (Imediato)", "CNAF se SpO₂ < 90% com O₂ convencional (Se indicado)", "Manter oxigenação rigorosa: nunca deixar SpO₂ < 90% em HP"],
        "block": "🫁 BLOCO C11 — Hipertensão pulmonar e cor pulmonale",
        "goals": ["SpO₂ ≥ 92-94%", "Evitar vasoconstrição hipóxica do VD"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["O₂ titulado alvo SpO₂ 92-94% (Imediato)", "CNAF se SpO₂ < 90% com O₂ convencional (Se indicado)", "Manter oxigenação rigorosa: nunca deixar SpO₂ < 90% em HP (Vigilância)"]},
          {"timeframe": "Contínuo", "interv": ["Monitorar SpO₂ continuamente (Contínuo)", "Ajustar O₂ ao mínimo eficaz (Desmame gradual)"]}
        ]
      },
      {
        "name": "C11.P2 — Hipercapnia/acidose respiratória aumentando RVP (pós-carga do VD)",
        "desc": "Crítico. PaCO₂ > 50 mmHg e/ou pH < 7,30, aumento esforço respiratório, sonolência, piora do VD",
        "assess": ["PaCO₂ ≤ 45 mmHg", "pH > 7,35"],
        "interv": ["VNI para controle de CO₂: IPAP 10-14, EPAP 4-6 (Imediato)", "Posição sentada (Terapêutico)", "Titular suporte por gasometria (Ajuste fino)", "Desmame cuidadoso mantendo controle de gases"],
        "block": "🫁 BLOCO C11 — Hipertensão pulmonar e cor pulmonale",
        "goals": ["PaCO₂ ≤ 45 mmHg", "pH > 7,35"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["VNI para controle de CO₂: IPAP 10-14, EPAP 4-6 (Imediato)", "Posição sentada (Terapêutico)", "Titular suporte por gasometria (Ajuste fino)"]},
          {"timeframe": "24-48h", "interv": ["Desmame cuidadoso mantendo controle de gases (Progressivo)", "Gasometria seriada para guiar desmame (Seriado)"]}
        ]
      },
      {
        "name": "C11.P3 — Sobrecarga de VD / baixo débito por aumento de RVP",
        "desc": "Crítico. Hipotensão, hipoperfusão, taquicardia, extremidades frias, TEC prolongado, ECO: VD dilatado/septo em D",
        "assess": ["Preservar função VD", "Manter PAM ≥ 65"],
        "interv": ["O₂ máximo (reduz vasoconstrição hipóxica) (Urgente)", "Evitar PEEP alta (piora pós-carga VD) (Cautela)", "Repouso absoluto (Imediato)", "Mobilização somente após estabilização hemodinâmica"],
        "block": "🫁 BLOCO C11 — Hipertensão pulmonar e cor pulmonale",
        "goals": ["Preservar função VD", "Manter PAM ≥ 65"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["O₂ máximo (reduz vasoconstrição hipóxica) (Urgente)", "Evitar PEEP alta (piora pós-carga VD) (Cautela)", "Repouso absoluto (Imediato)", "Monitorar PAM, FC, SpO₂ contínuos (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização muito cautelosa somente após estabilização", "Elevar cabeceira em degraus de 10° com monitoração de PA (Progressivo)"]}
        ]
      },
      {
        "name": "C11.P4 — Dependência de pré-carga + risco de colapso com pressão positiva",
        "desc": "Crítico. Queda de PA após iniciar VNI/VM ou subir PEEP, piora com recrutamento, instabilidade postural importante",
        "assess": ["Manter PAM ao iniciar/ajustar suporte ventilatório"],
        "interv": ["Iniciar PEEP baixa ≤ 5 cmH₂O (Princípio VD)", "Testar resposta hemodinâmica a cada incremento de PEEP (Titulação)", "Coordenar volume/vasopressor com equipe antes de ajustar (Preparo)"],
        "block": "🫁 BLOCO C11 — Hipertensão pulmonar e cor pulmonale",
        "goals": ["Manter PAM ao iniciar/ajustar suporte ventilatório"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Iniciar PEEP baixa ≤ 5 cmH₂O (Princípio VD)", "Testar resposta hemodinâmica a cada incremento de PEEP (Titulação)", "Coordenar volume/vasopressor com equipe antes de ajustar (Preparo)", "Se PA cai: reduzir PEEP imediatamente (Imediato)"]}
        ]
      },
      {
        "name": "C11.P5 — Aumento do trabalho respiratório elevando consumo de O₂ e estresse simpático",
        "desc": "Grave. FR > 28-30, uso de musculatura acessória, taquicardia induzida por dispneia",
        "assess": ["Reduzir FR e esforço respiratório"],
        "interv": ["Suporte respiratório: O₂/CNAF/VNI conforme gravidade (Imediato)", "Posição sentada (Terapêutico)", "Controle de ansiedade e conforto (Contínuo)"],
        "block": "🫁 BLOCO C11 — Hipertensão pulmonar e cor pulmonale",
        "goals": ["Reduzir FR e esforço respiratório"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Suporte respiratório: O₂/CNAF/VNI conforme gravidade (Imediato)", "Posição sentada (Terapêutico)", "Controle de ansiedade e conforto (Contínuo)", "Monitorar FR, SpO₂, esforço respiratório (Vigilância)"]}
        ]
      },
      {
        "name": "C11.P6 — Intolerância à mobilização por limitação hemodinâmica",
        "desc": "Grave. Tontura/presíncope ao sentar/ficar em pé, queda de PA com pequenos esforços, dessaturação ao mobilizar",
        "assess": ["Mobilização segura respeitando limites hemodinâmicos"],
        "interv": ["Elevar cabeceira muito lentamente (10°/vez, pausa 3 min) (Muito gradual)", "Sedestação progressiva com monitoração rigorosa de PA/SpO₂ (Vigilância)", "PARADA: queda PA > 10 mmHg com sintomas ou SpO₂ < 88% (Critérios rígidos)"],
        "block": "🫁 BLOCO C11 — Hipertensão pulmonar e cor pulmonale",
        "goals": ["Mobilização segura respeitando limites hemodinâmicos"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Elevar cabeceira muito lentamente (10°/vez, pausa 3 min) (Muito gradual)", "Sedestação progressiva com monitoração rigorosa de PA/SpO₂ (Vigilância)", "Exercícios MMII passivos/ativos no leito antes de verticalizar (Preparo)", "PARADA: queda PA > 10 mmHg com sintomas ou SpO₂ < 88% (Critérios rígidos)"]}
        ]
      },
      {
        "name": "C12.P1 — Comprometimento ventilatório pós-procedimento (dor, hipoventilação, atelectasia)",
        "desc": "Grave. Padrão superficial, queda SpO₂, ausculta com redução MV, RX com atelectasia/congestão, tosse ineficaz",
        "assess": ["Manter expansão pulmonar", "Prevenir atelectasia"],
        "interv": ["Exercícios respiratórios: inspiração profunda, fracionada (Sessões)", "Inspirometria de incentivo (Uso)", "Posicionamento: sedestação/cabeceira ≥ 30° (Contínuo)", "Higiene brônquica se secreção (PRN)"],
        "block": "🔬 BLOCO C12 — Pós-TAVI/pós-valva/pós-transplante",
        "goals": ["Manter expansão pulmonar", "Prevenir atelectasia"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Exercícios respiratórios: inspiração profunda, fracionada (Sessões)", "Inspirometria de incentivo (Uso)", "Posicionamento: sedestação/cabeceira ≥ 30° (Contínuo)", "O₂ suplementar se SpO₂ < 92% (Titular)"]},
          {"timeframe": "24-72h", "interv": ["Higiene brônquica se secreção (PRN)", "Tosse assistida com contenção da ferida (Sessões)", "Mobilização precoce: sedestação beira-leito, ortostatismo (Progressivo)"]}
        ]
      },
      {
        "name": "C12.P2 — Instabilidade elétrica / distúrbios de condução pós-procedimento",
        "desc": "Grave. Bradicardia, BAV, pausas, arritmias novas em telemetria (risco aumentado especialmente pós-TAVI)",
        "assess": ["Monitorar ritmo", "Mobilização segura"],
        "interv": ["Repouso relativo e monitoração telemetria contínua (0-24h)", "Exercícios passivos MMII quando estável (Mínimo)", "Mobilização progressiva quando ritmo estabilizado"],
        "block": "🔬 BLOCO C12 — Pós-TAVI/pós-valva/pós-transplante",
        "goals": ["Monitorar ritmo", "Mobilização segura"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Repouso relativo e monitoração telemetria contínua (0-24h)", "Exercícios passivos MMII quando estável (Mínimo)", "Monitorar FC e ritmo (Vigilância)"]},
          {"timeframe": "24-72h", "interv": ["Mobilização progressiva quando ritmo estabilizado", "PARADA: bradicardia sintomática, pausas, TV (Critérios)"]}
        ]
      },
      {
        "name": "C12.P3 — Instabilidade hemodinâmica / labilidade pressórica",
        "desc": "Grave. PAM oscilante, necessidade de suporte vasoativo (UTI), hipotensão ao mobilizar",
        "assess": ["PAM estável", "Mobilização progressiva"],
        "interv": ["Posição semi-Fowler (30-45°) (Estável)", "Monitorar PA continuamente (Contínuo)", "Ajustar suporte vasoativo com equipe (Fundamental)", "Mobilização somente quando PA estável sem vasopressor ou dose mínima"],
        "block": "🔬 BLOCO C12 — Pós-TAVI/pós-valva/pós-transplante",
        "goals": ["PAM estável", "Mobilização progressiva"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Posição semi-Fowler (30-45°) (Estável)", "Monitorar PA continuamente (Contínuo)", "Ajustar suporte vasoativo com equipe (Fundamental)"]},
          {"timeframe": "24-72h", "interv": ["Elevar cabeceira gradualmente quando PA estável (Progressivo)", "Sedestação assistida beira-leito (Degrau 2)", "Monitorar PA ao mobilizar (Vigilância)"]}
        ]
      },
      {
        "name": "C12.P4 — Restrição por punção vascular (TAVI/cateter) e risco de sangramento/hematoma",
        "desc": "Moderado. Punção femoral/radial recente, dor local/hematoma, limitação mobilidade do membro, restrições conforme protocolo",
        "assess": ["Mobilização do membro respeitando protocolo"],
        "interv": ["Repouso do membro puncionado conforme protocolo institucional (Protocolo)", "Exercícios dos outros membros durante repouso (Ativo)", "Deambulação progressiva após liberação"],
        "block": "🔬 BLOCO C12 — Pós-TAVI/pós-valva/pós-transplante",
        "goals": ["Mobilização do membro respeitando protocolo"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Repouso do membro puncionado conforme protocolo (Protocolo)", "Exercícios dos outros membros durante repouso (Ativo)", "Monitorar sítio de punção: hematoma, sangramento, pulso (Vigilância)"]},
          {"timeframe": "24-48h", "interv": ["Deambulação progressiva após liberação do sítio", "Monitorar hematoma ao mobilizar (Vigilância)"]}
        ]
      },
      {
        "name": "C12.P5 — Fraqueza e descondicionamento (pós-UTI/pós-cirurgia)",
        "desc": "Moderado. Dificuldade em transferências, baixa tolerância à marcha, fadiga precoce",
        "assess": ["Recuperar funcionalidade", "Independência para alta"],
        "interv": ["Sedestação beira-leito (Degrau 2)", "Ortostatismo com suporte (Degrau 3)", "Marcha progressiva (Degrau 4)", "Treino de transferências e AVDs"],
        "block": "🔬 BLOCO C12 — Pós-TAVI/pós-valva/pós-transplante",
        "goals": ["Recuperar funcionalidade", "Independência para alta"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Sedestação beira-leito (Degrau 2)", "Ortostatismo com suporte (Degrau 3)", "Marcha beira-leito (Degrau 4)"]},
          {"timeframe": "3-7 dias", "interv": ["Marcha no corredor crescente (Progressivo)", "Escada se necessário para alta (Funcional)", "Orientar para reabilitação cardíaca fase II (Pré-alta)"]}
        ]
      },
      {
        "name": "C12.P6 — Resposta cronotrópica alterada pós-transplante cardíaco",
        "desc": "Moderado. FC de repouso mais alta, resposta ao esforço menos previsível (transplante cardíaco)",
        "assess": ["Progressão segura com monitoramento da FC"],
        "interv": ["Aquecimento prolongado (10-15 min) antes de cada sessão (Preparo)", "Progressão mais lenta que paciente cardíaco convencional (Gradual)", "Monitorar FC e Borg durante esforço (Vigilância)"],
        "block": "🔬 BLOCO C12 — Pós-TAVI/pós-valva/pós-transplante",
        "goals": ["Progressão segura com monitoramento da FC"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Aquecimento prolongado (10-15 min) antes de cada sessão (Preparo)", "Progressão mais lenta que cardiopata convencional (Gradual)", "Monitorar FC e Borg durante esforço (Vigilância)", "Usar Borg como guia principal (FC menos previsível em denervação)"]}
        ]
      },
      {
        "name": "C13.P1 — Descondicionamento cardiovascular agudo",
        "desc": "Moderado. Fadiga e dispneia a esforços mínimos, queda importante de tolerância funcional, imobilismo recente/UTI/pós-evento",
        "assess": ["Recuperar funcionalidade progressivamente"],
        "interv": ["Sedestação beira-leito (Degrau 2)", "Ortostatismo e marcha beira-leito (Degrau 3)", "Marcha crescente no corredor (Degrau 4)", "Cicloergômetro se disponível (Aeróbico leve)"],
        "block": "🏃 BLOCO C13 — Reabilitação cardíaca fase I",
        "goals": ["Recuperar funcionalidade progressivamente"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Sedestação beira-leito (Degrau 2)", "Exercícios de bomba muscular MMII (Contínuo)"]},
          {"timeframe": "24-72h", "interv": ["Ortostatismo e marcha beira-leito (Degrau 3)", "Marcha no corredor (Degrau 4)"]},
          {"timeframe": "3-7 dias", "interv": ["Marcha crescente (Progressivo)", "Cicloergômetro se disponível (Aeróbico leve)", "Orientar para fase II (Pré-alta)"]}
        ]
      },
      {
        "name": "C13.P2 — Baixa tolerância ortostática e ao esforço",
        "desc": "Moderado. Tontura, hipotensão ao sentar/ficar em pé, taquicardia ou dispneia precoce, pausas muito frequentes",
        "assess": ["Tolerar ortostatismo e marcha funcional"],
        "interv": ["Elevar cabeceira gradualmente (Progressivo)", "Ortostatismo assistido com monitoração (Degrau 3)", "Marcha progressiva quando tolera ortostatismo sem sintomas"],
        "block": "🏃 BLOCO C13 — Reabilitação cardíaca fase I",
        "goals": ["Tolerar ortostatismo e marcha funcional"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Elevar cabeceira gradualmente: 30° → 45° → 60° → 90° (Progressivo)", "Ortostatismo assistido com monitoração (Degrau 3)", "Monitorar PA, FC, SpO₂, Borg ao mobilizar (Vigilância)"]},
          {"timeframe": "3-7 dias", "interv": ["Marcha progressiva quando tolera ortostatismo (Degrau 4)", "Marcha crescente no corredor (Escalonamento)"]}
        ]
      },
      {
        "name": "C13.P3 — Medo de mobilizar / comportamento de evitação",
        "desc": "Leve. Insegurança do paciente, recusa ou rigidez excessiva, postura de fragilidade aprendida",
        "assess": ["Educação e confiança progressiva no movimento"],
        "interv": ["Orientação educacional: explicar segurança e benefícios do movimento (Imediato)", "Definir limites seguros com o paciente (Educação)", "Progressão assistida com feedback positivo (Motivacional)"],
        "block": "🏃 BLOCO C13 — Reabilitação cardíaca fase I",
        "goals": ["Educação e confiança progressiva no movimento"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Orientação educacional: explicar segurança e benefícios do movimento (Imediato)", "Definir limites seguros com o paciente (Educação)"]},
          {"timeframe": "24-72h", "interv": ["Progressão assistida com feedback positivo (Motivacional)", "Envolver familiar/cuidador no processo (Suporte)"]}
        ]
      },
      {
        "name": "C13.P4 — Risco de complicações por imobilismo",
        "desc": "Moderado. Risco de: trombose, atelectasia, perda de massa muscular, perda de autonomia",
        "assess": ["Prevenir TVP, atelectasia, sarcopenia"],
        "interv": ["Exercícios de bomba muscular MMII (Contínuo)", "Respiração profunda: 10 rep/hora (Preventivo)", "Mobilização ativa no leito (2-3x/dia)", "Sedestação beira-leito o mais precoce possível"],
        "block": "🏃 BLOCO C13 — Reabilitação cardíaca fase I",
        "goals": ["Prevenir TVP, atelectasia, sarcopenia"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Exercícios de bomba muscular MMII (Contínuo)", "Respiração profunda: 10 rep/hora (Preventivo)", "Mobilização ativa no leito: MMSS e MMII (2-3x/dia)"]},
          {"timeframe": "24-72h", "interv": ["Sedestação beira-leito o mais precoce possível (Prioritário)", "Ortostatismo e marcha progressivos (Escalonamento)"]}
        ]
      },
      {
        "name": "C13.P5 — Progressão funcional até a alta",
        "desc": "Leve. Necessidade de marcha funcional, subir/descer degraus se necessário para casa, entender limites",
        "assess": ["Alta funcional: marcha independente, subir degraus se necessário"],
        "interv": ["Marcha crescente no corredor (Progressivo)", "Treino de escada se necessário para casa (Funcional)", "Orientação sobre sinais de alerta e limites em casa (Educação)"],
        "block": "🏃 BLOCO C13 — Reabilitação cardíaca fase I",
        "goals": ["Alta funcional: marcha independente, subir degraus se necessário"],
        "phases": [
          {"timeframe": "3-7 dias", "interv": ["Marcha crescente no corredor (Progressivo)", "Treino de escada se necessário para casa (Funcional)", "Orientação sobre sinais de alerta e limites em casa (Educação)", "Encaminhar para reabilitação cardíaca fase II (Pré-alta)"]}
        ]
      }
    ]
  },
{
    "id": "respiratory",
    "name": "Sistema Respiratório",
    "icon": "M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152-7.065c-.022-.826-.16-1.875-.903-2.373-.715-.478-1.755-.142-2.29.526-1.084 1.352-2.07 1.934-3.862 1.934s-2.778-.582-3.862-1.934c-.535-.668-1.575-1.004-2.29-.526-.743.498-.881 1.547-.903 2.373a23.91 23.91 0 01-1.152 7.065C5.353 13.258 9.117 12.75 12 12.75z",
    "color": "#38bdf8",
    "problems": [
      {
        "name": "R1.1 — Hipoxemia leve a moderada em respiração espontânea",
        "desc": "Moderado. SpO₂ < 92% (geral) ou < 88-90% (DPOC), FR normal/leve↑, sem fadiga grave",
        "assess": ["Atingir SpO₂ alvo: Geral 92-96%, DPOC 88-92%", "Reduzir gradualmente dependência de O₂"],
        "interv": ["Cateter nasal: 1-5 L/min (≈24-40%) (Titular)", "Máscara simples: 5-10 L/min (Se insuficiente)", "Máscara com reservatório: 10-15 L/min (Se necessário)", "Posicionamento terapêutico (sentado/cabeceira elevada) (Contínuo)", "Mobilização precoce (2-3x/dia)", "Monitorar: SpO₂, FR, FC, esforço respiratório (Contínuo)"],
        "block": "🫁 BLOCO R1 — Oxigenoterapia, HFNC e VNI",
        "goals": ["Atingir SpO₂ alvo: Geral 92-96%, DPOC 88-92%", "Reduzir gradualmente dependência de O₂"],
        "phases": [
          {"timeframe": "0-30 min", "interv": ["Cateter nasal: 1-5 L/min (≈24-40%) (Titular)", "Máscara simples: 5-10 L/min (Se insuficiente)", "Máscara com reservatório: 10-15 L/min (Se necessário)", "Regra: menor suporte que mantém SpO₂ alvo (Sempre)"]},
          {"timeframe": "24-48h", "interv": ["Posicionamento terapêutico (sentado/cabeceira elevada) (Contínuo)", "Mobilização precoce (2-3x/dia)", "Exercícios ventilatórios se indicados (Se pós-op/hipoventilação)", "Higiene brônquica se secreção (PRN)", "Monitorar: SpO₂, FR, FC, esforço respiratório (Contínuo)"]}
        ]
      },
      {
        "name": "R1.2 — Hipoxemia moderada a grave com alto trabalho respiratório",
        "desc": "Grave. SpO₂ < alvo mesmo com máscara reservatório, FR > 28-30, uso musculatura acessória",
        "assess": ["Reduzir trabalho respiratório", "Melhorar SpO₂", "Estabilizar e evitar intubação"],
        "interv": ["HFNC: Fluxo 40-60 L/min (Inicial)", "FiO₂: iniciar alto (1.0) e reduzir conforme SpO₂ (Titular)", "Posição sentada/tripé (Imediato)", "Reavaliar em 15-30-60 min: SpO₂, FR, esforço, consciência (Seriado)", "Escalonar para VNI ou via aérea invasiva se falha (Se necessário)"],
        "block": "🫁 BLOCO R1 — Oxigenoterapia, HFNC e VNI",
        "goals": ["Reduzir trabalho respiratório", "Melhorar SpO₂", "Estabilizar e evitar intubação"],
        "phases": [
          {"timeframe": "0-60 min", "interv": ["HFNC: Fluxo 40-60 L/min (Inicial)", "FiO₂: iniciar alto (1.0) e reduzir conforme SpO₂ (Titular)", "Primeiro: aumentar fluxo (↓FR e esforço) (Ajuste)", "Depois: reduzir FiO₂ mantendo SpO₂ (Gradual)", "Posição sentada/tripé (Imediato)"]},
          {"timeframe": "24h", "interv": ["Higiene brônquica se secreção (PRN)", "Controle ansiedade e conforto (Contínuo)", "Reavaliar em 15-30-60 min: SpO₂, FR, esforço, consciência (Seriado)", "CRITÉRIOS DE FALHA: FR > 30, esforço não reduz, SpO₂ instável, rebaixamento (Vigilância)", "Escalonar para VNI ou via aérea invasiva se falha (Se necessário)"]}
        ]
      },
      {
        "name": "R1.3 — Insuficiência respiratória com componente ventilatório (hipercapnia)",
        "desc": "Crítico. PaCO₂ elevada + pH < 7,35, sonolência, FR alta com baixa efetividade",
        "assess": ["Reduzir trabalho respiratório", "Melhorar pH e ventilação alveolar", "Reverter falência ventilatória e evitar intubação"],
        "interv": ["VNI: IPAP 10-14 cmH₂O (subir conforme resposta) (Inicial)", "EPAP: 4-6 cmH₂O (Inicial)", "FiO₂: titular para SpO₂ alvo (Ajustar)", "Ajustar por: Vt espontâneo, FR, conforto, gasometria, vazamento (Fino)", "CRITÉRIOS DE FALHA: piora consciência, instabilidade, intolerância, pH/CO₂ piora (Alerta IOT)"],
        "block": "🫁 BLOCO R1 — Oxigenoterapia, HFNC e VNI",
        "goals": ["Reduzir trabalho respiratório", "Melhorar pH e ventilação alveolar", "Reverter falência ventilatória e evitar intubação"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["VNI: IPAP 10-14 cmH₂O (subir conforme resposta) (Inicial)", "EPAP: 4-6 cmH₂O (Inicial)", "FiO₂: titular para SpO₂ alvo (Ajustar)", "Objetivo: IPAP ↑Vt → ↓PaCO₂, EPAP melhora oxigenação (Fisiológico)"]},
          {"timeframe": "24-48h", "interv": ["Ajustar por: Vt espontâneo, FR, conforto, gasometria, vazamento (Fino)", "Ajuste interface e vedação (Contínuo)", "Pausas programadas (higiene/conforto) (Planejado)", "Higiene brônquica antes de longos períodos (Preventivo)", "Monitorar primeiras 1-2h: FR, SpO₂, consciência, fadiga, gaso (Intensivo)", "CRITÉRIOS DE FALHA: piora consciência, instabilidade, intolerância, pH/CO₂ piora (Alerta IOT)"]}
        ]
      },
      {
        "name": "R1.4 — Intolerância à interface / falha de adaptação",
        "desc": "Moderado. Ansiedade, vazamento, dor facial, claustrofobia, lesão pele",
        "assess": ["Manter suporte não invasivo por blocos progressivos"],
        "interv": ["Trocar tipo/tamanho interface (Testar opções)", "Ajustar tirantes e vazamentos (Fino)", "Adaptação gradual com pausas programadas (Progressivo)", "Umidificação adequada (Ajustar)"],
        "block": "🫁 BLOCO R1 — Oxigenoterapia, HFNC e VNI",
        "goals": ["Manter suporte não invasivo por blocos progressivos"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["Trocar tipo/tamanho interface (Testar opções)", "Ajustar tirantes e vazamentos (Fino)", "Adaptação gradual com pausas programadas (Progressivo)", "Umidificação adequada (Ajustar)"]}
        ]
      },
      {
        "name": "R1.5 — Dependência prolongada de oxigênio",
        "desc": "Moderado. Paciente estável mas não reduz O₂ sem dessaturar",
        "assess": ["Reduzir progressivamente necessidade de O₂"],
        "interv": ["Avaliar causa: descondicionamento, atelectasia, congestão, shunt (Investigar)", "Mobilização progressiva (2-3x/dia)", "Reexpansão pulmonar (Exercícios)", "Treino funcional com monitorização SpO₂ (Gradual)", "Ajustar O₂ durante esforço, não só repouso (Dinâmico)"],
        "block": "🫁 BLOCO R1 — Oxigenoterapia, HFNC e VNI",
        "goals": ["Reduzir progressivamente necessidade de O₂"],
        "phases": [
          {"timeframe": "3-7 dias", "interv": ["Avaliar causa: descondicionamento, atelectasia, congestão, shunt (Investigar)", "Mobilização progressiva (2-3x/dia)", "Reexpansão pulmonar (Exercícios)", "Treino funcional com monitorização SpO₂ (Gradual)", "Ajustar O₂ durante esforço, não só repouso (Dinâmico)"]}
        ]
      },
      {
        "name": "R2.1 — Tosse ineficaz",
        "desc": "Grave. PCF < 160 L/min (alto risco < 60 inútil), PEmáx < 60 cmH₂O, secreção sem aspiração",
        "assess": ["Aumentar fluxo tosse efetivo", "Eliminar secreção sem dessaturar", "PCF > 160 L/min (ou > 100)", "PEmáx progressiva"],
        "interv": ["Medir: PCF, PEmáx, PImáx (Inicial)", "Treino muscular expiratório: POWERbreathe 30-50% PEmáx (2-3 séries 10-15 rep, 1-2x/dia)", "Treino tosse: inspiração profunda → pausa → expiração explosiva (Sessões)", "Tosse assistida manual (compressão sincronizada) (Se necessário)", "Se PCF < 60: tosse assistida mecânica + higiene programada (Obrigatório)"],
        "block": "🫁 BLOCO R2 — Via aérea, secreção e higiene brônquica",
        "goals": ["Aumentar fluxo tosse efetivo", "Eliminar secreção sem dessaturar", "PCF > 160 L/min (ou > 100)", "PEmáx progressiva"],
        "phases": [
          {"timeframe": "Sessão/24h", "interv": ["Medir obrigatório: PCF, PEmáx, PImáx (Inicial)", "Avaliar: dor, consciência, coordenação (Inicial)"]},
          {"timeframe": "3-7 dias", "interv": ["Treino muscular expiratório: POWERbreathe carga 30-50% PEmáx (2-3 séries 10-15 rep, 1-2x/dia)", "Treino tosse: inspiração profunda → pausa → expiração explosiva (Sessões)", "Huffing dirigido (Técnica)", "Tosse assistida manual (compressão sincronizada) (Se necessário)", "Se PCF < 60: tosse assistida mecânica + higiene programada (Obrigatório)", "Reavaliar PCF e PEmáx (A cada 48-72h)"]}
        ]
      },
      {
        "name": "R2.2 — Hipoventilação / baixo volume corrente em respiração espontânea",
        "desc": "Moderado. VC < 5-7 mL/kg, VE baixo, FR alta padrão superficial, atelectasia basal",
        "assess": ["Aumentar volume corrente", "Melhorar expansibilidade", "Normalizar padrão ventilatório", "Prevenir atelectasia"],
        "interv": ["Ventilometria: VC, VE (Inicial)", "Exercícios ventilatórios: inspiração lenta profunda, fracionada (Sessões)", "Posicionamento: sedestação, ortostatismo precoce (Progressivo)", "Mobilização global (2-3x/dia)", "Critério sucesso: VC ↑, FR ↓, SpO₂ melhora (Avaliar)"],
        "block": "🫁 BLOCO R2 — Via aérea, secreção e higiene brônquica",
        "goals": ["Aumentar volume corrente", "Melhorar expansibilidade", "Normalizar padrão ventilatório", "Prevenir atelectasia"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["Ventilometria: VC, VE (Inicial)", "Avaliar: dor, mobilidade torácica, consciência (Inicial)", "Exercícios ventilatórios: inspiração lenta profunda, fracionada (Sessões)", "Inspirometria incentivo (se aplicável) (Uso)", "Posicionamento: sedestação, ortostatismo precoce (Progressivo)", "Mobilização global (2-3x/dia)"]},
          {"timeframe": "3-5 dias", "interv": ["Repetir ventilometria (Diário)", "Critério sucesso: VC ↑, FR ↓, SpO₂ melhora (Avaliar)"]}
        ]
      },
      {
        "name": "R2.3 — Fraqueza muscular respiratória",
        "desc": "Grave. PImáx < -60 cmH₂O (< -30 grave), desmame difícil, tosse fraca",
        "assess": ["Iniciar treino muscular respiratório", "Aumentar PImáx e PEmáx", "Resistência ao esforço"],
        "interv": ["TMI: POWERbreathe carga 30-50% PImáx (2x/dia, 2-3 séries 10-15 rep)", "Progressão carga (A cada 3-5 dias)", "Mobilização global (2-3x/dia)", "Medir PImáx/PEmáx (A cada 5-7 dias)"],
        "block": "🫁 BLOCO R2 — Via aérea, secreção e higiene brônquica",
        "goals": ["Iniciar treino muscular respiratório", "Aumentar PImáx e PEmáx", "Resistência ao esforço"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["TMI: POWERbreathe carga 30-50% PImáx (2x/dia, 2-3 séries 10-15 rep)", "Progressão carga (A cada 3-5 dias)"]},
          {"timeframe": "7-14 dias", "interv": ["Mobilização global (2-3x/dia)", "Treino funcional (Progressivo)", "Controle dor e ansiedade (Contínuo)", "Medir PImáx/PEmáx (A cada 5-7 dias)"]}
        ]
      },
      {
        "name": "R2.4 — Secreção espessa / desidratada",
        "desc": "Moderado. Aspiração difícil, secreção seca/aderida, umidificação inadequada",
        "assess": ["Reduzir viscosidade", "Facilitar remoção"],
        "interv": ["Corrigir umidificação (Imediato)", "Avaliar hidratação sistêmica (com equipe) (Verificar)", "Higiene brônquica frequente (Aumentar)", "Evitar aspiração traumática repetitiva (Cuidado)"],
        "block": "🫁 BLOCO R2 — Via aérea, secreção e higiene brônquica",
        "goals": ["Reduzir viscosidade", "Facilitar remoção"],
        "phases": [
          {"timeframe": "24h", "interv": ["Corrigir umidificação (Imediato)", "Avaliar hidratação sistêmica (com equipe) (Verificar)", "Higiene brônquica frequente (Aumentar)", "Evitar aspiração traumática repetitiva (Cuidado)"]}
        ]
      },
      {
        "name": "R2.5 — Atelectasia por retenção / hipoventilação",
        "desc": "Grave. RX colapso segmentar/lobar, MV reduzido, hipoxemia",
        "assess": ["Reexpandir área colapsada", "Restaurar ventilação regional"],
        "interv": ["Posicionamento: pulmão afetado para cima (A cada 2-4h)", "Exercícios reexpansão (Sessões)", "Se em VM: MRA + PEEP adequada (Se indicado)", "Reavaliar clínica e imagem (Diário)"],
        "block": "🫁 BLOCO R2 — Via aérea, secreção e higiene brônquica",
        "goals": ["Reexpandir área colapsada", "Restaurar ventilação regional"],
        "phases": [
          {"timeframe": "48-72h", "interv": ["Posicionamento: pulmão afetado para cima (A cada 2-4h)", "Exercícios reexpansão (Sessões)", "Se em VM: MRA + PEEP adequada (Se indicado)", "Reavaliar clínica e imagem (Diário)"]}
        ]
      },
      {
        "name": "R2.6 — Pressão de cuff inadequada",
        "desc": "Moderado. Pcuff < 20 cmH₂O (vazamento, risco aspiração) ou > 30 cmH₂O (lesão traqueal)",
        "assess": ["Ajustar Pcuff 20-30 cmH₂O", "Prevenir aspiração e lesão traqueal", "Monitorar Pcuff continuamente"],
        "interv": ["Medir Pcuff com cufômetro (Imediato)", "Meta: 20-30 cmH₂O (ideal 25 cmH₂O) (Alvo)", "Reavaliar Pcuff a cada plantão (12/12h) (Rotina)", "Registrar valor de Pcuff em prontuário (Toda medição)"],
        "block": "🫁 BLOCO R2 — Via aérea, secreção e higiene brônquica",
        "goals": ["Ajustar Pcuff 20-30 cmH₂O", "Prevenir aspiração e lesão traqueal", "Monitorar Pcuff continuamente"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Medir Pcuff com cufômetro (Imediato)", "Ajustar volume do cuff (inflar/desflar) (Titular)", "Meta: 20-30 cmH₂O (ideal 25 cmH₂O) (Alvo)", "Verificar vazamento (Vt exp vs insp) (Após ajuste)", "Auscultar região glótica (ouvir escape de ar) (Confirmação)"]},
          {"timeframe": "Contínuo", "interv": ["Reavaliar Pcuff a cada plantão (12/12h) (Rotina)", "Ajustar PRN (após mudança decúbito, tosse) (PRN)", "Se vazamento persistente: comunicar médico (troca TOT/TQT?) (Se necessário)", "Registrar valor de Pcuff em prontuário (Toda medição)"]}
        ]
      },
      {
        "name": "R2.7 — Risco de aspiração / disfagia",
        "desc": "Grave. Rebaixamento, histórico AVE/TRM, falha teste deglutição, FOIS < 5, reflexo tosse/deglutição abolido",
        "assess": ["Prevenir pneumonia aspirativa", "Avaliar deglutição pré-extubação"],
        "interv": ["Cabeceira ≥ 30-45° (SEMPRE!) (Contínuo)", "Higiene oral rigorosa 3-4x/dia (Rotina)", "Manter Pcuff adequado (20-30 cmH₂O) (Contínuo)", "Teste tosse voluntária (força e eficácia) (Pré-extubação)", "Considerar TQT se disfagia grave + VM prolongada (Discutir com equipe)"],
        "block": "🫁 BLOCO R2 — Via aérea, secreção e higiene brônquica",
        "goals": ["Prevenir pneumonia aspirativa", "Avaliar deglutição pré-extubação"],
        "phases": [
          {"timeframe": "Contínuo", "interv": ["Cabeceira ≥ 30-45° (SEMPRE!) (Contínuo)", "Higiene oral rigorosa 3-4x/dia (Rotina)", "Aspiração orofaríngea PRN (evitar acúmulo saliva) (PRN)", "Manter Pcuff adequado (20-30 cmH₂O) (Contínuo)", "Observar secreção (se ↑ volume súbito → aspiração?) (Vigilância)"]},
          {"timeframe": "Antes extubação", "interv": ["Teste tosse voluntária (força e eficácia) (Pré-extubação)", "Teste deglutição água 3-10ml (se acordado) (Pré-extubação)", "Observar: tosse, engasgo, mudança voz, dessaturação (Durante teste)", "Se falha: adiar extubação, solicitar avaliação fonoaudiologia (Se necessário)", "Considerar TQT se disfagia grave + VM prolongada (Discutir com equipe)"]}
        ]
      },
      {
        "name": "R3.1 — IRA hipoxêmica",
        "desc": "Crítico. SpO₂ < 90-92% ar ambiente, PaO₂ < 60 mmHg, PaO₂/FiO₂ < 300",
        "assess": ["Corrigir hipoxemia", "Reduzir trabalho respiratório", "Estabilizar SpO₂"],
        "interv": ["Escalonamento: cateter → máscara → reservatório → HFNC → VNI → VM (Menor eficaz)", "O₂: titular SpO₂ alvo (92-96% ou 88-92% DPOC) (Ajustar)", "HFNC: fluxo 40-60 L/min, FiO₂ alto e reduzir (Se indicado)", "Posicionamento terapêutico (Contínuo)", "FALHA: FR > 30, esforço ↑, rebaixamento, PaO₂/FiO₂ < 150 → escalar (Vigilância)"],
        "block": "🫁 BLOCO R3 — Insuficiência respiratória aguda",
        "goals": ["Corrigir hipoxemia", "Reduzir trabalho respiratório", "Estabilizar SpO₂", "Reduzir dependência O₂", "Tratar causa base"],
        "phases": [
          {"timeframe": "0-60 min", "interv": ["Avaliação: SpO₂ contínua, FR/FC, gasometria, RX/TC, esforço (Inicial)", "Escalonamento: cateter → máscara → reservatório → HFNC → VNI → VM (Menor eficaz)", "O₂: titular SpO₂ alvo (92-96% ou 88-92% DPOC) (Ajustar)", "HFNC: fluxo 40-60 L/min, FiO₂ alto e reduzir (Se indicado)", "VNI: EPAP 5-10, IPAP conforme esforço (Se indicado)"]},
          {"timeframe": "24-48h", "interv": ["Posicionamento terapêutico (Contínuo)", "Mobilização precoce (se estável) (2-3x/dia)", "Higiene brônquica se secreção (PRN)", "Exercícios ventilatórios se hipoventilação (Se indicado)", "Reavaliar (15-30-60 min inicial, depois 2-4h)", "FALHA: FR > 30, esforço ↑, rebaixamento, PaO₂/FiO₂ < 150 → escalar (Vigilância)"]}
        ]
      },
      {
        "name": "R3.2 — IRA hipercápnica",
        "desc": "Crítico. PaCO₂ > 45 mmHg, pH < 7,35, sonolência/confusão/asterixis",
        "assess": ["Melhorar ventilação alveolar", "Corrigir acidose", "Reverter causa"],
        "interv": ["VNI primeira escolha: IPAP 10-14, EPAP 4-6 (Inicial)", "Ajustar IPAP por: Vt, FR, PaCO₂ (Fino)", "Gasometria em 1-2h (Seriado)", "FALHA: pH piora, rebaixamento, intolerância → VM invasiva (Alerta)"],
        "block": "🫁 BLOCO R3 — Insuficiência respiratória aguda",
        "goals": ["Melhorar ventilação alveolar", "Corrigir acidose", "Reduzir suporte", "Reverter causa"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Avaliação: gasometria seriada, FR/SpO₂, consciência, PImáx/PEmáx (Inicial)", "VNI primeira escolha: IPAP 10-14, EPAP 4-6 (Inicial)", "Ajustar IPAP por: Vt, FR, PaCO₂ (Fino)", "Interface e vedação (Ajuste)", "Pausas programadas (Planejado)", "Higiene brônquica se secreção (PRN)"]},
          {"timeframe": "24-48h", "interv": ["Controle ansiedade/conforto (Contínuo)", "Gasometria em 1-2h (Seriado)", "Sucesso: pH ↑, CO₂ ↓, FR ↓, consciência melhora (Avaliar)", "FALHA: pH piora, rebaixamento, intolerância, instabilidade → VM invasiva (Alerta)"]}
        ]
      },
      {
        "name": "R3.3 — IRA mista (hipoxêmica + hipercápnica)",
        "desc": "Crítico. PaO₂ baixa + PaCO₂ alta + pH alterado, quadro grave",
        "assess": ["Estabilizar oxigenação e ventilação simultaneamente"],
        "interv": ["HFNC ou VNI conforme perfil (Inicial)", "Baixo limiar para VM invasiva (Vigilância)", "Monitorização intensiva (Contínuo)", "Tratar causa base agressivamente (Urgente)"],
        "block": "🫁 BLOCO R3 — Insuficiência respiratória aguda",
        "goals": ["Estabilizar oxigenação e ventilação simultaneamente"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["HFNC ou VNI conforme perfil (Inicial)", "Baixo limiar para VM invasiva (Vigilância)", "Monitorização intensiva (Contínuo)", "Tratar causa base agressivamente (Urgente)"]}
        ]
      },
      {
        "name": "R3.4 — Fadiga muscular respiratória",
        "desc": "Crítico. FR > 35, musculatura acessória, sudorese, paradoxo, PImáx < -30, Vt caindo",
        "assess": ["Reduzir trabalho respiratório imediatamente", "Prevenir parada"],
        "interv": ["Suporte ventilatório (HFNC/VNI/VM conforme gravidade) (Urgente)", "Evitar exercícios nesse momento (Contraindicado)", "Treino muscular inspiratório (Quando estável)"],
        "block": "🫁 BLOCO R3 — Insuficiência respiratória aguda",
        "goals": ["Reduzir trabalho respiratório imediatamente", "Prevenir parada", "Após estabilização: iniciar TMI progressivo"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Suporte ventilatório (HFNC/VNI/VM conforme gravidade) (Urgente)", "Evitar exercícios nesse momento (Contraindicado)"]},
          {"timeframe": "48-72h", "interv": ["Treino muscular inspiratório (Quando estável)"]}
        ]
      },
      {
        "name": "R3.5 — Falência respiratória iminente",
        "desc": "Crítico. Rebaixamento, exaustão, instabilidade hemodinâmica, gasometria grave",
        "assess": ["Garantir via aérea e ventilação"],
        "interv": ["Preparar VM invasiva (Urgente)", "Pré-oxigenação (Antes IOT)", "Auxiliar equipe via aérea (Suporte)", "Pós-intubação: protocolo VM protetora (R4) (Seguir)"],
        "block": "🫁 BLOCO R3 — Insuficiência respiratória aguda",
        "goals": ["Garantir via aérea e ventilação"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Preparar VM invasiva (Urgente)", "Pré-oxigenação (Antes IOT)", "Auxiliar equipe via aérea (Suporte)", "Pós-intubação: protocolo VM protetora (R4) (Seguir)"]}
        ]
      },
      {
        "name": "R4-A1 — VM fora da zona protetora (risco de VILI)",
        "desc": "Crítico. Vt > 8 mL/kg PBW, Pplatô > 30 cmH₂O, ΔP > 15, SI < 0,9 ou > 1,1, Cest < 30",
        "assess": ["Vt = 4-6 mL/kg PBW", "Pplatô ≤ 30", "ΔP < 15", "SpO₂ alvo com menor FiO₂"],
        "interv": ["Medir por plantão: Vt (mL/kg PBW), Pplatô, PEEP, ΔP, Cest, curvas/loops, gasometria (Obrigatório)", "Reduzir Vt stepwise até PBW-alvo, aceitar hipercapnia permissiva se pH ≥ 7,20 (Proteção)", "Titular PEEP: testar 8-10-12-14… escolher melhor Cest, menor ΔP, melhor SpO₂, sem ↓PAM (Titulação)", "Pronação se SDRA/hipoxemia grave (Se PaO₂/FiO₂ < 150)"],
        "block": "🧠 BLOCO R4-A — VM: Mecânica e proteção pulmonar",
        "goals": ["Vt = 4-6 mL/kg PBW", "Pplatô ≤ 30", "ΔP < 15", "SpO₂ alvo com menor FiO₂", "Melhorar/estabilizar Cest", "Reduzir FiO₂"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Medir por plantão: Vt (mL/kg PBW), Pplatô, PEEP, ΔP, Cest, curvas/loops, gasometria (Obrigatório)", "Reduzir Vt stepwise até PBW-alvo, aceitar hipercapnia permissiva se pH ≥ 7,20 (Proteção)", "Se Pplatô > 30 → reduzir Vt, avaliar parede/abdome (Correção)", "Se ΔP > 15 → reduzir Vt, testar PEEP por Cest/ΔP (Ajuste)", "Titular PEEP: testar 8-10-12-14… escolher melhor Cest, menor ΔP, melhor SpO₂, sem ↓PAM (Titulação)", "Recrutamento alveolar se indicado (nunca sem PEEP manutenção) (Se colapso)", "Pronação se SDRA/hipoxemia grave (Se PaO₂/FiO₂ < 150)"]},
          {"timeframe": "24-72h", "interv": ["Monitorizar mecânica pulmonar (Vigilância)"]}
        ]
      },
      {
        "name": "R4-A2 — Driving pressure elevado",
        "desc": "Crítico. ΔP > 15 cmH₂O",
        "assess": ["Reduzir ΔP para < 15 (ideal < 12)"],
        "interv": ["Reduzir Vt (Primeira ação)", "Testar PEEP para melhorar Cest (Titulação)", "Avaliar limitação parede/abdome (Investigar)", "Se necessário: aceitar Vt ultrabaixo (Proteção)"],
        "block": "🧠 BLOCO R4-A — VM: Mecânica e proteção pulmonar",
        "goals": ["Reduzir ΔP para < 15 (ideal < 12)"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Reduzir Vt (Primeira ação)", "Testar PEEP para melhorar Cest (Titulação)", "Avaliar limitação parede/abdome (Investigar)", "Se necessário: aceitar Vt ultrabaixo (Proteção)"]}
        ]
      },
      {
        "name": "R4-A3 — Pressão de platô elevada",
        "desc": "Grave. Pplatô > 30 cmH₂O",
        "assess": ["Manter Pplatô ≤ 30 (ideal < 28)"],
        "interv": ["Reduzir Vt (Ajuste)", "Rever PEEP (Avaliar)", "Avaliar pressão abdominal (Investigar)"],
        "block": "🧠 BLOCO R4-A — VM: Mecânica e proteção pulmonar",
        "goals": ["Manter Pplatô ≤ 30 (ideal < 28)"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Reduzir Vt (Ajuste)", "Rever PEEP (Avaliar)", "Avaliar pressão abdominal (Investigar)"]}
        ]
      },
      {
        "name": "R4-A4 — Volume corrente excessivo",
        "desc": "Grave. Vt > 8 mL/kg PBW",
        "assess": ["Ajustar Vt para 4-6 mL/kg PBW"],
        "interv": ["Recalcular PBW por sexo e altura (Cálculo)", "Ajustar Vt no ventilador (Programar)", "Reavaliar gasometria e mecânica (30-60 min)"],
        "block": "🧠 BLOCO R4-A — VM: Mecânica e proteção pulmonar",
        "goals": ["Ajustar Vt para 4-6 mL/kg PBW"],
        "phases": [
          {"timeframe": "0-1h", "interv": ["Recalcular PBW por sexo e altura (Cálculo)", "Ajustar Vt no ventilador (Programar)", "Reavaliar gasometria e mecânica (30-60 min)"]}
        ]
      },
      {
        "name": "R4-A5 — Complacência pulmonar muito baixa",
        "desc": "Grave. Cest < 30 mL/cmH₂O",
        "assess": ["Melhorar recrutamento", "Minimizar estresse"],
        "interv": ["Titular PEEP por melhor Cest (Teste)", "Pronação se SDRA (Indicado)", "MRA se indicado (Se recrutável)"],
        "block": "🧠 BLOCO R4-A — VM: Mecânica e proteção pulmonar",
        "goals": ["Melhorar recrutamento", "Minimizar estresse"],
        "phases": [
          {"timeframe": "2-6h", "interv": ["Titular PEEP por melhor Cest (Teste)", "Pronação se SDRA (Indicado)", "MRA se indicado (Se recrutável)"]}
        ]
      },
      {
        "name": "R4-A6 — Stress index alterado",
        "desc": "Moderado. SI < 0,9 (colapso) ou SI > 1,1 (hiperdistensão)",
        "assess": ["Manter SI entre 0,9-1,1"],
        "interv": ["Se SI < 0,9 → subir PEEP (Ajuste)", "Se SI > 1,1 → reduzir PEEP ou Vt (Ajuste)"],
        "block": "🧠 BLOCO R4-A — VM: Mecânica e proteção pulmonar",
        "goals": ["Manter SI entre 0,9-1,1"],
        "phases": [
          {"timeframe": "1-2h", "interv": ["Se SI < 0,9 → subir PEEP (Ajuste)", "Se SI > 1,1 → reduzir PEEP ou Vt (Ajuste)"]}
        ]
      },
      {
        "name": "R4-A7 — Hiperinsuflação / hiperdistensão global",
        "desc": "Grave. Curvas achatadas, ΔP alto, Cest piora ao subir PEEP",
        "assess": ["Reduzir volumes pulmonares finais"],
        "interv": ["Reduzir PEEP (Ajuste)", "Reduzir Vt (Ajuste)", "Reavaliar hemodinâmica (Monitorar)"],
        "block": "🧠 BLOCO R4-A — VM: Mecânica e proteção pulmonar",
        "goals": ["Reduzir volumes pulmonares finais"],
        "phases": [
          {"timeframe": "0-1h", "interv": ["Reduzir PEEP (Ajuste)", "Reduzir Vt (Ajuste)", "Reavaliar hemodinâmica (Monitorar)"]}
        ]
      },
      {
        "name": "R4-B1 — Hipoxemia refratária em VM",
        "desc": "Crítico. PaO₂/FiO₂ < 150, SpO₂ < 90% com FiO₂ ≥ 0,8",
        "assess": ["Aumentar PaO₂/FiO₂", "Reduzir FiO₂ < 0,6"],
        "interv": ["Confirmar mecanismo: RX/TC, curvas, Cest (Investigar)", "Otimizar PEEP (Titular)", "Pronação se PaO₂/FiO₂ < 150 (Fortemente indicado)", "Posicionamento: cabeceira elevada (Ajustar)"],
        "block": "🫁 BLOCO R4-B — VM: Oxigenação e recrutamento",
        "goals": ["Aumentar PaO₂/FiO₂", "Reduzir FiO₂ < 0,6"],
        "phases": [
          {"timeframe": "1-6h", "interv": ["Confirmar mecanismo: RX/TC, curvas, Cest (Investigar)", "Otimizar PEEP (Titular)", "Considerar MRA se recrutável (Se indicado)", "Pronação se PaO₂/FiO₂ < 150 (Fortemente indicado)", "Posicionamento: cabeceira elevada (Ajustar)"]}
        ]
      },
      {
        "name": "R4-B2 — PEEP insuficiente (colapso)",
        "desc": "Grave. SI < 0,9, Cest melhora ao subir PEEP",
        "assess": ["Manter pulmão aberto", "Reduzir colapso cíclico"],
        "interv": ["Titulação PEEP: testar 8→10→12→14 (Protocolo)", "Escolher: melhor Cest, menor ΔP, sem ↓PAM (Critérios)", "Usar SI: < 0,9 → subir PEEP (Guia)"],
        "block": "🫁 BLOCO R4-B — VM: Oxigenação e recrutamento",
        "goals": ["Manter pulmão aberto", "Reduzir colapso cíclico"],
        "phases": [
          {"timeframe": "1-2h", "interv": ["Titulação PEEP: testar 8→10→12→14 (Protocolo)", "Escolher: melhor Cest, menor ΔP, sem ↓PAM (Critérios)", "Usar SI: < 0,9 → subir PEEP (Guia)"]}
        ]
      },
      {
        "name": "R4-B3 — PEEP excessiva (hiperdistensão)",
        "desc": "Grave. SI > 1,1, ΔP ↑ ao subir PEEP, hipotensão",
        "assess": ["Reduzir hiperdistensão"],
        "interv": ["Reduzir PEEP em degraus de 2 cmH₂O (Gradual)", "Reavaliar: Cest, ΔP, SpO₂, PAM (Após ajuste)"],
        "block": "🫁 BLOCO R4-B — VM: Oxigenação e recrutamento",
        "goals": ["Reduzir hiperdistensão"],
        "phases": [
          {"timeframe": "0-1h", "interv": ["Reduzir PEEP em degraus de 2 cmH₂O (Gradual)", "Reavaliar: Cest, ΔP, SpO₂, PAM (Após ajuste)"]}
        ]
      },
      {
        "name": "R4-B4 — Pulmão recrutável vs não recrutável",
        "desc": "Moderado. Avaliação por: curva P×V, resposta Cest, MRA, TC",
        "assess": ["Identificar estratégia correta"],
        "interv": ["Recrutável: usar MRA + PEEP manutenção (Estratégia)", "Não recrutável: pressão mínima + pronação (Estratégia)"],
        "block": "🫁 BLOCO R4-B — VM: Oxigenação e recrutamento",
        "goals": ["Identificar estratégia correta"],
        "phases": [
          {"timeframe": "2-6h", "interv": ["Recrutável: usar MRA + PEEP manutenção (Estratégia)", "Não recrutável: pressão mínima + pronação (Estratégia)"]}
        ]
      },
      {
        "name": "R4-B5 — Manobra de recrutamento alveolar",
        "desc": "Grave. Indicações: atelectasia, queda Cest, pós-desconexão",
        "assess": ["Abrir unidades colapsadas"],
        "interv": ["Contraindicações: pneumotórax, choque, VD falente (Verificar)", "Monitorar SpO₂, PAM, FC (Durante MRA)", "Fixar PEEP acima ponto colapso (Após MRA)"],
        "block": "🫁 BLOCO R4-B — VM: Oxigenação e recrutamento",
        "goals": ["Abrir unidades colapsadas"],
        "phases": [
          {"timeframe": "15-30 min", "interv": ["Contraindicações: pneumotórax, choque, VD falente (Verificar)", "Monitorar SpO₂, PAM, FC (Durante MRA)", "Fixar PEEP acima ponto colapso (Após MRA)"]}
        ]
      },
      {
        "name": "R4-B6 — Pronação",
        "desc": "Crítico. PaO₂/FiO₂ < 150-200, SDRA",
        "assess": ["Aumentar PaO₂/FiO₂", "Reduzir FiO₂"],
        "interv": ["Prona por 16-20h/dia em SDRA (Protocolo)", "Fisio: proteger tubo, posicionamento (Técnica)", "Higiene brônquica antes/depois (PRN)"],
        "block": "🫁 BLOCO R4-B — VM: Oxigenação e recrutamento",
        "goals": ["Aumentar PaO₂/FiO₂", "Reduzir FiO₂"],
        "phases": [
          {"timeframe": "16-20h/dia", "interv": ["Prona por 16-20h/dia em SDRA (Protocolo)", "Fisio: proteger tubo, posicionamento (Técnica)", "Higiene brônquica antes/depois (PRN)"]}
        ]
      },
      {
        "name": "R4-B7 — Consolidação / shunt não recrutável",
        "desc": "Grave. Consolidação extensa, Cest não melhora",
        "assess": ["Otimizar oxigenação sem VILI"],
        "interv": ["Não forçar PEEP alta (Evitar)", "PEEP moderada + pronação (Estratégia)", "Aguardar resolução causa base (Suporte)"],
        "block": "🫁 BLOCO R4-B — VM: Oxigenação e recrutamento",
        "goals": ["Otimizar oxigenação sem VILI"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Não forçar PEEP alta (Evitar)", "PEEP moderada + pronação (Estratégia)", "Aguardar resolução causa base (Suporte)"]}
        ]
      },
      {
        "name": "R4-C1 — Hipercapnia / acidose respiratória",
        "desc": "Grave. PaCO₂ > 50 mmHg e/ou pH < 7,30",
        "assess": ["pH ≥ 7,25", "Evitar ↑ΔP/Pplatô"],
        "interv": ["Confirmar se permissível ou inaceitável (HIC/TCE/arritmias) (Avaliar)", "1º: ajustar FR (se não gera autoPEEP) (Gradual)", "2º: reduzir Vd (assincronias, posição, higiene) (Eficiência)", "Reavaliar gasometria 30-60 min (Seriado)"],
        "block": "🌬️ BLOCO R4-C — VM: Controle ventilatório (CO₂)",
        "goals": ["pH ≥ 7,25", "Evitar ↑ΔP/Pplatô"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Confirmar se permissível ou inaceitável (HIC/TCE/arritmias) (Avaliar)", "1º: ajustar FR (se não gera autoPEEP) (Gradual)", "2º: reduzir Vd (assincronias, posição, higiene) (Eficiência)", "Reavaliar gasometria 30-60 min (Seriado)"]}
        ]
      },
      {
        "name": "R4-C2 — Espaço morto aumentado",
        "desc": "Grave. PaCO₂ alto apesar VE alto, TEP/choque",
        "assess": ["Melhorar eficiência ventilatória"],
        "interv": ["Revisar PEEP (excessiva pode ↑Vd) (Ajustar)", "Pronação (melhora VA/Q) (Otimizar)", "Tratar causas: hemodinâmica, TEP (Investigar)"],
        "block": "🌬️ BLOCO R4-C — VM: Controle ventilatório (CO₂)",
        "goals": ["Melhorar eficiência ventilatória"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["Revisar PEEP (excessiva pode ↑Vd) (Ajustar)", "Pronação (melhora VA/Q) (Otimizar)", "Tratar causas: hemodinâmica, TEP (Investigar)"]}
        ]
      },
      {
        "name": "R4-C3 — Hipercapnia permissiva",
        "desc": "Moderado. Proteção pulmonar Vt baixo, ΔP limite",
        "assess": ["Manter pH tolerável sem ultrapassar proteção"],
        "interv": ["Definir alvo pH (≥ 7,20-7,25) (Estabelecer)", "Manter ventilação protetora (Prioridade)", "Monitorar repercussão clínica (Vigilância)"],
        "block": "🌬️ BLOCO R4-C — VM: Controle ventilatório (CO₂)",
        "goals": ["Manter pH tolerável sem ultrapassar proteção"],
        "phases": [
          {"timeframe": "Contínuo", "interv": ["Definir alvo pH (≥ 7,20-7,25) (Estabelecer)", "Manter ventilação protetora (Prioridade)", "Monitorar repercussão clínica (Vigilância)"]}
        ]
      },
      {
        "name": "R4-D1 — Assincronia significativa",
        "desc": "Grave. Double trigger, esforço inefetivo, Vt irregular",
        "assess": ["Reduzir assincronia", "Vt/pressões seguras"],
        "interv": ["Ver curvas P×T, F×T, loops (Diagnóstico)", "Checar circuito, água, secreção (Mecânico)", "Identificar tipo e corrigir (Ajustar)"],
        "block": "🔁 BLOCO R4-D — VM: Assincronias",
        "goals": ["Reduzir assincronia", "Vt/pressões seguras"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Ver curvas P×T, F×T, loops (Diagnóstico)", "Checar circuito, água, secreção (Mecânico)", "Identificar tipo e corrigir (Ajustar)"]}
        ]
      },
      {
        "name": "R4-D2 — Flow starvation",
        "desc": "Moderado. Curva P×T côncava, esforço puxando",
        "assess": ["Satisfazer demanda inspiratória"],
        "interv": ["Aumentar fluxo inspiratório (Ajustar)", "Ajustar rampa/rise time (Ajustar)", "Checar resistência (Investigar)"],
        "block": "🔁 BLOCO R4-D — VM: Assincronias",
        "goals": ["Satisfazer demanda inspiratória"],
        "phases": [
          {"timeframe": "15-30 min", "interv": ["Aumentar fluxo inspiratório (Ajustar)", "Ajustar rampa/rise time (Ajustar)", "Checar resistência (Investigar)"]}
        ]
      },
      {
        "name": "R4-D3 — Double trigger",
        "desc": "Grave. Dois ciclos colados, Vt somado",
        "assess": ["Eliminar empilhamento volume"],
        "interv": ["Aumentar TI (Ajustar)", "Ajustar trigger (Ajustar)", "Tratar drive alto: dor, febre, hipoxemia (Causa)"],
        "block": "🔁 BLOCO R4-D — VM: Assincronias",
        "goals": ["Eliminar empilhamento volume"],
        "phases": [
          {"timeframe": "15-30 min", "interv": ["Aumentar TI (Ajustar)", "Ajustar trigger (Ajustar)", "Tratar drive alto: dor, febre, hipoxemia (Causa)"]}
        ]
      },
      {
        "name": "R4-D4 — Esforço inefetivo",
        "desc": "Moderado. Deflexões sem disparar, autoPEEP",
        "assess": ["Melhorar disparo efetivo"],
        "interv": ["Ajustar trigger mais sensível (Ajustar)", "Reduzir autoPEEP (Otimizar)", "PEEP externa até 80% intrínseca (Se indicado)"],
        "block": "🔁 BLOCO R4-D — VM: Assincronias",
        "goals": ["Melhorar disparo efetivo"],
        "phases": [
          {"timeframe": "1-2h", "interv": ["Ajustar trigger mais sensível (Ajustar)", "Reduzir autoPEEP (Otimizar)", "PEEP externa até 80% intrínseca (Se indicado)"]}
        ]
      },
      {
        "name": "R4-D5 — Drive excessivo (P-SILI)",
        "desc": "Crítico. FR alta, Vt escapa alto, dor/febre",
        "assess": ["Reduzir esforço lesivo"],
        "interv": ["Corrigir causa: dor, febre, acidose, hipóxia (Tratar)", "Ajustar suporte para ↓trabalho (Otimizar)", "Monitorar Vt real e ΔP (Vigilância)"],
        "block": "🔁 BLOCO R4-D — VM: Assincronias",
        "goals": ["Reduzir esforço lesivo"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Corrigir causa: dor, febre, acidose, hipóxia (Tratar)", "Ajustar suporte para ↓trabalho (Otimizar)", "Monitorar Vt real e ΔP (Vigilância)"]}
        ]
      },
      {
        "name": "R4-E1 — AutoPEEP / PEEP intrínseca",
        "desc": "Grave. Fluxo não zera, PEEP intrínseca > 5",
        "assess": ["Fluxo zerar", "PEEP intrínseca ≤ 5"],
        "interv": ["Checar: secreção, tubo dobrado, filtro (Imediato)", "Reduzir FR, aumentar TE (I:E 1:3-1:5) (Ventilação)", "Tratar resistência e broncoespasmo (Causa)"],
        "block": "🌪️ BLOCO R4-E — VM: Obstrução e aprisionamento",
        "goals": ["Fluxo zerar", "PEEP intrínseca ≤ 5"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Checar: secreção, tubo dobrado, filtro (Imediato)", "Reduzir FR, aumentar TE (I:E 1:3-1:5) (Ventilação)", "Tratar resistência e broncoespasmo (Causa)"]}
        ]
      },
      {
        "name": "R4-E2 — Hiperinsuflação com choque",
        "desc": "Crítico. PAM cai, taquicardia, aprisionamento grave",
        "assess": ["Reverter hiperinsuflação urgente"],
        "interv": ["Aumentar TE, reduzir Vt (Urgente)", "Se grave: desconexão controlada (Emergência)", "Monitorar barotrauma (Vigilância)"],
        "block": "🌪️ BLOCO R4-E — VM: Obstrução e aprisionamento",
        "goals": ["Reverter hiperinsuflação urgente"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Aumentar TE, reduzir Vt (Urgente)", "Se grave: desconexão controlada (Emergência)", "Monitorar barotrauma (Vigilância)"]}
        ]
      },
      {
        "name": "R4-E3 — Broncoespasmo em VM",
        "desc": "Grave. Sibilos, PIP ↑ Pplatô normal, hipercapnia",
        "assess": ["Reduzir resistência", "Melhorar VA"],
        "interv": ["FR menor, TE maior (Ventilação)", "Broncodilatador com equipe (Farmacológico)", "Reavaliar curva fluxo (Seriado)"],
        "block": "🌪️ BLOCO R4-E — VM: Obstrução e aprisionamento",
        "goals": ["Reduzir resistência", "Melhorar VA"],
        "phases": [
          {"timeframe": "1-2h", "interv": ["FR menor, TE maior (Ventilação)", "Broncodilatador com equipe (Farmacológico)", "Reavaliar curva fluxo (Seriado)"]}
        ]
      },
      {
        "name": "R4-E4 — DPOC exacerbado",
        "desc": "Grave. DPOC + acidose + autoPEEP",
        "assess": ["pH ≥ 7,25", "Reduzir aprisionamento"],
        "interv": ["TE prolongado I:E 1:3-1:5 (Estratégia)", "Aceitar permissiva se pH OK (Protocolo)", "Planejar desmame precoce (Estratégia)"],
        "block": "🌪️ BLOCO R4-E — VM: Obstrução e aprisionamento",
        "goals": ["pH ≥ 7,25", "Reduzir aprisionamento"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["TE prolongado I:E 1:3-1:5 (Estratégia)", "Aceitar permissiva se pH OK (Protocolo)", "Planejar desmame precoce (Estratégia)"]}
        ]
      },
      {
        "name": "R4-E5 — Asma grave / status asmático",
        "desc": "Crítico. Resistência extrema, risco barotrauma",
        "assess": ["Evitar barotrauma", "pH tolerável"],
        "interv": ["Expiração longa: FR baixa, TE máximo (Protocolo)", "Broncodilatação agressiva + MgSO4 (Farmacológico)", "Monitorar barotrauma contínuo (Vigilância)"],
        "block": "🌪️ BLOCO R4-E — VM: Obstrução e aprisionamento",
        "goals": ["Evitar barotrauma", "pH tolerável"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Expiração longa: FR baixa, TE máximo (Protocolo)", "Broncodilatação agressiva + MgSO4 (Farmacológico)", "Monitorar barotrauma contínuo (Vigilância)"]}
        ]
      },
      {
        "name": "R4-E6 — Obstrução TOT/TQT",
        "desc": "Crítico. PIP sobe súbito, Vt cai, dessaturação",
        "assess": ["Restabelecer patência imediata"],
        "interv": ["Checar circuito/tubo, aspirar (Urgente)", "Ventilar manual se necessário (Resgate)", "Se não resolve: broncoscopia/troca (Emergência)"],
        "block": "🌪️ BLOCO R4-E — VM: Obstrução e aprisionamento",
        "goals": ["Restabelecer patência imediata"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Checar circuito/tubo, aspirar (Urgente)", "Ventilar manual se necessário (Resgate)", "Se não resolve: broncoscopia/troca (Emergência)"]}
        ]
      },
      {
        "name": "R4-F1 — Disfunção diafragmática",
        "desc": "Grave. MIP < -20/-30, eco: excursão < 10 mm",
        "assess": ["Recuperar força diafragmática"],
        "interv": ["Ecografia seriada (Diagnóstico)", "Evitar ventilação excessiva (Proteção)", "TRE diários quando estável (Estimular)", "TMI progressivo (Diário)"],
        "block": "🧠 BLOCO R4-F — VM: Neuro, sedação e diafragma",
        "goals": ["Recuperar força diafragmática"],
        "phases": [
          {"timeframe": "5-14 dias", "interv": ["Ecografia seriada (Diagnóstico)", "Evitar ventilação excessiva (Proteção)", "TRE diários quando estável (Estimular)", "TMI progressivo (Diário)"]}
        ]
      },
      {
        "name": "R4-F2 — VIDD (lesão diafragma por VM)",
        "desc": "Grave. VM passiva prolongada ou esforço excessivo",
        "assess": ["Prevenir lesão", "Ativar diafragma"],
        "interv": ["Evitar super/subassistência (Ajuste fino)", "Desmame precoce (Estratégia)", "TRE + mobilização (Diário)"],
        "block": "🧠 BLOCO R4-F — VM: Neuro, sedação e diafragma",
        "goals": ["Prevenir lesão", "Ativar diafragma"],
        "phases": [
          {"timeframe": "Contínuo", "interv": ["Evitar super/subassistência (Ajuste fino)", "Desmame precoce (Estratégia)", "TRE + mobilização (Diário)"]}
        ]
      },
      {
        "name": "R4-F3 — Delirium / agitação",
        "desc": "Grave. CAM-ICU+, risco autoextubação",
        "assess": ["Controlar delirium"],
        "interv": ["Sedação mínima com equipe (Farmacológico)", "Protocolo A-F Bundle (Protocolo)", "Mobilização precoce (Diário)"],
        "block": "🧠 BLOCO R4-F — VM: Neuro, sedação e diafragma",
        "goals": ["Controlar delirium"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["Sedação mínima com equipe (Farmacológico)", "Protocolo A-F Bundle (Protocolo)", "Mobilização precoce (Diário)"]}
        ]
      },
      {
        "name": "R4-F4 — Sedação profunda",
        "desc": "Moderado. RASS -4/-5, VM passiva",
        "assess": ["Reduzir sedação"],
        "interv": ["Despertar diário (Protocolo)", "RASS alvo -1 a 0 (Meta)", "TRE quando despertar (Progressivo)"],
        "block": "🧠 BLOCO R4-F — VM: Neuro, sedação e diafragma",
        "goals": ["Reduzir sedação"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["Despertar diário (Protocolo)", "RASS alvo -1 a 0 (Meta)", "TRE quando despertar (Progressivo)"]}
        ]
      },
      {
        "name": "R4-F5 — Polineuropatia do crítico",
        "desc": "Grave. MRC < 48, desmame difícil",
        "assess": ["Recuperar função muscular"],
        "interv": ["Mobilização 2x/dia (Intensivo)", "Eletroestimulação (Se disponível)", "TMI diário (Respiratório)"],
        "block": "🧠 BLOCO R4-F — VM: Neuro, sedação e diafragma",
        "goals": ["Recuperar função muscular"],
        "phases": [
          {"timeframe": "14-30 dias", "interv": ["Mobilização 2x/dia (Intensivo)", "Eletroestimulação (Se disponível)", "TMI diário (Respiratório)"]}
        ]
      },
      {
        "name": "R4-G1 — Pneumotórax",
        "desc": "Crítico. MV abolido, PIP alto, hipotensão",
        "assess": ["Drenagem urgente"],
        "interv": ["Chamar equipe URGENTE (Imediato)", "RX tórax urgente (Diagnóstico)", "Preparar drenagem (Antecipar)", "Reduzir pressões (Temporário)"],
        "block": "⚠️ BLOCO R4-G — VM: Complicações e emergências",
        "goals": ["Drenagem urgente"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Chamar equipe URGENTE (Imediato)", "RX tórax urgente (Diagnóstico)", "Preparar drenagem (Antecipar)", "Reduzir pressões (Temporário)"]}
        ]
      },
      {
        "name": "R4-G2 — PAVM suspeita",
        "desc": "Grave. Febre, secreção purulenta, infiltrado",
        "assess": ["Facilitar diagnóstico e tratamento precoce"],
        "interv": ["Coleta aspirado (Diagnóstico)", "Higiene otimizada (Intensificar)", "Cabeceira 30-45° (Prevenção)", "Posicionamento terapêutico (Contínuo)"],
        "block": "⚠️ BLOCO R4-G — VM: Complicações e emergências",
        "goals": ["Facilitar diagnóstico e tratamento precoce"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["Coleta aspirado (Diagnóstico)", "Higiene otimizada (Intensificar)", "Cabeceira 30-45° (Prevenção)", "Posicionamento terapêutico (Contínuo)"]}
        ]
      },
      {
        "name": "R4-G3 — Autoextubação",
        "desc": "Crítico. Tubo saiu",
        "assess": ["Avaliar reintubação"],
        "interv": ["O₂: máscara/HFNC/VNI (Urgente)", "Avaliar: SpO₂, FR, esforço (Imediato)", "Decidir com equipe (Discussão)"],
        "block": "⚠️ BLOCO R4-G — VM: Complicações e emergências",
        "goals": ["Avaliar reintubação"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["O₂: máscara/HFNC/VNI (Urgente)", "Avaliar: SpO₂, FR, esforço (Imediato)", "Decidir com equipe (Discussão)"]}
        ]
      },
      {
        "name": "R4-G4 — Desconexão circuito",
        "desc": "Crítico. Alarme, dessaturação",
        "assess": ["Reconectar e estabilizar"],
        "interv": ["Reconectar imediato (Urgente)", "Verificar fixação (Checar)", "MRA se colapso (Se indicado)", "Reavaliar mecânica (Pós-evento)"],
        "block": "⚠️ BLOCO R4-G — VM: Complicações e emergências",
        "goals": ["Reconectar e estabilizar"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Reconectar imediato (Urgente)", "Verificar fixação (Checar)", "MRA se colapso (Se indicado)", "Reavaliar mecânica (Pós-evento)"]}
        ]
      },
      {
        "name": "R4-G5 — Instabilidade hemodinâmica em VM",
        "desc": "Crítico. PAM < 65, FC > 120 após VM",
        "assess": ["Identificar e tratar causa"],
        "interv": ["Suspeitar: hiperinsuflação, pneumotórax (Investigar)", "Reduzir PEEP/Vt (Testar)", "RX urgente (Diagnóstico)", "Alinhar com equipe (Suporte)"],
        "block": "⚠️ BLOCO R4-G — VM: Complicações e emergências",
        "goals": ["Identificar e tratar causa"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Suspeitar: hiperinsuflação, pneumotórax (Investigar)", "Reduzir PEEP/Vt (Testar)", "RX urgente (Diagnóstico)", "Alinhar com equipe (Suporte)"]}
        ]
      },
      {
        "name": "R4-G6 — PCR em VM",
        "desc": "Crítico. Sem pulso, apneia",
        "assess": ["RCP imediato"],
        "interv": ["Código azul (URGENTE)", "Ventilar manual 100% (RCP)", "Auxiliar compressões (Suporte)", "Pós-RCP: ajustar VM (Após ROSC)"],
        "block": "⚠️ BLOCO R4-G — VM: Complicações e emergências",
        "goals": ["RCP imediato"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Código azul (URGENTE)", "Ventilar manual 100% (RCP)", "Auxiliar compressões (Suporte)", "Pós-RCP: ajustar VM (Após ROSC)"]}
        ]
      },
      {
        "name": "R4-G7 — Dessaturação súbita",
        "desc": "Crítico. SpO₂ cai rápido",
        "assess": ["Identificar causa sistematicamente"],
        "interv": ["DOPE: Deslocamento, Obstrução, Pneumotórax, Equipment (Sistemático)", "Aumentar FiO₂ (Temporário)", "Aspirar, checar tubo (Verificar)", "RX se não resolve (Investigar)"],
        "block": "⚠️ BLOCO R4-G — VM: Complicações e emergências",
        "goals": ["Identificar causa sistematicamente"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["DOPE: Deslocamento, Obstrução, Pneumotórax, Equipment (Sistemático)", "Aumentar FiO₂ (Temporário)", "Aspirar, checar tubo (Verificar)", "RX se não resolve (Investigar)"]}
        ]
      },
      {
        "name": "R4-H1 — Dependência de via aérea artificial",
        "desc": "Grave. Paciente com TOT ou TQT, necessita manutenção da patência e proteção das vias aéreas",
        "assess": ["Manter VAA pérvia e funcionante", "Prevenir obstrução por secreções", "Garantir pressão de cuff adequada (20-30 cmH₂O)"],
        "interv": ["Medir pressão de cuff: meta 20-30 cmH₂O (6/6h ou após manipulação)", "Fixação segura: TOT com fita/cadarço, anotar cm na rima (12/12h)", "Higiene oral: Clorexidina 0.12%. Aspirar orofaringe antes de desinsuflar cuff (8/8h)", "Cuff-leak test antes de extubação: leak < 110 mL = risco estridor"],
        "block": "🛡️ BLOCO R4-H — Manejo de via aérea artificial (TOT/TQT)",
        "goals": ["Manter VAA pérvia e funcionante", "Prevenir obstrução por secreções", "Garantir pressão de cuff adequada (20-30 cmH₂O)", "Prevenir deslocamento/extubação acidental"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Medir pressão de cuff: meta 20-30 cmH₂O (20-25 ideal). Se < 20: risco aspiração. Se > 30: isquemia traqueal (6/6h ou após manipulação)", "Fixação segura: TOT fixado com fita/cadarço, anotar cm na rima. TQT com cadarços/velcro. Revisar 2x/dia (12/12h)", "Higiene oral: Clorexidina 0.12% ou protocolo institucional. Aspirar orofaringe antes de desinsuflar cuff (8/8h ou 12/12h)", "Auscultar: verificar entrada bilateral de ar. Se ↓ MV unilateral → suspeitar intubação seletiva ou obstrução (Cada turno)"]},
          {"timeframe": "1-7 dias", "interv": ["Trocar fixação: 1x/dia ou se sujo/frouxo. Evitar mobilização excessiva do tubo (Diário)", "Avaliar indicação TQT: se previsão VM > 7-10 dias, desmame difícil ou necessidade VAA prolongada (Discussão equipe)", "Aspiração traqueal: técnica asséptica, sistema fechado preferível (SDRA). Evitar aspiração de rotina (Conforme necessidade)"]},
          {"timeframe": "Pré-retirada", "interv": ["Cuff-leak test (TOT): desinsuflar cuff, medir volume expirado. Leak < 110 mL = risco estridor pós-extubação (Antes extubação)", "Avaliar tosse: força e eficácia. Pico de fluxo > 60 L/min favorável (Avaliação funcional)"]}
        ]
      },
      {
        "name": "R4-H2 — Manter vias aéreas pérvias",
        "desc": "Grave. Acúmulo de secreções, obstrução parcial, necessidade de desobstrução ativa",
        "assess": ["Desobstruir vias aéreas", "Prevenir rolha de secreção", "Otimizar umidificação"],
        "interv": ["Umidificação: HME (nariz artificial) em paciente estável. Umidificador aquecido se secreção espessa (Contínuo)", "Aspiração traqueal: sob demanda (ausculta, ↑ Ppico, ↓ SpO₂, tosse ineficaz)", "Tosse assistida: hiperinsuflação manual + compressão torácica (2-3x/dia)", "Mobilização: sentar, ortostatismo, deambular se possível (Diário)"],
        "block": "🛡️ BLOCO R4-H — Manejo de via aérea artificial (TOT/TQT)",
        "goals": ["Desobstruir vias aéreas", "Prevenir rolha de secreção", "Otimizar umidificação", "Garantir clearance efetivo após retirada de VAA"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Umidificação adequada: HME em paciente estável. Umidificador aquecido se secreção espessa/volumosa. Meta: 32-34°C, 100% umidade (Contínuo)", "Aspiração traqueal: indicações: ausculta com roncos, ↑ Ppico, ↓ SpO₂, tosse ineficaz. Sistema fechado (SDRA/PEEP alto) (Sob demanda)", "Instilação SF 0.9%: 5-10 mL se secreção muito espessa/ressecada (Quando necessário)"]},
          {"timeframe": "1-7 dias", "interv": ["Tosse assistida: hiperinsuflação manual (ambú) + compressão torácica sincronizada (2-3x/dia)", "Mobilização: sentar, ortostatismo, deambular se possível. Melhora drenagem postural (Diário)", "Drenagem postural: decúbitos alternados, Trendelenburg se tolerado (Mudança de decúbito 2/2h)"]},
          {"timeframe": "Pré-extubação", "interv": ["Avaliar tosse: força (forte/moderada/fraca/ausente), volume de secreção. Se tosse fraca + secreção volumosa = risco de reintubação (Avaliação)"]}
        ]
      },
      {
        "name": "R4-H3 — Secreção purulenta / hemática",
        "desc": "Grave. Secreção amarelada/esverdeada/fétida (purulenta) ou hemática/hemoptise",
        "assess": ["Comunicar equipe", "Adaptar técnica de higiene brônquica"],
        "interv": ["Secreção purulenta: comunicar médico imediatamente (suspeita PAVM/infecção) (URGENTE)", "Colher amostra para cultura (Antes ATB se possível)", "Higiene brônquica intensiva: 4-6x/dia (Protocolo)", "Aspiração delicada se hemática: pressão negativa baixa (-80 a -100 mmHg)"],
        "block": "🛡️ BLOCO R4-H — Manejo de via aérea artificial (TOT/TQT)",
        "goals": ["Comunicar equipe", "Adaptar técnica de higiene brônquica"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["Secreção purulenta: comunicar médico imediatamente (suspeita PAVM/infecção) (URGENTE)", "Colher amostra para cultura (aspirado traqueal) (Antes ATB se possível)", "Higiene brônquica intensiva: 4-6x/dia, clearance rigoroso (Protocolo)", "Nebulização SF 3% para fluidificar (Pré-fisio)"]},
          {"timeframe": "0-24h (hemática)", "interv": ["Aspiração delicada: pressão negativa baixa (-80 a -100 mmHg) (Cuidadosa)", "Evitar instilação SF (pode piorar sangramento) (Contraindicado)", "Profundidade controlada (não forçar) (Técnica)", "Comunicar médico se hemoptise volumosa (> 50ml) (Urgente)", "Investigar causa: trauma? coagulopatia? lesão brônquica? (Avaliar)"]}
        ]
      },
      {
        "name": "R5-A1 — Critérios desmame não atingidos",
        "desc": "Moderado. PaO₂/FiO₂ < 150, PEEP > 8-10, instável, febril, sedado",
        "assess": ["Atingir critérios pré-TRE"],
        "interv": ["Otimizar oxigenação (Ver R4)", "Reduzir sedação RASS -1 a 0 (Despertar)", "Estabilizar hemodinâmica (Equipe)", "Reavaliar critérios diariamente (Checklist)"],
        "block": "🎯 BLOCO R5-A — Desmame e TRE",
        "goals": ["Atingir critérios pré-TRE"],
        "phases": [
          {"timeframe": "24-72h", "interv": ["Otimizar oxigenação (Ver R4)", "Reduzir sedação RASS -1 a 0 (Despertar)", "Estabilizar hemodinâmica (Equipe)", "Reavaliar critérios diariamente (Checklist)"]}
        ]
      },
      {
        "name": "R5-A1E — Dependência de VM sem critérios de desmame",
        "desc": "Grave. Paciente em VM invasiva que não preenche critérios para TRE: PaO₂/FiO₂ < 150-200, PEEP > 8-10, FiO₂ > 0.4-0.5, instabilidade hemodinâmica, febre > 38°C, sedação profunda, agitação/delirium, distúrbios metabólicos, anemia grave",
        "assess": ["Identificar barreiras ao desmame", "Otimizar ventilação protetora enquanto aguarda estabilização", "Prevenir complicações"],
        "interv": ["Checklist diário de critérios de desmame (toda manhã)", "VM protetora rigorosa: Vt 4-6 mL/kg PBW, Pplatô ≤ 30, ΔP < 15", "Sedação mínima: RASS alvo -1 a 0. SAT diário", "Desmame progressivo: reduzir FiO₂ e depois PEEP (Diário)", "TMI: POWERbreathe 30-50% PImáx, 2-3 séries (2x/dia)"],
        "block": "🎯 BLOCO R5-A — Desmame e TRE",
        "goals": ["Identificar barreiras ao desmame", "Otimizar ventilação protetora", "Prevenir complicações", "Progredir em direção aos critérios de desmame", "Evitar dependência ventilatória prolongada"],
        "phases": [
          {"timeframe": "0-24h", "interv": ["Checklist diário de critérios de desmame (toda manhã): PaO₂/FiO₂ > 150-200? PEEP ≤ 8? FiO₂ ≤ 0.4-0.5? Estável? Afebril (T < 38°C)? RASS -1 a +1? Tosse efetiva? pH > 7.30? Secreção manejável?", "Otimização ventilatória: Vt 4-6 mL/kg PBW, Pplatô ≤ 30, ΔP < 15. Reduzir FiO₂ sempre que SpO₂ > 92-96% (Ajuste contínuo)", "Sedação mínima: RASS alvo -1 a 0. Interrupção diária de sedação (SAT) (Diário)", "Hemodinâmica: desmame de vasopressor. Corrigir volemia, tratar causa de choque (Contínuo)", "Controle infeccioso: investigar foco se febre. Higiene oral rigorosa. Cabeceira 30-45° (Contínuo)", "Correção metabólica: corrigir acidose, eletrólitos, anemia se Hb < 7-8 (Quando identificado)"]},
          {"timeframe": "1-7 dias", "interv": ["Desmame de suporte: reduzir FiO₂ progressivamente. Meta: FiO₂ ≤ 0.4, PEEP ≤ 8 (Diário)", "Avaliação força respiratória: quando RASS ≥ -1 → medir PImáx e PEmáx. Se PImáx < -20/-30 → TMI obrigatório", "TMI: POWERbreathe/Threshold 30-50% PImáx, 2-3 séries 10-15 rep (2x/dia)", "Mobilização precoce: sedestação → ortostatismo → marcha → deambulação (1-2x/dia)", "Despertar diário + TRE: SAT + SBT. Testar 5 min respiração espontânea (Tentativa diária)", "Higiene brônquica: aspiração sob demanda. Se secreção abundante → 3x/dia (Conforme necessidade)"]},
          {"timeframe": "> 7 dias", "interv": ["Considerar traqueostomia: se previsão VM > 14-21 dias. Benefícios: ↓ sedação, ↑ conforto, facilita desmame (Discussão multidisciplinar)", "Desmame prolongado estruturado: TRE progressivos 30 min → 1h → 2h → 4h → noite toda. TMI 2x/dia (Protocolo)", "Suporte nutricional: 20-25 kcal/kg, 1.2-2 g proteína/kg. Evitar sobrealimentação (Contínuo)", "Prevenção de complicações: profilaxia TEV, úlcera pressão, PAV bundle (Contínuo)"]}
        ]
      },
      {
        "name": "R5-A2 — TRE indicado",
        "desc": "Leve. PaO₂/FiO₂ > 150, PEEP ≤ 8, estável, acordado",
        "assess": ["Realizar TRE com segurança"],
        "interv": ["Método: Tubo-T ou PS 5-7 (Protocolo)", "Duração: 30-120 min (Observar)", "Monitorar: FR, Vt, RSBI, SpO₂, FC, esforço (Contínuo)", "SUCESSO: FR < 35, RSBI < 105, SpO₂ > 90% (Critérios)", "FALHA: FR > 35, dessaturação → reconectar (Interromper)"],
        "block": "🎯 BLOCO R5-A — Desmame e TRE",
        "goals": ["Realizar TRE com segurança"],
        "phases": [
          {"timeframe": "30-120 min", "interv": ["Método: Tubo-T ou PS 5-7 (Protocolo)", "Duração: 30-120 min (Observar)", "Monitorar: FR, Vt, RSBI, SpO₂, FC, esforço (Contínuo)", "SUCESSO: FR < 35, RSBI < 105, SpO₂ > 90% (Critérios)", "FALHA: FR > 35, dessaturação → reconectar (Interromper)"]}
        ]
      },
      {
        "name": "R5-A3 — TRE falhou",
        "desc": "Grave. Não tolerou: FR > 35, dessaturação, esforço ↑",
        "assess": ["Fortalecer para novo TRE"],
        "interv": ["Reconectar: repouso (Imediato)", "Investigar: fraqueza MIP/MEP, secreção, sobrecarga (Diagnóstico)", "TMI: POWERbreathe 30-50% MIP (2x/dia)", "Mobilização progressiva (2x/dia)", "Novo TRE em 24-48h (Planejar)"],
        "block": "🎯 BLOCO R5-A — Desmame e TRE",
        "goals": ["Fortalecer para novo TRE"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["Reconectar: repouso (Imediato)", "Investigar: fraqueza MIP/MEP, secreção, sobrecarga (Diagnóstico)", "TMI: POWERbreathe 30-50% MIP (2x/dia)", "Mobilização progressiva (2x/dia)", "Higiene otimizada (PRN)", "Novo TRE em 24-48h (Planejar)"]}
        ]
      },
      {
        "name": "R5-A4 — Desmame prolongado",
        "desc": "Grave. Múltiplas falhas, VM > 7-14 dias",
        "assess": ["Desmame progressivo estruturado"],
        "interv": ["TRE progressivos 30→60→120 min (Diário)", "TMI diário obrigatório (2x/dia)", "Mobilização intensiva (2-3x/dia)", "Considerar TQT se VM > 10-14 dias (Discutir)", "Corrigir: anemia, desnutrição, eletrólitos (Suporte)"],
        "block": "🎯 BLOCO R5-A — Desmame e TRE",
        "goals": ["Desmame progressivo estruturado"],
        "phases": [
          {"timeframe": "7-21 dias", "interv": ["TRE progressivos 30→60→120 min (Diário)", "TMI diário obrigatório (2x/dia)", "Mobilização intensiva (2-3x/dia)", "Considerar TQT se VM > 10-14 dias (Discutir)", "Corrigir: anemia, desnutrição, eletrólitos (Suporte)"]}
        ]
      },
      {
        "name": "R5-A5 — RSBI elevado",
        "desc": "Grave. RSBI > 105 (FR/Vt em L)",
        "assess": ["RSBI < 105"],
        "interv": ["TMI para ↑Vt ↓FR (Diário)", "Controlar drive: dor, febre, ansiedade (Tratar)", "Higiene brônquica (PRN)", "Remedir antes TRE (Reavaliar)"],
        "block": "🎯 BLOCO R5-A — Desmame e TRE",
        "goals": ["RSBI < 105"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["TMI para ↑Vt ↓FR (Diário)", "Controlar drive: dor, febre, ansiedade (Tratar)", "Higiene brônquica (PRN)", "Remedir antes TRE (Reavaliar)"]}
        ]
      },
      {
        "name": "R5-A6 — Dependência ventilatória crônica / irreversível",
        "desc": "Moderado. VM > 30 dias, múltiplas falhas TRE, doença neuromuscular progressiva, DPOC terminal, sem perspectiva de desmame",
        "assess": ["Otimizar qualidade de vida", "Minimizar complicações"],
        "interv": ["Considerar TQT se ainda não tem (↑ conforto, ↓ espaço morto) (Discutir)", "Avaliar critérios para VM domiciliar (Se estável)", "Mobilização máxima possível (1-2x/dia)", "Higiene brônquica rigorosa (3x/dia)", "Reunião multidisciplinar + família (metas realistas) (Semanal)"],
        "block": "🎯 BLOCO R5-A — Desmame e TRE",
        "goals": ["Otimizar qualidade de vida", "Minimizar complicações"],
        "phases": [
          {"timeframe": "Longo prazo", "interv": ["Considerar TQT se ainda não tem (↑ conforto, ↓ espaço morto) (Discutir com equipe)", "Avaliar critérios para VM domiciliar (se quadro estável) (Se apropriado)", "Prevenir complicações: atelectasia, pneumonia, úlceras pressão (Contínuo)", "Mobilização máxima possível (cadeira, ortostatismo se capaz) (1-2x/dia)", "Higiene brônquica rigorosa (3x/dia)"]},
          {"timeframe": "Quando apropriado", "interv": ["Reunião multidisciplinar + família (metas realistas) (Semanal/quinzenal)", "Discutir cuidados paliativos se doença terminal (Se indicado)", "Planejar alta para long-care facility ou home care (Se estável)", "Treinar cuidadores (se alta domiciliar) (Pré-alta)"]}
        ]
      },
      {
        "name": "R5-B1 — Extubação bem-sucedida",
        "desc": "Leve. TRE sucesso, extubado, primeiras 48h",
        "assess": ["Prevenir reintubação"],
        "interv": ["O₂: cateter/máscara conforme SpO₂ (Titular)", "HFNC profilático se alto risco (Estratégia)", "Higiene brônquica precoce (Sessões)", "Monitorar: SpO₂, FR, esforço, estridor (Intensivo)", "Mobilização e sentar (2-3x/dia)"],
        "block": "🎊 BLOCO R5-B — Pós-extubação",
        "goals": ["Prevenir reintubação"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["O₂: cateter/máscara conforme SpO₂ (Titular)", "HFNC profilático se alto risco (Estratégia)", "Higiene brônquica precoce (Sessões)", "Monitorar: SpO₂, FR, esforço, estridor (Intensivo)", "Mobilização e sentar (2-3x/dia)", "Nebulização se estridor (Se indicado)"]}
        ]
      },
      {
        "name": "R5-B2 — Estridor pós-extubação",
        "desc": "Grave. Som agudo, esforço ↑, edema glótico",
        "assess": ["Reduzir edema glótico"],
        "interv": ["Posição sentada (Imediato)", "O₂ suplementar (Titular)", "Nebulização adrenalina + corticoide (Urgente)", "Monitorar resposta (Contínuo)", "Preparar reintubação (Se piora)"],
        "block": "🎊 BLOCO R5-B — Pós-extubação",
        "goals": ["Reduzir edema glótico"],
        "phases": [
          {"timeframe": "2-6h", "interv": ["Posição sentada (Imediato)", "O₂ suplementar (Titular)", "Nebulização adrenalina + corticoide (Urgente)", "Monitorar resposta (Contínuo)", "Preparar reintubação (Se piora)"]}
        ]
      },
      {
        "name": "R5-B3 — Insuficiência respiratória pós-extubação",
        "desc": "Crítico. SpO₂ < 90%, FR > 30, esforço, fadiga < 48h",
        "assess": ["Evitar reintubação"],
        "interv": ["HFNC: 50-60 L/min, FiO₂ alta (Primeira linha)", "VNI se hipercapnia ou falha HFNC (Escalonar)", "Higiene brônquica (PRN)", "FALHA → reintubação (Não atrasar)"],
        "block": "🎊 BLOCO R5-B — Pós-extubação",
        "goals": ["Evitar reintubação"],
        "phases": [
          {"timeframe": "0-2h", "interv": ["HFNC: 50-60 L/min, FiO₂ alta (Primeira linha)", "VNI se hipercapnia ou falha HFNC (Escalonar)", "Higiene brônquica (PRN)", "Monitorar 1-2h: resposta ou piora (Decisivo)", "FALHA → reintubação (Não atrasar)"]}
        ]
      },
      {
        "name": "R5-B4 — Reintubação",
        "desc": "Crítico. Falha suporte, IOT novamente < 48-72h",
        "assess": ["IOT segura"],
        "interv": ["Pré-oxigenação máxima (Antes IOT)", "Auxiliar equipe via aérea (Suporte)", "Pós-IOT: VM protetora (Protocolo R4)", "Investigar causa falha (Aprender)"],
        "block": "🎊 BLOCO R5-B — Pós-extubação",
        "goals": ["IOT segura"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Pré-oxigenação máxima (Antes IOT)", "Auxiliar equipe via aérea (Suporte)", "Pós-IOT: VM protetora (Protocolo R4)", "Investigar causa falha (Aprender)"]}
        ]
      },
      {
        "name": "R5-B5 — Alto risco reintubação",
        "desc": "Moderado. Idade > 65, comorbidades, fraqueza, TRE limítrofe",
        "assess": ["Profilaxia reintubação"],
        "interv": ["HFNC profilático imediato (Estratégia)", "Higiene intensiva 3-4x/dia (Prevenção)", "Monitorização reforçada (Contínuo)", "Mobilização e posicionamento (Frequente)"],
        "block": "🎊 BLOCO R5-B — Pós-extubação",
        "goals": ["Profilaxia reintubação"],
        "phases": [
          {"timeframe": "48h", "interv": ["HFNC profilático imediato (Estratégia)", "Higiene intensiva 3-4x/dia (Prevenção)", "Monitorização reforçada (Contínuo)", "Mobilização e posicionamento (Frequente)"]}
        ]
      },
      {
        "name": "R5-C1 — Indicação TQT",
        "desc": "Moderado. VM prevista > 14-21 dias, desmame prolongado",
        "assess": ["Facilitar desmame", "Conforto"],
        "interv": ["Discutir timing com equipe (Planejamento)", "Pós-TQT: higiene via cânula (Protocolo)", "Progressão: cuff inflado → desinflado → válvula → cap (Gradual)"],
        "block": "🔧 BLOCO R5-C — Traqueostomia",
        "goals": ["Facilitar desmame", "Conforto"],
        "phases": [
          {"timeframe": "Eletivo", "interv": ["Discutir timing com equipe (Planejamento)", "Pós-TQT: higiene via cânula (Protocolo)", "Progressão: cuff inflado → desinflado → válvula → cap (Gradual)"]}
        ]
      },
      {
        "name": "R5-C2 — Desmame traqueostomizado",
        "desc": "Moderado. Critérios OK, TQT presente",
        "assess": ["Progressão até decanulação"],
        "interv": ["Etapa 1: VM → PSV baixa → CPAP (Gradual)", "Etapa 2: Desinflar cuff (se tolera) (Teste)", "Etapa 3: Válvula fala Passy-Muir (Progressão)", "Etapa 4: Cap/oclusão por períodos (Final)", "Critérios decanulação: tosse OK, SpO₂ estável (Avaliar)"],
        "block": "🔧 BLOCO R5-C — Traqueostomia",
        "goals": ["Progressão até decanulação"],
        "phases": [
          {"timeframe": "5-14 dias", "interv": ["Etapa 1: VM → PSV baixa → CPAP (Gradual)", "Etapa 2: Desinflar cuff (se tolera) (Teste)", "Etapa 3: Válvula fala Passy-Muir (Progressão)", "Etapa 4: Cap/oclusão por períodos (Final)", "Critérios decanulação: tosse OK, SpO₂ estável (Avaliar)"]}
        ]
      },
      {
        "name": "R5-C3 — Obstrução / deslocamento TQT",
        "desc": "Crítico. SpO₂ cai, PIP alto, enfisema subcutâneo",
        "assess": ["Restabelecer via aérea"],
        "interv": ["Aspirar (Urgente)", "Checar posicionamento (Verificar)", "Se obstruída: trocar cânula (Emergência)", "Chamar equipe se necessário (Suporte)"],
        "block": "🔧 BLOCO R5-C — Traqueostomia",
        "goals": ["Restabelecer via aérea"],
        "phases": [
          {"timeframe": "Imediato", "interv": ["Aspirar (Urgente)", "Checar posicionamento (Verificar)", "Se obstruída: trocar cânula (Emergência)", "Chamar equipe se necessário (Suporte)"]}
        ]
      },
      {
        "name": "R5-C4 — Decanulação",
        "desc": "Leve. Tolera cap 24h, tosse eficaz, SpO₂ estável",
        "assess": ["Remover TQT com segurança"],
        "interv": ["Confirmar: cap 24h OK, PCF > 60-160 (Checklist)", "Decanular e ocluir ostoma (Procedimento)", "Monitorar 24-48h: SpO₂, estridor (Vigilância)", "Higiene brônquica suporte (Pós-decanulação)"],
        "block": "🔧 BLOCO R5-C — Traqueostomia",
        "goals": ["Remover TQT com segurança"],
        "phases": [
          {"timeframe": "Eletivo", "interv": ["Confirmar: cap 24h OK, PCF > 60-160 (Checklist)", "Decanular e ocluir ostoma (Procedimento)", "Monitorar 24-48h: SpO₂, estridor (Vigilância)", "Higiene brônquica suporte (Pós-decanulação)"]}
        ]
      },
      {
        "name": "R5-D1 — MIP/MEP fracos",
        "desc": "Grave. MIP < -20/-30, MEP < +30/+40",
        "assess": ["MIP > -30", "MEP > +40"],
        "interv": ["Medir MIP/MEP (Inicial e a cada 3-5 dias)", "TMI: POWERbreathe 30-50% MIP (2x/dia, 10-15 rep)", "TME: carga 30-50% MEP (1-2x/dia se MEP fraco)", "Mobilização global (2x/dia)"],
        "block": "📊 BLOCO R5-D — Biomarcadores e preditores",
        "goals": ["MIP > -30", "MEP > +40"],
        "phases": [
          {"timeframe": "5-10 dias", "interv": ["Medir MIP/MEP (Inicial e a cada 3-5 dias)", "TMI: POWERbreathe 30-50% MIP (2x/dia, 10-15 rep)", "TME: carga 30-50% MEP (1-2x/dia se MEP fraco)", "Mobilização global (2x/dia)", "Reavaliar (A cada 5-7 dias)"]}
        ]
      },
      {
        "name": "R5-D2 — PCF baixo",
        "desc": "Grave. PCF < 60 (inútil), < 160 (risco)",
        "assess": ["PCF > 160 (ideal > 270)"],
        "interv": ["Medir PCF (A cada 48-72h)", "Treino tosse: inspiração → pausa → expiração explosiva (Sessões)", "Tosse assistida manual (Se necessário)", "TME para força expiratória (1-2x/dia)", "Se PCF < 60: tosse mecânica (Obrigatório)"],
        "block": "📊 BLOCO R5-D — Biomarcadores e preditores",
        "goals": ["PCF > 160 (ideal > 270)"],
        "phases": [
          {"timeframe": "5-10 dias", "interv": ["Medir PCF (A cada 48-72h)", "Treino tosse: inspiração → pausa → expiração explosiva (Sessões)", "Tosse assistida manual (Se necessário)", "TME para força expiratória (1-2x/dia)", "Se PCF < 60: tosse mecânica (Obrigatório)"]}
        ]
      },
      {
        "name": "R5-D3 — RSBI elevado",
        "desc": "Grave. RSBI > 105 (FR/Vt em L)",
        "assess": ["RSBI < 105 (ideal < 80)"],
        "interv": ["Medir: FR / Vt(L) após 1 min (Antes TRE)", "Estratégia: ↑Vt + ↓FR (Dupla)", "TMI para aumentar Vt (2x/dia)", "Controlar drive: dor, febre, ansiedade (Tratar)"],
        "block": "📊 BLOCO R5-D — Biomarcadores e preditores",
        "goals": ["RSBI < 105 (ideal < 80)"],
        "phases": [
          {"timeframe": "3-7 dias", "interv": ["Medir: FR / Vt(L) após 1 min (Antes TRE)", "Estratégia: ↑Vt + ↓FR (Dupla)", "TMI para aumentar Vt (2x/dia)", "Controlar drive: dor, febre, ansiedade (Tratar)", "Remedir antes TRE (Reavaliar)"]}
        ]
      },
      {
        "name": "R5-D4 — P0.1 elevado (drive alto)",
        "desc": "Moderado. P0.1 > 4-6 cmH₂O",
        "assess": ["P0.1 entre 2-4"],
        "interv": ["Medir P0.1 no ventilador (Se disponível)", "Investigar: dor, febre, acidose, hipoxemia (Diagnóstico)", "Tratar causas (Específico)", "Ajustar suporte temporário (Conforto)"],
        "block": "📊 BLOCO R5-D — Biomarcadores e preditores",
        "goals": ["P0.1 entre 2-4"],
        "phases": [
          {"timeframe": "24-48h", "interv": ["Medir P0.1 no ventilador (Se disponível)", "Investigar: dor, febre, acidose, hipoxemia (Diagnóstico)", "Tratar causas (Específico)", "Ajustar suporte temporário (Conforto)"]}
        ]
      },
      {
        "name": "R5-D5 — Excursão diafragmática reduzida",
        "desc": "Grave. Excursão < 10 mm (normal > 10-18)",
        "assess": ["Excursão > 10 mm"],
        "interv": ["Eco diafragmática (Inicial e seriado)", "TMI carga progressiva (2x/dia)", "Evitar ventilação excessiva (Ajuste)", "TRE diários (Quando critérios)"],
        "block": "📊 BLOCO R5-D — Biomarcadores e preditores",
        "goals": ["Excursão > 10 mm"],
        "phases": [
          {"timeframe": "7-14 dias", "interv": ["Eco diafragmática (Inicial e seriado)", "TMI carga progressiva (2x/dia)", "Evitar ventilação excessiva (Ajuste)", "TRE diários (Quando critérios)", "Reavaliar eco (A cada 5-7 dias)"]}
        ]
      },
      {
        "name": "R5-D6 — Espessamento diafragmático reduzido",
        "desc": "Grave. TFdi < 20% (normal > 20-30%)",
        "assess": ["TFdi > 20%"],
        "interv": ["TFdi = [(Ei - Ee) / Ee] × 100 (Cálculo)", "TMI com carga (2x/dia)", "TRE progressivos (Diário)", "Mobilização global (2x/dia)"],
        "block": "📊 BLOCO R5-D — Biomarcadores e preditores",
        "goals": ["TFdi > 20%"],
        "phases": [
          {"timeframe": "7-14 dias", "interv": ["TFdi = [(Ei - Ee) / Ee] × 100 (Cálculo)", "TMI com carga (2x/dia)", "TRE progressivos (Diário)", "Mobilização global (2x/dia)", "Reavaliar TFdi (Seriado)"]}
        ]
      },
      {
        "name": "R5-D7 — Índices integrados",
        "desc": "Moderado. CROP < 13, IWI < 25, MIP/RSBI baixo",
        "assess": ["Melhorar índices preditores"],
        "interv": ["CROP = Cdin × MIP × (PaO₂/PAO₂) / FR (>13) (Calcular)", "IWI = Integrated Weaning Index (>25) (Calcular)", "Fortalecer + otimizar oxigenação + controlar drive (Global)", "Usar com avaliação clínica (Integrado)"],
        "block": "📊 BLOCO R5-D — Biomarcadores e preditores",
        "goals": ["Melhorar índices preditores"],
        "phases": [
          {"timeframe": "5-10 dias", "interv": ["CROP = Cdin × MIP × (PaO₂/PAO₂) / FR (>13) (Calcular)", "IWI = Integrated Weaning Index (>25) (Calcular)", "MIP/RSBI: quanto maior, melhor (Calcular)", "Fortalecer + otimizar oxigenação + controlar drive (Global)", "Usar com avaliação clínica (Integrado)"]}
        ]
      }
    ]
  },
  {
    "id": "neurological",
    "name": "Sistema Neurológico",
    "icon": "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
    "color": "#c084fc",
    "problems": [
        {
            "name": "N1.1 — Imobilismo neurológico severo",
            "desc": "Crítico. Coma, sedação profunda, sem mobilidade voluntária",
            "assess": [
                "Prevenir complicações do imobilismo",
                "Manter amplitude de movimento e integridade tissular"
            ],
            "interv": [
                "Mobilização passiva: MMSS e MMII (2-3x/dia)",
                "Posicionamento em alinhamento: decúbito lateral, semi-Fowler (A cada 2h)",
                "Cabeceira 30-45° (Contínuo)",
                "Higiene brônquica: posicionamento, vibração, aspiração PRN"
            ],
            "block": "🧩 BLOCO N1 — Rebaixamento, coma e sedação",
            "goals": [
                "Prevenir complicações do imobilismo",
                "Manter amplitude de movimento e integridade tissular"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Mobilização passiva: MMSS e MMII (2-3x/dia)",
                        "Posicionamento em alinhamento: decúbito lateral, semi-Fowler (A cada 2h)",
                        "Cabeceira 30-45° para prevenir aspiração (Contínuo)",
                        "Higiene brônquica: posicionamento, vibração, aspiração PRN"
                    ]
                },
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Prevenção de lesão por pressão: mudança de decúbito 2/2h (Rotina)",
                        "Manter Pcuff adequado (20-30 cmH₂O) se VAA presente (12/12h)",
                        "Monitorar PIC se indicado: evitar manobras que aumentem PIC (Vigilância)",
                        "Estimulação sensitiva: falar com o paciente, toques organizados (Neuro)"
                    ]
                }
            ]
        },
        {
            "name": "N1.2 — Baixa responsividade / despertar minimal",
            "desc": "Grave. Não sustenta tronco, não mantém cabeça",
            "assess": [
                "Progredir estímulos e posicionamento funcional"
            ],
            "interv": [
                "Sedestação assistida com suporte de cabeça/tronco (Progressivo)",
                "Estimulação sensorial estruturada (Neuro)",
                "Exercícios ativos assistidos: MMSS e MMII conforme resposta (Sessões)",
                "Monitorar resposta a comandos simples (Avaliação)"
            ],
            "block": "🧩 BLOCO N1 — Rebaixamento, coma e sedação",
            "goals": [
                "Progredir estímulos e posicionamento funcional"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Sedestação com suporte de cabeça e tronco (Progressivo)",
                        "Estimulação sensorial estruturada: tato, voz, visual (Neuro)",
                        "Exercícios ativos assistidos conforme resposta (Sessões)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Progredir controle de cabeça/tronco (Gradual)",
                        "Tentativas de ortostatismo com suporte quando hemodinâmica permite (Degrau)",
                        "Avaliar resposta a comandos e nível de consciência (Monitorar)"
                    ]
                }
            ]
        },
        {
            "name": "N1.3 — Início de participação ativa",
            "desc": "Moderado. Fraqueza grave, fadiga rápida",
            "assess": [
                "Progredir funcionalidade com respeito à fadiga"
            ],
            "interv": [
                "Exercícios ativos com pausas frequentes (Sessões curtas 5-10 min)",
                "Sedestação beira-leito (Degrau 2)",
                "Ortostatismo com suporte (Degrau 3)",
                "Treino de AVDs básicas: higiene, alimentação (Funcional)"
            ],
            "block": "🧩 BLOCO N1 — Rebaixamento, coma e sedação",
            "goals": [
                "Progredir funcionalidade com respeito à fadiga"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Exercícios ativos com pausas frequentes: sessões de 5-10 min (Curtas)",
                        "Sedestação beira-leito (Degrau 2)",
                        "Ortostatismo com suporte quando tolera sedestação (Degrau 3)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Progressão gradual de tempo e intensidade (Gradual)",
                        "Treino de AVDs básicas: higiene, alimentação (Funcional)",
                        "Marcha assistida progressiva (Degrau 4)"
                    ]
                }
            ]
        },
        {
            "name": "N2.1 — Hemiparesia / perda controle postural",
            "desc": "Grave. Fraqueza unilateral, assimetria, alto risco queda",
            "assess": [
                "Melhorar controle postural",
                "Reduzir assimetria",
                "Prevenir quedas"
            ],
            "interv": [
                "Mobilização ativa-assistida do lado parético (Sessões)",
                "Treino de controle postural sentado: transferência de peso (Funcional)",
                "Estimulação sensório-motora do hemicorpo parético (Neuro)",
                "Uso de suportes/órteses conforme necessidade (Compensatório)"
            ],
            "block": "🧩 BLOCO N2 — AVC (isquêmico/hemorrágico)",
            "goals": [
                "Melhorar controle postural",
                "Reduzir assimetria",
                "Prevenir quedas"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Mobilização ativa-assistida do lado parético (Sessões)",
                        "Treino de controle postural sentado: transferência de peso (Funcional)",
                        "Estimulação sensório-motora do hemicorpo parético (Neuro)",
                        "Prevenção de lesões: posicionamento correto do lado parético (Contínuo)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Treino de equilíbrio dinâmico sentado/em pé (Progressivo)",
                        "Uso de espelho e biofeedback (Neuro)",
                        "Órteses/suportes conforme avaliação (Compensatório)"
                    ]
                }
            ]
        },
        {
            "name": "N2.2 — Incapacidade de transferências",
            "desc": "Grave. Não rola, não senta, não levanta",
            "assess": [
                "Independência progressiva nas transferências"
            ],
            "interv": [
                "Treino de rolar para ambos os lados (Funcional)",
                "Treino de sentar: apoio no cotovelo, lateral (Funcional)",
                "Transferências assistidas: leito → cadeira (Progressivo)",
                "Treino de levantamento com suporte (Funcional)"
            ],
            "block": "🧩 BLOCO N2 — AVC (isquêmico/hemorrágico)",
            "goals": [
                "Independência progressiva nas transferências"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Treino de rolar para ambos os lados com assistência (Funcional)",
                        "Treino de sentar com apoio no cotovelo (Funcional)",
                        "Transferência assistida leito → cadeira (Progressivo)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Reduzir grau de assistência progressivamente (Independência)",
                        "Treino de levantamento com suporte (Funcional)",
                        "Transferência cadeira → vaso sanitário/poltrona (Funcional)"
                    ]
                }
            ]
        },
        {
            "name": "N2.3 — Intolerância ao ortostatismo",
            "desc": "Moderado. Queda PA, tontura, taquicardia, fadiga",
            "assess": [
                "Tolerar ortostatismo sem sintomas"
            ],
            "interv": [
                "Elevação progressiva de cabeceira: 30° → 45° → 60° → 90° (Gradual)",
                "Meias de compressão graduada MMII (Usar)",
                "Monitorar PA, FC e sintomas ao verticalizar (Vigilância)",
                "Prancheta ortostática se disponível (Protocolo)"
            ],
            "block": "🧩 BLOCO N2 — AVC (isquêmico/hemorrágico)",
            "goals": [
                "Tolerar ortostatismo sem sintomas"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Elevação progressiva de cabeceira: 30° → 45° → 60° → 90° (Gradual)",
                        "Meias de compressão graduada MMII (Usar)",
                        "Monitorar PA, FC e sintomas ao verticalizar (Vigilância)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Ortostatismo assistido com suporte (Degrau 3)",
                        "Prancheta ortostática se disponível (Protocolo)",
                        "PARADA: queda PA > 20 mmHg com sintomas, síncope (Critérios)"
                    ]
                }
            ]
        },
        {
            "name": "N2.4 — Ausência de marcha funcional",
            "desc": "Moderado. Não sustenta peso, arrasta lado parético",
            "assess": [
                "Marcha funcional assistida",
                "Sustentação de peso bilateral"
            ],
            "interv": [
                "Treino de sustentação de peso no lado parético (Funcional)",
                "Treino de marcha em paralelas (Início)",
                "Treino de padrão de marcha: fase de balanço e apoio (Neuro)",
                "Uso de órtese tornozelo-pé se necessário (Compensatório)"
            ],
            "block": "🧩 BLOCO N2 — AVC (isquêmico/hemorrágico)",
            "goals": [
                "Marcha funcional assistida",
                "Sustentação de peso bilateral"
            ],
            "phases": [
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Treino de sustentação de peso no lado parético (Funcional)",
                        "Treino de marcha em paralelas com cueing (Início)",
                        "Treino de padrão de marcha: fase de balanço e apoio (Neuro)"
                    ]
                },
                {
                    "timeframe": "7-14 dias",
                    "interv": [
                        "Marcha com auxiliar de marcha (Progressivo)",
                        "Treino de marcha em terreno irregular e degraus (Funcional)",
                        "Uso de órtese tornozelo-pé se necessário (Compensatório)"
                    ]
                }
            ]
        },
        {
            "name": "N2.5 — Ombro doloroso / subluxação",
            "desc": "Moderado. Dor, flacidez, tração durante mobilização",
            "assess": [
                "Prevenir/tratar subluxação",
                "Manter amplitude sem dor"
            ],
            "interv": [
                "Posicionamento correto do ombro parético (Contínuo)",
                "Órtese de ombro ou tipoia funcional (Usar)",
                "Mobilização cuidadosa: nunca tracionar pelo braço parético (Sempre)",
                "Exercícios pendulares e mobilização passiva gentil (Sessões)"
            ],
            "block": "🧩 BLOCO N2 — AVC (isquêmico/hemorrágico)",
            "goals": [
                "Prevenir/tratar subluxação",
                "Manter amplitude sem dor"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Posicionamento correto do ombro parético em todas as posições (Contínuo)",
                        "Orientar equipe e familiar: NUNCA tracionar pelo braço parético (Educação)",
                        "Órtese de ombro ou tipoia funcional (Usar)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Mobilização passiva gentil do ombro em amplitude livre de dor (Sessões)",
                        "Exercícios pendulares se tolera (Sessões)",
                        "Crioterapia se inflamação (PRN)"
                    ]
                }
            ]
        },
        {
            "name": "N2.6 — Componente respiratório no AVC",
            "desc": "Moderado. Tosse fraca, PCF baixo, risco aspiração",
            "assess": [
                "PCF > 160 L/min",
                "Prevenir aspiração e pneumonia"
            ],
            "interv": [
                "Medir PCF (Inicial)",
                "Cabeceira ≥ 30-45° (Contínuo)",
                "Higiene brônquica: posicionamento, tosse assistida (Sessões)",
                "Treino de tosse voluntária (Sessões)"
            ],
            "block": "🧩 BLOCO N2 — AVC (isquêmico/hemorrágico)",
            "goals": [
                "PCF > 160 L/min",
                "Prevenir aspiração e pneumonia"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Medir PCF (Inicial)",
                        "Cabeceira ≥ 30-45° (Contínuo)",
                        "Higiene oral rigorosa (Rotina)",
                        "Aspiração orofaríngea PRN (Vigilância)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Higiene brônquica: posicionamento, tosse assistida (Sessões)",
                        "Treino de tosse voluntária (Sessões)",
                        "Avaliação de deglutição se não disfagico avaliado (Encaminhar fono)"
                    ]
                }
            ]
        },
        {
            "name": "N3.1 — Rebaixamento / coma / despertar lento no TCE",
            "desc": "Crítico. GCS baixo, sem comandos, dependência total",
            "assess": [
                "Prevenir complicações do imobilismo",
                "Estimular despertar progressivo"
            ],
            "interv": [
                "Mobilização passiva: MMSS e MMII (2-3x/dia)",
                "Posicionamento: evitar hiperextensão de cervical, cabeceira 30° (Contínuo)",
                "Higiene brônquica: vibração, posicionamento, aspiração PRN",
                "Estimulação sensorial estruturada conforme nível de consciência"
            ],
            "block": "🧩 BLOCO N3 — TCE (traumatismo cranioencefálico)",
            "goals": [
                "Prevenir complicações do imobilismo",
                "Estimular despertar progressivo"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Mobilização passiva cuidadosa: MMSS e MMII (2-3x/dia)",
                        "Posicionamento: cabeceira 30°, alinhamento cervical neutro (Contínuo)",
                        "Higiene brônquica: vibração, posicionamento, aspiração PRN",
                        "Monitorar PIC: evitar manobras que aumentem PIC (Vigilância)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Estimulação sensorial estruturada: voz, toque, visual (Neuro)",
                        "Sedestação com suporte quando PIC estável (Progressivo)",
                        "Prevenção de contraturas: mobilização passiva e posicionamento"
                    ]
                }
            ]
        },
        {
            "name": "N3.2 — Agitação / hiperatividade / delirium no TCE",
            "desc": "Grave. Arranca dispositivos, não tolera manuseio",
            "assess": [
                "Controlar agitação",
                "Prevenir autolesão e perda de dispositivos"
            ],
            "interv": [
                "Ambiente calmo: reduzir estímulos (luz, som) (Ambiental)",
                "Abordagem calma e gentil, um estímulo de cada vez (Técnica)",
                "Coordenar sedação mínima com equipe (Farmacológico)",
                "Mobilização em momentos de menor agitação (Oportunidade)"
            ],
            "block": "🧩 BLOCO N3 — TCE (traumatismo cranioencefálico)",
            "goals": [
                "Controlar agitação",
                "Prevenir autolesão e perda de dispositivos"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Ambiente calmo: reduzir estímulos de luz e som (Ambiental)",
                        "Abordagem calma e gentil, um estímulo de cada vez (Técnica)",
                        "Coordenar sedação mínima com equipe médica (Farmacológico)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Mobilização em janelas de menor agitação (Oportunidade)",
                        "Reorientação repetida: nome, local, data (Neuro)",
                        "Progressão de atividades conforme melhora da agitação (Gradual)"
                    ]
                }
            ]
        },
        {
            "name": "N3.3 — Perda de controle de tronco/cabeça no TCE",
            "desc": "Grave. Cabeça cai, tronco colapsa",
            "assess": [
                "Recuperar controle de cabeça e tronco"
            ],
            "interv": [
                "Treino de controle de cabeça: sedestação com suporte progressivo (Funcional)",
                "Exercícios de fortalecimento de musculatura cervical e paravertebral (Sessões)",
                "Sedestação com suporte de tronco (Progressivo)"
            ],
            "block": "🧩 BLOCO N3 — TCE (traumatismo cranioencefálico)",
            "goals": [
                "Recuperar controle de cabeça e tronco"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Sedestação com suporte de cabeça e tronco (Progressivo)",
                        "Treino de controle de cabeça: reduzir suporte gradualmente (Funcional)",
                        "Exercícios de fortalecimento cervical e tronco (Sessões)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Sedestação sem suporte de cabeça (Independência progressiva)",
                        "Transferência de peso lateral e anterior no sentar (Equilíbrio)"
                    ]
                }
            ]
        },
        {
            "name": "N3.4 — Incapacidade de transferências no TCE",
            "desc": "Grave. Não rola, não senta, não levanta",
            "assess": [
                "Independência progressiva nas transferências"
            ],
            "interv": [
                "Treino de rolar e sentar (Funcional)",
                "Transferências assistidas leito → cadeira (Progressivo)",
                "Treino de ortostatismo com suporte (Progressivo)",
                "Reduzir grau de assistência progressivamente"
            ],
            "block": "🧩 BLOCO N3 — TCE (traumatismo cranioencefálico)",
            "goals": [
                "Independência progressiva nas transferências"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Treino de rolar para ambos os lados com assistência (Funcional)",
                        "Treino de sentar beira-leito (Funcional)",
                        "Transferência assistida leito → cadeira (Progressivo)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Reduzir grau de assistência progressivamente (Independência)",
                        "Treino de ortostatismo com suporte (Progressivo)",
                        "Transferências para cadeira de rodas, vaso sanitário (Funcional)"
                    ]
                }
            ]
        },
        {
            "name": "N3.5 — Intolerância ao ortostatismo no TCE",
            "desc": "Moderado. Queda PA, tontura, palidez",
            "assess": [
                "Tolerar ortostatismo sem sintomas"
            ],
            "interv": [
                "Elevação progressiva de cabeceira (Gradual)",
                "Meias de compressão MMII (Usar)",
                "Monitorar PA, FC e sintomas (Vigilância)",
                "Prancheta ortostática se disponível"
            ],
            "block": "🧩 BLOCO N3 — TCE (traumatismo cranioencefálico)",
            "goals": [
                "Tolerar ortostatismo sem sintomas"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Elevação progressiva de cabeceira: 30° → 60° → 90° (Gradual)",
                        "Meias de compressão MMII (Usar)",
                        "Monitorar PA, FC e sintomas ao verticalizar (Vigilância)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Ortostatismo assistido com suporte (Degrau 3)",
                        "PARADA: queda PA > 20 mmHg com sintomas, palidez intensa (Critérios)"
                    ]
                }
            ]
        },
        {
            "name": "N3.6 — Fraqueza respiratória no TCE",
            "desc": "Moderado. Tosse fraca, PCF baixo, risco atelectasia",
            "assess": [
                "PCF > 160 L/min",
                "Prevenir atelectasia e pneumonia"
            ],
            "interv": [
                "Medir PCF e PImáx/PEmáx (Inicial)",
                "Higiene brônquica: posicionamento, vibração, tosse assistida (Sessões)",
                "Exercícios ventilatórios: inspiração profunda (Sessões)",
                "Cabeceira 30-45° (Contínuo)"
            ],
            "block": "🧩 BLOCO N3 — TCE (traumatismo cranioencefálico)",
            "goals": [
                "PCF > 160 L/min",
                "Prevenir atelectasia e pneumonia"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Medir PCF e PImáx/PEmáx (Inicial)",
                        "Cabeceira 30-45° (Contínuo)",
                        "Higiene brônquica: posicionamento, vibração (Sessões)",
                        "Aspiração traqueal PRN (Vigilância)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Exercícios ventilatórios: inspiração profunda, TMI se indicado (Sessões)",
                        "Tosse assistida com contenção (Sessões)",
                        "Reavaliar PCF (A cada 48-72h)"
                    ]
                }
            ]
        },
        {
            "name": "N3.7 — Transição para participação ativa no TCE",
            "desc": "Moderado. Fraqueza global, fadiga rápida",
            "assess": [
                "Progredir funcionalidade com respeito à fadiga"
            ],
            "interv": [
                "Sessões curtas (10-15 min) com pausas (Tolerância à fadiga)",
                "Exercícios ativos progressivos: MMSS, MMII, tronco (Sessões)",
                "Marcha assistida progressiva (Degrau 4)",
                "Treino de AVDs (Funcional)"
            ],
            "block": "🧩 BLOCO N3 — TCE (traumatismo cranioencefálico)",
            "goals": [
                "Progredir funcionalidade com respeito à fadiga"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Sessões curtas (10-15 min) com pausas (Tolerância à fadiga)",
                        "Exercícios ativos progressivos: MMSS, MMII, tronco (Sessões)",
                        "Sedestação → ortostatismo → marcha (Escalonamento)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Aumentar progressivamente duração e intensidade (Gradual)",
                        "Treino de AVDs: higiene, alimentação (Funcional)"
                    ]
                }
            ]
        },
        {
            "name": "N4.1 — Fraqueza respiratória na lesão medular",
            "desc": "Crítico. Paralisia diafragma/intercostais, tosse ineficaz",
            "assess": [
                "Manter ventilação adequada",
                "Tosse eficaz (PCF > 160 L/min ou assistida)"
            ],
            "interv": [
                "VNI ou VM se insuficiência respiratória (Urgente se necessário)",
                "Medir PImáx, PEmáx, PCF, VC, CVF (Inicial e monitorar)",
                "Tosse assistida: compressão abdominal sincronizada (Sessões)",
                "TMI: carga progressiva se nível medular permite"
            ],
            "block": "🧩 BLOCO N4 — TRM (lesão medular)",
            "goals": [
                "Manter ventilação adequada",
                "PCF > 160 L/min ou tosse assistida eficaz"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Avaliar nível medular e função respiratória: PImáx, PEmáx, PCF, VC, CVF (Inicial)",
                        "VNI noturna ou de suporte se hipoventilação (Se indicado)",
                        "Cabeceira 30-45° (Contínuo)",
                        "Tosse assistida: compressão abdominal sincronizada (Sessões)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "TMI: carga progressiva se nível medular permite (2x/dia)",
                        "Higiene brônquica: tosse assistida, vibração, posicionamento (Sessões)",
                        "Se PCF < 160: tosse mecânica (MI-E) (Obrigatório)",
                        "Reavaliar PCF e função respiratória (A cada 48-72h)"
                    ]
                }
            ]
        },
        {
            "name": "N4.2 — Disautonomia / intolerância ortostática na lesão medular",
            "desc": "Grave. Hipotensão ortostática grave, síncope",
            "assess": [
                "Tolerar verticalização sem síncope"
            ],
            "interv": [
                "Protocolo de verticalização muito gradual (Protocolo estrito)",
                "Meias de compressão + cinta abdominal (Usar sempre)",
                "Prancheta ortostática se disponível (Protocolo)",
                "Monitorar PA e FC ao verticalizar (Vigilância)"
            ],
            "block": "🧩 BLOCO N4 — TRM (lesão medular)",
            "goals": [
                "Tolerar verticalização sem síncope"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Meias de compressão + cinta abdominal antes de qualquer verticalização (Usar sempre)",
                        "Elevação progressiva de cabeceira: 15° → 30° → 45° → 60° → 90° (Muito gradual)",
                        "Prancheta ortostática se disponível: começar em 30° por 10-15 min (Protocolo)",
                        "Monitorar PA e FC a cada incremento (Vigilância)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Aumentar grau e tempo de verticalização progressivamente (Gradual)",
                        "PARADA: queda PAS > 20 mmHg com sintomas, pré-síncope (Critérios rígidos)"
                    ]
                }
            ]
        },
        {
            "name": "N4.3 — Imobilismo, contraturas e espasticidade na lesão medular",
            "desc": "Grave. Paralisia, espasticidade, encurtamentos",
            "assess": [
                "Prevenir contraturas",
                "Manter amplitude de movimento funcional"
            ],
            "interv": [
                "Mobilização passiva completa de todos os segmentos (2-3x/dia)",
                "Posicionamento funcional: evitar posturas viciosas (A cada 2-4h)",
                "Órteses noturnas para prevenção de equino e outras contraturas (Noturno)",
                "Técnicas de inibição da espasticidade: relaxamento progressivo, posicionamento"
            ],
            "block": "🧩 BLOCO N4 — TRM (lesão medular)",
            "goals": [
                "Prevenir contraturas",
                "Manter amplitude de movimento funcional"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Mobilização passiva completa de todos os segmentos (2-3x/dia)",
                        "Posicionamento funcional: evitar posturas viciosas (A cada 2-4h)",
                        "Órteses noturnas para prevenção de equino e outras contraturas (Noturno)"
                    ]
                },
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Técnicas de inibição da espasticidade: posicionamento, relaxamento progressivo (Sessões)",
                        "Alongamentos passivos sustentados (Sessões)",
                        "Mudança de decúbito 2/2h para prevenir lesão por pressão (Rotina)"
                    ]
                }
            ]
        },
        {
            "name": "N4.4 — Incapacidade de transferências na lesão medular",
            "desc": "Grave. Dependência total, não controla tronco",
            "assess": [
                "Máxima independência funcional possível nas transferências"
            ],
            "interv": [
                "Treino de rolar com equipamento adaptado (Funcional)",
                "Transferências assistidas: leito → cadeira de rodas (Progressivo)",
                "Treino de equilíbrio sentado com suporte (Funcional)",
                "Adaptações e equipamentos de auxílio (Compensatório)"
            ],
            "block": "🧩 BLOCO N4 — TRM (lesão medular)",
            "goals": [
                "Máxima independência funcional possível nas transferências"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Treino de rolar com equipamento adaptado conforme nível (Funcional)",
                        "Transferências assistidas: leito → cadeira de rodas (Progressivo)",
                        "Treino de equilíbrio sentado com suporte (Funcional)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Progressão para transferências com menor assistência (Independência)",
                        "Adaptações e equipamentos de auxílio conforme avaliação (Compensatório)",
                        "Treino de propulsão de cadeira de rodas se motorização permite (Funcional)"
                    ]
                }
            ]
        },
        {
            "name": "N4.5 — Prevenção de complicações secundárias na lesão medular",
            "desc": "Moderado. TVP, atelectasia, úlcera por pressão, osteopenia",
            "assess": [
                "Prevenir TVP, atelectasia, úlcera por pressão, osteopenia"
            ],
            "interv": [
                "Mudança de decúbito: 2/2h (Rotina rigorosa)",
                "Exercícios de bomba muscular MMII: mobilização passiva (Contínuo)",
                "Higiene brônquica preventiva (Sessões)",
                "Carga axial progressiva quando ortopedia permite (Osso)"
            ],
            "block": "🧩 BLOCO N4 — TRM (lesão medular)",
            "goals": [
                "Prevenir TVP, atelectasia, úlcera por pressão, osteopenia"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Mudança de decúbito 2/2h com alívio de pressão em proeminências (Rotina rigorosa)",
                        "Mobilização passiva MMII: prevenção TVP e osteopenia (Contínuo)",
                        "Cabeceira 30-45°: prevenção de atelectasia (Contínuo)",
                        "Inspeção diária de pele (Rotina)"
                    ]
                },
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Higiene brônquica preventiva (Sessões)",
                        "Verticalização progressiva: carga axial para osso (Gradual)",
                        "Meias de compressão + profilaxia TVP com equipe (Contínuo)"
                    ]
                }
            ]
        },
        {
            "name": "N4.6 — Transição para funcionalidade (lesão incompleta)",
            "desc": "Moderado. Fraqueza residual, baixa resistência",
            "assess": [
                "Maximizar função residual",
                "Independência progressiva"
            ],
            "interv": [
                "Exercícios ativos de grupos musculares preservados (Sessões)",
                "Treino de marcha com auxílio conforme preservação motora (Progressivo)",
                "TMI se fraqueza respiratória residual (2x/dia)",
                "Treino de AVDs com adaptações se necessário"
            ],
            "block": "🧩 BLOCO N4 — TRM (lesão medular)",
            "goals": [
                "Maximizar função residual",
                "Independência progressiva"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Exercícios ativos de grupos musculares preservados (Sessões)",
                        "Treino de transferências e equilíbrio (Funcional)",
                        "Ortostatismo com suporte conforme tolerância (Progressivo)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Treino de marcha com auxiliar conforme preservação motora (Progressivo)",
                        "TMI se fraqueza respiratória residual (2x/dia)",
                        "Treino de AVDs com adaptações (Funcional)"
                    ]
                }
            ]
        },
        {
            "name": "N5.1 — Fraqueza respiratória progressiva (doenças neuromusculares)",
            "desc": "Crítico. Queda progressiva PImáx, PEmáx, PCF",
            "assess": [
                "Monitorar e manter função respiratória",
                "Indicação oportuna de VNI/VM"
            ],
            "interv": [
                "Medir PImáx, PEmáx, PCF, CVF em posição sentada e supina (Monitorar seriado)",
                "TMI: carga 30-50% PImáx se CVF > 50% previsto (Cautela: pode fatiga)",
                "VNI noturna quando CVF < 50% previsto ou sintomas de hipoventilação",
                "Orientar sobre sinais de alarme: acordar com cefaleia, sonolência, dispneia"
            ],
            "block": "🧩 BLOCO N5 — Doenças neuromusculares",
            "goals": [
                "Monitorar e manter função respiratória",
                "Indicação oportuna de VNI/VM"
            ],
            "phases": [
                {
                    "timeframe": "Monitoramento",
                    "interv": [
                        "Medir PImáx, PEmáx, PCF, CVF sentado e supino (Seriado)",
                        "VNI noturna quando CVF < 50% previsto ou PaCO₂ > 45 (Indicação)",
                        "TMI com carga leve se CVF > 50% previsto e sem fadiga (Cautela)"
                    ]
                },
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Reavaliar função respiratória (A cada 2-4 semanas ou ao piora)",
                        "Orientar sobre sinais de alarme (Educação)",
                        "Planejar transição para VM quando indicado (Multidisciplinar)"
                    ]
                }
            ]
        },
        {
            "name": "N5.2 — Tosse ineficaz / incapacidade de limpar via aérea",
            "desc": "Crítico. PCF < 160 L/min, acúmulo secreção",
            "assess": [
                "PCF > 160 L/min ou tosse mecânica assistida eficaz"
            ],
            "interv": [
                "Medir PCF (Baseline e seriado)",
                "Tosse assistida manual: compressão abdominal sincronizada (Sessões)",
                "Se PCF < 160: MI-E (tosse mecânica) 2-3x/dia (Obrigatório)",
                "Higiene brônquica complementar: posicionamento, vibração"
            ],
            "block": "🧩 BLOCO N5 — Doenças neuromusculares",
            "goals": [
                "PCF > 160 L/min ou tosse mecânica eficaz"
            ],
            "phases": [
                {
                    "timeframe": "Sessão/24h",
                    "interv": [
                        "Medir PCF (Baseline e a cada avaliação)",
                        "Tosse assistida manual: compressão abdominal sincronizada (Sessões)",
                        "Se PCF < 160: MI-E (Insuflador-Exsuflador Mecânico) 2-3x/dia (Obrigatório)"
                    ]
                },
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Higiene brônquica: posicionamento, vibração, aspiração se necessário (PRN)",
                        "Reavaliar PCF periodicamente (Seriado)",
                        "Orientar familiar/cuidador sobre técnica de tosse assistida (Educação)"
                    ]
                }
            ]
        },
        {
            "name": "N5.3 — Fadiga muscular global (doenças neuromusculares)",
            "desc": "Grave. Fadiga rápida, piora ao longo do dia",
            "assess": [
                "Otimizar energia para atividades funcionais prioritárias"
            ],
            "interv": [
                "Sessões curtas (10-15 min) com pausas prolongadas (Respeitar fadiga)",
                "Programar atividades no período de melhor energia (manhã) (Timing)",
                "Princípio da conservação de energia: atividades essenciais primeiro (Prioridade)",
                "Evitar exercícios resistidos pesados (Pode agravar fraqueza em DNM)"
            ],
            "block": "🧩 BLOCO N5 — Doenças neuromusculares",
            "goals": [
                "Otimizar energia para atividades funcionais prioritárias"
            ],
            "phases": [
                {
                    "timeframe": "Sessões",
                    "interv": [
                        "Sessões curtas (10-15 min) com pausas prolongadas (Respeitar fadiga)",
                        "Programar atividades no período de melhor energia (manhã) (Timing)",
                        "Evitar exercícios resistidos pesados em doenças progressivas (Cautela)"
                    ]
                },
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Princípio da conservação de energia: priorizar AVDs essenciais (Prioridade)",
                        "Adaptações e equipamentos de economia de energia (Compensatório)",
                        "Monitorar padrão de fadiga e ajustar atividades (Ajuste)"
                    ]
                }
            ]
        },
        {
            "name": "N5.4 — Perda de mobilidade e função (doenças neuromusculares)",
            "desc": "Grave. Fraqueza proximal/distal, incapacidade funcional",
            "assess": [
                "Manter máxima funcionalidade possível",
                "Prevenir complicações do imobilismo"
            ],
            "interv": [
                "Exercícios ativos de baixa intensidade dos grupos preservados (Sessões)",
                "Mobilização passiva de segmentos sem força ativa (Sessões)",
                "Adaptações e equipamentos de auxílio (Compensatório)",
                "Prevenção de contraturas: alongamentos e posicionamento"
            ],
            "block": "🧩 BLOCO N5 — Doenças neuromusculares",
            "goals": [
                "Manter máxima funcionalidade possível",
                "Prevenir complicações do imobilismo"
            ],
            "phases": [
                {
                    "timeframe": "Sessões",
                    "interv": [
                        "Exercícios ativos de baixa intensidade dos grupos preservados (Sessões)",
                        "Mobilização passiva de segmentos sem força ativa (Sessões)",
                        "Adaptações e equipamentos de auxílio: órteses, andador, cadeira (Compensatório)"
                    ]
                },
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Prevenção de contraturas: alongamentos e posicionamento (Diário)",
                        "Treino de AVDs com adaptações (Funcional)",
                        "Mudança de decúbito: prevenção de lesão por pressão (2/2h)"
                    ]
                }
            ]
        },
        {
            "name": "N5.5 — Necessidade de VM ou VNI em doença neuromuscular",
            "desc": "Crítico. Hipoventilação, hipercapnia, trabalho respiratório aumentado",
            "assess": [
                "Ventilação adequada",
                "Conforto e qualidade de vida"
            ],
            "interv": [
                "VNI: iniciar com IPAP 8-10, EPAP 4-5, ajustar por conforto e gasometria (Início)",
                "Higiene brônquica intensiva: tosse assistida, MI-E (Antes e depois de VNI)",
                "Desmame criterioso respeitando a doença de base (Cauteloso)",
                "Discutir objetivos de cuidado com paciente e família (Multidisciplinar)"
            ],
            "block": "🧩 BLOCO N5 — Doenças neuromusculares",
            "goals": [
                "Ventilação adequada",
                "Conforto e qualidade de vida"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "VNI: iniciar com baixa pressão, ajustar por conforto e gasometria (Início)",
                        "Higiene brônquica intensiva: tosse assistida, MI-E (Antes e depois de VNI)",
                        "Posicionamento: semi-Fowler para melhor mecânica (Contínuo)"
                    ]
                },
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Desmame criterioso respeitando a doença de base (Cauteloso)",
                        "Discutir objetivos de cuidado com paciente e família (Multidisciplinar)",
                        "Suporte ventilatório domiciliar se indicado (Planejar alta)"
                    ]
                }
            ]
        },
        {
            "name": "N6.1 — Delirium hipoativo",
            "desc": "Grave. Quieto, sonolento, pouco responsivo, imóvel",
            "assess": [
                "Mobilização precoce",
                "Estimulação cognitiva e sensorial"
            ],
            "interv": [
                "Mobilização precoce: sentar beira-leito, ortostatismo progressivo (Protocolo A-F Bundle)",
                "Estimulação cognitiva: reorientação (nome, local, data/hora) (Frequente)",
                "Reduzir sedação com equipe (Despertar diário)",
                "Ciclo sono-vigília: luz natural, reduzir ruído noturno (Ambiental)"
            ],
            "block": "🧩 BLOCO N6 — Delirium e agitação",
            "goals": [
                "Mobilização precoce",
                "Estimulação cognitiva e sensorial"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Reorientação frequente: nome, local, data/hora (Cada contato)",
                        "Estimulação sensorial: falar com o paciente, toques organizados",
                        "Ciclo sono-vigília: luz natural dia, reduzir ruído e luz noite (Ambiental)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Mobilização precoce: sentar beira-leito, ortostatismo (Protocolo A-F Bundle)",
                        "Reduzir sedação com equipe (Despertar diário)",
                        "Estimulação cognitiva: conversar, atividades simples (Frequente)"
                    ]
                }
            ]
        },
        {
            "name": "N6.2 — Delirium hiperativo",
            "desc": "Crítico. Agitado, arrancando dispositivos",
            "assess": [
                "Controlar agitação",
                "Prevenir autolesão"
            ],
            "interv": [
                "Ambiente calmo: reduzir estímulos (luz, som, pessoas) (Ambiental)",
                "Abordagem calma, voz baixa, um estímulo de cada vez (Técnica)",
                "Coordenar sedação mínima eficaz com equipe (Farmacológico)",
                "Mobilização em janelas de menor agitação (Oportunidade)"
            ],
            "block": "🧩 BLOCO N6 — Delirium e agitação",
            "goals": [
                "Controlar agitação",
                "Prevenir autolesão"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Ambiente calmo: reduzir estímulos de luz, som e pessoas (Ambiental)",
                        "Abordagem calma, voz baixa, um estímulo de cada vez (Técnica)",
                        "Coordenar sedação mínima eficaz com equipe médica (Farmacológico)",
                        "Reorientação gentil e repetida (Neuro)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Mobilização em janelas de menor agitação (Oportunidade)",
                        "Progressão de atividades conforme melhora (Gradual)",
                        "Protocolo A-F Bundle adaptado: despertar, respiração, sedação, delirium, mobilização (Bundle)"
                    ]
                }
            ]
        },
        {
            "name": "N6.3 — Delirium + imobilidade prolongada",
            "desc": "Grave. Dias/semanas no leito, extremamente fraco",
            "assess": [
                "Mobilização progressiva",
                "Recuperar força e funcionalidade"
            ],
            "interv": [
                "Protocolo de mobilização precoce: sentar → ortostatismo → marcha (Progressivo)",
                "Exercícios ativos de fortalecimento global (Sessões)",
                "Fisioterapia 2x/dia (Intensivo)",
                "Reorientação durante todos os contatos (Neuro)"
            ],
            "block": "🧩 BLOCO N6 — Delirium e agitação",
            "goals": [
                "Mobilização progressiva",
                "Recuperar força e funcionalidade"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Sedestação beira-leito (Degrau 2)",
                        "Exercícios ativos assistidos: MMSS, MMII, tronco (Sessões)",
                        "Reorientação durante todos os contatos (Neuro)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Ortostatismo com suporte (Degrau 3)",
                        "Marcha progressiva (Degrau 4)",
                        "Fisioterapia 2x/dia quando tolera (Intensivo)"
                    ]
                }
            ]
        },
        {
            "name": "N6.4 — Delirium + fraqueza respiratória",
            "desc": "Grave. Padrão rápido/superficial, tosse ineficaz",
            "assess": [
                "PCF > 160 L/min",
                "Prevenir complicações respiratórias"
            ],
            "interv": [
                "Medir PCF (Inicial)",
                "Higiene brônquica: posicionamento, vibração, aspiração PRN (Sessões)",
                "Exercícios respiratórios: inspiração profunda quando coopera (Sessões)",
                "Cabeceira 30-45° (Contínuo)"
            ],
            "block": "🧩 BLOCO N6 — Delirium e agitação",
            "goals": [
                "PCF > 160 L/min",
                "Prevenir complicações respiratórias"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Medir PCF quando coopera (Inicial)",
                        "Cabeceira 30-45° (Contínuo)",
                        "Higiene brônquica: posicionamento, vibração, aspiração PRN (Sessões)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Exercícios respiratórios quando coopera: inspiração profunda (Sessões)",
                        "Tosse assistida quando agitação controlada (Sessões)",
                        "Reavaliar PCF conforme melhora do nível de consciência"
                    ]
                }
            ]
        },
        {
            "name": "N7.1 — Rebaixamento pós-crise / pós-sedativos",
            "desc": "Grave. Sonolência, confusão, não segue comandos",
            "assess": [
                "Recuperação progressiva do nível de consciência"
            ],
            "interv": [
                "Reorientação frequente: nome, local, data (Cada contato)",
                "Estimulação sensorial organizada: voz, toque, visual (Neuro)",
                "Mobilização passiva enquanto não coopera (Sessões)",
                "Cabeceira 30-45° e posicionamento adequado"
            ],
            "block": "🧩 BLOCO N7 — Pós-crise convulsiva e status epiléptico",
            "goals": [
                "Recuperação progressiva do nível de consciência"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Reorientação frequente: nome, local, data (Cada contato)",
                        "Estimulação sensorial organizada: voz, toque, visual (Neuro)",
                        "Mobilização passiva: MMSS e MMII (Sessões)",
                        "Cabeceira 30-45° e posicionamento adequado (Contínuo)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Progredir para exercícios ativos conforme melhora do nível de consciência",
                        "Sedestação quando coopera e tolera (Progressivo)"
                    ]
                }
            ]
        },
        {
            "name": "N7.2 — Risco de aspiração / secreção retida pós-crise",
            "desc": "Grave. Tosse ineficaz pós-ictal, disfagia",
            "assess": [
                "Prevenir aspiração e pneumonia",
                "Limpar via aérea"
            ],
            "interv": [
                "Cabeceira ≥ 30-45° (Contínuo)",
                "Higiene brônquica: posicionamento, tosse assistida (Sessões)",
                "Avaliação de deglutição antes de iniciar dieta oral (Encaminhar fono)",
                "Aspiração orofaríngea PRN (Vigilância)"
            ],
            "block": "🧩 BLOCO N7 — Pós-crise convulsiva e status epiléptico",
            "goals": [
                "Prevenir aspiração e pneumonia",
                "Limpar via aérea"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Cabeceira ≥ 30-45° (Contínuo)",
                        "Higiene oral rigorosa (Rotina)",
                        "Aspiração orofaríngea PRN (Vigilância)",
                        "Higiene brônquica: posicionamento, vibração (Sessões)"
                    ]
                },
                {
                    "timeframe": "24-48h",
                    "interv": [
                        "Tosse assistida quando coopera (Sessões)",
                        "Avaliação de deglutição antes de iniciar dieta oral (Encaminhar fono)",
                        "Reavaliar PCF (Avaliação)"
                    ]
                }
            ]
        },
        {
            "name": "N7.3 — Instabilidade autonômica / fadiga pós-crise",
            "desc": "Moderado. Taquicardia, PA lábil, fadiga intensa",
            "assess": [
                "Estabilizar autonômica",
                "Repouso ativo"
            ],
            "interv": [
                "Repouso relativo nas primeiras horas pós-crise (Imediato)",
                "Monitorar PA, FC e SpO₂ (Contínuo)",
                "Exercícios muito leves quando hemodinâmica estável (Sessões)",
                "Progressão cuidadosa: fadiga pode ser prolongada"
            ],
            "block": "🧩 BLOCO N7 — Pós-crise convulsiva e status epiléptico",
            "goals": [
                "Estabilizar função autonômica",
                "Progressão cuidadosa"
            ],
            "phases": [
                {
                    "timeframe": "0-12h",
                    "interv": [
                        "Repouso relativo nas primeiras horas pós-crise (Imediato)",
                        "Monitorar PA, FC e SpO₂ (Contínuo)",
                        "O₂ se SpO₂ < 94% (Titular)"
                    ]
                },
                {
                    "timeframe": "12-72h",
                    "interv": [
                        "Exercícios muito leves quando hemodinâmica estável (Sessões)",
                        "Progressão cuidadosa respeitando fadiga (Gradual)"
                    ]
                }
            ]
        },
        {
            "name": "N7.4 — Fraqueza global / descondicionamento pós-status",
            "desc": "Grave. Não consegue sentar, levantar, transferir",
            "assess": [
                "Recuperar funcionalidade progressivamente"
            ],
            "interv": [
                "Exercícios ativos progressivos: MMSS, MMII, tronco (Sessões)",
                "Sedestação beira-leito (Degrau 2)",
                "Ortostatismo com suporte (Degrau 3)",
                "Marcha assistida progressiva (Degrau 4)"
            ],
            "block": "🧩 BLOCO N7 — Pós-crise convulsiva e status epiléptico",
            "goals": [
                "Recuperar funcionalidade progressivamente"
            ],
            "phases": [
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Exercícios ativos progressivos: MMSS, MMII, tronco (Sessões)",
                        "Sedestação beira-leito (Degrau 2)",
                        "Monitorar PA e FC ao mobilizar (Vigilância)"
                    ]
                },
                {
                    "timeframe": "3-7 dias",
                    "interv": [
                        "Ortostatismo com suporte (Degrau 3)",
                        "Marcha assistida progressiva (Degrau 4)",
                        "Treino de AVDs (Funcional)"
                    ]
                }
            ]
        },
        {
            "name": "N7.5 — Paciente em VM após status epiléptico",
            "desc": "Crítico. Fraqueza respiratória, tosse ineficaz, assincronia",
            "assess": [
                "Desmame seguro da VM",
                "PCF > 160 L/min pós-extubação"
            ],
            "interv": [
                "Protocolo de desmame de VM (Ver R5-A)",
                "Medir PImáx, PEmáx, PCF quando coopera (Inicial)",
                "TMI se fraqueza muscular respiratória (2x/dia quando estável)",
                "Tosse assistida pós-extubação se PCF baixo"
            ],
            "block": "🧩 BLOCO N7 — Pós-crise convulsiva e status epiléptico",
            "goals": [
                "Desmame seguro da VM",
                "PCF > 160 L/min pós-extubação"
            ],
            "phases": [
                {
                    "timeframe": "0-24h",
                    "interv": [
                        "Protocolo de desmame de VM conforme critérios (Ver R5-A)",
                        "Higiene brônquica: posicionamento, vibração, aspiração PRN",
                        "Mobilização passiva/ativo-assistida enquanto sedado (Sessões)"
                    ]
                },
                {
                    "timeframe": "24-72h",
                    "interv": [
                        "Medir PImáx, PEmáx, PCF quando coopera (Inicial)",
                        "TMI se fraqueza muscular respiratória (2x/dia quando estável)",
                        "TRE diários quando critérios atingidos (Protocolo)",
                        "Tosse assistida pós-extubação se PCF baixo (Sessões)"
                    ]
                }
            ]
        },
        {
            "name": "N7.6 — Risco de recorrência de crise durante terapia",
            "desc": "Moderado. História recente de crise/status",
            "assess": [
                "Realizar terapia com segurança",
                "Reconhecer sinais de crise"
            ],
            "interv": [
                "Verificar anticonvulsivante e nível sérico com equipe antes de iniciar (Pré-condição)",
                "Monitorar durante toda a sessão (Vigilância)",
                "Identificar e remover fatores gatilho: hipóxia, hiperventilação, estresse (Prevenir)",
                "Se crise: proteger paciente, chamar equipe, O₂ (Protocolo)"
            ],
            "block": "🧩 BLOCO N7 — Pós-crise convulsiva e status epiléptico",
            "goals": [
                "Realizar terapia com segurança",
                "Reconhecer sinais de crise"
            ],
            "phases": [
                {
                    "timeframe": "Pré-sessão",
                    "interv": [
                        "Verificar anticonvulsivante e nível sérico com equipe (Pré-condição)",
                        "Identificar fatores gatilho: hipóxia, hiperventilação, estresse (Prevenir)",
                        "Ter O₂ e resgate disponível (Preparo)"
                    ]
                },
                {
                    "timeframe": "Durante sessão",
                    "interv": [
                        "Monitorar SpO₂, FC e estado de consciência (Vigilância)",
                        "Evitar hiperventilação durante exercícios (Cautela)",
                        "Se crise: proteger paciente, chamar equipe, O₂, posição lateral (Protocolo)"
                    ]
                }
            ]
        },
        {
            "name": "N8.1 — Risco de lesão pulmonar (VILI) em morte encefálica",
            "desc": "Crítico. Pulmão normal pode tornar-se lesionado por VM inadequada",
            "assess": [
                "Preservar pulmão para captação",
                "VM protetora rigorosa"
            ],
            "interv": [
                "VM protetora: Vt 6 mL/kg PBW, Pplatô ≤ 30, PEEP 8-10 cmH₂O (Protocolo doador)",
                "Medir mecânica pulmonar a cada 4-6h (Obrigatório)",
                "FiO₂ mínima que mantém SpO₂ > 95% (Reduzir hiperoxia)",
                "Suspiros: 2-3 por hora se protocolo permitir"
            ],
            "block": "🔒 BLOCO N8 — Morte encefálica (doador potencial)",
            "goals": [
                "Preservar pulmão para captação",
                "VM protetora rigorosa"
            ],
            "phases": [
                {
                    "timeframe": "0-2h",
                    "interv": [
                        "VM protetora: Vt 6 mL/kg PBW, Pplatô ≤ 30, PEEP 8-10 cmH₂O (Protocolo doador)",
                        "Medir mecânica pulmonar: Pplatô, ΔP, Cest (A cada 4-6h)",
                        "FiO₂ mínima que mantém SpO₂ > 95% (Reduzir hiperoxia)"
                    ]
                },
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Manter parâmetros protetores rigorosamente (Vigilância)",
                        "Ajustar PEEP por melhor Cest e oxigenação (Titulação)",
                        "Documentar mecânica e gasometria (Prontuário)"
                    ]
                }
            ]
        },
        {
            "name": "N8.2 — Atelectasia por imobilidade em morte encefálica",
            "desc": "Grave. Perda de suspiros, colapso gravitacional",
            "assess": [
                "Manter expansão pulmonar bilateral"
            ],
            "interv": [
                "Mudança de decúbito: lateral esquerdo/direito/supino (A cada 2-4h)",
                "MRA se indicado pelo protocolo de captação (Protocolo)",
                "PEEP adequada para manter abertura alveolar (8-10 cmH₂O)",
                "Auscultar bilateralmente após mudança de decúbito (Verificar)"
            ],
            "block": "🔒 BLOCO N8 — Morte encefálica (doador potencial)",
            "goals": [
                "Manter expansão pulmonar bilateral"
            ],
            "phases": [
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Mudança de decúbito: lateral esquerdo/direito/supino (A cada 2-4h)",
                        "PEEP adequada para manter abertura alveolar (8-10 cmH₂O) (Titulação)",
                        "MRA se indicado pelo protocolo de captação (Protocolo)",
                        "Auscultar bilateralmente após mudança de decúbito (Verificar)"
                    ]
                }
            ]
        },
        {
            "name": "N8.3 — Secreção brônquica em morte encefálica",
            "desc": "Grave. Tosse inexistente, drenagem abolida",
            "assess": [
                "Manter via aérea limpa"
            ],
            "interv": [
                "Aspiração traqueal: técnica asséptica, sistema fechado (Sob demanda: ↑ Ppico, ↑ secreção)",
                "Umidificação adequada: HME ou umidificador aquecido (Contínuo)",
                "Higiene brônquica: posicionamento e vibração (A cada 4h)",
                "Instilação SF 0.9% se secreção espessa (PRN)"
            ],
            "block": "🔒 BLOCO N8 — Morte encefálica (doador potencial)",
            "goals": [
                "Manter via aérea limpa"
            ],
            "phases": [
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Aspiração traqueal: técnica asséptica, sistema fechado (Sob demanda)",
                        "Umidificação adequada: HME ou umidificador aquecido (Contínuo)",
                        "Higiene brônquica: posicionamento e vibração (A cada 4h)",
                        "Instilação SF 0.9% se secreção espessa (PRN)"
                    ]
                }
            ]
        },
        {
            "name": "N8.4 — Instabilidade hemodinâmica induzida pela VM",
            "desc": "Crítico. PEEP alta → queda de retorno venoso, manobras → colapso",
            "assess": [
                "Manter PAM ≥ 65 mmHg durante ajustes ventilatórios"
            ],
            "interv": [
                "Menor PEEP que mantém oxigenação e expansão (Equilíbrio)",
                "Ajustar PEEP em degraus de 2 cmH₂O com avaliação hemodinâmica (Gradual)",
                "Coordenar reposição e vasopressor com equipe antes de aumentar PEEP (Preparo)",
                "Se PA cai: reduzir PEEP imediatamente (Imediato)"
            ],
            "block": "🔒 BLOCO N8 — Morte encefálica (doador potencial)",
            "goals": [
                "Manter PAM ≥ 65 mmHg durante ajustes ventilatórios"
            ],
            "phases": [
                {
                    "timeframe": "Imediato",
                    "interv": [
                        "Menor PEEP que mantém oxigenação e expansão (Equilíbrio)",
                        "Ajustar PEEP em degraus de 2 cmH₂O com avaliação hemodinâmica entre degraus (Gradual)",
                        "Coordenar volume/vasopressor com equipe antes de ajustar PEEP (Preparo)",
                        "Se PA cai: reduzir PEEP imediatamente (Imediato)"
                    ]
                }
            ]
        },
        {
            "name": "N8.5 — Hipotermia e alterações metabólicas em morte encefálica",
            "desc": "Grave. Perda do controle térmico, hipotermia → piora da oxigenação",
            "assess": [
                "Manter temperatura alvo (35-37°C)",
                "Otimizar oxigenação"
            ],
            "interv": [
                "Monitorar temperatura corporal central (Contínuo)",
                "Coordenar aquecimento ativo com equipe (Cobertores, soluções aquecidas) (Equipe)",
                "Ajustar FiO₂ conforme temperatura e gasometria (Ajuste)",
                "Gasometria seriada para guiar parâmetros (A cada 4-6h)"
            ],
            "block": "🔒 BLOCO N8 — Morte encefálica (doador potencial)",
            "goals": [
                "Manter temperatura alvo (35-37°C)",
                "Otimizar oxigenação"
            ],
            "phases": [
                {
                    "timeframe": "Contínuo",
                    "interv": [
                        "Monitorar temperatura corporal central (Contínuo)",
                        "Coordenar aquecimento ativo com equipe (Equipe)",
                        "Ajustar FiO₂ conforme temperatura e gasometria (Ajuste)",
                        "Gasometria seriada para guiar parâmetros (A cada 4-6h)"
                    ]
                }
            ]
        },
        {
            "name": "N8.6 — Preparação do pulmão para captação",
            "desc": "Crítico. Pulmão precisa estar expandido, limpo e estável para captação",
            "assess": [
                "Pulmão expandido, PaO₂/FiO₂ ≥ 300 (critério captação)",
                "Via aérea limpa, sem atelectasia"
            ],
            "interv": [
                "Teste de apneia respiratório com FiO₂ 100% e PEEP 5-10 cmH₂O conforme protocolo (Pré-captação)",
                "MRA se atelectasia presente (Protocolo de captação)",
                "Higiene brônquica completa antes de captação (Preparo)",
                "Documentar gasometria e mecânica para equipe de captação (Prontuário)"
            ],
            "block": "🔒 BLOCO N8 — Morte encefálica (doador potencial)",
            "goals": [
                "Pulmão expandido, PaO₂/FiO₂ ≥ 300 (critério captação)",
                "Via aérea limpa"
            ],
            "phases": [
                {
                    "timeframe": "Pré-captação",
                    "interv": [
                        "MRA se atelectasia presente (Protocolo de captação)",
                        "Higiene brônquica completa: aspiração, posicionamento (Preparo)",
                        "Teste de apneia respiratório conforme protocolo (Pré-captação)",
                        "Documentar gasometria e mecânica para equipe de captação (Prontuário)",
                        "Manter VM protetora até momento da captação (Contínuo)"
                    ]
                }
            ]
        }
    ]
  },
  {
    "id": "renal",
    "name": "Sistema Renal",
    "icon": "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636",
    "color": "#fbbf24",
    "problems": [
      {
        "name": "IRA",
        "desc": "Deterioracao aguda da funcao renal",
        "assess": [
          "KDIGO (Cr e debito urinario)",
          "Causa (pre, renal, pos)",
          "Sedimento urinario",
          "USG renal"
        ],
        "interv": [
          "Otimizar volemia",
          "Suspender nefrotoxicos",
          "Ajustar doses",
          "TRS se indicada"
        ]
      },
      {
        "name": "Hipercalemia Grave",
        "desc": "Potassio serico elevado com risco de arritmia",
        "assess": [
          "K > 6.5 mEq/L ou ECG alterado",
          "Causa",
          "Funcao renal",
          "Medicacoes"
        ],
        "interv": [
          "Gluconato de calcio (estabilizacao)",
          "Insulina + glicose",
          "Beta-2 agonista",
          "Resina de troca",
          "Dialise se refratario"
        ]
      },
      {
        "name": "Hipocalemia Grave",
        "desc": "Potassio serico baixo com risco de arritmia",
        "assess": [
          "K < 2.5 mEq/L ou sintomatico",
          "ECG",
          "Magnesio",
          "Causa"
        ],
        "interv": [
          "Reposicao IV (max 20 mEq/h)",
          "Corrigir magnesio",
          "Monitorizacao cardiaca",
          "Tratar causa"
        ]
      },
      {
        "name": "Hiponatremia Grave",
        "desc": "Sodio serico baixo com sintomas neurologicos",
        "assess": [
          "Na < 125 mEq/L ou sintomatico",
          "Osmolaridade serica/urinaria",
          "Volemia",
          "Velocidade de queda"
        ],
        "interv": [
          "Salina hipertonica 3% se sintomatico",
          "Correcao lenta (8-10 mEq/L/24h)",
          "Tratar causa base"
        ]
      },
      {
        "name": "Hipernatremia Grave",
        "desc": "Sodio serico elevado com desidratacao",
        "assess": [
          "Na > 155 mEq/L",
          "Osmolaridade",
          "Deficit de agua livre",
          "Causa"
        ],
        "interv": [
          "Reposicao de agua livre",
          "Correcao lenta (10-12 mEq/L/24h)",
          "Tratar causa base"
        ]
      },
      {
        "name": "Acidose Metabolica Grave",
        "desc": "pH baixo com bicarbonato reduzido",
        "assess": [
          "pH < 7.2",
          "HCO3 baixo",
          "Anion gap",
          "Lactato",
          "Cetonas"
        ],
        "interv": [
          "Tratar causa base",
          "Bicarbonato se pH < 7.1",
          "Dialise se intoxicacao",
          "Suporte hemodinamico"
        ]
      },
      {
        "name": "Alcalose Metabolica",
        "desc": "pH elevado com bicarbonato aumentado",
        "assess": [
          "pH > 7.45",
          "HCO3 elevado",
          "Cl urinario",
          "Causa (vomitos, diureticos)"
        ],
        "interv": [
          "Reposicao de cloreto",
          "Suspender diureticos",
          "Acetazolamida",
          "Dialise se grave"
        ]
      },
      {
        "name": "Sindrome Hepatorrenal",
        "desc": "IRA funcional em hepatopata",
        "assess": [
          "Criterios diagnosticos",
          "Exclusao de outras causas",
          "Ascite",
          "Funcao hepatica"
        ],
        "interv": [
          "Albumina + terlipressina",
          "Suspender diureticos",
          "Considerar TIPS",
          "Transplante hepatico"
        ]
      },
      {
        "name": "Rabdomiolise",
        "desc": "Destruicao muscular com liberacao de mioglobina",
        "assess": [
          "CPK elevada (> 5x)",
          "Mioglobinuria",
          "IRA",
          "Hipercalemia",
          "Causa"
        ],
        "interv": [
          "Hidratacao agressiva",
          "Manter debito urinario > 200ml/h",
          "Alcalinizacao controversa",
          "TRS se necessario"
        ]
      },
      {
        "name": "Sobrecarga Volemica",
        "desc": "Excesso de volume com congestao",
        "assess": [
          "Balanco hidrico positivo",
          "Edema",
          "Congestao pulmonar",
          "PVC elevada"
        ],
        "interv": [
          "Diureticos",
          "Restricao hidrica",
          "Ultrafiltracao",
          "TRS se refratario"
        ]
      },
      {
        "name": "Sindrome Cardiorrenal",
        "desc": "Disfuncao cardiaca e renal concomitante",
        "assess": [
          "Tipo (1-5)",
          "Funcao cardiaca",
          "Funcao renal",
          "Volemia"
        ],
        "interv": [
          "Otimizar volemia",
          "Inotropicos",
          "Diureticos com cautela",
          "Ultrafiltracao"
        ]
      }
    ]
  },
  {
    "id": "infectious",
    "name": "Infectologia",
    "icon": "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    "color": "#4ade80",
    "problems": [
      {
        "name": "Sepse",
        "desc": "Disfuncao organica por resposta desregulada a infeccao",
        "assess": [
          "qSOFA/SOFA",
          "Foco infeccioso",
          "Lactato",
          "Culturas",
          "PCR/Procalcitonina"
        ],
        "interv": [
          "ATB em 1 hora",
          "Ressuscitacao volemica",
          "Vasopressores se necessario",
          "Controle de foco"
        ]
      },
      {
        "name": "Infeccao de Corrente Sanguinea",
        "desc": "Bacteremia com repercussao clinica",
        "assess": [
          "Hemoculturas (2 pares)",
          "Foco primario",
          "Cateter vascular",
          "ECO se S. aureus"
        ],
        "interv": [
          "ATB de amplo espectro",
          "Remover cateter suspeito",
          "Descalonamento",
          "Duracao adequada"
        ]
      },
      {
        "name": "Infeccao de Sitio Cirurgico",
        "desc": "Infeccao relacionada a procedimento cirurgico",
        "assess": [
          "Sinais locais",
          "Febre",
          "Culturas",
          "Imagem se profunda"
        ],
        "interv": [
          "Drenagem cirurgica",
          "ATB direcionado",
          "Desbridamento se necessario"
        ]
      },
      {
        "name": "ITU Associada a Cateter",
        "desc": "ITU em paciente com SVD > 48h",
        "assess": [
          "Sintomas",
          "Urocultura > 10^3 UFC",
          "Piuria",
          "Tempo de cateter"
        ],
        "interv": [
          "ATB direcionado",
          "Trocar/remover cateter",
          "Duracao 7-14 dias"
        ]
      },
      {
        "name": "C. difficile",
        "desc": "Colite associada a antibioticos",
        "assess": [
          "Diarreia + ATB previo",
          "Toxina nas fezes",
          "PCR",
          "Leucocitose",
          "Megacolon"
        ],
        "interv": [
          "Suspender ATB precipitante",
          "Vancomicina VO (1a linha)",
          "Fidaxomicina",
          "Colectomia se grave"
        ]
      },
      {
        "name": "Candidemia",
        "desc": "Infeccao fungica sistemica por Candida",
        "assess": [
          "Fatores de risco",
          "Hemoculturas",
          "Fundo de olho",
          "1,3 beta-glucana"
        ],
        "interv": [
          "Equinocandina (1a linha)",
          "Remover cateteres",
          "ECO",
          "Fundo de olho",
          "Duracao 14 dias apos clearance"
        ]
      },
      {
        "name": "Aspergilose Invasiva",
        "desc": "Infeccao fungica por Aspergillus",
        "assess": [
          "Imunossupressao",
          "TC de torax (sinal do halo)",
          "Galactomanana",
          "LBA"
        ],
        "interv": [
          "Voriconazol (1a linha)",
          "Anfotericina B lipossomal",
          "Cirurgia se localizada"
        ]
      },
      {
        "name": "TB em UTI",
        "desc": "TB ativa em paciente critico",
        "assess": [
          "Sintomas",
          "Imagem",
          "Baciloscopia",
          "GeneXpert",
          "Cultura"
        ],
        "interv": [
          "RIPE",
          "Isolamento respiratorio",
          "Ajuste para funcao renal/hepatica",
          "Interacoes medicamentosas"
        ]
      },
      {
        "name": "COVID-19 Grave",
        "desc": "Infeccao por SARS-CoV-2 com IRpA",
        "assess": [
          "RT-PCR",
          "TC de torax",
          "D-dimero",
          "Ferritina",
          "IL-6",
          "P/F"
        ],
        "interv": [
          "Dexametasona",
          "Anticoagulacao profilatica/plena",
          "VM protetora",
          "Posicao prona",
          "Tocilizumab se indicado"
        ]
      },
      {
        "name": "Neutropenia Febril",
        "desc": "Febre em paciente com neutrofilos < 500",
        "assess": [
          "Contagem de neutrofilos",
          "Foco infeccioso",
          "Culturas",
          "MASCC score"
        ],
        "interv": [
          "ATB anti-pseudomonas em 1h",
          "Antifungico se febre persistente",
          "G-CSF se indicado"
        ]
      }
    ]
  },
  {
    "id": "metabolic",
    "name": "Endocrino/Metabolico",
    "icon": "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    "color": "#fb923c",
    "problems": [
      {
        "name": "Cetoacidose Diabetica",
        "desc": "Emergencia hiperglicemica com cetose e acidose",
        "assess": [
          "Glicemia > 250",
          "pH < 7.3",
          "Cetonas +",
          "Anion gap elevado",
          "K inicial"
        ],
        "interv": [
          "Hidratacao vigorosa",
          "Insulina IV",
          "Reposicao de potassio",
          "Monitorizacao horaria",
          "Bicarbonato se pH < 6.9"
        ]
      },
      {
        "name": "Estado Hiperglicemico Hiperosmolar",
        "desc": "Hiperglicemia extrema com desidratacao severa",
        "assess": [
          "Glicemia > 600",
          "Osmolaridade > 320",
          "Sem cetose significativa",
          "Desidratacao"
        ],
        "interv": [
          "Hidratacao agressiva",
          "Insulina IV (apos volume)",
          "Correcao de eletrolitos",
          "Prevencao de TEV"
        ]
      },
      {
        "name": "Hipoglicemia Grave",
        "desc": "Glicemia baixa com alteracao neurologica",
        "assess": [
          "Glicemia < 40-50 mg/dL",
          "Triade de Whipple",
          "Causa",
          "Medicacoes"
        ],
        "interv": [
          "Glicose IV 25-50g",
          "Glucagon se sem acesso",
          "Alimentacao quando possivel",
          "Investigar causa"
        ]
      },
      {
        "name": "Crise Tireotoxica",
        "desc": "Hipertireoidismo descompensado grave",
        "assess": [
          "Score de Burch-Wartofsky",
          "TSH suprimido",
          "T4L elevado",
          "Precipitante"
        ],
        "interv": [
          "Propiltiouracil ou Metimazol",
          "Beta-bloqueador",
          "Corticoide",
          "Solucao de Lugol (apos 1h de PTU)",
          "Suporte"
        ]
      },
      {
        "name": "Coma Mixedematoso",
        "desc": "Hipotireoidismo descompensado grave",
        "assess": [
          "TSH elevado",
          "T4L baixo",
          "Hipotermia",
          "Bradicardia",
          "Alteracao de consciencia"
        ],
        "interv": [
          "Levotiroxina IV",
          "Hidrocortisona",
          "Aquecimento passivo",
          "Suporte ventilatorio/hemodinamico"
        ]
      },
      {
        "name": "Insuficiencia Adrenal Aguda",
        "desc": "Deficiencia aguda de cortisol",
        "assess": [
          "Hipotensao refrataria",
          "Hiponatremia",
          "Hipercalemia",
          "Cortisol basal",
          "Teste de estimulo"
        ],
        "interv": [
          "Hidrocortisona IV",
          "Ressuscitacao volemica",
          "Tratar precipitante"
        ]
      },
      {
        "name": "Hipercalcemia Grave",
        "desc": "Calcio serico elevado com sintomas",
        "assess": [
          "Ca > 14 mg/dL ou sintomatico",
          "PTH",
          "Vitamina D",
          "Malignidade",
          "ECG"
        ],
        "interv": [
          "Hidratacao vigorosa",
          "Furosemida",
          "Bifosfonatos",
          "Calcitonina",
          "Dialise se refratario"
        ]
      },
      {
        "name": "Hipocalcemia Grave",
        "desc": "Calcio serico baixo com sintomas",
        "assess": [
          "Ca corrigido < 7.5 ou sintomatico",
          "PTH",
          "Magnesio",
          "Vitamina D",
          "ECG"
        ],
        "interv": [
          "Gluconato de calcio IV",
          "Infusao continua",
          "Corrigir magnesio",
          "Vitamina D"
        ]
      },
      {
        "name": "Hipofosfatemia Grave",
        "desc": "Fosforo serico criticamente baixo",
        "assess": [
          "P < 1 mg/dL",
          "Fraqueza muscular",
          "IRpA",
          "Causa"
        ],
        "interv": [
          "Reposicao IV de fosfato",
          "Monitorar calcio",
          "Tratar causa"
        ]
      },
      {
        "name": "Hipomagnesemia Grave",
        "desc": "Magnesio serico baixo",
        "assess": [
          "Mg < 1 mEq/L",
          "Arritmias",
          "Tetania",
          "Hipocalemia refrataria"
        ],
        "interv": [
          "Sulfato de magnesio IV",
          "Monitorizacao cardiaca",
          "Tratar causa"
        ]
      }
    ]
  },
  {
    "id": "gastrointestinal",
    "name": "Sistema Gastrointestinal",
    "icon": "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
    "color": "#facc15",
    "problems": [
      {
        "name": "HDA",
        "desc": "Sangramento acima do angulo de Treitz",
        "assess": [
          "Estabilidade hemodinamica",
          "Glasgow-Blatchford",
          "Hemoglobina",
          "EDA"
        ],
        "interv": [
          "Ressuscitacao volemica",
          "IBP IV",
          "EDA em 24h",
          "Hemostasia endoscopica",
          "Octreotide se varicosa"
        ]
      },
      {
        "name": "HDB",
        "desc": "Sangramento abaixo do angulo de Treitz",
        "assess": [
          "Hematoquezia",
          "Estabilidade",
          "Colonoscopia",
          "AngioTC"
        ],
        "interv": [
          "Ressuscitacao",
          "Colonoscopia",
          "Embolizacao",
          "Cirurgia se refratario"
        ]
      },
      {
        "name": "Hemorragia Varicosa",
        "desc": "Sangramento por varizes esofagicas",
        "assess": [
          "Estigmas de hepatopatia",
          "Hemodinamica",
          "Child-Pugh",
          "MELD"
        ],
        "interv": [
          "Octreotide/Terlipressina",
          "ATB profilatico",
          "EDA + ligadura elastica",
          "TIPS se refratario",
          "Balao de Sengstaken"
        ]
      },
      {
        "name": "Pancreatite Aguda Grave",
        "desc": "Inflamacao pancreatica com disfuncao organica",
        "assess": [
          "Ranson/APACHE II/BISAP",
          "Lipase/Amilase",
          "TC com contraste",
          "Necrose",
          "Colecoes"
        ],
        "interv": [
          "Ressuscitacao volemica agressiva",
          "Analgesia",
          "Nutricao enteral precoce",
          "ATB se necrose infectada",
          "Drenagem/Necrosectomia"
        ]
      },
      {
        "name": "Colangite Aguda",
        "desc": "Infeccao das vias biliares",
        "assess": [
          "Triade de Charcot",
          "Pentade de Reynolds",
          "USG/TC",
          "Bilirrubinas"
        ],
        "interv": [
          "ATB de amplo espectro",
          "CPRE para drenagem",
          "Suporte hemodinamico"
        ]
      },
      {
        "name": "Insuficiencia Hepatica Aguda",
        "desc": "Falencia hepatica com encefalopatia em figado previamente saudavel",
        "assess": [
          "INR",
          "Bilirrubinas",
          "Amonia",
          "Encefalopatia",
          "Causa (viral, drogas, isquemia)"
        ],
        "interv": [
          "Suporte intensivo",
          "N-acetilcisteina",
          "Manejo de HIC",
          "Transplante hepatico"
        ]
      },
      {
        "name": "PBE",
        "desc": "Peritonite bacteriana espontanea",
        "assess": [
          "Paracentese diagnostica",
          "GASA",
          "PMN > 250",
          "Cultura"
        ],
        "interv": [
          "Cefotaxima/Ceftriaxona",
          "Albumina (1.5g/kg D1, 1g/kg D3)",
          "TIPS se refrataria"
        ]
      },
      {
        "name": "Ileo Paralitico",
        "desc": "Ausencia de peristalse sem obstrucao mecanica",
        "assess": [
          "Distensao abdominal",
          "Ausencia de RHA",
          "RX/TC",
          "Eletrolitos"
        ],
        "interv": [
          "Jejum",
          "SNG",
          "Correcao de eletrolitos",
          "Mobilizacao",
          "Neostigmina se refratario"
        ]
      },
      {
        "name": "Obstrucao Intestinal",
        "desc": "Bloqueio mecanico do transito intestinal",
        "assess": [
          "Dor, distensao, vomitos",
          "RHA aumentados/ausentes",
          "TC de abdome",
          "Sinais de estrangulamento"
        ],
        "interv": [
          "Jejum + SNG",
          "Ressuscitacao volemica",
          "Cirurgia se estrangulamento",
          "Tratamento conservador inicial"
        ]
      },
      {
        "name": "Isquemia Mesenterica",
        "desc": "Comprometimento vascular intestinal",
        "assess": [
          "Dor desproporcional ao exame",
          "Lactato",
          "AngioTC",
          "Acidose"
        ],
        "interv": [
          "Ressuscitacao",
          "Anticoagulacao",
          "Cirurgia/Embolectomia",
          "Resseccao de segmento necrotico"
        ]
      },
      {
        "name": "Sindrome Compartimental Abdominal",
        "desc": "PIA elevada com disfuncao organica",
        "assess": [
          "PIA > 20 mmHg + disfuncao",
          "Medida vesical",
          "Distensao",
          "Oliguria"
        ],
        "interv": [
          "Posicionamento",
          "Drenagem de colecoes",
          "Descompressao cirurgica",
          "Sedacao/BNM"
        ]
      }
    ]
  },
  {
    "id": "hematologic",
    "name": "Sistema Hematologico",
    "icon": "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z",
    "color": "#f87171",
    "problems": [
      {
        "name": "CIVD",
        "desc": "Ativacao sistemica da coagulacao com consumo",
        "assess": [
          "ISTH DIC Score",
          "Plaquetas",
          "Fibrinogenio",
          "D-dimero",
          "TP/TTPA"
        ],
        "interv": [
          "Tratar causa base",
          "Plasma se sangramento + TP alargado",
          "Plaquetas se < 50k + sangramento",
          "Crioprecipitado se fibrinogenio < 100"
        ]
      },
      {
        "name": "HIT",
        "desc": "Trombocitopenia imune por exposicao a heparina",
        "assess": [
          "Escore 4T",
          "Queda > 50% plaquetas",
          "Timing D5-14",
          "Anti-PF4"
        ],
        "interv": [
          "Suspender toda heparina",
          "Anticoagulante alternativo (argatroban, fondaparinux)",
          "Nao transfundir plaquetas"
        ]
      },
      {
        "name": "Anemia Hemolitica Aguda",
        "desc": "Destruicao acelerada de hemacias",
        "assess": [
          "Reticulocitos",
          "LDH",
          "Bilirrubina indireta",
          "Haptoglobina",
          "Coombs"
        ],
        "interv": [
          "Transfusao cautelosa",
          "Corticoide se autoimune",
          "Plasmaferese se PTT",
          "Tratar causa base"
        ]
      },
      {
        "name": "PTT",
        "desc": "Microangiopatia trombotica com pentade classica",
        "assess": [
          "Anemia hemolitica microangiopatica",
          "Trombocitopenia",
          "Esquizocitos",
          "ADAMTS13"
        ],
        "interv": [
          "Plasmaferese urgente",
          "Corticoide",
          "Rituximab",
          "NAO transfundir plaquetas"
        ]
      },
      {
        "name": "Sindrome Hemofagocitica",
        "desc": "Ativacao imune descontrolada",
        "assess": [
          "H-Score",
          "Febre",
          "Esplenomegalia",
          "Citopenias",
          "Ferritina > 500",
          "Triglicerideos"
        ],
        "interv": [
          "Tratar causa base",
          "Dexametasona",
          "Etoposideo",
          "Ciclosporina"
        ]
      },
      {
        "name": "Neutropenia Febril",
        "desc": "Febre em paciente com neutrofilos < 500",
        "assess": [
          "Contagem de neutrofilos",
          "Foco infeccioso",
          "Culturas",
          "MASCC score"
        ],
        "interv": [
          "ATB anti-pseudomonas em 1h",
          "Antifungico se febre persistente",
          "G-CSF se indicado"
        ]
      },
      {
        "name": "Transfusao Macica",
        "desc": "Reposicao de > 10 CH em 24h ou > 1 volemia",
        "assess": [
          "Coagulopatia",
          "Hipotermia",
          "Hipocalcemia",
          "Hipercalemia",
          "Acidose"
        ],
        "interv": [
          "Protocolo de transfusao macica (1:1:1)",
          "Aquecimento",
          "Calcio",
          "Acido tranexamico"
        ]
      },
      {
        "name": "Reacao Transfusional Hemolitica",
        "desc": "Hemolise por incompatibilidade",
        "assess": [
          "Febre",
          "Hemoglobinuria",
          "Dor lombar",
          "Hipotensao",
          "Coombs direto"
        ],
        "interv": [
          "Parar transfusao imediatamente",
          "Hidratacao vigorosa",
          "Manter debito urinario",
          "Suporte"
        ]
      },
      {
        "name": "TRALI",
        "desc": "Lesao pulmonar aguda relacionada a transfusao",
        "assess": [
          "Dispneia aguda durante/apos transfusao",
          "Hipoxemia",
          "Infiltrado bilateral",
          "Sem sobrecarga"
        ],
        "interv": [
          "Suporte ventilatorio",
          "Nao ha tratamento especifico",
          "Notificar banco de sangue"
        ]
      },
      {
        "name": "TEV",
        "desc": "TVP e/ou TEP",
        "assess": [
          "D-dimero",
          "USG Doppler",
          "AngioTC",
          "Score de Wells"
        ],
        "interv": [
          "Anticoagulacao plena",
          "Trombolise se TEP macico",
          "Filtro de VCI se contraindicacao"
        ]
      }
    ]
  },
  {
    "id": "functional",
    "name": "Sistema Funcional",
    "icon": "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    "color": "#a78bfa",
    "problems": [
        {
            "name": "F1.P1 — Déficit de controle de tronco",
            "desc": "Grave. Incapacidade de manter sedestação sem apoio > 30-60s, quedas laterais/posteriores frequentes, necessidade de apoio manual constante, TCT reduzida",
            "block": "🧠 BLOCO F1 — NEUROLÓGICO-FUNCIONAL",
            "goals": [
                "Manter sedestação sem apoio MMSS > 1 min",
                "Reduzir necessidade de apoio para mudanças posturais",
                "Ativar reações de endireitamento e equilíbrio de tronco"
            ],
            "assess": [
                "Teste controle de tronco (TCT ou Trunk Impairment Scale)",
                "Tempo de sedestação sem apoio",
                "Qualidade das reações de equilíbrio lateral/posterior",
                "Tônus axial e ativação de extensores de tronco"
            ],
            "interv": [
                "Sedestação ativa com feedback visual",
                "Alcance bilateral para treino de tronco",
                "Ativação de oblíquos e extensores em decúbito lateral",
                "Progressão: apoio em MMSS → sem apoio → perturbação externa",
                "Facilitação neuroproprioceptiva: técnicas de Bobath/PNF para tronco"
            ]
        },
        {
            "name": "F1.P2 — Alteração de tônus (hipotonia / hipertonia / espasticidade)",
            "desc": "Moderado. Ashworth Modificada ≥ 1+ (espasticidade), hipotonia com instabilidade proximal, rigidez que limita ADM e função",
            "block": "🧠 BLOCO F1 — NEUROLÓGICO-FUNCIONAL",
            "goals": [
                "Manter ADM funcional nos segmentos afetados",
                "Reduzir padrão espástico limitante",
                "Melhorar ativação seletiva distal"
            ],
            "assess": [
                "Escala de Ashworth Modificada",
                "ADM passiva e ativa nos segmentos afetados",
                "Padrões posturais patológicos em repouso e função",
                "Impacto do tônus na execução de AVDs"
            ],
            "interv": [
                "Mobilização passiva e alongamento suave sustentado",
                "Posicionamento anti-espástico no leito e cadeira",
                "Treino de ativação seletiva distal (ex: extensão de punho, dorsiflexão)",
                "Crioterapia local para redução de espasticidade antes do treino",
                "Órteses e posicionadores quando indicados"
            ]
        },
        {
            "name": "F1.P3 — Hemiparesia / Tetraparesia de origem central",
            "desc": "Grave. Assimetria motora funcional, padrões sinérgicos patológicos, déficit de ativação seletiva",
            "block": "🧠 BLOCO F1 — NEUROLÓGICO-FUNCIONAL",
            "goals": [
                "Ativar recrutamento voluntário nos membros afetados",
                "Integrar membro afetado em atividades bilaterais",
                "Progredir de sinergia para ativação seletiva"
            ],
            "assess": [
                "Fugl-Meyer Motor Assessment (MMSS/MMII)",
                "MRC por grupo muscular",
                "Padrões sinérgicos de flexão/extensão",
                "Capacidade de uso funcional do membro afetado (MAL, FIM motor)"
            ],
            "interv": [
                "Treino de ativação seletiva: isometria → isotonia com gravidade",
                "Treino orientado a tarefas funcionais (alcance, preensão, apoio em MMII)",
                "Terapia de movimento induzido por restrição (CIMT) quando indicado",
                "FES (estimulação elétrica funcional) para ativação de extensores de punho/dorsiflexores",
                "Treino bilateral de MMSS com espelho ou biofeedback"
            ]
        },
        {
            "name": "F1.P4 — Apraxia / Déficit de planejamento motor",
            "desc": "Moderado. Não executa tarefas apesar de força e compreensão preservadas, erros de sequência e uso inadequado de objetos, dificuldade de iniciar movimentos funcionais",
            "block": "🧠 BLOCO F1 — NEUROLÓGICO-FUNCIONAL",
            "goals": [
                "Melhorar desempenho em AVDs básicas com demonstração",
                "Reduzir erros de sequência em tarefas funcionais simples",
                "Facilitar iniciação motora voluntária"
            ],
            "assess": [
                "PRAXIS: teste de imitação de gestos e uso de objetos",
                "Observação de erros em AVDs (escovação, alimentação, vestir)",
                "Capacidade de imitação vs comando verbal",
                "Velocidade e precisão de execução de sequências"
            ],
            "interv": [
                "Demonstração e pista gestual antes da tarefa",
                "Prática de sequências funcionais com cueing externo",
                "Repetição intensiva com feedback imediato",
                "Treino em ambiente real com objetos reais",
                "Reduzir pistas progressivamente conforme aprendizado"
            ]
        },
        {
            "name": "F1.P5 — Ataxia / Incoordenação",
            "desc": "Moderado. Dismetria, decomposição de movimento, marcha atáxica, instabilidade mesmo com força preservada",
            "block": "🧠 BLOCO F1 — NEUROLÓGICO-FUNCIONAL",
            "goals": [
                "Reduzir dismetria em alcance e marcha",
                "Melhorar estabilidade de tronco durante movimento de membros",
                "Aumentar velocidade e fluidez de movimentos coordenados"
            ],
            "assess": [
                "Teste de dedo-nariz e calcanhar-joelho",
                "Berg Balance Scale / Dynamic Gait Index",
                "Velocidade de marcha e análise de padrão",
                "Tremor de intenção e decomposição de movimento"
            ],
            "interv": [
                "Exercícios de coordenação com progressão de velocidade",
                "Treino de marcha com feedback externo (metronomo, linhas no chão)",
                "Exercícios de Frenkel para MMII",
                "Uso de pesos distais para reduzir tremor de intenção",
                "Treino de equilíbrio estático → dinâmico → com perturbação"
            ]
        },
        {
            "name": "F1.P6 — Negligência espacial / Déficit de atenção unilateral",
            "desc": "Moderado. Ignora hemicorpo, colide com objetos, não utiliza membro afetado espontaneamente",
            "block": "🧠 BLOCO F1 — NEUROLÓGICO-FUNCIONAL",
            "goals": [
                "Aumentar consciência e uso espontâneo do membro afetado",
                "Reduzir colisões e acidentes por negligência",
                "Integrar hemicampo negligenciado em atividades funcionais"
            ],
            "assess": [
                "Teste de cancelamento (stars/bells)",
                "Line bisection test",
                "Observação durante mobilização e AVDs",
                "Uso espontâneo do membro afetado durante tarefas"
            ],
            "interv": [
                "Atividades no hemicampo negligenciado com feedback visual",
                "Orientação e posicionamento de estímulos no lado afetado",
                "Terapia por restrição (CIMT) para negligência motora",
                "Prism adaptation therapy quando disponível",
                "Instruções verbais de atenção ao membro afetado durante AVDs"
            ]
        },
        {
            "name": "F1.P7 — Rebaixamento cognitivo funcional / Delirium com impacto motor",
            "desc": "Grave. Não mantém atenção na tarefa, flutuação de consciência, não segue comandos de forma consistente",
            "block": "🧠 BLOCO F1 — NEUROLÓGICO-FUNCIONAL",
            "goals": [
                "Realizar mobilizações passivas e assistidas seguras",
                "Manter amplitude articular durante período de rebaixamento",
                "Prevenir complicações do imobilismo"
            ],
            "assess": [
                "CAM-ICU (delirium)",
                "GCS e nível de alerta",
                "Resposta a comandos simples e consistência",
                "Ciclo vigília-sono"
            ],
            "interv": [
                "Mobilização passiva e ativa-assistida segura dentro do estado clínico",
                "Orientação cognitiva: luz, relógio, fala durante mobilização",
                "Estimulação sensorial multimodal leve",
                "Evitar sedação prolongada quando possível (comunicar equipe)",
                "Posicionamento adequado e prevenção de contraturas"
            ]
        },
        {
            "name": "F1.P8 — Baixa capacidade de aprendizado motor",
            "desc": "Moderado. Não retém ganho de uma sessão para outra, necessita reaprendizado constante, baixa transferência de treino para função",
            "block": "🧠 BLOCO F1 — NEUROLÓGICO-FUNCIONAL",
            "goals": [
                "Maximizar retenção intrassessão com práticas repetitivas",
                "Usar pistas externas para compensar déficit de retenção",
                "Documentar e comunicar progressos para continuidade do cuidado"
            ],
            "assess": [
                "Comparação de desempenho início vs fim de sessão",
                "Comparação entre sessões consecutivas",
                "Capacidade de generalização (transferência de treino)",
                "Avaliação de memória procedimental"
            ],
            "interv": [
                "Alta repetição de tarefas funcionais simples dentro da sessão",
                "Prática em bloco (blocked practice) para facilitar aprendizado inicial",
                "Feedback aumentado (verbal + visual) durante treino",
                "Treino em ambiente estável e consistente",
                "Comunicação com equipe para continuidade entre sessões"
            ]
        },
        {
            "name": "F1.P9 — Déficit de transições posturais (rolar, sentar, levantar)",
            "desc": "Grave. Incapacidade ou grande dificuldade de rolar no leito, passar de decúbito para sedestação, passar de sedestação para ortostatismo, necessidade de ajuda máxima ou total para qualquer mudança postural",
            "block": "🧠 BLOCO F1 — NEUROLÓGICO-FUNCIONAL",
            "goals": [
                "Rolar no leito com assistência mínima",
                "Passar de decúbito para sedestação com assistência parcial",
                "Realizar transferência leito-cadeira com assistência moderada"
            ],
            "assess": [
                "Functional Independence Measure (FIM) — transferências",
                "Análise da qualidade e segurança de cada transição",
                "Grau de assistência necessária (dependência total → mínima)",
                "Força de extensores de MMII e controle de tronco"
            ],
            "interv": [
                "Treino de rolamento: facilitação de rotação segmentar",
                "Treino de sentar na borda do leito com controle de velocidade",
                "Treino de sentar-levantar (sit-to-stand) com altura ajustada",
                "Fortalecimento de extensores de quadril e joelho para suporte",
                "Progressão gradual de grau de assistência"
            ]
        },
        {
            "name": "F2.P1 — Dessaturação ao esforço ou mudança postural",
            "desc": "Grave. SpO₂ < 90-92% ao sentar, ficar em pé ou andar, queda ≥ 4% em relação ao repouso, necessidade de aumentar O₂",
            "block": "🫁 BLOCO F2 — CARDIORRESPIRATÓRIO FUNCIONAL",
            "goals": [
                "Manter SpO₂ ≥ 92-94% durante atividade com O₂ suplementar",
                "Identificar limiar de esforço seguro para mobilização",
                "Reduzir progressivamente dependência de O₂ suplementar"
            ],
            "assess": [
                "SpO₂ em repouso, sentado, em pé e durante marcha",
                "Necessidade de O₂ suplementar e fluxo necessário",
                "Teste de caminhada de 6 minutos (adaptado quando possível)",
                "FR e padrão ventilatório durante esforço"
            ],
            "interv": [
                "Mobilização com O₂ suplementar e monitorização contínua de SpO₂",
                "Ajuste de fluxo de O₂ antes de iniciar esforço",
                "Escalonamento de esforço: repouso → sedestação → ortostatismo → marcha curta",
                "Pausas programadas com SpO₂ como guia",
                "Treino de endurance leve quando SpO₂ estável"
            ]
        },
        {
            "name": "F2.P2 — Taquicardia desproporcional ao esforço",
            "desc": "Moderado. Aumento de FC > 20-30 bpm com tarefas leves, FC permanece elevada após cessar esforço, associada a dispneia/fadiga",
            "block": "🫁 BLOCO F2 — CARDIORRESPIRATÓRIO FUNCIONAL",
            "goals": [
                "Reduzir resposta de FC desproporcional ao esforço",
                "Melhorar recuperação de FC pós-esforço",
                "Identificar e manejar causas reversíveis (anemia, febre, dor)"
            ],
            "assess": [
                "FC em repouso, ao esforço e recuperação (1-2 min pós)",
                "Relação FC vs carga de esforço (Borg)",
                "Investigação de fatores contribuintes: anemia, dor, ansiedade",
                "ECG para descartar arritmia associada"
            ],
            "interv": [
                "Mobilização de baixa intensidade com monitorização de FC",
                "Uso do Borg 11-13 como guia ao invés de FC isolada",
                "Comunicar equipe médica sobre taquicardia persistente",
                "Treino de respiração controlada para reduzir FC de repouso",
                "Progressão gradual de carga conforme tolerância"
            ]
        },
        {
            "name": "F2.P3 — Hipotensão ao ortostatismo ou durante esforço",
            "desc": "Grave. Queda PAS ≥ 20 mmHg ou PAD ≥ 10 mmHg, sintomas: tontura, escurecimento visual, sudorese",
            "block": "🫁 BLOCO F2 — CARDIORRESPIRATÓRIO FUNCIONAL",
            "goals": [
                "Tolerar ortostatismo > 5 min sem sintomas",
                "Reduzir queda pressórica com manobras posturais graduais",
                "Manter segurança durante mobilização vertical"
            ],
            "assess": [
                "PA em decúbito, sentado e em pé (3 min)",
                "Sintomas associados: tontura, síncope, sudorese",
                "Medicações vasoativas e anti-hipertensivas em uso",
                "Hidratação e volemia (avaliar com equipe médica)"
            ],
            "interv": [
                "Verticalização gradual: 30° → 45° → 60° → 80° (inclinômetro/leito regulável)",
                "Meias elásticas de compressão graduada antes de sentar/levantar",
                "Bandagem abdominal quando indicado",
                "Hidratação adequada antes do esforço (comunicar equipe)",
                "Exercícios de bombeamento de MMII antes de levantar"
            ]
        },
        {
            "name": "F2.P4 — Dispneia desproporcional ao nível de atividade",
            "desc": "Grave. Borg ≥ 5 em atividades leves (sentar, ficar em pé), uso de musculatura acessória, FR > 28-30 com baixa carga",
            "block": "🫁 BLOCO F2 — CARDIORRESPIRATÓRIO FUNCIONAL",
            "goals": [
                "Borg ≤ 4 em atividades leves após reabilitação",
                "Reduzir uso de musculatura acessória em repouso",
                "Melhorar eficiência ventilatória durante esforço"
            ],
            "assess": [
                "Escala de Borg modificada (0-10) em diferentes posições",
                "FR e padrão ventilatório em repouso e esforço",
                "Uso de musculatura acessória e postura ventilatória",
                "Gasometria arterial e SpO₂ quando disponível"
            ],
            "interv": [
                "Posicionamento ventilatório favorável (decúbito elevado, debruçado para frente)",
                "Treino de respiração diafragmática",
                "Pursed-lip breathing para dispneia aguda",
                "Exercício de baixa intensidade com monitorização contínua",
                "Progressão criteriosa com Borg como parâmetro de segurança"
            ]
        },
        {
            "name": "F2.P5 — Baixa tolerância à posição sentada/em pé",
            "desc": "Grave. Não mantém sedestação/ortostatismo > 1-5 min, necessidade de retornar ao leito por sintomas cardiorrespiratórios",
            "block": "🫁 BLOCO F2 — CARDIORRESPIRATÓRIO FUNCIONAL",
            "goals": [
                "Tolerar sedestação beira de leito > 15-30 min",
                "Tolerar ortostatismo > 5-10 min com apoio",
                "Progredir para cadeirão e posição bípede funcional"
            ],
            "assess": [
                "Tempo máximo de tolerância em cada posição",
                "Sintomas limitantes: dispneia, tontura, fadiga, dor",
                "PA, FC, SpO₂ em cada posição",
                "Causa predominante: cardiorrespiratória vs musculoesquelética vs autonômica"
            ],
            "interv": [
                "Sessões curtas e frequentes (2-3x/dia) com aumento gradual do tempo",
                "Uso de cadeirão reclinável para início da verticalização",
                "Monitorização multiparamétrica durante sessão",
                "Identificar e tratar causa predominante da intolerância",
                "Registro de tempo tolerado a cada sessão para progressão objetiva"
            ]
        },
        {
            "name": "F2.P6 — Resposta cronotrópica inadequada",
            "desc": "Moderado. FC não sobe quando deveria (betabloqueado, transplantado) ou sobe demais para pequenas cargas. Dificulta usar FC como guia",
            "block": "🫁 BLOCO F2 — CARDIORRESPIRATÓRIO FUNCIONAL",
            "goals": [
                "Usar Borg e sintomas como parâmetros de esforço ao invés de FC",
                "Identificar limiar seguro de esforço sem depender de FC",
                "Progressão segura de exercício sem referência de FC"
            ],
            "assess": [
                "Medicações em uso (betabloqueadores, cronotrópicos)",
                "Borg, PA e SpO₂ durante esforço",
                "Contexto clínico: transplante cardíaco, ICC, BAVT",
                "Sintomas: angina, dispneia, pré-síncope durante esforço"
            ],
            "interv": [
                "Usar escala de Borg 11-13 como parâmetro principal de intensidade",
                "Não usar FC como único parâmetro de segurança",
                "Monitorizar PA, SpO₂ e sintomas durante exercício",
                "Comunicar equipe sobre resposta cronotrópica para ajuste de protocolo",
                "Exercícios de resistência de baixa carga com progressão cautelosa"
            ]
        },
        {
            "name": "F2.P7 — Disautonomia pós-UTI / pós-COVID / sepse",
            "desc": "Grave. Oscilações imprevisíveis de PA e FC, alternância de hipo e hipertensão, fadiga extrema ao esforço leve",
            "block": "🫁 BLOCO F2 — CARDIORRESPIRATÓRIO FUNCIONAL",
            "goals": [
                "Identificar e documentar padrão de resposta autonômica",
                "Realizar mobilização segura com monitorização multiparamétrica",
                "Melhorar tolerância postural progressivamente"
            ],
            "assess": [
                "Variabilidade de PA e FC ao longo do dia",
                "Resposta ao ortostatismo e esforço leve",
                "Sintomas: fadiga extrema, palpitações, intolerância ao calor",
                "Teste de mesa inclinada quando disponível e indicado"
            ],
            "interv": [
                "Monitorização rigorosa: PA, FC, SpO₂ antes/durante/após",
                "Início com exercícios passivos e ativo-assistidos leves",
                "Progressão muito gradual com critérios de parada claros",
                "Comunicar oscilações à equipe médica",
                "Hidratação adequada e evitar calor excessivo durante sessão"
            ]
        },
        {
            "name": "F3.P1 — Dor limitante funcional",
            "desc": "Grave. EVA ≥ 6/10 em repouso ou ≥ 4/10 durante função, dor que impede sedestação/ortostatismo/marcha/transferências, analgesia insuficiente",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Reduzir EVA ≤ 4/10 em repouso e ≤ 3/10 durante função",
                "Identificar e comunicar necessidade de ajuste de analgesia",
                "Retomar atividades funcionais com dor controlada"
            ],
            "assess": [
                "EVA/NRS em repouso e durante atividade",
                "Localização, padrão e fatores agravantes da dor",
                "Medicação analgésica atual e eficácia",
                "Impacto da dor na participação nas sessões de fisioterapia"
            ],
            "interv": [
                "Solicitar analgesia adequada antes das sessões (comunicar médico)",
                "TENS analgésico no local de dor antes de mobilizar",
                "Posicionamento anti-álgico e órteses de conforto",
                "Crioterapia ou calor superficial conforme indicação",
                "Técnicas suaves: mobilização passiva, terapia manual leve"
            ]
        },
        {
            "name": "F3.P2 — Limitação de amplitude de movimento (ADM) com impacto funcional",
            "desc": "Moderado. ADM reduzida que impede padrões básicos: extensão de joelho, dorsiflexão, flexão de quadril, abdução/rotação",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Restaurar ADM mínima funcional para sedestação e marcha",
                "Recuperar padrões básicos: extensão de joelho, dorsiflexão ≥ 10°, flexão de quadril ≥ 90°",
                "Prevenir progressão para contratura"
            ],
            "assess": [
                "Goniometria passiva e ativa dos segmentos afetados",
                "Análise do impacto na marcha/transferências",
                "Distinção: limitação por dor vs rigidez estrutural vs fraqueza",
                "Histórico de imobilização e tempo de limitação"
            ],
            "interv": [
                "Mobilização passiva e ativa-assistida dentro da amplitude disponível",
                "Alongamento passivo sustentado (30-120s) nos grupos encurtados",
                "Calor superficial antes do alongamento para ganho de extensibilidade",
                "Treino de ADM ativa em piscina quando disponível",
                "Orteses de posicionamento noturno para manutenção do ganho"
            ]
        },
        {
            "name": "F3.P3 — Rigidez articular e capsular (pós-imobilismo / pós-op)",
            "desc": "Moderado. Rigidez matinal, dor ao final de ADM, padrões capsulares típicos (ex: ombro), redução da mobilidade articular",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Recuperar padrão capsular: RE > ABD > RI (ombro)",
                "Reduzir rigidez matinal para < 30 min",
                "Melhorar ADM funcional em 10-15° em 2-4 semanas"
            ],
            "assess": [
                "Goniometria ativa e passiva com identificação de padrão capsular",
                "End-feel articular (rígido vs espástico vs doloroso)",
                "Rigidez matinal: duração e intensidade",
                "Histórico: cirurgia, período de imobilização, diagnóstico"
            ],
            "interv": [
                "Mobilização articular passiva graus I-II para analgesia",
                "Mobilização graus III-IV para ganho de ADM",
                "Calor superficial ou ultrassom antes das mobilizações",
                "Exercícios pendulares de Codman (ombro)",
                "Progressão de carga e amplitude conforme tolerância"
            ]
        },
        {
            "name": "F3.P4 — Contraturas e encurtamentos",
            "desc": "Grave. Perda sustentada de ADM (não apenas 'dor'), posturas fixas (flexão de joelho, equino), dificuldade de posicionamento e higiene",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Ganhar ADM suficiente para posicionamento adequado e higiene",
                "Prevenir progressão para contratura estrutural irreversível",
                "Recuperar ADM funcional mínima para transferências e marcha"
            ],
            "assess": [
                "Goniometria para quantificar perda de ADM",
                "Distinção: contratura miostática vs capsular vs ossificante",
                "Tempo de instalação e progressão",
                "Impacto em higiene, posicionamento e AVDs"
            ],
            "interv": [
                "Alongamento passivo prolongado (> 20 min) com carga baixa e sustentada",
                "Órteses de posicionamento/splinting em posição de ganho",
                "Mobilização articular específica conforme tipo de contratura",
                "Calor profundo (ultrassom) antes do alongamento em contraturas antigas",
                "Séries seriadas de gesso quando há contratura estabelecida (se indicado)"
            ]
        },
        {
            "name": "F3.P5 — Instabilidade articular / proteção mecânica",
            "desc": "Moderado. Sensação de 'falseio', instabilidade pós-trauma/pós-op, necessidade de órteses/imobilizadores, medo de apoiar",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Progredir estabilização muscular ativa ao redor da articulação",
                "Retomar apoio/carga respeitando restrições médicas",
                "Reduzir medo de instabilidade com confiança progressiva"
            ],
            "assess": [
                "Testes de estabilidade articular (ligamentares, capsulares)",
                "Avaliação da órtese atual e adequação",
                "Limites médicos de carga e amplitude",
                "Controle neuromuscular e timing de ativação muscular protetora"
            ],
            "interv": [
                "Fortalecimento isométrico muscular periarticular dentro das restrições",
                "Órtese funcional para atividades quando indicado",
                "Propriocepção progressiva: tábua de equilíbrio, superfícies instáveis",
                "Treino de marcha com dispositivo de apoio conforme carga permitida",
                "Educação sobre limites de carga e posições a evitar"
            ]
        },
        {
            "name": "F3.P6 — Fraqueza periférica assimétrica (não neurológica central)",
            "desc": "Moderado. Incapacidade de vencer gravidade em segmentos específicos, queda no desempenho funcional por déficits localizados (ex: quadríceps pós-op)",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Atingir MRC ≥ 3 nos grupos afetados (vencer gravidade)",
                "Recuperar MRC ≥ 4 para função independente",
                "Restaurar simetria de força para marcha e transferências"
            ],
            "assess": [
                "MRC por grupo muscular nos segmentos afetados",
                "Comparação com lado contralateral",
                "Dinamometria manual quando disponível",
                "Impacto funcional: marcha, transferências, AVDs"
            ],
            "interv": [
                "Fortalecimento progressivo: isometria → gravidade → resistência progressiva",
                "Exercícios funcionais específicos (ex: agachamento assistido, step)",
                "Estimulação elétrica neuromuscular (EENM) para ativação",
                "Biofeedback de EMG quando disponível",
                "Treino funcional integrado com a força disponível"
            ]
        },
        {
            "name": "F3.P7 — Restrição de carga (descarga parcial/sem carga)",
            "desc": "Moderado. Prescrição médica: NWB / PWB / TTWB, pós-op ortopédico, fratura, osteossíntese, fixador externo",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Manter força e ADM dentro das restrições de carga",
                "Treinar deambulação com dispositivo de apoio dentro dos limites",
                "Prevenir atrofia e descondicionamento durante período de descarga"
            ],
            "assess": [
                "Classificação de carga prescrita pelo cirurgião",
                "Capacidade de cumprimento da restrição com dispositivo de apoio",
                "Força muscular proximal nos segmentos não restritos",
                "Risco de queda com dispositivo de assistência"
            ],
            "interv": [
                "Treino de marcha com andador/muletas respeitando restrição de carga",
                "Exercícios de MMSS e CORE sem impacto no segmento restrito",
                "Fortalecimento isométrico do membro afetado sem carga axial",
                "Educação sobre restrição de carga e uso correto de dispositivo",
                "Controle de edema: elevação, crioterapia, compressão"
            ]
        },
        {
            "name": "F3.P8 — Pós-operatório ortopédico com risco de complicações",
            "desc": "Moderado. Edema importante, dor + imobilismo, dificuldade de ativação muscular, perda acelerada de função",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Controlar edema e dor para progredir mobilização precoce",
                "Ativar musculatura periarticular no pós-op imediato",
                "Prevenir TVP, atrofia e rigidez no pós-op"
            ],
            "assess": [
                "Edema: perimetria, sinais de TVP",
                "Dor em repouso e ao movimento (EVA)",
                "Ativação muscular: capacidade de isometria",
                "Protocolo cirúrgico e restrições específicas do cirurgião"
            ],
            "interv": [
                "Exercícios de bombeamento de MMII para prevenção de TVP",
                "Isometria de quadríceps e glúteos no pós-op imediato",
                "Mobilização passiva e ativa-assistida dentro dos limites",
                "Crioterapia e elevação do membro para controle de edema",
                "Progressão conforme protocolo pós-op específico"
            ]
        },
        {
            "name": "F3.P9 — Fraqueza muscular GLOBAL / GENERALIZADA (ICU-AW, imobilismo prolongado)",
            "desc": "Grave. Fraqueza difusa bilateral simétrica, MRC-sum < 48, incapacidade de vencer gravidade em múltiplos grupos musculares, fadiga generalizada precoce, perda de massa muscular global",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Atingir MRC-sum ≥ 48 (diagnóstico de ICU-AW resolvido)",
                "Sentar-levantar independente com apoio",
                "Caminhar com dispositivo de assistência sem parada por fraqueza"
            ],
            "assess": [
                "MRC-sum (6 grupos bilaterais: 0-60)",
                "Tempo de sustentação contra gravidade por segmento",
                "Perimetria de coxa e panturrilha",
                "Fadiga: tempo máximo de atividade antes de parar por exaustão"
            ],
            "interv": [
                "Mobilização precoce e progressiva desde UTI",
                "Fortalecimento ativo contra gravidade → com resistência",
                "EENM de quadríceps e tibial anterior em ventilados/sedados",
                "Cicloergômetro passivo-ativo em leito",
                "Nutrição adequada: proteína ≥ 1.2g/kg/dia (comunicar equipe)"
            ]
        },
        {
            "name": "F3.P10 — Fraqueza de MMII com impacto em transferências e marcha",
            "desc": "Grave. Incapacidade de sentar-levantar sem assistência, marcha impossível ou claudicante, quadríceps/glúteos/dorsiflexores < MRC 3, instabilidade em apoio unipodal",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Quadríceps e glúteos ≥ MRC 3 (vencer gravidade)",
                "Realizar sit-to-stand com assistência mínima",
                "Deambular 10m com dispositivo de apoio"
            ],
            "assess": [
                "MRC: quadríceps, isquiossurais, glúteo médio, tibial anterior, tríceps sural",
                "Sit-to-stand: número de repetições e grau de assistência",
                "Velocidade de marcha de 4m (4-Meter Gait Speed)",
                "Teste de equilíbrio em apoio unipodal"
            ],
            "interv": [
                "Fortalecimento de quadríceps: isometria → extensão com gravidade → mini-squat",
                "Glúteo médio: abdução em decúbito lateral → em pé",
                "Treino de sit-to-stand progressivo: altura alta → normal → baixa",
                "Marcha com andador → muletas → bengala",
                "Escadas quando tolerar marcha plana > 15m com segurança"
            ]
        },
        {
            "name": "F3.P11 — Fraqueza de MMSS com impacto em AVDs",
            "desc": "Moderado. Incapacidade de pentear cabelo, levar comida à boca, segurar objetos, vestir-se, deltoides/tríceps/bíceps/preensão < MRC 3",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Deltoides e bíceps ≥ MRC 3 para atividades acima da cabeça",
                "Preensão funcional suficiente para segurar utensílios",
                "Realizar AVDs básicas com assistência mínima"
            ],
            "assess": [
                "MRC: deltoides, bíceps, tríceps, preensão manual",
                "Dinamometria de preensão",
                "Observação de AVDs: alimentação, higiene, vestir",
                "MMSS Questionnaire ou similar"
            ],
            "interv": [
                "Fortalecimento de deltoides: elevação lateral assistida → ativa → resistida",
                "Exercícios funcionais: levar copo à boca, pentear simulado",
                "EENM de extensores de punho se < MRC 2",
                "Treino de preensão: squeeze ball, pinça com objetos cotidianos",
                "Adaptações e dispositivos de auxílio para AVDs durante fase de recuperação"
            ]
        },
        {
            "name": "F3.P12 — Fraqueza de CORE / TRONCO (muscular, não neurológica)",
            "desc": "Moderado. Incapacidade de manter sedestação sem apoio de MMSS por fraqueza muscular pura, fadiga rápida de extensores/flexores de tronco, incapacidade de rolar sozinho",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Manter sedestação sem apoio de MMSS > 2 min",
                "Rolar no leito de forma independente",
                "Resistir a perturbações externas em sedestação"
            ],
            "assess": [
                "Tempo de sedestação sem apoio de MMSS",
                "Capacidade de rolar e transferências",
                "Força de extensores de tronco: Biering-Sorensen modificado",
                "Qualidade de ativação de transverso abdominal (palpação)"
            ],
            "interv": [
                "Sedestação ativa na beira do leito com progressão de tempo",
                "Exercícios de rotação de tronco em sedestação",
                "Ativação de multífidos e transverso em decúbito",
                "Dead bug progressivo na fase mais avançada",
                "Treino funcional de rolar e transferências com foco no core"
            ]
        },
        {
            "name": "F3.P13 — Atrofia muscular / Sarcopenia / Perda de massa muscular",
            "desc": "Moderado. Perimetria reduzida > 2cm comparado ao contralateral ou baseline, perda visível de volume muscular, força desproporcional ao tônus, catabolismo prolongado, albumina baixa",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Estabilizar perda muscular e iniciar recuperação",
                "Aumentar perimetria de coxa ≥ 1cm em 2 semanas",
                "Melhorar força muscular proporcionalmente à massa"
            ],
            "assess": [
                "Perimetria de coxa (15cm acima da patela), panturrilha (ponto máximo)",
                "Ultrassom muscular quando disponível (espessura do reto femoral)",
                "Albumina e pré-albumina sérica",
                "MRC e dinamometria para força funcional"
            ],
            "interv": [
                "Exercício resistido progressivo de alta repetição com baixa carga",
                "EENM para estimulação anabólica em imobilizados",
                "Nutrição hiperenergética e hiperproteica (comunicar nutricionista)",
                "Correção de fatores catabólicos: controle glicêmico, antibioticoterapia",
                "Progressão para exercícios funcionais quando albumina > 2.5g/dL"
            ]
        },
        {
            "name": "F3.P14 — Limitação de ADM de OMBRO (padrão capsular / pós-op / frozen shoulder)",
            "desc": "Moderado. Rotação externa < 30°, abdução < 90°, rotação interna < L5, padrão capsular típico (RE > ABD > RI), impacto em vestir/pentear/alcançar",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "RE ≥ 45°, abdução ≥ 120°, RI ≥ L3",
                "Realizar atividades acima da cabeça sem dor limitante",
                "Independência em vestir e higiene pessoal"
            ],
            "assess": [
                "Goniometria ativa e passiva: flexão, abdução, RE, RI",
                "Identificação de padrão capsular",
                "Dor ao final de ADM (EVA)",
                "Força do manguito rotador e deltoides"
            ],
            "interv": [
                "Mobilização articular glenoumeral graus III-IV em deslizamento inferior/posterior",
                "Exercícios pendulares de Codman para descompressão",
                "Alongamento de cápsula posterior (sleeper stretch)",
                "Fortalecimento de manguito rotador em amplitude disponível",
                "Calor superficial ou ultrassom antes da mobilização"
            ]
        },
        {
            "name": "F3.P15 — Limitação de ADM de JOELHO (extensão / flexão)",
            "desc": "Moderado. Déficit de extensão > 5-10° (falta extensão completa), flexão < 90°, impacto em marcha/escadas/sentar, padrão pós-op ou pós-imobilização",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Extensão completa (0°) ou < 5° de déficit",
                "Flexão ≥ 90-120° para função em escadas e sentar",
                "Marcha sem claudicação por déficit de joelho"
            ],
            "assess": [
                "Goniometria ativa e passiva: extensão e flexão",
                "Lag extensor: diferença entre extensão passiva e ativa",
                "Edema articular e temperatura local",
                "Diagnóstico: pós-op de ligamento/menisco/prótese total de joelho"
            ],
            "interv": [
                "Mobilização passiva contínua (CPM) se disponível e indicado",
                "Ganho de extensão: mobilização passiva em decúbito ventral com carga distal",
                "Ganho de flexão: heel slides, ativo-assistido em sedestação",
                "Bicicleta estática para mobilidade simultânea em ADM controlada",
                "Ativação de quadríceps para corrigir lag extensor"
            ]
        },
        {
            "name": "F3.P16 — Limitação de ADM de TORNOZELO / Pé em EQUINO (dorsiflexão)",
            "desc": "Grave. Dorsiflexão < 0-5° (pé cai em plantiflexão/equino), impacto em apoio plantar/marcha/ortostatismo, padrão pós-neurológico ou pós-imobilização",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Dorsiflexão ≥ 10° para fase de apoio terminal na marcha",
                "Apoio plantar completo em ortostatismo",
                "Prevenir úlcera de calcanhar e deformidade progressiva"
            ],
            "assess": [
                "Goniometria de dorsiflexão passiva e ativa (joelho estendido e fletido)",
                "Equino estrutural vs dinâmico (espasticidade)",
                "Sinal de Silfverskiöld (diferença entre joelho fletido e estendido)",
                "Úlceras de pressão em calcâneo"
            ],
            "interv": [
                "Alongamento passivo sustentado de gastrocnêmio e sóleo",
                "Órtese antiequino / AFO (ankle-foot orthosis) para uso noturno e marcha",
                "Manipulação/mobilização de talocrural e subtalar",
                "FES de tibial anterior para ativação ativa de dorsiflexão",
                "Série seriada de gessado para equino grave quando indicado"
            ]
        },
        {
            "name": "F3.P17 — Limitação de ADM de QUADRIL (flexão / rotação / extensão)",
            "desc": "Moderado. Flexão < 90°, rotação interna/externa limitada, déficit de extensão (flexum de quadril), padrão pós-prótese ou pós-imobilização",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Flexão ≥ 90-100° para sentar adequadamente",
                "Extensão completa para fase de impulso na marcha",
                "Respeitar precauções pós-artroplastia quando aplicável"
            ],
            "assess": [
                "Goniometria: flexão, extensão, abdução, rotação interna e externa",
                "Teste de Thomas (flexum de quadril)",
                "Precauções pós-cirúrgicas em vigor",
                "Força de glúteo médio e iliopsoas associada"
            ],
            "interv": [
                "Mobilização passiva e ativo-assistida dentro dos limites permitidos",
                "Treino de força de glúteo médio e iliopsoas",
                "Alongamento de flexores de quadril em decúbito ventral ou ponte",
                "Treino funcional de sentar-levantar com altura ajustada",
                "Educação sobre precauções pós-prótese: evitar flexão > 90° + adução + RI"
            ]
        },
        {
            "name": "F3.P18 — Déficit de ADM ATIVA (força insuficiente para amplitude passiva disponível)",
            "desc": "Moderado. ADM passiva completa ou quase completa, mas ADM ativa significativamente reduzida por fraqueza, lag extensor (joelho/ombro), incapacidade de sustentar amplitude final",
            "block": "🦴 BLOCO F3 — MUSCULOESQUELÉTICO/ORTOPÉDICO FUNCIONAL",
            "goals": [
                "Eliminar lag extensor (diferença passiva-ativa < 5°)",
                "Sustentar ADM ativa em amplitude final por > 10s",
                "Integrar amplitude ativa completa no movimento funcional"
            ],
            "assess": [
                "Goniometria ativa vs passiva em segmento afetado",
                "Lag extensor quantificado em graus",
                "Força excêntrica nos últimos graus de amplitude",
                "Teste de sustentação em amplitude final"
            ],
            "interv": [
                "Fortalecimento excêntrico em amplitude final",
                "Treino de controle ativo em posição de ganho passivo",
                "EENM para ativação em amplitude final",
                "Biofeedback visual para conscientização da amplitude disponível",
                "Progressão de isometria em amplitude final → controle dinâmico"
            ]
        },
        {
            "name": "F4.P1 — Instabilidade em sedestação",
            "desc": "Grave. Não mantém sedestação sem apoio > 30-60s, quedas laterais/posteriores, necessidade de apoio constante de MMSS ou terapeuta",
            "block": "🧍 BLOCO F4 — EQUILÍBRIO & CONTROLE POSTURAL",
            "goals": [
                "Sedestação estática sem apoio > 2 min",
                "Sedestação dinâmica com alcance lateral sem perda de equilíbrio",
                "Sedestação com perturbação externa leve"
            ],
            "assess": [
                "Tempo de sedestação sem apoio",
                "Seated Reach Test",
                "Testes de Bobath de equilíbrio sentado",
                "Qualidade das reações de equilíbrio (endireitamento, protetoras)"
            ],
            "interv": [
                "Treino de sedestação progressivo: apoio total → parcial → sem apoio",
                "Alcance unilateral e bilateral em sedestação",
                "Perturbações externas graduais (push e release)",
                "Treino com superfície instável (almofada de equilíbrio) na fase avançada",
                "Facilitação de reações de equilíbrio na beira do leito"
            ]
        },
        {
            "name": "F4.P2 — Instabilidade em ortostatismo",
            "desc": "Grave. Não mantém posição em pé sem apoio, oscilações amplas de tronco, necessidade de apoio manual/andador constante",
            "block": "🧍 BLOCO F4 — EQUILÍBRIO & CONTROLE POSTURAL",
            "goals": [
                "Ortostatismo estático sem apoio > 30s",
                "Ortostatismo dinâmico: peso-a-peso seguro",
                "Deambulação com andador sem perda de equilíbrio"
            ],
            "assess": [
                "Romberg simples e sensibilizado",
                "Tempo de apoio unipodal",
                "Timed Up and Go (TUG)",
                "Berg Balance Scale"
            ],
            "interv": [
                "Verticalização gradual com suporte progressivo",
                "Exercícios de descarga de peso em pé",
                "Treino de peso-a-peso na paralela ou com apoio",
                "Fortalecimento de tornozelo e quadril para estratégias de equilíbrio",
                "Perturbações controladas em pé com apoio posterior"
            ]
        },
        {
            "name": "F4.P3 — Quedas frequentes ou quase-quedas",
            "desc": "Crítico. Histórico recente de quedas, episódios de perda de equilíbrio durante mobilização, medo intenso de cair associado",
            "block": "🧍 BLOCO F4 — EQUILÍBRIO & CONTROLE POSTURAL",
            "goals": [
                "Zero quedas durante sessões de reabilitação",
                "Identificar e modificar fatores de risco de queda",
                "Treinar estratégias de proteção na queda"
            ],
            "assess": [
                "Falls Efficacy Scale (FES-I) / ABC Scale",
                "Análise de fatores de risco: medicações, visão, calçado, ambiente",
                "TUG e Step Test",
                "Avaliação de reações protetoras de queda"
            ],
            "interv": [
                "Modificação ambiental imediata (grades, tapetes, iluminação)",
                "Revisão de medicações com médico (polifarmácia, hipotensores)",
                "Treino de reações protetoras e landing seguro",
                "Fortalecimento de quadríceps e tornozelo (principais estabilizadores)",
                "Progressão ultra-cautelosa com supervisão constante"
            ]
        },
        {
            "name": "F4.P4 — Medo de cair (fear of falling) com impacto funcional",
            "desc": "Moderado. Evita ficar em pé/andar apesar de capacidade física, rigidez excessiva, padrão de proteção, recusa ou grande ansiedade",
            "block": "🧍 BLOCO F4 — EQUILÍBRIO & CONTROLE POSTURAL",
            "goals": [
                "Falls Efficacy Scale ≥ 70% de confiança",
                "Retomar marcha funcional sem rigidez protetora excessiva",
                "Reduzir restrição de atividades por medo"
            ],
            "assess": [
                "Falls Efficacy Scale (FES-I)",
                "ABC Scale (Activities-specific Balance Confidence)",
                "Observação de comportamentos de evitação",
                "Capacidade física real vs percebida"
            ],
            "interv": [
                "Educação sobre equilíbrio e risco real vs percebido",
                "Exposição gradual e controlada a situações temidas",
                "Exercício de confiança: apoio progressivamente menor",
                "Psicoeducação e suporte psicológico quando indicado",
                "Treino de marcha em ambiente seguro com feedback positivo"
            ]
        },
        {
            "name": "F4.P5 — Alteração vestibular",
            "desc": "Moderado. Vertigem, náusea, nistagmo, piora do equilíbrio com movimentos de cabeça, marcha cautelosa com base alargada",
            "block": "🧍 BLOCO F4 — EQUILÍBRIO & CONTROLE POSTURAL",
            "goals": [
                "Reduzir vertigem com exercícios de habituação",
                "Reabilitar nistagmo posicional benigno (VPPB)",
                "Melhorar estabilidade do olhar (VOR) e equilíbrio com movimento de cabeça"
            ],
            "assess": [
                "Dix-Hallpike e Roll Test para VPPB",
                "Head Impulse Test (HIT) para hipofunção vestibular",
                "Dynamic Visual Acuity",
                "Marcha com movimentos de cabeça (Head Shake)"
            ],
            "interv": [
                "Manobra de Epley para VPPB de canal posterior",
                "Manobra de Barbecue para canal horizontal",
                "Exercícios de habituação vestibular (Cawthorne-Cooksey adaptado)",
                "Treino de estabilização do olhar (VOR x1, VOR x2)",
                "Progressão de equilíbrio com input vestibular desafiado"
            ]
        },
        {
            "name": "F4.P6 — Perda de estratégias posturais (tornozelo, quadril, passo)",
            "desc": "Grave. Não reage adequadamente a pequenas perturbações, 'congela' ou cai ao invés de corrigir",
            "block": "🧍 BLOCO F4 — EQUILÍBRIO & CONTROLE POSTURAL",
            "goals": [
                "Recuperar estratégia de tornozelo para perturbações leves",
                "Recuperar estratégia de quadril para perturbações moderadas",
                "Usar estratégia de passo automaticamente antes de cair"
            ],
            "assess": [
                "Pull Test (escala de Hoehn e Yahr)",
                "Reactive Postural Control: perturbações de plataforma",
                "Observação de estratégia usada durante desequilíbrio",
                "Mini-BESTest"
            ],
            "interv": [
                "Perturbações graduais em pé: anterior, posterior, lateral",
                "Treino de passo reativo: resposta a desequilíbrio induzido",
                "Fortalecimento de tibiais e peroneais (estratégia de tornozelo)",
                "Fortalecimento de quadril e tronco (estratégia de quadril)",
                "Marcha em superfícies instáveis com supervisão próxima"
            ]
        },
        {
            "name": "F5.P1 — Incapacidade de compreender comandos",
            "desc": "Grave. Não executa comandos simples de 1 etapa de forma consistente, necessita demonstração constante, confusão entre tarefa solicitada e executada",
            "block": "🧠 BLOCO F5 — COGNITIVO-FUNCIONAL",
            "goals": [
                "Executar comandos de 1 etapa de forma consistente",
                "Imitar demonstrações simples de exercício",
                "Realizar tarefas funcionais com pista gestual mínima"
            ],
            "assess": [
                "Seguimento de comandos (RASS, GCS)",
                "Resposta a comandos simples vs complexos",
                "Avaliação de audição e idioma",
                "Fonoaudiologia quando disponível para avaliação de linguagem"
            ],
            "interv": [
                "Usar comandos simples, curtos e diretos",
                "Demonstração gestual antes de cada exercício",
                "Eliminação de ruído e distrações durante sessão",
                "Exercícios passivos quando não há resposta a comandos",
                "Repetição consistente da mesma sequência a cada sessão"
            ]
        },
        {
            "name": "F5.P2 — Déficit de atenção sustentada",
            "desc": "Moderado. Perde foco antes de 1-2 minutos de tarefa, interrompe treino por distração, precisa ser constantemente redirecionado",
            "block": "🧠 BLOCO F5 — COGNITIVO-FUNCIONAL",
            "goals": [
                "Manter atenção na tarefa por > 5 min",
                "Completar série de exercícios sem redirecionamento",
                "Reduzir impacto da distração no desempenho motor"
            ],
            "assess": [
                "Tempo de atenção sustentada na tarefa (cronometrar)",
                "Frequência de redirecionamento necessário",
                "Trail Making Test A (versão simplificada quando disponível)",
                "Observação de fadiga cognitiva vs atenção"
            ],
            "interv": [
                "Sessões curtas (10-15 min) com pausas frequentes",
                "Ambiente com mínimas distrações",
                "Feedback imediato e positivo para manter engajamento",
                "Tarefas com progressão de complexidade de atenção",
                "Incorporar elementos motivacionais relevantes ao paciente"
            ]
        },
        {
            "name": "F5.P3 — Déficit de memória operacional e retenção de treino",
            "desc": "Grave. Não lembra o que foi treinado na mesma sessão, não transfere ganho de uma sessão para outra, 'recomeça do zero' todo dia",
            "block": "🧠 BLOCO F5 — COGNITIVO-FUNCIONAL",
            "goals": [
                "Reter ganho intrassessão (início vs fim da sessão melhora)",
                "Comparar desempenho entre sessões com progressão",
                "Usar pistas externas para compensar déficit de memória"
            ],
            "assess": [
                "Comparação início vs fim de sessão",
                "Comparação entre dias consecutivos",
                "Rey Auditory Verbal Learning Test adaptado",
                "Memória procedimental vs declarativa (dissociação)"
            ],
            "interv": [
                "Alta repetição dentro da sessão para memória procedimental",
                "Usar o mesmo ambiente e sequência a cada sessão",
                "Caderno/diário de progresso como pista externa",
                "Comunicação com familiares para reforço domiciliar",
                "Estratégias compensatórias: listas, alarmes, rotinas"
            ]
        },
        {
            "name": "F5.P4 — Fadiga cognitiva",
            "desc": "Moderado. Queda abrupta de desempenho após poucos minutos, piora de atenção/coordenação/execução, irritabilidade ou apatia após tarefas",
            "block": "🧠 BLOCO F5 — COGNITIVO-FUNCIONAL",
            "goals": [
                "Identificar limiar de fadiga cognitiva individual",
                "Estruturar sessões dentro do limiar de fadiga",
                "Aumentar progressivamente tolerância à demanda cognitiva"
            ],
            "assess": [
                "Monitorização de desempenho ao longo da sessão",
                "Autorrelato de cansaço mental (escala 0-10)",
                "Briefing Assessment for Neuropsychological Impairment (BANI) quando disponível",
                "Correlação entre fadiga cognitiva e física"
            ],
            "interv": [
                "Tarefas cognitivamente simples no início e fim da sessão",
                "Pausas programadas a cada 5-10 min",
                "Evitar estimulação cognitiva intensa no início da internação",
                "Educação da equipe sobre fadiga cognitiva pós-UTI",
                "Progressão gradual da demanda cognitiva nas tarefas funcionais"
            ]
        },
        {
            "name": "F5.P5 — Desorientação temporoespacial",
            "desc": "Moderado. Não sabe onde está, que dia é, por que está internado, aumenta risco de agitação, medo e baixa adesão",
            "block": "🧠 BLOCO F5 — COGNITIVO-FUNCIONAL",
            "goals": [
                "Orientação consistente ao local, dia e situação",
                "Reduzir agitação associada à desorientação",
                "Melhorar adesão às sessões com orientação adequada"
            ],
            "assess": [
                "Mini-Mental State Examination (MMSE)",
                "Orientação: pessoa, lugar, tempo",
                "Observação de comportamentos de agitação e medo",
                "CAM-ICU para delirium"
            ],
            "interv": [
                "Orientação realística no início de cada sessão",
                "Relógio, calendário e objetos pessoais visíveis no quarto",
                "Protocolo ABCDEF da UTI (sleep, delirium, mobilization)",
                "Presença de familiares durante sessões de fisioterapia",
                "Comunicação clara e tranquilizadora sobre cada procedimento"
            ]
        },
        {
            "name": "F5.P6 — Déficit executivo (planejamento, organização, julgamento)",
            "desc": "Grave. Não consegue organizar a sequência de uma tarefa funcional, toma decisões inseguras (levanta sem apoio), necessita supervisão constante",
            "block": "🧠 BLOCO F5 — COGNITIVO-FUNCIONAL",
            "goals": [
                "Executar rotinas de 2-3 passos com supervisão mínima",
                "Não realizar manobras inseguras sem supervisão",
                "Usar lista/roteiro como compensação executiva"
            ],
            "assess": [
                "Torre de Hanói ou similar (planejamento)",
                "Observação de segurança durante AVDs",
                "Frontal Assessment Battery (FAB) simplificado",
                "Histórico de comportamentos impulsivos/inseguros"
            ],
            "interv": [
                "Supervisão constante durante mobilização e AVDs",
                "Educação do paciente e família sobre riscos executivos",
                "Criar rotinas estruturadas e previsíveis",
                "Checklists visuais para tarefas sequenciais",
                "Sinalização de segurança: grades, alarmes de cama"
            ]
        },
        {
            "name": "F6.P1 — Hipotensão ortostática",
            "desc": "Grave. Queda PAS ≥ 20 mmHg ou PAD ≥ 10 mmHg em até 3 min ao levantar, sintomas: tontura, escurecimento visual, sudorese, náusea",
            "block": "🫀 BLOCO F6 — AUTONÔMICO/TOLERÂNCIA POSTURAL",
            "goals": [
                "Tolerar ortostatismo > 5 min sem queda pressórica sintomática",
                "Realizar mudanças posturais com PAS estável",
                "Progredir para deambulação sem hipotensão limitante"
            ],
            "assess": [
                "Medição de PA em decúbito, sentado e em pé (1 e 3 min)",
                "Sintomas associados: tontura, escurecimento, síncope",
                "Medicações hipotensoras em uso",
                "Tilt test passivo quando disponível"
            ],
            "interv": [
                "Verticalização gradual: cabeceira 30° → 45° → 60° → 90°",
                "Meias elásticas de compressão antes de sentar/levantar",
                "Bandagem abdominal em casos graves",
                "Exercícios de bombeamento de panturrilha antes de levantar",
                "Comunicar equipe para ajuste de anti-hipertensivos se necessário"
            ]
        },
        {
            "name": "F6.P2 — Taquicardia postural / POTS-like",
            "desc": "Moderado. Aumento FC ≥ 30 bpm (ou FC > 120) ao ficar em pé, associado a mal-estar, fadiga, dispneia",
            "block": "🫀 BLOCO F6 — AUTONÔMICO/TOLERÂNCIA POSTURAL",
            "goals": [
                "Reduzir aumento de FC ao ortostatismo para < 20 bpm",
                "Tolerar 10 min em pé sem sintomas significativos",
                "Progredir para deambulação tolerada"
            ],
            "assess": [
                "FC em decúbito e em pé (1, 3, 10 min)",
                "Sintomas associados: fadiga, palpitações, dispneia, cefaleia",
                "Medicações em uso (betabloqueadores, fludrocortisona)",
                "Hidratação e volemia"
            ],
            "interv": [
                "Verticalização progressiva com monitorização de FC",
                "Hidratação oral adequada antes das sessões",
                "Meias compressivas e bandagem abdominal",
                "Exercício em decúbito e sentado antes da verticalização",
                "Comunicar equipe sobre padrão de POTS para conduta médica"
            ]
        },
        {
            "name": "F6.P3 — Síncope ou pré-síncope postural",
            "desc": "Crítico. Episódios prévios de quase-desmaio ou desmaio ao sentar/ficar em pé, necessidade de retornar rapidamente ao leito",
            "block": "🫀 BLOCO F6 — AUTONÔMICO/TOLERÂNCIA POSTURAL",
            "goals": [
                "Zero episódios de síncope durante sessões",
                "Identificar e eliminar gatilhos modificáveis",
                "Progressão ultra-cautelosa com monitorização rigorosa"
            ],
            "assess": [
                "Histórico detalhado: circunstâncias, frequência, recuperação",
                "PA e FC em decúbito e mudança postural lenta",
                "ECG e avaliação cardiológica prévia",
                "Medicações vasoativas e anti-hipertensivas"
            ],
            "interv": [
                "Apenas mobilização passiva e sedestação na beira do leito enquanto há risco",
                "Monitorização contínua de PA durante qualquer posição vertical",
                "Critérios de parada imediata: tontura, palidez, sudorese",
                "Posição de segurança: Trendelenburg imediato se pré-síncope",
                "Comunicar qualquer episódio imediatamente à equipe médica"
            ]
        },
        {
            "name": "F6.P4 — Intolerância grave à verticalização",
            "desc": "Crítico. Não tolera > 30-60s em pé mesmo com apoio, queda importante de PA ou piora de sintomas rapidamente",
            "block": "🫀 BLOCO F6 — AUTONÔMICO/TOLERÂNCIA POSTURAL",
            "goals": [
                "Tolerar sedestação com pernas dependentes > 5 min",
                "Tolerar verticalização parcial (60°) > 10 min sem sintomas",
                "Progredir para ortostatismo com apoio"
            ],
            "assess": [
                "Tempo máximo tolerado em cada posição",
                "PA, FC, SpO₂ a cada 1 min durante verticalização",
                "Sintomas limitantes e momento de aparecimento",
                "Causa predominante: autonômica, cardiorrespiratória ou fraqueza"
            ],
            "interv": [
                "Início com cabeceira 30-45° por 5-10 min, 2x/dia",
                "Progressão de 10-15° a cada 2-3 dias se tolerado",
                "Tilt table quando disponível para verticalização controlada",
                "Meias compressivas + bandagem abdominal de rotina",
                "Exercícios de MMII em posição inclinada para pré-condicionamento"
            ]
        },
        {
            "name": "F6.P5 — Disautonomia pós-UTI / sepse / COVID / TCE",
            "desc": "Grave. Resposta imprevisível de PA e FC, alternância de hipo e hipertensão, fadiga extrema e instabilidade ao esforço mínimo",
            "block": "🫀 BLOCO F6 — AUTONÔMICO/TOLERÂNCIA POSTURAL",
            "goals": [
                "Documentar padrão autonômico para guiar progressão",
                "Realizar mobilização segura com critérios de parada claros",
                "Melhora progressiva da tolerância ao esforço em 2-4 semanas"
            ],
            "assess": [
                "Registro de PA e FC em diferentes momentos do dia",
                "Variabilidade de FC (quando disponível)",
                "Resposta ao esforço e ao ortostatismo",
                "Correlação com fase de recuperação clínica"
            ],
            "interv": [
                "Monitorização rigorosa pré/durante/pós cada sessão",
                "Progressão muito gradual: 5-10% de aumento por sessão",
                "Exercícios em decúbito → semi-inclinado → sentado → em pé",
                "Comunicação diária com equipe médica sobre resposta autonômica",
                "Consistência de horário e ambiente para reduzir variabilidade"
            ]
        },
        {
            "name": "F7.P1 — Excesso de dispositivos limitando mobilização",
            "desc": "Moderado. Múltiplos acessos, drenos, VM, cateteres, monitores, dispositivos mal organizados ou sem plano de mobilização, medo da equipe de tracionar linhas",
            "block": "🛏️ BLOCO F7 — DISPOSITIVOS & BARREIRAS EXTERNAS",
            "goals": [
                "Realizar mobilização segura com todos os dispositivos presentes",
                "Treinar equipe no manejo de dispositivos durante fisioterapia",
                "Reduzir número de dispositivos quando clinicamente possível"
            ],
            "assess": [
                "Inventário de todos os dispositivos presentes",
                "Avaliação de segurança de cada dispositivo durante mobilização",
                "Histórico de intercorrências com dispositivos durante mobilização",
                "Comunicação com equipe de enfermagem e médica"
            ],
            "interv": [
                "Planejamento da mobilização com mapa de dispositivos",
                "Solicitar extensão de circuitos e linhas antes de mobilizar",
                "Treino da equipe de enfermagem para mobilização segura com dispositivos",
                "Priorizar remoção precoce de dispositivos desnecessários",
                "Checklist pré-mobilização: linhas, drenos, VM, cateteres"
            ]
        },
        {
            "name": "F7.P2 — Ambiente hostil à mobilidade",
            "desc": "Moderado. Falta de: poltrona, andador, barras, espaço físico, leito sempre 'preso' ao mesmo lugar",
            "block": "🛏️ BLOCO F7 — DISPOSITIVOS & BARREIRAS EXTERNAS",
            "goals": [
                "Adaptar ambiente disponível para mobilização segura",
                "Solicitar equipamentos necessários para progressão",
                "Realizar mobilização dentro das limitações do ambiente"
            ],
            "assess": [
                "Avaliação do espaço físico disponível",
                "Equipamentos disponíveis: poltrona, andador, andador de rodas, cama regulável",
                "Barreiras arquitetônicas: distância ao banheiro, largura de corredores",
                "Suporte da gestão para melhorias estruturais"
            ],
            "interv": [
                "Solicitar à gestão equipamentos essenciais (poltrona regulável, andador)",
                "Adaptar exercícios ao espaço disponível",
                "Mobilizar o leito quando necessário para criar espaço",
                "Usar o corredor do andar para marcha quando possível",
                "Documentar e reportar barreiras para melhoria do serviço"
            ]
        },
        {
            "name": "F7.P3 — Cultura de imobilismo / medo da equipe",
            "desc": "Moderado. 'Melhor não mexer', 'Ele é grave demais', mobilização só quando 'melhorar'",
            "block": "🛏️ BLOCO F7 — DISPOSITIVOS & BARREIRAS EXTERNAS",
            "goals": [
                "Alinhar critérios de segurança para mobilização com toda a equipe",
                "Realizar pelo menos 1 sessão de mobilização/dia",
                "Educar equipe sobre benefícios e riscos da imobilização"
            ],
            "assess": [
                "Frequência atual de mobilização por parte da equipe de enfermagem",
                "Barreiras percebidas pela equipe para mobilizar",
                "Eventos adversos prévios que geraram medo de mobilização",
                "Protocolos institucionais existentes"
            ],
            "interv": [
                "Educação da equipe: apresentações, rounds, materiais impressos",
                "Desenvolvimento de protocolo de mobilização precoce com critérios claros",
                "Inclusão da fisioterapia nas visitas médicas diárias",
                "Relatório de mobilização nos registros de evolução",
                "Comemorar progressos do paciente com a equipe"
            ]
        },
        {
            "name": "F7.P4 — Restrições médicas excessivas ou pouco claras",
            "desc": "Moderado. 'Repouso absoluto' sem justificativa fisiológica clara, falta de definição de: carga permitida, limites posturais, o que pode e não pode",
            "block": "🛏️ BLOCO F7 — DISPOSITIVOS & BARREIRAS EXTERNAS",
            "goals": [
                "Obter prescrição clara de restrições com justificativa",
                "Negociar janelas de mobilização dentro das restrições",
                "Documentar restrições e revisá-las diariamente"
            ],
            "assess": [
                "Prescrição médica atual de restrições",
                "Justificativa clínica para cada restrição",
                "Revisão da evidência para cada restrição prescrita",
                "Comunicação médico-fisioterapeuta"
            ],
            "interv": [
                "Discussão diária com médico responsável sobre restrições",
                "Propor revisão de restrições quando sem justificativa clara",
                "Documentar discussões e decisões no prontuário",
                "Definir limites precisos: qual posição, carga, atividade é permitida",
                "Advocacy pelo paciente: mobilização precoce como standard of care"
            ]
        },
        {
            "name": "F7.P5 — Falta de pessoal/equipamento para mobilização segura",
            "desc": "Grave. Paciente precisa de 2-3 pessoas ou guindaste e isso nunca está disponível, mobilização é adiada indefinidamente",
            "block": "🛏️ BLOCO F7 — DISPOSITIVOS & BARREIRAS EXTERNAS",
            "goals": [
                "Garantir pelo menos 2x/semana mobilização com equipe adequada",
                "Identificar e programar recursos com antecedência",
                "Reduzir dependência de mobilização de múltiplas pessoas"
            ],
            "assess": [
                "Número de profissionais necessários para mobilização segura",
                "Disponibilidade de equipamentos (guindaste, cadeira de rodas, tábua de transferência)",
                "Agendamento das mobilizações complexas",
                "Progressão da dependência ao longo do tempo"
            ],
            "interv": [
                "Agendar mobilizações complexas com equipe interprofissional",
                "Solicitar equipamentos de auxílio à transferência (transfer belt, tábua deslizante)",
                "Técnicas de mobilização eficientes para 2 pessoas",
                "Documentar necessidade de pessoal para escala adequada",
                "Progressão de independência para reduzir dependência de equipe"
            ]
        },
        {
            "name": "F7.P6 — Conflito de prioridades assistenciais",
            "desc": "Moderado. Sempre 'não dá tempo', exames, procedimentos e rotinas atropelam a reabilitação",
            "block": "🛏️ BLOCO F7 — DISPOSITIVOS & BARREIRAS EXTERNAS",
            "goals": [
                "Garantir janela diária para fisioterapia no plano assistencial",
                "Integrar fisioterapia no round diário de prioridades",
                "Reduzir cancelamentos por conflitos de agenda"
            ],
            "assess": [
                "Frequência de cancelamentos e motivos",
                "Posição da fisioterapia na grade de prioridades da equipe",
                "Comunicação com enfermagem sobre horários de procedimentos",
                "Impacto dos cancelamentos na evolução do paciente"
            ],
            "interv": [
                "Definir horário fixo para fisioterapia com equipe e paciente",
                "Participação nos rounds para integração ao plano diário",
                "Comunicação prévia sobre necessidade de janela para fisioterapia",
                "Documentar cancelamentos e impacto no prontuário",
                "Sessões de fisioterapia integradas aos cuidados de enfermagem quando possível"
            ]
        },
        {
            "name": "F7.P7 — HIPOATIVIDADE NO LEITO / SÍNDROME DO IMOBILISMO",
            "desc": "Grave. Paciente mantido em repouso no leito > 48-72h sem mobilização, ausência de mudanças de decúbito frequentes, sem sedestação, sem ortostatismo, alto risco de descondicionamento severo e complicações do imobilismo",
            "block": "🛏️ BLOCO F7 — DISPOSITIVOS & BARREIRAS EXTERNAS",
            "goals": [
                "Iniciar mobilização precoce nas primeiras 24-48h quando seguro",
                "Realizar mudança de decúbito a cada 2h",
                "Atingir sedestação beira do leito em até 72h de internação"
            ],
            "assess": [
                "Tempo total de permanência em decúbito",
                "Frequência de mudança de decúbito",
                "Registro das sessões de mobilização realizadas",
                "Escalas de risco: Braden (úlcera), Caprini (TVP)"
            ],
            "interv": [
                "Protocolo de mobilização precoce: critérios de início e progressão",
                "Mudança de decúbito programada a cada 2h (equipe de enfermagem)",
                "EENM passivo em imobilizados sem resposta motora",
                "Cicloergômetro passivo em ventilados sedados",
                "Educação da equipe sobre ICU-AW e síndrome do imobilismo"
            ]
        },
        {
            "name": "F7.P8 — NECESSIDADE DE EVOLUÇÃO POSTURAL PROGRESSIVA",
            "desc": "Grave. Paciente restrito ao leito por período prolongado, necessita progressão sistemática de posturas para recuperar tolerância postural, força antigravitária e funcionalidade. Risco de intolerância ortostática, descondicionamento e perda de independência funcional",
            "block": "🛏️ BLOCO F7 — DISPOSITIVOS & BARREIRAS EXTERNAS",
            "goals": [
                "Progredir do decúbito para sedestação em 3-5 dias",
                "Atingir ortostatismo em 5-10 dias com apoio",
                "Deambulação de curta distância em 7-14 dias conforme tolerância"
            ],
            "assess": [
                "Postura máxima atual tolerada e tempo de tolerância",
                "Sinais vitais em cada postura (PA, FC, SpO₂)",
                "Força antigravitária: MRC de extensores de MMII e tronco",
                "Fatores limitantes: dor, dispneia, hipotensão, fraqueza"
            ],
            "interv": [
                "Protocolo de verticalização: 0° → 30° → 45° → 60° → 80° → em pé",
                "Tempo mínimo em cada estágio antes de avançar: 5-10 min sem sintomas",
                "Registro de progressão postural a cada sessão",
                "Cicloergômetro e exercícios de MMII em cada postura",
                "Critérios de segurança para progressão: PA, FC, SpO₂ estáveis"
            ]
        }
    ]
  },
  {
    "id": "trauma",
    "name": "Sistema Trauma/Ortopedia",
    "icon": "M8.25 3v1.5M4.5 8.25H3m3.75 8.25h-.75M3 12h.75M8.25 8.25V12m0-3.75v1.5M12 3v1.5m0 9V21m-3.75-9h.75M12 8.25h.75m-9 3.75h.75M12 12h.75",
    "color": "#fb923c",
    "problems": [
        {
            "name": "5.0.P1 — Dor traumática ou pós-operatória limitante",
            "desc": "Grave. EVA ≥ 6 em repouso ou ≥ 4 ao mobilizar, dor impede: respirar fundo, tossir, sentar, levantar, andar",
            "block": "🦴 5.0 — BASE TRANSVERSAL DO TRAUMA/ORTOPEDIA",
            "goals": [
                "Reduzir EVA ≤ 4 em repouso e ≤ 3 ao mobilizar",
                "Participar da fisioterapia sem interrupção por dor",
                "Realizar respiração profunda e tosse sem espasmo álgico"
            ],
            "assess": [
                "EVA/NRS em repouso e durante movimento/função",
                "Impacto da dor na mecânica ventilatória (expansibilidade, tosse)",
                "Analgesia atual e janela de maior efeito",
                "Avaliação de guarding e comportamento de proteção"
            ],
            "interv": [
                "Solicitar analgesia antes das sessões (comunicar equipe médica)",
                "TENS analgésico no local da dor antes de mobilizar",
                "Técnicas suaves: mobilização passiva, posicionamento anti-álgico",
                "Incentivo à respiração profunda na janela de analgesia adequada",
                "Progressão de mobilização conforme controle da dor"
            ]
        },
        {
            "name": "5.0.P2 — Restrição de carga (NWB / TTWB / PWB / WBAT)",
            "desc": "Grave. Prescrição formal de restrição, risco de falha de síntese/colapso estrutural",
            "block": "🦴 5.0 — BASE TRANSVERSAL DO TRAUMA/ORTOPEDIA",
            "goals": [
                "Cumprir restrição de carga com zero violações",
                "Treinar marcha com dispositivo adequado dentro dos limites",
                "Manter força e ADM dos segmentos não restritos"
            ],
            "assess": [
                "Classificação de carga prescrita e justificativa",
                "Domínio do paciente sobre a restrição (NWB/TTWB/PWB/WBAT)",
                "Dispositivo de marcha mais adequado ao nível de carga",
                "Risco de queda durante deambulação com restrição"
            ],
            "interv": [
                "Treino da técnica de marcha com carga prescrita (andador/muletas)",
                "Educação do paciente e família sobre restrição: o que é e por quê",
                "Exercícios de MMSS e core sem carga no segmento restrito",
                "Fortalecimento isométrico do membro restrito sem carga axial",
                "Revisão diária com equipe médica sobre progressão da carga"
            ]
        },
        {
            "name": "5.0.P3 — Risco de instabilidade mecânica / falha de fixação",
            "desc": "Crítico. Osteossíntese recente, fixador externo, fratura instável, dor mecânica localizada",
            "block": "🦴 5.0 — BASE TRANSVERSAL DO TRAUMA/ORTOPEDIA",
            "goals": [
                "Realizar mobilização sem comprometer fixação cirúrgica",
                "Identificar sinais precoces de falha de fixação",
                "Manter movimentos dentro dos limites de segurança mecânica"
            ],
            "assess": [
                "Tipo de fixação e protocolo do cirurgião",
                "Dor mecânica localizada no foco de fratura",
                "Crepitação, calor ou aumento de edema local",
                "Comunicação diária com equipe cirúrgica"
            ],
            "interv": [
                "Mobilização apenas dentro dos limites aprovados pelo cirurgião",
                "Nenhuma carga ou movimento proibido sem liberação médica",
                "Checklist de segurança antes de cada sessão",
                "Interrupção imediata se dor mecânica nova ou crepitação",
                "Comunicar qualquer alteração ao cirurgião imediatamente"
            ]
        },
        {
            "name": "5.0.P4 — Imobilismo com risco sistêmico",
            "desc": "Grave. Paciente restrito ao leito, risco de: atelectasia, TEP/TVP, perda funcional acelerada",
            "block": "🦴 5.0 — BASE TRANSVERSAL DO TRAUMA/ORTOPEDIA",
            "goals": [
                "Iniciar mobilização precoce nas primeiras 24-48h quando seguro",
                "Realizar exercícios de MMII para profilaxia de TVP",
                "Manter expansibilidade pulmonar e trocas gasosas"
            ],
            "assess": [
                "Risco de TVP: Caprini ou Wells Score",
                "Risco de atelectasia: ausculta, RX, SpO₂",
                "Tempo em decúbito nas últimas 24h",
                "Medicação antitrombótica prescrita"
            ],
            "interv": [
                "Exercícios de bombeamento de panturrilha 10x/h acordado",
                "Mobilização passiva e ativa-assistida de MMII",
                "Fisioterapia respiratória: expansão, tosse dirigida",
                "Mudança de decúbito a cada 2h",
                "Deambulação precoce assim que segura clinicamente"
            ]
        },
        {
            "name": "5.0.P5 — Perda de ADM e força nos segmentos não imobilizados",
            "desc": "Moderado. Edema, rigidez, inibição muscular, desuso nos segmentos proximal e contralateral ao trauma",
            "block": "🦴 5.0 — BASE TRANSVERSAL DO TRAUMA/ORTOPEDIA",
            "goals": [
                "Manter ADM completa nos segmentos não imobilizados",
                "Prevenir atrofia muscular nos membros não afetados",
                "Manter condicionamento cardiovascular mínimo"
            ],
            "assess": [
                "Goniometria dos segmentos proximais e contralaterais",
                "MRC dos grupos musculares não restritos",
                "Edema: perimetria e sinal de cacifo",
                "Força de preensão (quando MMSS livre)"
            ],
            "interv": [
                "Exercícios ativos de todos os segmentos não restritos diariamente",
                "Mobilização de articulações proximais ao trauma (ex: quadril em fratura de joelho)",
                "Cicloergômetro de MMSS quando MMII restrito",
                "Treino de MMSS para uso de dispositivos de marcha",
                "Correção de edema: elevação, crioterapia, compressão"
            ]
        },
        {
            "name": "5.1.P1 — Dor ventilatório-dependente com hipoventilação",
            "desc": "Grave. EVA ≥ 6 ao inspirar profundo/tossir, FR superficial, ↓ excursão torácica, ↓ volumes, piora da SpO₂ ao esforço, RX: hipoventilação basal/atelectasia incipiente",
            "block": "🫁 5.1 — TRAUMA TORÁCICO",
            "goals": [
                "Expansibilidade torácica simétrica sem dor limitante",
                "Vt > 5-8 mL/kg ao respirar profundo com analgesia",
                "SpO₂ ≥ 94% em ar ambiente ao esforço leve"
            ],
            "assess": [
                "Cirtometria axilar e xifoidiana",
                "Ventilometria: Vt e CV",
                "SpO₂ em repouso e ao esforço",
                "EVA ao inspirar profundo, tossir e mobilizar",
                "Ausculta: redução de MV, presença de estertores"
            ],
            "interv": [
                "Solicitar analgesia antes da sessão (bloco intercostal, PCA, EV)",
                "Fisioterapia respiratória: expansão costal manual e incentivador",
                "Sniff test e inspiração fracionada para ganho de volume",
                "Suporte de tórax para tosse (travesseiro/mão do terapeuta)",
                "Posicionamento lateral contrário à lesão para expansão do pulmão acometido"
            ]
        },
        {
            "name": "5.1.P2 — Atelectasia segmentar/lobar pós-trauma",
            "desc": "Grave. RX/TC: colapso parcial/total, ausculta: ↓ MV localizado, ↑ necessidade de O₂ ou queda de SpO₂, ↓ complacência regional",
            "block": "🫁 5.1 — TRAUMA TORÁCICO",
            "goals": [
                "Reexpansão radiológica da área colapsada",
                "SpO₂ ≥ 94% sem aumento de FiO₂",
                "Ausculta com MV presente nos segmentos afetados"
            ],
            "assess": [
                "RX/TC: localização e extensão da atelectasia",
                "Ausculta: segmentos hipoventilados",
                "SpO₂ e necessidade de O₂ suplementar",
                "Capacidade de tosse eficaz (PCF)"
            ],
            "interv": [
                "Drenagem postural para o segmento afetado",
                "Vibrocompressão segmentar sobre a área colapsada",
                "Manobra de hiperinsuflação manual (bag squeezing) em ventilados",
                "CPAP/EPAP para recrutamento alveolar",
                "Deambulação precoce como potente recurso de expansão pulmonar"
            ]
        },
        {
            "name": "5.1.P3 — Tosse ineficaz e retenção de secreção",
            "desc": "Grave. Dor ou fraqueza impede tosse, PCF < 270 L/min = tosse ineficaz, PCF < 160 L/min = incapaz de limpar via aérea, roncos/estertores, necessidade de aspiração",
            "block": "🫁 5.1 — TRAUMA TORÁCICO",
            "goals": [
                "PCF ≥ 270 L/min ou tosse eficaz com suporte",
                "Via aérea limpa sem necessidade frequente de aspiração",
                "Ausculta sem roncos persistentes"
            ],
            "assess": [
                "PCF (Peak Cough Flow) com fluxômetro",
                "Ausculta: roncos, estertores, crepitações",
                "SpO₂ antes e após higiene brônquica",
                "Capacidade ventilatória para suportar manobra de tosse"
            ],
            "interv": [
                "Suporte manual de tórax durante tosse (travesseiro/mãos)",
                "Técnica de expiração forçada (huff) como alternativa à tosse explosiva",
                "Drenagem autogênica para mobilização de secreção",
                "Cough Assist (insuflador-exsuflador) se PCF < 160 L/min",
                "Analgesia adequada como pré-requisito para tosse eficaz"
            ]
        },
        {
            "name": "5.1.P4 — Contusão pulmonar com alteração de troca gasosa",
            "desc": "Crítico. PaO₂/FiO₂ < 300 (ou SpO₂ instável), RX/TC: consolidações/vidro fosco, aumento progressivo da FiO₂ necessária",
            "block": "🫁 5.1 — TRAUMA TORÁCICO",
            "goals": [
                "PaO₂/FiO₂ > 300 com progressão positiva",
                "SpO₂ estável ≥ 92% com FiO₂ mínima",
                "Evitar progressão para SDRA"
            ],
            "assess": [
                "PaO₂/FiO₂ (relação P/F)",
                "SpO₂ e FiO₂ necessária",
                "TC de tórax: extensão das consolidações",
                "Mecânica ventilatória: Vt, pressão de pico, complacência (em ventilados)"
            ],
            "interv": [
                "Posicionamento em prona 16h/dia se P/F < 150 em ventilados",
                "Estratégia protetora de VM: Vt 6 mL/kg, PEEP adequada",
                "Drenagem postural e higiene brônquica cuidadosa",
                "Mobilização passiva precoce para recrutar regiões dorsais",
                "Monitorização rigorosa da SpO₂ durante qualquer intervenção"
            ]
        },
        {
            "name": "5.1.P5 — Instabilidade mecânica da parede torácica (volet costal)",
            "desc": "Crítico. Movimento paradoxal, dor intensa, ↑ trabalho respiratório, risco de fadiga respiratória",
            "block": "🫁 5.1 — TRAUMA TORÁCICO",
            "goals": [
                "Manutenção de ventilação adequada sem fadiga",
                "Prevenir deterioração para insuficiência respiratória",
                "Suporte ventilatório de manutenção segura"
            ],
            "assess": [
                "Extensão do volet e movimento paradoxal",
                "FR, volume corrente e SpO₂",
                "Trabalho respiratório: uso de musculatura acessória",
                "Gasometria arterial: pH, PaCO₂, PaO₂"
            ],
            "interv": [
                "Imobilização pneumática interna: CPAP ou VM com PEEP",
                "Posicionamento lateral sobre o lado do volet para estabilização",
                "Fisioterapia respiratória não agressiva (sem compressão do volet)",
                "Comunicar imediatamente fadiga respiratória à equipe médica",
                "Preparação para intubação se deterioração"
            ]
        },
        {
            "name": "5.1.P6 — Pneumo/hemotórax drenado com risco de complicações",
            "desc": "Grave. Dreno em selo d'água, dor e proteção ventilatória, risco de: hipoventilação, atelectasia, infecção",
            "block": "🫁 5.1 — TRAUMA TORÁCICO",
            "goals": [
                "Expansão pulmonar completa com dreno funcionante",
                "Ausculta com MV presente no hemitórax drenado",
                "Resolução da coleção com progressão para remoção do dreno"
            ],
            "assess": [
                "Drenagem: volume, características, oscilação, fuga aérea",
                "RX: expansão do pulmão, posição do dreno",
                "Ausculta: MV no lado drenado",
                "EVA ao respirar e mobilizar com dreno"
            ],
            "interv": [
                "Orientação sobre mobilização segura com dreno (não dobrar, não elevar além da altura do tórax)",
                "Fisioterapia respiratória ipsilateral ao dreno com cuidado",
                "Expansão do hemitórax drenado: incentivador, expansão costal manual",
                "Drenagem postural cuidadosa evitando posições que aumentem dor",
                "Analgesia adequada para permitir expansão torácica"
            ]
        },
        {
            "name": "5.1.P7 — Insuficiência respiratória aguda pós-trauma",
            "desc": "Crítico. SpO₂ < 90% com O₂, FR > 30 ou < 10, PaO₂/FiO₂ < 200, uso de musculatura acessória/fadiga",
            "block": "🫁 5.1 — TRAUMA TORÁCICO",
            "goals": [
                "Suporte ventilatório adequado sem intubação (se possível)",
                "SpO₂ ≥ 92% com suporte O₂/VNI",
                "Identificar causa e tratar fator precipitante"
            ],
            "assess": [
                "SpO₂, FR, gasometria arterial",
                "Causa: pneumotórax, hemotórax, contusão pulmonar, SDRA",
                "Nível de consciência e proteção de via aérea",
                "Resposta à VNI: Vt, sincronia, tolerância"
            ],
            "interv": [
                "VNI (CPAP ou BiPAP) se sem contraindicação",
                "Posicionamento para maximizar relação V/Q",
                "Fisioterapia respiratória somente após estabilização",
                "Comunicar imediatamente à equipe qualquer deterioração",
                "Preparação de material para intubação"
            ]
        },
        {
            "name": "5.2.P1 — Risco de instabilidade da coluna e piora neurológica",
            "desc": "Crítico. Fratura instável ou em investigação, uso obrigatório de colar/colete, dor axial importante, prescrição de restrição de movimento",
            "block": "🦴 5.2 — COLUNA & TRAUMA RAQUIMEDULAR (TRM)",
            "goals": [
                "Manutenção de alinhamento espinhal em todas as manobras",
                "Zero eventos de deterioração neurológica por mobilização",
                "Mobilização segura com técnica de log roll correta"
            ],
            "assess": [
                "Nível neurológico e ASIA (A-E)",
                "Imagem: tipo de fratura, estabilidade",
                "Dispositivo de imobilização em uso (colar, colete, halo)",
                "Protocolo de precauções da equipe cirúrgica"
            ],
            "interv": [
                "Técnica de log roll para todos os decúbitos e mudanças de posição",
                "Nunca mobilizar sem equipamento de imobilização em uso",
                "Treino da equipe de enfermagem na técnica de log roll",
                "Educação do paciente sobre importância das restrições de movimento",
                "Posicionamento neutro da coluna em toda posição"
            ]
        },
        {
            "name": "5.2.P2 — Déficit neurológico medular (completo ou incompleto)",
            "desc": "Crítico. Paresia/plegia, alteração sensitiva, nível neurológico definido, ASIA A-D",
            "block": "🦴 5.2 — COLUNA & TRAUMA RAQUIMEDULAR (TRM)",
            "goals": [
                "Preservar e maximizar função residual abaixo do nível de lesão",
                "Prevenir complicações secundárias do imobilismo",
                "Promover independência funcional máxima conforme nível ASIA"
            ],
            "assess": [
                "Classificação ASIA: nível motor e sensitivo",
                "Escala ASIA: A (completo) a E (normal)",
                "Função respiratória: nível cervical compromete diafragma e intercostais",
                "Tônus, reflexos, espasticidade, bexiga/intestino neurogênico"
            ],
            "interv": [
                "Mobilização passiva de todos os segmentos plégicos",
                "Posicionamento terapêutico para prevenir contraturas",
                "Fisioterapia respiratória intensiva em lesões cervicais/torácicas altas",
                "Fortalecimento intensivo de segmentos preservados",
                "Treinamento funcional conforme nível de lesão: C5-T4-T10-L1 etc"
            ]
        },
        {
            "name": "5.2.P3 — Incapacidade de realizar transferências seguras",
            "desc": "Grave. Não consegue: rolar, sentar, transferir sem violar alinhamento da coluna ou restrições mecânicas",
            "block": "🦴 5.2 — COLUNA & TRAUMA RAQUIMEDULAR (TRM)",
            "goals": [
                "Realizar log roll e transferências com alinhamento espinhal mantido",
                "Transferência leito-cadeira com 2 pessoas de forma segura",
                "Progredir para transferências com assistência mínima quando estabilizado"
            ],
            "assess": [
                "Força funcional dos segmentos preservados",
                "Capacidade de cooperar com a manobra de transferência",
                "Número de pessoas necessárias para transferência segura",
                "Equipamentos disponíveis: tábua de transferência, guindaste"
            ],
            "interv": [
                "Treino de log roll: posição supina → decúbito lateral → sedestação em etapas",
                "Transferência com equipe treinada: 3-4 pessoas na fase aguda",
                "Uso de tábua de deslizamento para transferência leito-cadeira",
                "Treino de transferência independente conforme potencial neurológico",
                "Cadeira de rodas com suporte lombar adequado para nível de lesão"
            ]
        },
        {
            "name": "5.2.P4 — Hipoventilação por dor, colar ou fraqueza muscular respiratória",
            "desc": "Grave. FR superficial, ↓ expansibilidade torácica, ↓ volumes pulmonares, tosse fraca em lesões cervicais/altas",
            "block": "🦴 5.2 — COLUNA & TRAUMA RAQUIMEDULAR (TRM)",
            "goals": [
                "CV > 15-20 mL/kg (referência para extubação/evitar intubação)",
                "SpO₂ ≥ 94% sem suporte ou com suporte mínimo",
                "Tosse eficaz com assistência manual ou PCF ≥ 270 L/min com auxílio"
            ],
            "assess": [
                "Ventilometria: Vt, CV, PIM, PEM",
                "SpO₂ e FR",
                "PCF com e sem assistência manual",
                "Nível neurológico: C3-5 compromete diafragma, T1-12 intercostais"
            ],
            "interv": [
                "Fisioterapia respiratória com técnica de glossofaríngea em tetraplégicos",
                "Cough Assist (insuflador-exsuflador) para PCF < 160 L/min",
                "Assistência manual à tosse: compressão costal durante expiração",
                "Posicionamento: Fowler 30-45° para facilitar ventilação diafragmática",
                "VNI noturna se CV < 50% ou PaCO₂ elevado"
            ]
        },
        {
            "name": "5.2.P5 — Alto risco de complicações do imobilismo",
            "desc": "Grave. Restrição ao leito, risco de: atelectasia, pneumonia, trombose, úlceras de pressão, perda funcional acelerada",
            "block": "🦴 5.2 — COLUNA & TRAUMA RAQUIMEDULAR (TRM)",
            "goals": [
                "Manter pele íntegra com mudanças de decúbito programadas",
                "Zero episódios de pneumonia aspirativa",
                "Profilaxia de TVP eficaz em combinação com tratamento farmacológico"
            ],
            "assess": [
                "Inspeção de pele a cada 4h (atenção: sacro, calcâneos, occipital, escápulas)",
                "Score de Braden para úlcera de pressão",
                "Wells score e presença de MMII edemaciados (TVP)",
                "Ausculta pulmonar e SpO₂"
            ],
            "interv": [
                "Mudança de decúbito a cada 2h (protocolo com enfermagem)",
                "Mobilização passiva MMII para prevenção de TVP",
                "Exercícios respiratórios a cada 2-3h",
                "Colchão piramidal/AR ou cinesiterapia motora em plégicos",
                "Comunicação com equipe sobre restrições x necessidade de mobilização"
            ]
        },
        {
            "name": "5.3.P1 — Restrição de carga (NWB/TTWB/PWB/WBAT) em MMII",
            "desc": "Crítico. Ordem médica explícita ou implícita pelo tipo de fratura/síntese, dor mecânica ao apoio, alto risco de falha de fixação",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Zero violação da restrição de carga em todas as atividades",
                "Domínio do paciente sobre sua restrição e como aplicar",
                "Marcha segura com dispositivo adequado ao nível de carga"
            ],
            "assess": [
                "Prescrição médica: NWB, TTWB, PWB (% carga), WBAT",
                "Avaliação do tipo de fixação e estágio de consolidação",
                "Capacidade do paciente de entender e cumprir a restrição",
                "Balanço de MMSS para uso de andador/muletas"
            ],
            "interv": [
                "Treino de marcha com carga prescrita: andador (NWB/TTWB), muletas (PWB)",
                "Escala de carga progressiva conforme protocolo do cirurgião",
                "Exercícios isométricos no membro restrito sem carga axial",
                "MMSS e CORE: treino para suporte e uso de dispositivos de marcha",
                "Educação repetitiva sobre regra de carga a cada sessão"
            ]
        },
        {
            "name": "5.3.P2 — Dor mecânica limitante em MMII",
            "desc": "Grave. EVA ≥ 6 em repouso ou ≥ 4 ao mobilizar, dor impede: sentar-levantar, ortostatismo, marcha/treino de apoio",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "EVA ≤ 3 durante treino de marcha",
                "Sit-to-stand sem interrupção por dor",
                "Tolerar sessão de 20-30 min de reabilitação funcional"
            ],
            "assess": [
                "EVA em repouso, durante mobilização e após",
                "Localização e padrão da dor: foco de fratura vs musculotendinosa",
                "Analgesia atual e momento de pico de efeito",
                "Edema e temperatura local"
            ],
            "interv": [
                "Coordenação com enfermagem para analgesia 30-60 min antes da sessão",
                "TENS analgésico na região dolorosa",
                "Crioterapia pós-sessão para controle de edema e dor",
                "Elevação do membro entre sessões",
                "Progressão do treino dentro do limiar de dor tolerável"
            ]
        },
        {
            "name": "5.3.P3 — Inibição muscular e fraqueza segmentar (quadríceps/glúteos)",
            "desc": "Moderado. Incapaz de extensão ativa adequada de joelho (lag extensor), incapaz de manter controle pélvico em ortostatismo, falha funcional em STS",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Quadríceps MRC ≥ 3 (vencer gravidade) sem lag extensor",
                "Glúteo médio MRC ≥ 3 para controle pélvico",
                "Sit-to-stand sem colapso de joelho/pelve"
            ],
            "assess": [
                "Teste de lag extensor de joelho",
                "MRC de quadríceps, glúteo médio, isquiossurais, tibial anterior",
                "Controle pélvico durante step e ortostatismo unipodal",
                "Velocidade de recrutamento motor"
            ],
            "interv": [
                "Isometria de quadríceps: contração sustentada, progressão de ângulo",
                "Elevação do membro estendido (SLR) contra gravidade",
                "Mini-squat assistido para recrutamento funcional",
                "EENM de quadríceps para superar inibição reflexa",
                "Glúteo médio: abdução em decúbito lateral → clamshell → em pé"
            ]
        },
        {
            "name": "5.3.P4 — Edema, rigidez e perda de ADM (pós-imobilização/pós-op)",
            "desc": "Moderado. Limita padrão de marcha, rigidez que impede transferências, dorsiflexão e flexão de joelho reduzidas",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Edema controlado (perimetria sem aumento nas últimas 48h)",
                "Dorsiflexão ≥ 10° para padrão de marcha adequado",
                "Flexão de joelho ≥ 90° para sentar e subir escadas"
            ],
            "assess": [
                "Perimetria do membro (maleolar, panturrilha, coxa)",
                "Goniometria: dorsiflexão, flexão/extensão de joelho, flexão de quadril",
                "Sinal de cacifo / sinais de TVP",
                "Temperatura e rubor local (descartar infecção)"
            ],
            "interv": [
                "Elevação do membro entre sessões",
                "Compressão elástica (meia ou bandagem) para controle de edema",
                "Mobilização passiva e ativo-assistida dentro dos limites",
                "Crioterapia 20 min 3-4x/dia na fase aguda",
                "Ganho de dorsiflexão: exercício de toalha, calcanhar no chão, bicicleta"
            ]
        },
        {
            "name": "5.3.P5 — Instabilidade de marcha / alto risco de queda",
            "desc": "Grave. Precisa de apoio amplo (andador) + insegurança, quase-quedas, oscilação importante, medo de cair",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Marcha com andador sem quase-quedas",
                "Berg Balance Scale ≥ 45/56 para marcha segura",
                "Confiança no uso do dispositivo de marcha (FES-I adequada)"
            ],
            "assess": [
                "TUG (Timed Up and Go)",
                "Berg Balance Scale",
                "Apoio unipodal no membro saudável",
                "Falls Efficacy Scale (FES-I) / ABC Scale"
            ],
            "interv": [
                "Treino de marcha com progressão de dispositivo: andador → muleta → bengala",
                "Treino de transferência de peso e passo lateral",
                "Ambiente seguro para treino: corredor com corrimão",
                "Treino em diferentes superfícies: liso, irregular, rampas",
                "Fortalecimento de tobillo e quadril como estabilizadores primários"
            ]
        },
        {
            "name": "5.3.P6 — Alto risco tromboembólico e complicações por imobilismo",
            "desc": "Grave. Trauma + repouso + edema MMII, mobilidade muito baixa nas primeiras 72h, riscos adicionais",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Zero eventos de TVP sintomática",
                "Mobilização precoce dentro das restrições mecânicas",
                "Exercícios de MMII realizados no mínimo 3x/dia"
            ],
            "assess": [
                "Wells Score para TVP",
                "Edema assimétrico de MMII, calor local, dor à palpação de panturrilha",
                "Doppler venoso quando indicado",
                "Anticoagulação prescrita"
            ],
            "interv": [
                "Exercícios de bombeamento de tornozelo e panturrilha 10x/h",
                "Mobilização passiva de quadril, joelho e tornozelo 3x/dia",
                "Compressão pneumática intermitente quando disponível",
                "Deambulação precoce assim que clearance médico",
                "Educação sobre sinais de alerta de TVP/TEP"
            ]
        },
        {
            "name": "5.3.P7 — Fratura de PELVE/ACETÁBULO com limitação funcional severa",
            "desc": "Crítico. Dor pélvica intensa, restrição de carga frequentemente mais rígida, transferências complexas",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Transferências seguras sem dor na pelve > EVA 5",
                "Sentar em cadeira reclinável por ≥ 30 min",
                "Caminhar com andador e restrição de carga conforme protocolo"
            ],
            "assess": [
                "Tipo de fratura: estável (ramo pubiano) vs instável (sacroilíaca, acetábulo)",
                "Restrição de carga e posição proibida (ex: flexão de quadril > 60-90°)",
                "Dor à palpação de sínfise, sacroilíaca, virilha",
                "Força de MMII e capacidade de sentar-levantar"
            ],
            "interv": [
                "Log roll modificado para decúbitos respeitando estabilidade pélvica",
                "Transferência com 2-3 pessoas nas primeiras semanas",
                "Sentar em superfície alta (cadeira alta) para reduzir carga na pelve",
                "Isometria de glúteo e quadríceps em decúbito",
                "Progressão de carga conforme protocolo específico do cirurgião"
            ]
        },
        {
            "name": "5.3.P8 — Paciente não domina a regra de carga (risco de violar restrição)",
            "desc": "Grave. Apoia sem perceber/impulsivo, cognitivo limítrofe ou ansiedade, falha repetida em obedecer TTWB/PWB",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Zero violações não intencionais de carga nas últimas 24h",
                "Paciente capaz de explicar e demonstrar a restrição",
                "Uso correto e consistente do dispositivo de marcha"
            ],
            "assess": [
                "Avaliação cognitiva: compreensão da restrição",
                "Observação durante marcha: apoia sem perceber?",
                "Teste: 'Mostre como você anda com o andador'",
                "Medo vs impulsividade como causa da violação"
            ],
            "interv": [
                "Educação repetitiva a cada sessão: verbal + demonstração + prática",
                "Recurso visual: fita no membro restrito como lembrete",
                "Treino de marcha com feedback imediato ao apoiar errado",
                "Comunicar risco à equipe de enfermagem e família para reforço",
                "Avaliação de cognitivo com psicologia se falhas repetidas"
            ]
        },
        {
            "name": "5.3.P9 — Fratura de FÊMUR PROXIMAL (colo / transtrocantérica / subtrocantérica)",
            "desc": "Crítico. Idoso pós-queda, encurtamento e rotação externa, dor inguinal/coxa proximal intensa, incapacidade total de carga, alto risco TVP, fixação com DHS/haste/artroplastia",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Marcha com andador e carga prescrita até alta hospitalar",
                "Sit-to-stand com assistência mínima",
                "Retorno ao nível funcional pré-fratura em 3-6 meses"
            ],
            "assess": [
                "Tipo de fixação: DHS, haste cefalomedular, artroplastia parcial/total",
                "Restrição de carga e movimentos proibidos (pós-ATQ: flexão > 90°, adução, RI)",
                "Força de extensores de quadril e joelho",
                "Estado cognitivo e risco de quedas pré-morbido"
            ],
            "interv": [
                "Mobilização precoce D1-D2 pós-op: sentar na borda do leito",
                "Treino de sit-to-stand com ajuda e alturas progressivas",
                "Precauções pós-ATQ: evitar flexão > 90°, adução, RI de quadril",
                "Marcha com andador WBAT/PWB conforme fixação",
                "Prevenção de quedas: revisão do ambiente domiciliar para alta"
            ]
        },
        {
            "name": "5.3.P10 — Fratura de FÊMUR DIAFISÁRIO",
            "desc": "Crítico. Trauma de alta energia, dor intensa coxa, deformidade/encurtamento, fixação com haste intramedular bloqueada, carga variável (PWB/WBAT), risco de sangramento oculto (500-1500mL)",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Marcha com andador e carga conforme protocolo em 48-72h pós-op",
                "Controle do edema da coxa",
                "Força de quadríceps MRC ≥ 3 em 2 semanas"
            ],
            "assess": [
                "Estado hemodinâmico: Hb, hematócrito, hipotensão por sangramento oculto",
                "Tipo de haste e protocolo de carga do cirurgião",
                "Edema da coxa: perimetria",
                "Força de quadríceps e glúteos no pós-op precoce"
            ],
            "interv": [
                "Monitorização hemodinâmica nas primeiras 72h durante mobilização",
                "Isometria de quadríceps D1 pós-op",
                "Mobilização de quadril e joelho: ADM progressiva conforme dor",
                "Marcha com carga progressiva conforme protocolo",
                "Elevação e compressão para controle do edema"
            ]
        },
        {
            "name": "5.3.P11 — Fratura de TÍBIA/FÍBULA",
            "desc": "Crítico. Dor perna intensa, edema importante, fixação com haste/placa OU fixador externo, restrição NWB/PWB, ALTO RISCO de síndrome compartimental aguda",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Diagnóstico precoce de síndrome compartimental (monitorização ativa)",
                "Dorsiflexão ≥ 5-10° ao final da imobilização",
                "Marcha sem dispositivo em 12-16 semanas conforme consolidação"
            ],
            "assess": [
                "SINAIS DE ALERTA — Síndrome compartimental: dor desproporcional + dor extensão passiva + parestesia + tensão do compartimento",
                "Edema: perimetria, temperatura, coloração",
                "Goniometria de tornozelo: dorsiflexão, plantiflexão",
                "Pulso poplíteo e tibial posterior"
            ],
            "interv": [
                "Elevação do membro RIGOROSA nas primeiras 48h",
                "Monitorização horária de sinais de síndrome compartimental",
                "COMUNICAR IMEDIATAMENTE qualquer piora de dor desproporcional à equipe médica",
                "Mobilização de tornozelo dentro dos limites (isometria inicial)",
                "Progressão de carga conforme consolidação radiológica"
            ]
        },
        {
            "name": "5.3.P12 — Fratura de TORNOZELO (maleolar uni/bi/trimaleolar)",
            "desc": "Grave. Dor intensa tornozelo, edema importante, instabilidade articular, fixação com placa/parafusos, imobilização temporária, restrição NWB/TTWB, ALTO RISCO de rigidez e equino",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Dorsiflexão ≥ 10° ao final do protocolo de reabilitação",
                "Marcha com carga total sem dor ao rolar do pé",
                "Prevenção de equino: dorsiflexão ≥ 0° ao final da imobilização"
            ],
            "assess": [
                "Goniometria de tornozelo: dorsiflexão (principal), plantiflexão, inversão, eversão",
                "Edema: perimetria maleolar",
                "Dor à palpação dos maléolos e linha articular",
                "Força de tibial anterior e tríceps sural"
            ],
            "interv": [
                "Mobilização precoce de tornozelo: circundução, dorsiflexão, plantiflexão DENTRO dos limites",
                "Elevação + crioterapia 20 min 3-4x/dia para controle de edema",
                "Treino de dorsiflexão progressivo: toalha, heel slides, ramp walking",
                "Treino de marcha com padrão de rolamento do pé",
                "Propriocepção progressiva: equilíbrio estático → dinâmico → superfície instável"
            ]
        },
        {
            "name": "5.3.P13 — Fratura de CALCÂNEO / ossos do pé (Lisfranc, metatarsos)",
            "desc": "Grave. Trauma de alta energia (queda de altura), edema maciço pé/retropé, NWB prolongado (8-12 semanas comum), risco de rigidez subtalar/mediotarsal",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Manutenção de ADM subtalar e mediotarsal durante imobilização",
                "Marcha sem dor em carga total ao fim do protocolo",
                "Prevenção de equino e rigidez grave do pé"
            ],
            "assess": [
                "Edema do pé: perimetria do tornozelo e mediopé",
                "Goniometria: inversão/eversão subtalar, mobilidade mediotarsal",
                "Dor à palpação do calcâneo/tarso/metatarso",
                "Tipo de fixação e restrição de carga prescrita"
            ],
            "interv": [
                "NWB rigoroso nas primeiras 8-12 semanas (cirúrgico)",
                "Elevação contínua do pé acima do nível do coração para edema",
                "Mobilização de dedos, tornozelo e joelho: segmentos não restritos",
                "Início de carga progressiva após clearance radiológico",
                "Mobilização da subtalar e mediotarsal após liberação médica"
            ]
        },
        {
            "name": "5.3.P14 — Fratura de PATELA",
            "desc": "Grave. Dor joelho anterior intensa, lag extensor grave/completo, mecanismo extensor comprometido, fixação com banda de tensão/parafusos OU conservador com imobilizador, restrição de flexão de joelho",
            "block": "🦵 5.3 — FRATURAS DE MEMBROS INFERIORES",
            "goals": [
                "Extensão ativa de joelho completa sem lag",
                "Flexão de joelho ≥ 90° respeitando protocolo",
                "Sit-to-stand sem compensação e sem dor > EVA 4"
            ],
            "assess": [
                "Lag extensor: diferença entre extensão passiva e ativa",
                "Goniometria de flexão de joelho (progressão dentro do protocolo)",
                "Força de quadríceps: MRC e dinamometria",
                "Dor retropatelar e ao movimento"
            ],
            "interv": [
                "Isometria de quadríceps em extensão desde D1",
                "SLR (straight leg raise) como exercício de progressão",
                "Extensão ativa contra gravidade conforme protocolo de liberação de flexão",
                "Treino de sit-to-stand com superfície alta inicialmente",
                "EENM de quadríceps para superar inibição reflexa"
            ]
        },
        {
            "name": "5.4.P1 — Dor e proteção antálgica do membro superior",
            "desc": "Grave. EVA ≥ 6 ao mover ou apoiar, MS colado ao corpo/protegido, dor impede: apoiar em andador, empurrar da cama, transferir",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "EVA ≤ 3 durante mobilização do MS",
                "Usar MS para apoio em andador quando bilateralmente necessário",
                "Participar de transferências sem proteção antálgica excessiva"
            ],
            "assess": [
                "EVA ao repouso e ao mover o MS",
                "Postura antálgica: ombro elevado, braço colado ao corpo, pronação de antebraço",
                "Impacto na transferência e uso de dispositivos de marcha",
                "Analgesia atual e janela de efeito"
            ],
            "interv": [
                "Tipoia de alívio para posicionamento anti-álgico",
                "TENS analgésico ou crioterapia local antes da mobilização",
                "Mobilização pendular de Codman em pendente (ombro)",
                "Instruções de analgesia prévia às sessões",
                "Adaptação de dispositivos de marcha se MS comprometido (ex: plataforma de apoio)"
            ]
        },
        {
            "name": "5.4.P2 — Restrição de movimento do ombro/cotovelo/punho",
            "desc": "Moderado. Ordem médica de imobilização, tipoia, gesso, órtese, movimentos proibidos (ex: elevação, rotação, carga)",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Cumprir todas as restrições sem violações",
                "Manter ADM e força dos segmentos não restritos",
                "Progressão de mobilização assim que liberado pelo cirurgião"
            ],
            "assess": [
                "Documentação das restrições específicas: amplitude, carga, posição",
                "Tipo de dispositivo: gesso, tala, tipoia, órtese funcional",
                "Avaliação da adequação do dispositivo (pressão, edema, neurovascularposta)",
                "Circulação e sensibilidade distal ao dispositivo"
            ],
            "interv": [
                "Exercícios dos segmentos distais livres: dedos, punho (se livre)",
                "Exercícios isométricos dentro do imobilizador quando indicado",
                "Manutenção da força do ombro contralateral",
                "Educação sobre cuidados com o dispositivo e sinais de alerta",
                "Progressão de mobilização conforme protocolo do cirurgião"
            ]
        },
        {
            "name": "5.4.P3 — Incapacidade de usar dispositivos de marcha por limitação de MMSS",
            "desc": "Grave. Não consegue segurar andador, usar muletas, apoiar para levantar, mesmo com MMII capazes",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Identificar dispositivo de marcha adequado ao MS comprometido",
                "Marcha funcional com adaptação ao deficit de MS",
                "Transferências seguras sem apoio no MS comprometido"
            ],
            "assess": [
                "Força e ADM do MS não comprometido",
                "Tipo de lesão de MS e o que pode apoiar",
                "Peso corporal e necessidade de suporte em dispositivo",
                "Alternativas de dispositivos: andador de plataforma, andador de apoio de antebraço"
            ],
            "interv": [
                "Andador com plataforma de apoio de antebraço para lesões de punho/mão",
                "Adaptação de andador com apoio lateral no MS comprometido",
                "Treino de transferência sem usar o MS afetado",
                "Fortalecimento intensivo do MS saudável",
                "Comunicação com equipe médica sobre limitação para ajuste de indicação de dispositivo"
            ]
        },
        {
            "name": "5.4.P4 — Edema, rigidez e perda de ADM do membro imobilizado",
            "desc": "Moderado. Mão inchada, dedos rígidos, dor e limitação progressiva de punho/cotovelo/ombro, risco de SDRC",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Edema da mão controlado: sem anéis apertados, dedos móveis",
                "Prevenção de SDRC: cor, temperatura e mobilidade normais distalmente",
                "Manter ADM máxima possível dentro da imobilização"
            ],
            "assess": [
                "Edema distal: perimetria digital, punho",
                "Mobilidade de dedos e punho dentro da imobilização",
                "Sinais de SDRC: alodinia, mudança de cor/temperatura, sudorese",
                "Coloração e temperatura dos dedos distalmente ao gesso/tala"
            ],
            "interv": [
                "Elevação do MS acima do nível do coração constantemente",
                "Exercícios de abertura e fechamento da mão: 10x/h",
                "Mobilização dos dedos livres distalmente ao imobilizador",
                "Reconhecimento precoce de SDRC: comunicar equipe se sinais",
                "Crioterapia distal e massagem linfática para edema"
            ]
        },
        {
            "name": "5.4.P5 — Perda de função global nas AVDs por limitação do membro superior",
            "desc": "Moderado. Dificuldade para: higiene, alimentação, vestir-se, apoiar-se para transferir",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Independência em AVDs básicas com MS saudável e adaptações",
                "Higiene e alimentação com máxima independência",
                "Estratégias compensatórias eficazes durante imobilização"
            ],
            "assess": [
                "FIM motor: alimentação, higiene, vestir-se, transferências",
                "Dominância e impacto: MS dominante vs não dominante",
                "Força e coordenação do MS saudável para compensar",
                "Recursos disponíveis: órteses, adaptações, família"
            ],
            "interv": [
                "Treino de AVDs com MS saudável (troca de dominância se necessário)",
                "Adaptações: abridor de garrafa, adaptadores de garfo, velcro em roupas",
                "Treino de vestir roupa com uma mão",
                "Treino de transferências sem apoio no MS comprometido",
                "Terapia ocupacional quando disponível para adaptação de AVDs"
            ]
        },
        {
            "name": "5.4.P6 — Risco de complicações do imobilismo do MS",
            "desc": "Moderado. Imobilização prolongada, dor + edema + rigidez, inibição muscular e perda rápida de função",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Manutenção de força do membro contralateral e proximal ao imobilizado",
                "Prevenção de rigidez digital e de punho durante imobilização",
                "Retorno funcional precoce após liberação do imobilizador"
            ],
            "assess": [
                "Força de preensão do MS saudável",
                "ADM dos segmentos livres no MS imobilizado",
                "Rigidez digital e dos dedos",
                "Força muscular proximal: ombro, cotovelo (se livre)"
            ],
            "interv": [
                "Exercícios de dedos, punho e cotovelo nos segmentos livres",
                "Isometria no MS imobilizado conforme permitido",
                "Fortalecimento do MS saudável para compensar função",
                "Mobilização precoce após retirada do imobilizador",
                "Educação sobre exercícios domiciliares durante imobilização"
            ]
        },
        {
            "name": "5.4.P7 — Fratura de ÚMERO PROXIMAL (colo cirúrgico, tuberosidade)",
            "desc": "Grave. Queda sobre ombro/braço estendido (comum em idosos), dor intensa ombro, equimose extensa, incapacidade de abdução/elevação ativa, tipoia/Velpeau, risco de capsulite adesiva",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Retorno à elevação ≥ 120° sem dor em 3-6 meses",
                "RE ≥ 30° e RI funcional (mão nas costas até L3)",
                "Prevenção de capsulite: mobilização precoce conforme protocolo"
            ],
            "assess": [
                "Goniometria: elevação, RE, RI",
                "Tipo de fratura e fixação: conservador (tipoia) ou ORIF",
                "Dor ao fim de amplitude (EVA)",
                "Força do manguito rotador e deltoides (quando liberado)"
            ],
            "interv": [
                "Pendular de Codman passivo desde 1ª semana (se protocolo permitir)",
                "Mobilização passiva de ombro em decúbito 2ª-3ª semana",
                "Ativo-assistido 4ª-6ª semana conforme progressão radiológica",
                "Fortalecimento do manguito rotador: fase 2 (geralmente 6-8 semanas)",
                "Progressão para exercícios ativos e funcionais: pentear, alcançar"
            ]
        },
        {
            "name": "5.4.P8 — Fratura de ÚMERO DIAFISÁRIO",
            "desc": "Grave. Trauma direto, dor intensa diáfise umeral, deformidade/crepitação, imobilização com tala/órtese funcional OU fixação cirúrgica, RISCO de lesão do nervo radial (20%)",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Detecção precoce de lesão de nervo radial (extensão de punho e dedos)",
                "Manutenção de ADM de cotovelo e ombro durante imobilização",
                "Retorno funcional após consolidação (12-16 semanas)"
            ],
            "assess": [
                "Função do nervo radial: extensão ativa de punho, polegar, dedos",
                "Extensão de cotovelo e supinação (nervo radial)",
                "Sensibilidade dorsal do polegar e 1ª comissura digital",
                "ADM de ombro e cotovelo"
            ],
            "interv": [
                "AVALIAÇÃO IMEDIATA de nervo radial: extensão de punho e dedos",
                "Órtese de punho/mão (cock-up splint) se lesão de radial confirmada",
                "Mobilização pendular de ombro desde imobilização",
                "Exercícios de cotovelo: flexão/extensão dentro dos limites",
                "Mobilização de dedos e punho: segmentos distais"
            ]
        },
        {
            "name": "5.4.P9 — Fratura de CLAVÍCULA",
            "desc": "Moderado. Queda sobre ombro ou braço estendido (comum em jovens/esportes), dor intensa clavicular, deformidade, postura antálgica com ombro caído/anteriorizado, imobilização em '8' ou tipoia OU fixação cirúrgica",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Retorno a ADM de ombro completa em 3-6 semanas (conservador)",
                "Postura normal sem protração do ombro afetado",
                "Retorno à atividade esportiva em 12-16 semanas"
            ],
            "assess": [
                "Goniometria de ombro: elevação, RE, RI",
                "Dor à palpação da clavícula",
                "Postura: altura e anteriorização do ombro afetado",
                "Força de deltoides, manguito e trapézio"
            ],
            "interv": [
                "Pendular passivo de Codman nas primeiras 2-3 semanas",
                "Mobilização ativa-assistida após 3-4 semanas conforme protocolo",
                "Fortalecimento de manguito e escapulares na fase 2",
                "Retração escapular para correção postural",
                "Retorno à carga/esporte conforme consolidação radiológica"
            ]
        },
        {
            "name": "5.4.P10 — Fratura de PUNHO (Colles, Smith, estilóide radial)",
            "desc": "Grave. Queda sobre mão espalmada (FOOSH), deformidade em 'dorso de garfo' (Colles) ou palmar (Smith), imobilização gessada/tala OU fixação com placa/pinos, ALTO RISCO de rigidez de punho e dedos",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Extensão de punho ≥ 30° ao final do protocolo",
                "Flexão de punho ≥ 45°",
                "Prevenção de rigidez digital: dedos com ADM completa"
            ],
            "assess": [
                "Goniometria: flexão/extensão de punho, pronação/supinação",
                "ADM ativa e passiva dos dedos",
                "Edema: perimetria de punho e mão",
                "Sinais de SDRC: alodinia, mudança de cor/temperatura, sudorese excessiva"
            ],
            "interv": [
                "Exercícios de dedos 10x/h durante imobilização: punho livre para mobilizar",
                "Elevação constante do MS para controle de edema",
                "Mobilização precoce de punho após retirada do gesso",
                "Fortalecimento de preensão com putsifyin: 6 semanas pós-lesão",
                "Precauções SDRC: monitorizar cor, temperatura e dor"
            ]
        },
        {
            "name": "5.4.P11 — Fratura de ESCAFOIDE (osso do carpo)",
            "desc": "Grave. Queda sobre mão estendida, dor na tabaqueira anatômica (base do polegar), imobilização INCLUINDO POLEGAR por 8-12 semanas, ALTO RISCO de pseudoartrose por vascularização precária",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Consolidação óssea radiológica confirmada (8-12 semanas)",
                "ADM de punho e polegar preservados após imobilização",
                "Força de preensão e pinça recuperadas após liberação"
            ],
            "assess": [
                "Dor à palpação da tabaqueira anatômica",
                "Mobilidade de dedos 2-5 (livres do imobilizador)",
                "Edema de punho e mão",
                "Força de polegar após liberação: oponência, pinça"
            ],
            "interv": [
                "Mobilização dos dedos 2-5 constantemente durante imobilização",
                "Isometria do polegar dentro do gesso (contração leve)",
                "Mobilização de cotovelo e ombro para evitar rigidez proximal",
                "Mobilização agressiva de punho e polegar após liberação da imobilização",
                "Treino de pinça e preensão fina progressivo após consolidação"
            ]
        },
        {
            "name": "5.4.P12 — Fratura de MÃO (metacarpos, falanges)",
            "desc": "Grave. Trauma direto (soco, esmagamento, queda), dor intensa, deformidade/rotação digital, edema importante, imobilização com tala/órtese OU fixação cirúrgica (pinos/placas), ALTO RISCO de rigidez digital grave",
            "block": "🦾 5.4 — FRATURAS DE MEMBROS SUPERIORES",
            "goals": [
                "Prevenção de rigidez: mobilização dos dedos livres desde o 1° dia",
                "Flexão completa de todos os dedos em pós-imobilização",
                "Preensão funcional para AVDs em 6-12 semanas"
            ],
            "assess": [
                "ADM ativa e passiva de cada articulação digital: MCF, IFP, IFD",
                "Edema digital: medição com fita",
                "Rotação e desvio de dedos (deformidade rotacional)",
                "Alinhamento digital na flexão (todos os dedos apontam para escafoide)"
            ],
            "interv": [
                "Mobilização dos dedos livres: 10x/h abertura e fechamento",
                "Elevação constante para controle de edema",
                "Mobilização precoce dentro dos limites do protocolo cirúrgico",
                "Mobilização passiva e splinting após liberação",
                "Treino de preensão progressivo: cilíndrica → esférica → pinça"
            ]
        },
        {
            "name": "5.6.P1 — Fratura de COLUNA CERVICAL (estável sem déficit neurológico)",
            "desc": "Crítico. Trauma cervical, dor cervical intensa, espasmo muscular, imobilização com colar cervical rígido OU halo-colete OU fixação cirúrgica, RISCO de lesão medular tardia se instável",
            "block": "🦴 5.6 — FRATURAS DE COLUNA",
            "goals": [
                "Manutenção de alinhamento cervical em todas as atividades",
                "Mobilização segura sem comprometimento neurológico",
                "Retorno a ADM de cervical funcional após retirada do imobilizador"
            ],
            "assess": [
                "Tipo de fratura e dispositivo: colar duro, halo-colete",
                "Força e sensibilidade dos MMSS (raízes C5-T1)",
                "Dor cervical: EVA e localização",
                "Capacidade de deglutição (risco com colar e fraturas altas)"
            ],
            "interv": [
                "Nenhum movimento cervical ativo ou passivo durante imobilização",
                "Transferências com alinhamento cervical neutro",
                "Exercícios de MMSS e ombros liberados (isometria de deltoides, bíceps)",
                "Fortalecimento de cervical apenas após liberação médica",
                "Educação sobre cuidados com o colar e sinais de alerta"
            ]
        },
        {
            "name": "5.6.P2 — Fratura de COLUNA TORÁCICA (por compressão/estável)",
            "desc": "Grave. Queda de altura, trauma direto em tórax, osteoporose (idosos), dor torácica intensa (piora com movimento/respiração profunda), cifose aumentada, conservador OU fixação cirúrgica se instável",
            "block": "🦴 5.6 — FRATURAS DE COLUNA",
            "goals": [
                "Dor torácica controlada para respiração profunda sem proteção",
                "Uso correto e confortável de colete ortopédico quando prescrito",
                "Retorno a atividades básicas sem dor incapacitante em 6-12 semanas"
            ],
            "assess": [
                "Dor à palpação do processo espinhoso",
                "EVA ao movimento, respiração profunda e tosse",
                "Grau de cifose e deformidade",
                "Força e sensibilidade de MMII (nível torácico: T1-L1)"
            ],
            "interv": [
                "Posicionamento: evitar flexão de tronco (agrava compressão)",
                "Preferir extensão/posição neutra",
                "Fisioterapia respiratória: expansão pulmonar com suporte de tronco",
                "Fortalecimento de extensores da coluna (fase subaguda)",
                "Treino de transferências respeitando alinhamento torácico"
            ]
        },
        {
            "name": "5.6.P3 — Fratura de COLUNA LOMBAR (por compressão/explosão)",
            "desc": "Crítico. Queda sentada, acidente de trânsito, trauma direto, dor lombar intensa (piora ao sentar/movimentar), possível déficit neurológico (L2-S1), tratamento conservador OU fixação cirúrgica",
            "block": "🦴 5.6 — FRATURAS DE COLUNA",
            "goals": [
                "Mobilização segura com coluna em posição neutra",
                "Preservação de função neurológica de MMII",
                "Retorno a marcha funcional em 4-12 semanas conforme tratamento"
            ],
            "assess": [
                "Força e sensibilidade de MMII: L2 (quadríceps), L4 (tibial ant), L5 (EHL), S1 (tríceps sural)",
                "Função vesical e intestinal (conus medullaris)",
                "Tipo de fratura: compressão estável vs explosão instável",
                "Dor lombar: EVA e relação com posição"
            ],
            "interv": [
                "Transferências com alinhamento lombar neutro (log roll lombar)",
                "Uso correto de colete lombar prescrito",
                "Isometria de CORE leve sem flexão de coluna",
                "Fortalecimento de MMII conforme função neurológica",
                "Marcha progressiva com dispositivo assim que estabilidade garantida"
            ]
        },
        {
            "name": "5.7.P1 — TCE leve/moderado SEM indicação neurocirúrgica",
            "desc": "Crítico. Glasgow 9-15, cefaleia intensa, náusea/vômitos, tontura, confusão mental transitória, RISCO de deterioração neurológica (hematoma subdural tardio)",
            "block": "🚨 5.7 — OUTROS TRAUMAS",
            "goals": [
                "Monitorização de sinais de deterioração neurológica durante sessões",
                "Retorno progressivo a atividades conforme protocolo de concussão",
                "Prevenção de síndrome pós-concussional por retorno precoce"
            ],
            "assess": [
                "GCS a cada sessão",
                "Cefaleia: intensidade e fatores de piora",
                "Náuseas, vômitos, fotofobia, fonofobia",
                "Equilíbrio: Romberg, tandem gait, BESS (Balance Error Scoring System)"
            ],
            "interv": [
                "Repouso relativo nas primeiras 24-48h conforme protocolo",
                "Evitar esforço que piore cefaleia na fase aguda",
                "Protocolo de retorno gradual ao esforço: repouso → caminhada leve → exercício aeróbico",
                "Exercícios de equilíbrio progressivos após resolução de sintomas",
                "COMUNICAR imediatamente piora de GCS, cefaleia ou vômitos à equipe médica"
            ]
        },
        {
            "name": "5.7.P2 — Trauma ABDOMINAL fechado (contusão, laceração de órgãos) sob observação",
            "desc": "Crítico. Trauma abdominal, dor abdominal intensa, distensão, equimose, tratamento conservador (observação) OU pós-op de laparotomia",
            "block": "🚨 5.7 — OUTROS TRAUMAS",
            "goals": [
                "Mobilização precoce respeitando dor abdominal e restrições",
                "Retomada de respiração profunda e tosse eficaz",
                "Prevenção de complicações pulmonares pós-operatórias"
            ],
            "assess": [
                "Dor abdominal: localização, EVA, sinais de peritonite",
                "Distensão abdominal e ruídos hidroaéreos",
                "SpO₂ e FR: splinting abdominal reduz volumes",
                "Restrições da equipe cirúrgica: o que é permitido"
            ],
            "interv": [
                "Fisioterapia respiratória suave: expansão costal sem compressão abdominal",
                "Suporte de abdome durante tosse: travesseiro ou mão",
                "Deambulação precoce com suporte: reduz íleo e complicações",
                "Posicionamento semi-sentado para reduzir tensão abdominal",
                "Evitar ortostatismo brusco: hipotensão e dor pós-laparotomia"
            ]
        },
        {
            "name": "5.7.P3 — Lesão LIGAMENTAR grave de joelho/tornozelo (entorse grau II-III)",
            "desc": "Grave. Trauma em varo/valgo/rotação (esportes, queda, acidente), dor intensa articular, edema maciço, instabilidade articular, incapacidade de carga, imobilização OU reconstrução cirúrgica de ligamento",
            "block": "🚨 5.7 — OUTROS TRAUMAS",
            "goals": [
                "Controle de edema e dor para iniciar reabilitação",
                "Retorno a carga total funcional em 6-12 semanas (conservador) ou 9-12 meses (cirúrgico LCA)",
                "Propriocepção e estabilidade neuromuscular recuperadas antes do retorno esportivo"
            ],
            "assess": [
                "Teste de estabilidade: Lachman (LCA), gaveta posterior (LCP), varo/valgo, gaveta anterior de tornozelo",
                "Edema: perimetria articular",
                "Goniometria: flexão/extensão de joelho ou dorsiflexão/plantiflexão",
                "Força de quadríceps vs isquiossurais (limb symmetry index)"
            ],
            "interv": [
                "Fase aguda: PRICE (proteção, repouso relativo, gelo, compressão, elevação)",
                "Mobilização precoce de ADM: redução de edema e rigidez",
                "Fortalecimento progressivo: isometria → cadeia fechada → cadeia aberta",
                "Propriocepção: prancha de equilíbrio progressiva",
                "Retorno esportivo: protocolo com critérios funcionais (não apenas tempo)"
            ]
        },
        {
            "name": "5.7.P4 — Suspeita ou SÍNDROME COMPARTIMENTAL (emergência ortopédica)",
            "desc": "Crítico. Trauma de alta energia (fratura, esmagamento, reperfusão), dor DESPROPORCIONAL e progressiva, dor à extensão passiva dos dedos (sinal precoce), parestesia/hipoestesia, tensão palpável de compartimento, RISCO de necrose muscular irreversível",
            "block": "🚨 5.7 — OUTROS TRAUMAS",
            "goals": [
                "Diagnóstico e comunicação imediata à equipe médica",
                "ZERO atraso no encaminhamento para fasciotomia de emergência",
                "Monitorização ativa durante e após qualquer intervenção de fisioterapia"
            ],
            "assess": [
                "5 P's: Pain (desproporcional), Pressure (tensão), Paresthesia, Paralysis, Pallor",
                "Dor à extensão passiva dos dedos do pé/mão: SINAL MAIS PRECOCE",
                "Pulso distal e tempo de enchimento capilar",
                "Tensão do compartimento à palpação"
            ],
            "interv": [
                "PARAR IMEDIATAMENTE qualquer compressão/elevação do membro",
                "Manter membro ao nível do coração (não elevar)",
                "CHAMAR A EQUIPE MÉDICA DE EMERGÊNCIA imediatamente",
                "NÃO realizar fisioterapia até avaliação médica completa",
                "Documentar hora do início dos sintomas e comunicação à equipe"
            ]
        },
        {
            "name": "5.7.P5 — AMPUTAÇÃO TRAUMÁTICA de membro (aguda)",
            "desc": "Crítico. Perda traumática de segmento (dedos, mão, antebraço, braço, pé, perna, coxa) por trauma de alta energia, coto com curativo/penso, choque emocional severo, necessidade de reabilitação precoce",
            "block": "🚨 5.7 — OUTROS TRAUMAS",
            "goals": [
                "Coto cicatrizado e modelado para prótese em 4-8 semanas",
                "Mobilidade e força dos segmentos preservados",
                "Suporte psicológico integrado à reabilitação física"
            ],
            "assess": [
                "Estado do coto: cicatrização, edema, forma (cônica vs cilíndrica)",
                "Dor no coto e dor fantasma: localização, intensidade, caráter",
                "Força e ADM dos segmentos proximais preservados",
                "Estado emocional e psicológico: aceitação, depressão, ansiedade"
            ],
            "interv": [
                "Modelagem do coto: bandagem em 8 progressiva para forma cônica",
                "Dessensibilização progressiva do coto: toque, pressão, textura",
                "Fortalecimento dos segmentos proximais para controle de prótese futura",
                "Treino de AVDs e transferências com membro contralateral",
                "Suporte psicológico: luto pelo membro, adaptação, expectativas realistas"
            ]
        },
        {
            "name": "5.5.P1 — Dor pós-operatória limitante e proteção antálgica",
            "desc": "Grave. EVA ≥ 6 ou dor que impede respiração profunda/transferência, guarding, incapaz de ativar músculo",
            "block": "🔧 5.5 — PÓS-OPERATÓRIO ORTOPÉDICO",
            "goals": [
                "EVA ≤ 3 nas primeiras 24h pós-op com analgesia adequada",
                "Respiração profunda e tosse sem espasmo álgico",
                "Participação ativa na sessão de fisioterapia nas primeiras 48h"
            ],
            "assess": [
                "EVA em repouso e ao mobilizar: escala numérica e FACES",
                "Guarding: contração protetora ao movimento",
                "Analgesia atual: tipo, dose, via, horário do pico",
                "Impacto da dor na ventilação e mobilização"
            ],
            "interv": [
                "Coordenação com anestesia/médico para analgesia preventiva",
                "TENS analgésico na incisão e região dolorosa",
                "Posicionamento anti-álgico e órtese de conforto",
                "Técnicas suaves: mobilização passiva, exercício isométrico leve",
                "Ensinar suporte manual da incisão para tosse e transferência"
            ]
        },
        {
            "name": "5.5.P2 — Restrição de movimento específica da cirurgia (movimentos proibidos)",
            "desc": "Crítico. Ordem médica explícita (ex: quadril: flexão/adução/rotação em ATQ), risco de luxação, sangramento ou falha tecidual",
            "block": "🔧 5.5 — PÓS-OPERATÓRIO ORTOPÉDICO",
            "goals": [
                "Zero violações de movimentos proibidos em todas as sessões",
                "Todos os profissionais e família cientes das restrições",
                "Domínio do paciente sobre seus limites de movimento"
            ],
            "assess": [
                "Protocolo cirúrgico: movimento(s) proibido(s), ângulo, tempo de restrição",
                "Capacidade do paciente de entender e cumprir",
                "Presença de dispositivo preventor (ex: abductor pillow em ATQ)",
                "Verificação pré-sessão das restrições atualizadas"
            ],
            "interv": [
                "Checklist pré-sessão: restrições de movimento vigentes",
                "Treino do paciente com demonstração de movimentos proibidos",
                "Treino da equipe de enfermagem e família",
                "Exercícios somente dentro dos limites liberados",
                "Verificar com cirurgião antes de qualquer avanço de mobilidade"
            ]
        },
        {
            "name": "5.5.P3 — Restrição de carga (WBAT/PWB/TTWB/NWB) pós-op",
            "desc": "Crítico. Prescrição conforme: tipo de prótese, osteossíntese, qualidade óssea",
            "block": "🔧 5.5 — PÓS-OPERATÓRIO ORTOPÉDICO",
            "goals": [
                "Marcha com carga prescrita e dispositivo correto nas primeiras 24-48h pós-op",
                "Zero violações de carga durante internação",
                "Progressão de carga conforme protocolo e liberação médica"
            ],
            "assess": [
                "Classificação de carga prescrita e justificativa cirúrgica",
                "Dispositivo de marcha mais adequado ao nível de carga",
                "Capacidade física: força, equilíbrio, MMSS para uso do dispositivo",
                "Estado cognitivo para compreensão e cumprimento da restrição"
            ],
            "interv": [
                "Treino de marcha com carga prescrita D1 pós-op",
                "Educação clara: NWB (sem apoio), TTWB (toque leve), PWB (parcial), WBAT (conforme tolerância)",
                "Treino em escadas conforme carga e necessidade domiciliar",
                "Revisão diária da restrição com equipe cirúrgica",
                "Progressão de carga conforme protocolo e exames de imagem"
            ]
        },
        {
            "name": "5.5.P4 — Fraqueza/inibição muscular pós-op (quadríceps/glúteo principalmente)",
            "desc": "Moderado. Lag extensor de joelho, incapaz de estabilizar pelve em ortostatismo, falha no sit-to-stand",
            "block": "🔧 5.5 — PÓS-OPERATÓRIO ORTOPÉDICO",
            "goals": [
                "Quadríceps MRC ≥ 3 (vencer gravidade) nas primeiras 48h pós-op",
                "Glúteo médio ativo para controle pélvico em ortostatismo",
                "Sit-to-stand sem colapso em 48-72h pós-op"
            ],
            "assess": [
                "Lag extensor quantificado (diferença passiva-ativa em graus)",
                "MRC de quadríceps, glúteo médio, tibial anterior",
                "Teste de sit-to-stand: capacidade e grau de assistência",
                "EENM disponível para estimulação"
            ],
            "interv": [
                "Isometria de quadríceps D0 (na sala de recuperação se possível)",
                "SLR (straight leg raise) D1 pós-op",
                "EENM de quadríceps para superar inibição reflexa pós-articular",
                "Mini-squat assistido para recrutamento funcional precoce",
                "Glúteo médio: abdução em decúbito lateral → standing abduction"
            ]
        },
        {
            "name": "5.5.P5 — Rigidez/queda de ADM (risco de contraturas e perda funcional)",
            "desc": "Moderado. Amplitude insuficiente para: sentar com segurança, levantar, marcha com padrão adequado",
            "block": "🔧 5.5 — PÓS-OPERATÓRIO ORTOPÉDICO",
            "goals": [
                "Flexão de joelho ≥ 90° para sentar/subir escadas (ATJ)",
                "Dorsiflexão ≥ 10° para padrão de marcha adequado",
                "Manter ADM de quadril dentro das precauções pós-ATQ"
            ],
            "assess": [
                "Goniometria de flexão de joelho, dorsiflexão, flexão de quadril",
                "ADM ativa vs passiva (lag de extensão)",
                "Tempo de imobilização pré e pós-op",
                "Temperatura e edema articular local"
            ],
            "interv": [
                "Mobilização passiva contínua (CPM) se disponível para joelho",
                "Mobilização ativo-assistida progressiva desde D1",
                "Bicicleta estática (ergômetro) para ganho de ADM de joelho",
                "Alongamento progressivo de gastrocnêmio e plantar para dorsiflexão",
                "Uso de dispositivos de posicionamento para prevenir contraturas"
            ]
        },
        {
            "name": "5.5.P6 — Alto risco de trombose, atelectasia e complicações sistêmicas",
            "desc": "Grave. Cirurgia + imobilismo + dor + sedação, baixa mobilidade nas primeiras 48h",
            "block": "🔧 5.5 — PÓS-OPERATÓRIO ORTOPÉDICO",
            "goals": [
                "Deambulação precoce nas primeiras 24-48h pós-op quando clearance",
                "Exercícios de TVP realizados ≥ 3x/dia",
                "Ausculta pulmonar sem sinais de atelectasia"
            ],
            "assess": [
                "Sinais de TVP: Wells score, edema assimétrico, dor à palpação",
                "Ausculta pulmonar: MV simétrico, ausência de crepitações",
                "SpO₂ e FR em repouso e ao esforço",
                "Anticoagulação prescrita e profilaxia mecânica"
            ],
            "interv": [
                "Exercícios de bombeamento de tornozelo 10x/h acordado D0 pós-op",
                "Compressão pneumática intermitente quando em repouso (se disponível)",
                "Deambulação precoce D1 como mais efetivo antitrombótico",
                "Fisioterapia respiratória: incentivador, tosse, expansão costal",
                "Educação sobre sinais de alerta de TVP/TEP e importância de reportar"
            ]
        },
        {
            "name": "5.5.P7 — Risco de queda e de violar regras pós-operatórias",
            "desc": "Grave. Paciente impulsivo, ansioso ou com delirium, não entende as restrições, uso inadequado de dispositivo",
            "block": "🔧 5.5 — PÓS-OPERATÓRIO ORTOPÉDICO",
            "goals": [
                "Zero quedas durante internação pós-operatória",
                "Domínio correto do dispositivo de marcha",
                "Compreensão das restrições de movimento e carga"
            ],
            "assess": [
                "Estado cognitivo: CAM-ICU, MMSE simplificado",
                "Impulsividade: tenta levantar sem chamar, ansiedade",
                "Uso correto do andador/muleta",
                "Recursos de segurança: grades, alarme de cama"
            ],
            "interv": [
                "Ativar protocolo de prevenção de quedas: grades, cama baixa, iluminação",
                "Educação repetitiva sobre restrições a cada contato",
                "Alarme de cama para pacientes impulsivos",
                "Avaliação e manejo de delirium com equipe médica",
                "Supervisão próxima durante primeiras deambulações"
            ]
        },
        {
            "name": "5.6.P1 — Instabilidade clínica global (hemodinâmica e/ou respiratória)",
            "desc": "Crítico. PAM < 65 ou necessidade de droga vasoativa, SpO₂ instável/FiO₂ alta, lactato elevado, VM em parâmetros altos",
            "block": "🚨 5.6 — POLITRAUMA",
            "goals": [
                "Avaliar critérios de segurança para mobilização em cada turno",
                "Realizar mobilização passiva segura quando clinicamente estável",
                "Progredir mobilização conforme estabilidade clínica diária"
            ],
            "assess": [
                "PAM, necessidade de noradrenalina/adrenalina, dose atual",
                "SpO₂ e FiO₂, PEEP atual em ventilados",
                "Lactato sérico nas últimas 6h",
                "Score SOFA ou APACHE para gravidade"
            ],
            "interv": [
                "Aplicar critérios de segurança para mobilização: PAM ≥ 60-65, SpO₂ ≥ 88-90%, dose de NE ≤ 0.1 mcg/kg/min",
                "Mobilização passiva em leito quando critérios de segurança atendidos",
                "Mobilização ativa apenas com estabilidade confirmada pela equipe médica",
                "Comunicação diária com médico sobre elegibilidade para mobilização",
                "Documentar resposta hemodinâmica e respiratória a cada intervenção"
            ]
        },
        {
            "name": "5.6.P2 — Múltiplas restrições de movimento e carga",
            "desc": "Crítico. Mais de um foco de fratura, lesão de coluna/pelve, ordens médicas conflitantes ou restritivas",
            "block": "🚨 5.6 — POLITRAUMA",
            "goals": [
                "Mapa claro de restrições para toda a equipe",
                "Mobilização segura respeitando TODAS as restrições simultaneamente",
                "Identificar movimento funcional dentro das restrições combinadas"
            ],
            "assess": [
                "Inventário de todas as lesões e restrições de cada uma",
                "Priorização: restrição mais restritiva define o limite",
                "Conflitos entre restrições: ex: NWB em joelho mas estimular sentar",
                "Comunicação com cada especialidade envolvida"
            ],
            "interv": [
                "Reunião multidisciplinar para definir plano único e consistente",
                "Mapa escrito de restrições disponível no leito",
                "Exercícios para segmentos NÃO restritos: MMSS, respiratórios, cervical",
                "Mobilização passiva dos segmentos restritos dentro dos limites",
                "Revisão diária das restrições com cada equipe cirúrgica"
            ]
        },
        {
            "name": "5.6.P3 — Alto risco de hipoxemia, atelectasia e complicações pulmonares",
            "desc": "Crítico. Trauma torácico/contusão pulmonar, dor que impede expansão, imobilidade prolongada, secreção retida",
            "block": "🚨 5.6 — POLITRAUMA",
            "goals": [
                "SpO₂ ≥ 92% sem aumento progressivo de FiO₂",
                "Ausculta com MV bilateral",
                "Tosse eficaz ou higiene brônquica assistida efetiva"
            ],
            "assess": [
                "SpO₂, FiO₂, PaO₂/FiO₂",
                "Ausculta: hipoventilação, crepitações, roncos",
                "PCF ou capacidade de tosse",
                "RX/TC: atelectasia, consolidação, derrame"
            ],
            "interv": [
                "Fisioterapia respiratória: expansão, vibrocompressão, tosse assistida",
                "Decúbito lateral para drenagem do pulmão acometido",
                "CPAP/VNI para recrutamento alveolar",
                "Aspiração traqueal quando necessário",
                "Deambulação precoce quando hemodinamicamente estável"
            ]
        },
        {
            "name": "5.6.P4 — Rebaixamento do nível de consciência / TCE associado",
            "desc": "Crítico. Glasgow < 13, sedação, déficits neurológicos focais, incapacidade de colaborar com a terapia",
            "block": "🚨 5.6 — POLITRAUMA",
            "goals": [
                "Mobilização passiva segura preservando alinhamento espinhal",
                "Prevenção de complicações do imobilismo sem comprometer coluna",
                "Progressão de estimulação sensoriomotora conforme nível de consciência"
            ],
            "assess": [
                "GCS: olhos, motor, verbal — progressão ao longo do tempo",
                "CAM-ICU para delirium quando GCS > 8",
                "Função motora de MMSS e MMII por segmento",
                "Reflexos e tônus: presença de decorticação/descerebração"
            ],
            "interv": [
                "Mobilização passiva completa de todos os segmentos 2x/dia",
                "Posicionamento terapêutico: evitar padrão de espasticidade",
                "Estimulação sensorial multimodal: voz, toque, luz, objetos familiares",
                "Protocolo de despertar progressivo (integrar com equipe médica)",
                "Fisioterapia respiratória: higiene brônquica e expansão pulmonar"
            ]
        },
        {
            "name": "5.6.P5 — Dor intensa e resposta simpática exagerada",
            "desc": "Grave. EVA ≥ 7, taquicardia/hipertensão associada à dor, proteção antálgica global",
            "block": "🚨 5.6 — POLITRAUMA",
            "goals": [
                "EVA ≤ 4 com esquema analgésico multimodal",
                "FC e PA controladas durante sessões de fisioterapia",
                "Participação ativa na mobilização"
            ],
            "assess": [
                "EVA antes e durante intervenções",
                "FC, PA e SpO₂ como parâmetros de resposta à dor",
                "Eficácia do esquema analgésico atual",
                "Guarding global: proteção e espasmo generalizado"
            ],
            "interv": [
                "Solicitar analgesia multimodal adequada antes das sessões",
                "Posicionamento anti-álgico confortável como base",
                "Técnicas de relaxamento: respiração controlada, posicionamento",
                "TENS em focos dolorosos principais",
                "Técnicas suaves e mobilização passiva respeitando limiar de dor"
            ]
        },
        {
            "name": "5.6.P6 — Fraqueza global e risco extremo de perda funcional",
            "desc": "Crítico. Permanência em leito > 72h, VM/sedação/BNM, incapaz de rolar/sentar ou sustentar cabeça/tronco",
            "block": "🚨 5.6 — POLITRAUMA",
            "goals": [
                "Manutenção de ADM articular completa durante período de sedação",
                "Início de mobilização ativa assim que BNM suspenso",
                "MRC ≥ 3 em grupos musculares principais ao final da fase aguda"
            ],
            "assess": [
                "MRC-sum quando cooperativo",
                "Posição de reposo: contraturas instaladas?",
                "Tempo de imobilização total",
                "EENM disponível para manutenção de função em sedados"
            ],
            "interv": [
                "EENM de quadríceps, tibial anterior e deltoides em sedados",
                "Mobilização passiva completa 2x/dia: todas as articulações",
                "Posicionamento terapêutico anti-contratura: extensão de joelho, dorsiflexão, extensão de cotovelo",
                "Cicloergômetro passivo em leito quando disponível",
                "Despertar diário e exercício ativo precoce assim que sedação reduzida"
            ]
        },
        {
            "name": "5.6.P7 — Alto risco tromboembólico e complicações do imobilismo",
            "desc": "Crítico. Trauma + inflamação + imobilidade + cirurgias múltiplas",
            "block": "🚨 5.6 — POLITRAUMA",
            "goals": [
                "Zero eventos de TVP/TEP durante internação",
                "Exercícios de MMII realizados ≥ 3x/dia",
                "Deambulação precoce em < 72h quando clinicamente possível"
            ],
            "assess": [
                "Caprini score ou escala de Wells para TVP",
                "Edema de MMII, calor local, dor à dorsiflexão passiva",
                "Anticoagulação prescrita e profilaxia mecânica",
                "Doppler venoso quando indicado"
            ],
            "interv": [
                "Exercícios de bombeamento de tornozelo e panturrilha 10x/h",
                "Compressão pneumática intermitente bilateral quando em repouso",
                "Mobilização passiva de MMII 2-3x/dia",
                "Deambulação precoce assim que estabilidade clínica e cirúrgica permitirem",
                "Comunicar qualquer sinal de TVP/TEP imediatamente"
            ]
        },
        {
            "name": "5.6.P8 — Risco de queda, falha de síntese e eventos adversos durante mobilização",
            "desc": "Crítico. Múltiplos dispositivos, instabilidade postural, déficit cognitivo ou impulsividade",
            "block": "🚨 5.6 — POLITRAUMA",
            "goals": [
                "Zero quedas e zero falhas de síntese durante sessões",
                "Checklist de segurança realizado antes de toda mobilização",
                "Mobilização supervisionada por profissional adequado"
            ],
            "assess": [
                "Número de dispositivos: VM, drenos, linhas, fixadores",
                "Estado cognitivo e impulsividade",
                "Força e equilíbrio para estabilidade durante mobilização",
                "Risco de queda: escala de Morse ou similar"
            ],
            "interv": [
                "Checklist pré-mobilização: dispositivos organizados, linhas com folga, monitores conectados",
                "Mobilização com equipe mínima de 2 pessoas no politrauma",
                "Ativar protocolo de prevenção de quedas",
                "Nunca mobilizar sozinho paciente com múltiplos dispositivos",
                "Comunicar à equipe antes de toda mobilização complexa"
            ]
        }
    ]
  },
  {
    "id": "perioperative",
    "name": "Sistema Perioperatorio",
    "icon": "M11.42 15.17L4.277 12.936C3.486 12.7 3 11.94 3 11.11V4.89c0-.83.486-1.59 1.277-1.756l7.14-2.234a.75.75 0 01.477 1.423L4.5 6.11v4.78l6.398 2.034a.75.75 0 11-.476 1.424zM21 3a.75.75 0 00-1.5 0v2.25H18a.75.75 0 000 1.5h1.5v4.25H18a.75.75 0 000 1.5h1.5V21a.75.75 0 001.5 0v-2.25H21a.75.75 0 000-1.5h-1.5V7.5H21a.75.75 0 000-1.5h-1.5V3z",
    "color": "#34d399",
    "problems": [
      {
        "name": "6.0.P1 — Hipoventilacao e queda volumes pos-operatorios",
        "desc": "Grave. FR superficial, padrao curto, dor impedindo inspiracao, SpO2 cai",
        "assess": [],
        "interv": [
          "Avaliacao por sessao: SpO2, FR, padrao, dor EVA, ausculta, secrecao, tolerancia postural, linhas/drenos",
          "Reexpansao padrao ouro: inspiracoes profundas lentas+pausa 2-3s, expansao segmentar bases, espironetro incentivo",
          "Controlar dor EVA ≤4 durante terapia",
          "Estrategia tosse e limpeza: tosse protegida, huffing, ciclo ativo, tecnicas assistidas se PCF baixo",
          "Mobilizacao precoce: cabeceira→sedestacao leito→beira leito→poltrona→ortostatismo→marcha 3-5m→10-20m→corredor"
        ],
        "block": "6.0 — Base Transversal Perioperatorio",
        "goals": [
          "Restaurar padrao ventilatorio mais profundo",
          "Prevenir atelectasia basal"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Avaliacao",
              "Reexpansao",
              "Dor",
              "Tosse",
              "Mobilizacao"
            ]
          }
        ]
      },
      {
        "name": "6.0.P2 — Tosse ineficaz e risco retencao secrecao",
        "desc": "Grave. Tosse dolorosa ou fraca, PCF <270 ineficaz, <160 grave",
        "assess": [],
        "interv": [
          "Tecnicas tosse protegida e assistida conforme criterio"
        ],
        "block": "6.0 — Base Transversal Perioperatorio",
        "goals": [
          "Garantir tosse funcional ou alternativa eficaz"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Tosse protegida",
              "Assistida"
            ]
          }
        ]
      },
      {
        "name": "6.0.P3 — Atelectasia basal dependente / risco pneumonia",
        "desc": "Grave. ↓ MV bases, crepitações, imagem, SpO2/O2",
        "assess": [],
        "interv": [
          "Reexpansao dirigida às bases",
          "Mobilizacao precoce"
        ],
        "block": "6.0 — Base Transversal Perioperatorio",
        "goals": [
          "Prevenir atelectasia basal"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Reexpansao",
              "Mobilizacao"
            ]
          }
        ]
      },
      {
        "name": "6.0.P4 — Dor pos-operatoria limitante para respiracao e mobilizacao",
        "desc": "Grave. EVA ≥6 repouso ou ≥4 ao mobilizar",
        "assess": [],
        "interv": [
          "Gestao funcional dor integrada à mobilizacao"
        ],
        "block": "6.0 — Base Transversal Perioperatorio",
        "goals": [
          "Controlar dor EVA ≤4 durante terapia"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Gestao dor"
            ]
          }
        ]
      },
      {
        "name": "6.0.P5 — Intolerancia postural e instabilidade ao ortostatismo",
        "desc": "Moderado. Queda PA ao sentar/levantar, taquicardia, tontura, dessaturacao",
        "assess": [],
        "interv": [
          "Progressao postural monitorizada"
        ],
        "block": "6.0 — Base Transversal Perioperatorio",
        "goals": [
          "Tolerar mudancas posturais progressivas"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Progressao"
            ]
          }
        ]
      },
      {
        "name": "6.0.P6 — Alto risco tromboembolico por imobilismo",
        "desc": "Grave. Pos-op+baixa mobilidade+edema",
        "assess": [],
        "interv": [
          "Prevencao ativa: bomba panturrilha, mobilizacao precoce possivel, exercicios ativos leito, elevacao MMII quando indicado"
        ],
        "block": "6.0 — Base Transversal Perioperatorio",
        "goals": [
          "Prevenir TVP e complicacoes tromboembolicas"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Bomba",
              "Mobilizacao",
              "Exercicios"
            ]
          }
        ]
      },
      {
        "name": "6.0.P7 — Perda funcional acelerada (descondicionamento pos-op)",
        "desc": "Moderado. Dificuldade sentar/levantar, fraqueza global, medo",
        "assess": [],
        "interv": [
          "Mobilizacao precoce como tratamento",
          "PARADA: SpO2 <88-90% sustentada, hipotensao sintomatica/queda PA importante, dor EVA ≥7 ou piora subita, arritmia/sintomas importantes, sangramento ativo ou instabilidade"
        ],
        "block": "6.0 — Base Transversal Perioperatorio",
        "goals": [
          "Prevenir descondicionamento e perda funcional"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Mobilizacao precoce"
            ]
          }
        ]
      },
      {
        "name": "6.1.P1 — Hipoventilacao por dor abdominal (splinting)",
        "desc": "Grave. Respiracao superficial, incapacidade inspirar profundo",
        "assess": [],
        "interv": [
          "Respiração diafragmatica dirigida+expansao basal: mao/feedback tátil abdome lateral, inspiracoes lentas pausa, bases e expansao posterior",
          "Garantir tosse protegida eficaz sem panico da incisao",
          "Sentar fora leito e marcha curta se tolerar"
        ],
        "block": "6.1 — Pos-operatorio Abdominal",
        "goals": [
          "Ativar diafragma e bases pulmonares"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Diafragmatica",
              "Tosse protegida",
              "Mobilizacao"
            ]
          }
        ]
      },
      {
        "name": "6.1.P2 — Tosse ineficaz por dor/incisao",
        "desc": "Grave. Medo de tossir, secrecao retida",
        "assess": [],
        "interv": [
          "Tosse protegida/huffing: travesseiro na incisao, huffing antes tosse forte, fracionar huff→pausa→tosse"
        ],
        "block": "6.1 — Pos-operatorio Abdominal",
        "goals": [
          "Garantir tosse protegida e eficaz"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Tosse protegida",
              "Huffing"
            ]
          }
        ]
      },
      {
        "name": "6.1.P3 — Disfuncao diafragmatica pos-op (abdome alto)",
        "desc": "Moderado. Padrao apical, baixa excursao abdominal",
        "assess": [],
        "interv": [
          "Treino diafragmatico especifico",
          "Reducao padrao apical compensatorio"
        ],
        "block": "6.1 — Pos-operatorio Abdominal",
        "goals": [
          "Recuperar funcao diafragmatica"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino diafragmatico"
            ]
          }
        ]
      },
      {
        "name": "6.1.P4 — Intolerancia à mobilizacao por hipotensao, dor e nausea",
        "desc": "Moderado. Tontura ao sentar, instabilidade postural",
        "assess": [],
        "interv": [
          "Mobilizacao precoce com progressao real: sentar→poltrona→ortostatismo→marcha 3-5m→10-20m, meta passos/dia quando aplicavel"
        ],
        "block": "6.1 — Pos-operatorio Abdominal",
        "goals": [
          "Melhorar tolerancia postural"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao"
            ]
          }
        ]
      },
      {
        "name": "6.1.P5 — Risco ileo e perda funcional por imobilismo",
        "desc": "Moderado. Restricao leito, dor+sedacao",
        "assess": [],
        "interv": [
          "Transferencias com protecao abdominal: levantar sem alavancar abdome, log-roll para sair cama (laparotomia)",
          "Ventilometria e reavaliacao quando disponivel",
          "PARADA: dor incapacitante, nausea intensa, hipotensao sintomatica, dessaturacao sustentada"
        ],
        "block": "6.1 — Pos-operatorio Abdominal",
        "goals": [
          "Prevenir ileo e descondicionamento"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Transferencias protegidas"
            ]
          }
        ]
      },
      {
        "name": "6.2.P1 — Atelectasia e hipoventilacao segmentar/lobar",
        "desc": "Grave. RX/USG colapso, ↓ MV ausculta, SpO2 cai",
        "assess": [],
        "interv": [
          "Avaliacao por sessao: SpO2 repouso/esforco, FR, ausculta, dor, expansibilidade, secrecao, dreno",
          "Reexpansao direcionada: inspiracoes profundas+pausa 2-3s, expansao segmentar manual bases e hemitórax operado, espironetro, suspiros 10-15 rep/serie varias/dia",
          "Garantir tosse eficaz ou assistida, controlar dor",
          "Sentar fora leito, ortostatismo/marcha curta"
        ],
        "block": "6.2 — Pos-operatorio Cirurgia Toracica",
        "goals": [
          "Reexpandir pulmao operado"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Avaliacao",
              "Reexpansao",
              "Tosse",
              "Dor",
              "Mobilizacao"
            ]
          }
        ]
      },
      {
        "name": "6.2.P2 — Dor toracica limitante (incisao+dreno)",
        "desc": "Grave. EVA ≥6, respiracao curta, tosse inibida",
        "assess": [],
        "interv": [
          "Controle dor para permitir funcao: posicionamento, travesseiro contenção toracica durante tosse, coordenar analgesia antes fisio"
        ],
        "block": "6.2 — Pos-operatorio Cirurgia Toracica",
        "goals": [
          "Controlar dor para permitir funcao"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Dor"
            ]
          }
        ]
      },
      {
        "name": "6.2.P3 — Tosse ineficaz e retencao secrecao",
        "desc": "Grave. Roncos/estertores, PCF <270/<160",
        "assess": [],
        "interv": [
          "Tosse e higiene: huffing, tosse assistida manualmente, ciclo ativo, drenagem postural seletiva se tolerar",
          "Se PCF <160 ou falha: auxilio mecanico tosse se disponivel, VNI associada"
        ],
        "block": "6.2 — Pos-operatorio Cirurgia Toracica",
        "goals": [
          "Garantir tosse eficaz ou assistida"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Tecnicas",
              "Auxilio se grave"
            ]
          }
        ]
      },
      {
        "name": "6.2.P4 — Dreno toracico limitando mobilidade e padrao respiratorio",
        "desc": "Moderado. Medo movimentar, padrao assimetrico",
        "assess": [],
        "interv": [
          "Educacao seguranca com dreno",
          "Mobilizacao gradual com dreno protegido"
        ],
        "block": "6.2 — Pos-operatorio Cirurgia Toracica",
        "goals": [
          "Mobilizar com dreno de forma segura"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Educacao",
              "Mobilizacao"
            ]
          }
        ]
      },
      {
        "name": "6.2.P5 — Hipoxemia pos-resseccao pulmonar",
        "desc": "Grave. SpO2 <92% ar ambiente, O2 suplementar",
        "assess": [],
        "interv": [
          "Oxigenoterapia e suporte: ajustar O2 SpO2 alvo ≥92%",
          "Se hipoxemia persistente ou padrao ruim: considerar VNI suporte reexpansao"
        ],
        "block": "6.2 — Pos-operatorio Cirurgia Toracica",
        "goals": [
          "Melhorar oxigenacao"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "O2",
              "VNI se indicado"
            ]
          }
        ]
      },
      {
        "name": "6.2.P6 — Perda expansibilidade hemitórax operado",
        "desc": "Moderado. Assimetria ventilatoria, hipomobilidade costal",
        "assess": [],
        "interv": [
          "Treino diafragmatico e redistribuicao padrao: feedback manual abdome e bases, reduzir padrao apical"
        ],
        "block": "6.2 — Pos-operatorio Cirurgia Toracica",
        "goals": [
          "Recuperar simetria ventilatoria"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Diafragmatico"
            ]
          }
        ]
      },
      {
        "name": "6.2.P7 — Intolerancia ao esforco e mobilizacao precoce",
        "desc": "Moderado. Taquicardia/dessaturacao ao sentar, dispneia desproporcional",
        "assess": [],
        "interv": [
          "Mobilizacao precoce=tratamento respiratorio: sedestacao→poltrona→ortostatismo→marcha 3-5m→10-20m→corredor",
          "Marcha=uma das melhores tecnicas reexpansao",
          "PARADA: SpO2 <88-90% sustentada, dispneia intensa ou fadiga extrema, dor toracica subita diferente incisional, aumento debito aereo dreno, instabilidade hemodinamica"
        ],
        "block": "6.2 — Pos-operatorio Cirurgia Toracica",
        "goals": [
          "Melhorar tolerancia ao esforco"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Mobilizacao",
              "Marcha"
            ]
          }
        ]
      },
      {
        "name": "6.3.P1 — Atelectasia e hipoventilacao pos-CEC",
        "desc": "Grave. RX bases colapsadas, SpO2 cai sem O2",
        "assess": [],
        "interv": [
          "Checklist seguranca por sessao: FC, PA, SpO2, ritmo, dor, arritmia, esterno dor/estalo/instabilidade?",
          "Reexpansao: inspiracoes profundas lentas+pausa, expansao basal manual, espironetro, suspiros",
          "Garantir tosse protegida eficaz, sentar fora leito, ortostatismo com seguranca",
          "Controlar dor. Nao gerar instabilidade hemodinamica nem sobrecarga cardiaca"
        ],
        "block": "6.3 — Pos-operatorio Cirurgia Cardiaca",
        "goals": [
          "Reexpandir pulmoes, prevenir pneumonia"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Checklist",
              "Reexpansao",
              "Tosse",
              "Dor"
            ]
          }
        ]
      },
      {
        "name": "6.3.P2 — Dor esternal limitando respiracao, tosse e mobilidade",
        "desc": "Grave. EVA ≥6, tosse inibida",
        "assess": [],
        "interv": [
          "Gestao dor especifica para esterno"
        ],
        "block": "6.3 — Pos-operatorio Cirurgia Cardiaca",
        "goals": [
          "Controlar dor para respiracao profunda"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Dor"
            ]
          }
        ]
      },
      {
        "name": "6.3.P3 — Tosse ineficaz e retencao secrecao",
        "desc": "Grave. Roncos/estertores, PCF <270/<160",
        "assess": [],
        "interv": [
          "Tosse protegida: travesseiro/almofada contra esterno, huff antes tosse",
          "Se fraca: assistencia manual, ciclo ativo"
        ],
        "block": "6.3 — Pos-operatorio Cirurgia Cardiaca",
        "goals": [
          "Garantir tosse protegida e eficaz"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Tosse protegida"
            ]
          }
        ]
      },
      {
        "name": "6.3.P4 — Instabilidade hemodinamica ao esforco inicial",
        "desc": "Critico. Queda PA ao sentar/levantar, taquicardia excessiva, arritmias",
        "assess": [],
        "interv": [
          "Mobilizacao precoce com monitoramento: sentar leito→poltrona→ortostatismo→marcha 3-5m→progressao diaria corredor",
          "Durante: monitorar FC, PA, SpO2, sintomas, Borg, sinais fadiga cardiaca",
          "O2/suporte: SpO2 ≥92%, VNI se hipoxemia persistente ou fadiga respiratoria"
        ],
        "block": "6.3 — Pos-operatorio Cirurgia Cardiaca",
        "goals": [
          "Mobilizar sem gerar instabilidade hemodinamica"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Monitoramento",
              "Progressao"
            ]
          }
        ]
      },
      {
        "name": "6.3.P5 — Risco deiscencia esternal",
        "desc": "Critico. Dor, estalos, instabilidade ao mover MMSS/tronco",
        "assess": [],
        "interv": [
          "Educacao protecao esternal: nao empurrar com bracos para levantar, nao puxar grades/corrimãos, nao abrir bracos abducao forçada, usar mais MMII e tronco neutro, tossir sempre protegido"
        ],
        "block": "6.3 — Pos-operatorio Cirurgia Cardiaca",
        "goals": [
          "Consolidar protecao esternal automatica"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Educacao"
            ]
          }
        ]
      },
      {
        "name": "6.3.P6 — Intolerancia ao exercicio e descondicionamento precoce",
        "desc": "Moderado. Fadiga precoce, dispneia minimos esforcos",
        "assess": [],
        "interv": [
          "Prescricao intensidade seguranca cardiaca: Borg 2-4",
          "Evitar Valsalva, contracoes isometricas sustentadas intensas, picos FC nao planejados",
          "PARADA: dor toracica tipica, queda PA importante, arritmia sustentada, dispneia intensa ou tontura, SpO2 <88-90% sustentada, sinais instabilidade esternal"
        ],
        "block": "6.3 — Pos-operatorio Cirurgia Cardiaca",
        "goals": [
          "Melhorar tolerancia sem arritmia/hipotensao"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Borg 2-4",
              "Criterios parada"
            ]
          }
        ]
      },
      {
        "name": "6.4.P1 — Instabilidade hemodinamica pos-operatoria",
        "desc": "Critico. PAM limitrofe/DVA, hipotensao ao sentar/levantar",
        "assess": [],
        "interv": [
          "Checklist pre-mobilizacao obrigatorio: PA, FC, SpO2, sintomas, sitio cirurgico sangramento? hematoma? dor?, perfusao periferica, regra carga/movimento, drenos/curativos protegidos"
        ],
        "block": "6.4 — Pos-operatorio Cirurgia Vascular",
        "goals": [
          "Mobilizar com seguranca hemodinamica"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Checklist"
            ]
          }
        ]
      },
      {
        "name": "6.4.P2 — Risco sangramento ou complicacao sitio cirurgico",
        "desc": "Grave. Cirurgia recente, drenos ativos, hematoma/edema",
        "assess": [],
        "interv": [
          "Protecao vascular: evitar compressao direta local operado, dobras/extensoes excessivas sobre anastomose, posicionar membro, observar isquemia durante e apos"
        ],
        "block": "6.4 — Pos-operatorio Cirurgia Vascular",
        "goals": [
          "Proteger sitio cirurgico e anastomose"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Protecao"
            ]
          }
        ]
      },
      {
        "name": "6.4.P3 — Perfusao periferica limitrofe membro operado",
        "desc": "Critico. Extremidade fria/palida/cianotica, pulsos diminuidos",
        "assess": [],
        "interv": [
          "Monitorizacao continua perfusao",
          "Posicionamento adequado membro"
        ],
        "block": "6.4 — Pos-operatorio Cirurgia Vascular",
        "goals": [
          "Manter boa perfusao periferica"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Monitorizacao",
              "Posicionamento"
            ]
          }
        ]
      },
      {
        "name": "6.4.P4 — Dor e protecao antalgica limitando mobilizacao",
        "desc": "Grave. EVA ≥6, evita mover ou apoiar",
        "assess": [],
        "interv": [
          "Gestao dor especifica"
        ],
        "block": "6.4 — Pos-operatorio Cirurgia Vascular",
        "goals": [
          "Controlar dor para permitir mobilizacao"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Dor"
            ]
          }
        ]
      },
      {
        "name": "6.4.P5 — Restricao carga ou movimento (pos-amputacoes/revascularizacoes)",
        "desc": "Grave. Ordem medica, risco falha sutura/anastomose",
        "assess": [],
        "interv": [
          "Mobilizacao precoce progressao cautelosa: cabeceira→sedestacao→poltrona→ortostatismo→marcha curta→progressao diaria",
          "Sempre monitorando PA, FC, tontura/dor/isquemia",
          "Treino transferencias e marcha adaptada: muitas vezes andador, descarga parcial ou protecao total"
        ],
        "block": "6.4 — Pos-operatorio Cirurgia Vascular",
        "goals": [
          "Manter funcao membro operado dentro restricoes"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao",
              "Transferencias",
              "Marcha"
            ]
          }
        ]
      },
      {
        "name": "6.4.P6 — Alto risco tromboembolico e complicacoes pulmonares",
        "desc": "Grave. Cirurgia vascular+imobilismo+doenca base",
        "assess": [],
        "interv": [
          "Prevencao ativa: bomba panturrilha, exercicios ativos leito, mobilizacao precoce, elevacao membro se indicado"
        ],
        "block": "6.4 — Pos-operatorio Cirurgia Vascular",
        "goals": [
          "Prevenir atelectasia, trombose, perda funcional"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Bomba",
              "Mobilizacao"
            ]
          }
        ]
      },
      {
        "name": "6.4.P7 — Perda funcional importante (pos-amputacoes)",
        "desc": "Grave. Incapaz transferir/ortostatismo, desequilibrio, medo",
        "assess": [],
        "interv": [
          "Caso amputacoes: dor fantasma, desequilibrio severo, perda referencia corporal",
          "Planejamento: posicionamento coto, treino rolar/sentar/transferir, fortalecer MMSS/tronco/membro remanescente, preparar ortostatismo e reabilitacao protetica"
        ],
        "block": "6.4 — Pos-operatorio Cirurgia Vascular",
        "goals": [
          "Garantir transferencias seguras"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Posicionamento",
              "Treino",
              "Fortalecimento"
            ]
          },
          {
            "timeframe": "Ate alta",
            "interv": [
              "Plano continuidade"
            ]
          }
        ]
      },
      {
        "name": "6.5.P1 — Rebaixamento nivel consciencia / flutuacao neurologica",
        "desc": "Critico. Glasgow <15, sonolencia, flutuacoes",
        "assess": [],
        "interv": [
          "Checklist neurologico pre-sessao: consciencia Glasgow/comando, pupilas/sinais piora, cefaleia/nausea/vomitos, PA perfusao cerebral, dreno ventricular? PIC? colar/colete?",
          "Posicionamento terapeutico: cabeceira 30°, cabeca alinhada, sem rotacao/hiperflexao, evitar compressao jugular"
        ],
        "block": "6.5 — Pos-operatorio Neurocirurgia",
        "goals": [
          "Proteger cerebro: nao aumentar PIC"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Checklist",
              "Posicionamento"
            ]
          }
        ]
      },
      {
        "name": "6.5.P2 — Deficit motor focal ou global",
        "desc": "Grave. Assimetria forca, incapaz sustentar tronco",
        "assess": [],
        "interv": [
          "Posicionamento adequado, ventilacao e tosse eficazes",
          "Iniciar mobilizacao extremamente segura e gradual",
          "Estimulacao motora e postural basica",
          "Mobilizacao neurologica em camadas: decubito→sedestacao leito→beira leito→prancha→ortostatismo→primeiros passos",
          "Treino controle tronco, treino motor membros ativo-assistido→ativo→resistido leve"
        ],
        "block": "6.5 — Pos-operatorio Neurocirurgia",
        "goals": [
          "Garantir posicionamento, ventilacao, tosse"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Posicionamento",
              "Mobilizacao segura"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Camadas",
              "Controle tronco",
              "Motor"
            ]
          }
        ]
      },
      {
        "name": "6.5.P3 — Alteracao controle postural e risco extremo queda",
        "desc": "Critico. Instabilidade sedestacao/ortostatismo, pusher, ataxia",
        "assess": [],
        "interv": [
          "Progredir sedestacao→ortostatismo→primeiros passos se permitido",
          "Reduzir risco aspiracao, quedas, perda funcional grave"
        ],
        "block": "6.5 — Pos-operatorio Neurocirurgia",
        "goals": [
          "Progredir com seguranca"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao"
            ]
          }
        ]
      },
      {
        "name": "6.5.P4 — Risco aumento pressao intracraniana (PIC)",
        "desc": "Critico. Edema cerebral, hidrocefalia, drenos",
        "assess": [],
        "interv": [
          "Posicionamento rigoroso",
          "Evitar manobras que aumentem PIC",
          "PARADA/ALERTA: piora consciencia, cefaleia subita intensa, nausea/vomitos jato, queda forca, alteracao pupilar, PA muito elevada ou baixa"
        ],
        "block": "6.5 — Pos-operatorio Neurocirurgia",
        "goals": [
          "Nao aumentar PIC"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Posicionamento",
              "Criterios parada"
            ]
          }
        ]
      },
      {
        "name": "6.5.P5 — Restricao mobilidade por tipo cirurgia (principalmente coluna)",
        "desc": "Critico. Nao flexionar/rotacionar, colar/colete",
        "assess": [],
        "interv": [
          "Caso coluna: rolar em bloco, sentar em bloco, levantar em bloco, colar/colete, restricoes flexao/rotacao/carga"
        ],
        "block": "6.5 — Pos-operatorio Neurocirurgia",
        "goals": [
          "Mobilizar respeitando restricoes coluna"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Tecnica bloco"
            ]
          }
        ]
      },
      {
        "name": "6.5.P6 — Deficit respiratorio associado",
        "desc": "Grave. Rebaixamento consciencia, tosse fraca, SpO2 instavel",
        "assess": [],
        "interv": [
          "Seguranca respiratoria: se tosse fraca ou rebaixamento→priorizar posicionamento, higiene bronquica, VNI/CNAF se indicado"
        ],
        "block": "6.5 — Pos-operatorio Neurocirurgia",
        "goals": [
          "Garantir ventilacao e tosse eficazes"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Respiratoria"
            ]
          }
        ]
      },
      {
        "name": "6.5.P7 — Alteracao cognitiva/comportamental interferindo reabilitacao",
        "desc": "Moderado. Agitacao, confusao, desinibicao",
        "assess": [],
        "interv": [
          "Estrategias comportamentais e cognitivas"
        ],
        "block": "6.5 — Pos-operatorio Neurocirurgia",
        "goals": [
          "Melhorar adesao à reabilitacao"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Estrategias"
            ]
          },
          {
            "timeframe": "Ate alta",
            "interv": [
              "Plano reabilitacao neurologica",
              "Orientações seguranca"
            ]
          }
        ]
      },
      {
        "name": "6.6.P1 — Dependencia ventilacao mecanica / falha desmame",
        "desc": "Critico. VM prolongada, SBT falho, VIDD, PImax baixo",
        "assess": [],
        "interv": [
          "Triagem seguranca antes de tocar: respiratorio, hemodinamico, neurologico, dispositivos",
          "Estrategia respiratoria UTI: VM protetora Vt/PBW, ΔP Pplato, PEEP, assincronias; higiene bronquica por criterio",
          "Garantir higiene eficaz, minimizar sedacao/imobilismo",
          "Mobilizacao minima segura mesmo em VM",
          "Desmame por fisio quando estabiliza: avaliar padrao, reserva, PImax, tosse PCF, consciencia"
        ],
        "block": "6.6 — Pos-operatorio Complexo UTI",
        "goals": [
          "Proteger pulmao, manter ventilacao segura"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Triagem",
              "VM protetora",
              "Higiene",
              "Mobilizacao"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Desmame"
            ]
          }
        ]
      },
      {
        "name": "6.6.P2 — Instabilidade hemodinamica com baixa tolerancia mobilizacao",
        "desc": "Critico. PAM <65 ou DVA, queda PA ao elevar cabeceira/sentar",
        "assess": [],
        "interv": [
          "Progressao muito cautelosa",
          "Monitorizacao intensiva"
        ],
        "block": "6.6 — Pos-operatorio Complexo UTI",
        "goals": [
          "Mobilizar com seguranca hemodinamica"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Progressao",
              "Monitorizacao"
            ]
          }
        ]
      },
      {
        "name": "6.6.P3 — Hipoxemia / complacencia baixa / risco VILI",
        "desc": "Critico. FiO2 alta, PEEP elevada, PaO2/FiO2 reduzida",
        "assess": [],
        "interv": [
          "VM protetora rigorosa",
          "Otimizacao PEEP"
        ],
        "block": "6.6 — Pos-operatorio Complexo UTI",
        "goals": [
          "Proteger pulmao"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "VM protetora",
              "PEEP"
            ]
          }
        ]
      },
      {
        "name": "6.6.P4 — Secrecao abundante e incapacidade clearance",
        "desc": "Grave. Aspiracao frequente, tosse fraca ou sedacao",
        "assess": [],
        "interv": [
          "Higiene bronquica baseada criterio clinico"
        ],
        "block": "6.6 — Pos-operatorio Complexo UTI",
        "goals": [
          "Garantir higiene bronquica eficaz"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Higiene"
            ]
          }
        ]
      },
      {
        "name": "6.6.P5 — Sedacao profunda, delirium e incapacidade participacao",
        "desc": "Grave. RASS -3 a -5 prolongado, delirium",
        "assess": [],
        "interv": [
          "Coordenacao com equipe reducao sedacao",
          "Janelas de despertar"
        ],
        "block": "6.6 — Pos-operatorio Complexo UTI",
        "goals": [
          "Minimizar efeitos sedacao"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Coordenacao",
              "Janelas"
            ]
          }
        ]
      },
      {
        "name": "6.6.P6 — Fraqueza adquirida UTI (ICU-AW) e perda funcional severa",
        "desc": "Critico. MRC <48, incapaz sustentar tronco",
        "assess": [],
        "interv": [
          "Mobilizacao precoce em camadas: 0 posicionamento/mudanca decubito/passiva/prevencao contraturas; 1 cabeceira 30-60° sedestacao leito ativo-assistido cicloergometro; 2 beira leito treino tronco sit-to-stand; 3 prancha ortostatismo marcha estacionaria; 4 marcha 3-5m→10-20m→corredor",
          "Forca e funcao: reavaliar MRC meta ≥48, sedestacao, STS nivel assistencia, resistencia progressiva quando seguro, tarefas funcionais"
        ],
        "block": "6.6 — Pos-operatorio Complexo UTI",
        "goals": [
          "Evitar deterioracao adicional"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Camadas 0-2"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Camadas 3-4",
              "Forca funcao"
            ]
          }
        ]
      },
      {
        "name": "6.6.P7 — Dor, dispositivos e barreiras mecanicas mobilizacao",
        "desc": "Moderado. Muitos cateteres, drenos, medo equipe/paciente",
        "assess": [],
        "interv": [
          "Manejo dispositivos: organizar linhas antes, plano quem segura o que, checar TQT/TOT drenos curativos, reduzir medo com rotina padronizada"
        ],
        "block": "6.6 — Pos-operatorio Complexo UTI",
        "goals": [
          "Viabilizar mobilizacao apesar dispositivos"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Organizacao",
              "Rotina"
            ]
          }
        ]
      },
      {
        "name": "6.6.P8 — Risco tromboembolico, ulceras e complicacoes imobilismo",
        "desc": "Grave. Leito prolongado, edema, hipoperfusao",
        "assess": [],
        "interv": [
          "Mobilizacao precoce como estrategia preventiva maxima",
          "PARADA UTI: queda PAM significativa ou sintomas, dessaturacao sustentada, taquiarritmia sustentada, aumento trabalho respiratorio, dor intensa ou agitacao perigosa, intercorrencia dispositivo"
        ],
        "block": "6.6 — Pos-operatorio Complexo UTI",
        "goals": [
          "Prevenir complicacoes imobilismo"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Mobilizacao precoce"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "infectionsSepsis",
    "name": "Sistema Infeccoes/Sepse",
    "icon": "M15.362 5.214A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751H10.5",
    "color": "#f97316",
    "problems": [
      {
        "name": "7.1.P1 — Hipoperfusao sistemica e intolerancia extrema ao esforco",
        "desc": "Critico. PAM < 65 ou uso de DVA, lactato elevado, extremidades frias",
        "assess": [],
        "interv": [
          "REGRA: NUNCA mobilizar guiado por vontade; guiado por PERFUSAO",
          "Checklist: PAM, lactato, DVA, SpO2, sintomas",
          "Mobilizacao por camadas: Instavel=só posicionamento+passiva+isometricos (Camada 0)",
          "Parcialmente estavel=sedestacao no leito (Camada 1)",
          "Estavel=beira-leito→poltrona (Camada 2)",
          "Preservacao muscular: isometricos globais, ativo-assistidos, EENM",
          "PARADA: queda PAM >10-20%, dessaturacao, taquicardia, tontura, palidez"
        ],
        "block": "7.1 — Sepse / Choque Septico",
        "goals": [
          "Nao piorar perfusao",
          "Iniciar mobilizacao minima segura"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Mobilizacao por camadas conforme estabilidade",
              "Preservacao muscular prioritária"
            ]
          }
        ]
      },
      {
        "name": "7.1.P2 — Insuficiencia respiratoria associada",
        "desc": "Critico. SpO2 <92%, FR >30, PaO2/FiO2 reduzido, VM/VNI/CNAF",
        "assess": [],
        "interv": [
          "Se VM: manter VM protetora, evitar ΔP e Pplato elevados",
          "Posicionamento: cabeceira 30°, decubitos alternados",
          "Se acordado: exercicios respiratorios leves, sem fadigar"
        ],
        "block": "7.1 — Sepse / Choque Septico",
        "goals": [
          "Garantir oxigenacao e ventilacao adequadas"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "VM protetora",
              "Posicionamento estrategico"
            ]
          }
        ]
      },
      {
        "name": "7.1.P3 — Rebaixamento do nivel de consciencia / encefalopatia septica",
        "desc": "Critico. Delirium, confusao, Glasgow flutuante",
        "assess": [],
        "interv": [
          "Estimulos cognitivos e motores",
          "Mobilizacao como estimulo neurologico"
        ],
        "block": "7.1 — Sepse / Choque Septico",
        "goals": [
          "Recuperar nivel minimo de interacao e comando"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Estimulos graduais",
              "Reducao de sedacao quando seguro"
            ]
          }
        ]
      },
      {
        "name": "7.1.P4 — Catabolismo muscular acelerado e perda de forca precoce",
        "desc": "Critico. Queda rapida de forca, MRC <48",
        "assess": [],
        "interv": [
          "Preservacao muscular prioritária (micro-sessoes multiplas/dia)",
          "Fortalecimento progressivo quando estavel"
        ],
        "block": "7.1 — Sepse / Choque Septico",
        "goals": [
          "Preservar massa e ativacao muscular"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Isometricos, ativo-assistidos, EENM"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Fortalecimento progressivo"
            ]
          }
        ]
      },
      {
        "name": "7.1.P5 — Risco tromboembolico e complicacoes do imobilismo",
        "desc": "Grave. Inflamacao+repouso, edema, VM, sedacao, DVA",
        "assess": [],
        "interv": [
          "Mobilizacao minima segura",
          "Mudancas de decubito frequentes"
        ],
        "block": "7.1 — Sepse / Choque Septico",
        "goals": [
          "Evitar colapso pulmonar e rigidez articular"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Mobilizacao minima",
              "Mudanca de decubito"
            ]
          }
        ]
      },
      {
        "name": "7.2.P1 — Hipoxemia grave",
        "desc": "Critico. PaO2/FiO2 <200, FiO2 >60%",
        "assess": [],
        "interv": [
          "VM PROTETORA: Vt protetor por PBW, Pplato, ΔP",
          "Ajustar PEEP por oxigenacao, mecanica, recrutabilidade",
          "Posicionamento: prona quando indicado, laterais, cabeceira"
        ],
        "block": "7.2 — Sepse + SDRA / Insuf. Respiratoria Grave",
        "goals": [
          "Manter oxigenacao com minima lesao pulmonar"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "VM protetora",
              "PEEP otimizada",
              "Posicionamento"
            ]
          }
        ]
      },
      {
        "name": "7.2.P2 — Shunt pulmonar e complacencia baixa",
        "desc": "Critico. Complacencia <30 mL/cmH2O, shunt refratario",
        "assess": [],
        "interv": [
          "Ajuste fino de PEEP",
          "Posicionamento terapeutico"
        ],
        "block": "7.2 — Sepse + SDRA / Insuf. Respiratoria Grave",
        "goals": [
          "Recrutar sem hiperinsuflar"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "PEEP monitorizada",
              "Posicionamento estrategico"
            ]
          }
        ]
      },
      {
        "name": "7.2.P3 — Dependencia de VM/VNI/CNAF",
        "desc": "Critico. Incapaz de manter oxigenacao sem suporte",
        "assess": [],
        "interv": [
          "Preservacao de funcao diafragmatica (prevenir VIDD)",
          "Desmame gradual de parametros"
        ],
        "block": "7.2 — Sepse + SDRA / Insuf. Respiratoria Grave",
        "goals": [
          "Nao perder musculatura respiratoria"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Preservar atividade diafragmatica"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Desmame gradual"
            ]
          }
        ]
      },
      {
        "name": "7.2.P4 — Alto risco de VIDD",
        "desc": "Grave. VM prolongada, sedacao profunda",
        "assess": [],
        "interv": [
          "Minimizar sedacao quando possivel",
          "Preservar atividade diafragmatica",
          "Desmame: avaliar padrao, forca PImax, tosse PCF, consciencia"
        ],
        "block": "7.2 — Sepse + SDRA / Insuf. Respiratoria Grave",
        "goals": [
          "Nao perder completamente musculatura respiratoria"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Minimizar sedacao",
              "Preservar diafragma"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Avaliar desmame",
              "Mobilizacao precoce"
            ]
          }
        ]
      },
      {
        "name": "7.2.P5 — Secrecao e necessidade de higiene bronquica",
        "desc": "Grave. Secrecao abundante, atelectasias recorrentes",
        "assess": [],
        "interv": [
          "Higiene bronquica so se houver secrecao, criteriosa",
          "Evitar fisioterapia agressiva"
        ],
        "block": "7.2 — Sepse + SDRA / Insuf. Respiratoria Grave",
        "goals": [
          "Manter vias aereas pervias sem lesao adicional"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Higiene por criterio clinico"
            ]
          }
        ]
      },
      {
        "name": "7.2.P6 — Intolerancia à mobilizacao por reserva respiratoria minima",
        "desc": "Grave. Dessaturacao ao minimo movimento, taquipneia, fadiga",
        "assess": [],
        "interv": [
          "Progressao muito gradual de mobilizacao",
          "Mobilizacao como parte do tratamento respiratorio"
        ],
        "block": "7.2 — Sepse + SDRA / Insuf. Respiratoria Grave",
        "goals": [
          "Melhorar tolerancia à mobilizacao"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao cautelosa",
              "Integracao respiratoria"
            ]
          }
        ]
      },
      {
        "name": "7.3.P1 — Miocardiopatia septica e baixo debito",
        "desc": "Critico. FE reduzida, inotropicos, lactato persistente",
        "assess": [],
        "interv": [
          "Nao roubar debito cardiaco",
          "Mobilizar longe de dialise quando possivel",
          "Sessoes curtas, frequentes",
          "Evitar ortostatismo precoce sem reserva",
          "Monitorizacao hemodinamica continua"
        ],
        "block": "7.3 — Sepse com Disfuncao Cardiaca e/ou Renal",
        "goals": [
          "Nao provocar hipotensao"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Mobilizacao por camadas",
              "Monitorizacao continua"
            ]
          }
        ]
      },
      {
        "name": "7.3.P2 — Dependencia de dialise",
        "desc": "Grave. Hemodialise ou diálise peritoneal, anuria/oliguria",
        "assess": [],
        "interv": [
          "Mobilizar longe de dialise sempre que possivel",
          "Coordenar com nefrologia"
        ],
        "block": "7.3 — Sepse com Disfuncao Cardiaca e/ou Renal",
        "goals": [
          "Mobilizar sem interferir com procedimento dialitico"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Timing em relacao à dialise"
            ]
          }
        ]
      },
      {
        "name": "7.3.P3 — Variacoes abruptas de volume e balanco hidrico",
        "desc": "Grave. Sobrecarga ou hipovolemia",
        "assess": [],
        "interv": [
          "Avaliar volemia antes de mobilizar",
          "Adaptar intensidade conforme estado volêmico"
        ],
        "block": "7.3 — Sepse com Disfuncao Cardiaca e/ou Renal",
        "goals": [
          "Nao provocar hipotensao"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Avaliacao pre-sessao",
              "Dosagem individualizada"
            ]
          }
        ]
      },
      {
        "name": "7.3.P4 — Intolerancia extrema ao ortostatismo",
        "desc": "Grave. Queda PA >20 mmHg ao sentar, sincope, tontura",
        "assess": [],
        "interv": [
          "Progressao muito cautelosa de postura",
          "Prancha ortostatica quando disponivel"
        ],
        "block": "7.3 — Sepse com Disfuncao Cardiaca e/ou Renal",
        "goals": [
          "Manter alguma verticalizacao progressiva"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao gradual",
              "Prancha ortostatica"
            ]
          }
        ]
      },
      {
        "name": "7.3.P5 — Arritmias e instabilidade eletrica",
        "desc": "Critico. Arritmias frequentes, risco de parada",
        "assess": [],
        "interv": [
          "Monitorizacao cardiaca durante sessao",
          "Interromper ao primeiro sinal de arritmia sustentada"
        ],
        "block": "7.3 — Sepse com Disfuncao Cardiaca e/ou Renal",
        "goals": [
          "Preservar funcao minima sem desencadear arritmia"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Monitorizacao obrigatoria",
              "Criterios de parada"
            ]
          }
        ]
      },
      {
        "name": "7.4.P1 — Delirium hiperativo ou hipoativo",
        "desc": "Grave. CAM-ICU positivo, agitacao ou letargia extrema",
        "assess": [],
        "interv": [
          "Posicionamento terapeutico: mudancas de decubito, estimulos",
          "Estimulos motores simples: passiva, ativo-assistida",
          "Sedestacao assistida precoce",
          "Treino de controle de tronco"
        ],
        "block": "7.4 — Sepse com Disfuncao Neurologica",
        "goals": [
          "Melhorar nivel de alerta",
          "Preservar padrao motor basico"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Estimulos sensoriais e motores",
              "Sedestacao precoce"
            ]
          }
        ]
      },
      {
        "name": "7.4.P2 — Encefalopatia septica",
        "desc": "Critico. Rebaixamento consciencia, Glasgow <13",
        "assess": [],
        "interv": [
          "Estimulos cognitivos e motores graduais",
          "Reducao de sedacao quando seguro (com equipe)"
        ],
        "block": "7.4 — Sepse com Disfuncao Neurologica",
        "goals": [
          "Melhorar nivel de alerta"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Estimulos multiplos/dia",
              "Colaboracao com equipe"
            ]
          }
        ]
      },
      {
        "name": "7.4.P3 — Flutuacao cognitiva importante",
        "desc": "Moderado. Periodos de lucidez alternados com confusao",
        "assess": [],
        "interv": [
          "Aproveitar janelas de melhor consciencia para treino"
        ],
        "block": "7.4 — Sepse com Disfuncao Neurologica",
        "goals": [
          "Melhorar nivel de alerta"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino oportunístico"
            ]
          }
        ]
      },
      {
        "name": "7.4.P4 — Risco de broncoaspiracao",
        "desc": "Critico. Rebaixamento consciencia, ausencia reflexo tosse, disfagia",
        "assess": [],
        "interv": [
          "Posicionamento protetor de vias aereas",
          "Cabeceira elevada minimo 30°",
          "Higiene oral rigorosa"
        ],
        "block": "7.4 — Sepse com Disfuncao Neurologica",
        "goals": [
          "Evitar regressao neurologica funcional"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Posicionamento continuo",
              "Higiene oral"
            ]
          }
        ]
      },
      {
        "name": "7.4.P5 — Falta de comando motor voluntario",
        "desc": "Grave. Incapaz de seguir comandos, sem movimento organizado",
        "assess": [],
        "interv": [
          "Mobilizacao passiva preservando padroes",
          "Estimulos para despertar comando motor"
        ],
        "block": "7.4 — Sepse com Disfuncao Neurologica",
        "goals": [
          "Preservar padrao motor basico"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Passiva",
              "Estimulos terapeuticos"
            ]
          }
        ]
      },
      {
        "name": "7.5.P1 — ICU-AW",
        "desc": "Critico. MRC <48, incapaz de sustentar tronco",
        "assess": [],
        "interv": [
          "Protocolo por camadas: 0 passivo/isometrico, 1 sedestacao leito, 2 beira-leito, 3 ortostatismo assistido, 4 primeiros passos, 5 marcha progressiva",
          "Fortalecimento progressivo",
          "Treino funcional real: tarefas, nao so exercicios",
          "Reavaliacoes seriadas: MRC, funcao, tolerancia"
        ],
        "block": "7.5 — Sepse Prolongada, ICU-AW e PICS",
        "goals": [
          "Recuperar sentar, ficar em pe, andar",
          "MRC ≥48"
        ],
        "phases": [
          {
            "timeframe": "Progressivo (semanas)",
            "interv": [
              "Mobilizacao por camadas",
              "Fortalecimento",
              "Treino funcional"
            ]
          }
        ]
      },
      {
        "name": "7.5.P2 — VIDD",
        "desc": "Critico. Falha desmame repetida, PImax muito baixo",
        "assess": [],
        "interv": [
          "Treino musculatura inspiratoria quando possivel",
          "Mobilizacao como estimulo ventilatorio",
          "Desmame gradual e protocolado"
        ],
        "block": "7.5 — Sepse Prolongada, ICU-AW e PICS",
        "goals": [
          "Recuperar forca respiratoria"
        ],
        "phases": [
          {
            "timeframe": "Progressivo (semanas)",
            "interv": [
              "TMI",
              "Mobilizacao integrada"
            ]
          }
        ]
      },
      {
        "name": "7.5.P3 — Incapacidade funcional grave",
        "desc": "Critico. Dependencia total para todas AVDs",
        "assess": [],
        "interv": [
          "Progressao funcional por niveis",
          "Meta: independencia em pelo menos transferencias"
        ],
        "block": "7.5 — Sepse Prolongada, ICU-AW e PICS",
        "goals": [
          "Recuperar sentar, ficar em pe, andar"
        ],
        "phases": [
          {
            "timeframe": "Progressivo (semanas)",
            "interv": [
              "Progressao por niveis"
            ]
          }
        ]
      },
      {
        "name": "7.5.P4 — Intolerancia ao esforco e fadiga precoce",
        "desc": "Grave. Incapaz de sustentar atividade >1-2 min",
        "assess": [],
        "interv": [
          "Treino de tolerancia progressivo",
          "Micro-sessoes frequentes > sessoes longas",
          "Reavaliacoes seriadas da tolerancia"
        ],
        "block": "7.5 — Sepse Prolongada, ICU-AW e PICS",
        "goals": [
          "Melhorar tolerancia ao esforco"
        ],
        "phases": [
          {
            "timeframe": "Progressivo (semanas)",
            "interv": [
              "Progressao gradual",
              "Micro-sessoes"
            ]
          }
        ]
      },
      {
        "name": "7.5.P5 — Disautonomia pos-septica",
        "desc": "Moderado. Variacoes PA/FC ao mudar postura",
        "assess": [],
        "interv": [
          "Treino de ortostatismo gradual",
          "Prancha ortostatica quando necessario"
        ],
        "block": "7.5 — Sepse Prolongada, ICU-AW e PICS",
        "goals": [
          "Recuperar tolerancia postural"
        ],
        "phases": [
          {
            "timeframe": "Progressivo (semanas)",
            "interv": [
              "Ortostatismo gradual"
            ]
          }
        ]
      },
      {
        "name": "7.5.P6 — PICS",
        "desc": "Grave. Fraqueza + deficit cognitivo + ansiedade, depressao, TEPT",
        "assess": [],
        "interv": [
          "Abordagem multidisciplinar: fisio + TO + psico + nutricao",
          "Treino funcional contextualizado",
          "Educacao e suporte ao paciente e familia",
          "Plano de rehabilitacao pos-alta"
        ],
        "block": "7.5 — Sepse Prolongada, ICU-AW e PICS",
        "goals": [
          "Retomar independencia minima"
        ],
        "phases": [
          {
            "timeframe": "Longo prazo",
            "interv": [
              "Multidisciplinar",
              "Treino realista",
              "Continuidade"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "populations",
    "name": "Sistema Populacoes Especiais",
    "icon": "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
    "color": "#e879f9",
    "problems": [
      {
        "name": "8.1.P1 — Hipoventilacao + atelectasia dependente (bases)",
        "desc": "Grave. Padrao superficial, SpO2 <92%, hipercapnia",
        "assess": [],
        "interv": [
          "Posicionamento obrigatorio: cabeceira 45-60°, decubitos laterais alternados",
          "Reexpansao dirigida: respiracao lenta nasal + pausa 2-3s (3 series 8-10 rep, 2-3x/dia)",
          "Se dessatura ao esforco: considerar CNAF ou VNI durante mobilizacao",
          "Desmame progressivo de oxigenio"
        ],
        "block": "8.1 — Obesidade",
        "goals": [
          "Manter SpO2 ≥92% com FiO2 em queda"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Posicionamento",
              "Reexpansao dirigida"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Desmame O2"
            ]
          }
        ]
      },
      {
        "name": "8.1.P2 — Alto risco de falha de desmame / reintubacao",
        "desc": "Grave. VM prolongada, falha SBT, PImax baixo, tosse ineficaz",
        "assess": [],
        "interv": [
          "Fortalecimento musculatura respiratoria quando possivel",
          "Otimizacao mecanica com posicionamento",
          "Mobilizacao precoce como suporte ao desmame"
        ],
        "block": "8.1 — Obesidade",
        "goals": [
          "Preparar para desmame sustentavel"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "TMI",
              "Posicionamento",
              "Mobilizacao precoce"
            ]
          }
        ]
      },
      {
        "name": "8.1.P3 — Baixa tolerancia postural e ao esforco",
        "desc": "Moderado. Dispneia/dessaturacao ao sentar, taquicardia, fadiga",
        "assess": [],
        "interv": [
          "Progressao postural gradual monitorizada",
          "Treino funcional: sit-to-stand assistido, marcha fracionada, intervalos longos",
          "Borg alvo 3-4/10"
        ],
        "block": "8.1 — Obesidade",
        "goals": [
          "Tolerar cabeceira ≥45°, sedestacao ≥20 min"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Progressao postural"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino funcional",
              "Marcha fracionada"
            ]
          }
        ]
      },
      {
        "name": "8.1.P4 — Barreira mecanica e alto risco lesao por pressao",
        "desc": "Moderado. Multiplas pessoas, equipamentos especiais, hiperemia",
        "assess": [],
        "interv": [
          "Planejar numero de pessoas, rota de tubos/drenos, cadeira/cinto/guincho",
          "Progressao: sedestacao beira-leito → ortostatismo assistido → transferencia → marcha 3-10m",
          "PARADA: SpO2 <88%, queda PAM >20%, dispneia intensa, tontura, fadiga extrema"
        ],
        "block": "8.1 — Obesidade",
        "goals": [
          "Iniciar mobilizacao fora do leito com seguranca logistica"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Planejamento obrigatorio",
              "Progressao em camadas"
            ]
          }
        ]
      },
      {
        "name": "8.2.P1 — Fraqueza global e baixa reserva fisiologica",
        "desc": "Grave. MRC <48, fadiga precoce, sarcopenia evidente",
        "assess": [],
        "interv": [
          "Dosagem: sessoes curtas e frequentes (10-20 min, 2x/dia), evitar exaustao",
          "Treino funcional real: sit-to-stand repetido, transferencia cama↔cadeira, marcha com andador/bengala",
          "Progressao de forca funcional"
        ],
        "block": "8.2 — Idoso Fragil / Sarcopenia / Risco Queda",
        "goals": [
          "Manter sedestacao segura ≥30 min, ortostatismo ≥1-2 min"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Sessoes curtas frequentes",
              "Treino funcional"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Sit-to-stand com ≤1 pessoa"
            ]
          }
        ]
      },
      {
        "name": "8.2.P2 — Delirium / deficit cognitivo funcional",
        "desc": "Grave. CAM-ICU positivo, confusao, desorientacao",
        "assess": [],
        "interv": [
          "Cognitivo-motor: comandos simples, rotina fixa, mesmos exercicios todos os dias",
          "Mobilizacao como intervencao anti-delirium",
          "≥2 transferencias/dia com tecnica"
        ],
        "block": "8.2 — Idoso Fragil / Sarcopenia / Risco Queda",
        "goals": [
          "Realizar transferencias/dia, reduzir delirium com rotina"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Rotina estruturada",
              "Mobilizacao terapeutica"
            ]
          }
        ]
      },
      {
        "name": "8.2.P3 — Instabilidade postural e medo de cair",
        "desc": "Grave. Desequilibrio, medo de mobilizar, historico quedas",
        "assess": [],
        "interv": [
          "Equilibrio: alcances em sedestacao e ortostatismo, mudanca de base, reacoes de protecao",
          "Treino de virar, parar, retomar eixo",
          "Plano de prevencao de quedas",
          "PARADA: hipotensao ortostatica sintomatica, dessaturacao, confusao/agitacao com risco"
        ],
        "block": "8.2 — Idoso Fragil / Sarcopenia / Risco Queda",
        "goals": [
          "Melhorar equilibrio estatico e dinamico basico"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino equilibrio",
              "Treino funcional"
            ]
          },
          {
            "timeframe": "Ate alta",
            "interv": [
              "Marcha assistida diaria",
              "Prevencao quedas"
            ]
          }
        ]
      },
      {
        "name": "8.3.P1 — Fadiga central e periferica",
        "desc": "Moderado. Fadiga desproporcional, exaustao precoce",
        "assess": [],
        "interv": [
          "Intensidade: Borg alvo 2-3/10, series curtas, pausas longas",
          "Manter sedestacao diaria, ortostatismo se possivel"
        ],
        "block": "8.3 — Oncologico / Caquexia / Neutropenia",
        "goals": [
          "Evitar perda funcional adicional, nao piorar pos-sessao"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Dosagem leve",
              "Minimo funcional"
            ]
          }
        ]
      },
      {
        "name": "8.3.P2 — Perda acelerada de forca e massa (caquexia)",
        "desc": "Grave. Perda de peso, sarcopenia visivel, MRC em queda",
        "assess": [],
        "interv": [
          "Preservacao de funcao existente",
          "Foco funcional: transferencias, marcha curta, AVDs"
        ],
        "block": "8.3 — Oncologico / Caquexia / Neutropenia",
        "goals": [
          "Evitar perda funcional adicional"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Preservacao"
            ]
          },
          {
            "timeframe": "Medio prazo",
            "interv": [
              "Treino funcional"
            ]
          }
        ]
      },
      {
        "name": "8.3.P3 — Dor / metastase ossea / risco de fratura",
        "desc": "Grave. Dor ossea, metastase confirmada, risco fratura patologica",
        "assess": [],
        "interv": [
          "Seguranca ossea: evitar impacto, torcoes bruscas, respeitar dor mecanica"
        ],
        "block": "8.3 — Oncologico / Caquexia / Neutropenia",
        "goals": [
          "Mobilizar com seguranca ossea"
        ],
        "phases": [
          {
            "timeframe": "Continuo",
            "interv": [
              "Criterios de seguranca"
            ]
          }
        ]
      },
      {
        "name": "8.3.P4 — Risco infeccioso (neutropenia)",
        "desc": "Grave. Neutrofilos <1000/mm3",
        "assess": [],
        "interv": [
          "EPIs, equipamento individual, higiene rigorosa"
        ],
        "block": "8.3 — Oncologico / Caquexia / Neutropenia",
        "goals": [
          "Mobilizar sem intercorrencia infecciosa"
        ],
        "phases": [
          {
            "timeframe": "Continuo",
            "interv": [
              "Controle de infeccao"
            ]
          }
        ]
      },
      {
        "name": "8.4.P1 — Fraqueza muscular e miopatia por corticoide/imobilismo",
        "desc": "Grave. Corticoide prolongado, MRC <48, fraqueza proximal",
        "assess": [],
        "interv": [
          "Borg alvo 3-4/10",
          "Sessoes 15-25 min, 1-2x/dia",
          "Priorizar funcional > forca isolada",
          "Progressao: sedestacao ativa → ortostatismo assistido → transferencia → marcha fracionada"
        ],
        "block": "8.4 — Imunossuprimido",
        "goals": [
          "Evitar perda adicional de forca funcional"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Dosagem controlada"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Transferir com ≤1 pessoa",
              "Marcha curta diaria"
            ]
          }
        ]
      },
      {
        "name": "8.4.P2 — Alto risco infeccioso durante mobilizacao",
        "desc": "Critico. Imunossupressao importante",
        "assess": [],
        "interv": [
          "EPIs, equipamentos dedicados, higienizacao rigorosa antes/depois",
          "Evitar circular por areas de risco"
        ],
        "block": "8.4 — Imunossuprimido",
        "goals": [
          "Mobilizacao diaria sem intercorrencia infecciosa"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Seguranca biologica"
            ]
          }
        ]
      },
      {
        "name": "8.4.P3 — Baixa tolerancia ao esforco por doenca de base",
        "desc": "Moderado. Fadiga precoce, dispneia, dessaturacao facil",
        "assess": [],
        "interv": [
          "Monitorizacao rigorosa durante mobilizacao",
          "Progressao gradual de intensidade",
          "PARADA: SpO2 <88-90% sustentado, fadiga extrema, tontura, taquicardia ou hipotensao desproporcionais"
        ],
        "block": "8.4 — Imunossuprimido",
        "goals": [
          "Tolerar sedestacao ≥30 min, ortostatismo ≥1-2 min, SpO2 ≥92%"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Monitorizacao"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao controlada"
            ]
          }
        ]
      },
      {
        "name": "8.5.P1 — Instabilidade hemodinamica pos-dialise",
        "desc": "Grave. Hipotensao apos dialise, fadiga extrema, tontura",
        "assess": [],
        "interv": [
          "Timing: preferir antes da dialise ou ≥4-6h apos, conforme resposta",
          "Manter sedestacao ≥30 min, ortostatismo ≥1-2 min sem sintomas",
          "Evitar sincope, queda, hipotensao sintomatica"
        ],
        "block": "8.5 — Renal Cronico / Hemodialise",
        "goals": [
          "Realizar mobilizacao fora do pico de hipotensao pos-dialise"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Timing em relacao à dialise"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Transferir com supervisao minima",
              "Marcha curta diaria"
            ]
          }
        ]
      },
      {
        "name": "8.5.P2 — Fraqueza muscular e caimbras",
        "desc": "Moderado. MRC baixo, caimbras frequentes, miopatia uremica",
        "assess": [],
        "interv": [
          "Borg alvo 3/10, sessoes curtas com pausas longas"
        ],
        "block": "8.5 — Renal Cronico / Hemodialise",
        "goals": [
          "Melhorar forca funcional sem desencadear caimbras"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Dose de exercicio controlada"
            ]
          }
        ]
      },
      {
        "name": "8.5.P3 — Restricao mecanica por FAV/cateter",
        "desc": "Moderado. Fistula arteriovenosa ou cateter de dialise",
        "assess": [],
        "interv": [
          "Nao tracionar, nao apoiar peso, nao comprimir FAV/cateter"
        ],
        "block": "8.5 — Renal Cronico / Hemodialise",
        "goals": [
          "Mobilizar sem comprometer acesso vascular"
        ],
        "phases": [
          {
            "timeframe": "Continuo",
            "interv": [
              "Protecao de acesso"
            ]
          }
        ]
      },
      {
        "name": "8.6.P1 — Restricao ventilatoria por ascite / derrame pleural",
        "desc": "Grave. Ascite volumosa, derrame, dispneia repouso/esforco minimo",
        "assess": [],
        "interv": [
          "Mecanica respiratoria: cabeceira elevada, treino leve (pausas inspiratorias, controle)"
        ],
        "block": "8.6 — Hepatico (Cirrose, Ascite, Encefalopatia)",
        "goals": [
          "Manter SpO2 ≥92%, sedestacao segura diaria"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Treino respiratorio leve"
            ]
          }
        ]
      },
      {
        "name": "8.6.P2 — Encefalopatia hepatica → risco de queda / baixa adesao",
        "desc": "Critico. Confusao, desorientacao, alteracao comportamento",
        "assess": [],
        "interv": [
          "Seguranca neurologica: nunca mobilizar sozinho, comandos simples e repetidos, ambiente controlado"
        ],
        "block": "8.6 — Hepatico (Cirrose, Ascite, Encefalopatia)",
        "goals": [
          "Prevenir queda, broncoaspiracao"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Comandos simples",
              "Ambiente controlado"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Ortostatismo assistido diario",
              "Marcha curta com supervisao"
            ]
          }
        ]
      },
      {
        "name": "8.6.P3 — Sarcopenia importante",
        "desc": "Grave. Perda de massa muscular, MRC baixo",
        "assess": [],
        "interv": [
          "Treino funcional: transferencias, marcha curta, sedestacao ativa"
        ],
        "block": "8.6 — Hepatico (Cirrose, Ascite, Encefalopatia)",
        "goals": [
          "Aumentar tolerancia postural"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino funcional"
            ]
          },
          {
            "timeframe": "Ate alta",
            "interv": [
              "Plano continuidade",
              "Prevencao quedas"
            ]
          }
        ]
      },
      {
        "name": "8.7.P1 — Dor intensa limitante",
        "desc": "Critico. EVA ≥7, dor impede mobilizacao e ADM",
        "assess": [],
        "interv": [
          "ADM terapeutica diaria, associada a analgesia, curativos quando possivel",
          "Manter funcao minima dos segmentos nao afetados"
        ],
        "block": "8.7 — Queimados",
        "goals": [
          "Realizar ADM com dor controlada"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "ADM + analgesia"
            ]
          }
        ]
      },
      {
        "name": "8.7.P2 — Risco extremo de contraturas e rigidez",
        "desc": "Critico. Queimadura profunda, areas articulares afetadas",
        "assess": [],
        "interv": [
          "Posicionamento anti-contratura, orteses quando indicadas",
          "ADM diaria estruturada",
          "ADM progressiva com meta funcional"
        ],
        "block": "8.7 — Queimados",
        "goals": [
          "ADM diaria estruturada, posicionamento anti-contratura"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Posicionamento continuo"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "ADM progressiva"
            ]
          }
        ]
      },
      {
        "name": "8.7.P3 — Perda funcional global",
        "desc": "Grave. Incapacidade para AVDs, dependencia total",
        "assess": [],
        "interv": [
          "Sedestacao e ortostatismo conforme estabilidade",
          "Treino funcional: transferencias, marcha progressiva, AVDs"
        ],
        "block": "8.7 — Queimados",
        "goals": [
          "Sedestacao e ortostatismo, iniciar treino funcional basico"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino funcional"
            ]
          },
          {
            "timeframe": "Ate alta",
            "interv": [
              "Plano intensivo ambulatorial"
            ]
          }
        ]
      },
      {
        "name": "8.7.P4 — Comprometimento respiratorio (inalacao, secrecao, VM)",
        "desc": "Critico. Queimadura vias aereas, VM, secrecao carbonacea",
        "assess": [],
        "interv": [
          "Higiene bronquica criteriosa",
          "VM protetora se necessario",
          "PARADA: dor intratavel, instabilidade hemodinamica, dessaturacao"
        ],
        "block": "8.7 — Queimados",
        "goals": [
          "Manter vias aereas pervias e oxigenacao adequada"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Higiene bronquica",
              "VM protetora"
            ]
          }
        ]
      },
      {
        "name": "8.8.P1 — Dispneia refrataria",
        "desc": "Critico. Dispneia em repouso, refrataria a tratamento",
        "assess": [],
        "interv": [
          "Conforto respiratorio: posicionamento, O2 se necessario, tecnicas leves de controle ventilatorio",
          "Reduzir dispneia, dor, ansiedade corporal"
        ],
        "block": "8.8 — Paliativo / Fim de Vida",
        "goals": [
          "Priorizar conforto, dignidade, controle de sintomas"
        ],
        "phases": [
          {
            "timeframe": "Sempre",
            "interv": [
              "Conforto respiratorio"
            ]
          }
        ]
      },
      {
        "name": "8.8.P2 — Dor e desconforto postural",
        "desc": "Critico. Dor importante, desconforto em decubito, ulceras, rigidez",
        "assess": [],
        "interv": [
          "Mudanca de decubito, ajustes posturais, mobilidade para higiene/conforto"
        ],
        "block": "8.8 — Paliativo / Fim de Vida",
        "goals": [
          "Priorizar conforto, dignidade, controle de sintomas"
        ],
        "phases": [
          {
            "timeframe": "Sempre",
            "interv": [
              "Conforto motor",
              "Dignidade"
            ]
          }
        ]
      },
      {
        "name": "8.8.P3 — Perda funcional com sofrimento",
        "desc": "Critico. Dependencia total, sofrimento associado",
        "assess": [],
        "interv": [
          "Foco exclusivo em conforto e dignidade",
          "PARADA: qualquer sinal de sofrimento adicional"
        ],
        "block": "8.8 — Paliativo / Fim de Vida",
        "goals": [
          "Reduzir dispneia, dor, ansiedade corporal"
        ],
        "phases": [
          {
            "timeframe": "Sempre",
            "interv": [
              "Humanizacao",
              "Criterios de parada absolutos"
            ]
          }
        ]
      }
    ]
  }
] as const
