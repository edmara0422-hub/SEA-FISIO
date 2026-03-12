export const ICU_REFERENCE_SYSTEMS = [
  {
    "id": "cardiovascular",
    "name": "Sistema Cardiovascular",
    "icon": "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
    "color": "#f87171",
    "problems": [
      {
        "name": "C1.P1 — Hipoperfusao tecidual",
        "desc": "Critico. PAM < alvo, extremidades frias, TEC > 3s, lactato elevado, oliguria, rebaixamento de consciencia",
        "assess": [],
        "interv": [
          "Oxigenoterapia convencional para SpO₂ 92-96% (Titular)",
          "CNAF: Fluxo 40-60 L/min se FR ≥ 28-30 (Se indicado)",
          "VNI conservadora: EPAP 5-8 cmH₂O (Se fadiga respiratoria)",
          "Cabeceira elevada (30-60°) (Continuo)",
          "Evitar decubito totalmente horizontal prolongado (Preventivo)",
          "Mobilizacao passiva + bomba muscular (Degrau 0)",
          "Sedestacao no leito se PAM ≥ alvo (Degrau 1)",
          "Sedestacao beira-leito (Degrau 2)",
          "Poltrona (Degrau 3)",
          "Ortostatismo curto (30-120s) (Degrau 4)",
          "PARADA: queda PAM + sintomas, tontura, sudorese, taquicardia sustentada (Criterios)"
        ],
        "block": "C1 — Choque e instabilidade hemodinamica",
        "goals": [
          "Manter PAM ≥ alvo (geralmente ≥ 65 mmHg), SpO₂ ≥ 92%, FR < 30",
          "Iniciar verticalizacao progressiva segura"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Oxigenoterapia convencional para SpO₂ 92-96% (Titular)",
              "CNAF: Fluxo 40-60 L/min se FR ≥ 28-30 (Se indicado)",
              "VNI conservadora: EPAP 5-8 cmH₂O (atencao: pode ↓ retorno venoso) (Se fadiga respiratoria)",
              "Cabeceira elevada (30-60°) (Continuo)",
              "Evitar decubito totalmente horizontal prolongado (Preventivo)"
            ]
          },
          {
            "timeframe": "24-72h",
            "interv": [
              "Mobilizacao passiva + bomba muscular (Degrau 0)",
              "Sedestacao no leito se PAM ≥ alvo (Degrau 1)",
              "Sedestacao beira-leito (Degrau 2)",
              "Poltrona (Degrau 3)",
              "Ortostatismo curto (30-120s) (Degrau 4)",
              "PARADA: queda PAM + sintomas, tontura, sudorese, taquicardia sustentada (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C1.P2 — Instabilidade hemodinamica ao esforco/mudanca postural",
        "desc": "Grave. Queda de PAM > 10-20 mmHg ao elevar cabeceira/sentar, taquicardia reacional, tontura, sudorese fria, palidez",
        "assess": [],
        "interv": [
          "Exercicios de bomba muscular em leito antes de verticalizar (Preparacao)",
          "Elevacao progressiva: 30° → 45° → 60° → 90° (Gradual 3-5 min/estagio)",
          "Monitorar PA a cada mudanca (Vigilancia)"
        ],
        "block": "C1 — Choque e instabilidade hemodinamica",
        "goals": [
          "Permitir mudancas posturais seguras"
        ],
        "phases": [
          {
            "timeframe": "24-48h",
            "interv": [
              "Exercicios de bomba muscular em leito antes de verticalizar (Preparacao)",
              "Elevacao progressiva: 30° → 45° → 60° → 90° (Gradual 3-5 min/estagio)",
              "Monitorar PA a cada mudanca (Vigilancia)"
            ]
          }
        ]
      },
      {
        "name": "C1.P3 — Aumento do trabalho respiratorio e consumo de O₂",
        "desc": "Grave. FR > 28-30, uso de musculatura acessoria, dispneia, taquicardia associada ao esforco respiratorio",
        "assess": [],
        "interv": [
          "CNAF prioritario: reduz FR e esforco, PEEP fisiologica ~3-5 cmH₂O (Tratamento principal)",
          "Evitar VNI/VM com PEEP alta (↓ retorno venoso) (Cautela)",
          "Posicionamento: sentado/cabeceira elevada (Terapeutico)"
        ],
        "block": "C1 — Choque e instabilidade hemodinamica",
        "goals": [
          "Reduzir trabalho respiratorio e consumo metabolico"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "CNAF prioritario: reduz FR e esforco, PEEP fisiologica ~3-5 cmH₂O (Tratamento principal)",
              "Evitar VNI/VM com PEEP alta (↓ retorno venoso) (Cautela)",
              "Posicionamento: sentado/cabeceira elevada (Terapeutico)"
            ]
          }
        ]
      },
      {
        "name": "C1.P4 — Dependencia de suporte ventilatorio (O₂, CNAF, VNI ou VM)",
        "desc": "Grave. SpO₂ < alvo em ar ambiente, fadiga respiratoria, necessidade de poupar musculatura",
        "assess": [],
        "interv": [
          "Preferir O₂/CNAF sempre que possivel (Primeira escolha)",
          "VM protetora: Vt 6-8 mL/kg, Pplato < 30, ΔP < 12-14, PEEP minima (Se VM necessaria)"
        ],
        "block": "C1 — Choque e instabilidade hemodinamica",
        "goals": [
          "Manter SpO₂ alvo com menor impacto hemodinamico"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Preferir O₂/CNAF sempre que possivel (Primeira escolha)",
              "VM protetora: Vt 6-8 mL/kg, Pplato < 30, ΔP < 12-14, PEEP minima (Se VM necessaria)"
            ]
          }
        ]
      },
      {
        "name": "C1.P5 — Intolerancia a mobilizacao / risco de colapso hemodinamico",
        "desc": "Critico. Instabilidade com pequenas mudancas de posicao, sincope previa, piora de perfusao ao esforco minimo",
        "assess": [],
        "interv": [
          "Mobilizacao passiva inicial (Segura)",
          "Progressao apenas se PAM estavel, sem aumento recente de vasopressor (Criterios)",
          "PARADA imediata: queda PAM + sintomas, tontura, palidez, dessaturacao (Vigilancia)"
        ],
        "block": "C1 — Choque e instabilidade hemodinamica",
        "goals": [
          "Mobilizacao em microdoses sem colapso"
        ],
        "phases": [
          {
            "timeframe": "48-72h",
            "interv": [
              "Mobilizacao passiva inicial (Segura)",
              "Progressao apenas se PAM estavel, sem aumento recente de vasopressor (Criterios)",
              "PARADA imediata: queda PAM + sintomas, tontura, palidez, dessaturacao (Vigilancia)"
            ]
          }
        ]
      },
      {
        "name": "C2.P1 — Congestao pulmonar / edema intersticial ou alveolar",
        "desc": "Critico. Dispneia, ortopneia, crepitacoes difusas, RX com congestao/edema, SpO₂ reduzida, PaO₂/FiO₂ reduzida",
        "assess": [],
        "interv": [
          "VNI = TRATAMENTO DE PRIMEIRA LINHA: CPAP 8-12 cmH₂O ou BiPAP (EPAP 8-10, IPAP 12-16) (Prioritario)",
          "CNAF se FR ≥ 28-30 + esforco respiratorio (Alternativa/ponte)",
          "Posicionamento: sentado/poltrona = tratamento (Terapeutico)",
          "Avaliar resposta em 30-120 min: FR ↓, SpO₂ ↑, menor dispneia (Reavaliar)",
          "Criterios de falha VNI: piora consciencia, instabilidade, exaustao → IOT (Alerta)",
          "Progressao: VNI/CNAF → O₂ baixo fluxo → ar ambiente (Desmame)",
          "Mobilizacao apos estabilizacao: poltrona → ortostatismo → marcha 5-40 m (Funcional)",
          "PARADA: dispneia intensa, dessaturacao, dor toracica, tontura (Criterios)"
        ],
        "block": "C2 — Insuficiencia cardiaca e edema agudo de pulmao",
        "goals": [
          "Reduzir dispneia e trabalho respiratorio, manter SpO₂ ≥ 92-96%",
          "Reduzir dependencia de suporte ventilatorio"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "VNI = TRATAMENTO DE PRIMEIRA LINHA: CPAP 8-12 cmH₂O ou BiPAP (EPAP 8-10, IPAP 12-16) (Prioritario)",
              "CNAF se FR ≥ 28-30 + esforco respiratorio (Alternativa/ponte)",
              "Posicionamento: sentado/poltrona = tratamento (Terapeutico)",
              "Avaliar resposta em 30-120 min: FR ↓, SpO₂ ↑, menor dispneia (Reavaliar)",
              "Criterios de falha VNI: piora consciencia, instabilidade, exaustao → IOT (Alerta)"
            ]
          },
          {
            "timeframe": "24-72h",
            "interv": [
              "Progressao: VNI/CNAF → O₂ baixo fluxo → ar ambiente (Desmame)",
              "Mobilizacao apos estabilizacao: poltrona → ortostatismo → marcha 5-40 m (Funcional)",
              "PARADA: dispneia intensa, dessaturacao, dor toracica, tontura (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C2.P2 — Aumento importante do trabalho respiratorio",
        "desc": "Critico. FR > 28-30 irpm, uso de musculatura acessoria, tiragem/batimento de asa nasal, dispneia intensa (Borg ≥ 6)",
        "assess": [],
        "interv": [
          "CPAP efeitos: ↓ pre-carga, ↓ pos-carga VE, redistribuicao liquido alveolar (Fisiologia)",
          "CNAF: ↓ trabalho respiratorio, PEEP fisiologica 3-5 cmH₂O (Suporte)"
        ],
        "block": "C2 — Insuficiencia cardiaca e edema agudo de pulmao",
        "goals": [
          "Reduzir FR, melhorar conforto ventilatorio"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "CPAP efeitos: ↓ pre-carga, ↓ pos-carga VE, redistribuicao liquido alveolar (Fisiologia)",
              "CNAF: ↓ trabalho respiratorio, PEEP fisiologica 3-5 cmH₂O (Suporte)"
            ]
          }
        ]
      },
      {
        "name": "C2.P3 — Hipoxemia",
        "desc": "Grave. SpO₂ < 92% em ar ambiente ou O₂ baixo fluxo, PaO₂ < 60 mmHg",
        "assess": [],
        "interv": [
          "Oxigenoterapia se hipoxemia leve e FR < 28-30 (Inicial)",
          "Escalar para CNAF/VNI conforme necessidade (Progressao)"
        ],
        "block": "C2 — Insuficiencia cardiaca e edema agudo de pulmao",
        "goals": [
          "SpO₂ 92-96%"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Oxigenoterapia se hipoxemia leve e FR < 28-30 (Inicial)",
              "Escalar para CNAF/VNI conforme necessidade (Progressao)"
            ]
          }
        ]
      },
      {
        "name": "C2.P4 — Baixa tolerancia ao esforco / intolerancia ao ortostatismo",
        "desc": "Moderado. Queda de SpO₂ ou aumento de FR/FC ao sentar/ficar em pe, dispneia desproporcional, fadiga precoce",
        "assess": [],
        "interv": [
          "Progressao funcional: sedestacao → poltrona → ortostatismo → marcha curta (Gradual)",
          "Criterios para iniciar: FR < 28-30, SpO₂ estavel, dispneia controlada (Elegibilidade)"
        ],
        "block": "C2 — Insuficiencia cardiaca e edema agudo de pulmao",
        "goals": [
          "Melhorar tolerancia ao esforco e AVDs"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Progressao funcional: sedestacao → poltrona → ortostatismo → marcha curta (Gradual)",
              "Criterios para iniciar: FR < 28-30, SpO₂ estavel, dispneia controlada (Elegibilidade)"
            ]
          }
        ]
      },
      {
        "name": "C2.P5 — Risco de fadiga respiratoria e falencia ventilatoria",
        "desc": "Critico. FR persistentemente > 30, uso intenso de musculatura acessoria, taquicardia associada, queda de consciencia",
        "assess": [],
        "interv": [
          "VNI precoce e otimizada (Urgente)",
          "Monitorizacao intensiva: FR, consciencia, esforco (Continuo)",
          "VM se falha de VNI (Backup)"
        ],
        "block": "C2 — Insuficiencia cardiaca e edema agudo de pulmao",
        "goals": [
          "Evitar fadiga e intubacao"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "VNI precoce e otimizada (Urgente)",
              "Monitorizacao intensiva: FR, consciencia, esforco (Continuo)",
              "VM se falha de VNI (Backup)"
            ]
          }
        ]
      },
      {
        "name": "C3.P1 — Taquiarritmias (FA/Flutter, TSV, TV nao sustentada)",
        "desc": "Grave. FC persistentemente > 120-130 bpm, palpitacoes, dispneia, tontura, queda de PA, ECG com ritmo patologico",
        "assess": [],
        "interv": [
          "Controle respiratorio = controle eletrico: hipoxia e hipercapnia sao gatilhos (Fundamental)",
          "Oxigenoterapia para SpO₂ 92-96% (Alvo)",
          "CNAF se FR ≥ 28-30 (reduz estresse simpatico) (Se indicado)",
          "VNI com cautela: EPAP 5-8 cmH₂O, monitorar PA (Se fadiga)",
          "Mobilizacao apenas em zonas seguras: ritmo controlado, FC sem extremos, PAM ≥ alvo (Criterios)",
          "Progressao: sedestacao → poltrona → ortostatismo → marcha 5-10 m (Gradual)",
          "PARADA: palpitacao intensa, tontura, dor toracica, queda PA, dessaturacao (Criterios)"
        ],
        "block": "C3 — Arritmias e instabilidade eletrica",
        "goals": [
          "Manter estabilidade hemodinamica, evitar gatilhos de arritmia",
          "Retomar mobilidade funcional"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Controle respiratorio = controle eletrico: hipoxia e hipercapnia sao gatilhos (Fundamental)",
              "Oxigenoterapia para SpO₂ 92-96% (Alvo)",
              "CNAF se FR ≥ 28-30 (reduz estresse simpatico) (Se indicado)",
              "VNI com cautela: EPAP 5-8 cmH₂O, monitorar PA (Se fadiga)",
              "Mobilizacao apenas em zonas seguras: ritmo controlado, FC sem extremos, PAM ≥ alvo (Criterios)"
            ]
          },
          {
            "timeframe": "24-72h",
            "interv": [
              "Progressao: sedestacao → poltrona → ortostatismo → marcha 5-10 m (Gradual)",
              "PARADA: palpitacao intensa, tontura, dor toracica, queda PA, dessaturacao (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C3.P2 — Bradiarritmias e disturbios de conducao (BAV, pausas)",
        "desc": "Grave. FC < 50 bpm com sintomas, tontura, sincope, hipotensao, pausas em monitorizacao",
        "assess": [],
        "interv": [
          "Manter oxigenacao adequada (SpO₂ 92-96%)",
          "Mobilizacao conservadora: sessoes curtas e frequentes (Seguranca)",
          "PARADA: bradicardia sintomatica, presincope (Criterios)"
        ],
        "block": "C3 — Arritmias e instabilidade eletrica",
        "goals": [
          "Evitar sincope e instabilidade"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Manter oxigenacao adequada (SpO₂ 92-96%)",
              "Mobilizacao conservadora: sessoes curtas e frequentes (Seguranca)",
              "PARADA: bradicardia sintomatica, presincope (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C3.P3 — Instabilidade hemodinamica induzida por arritmia",
        "desc": "Critico. Queda de PAM < alvo, alteracao de consciencia, dor toracica isquemica, dispneia subita, hipoperfusao",
        "assess": [],
        "interv": [
          "Suporte ventilatorio conforme necessidade (Reduzir estresse)",
          "Evitar mobilizacao ate estabilizacao (Repouso)"
        ],
        "block": "C3 — Arritmias e instabilidade eletrica",
        "goals": [
          "Estabilizacao hemodinamica"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Suporte ventilatorio conforme necessidade (Reduzir estresse)",
              "Evitar mobilizacao ate estabilizacao (Repouso)"
            ]
          }
        ]
      },
      {
        "name": "C3.P4 — Baixa tolerancia ao esforco por instabilidade cronotropica",
        "desc": "Moderado. FC sobe excessivamente ou nao sobe adequadamente, intolerancia ao ortostatismo/marcha",
        "assess": [],
        "interv": [
          "Sessoes curtas e frequentes (Fracionado)",
          "Priorizar funcionalidade basica, nao exaustao (Estrategia)",
          "Evitar exercicios resistidos intensos (Cautela)"
        ],
        "block": "C3 — Arritmias e instabilidade eletrica",
        "goals": [
          "Melhorar tolerancia funcional basica"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Sessoes curtas e frequentes (Fracionado)",
              "Priorizar funcionalidade basica, nao exaustao (Estrategia)",
              "Evitar exercicios resistidos intensos (Cautela)"
            ]
          }
        ]
      },
      {
        "name": "C3.P5 — Hipoxemia/alto trabalho respiratorio como gatilho",
        "desc": "Grave. SpO₂ < 92%, FR > 28-30, uso de musculatura acessoria, piora do ritmo com hipoxia/esforco",
        "assess": [],
        "interv": [
          "CNAF/VNI para reduzir trabalho respiratorio (Tratamento)",
          "Evitar hipoxia e hipercapnia (Vigilancia)"
        ],
        "block": "C3 — Arritmias e instabilidade eletrica",
        "goals": [
          "Controlar gatilhos respiratorios"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "CNAF/VNI para reduzir trabalho respiratorio (Tratamento)",
              "Evitar hipoxia e hipercapnia (Vigilancia)"
            ]
          }
        ]
      },
      {
        "name": "C4.P1 — Dor toracica/incisional com limitacao ventilatoria",
        "desc": "Moderado. EVA > 5-6, respiracao superficial, tosse ineficaz, protecao excessiva da ferida",
        "assess": [],
        "interv": [
          "Exercicios ventilatorios: inspiracoes lentas profundas com pausa (3-5 series de 5-10 rep)",
          "Tosse eficaz com protecao: splinting (apoio manual/almofada sobre incisao) (Tecnica)",
          "Huffing se tolerado (Alternativa)"
        ],
        "block": "C3 — Arritmias e instabilidade eletrica",
        "goals": [
          "Garantir ventilacao adequada e tosse eficaz"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Exercicios ventilatorios: inspiracoes lentas profundas com pausa (3-5 series de 5-10 rep)",
              "Tosse eficaz com protecao: splinting (apoio manual/almofada sobre incisao) (Tecnica)",
              "Huffing se tolerado (Alternativa)"
            ]
          }
        ]
      },
      {
        "name": "C4.P2 — Hipoventilacao e risco de atelectasia",
        "desc": "Grave. FR superficial, ausculta com reducao de murmurio, RX com atelectasia, queda de SpO₂",
        "assess": [],
        "interv": [
          "Expansao pulmonar: exercicios ventilatorios + incentivo respiratorio (Sessoes)",
          "Suporte ventilatorio: O₂ se SpO₂ < 92-94%, considerar CNAF/VNI se atelectasia importante (Se necessario)",
          "Posicionamento: evitar decubito dorsal prolongado, sentar em poltrona precoce (Terapeutico)"
        ],
        "block": "C4 — Pos-operatorio cardiaco e toracico",
        "goals": [
          "Prevenir atelectasia, manter SpO₂ ≥ 92-96%"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Expansao pulmonar: exercicios ventilatorios + incentivo respiratorio (Sessoes)",
              "Suporte ventilatorio: O₂ se SpO₂ < alvo, CNAF/VNI se atelectasia importante (Se necessario)",
              "Posicionamento: evitar decubito dorsal prolongado, sentar em poltrona precoce (Terapeutico)"
            ]
          }
        ]
      },
      {
        "name": "C4.P3 — Secrecao retida / tosse ineficaz",
        "desc": "Moderado. Tosse fraca/dolorosa, ruidos adventicios, aspiracao frequente, pico de fluxo reduzido",
        "assess": [],
        "interv": [
          "Treino de tosse assistida com protecao (Sessoes)",
          "Huffing, tosse em series (Tecnicas)"
        ],
        "block": "C4 — Pos-operatorio cardiaco e toracico",
        "goals": [
          "Higiene bronquica eficaz"
        ],
        "phases": [
          {
            "timeframe": "24-48h",
            "interv": [
              "Treino de tosse assistida com protecao (Sessoes)",
              "Huffing, tosse em series (Tecnicas)"
            ]
          }
        ]
      },
      {
        "name": "C4.P4 — Fraqueza global e intolerancia a mobilizacao",
        "desc": "Moderado. Dificuldade para sentar/levantar, queda de PA ou SpO₂ ao mobilizar, fadiga precoce",
        "assess": [],
        "interv": [
          "Progressao tipica: D0-D1 sedestacao/poltrona, D1-D2 ortostatismo/marcha 5-10m, D2-D3 marcha 20-50m (Funcional)",
          "Treino de transferencias: rolar → sentar → sentar/levantar → poltrona, 3-8 repeticoes (Diario)",
          "PARADA: dor toracica isquemica, queda PA, arritmia nova, dessaturacao, tontura (Criterios)"
        ],
        "block": "C4 — Pos-operatorio cardiaco e toracico",
        "goals": [
          "Melhorar independencia nas transferencias"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Progressao tipica: D0-D1 sedestacao/poltrona, D1-D2 ortostatismo/marcha 5-10m, D2-D3 marcha 20-50m (Funcional)",
              "Treino de transferencias: rolar → sentar → sentar/levantar → poltrona, 3-8 repeticoes (Diario)",
              "PARADA: dor toracica isquemica, queda PA, arritmia nova, dessaturacao, tontura (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C4.P5 — Restricao de movimento por esternotomia/toracotomia",
        "desc": "Leve. Medo de mover MMSS/tronco, limitacao funcional, postura protetora",
        "assess": [],
        "interv": [
          "Educacao terapeutica: movimentos seguros (Orientacao)",
          "Mobilizacao ativa-assistida progressiva (Gradual)"
        ],
        "block": "C4 — Pos-operatorio cardiaco e toracico",
        "goals": [
          "Restaurar amplitude de movimento funcional"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Educacao terapeutica: movimentos seguros (Orientacao)",
              "Mobilizacao ativa-assistida progressiva (Gradual)"
            ]
          }
        ]
      },
      {
        "name": "C4.P6 — Risco tromboembolico por imobilismo",
        "desc": "Moderado. Longo tempo em leito, baixa mobilidade, edema de MMII, fatores de risco clinicos",
        "assess": [],
        "interv": [
          "Exercicios de bomba muscular MMII: dorsiflexao/plantiflexao, extensao joelhos (Varias vezes/dia)",
          "Mobilizacao precoce (Diario)"
        ],
        "block": "C4 — Pos-operatorio cardiaco e toracico",
        "goals": [
          "Prevenir trombose"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Exercicios de bomba muscular MMII: dorsiflexao/plantiflexao, extensao joelhos (Varias vezes/dia)",
              "Mobilizacao precoce (Diario)"
            ]
          }
        ]
      },
      {
        "name": "C5.P1 — Hipoxemia por mismatch V/Q",
        "desc": "Grave. SpO₂ < 92%, PaO₂ reduzida, gradiente A-a aumentado, necessidade de O₂ suplementar",
        "assess": [],
        "interv": [
          "Oxigenoterapia para SpO₂ 92-96% (Inicial)",
          "CNAF se FR ≥ 28-30: Fluxo 40-60 L/min, FiO₂ para alvo (Se indicado)",
          "VNI com MUITA CAUTELA: EPAP baixa (5-8) apenas se fadiga clara (Cautela extrema)",
          "Regra: evitar tudo que aumente pos-carga do VD (Fisiologia)",
          "Cabeceira elevada, evitar supino horizontal (Posicionamento)",
          "Mobilizacao so apos estabilizacao: sedestacao → poltrona → ortostatismo → marcha 5-10m (Progressao)",
          "PARADA: tontura, queda PA, dessaturacao, dor toracica, dispneia desproporcional (Criterios)"
        ],
        "block": "C4 — Pos-operatorio cardiaco e toracico",
        "goals": [
          "Manter SpO₂ ≥ 92-96%, reduzir trabalho respiratorio",
          "Reduzir dependencia de O₂"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Oxigenoterapia para SpO₂ 92-96% (Inicial)",
              "CNAF se FR ≥ 28-30: Fluxo 40-60 L/min, FiO₂ para alvo (Se indicado)",
              "VNI com MUITA CAUTELA: EPAP ↑ → ↓ retorno venoso → piora VD. Usar EPAP baixa (5-8) apenas se fadiga clara (Cautela extrema)",
              "Regra: evitar tudo que aumente pos-carga do VD (Fisiologia)"
            ]
          },
          {
            "timeframe": "24-72h",
            "interv": [
              "Cabeceira elevada, evitar supino horizontal (Posicionamento)",
              "Mobilizacao so apos estabilizacao: sedestacao → poltrona → ortostatismo → marcha 5-10m (Progressao)",
              "PARADA: tontura, queda PA, dessaturacao, dor toracica, dispneia desproporcional (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C5.P2 — Aumento do trabalho respiratorio",
        "desc": "Grave. FR > 28-30 irpm, uso de musculatura acessoria, dispneia subita/desproporcional",
        "assess": [],
        "interv": [
          "CNAF preferencial: reduz trabalho sem grande impacto VD (Escolha)",
          "Evitar VNI agressiva (Cautela)"
        ],
        "block": "C5 — Tromboembolismo pulmonar (TEP)",
        "goals": [
          "Reduzir FR < 30, melhorar conforto"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "CNAF preferencial: reduz trabalho sem grande impacto VD (Escolha)",
              "Evitar VNI agressiva (Cautela)"
            ]
          }
        ]
      },
      {
        "name": "C5.P3 — Sobrecarga aguda de ventriculo direito (VD)",
        "desc": "Critico. Taquicardia persistente, hipotensao, ECO com VD dilatado/septo em D, baixo debito",
        "assess": [],
        "interv": [
          "Evitar PEEP/EPAP elevada (Fundamental)",
          "Mobilizacao em microdoses apenas se estavel (Cauteloso)"
        ],
        "block": "C5 — Tromboembolismo pulmonar (TEP)",
        "goals": [
          "Evitar piora da sobrecarga de VD"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Evitar PEEP/EPAP elevada (Fundamental)",
              "Mobilizacao em microdoses apenas se estavel (Cauteloso)"
            ]
          }
        ]
      },
      {
        "name": "C5.P4 — Baixa tolerancia ao esforco / risco de colapso",
        "desc": "Grave. Queda de PA ou SpO₂ ao sentar/ficar em pe, tontura, pre-sincope, dispneia intensa",
        "assess": [],
        "interv": [
          "Criterios para iniciar: hemodinamicamente estavel, sem aumento vasopressor, SpO₂ estavel, dor controlada (Elegibilidade)",
          "Progressao muito gradual: sedestacao leito → beira-leito → poltrona → ortostatismo curto → marcha 5-10m (Microdegraus)"
        ],
        "block": "C5 — Tromboembolismo pulmonar (TEP)",
        "goals": [
          "Mobilizacao segura sem colapso"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Criterios para iniciar: hemodinamicamente estavel, sem aumento vasopressor, SpO₂ estavel, dor controlada (Elegibilidade)",
              "Progressao muito gradual: sedestacao leito → beira-leito → poltrona → ortostatismo curto → marcha 5-10m (Microdegraus)"
            ]
          }
        ]
      },
      {
        "name": "C5.P5 — Dor toracica pleuritica e limitacao ventilatoria",
        "desc": "Moderado. Dor ventilatorio-dependente, respiracao superficial, hipoventilacao regional",
        "assess": [],
        "interv": [
          "Exercicios ventilatorios com analgesia adequada (Sessoes)",
          "Evitar hipoventilacao prolongada (Vigilancia)"
        ],
        "block": "C5 — Tromboembolismo pulmonar (TEP)",
        "goals": [
          "Controlar dor e prevenir hipoventilacao"
        ],
        "phases": [
          {
            "timeframe": "24-48h",
            "interv": [
              "Exercicios ventilatorios com analgesia adequada (Sessoes)",
              "Evitar hipoventilacao prolongada (Vigilancia)"
            ]
          }
        ]
      },
      {
        "name": "C5.P6 — Risco de progressao tromboembolica",
        "desc": "Grave. TVP associada, instabilidade clinica, imobilidade prolongada",
        "assess": [],
        "interv": [
          "Mobilizacao precoce quando seguro (Fundamental)",
          "Bomba muscular de MMII (Frequente)"
        ],
        "block": "C5 — Tromboembolismo pulmonar (TEP)",
        "goals": [
          "Prevenir complicacoes por imobilismo"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Mobilizacao precoce quando seguro (Fundamental)",
              "Bomba muscular de MMII (Frequente)"
            ]
          }
        ]
      },
      {
        "name": "C6.P1 — Queda de retorno venoso induzida por PEEP/pressao positiva",
        "desc": "Grave. Queda de PAM apos aumento de PEEP/EPAP, reducao debito urinario, taquicardia reacional, baixo debito",
        "assess": [],
        "interv": [
          "Regra de ouro: Em cardiopata, toda PEEP e uma droga vasoativa (Conceito)",
          "Comecar PEEP 5 cmH₂O, subir em passos pequenos (2 cmH₂O) (Titulacao)",
          "Apos cada ajuste: checar PA, FC, SpO₂, perfusao, debito urinario (Monitorizacao)",
          "Criterio de limite: queda PA, taquicardia reacional, sinais baixo debito (PARADA)"
        ],
        "block": "C5 — Tromboembolismo pulmonar (TEP)",
        "goals": [
          "Otimizar PEEP sem comprometer hemodinamica"
        ],
        "phases": [
          {
            "timeframe": "0-2h",
            "interv": [
              "Regra de ouro: Em cardiopata, toda PEEP e uma droga vasoativa (Conceito)",
              "Comecar PEEP 5 cmH₂O, subir em passos pequenos (2 cmH₂O) (Titulacao)",
              "Apos cada ajuste: checar PA, FC, SpO₂, perfusao, debito urinario (Monitorizacao)",
              "Criterio de limite: queda PA, taquicardia reacional, sinais baixo debito (PARADA)"
            ]
          }
        ]
      },
      {
        "name": "C6.P2 — Aumento de pos-carga de ventriculo direito (VD)",
        "desc": "Critico. PEEP elevada, hipercapnia, hipoxia, ECO com VD dilatado/septo em D, piora hemodinamica",
        "assess": [],
        "interv": [
          "Evitar PEEP excessiva (Fundamental)",
          "Corrigir hipoxia e hipercapnia (gatilhos RVP ↑) (Tratamento)",
          "PEEP minima necessaria (Estrategia)"
        ],
        "block": "C6 — Interacao coracao-ventilacao",
        "goals": [
          "Minimizar pos-carga de VD"
        ],
        "phases": [
          {
            "timeframe": "0-2h",
            "interv": [
              "Evitar PEEP excessiva (Fundamental)",
              "Corrigir hipoxia e hipercapnia (gatilhos RVP ↑) (Tratamento)",
              "PEEP minima necessaria (Estrategia)"
            ]
          }
        ]
      },
      {
        "name": "C6.P3 — Hipotensao associada a manobras ventilatorias",
        "desc": "Grave. Queda de PA durante recrutamento alveolar, aumento de PEEP, inicio de VNI/VM",
        "assess": [],
        "interv": [
          "Toda manobra ventilatoria e um teste hemodinamico (Conceito)",
          "Manobra de recrutamento: so se realmente necessario, com equipe alinhada, monitorizacao rigorosa (Cautela)",
          "Contraindicacoes relativas: choque nao controlado, VD falente, hipovolemia (Avaliar)"
        ],
        "block": "C6 — Interacao coracao-ventilacao",
        "goals": [
          "Realizar manobras com seguranca hemodinamica"
        ],
        "phases": [
          {
            "timeframe": "0-1h",
            "interv": [
              "Toda manobra ventilatoria e um teste hemodinamico (Conceito)",
              "Manobra de recrutamento: so se realmente necessario, com equipe alinhada, monitorizacao rigorosa (Cautela)",
              "Contraindicacoes relativas: choque nao controlado, VD falente, hipovolemia (Avaliar)"
            ]
          }
        ]
      },
      {
        "name": "C6.P4 — Dependencia de suporte ventilatorio em cardiopata grave",
        "desc": "Critico. Falha repetida de desmame, edema pulmonar recorrente no TRE, dispneia/congestao ao reduzir suporte",
        "assess": [],
        "interv": [
          "Problema classico: TRE → edema pulmonar → falha (Reconhecer)",
          "Otimizar: PEEP antes do teste, volemia, congestao pulmonar (Preparacao)",
          "Preferir: PSV com PEEP baixa. T-piece com extremo cuidado (Tecnica)",
          "Sinais falha precoce: dispneia subita, taquicardia, aumento PA, crepitacoes, queda SpO₂ (Vigilancia)"
        ],
        "block": "C6 — Interacao coracao-ventilacao",
        "goals": [
          "Facilitar desmame ventilatorio"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Problema classico: TRE → edema pulmonar → falha (Reconhecer)",
              "Otimizar: PEEP antes do teste, volemia, congestao pulmonar (Preparacao)",
              "Preferir: PSV com PEEP baixa. T-piece com extremo cuidado (Tecnica)",
              "Sinais falha precoce: dispneia subita, taquicardia, aumento PA, crepitacoes, queda SpO₂ (Vigilancia)"
            ]
          }
        ]
      },
      {
        "name": "C6.P5 — Hipoxemia/hipercapnia com impacto hemodinamico",
        "desc": "Grave. SpO₂ < 92%, PaCO₂ > 50 mmHg, piora de PA/FC/perfusao associada",
        "assess": [],
        "interv": [
          "Oxigenio/CNAF: preferir sempre que possivel (Primeira escolha)",
          "VNI: indicada se edema/fadiga, mas EPAP 5-10 cmH₂O, monitorar PA (Com cautela)",
          "VM: Vt 6-8, Pplato < 30, ΔP < 12-14, PEEP minima necessaria (Se necessario)"
        ],
        "block": "C6 — Interacao coracao-ventilacao",
        "goals": [
          "Manter SpO₂ ≥ 92-96%, PaCO₂ aceitavel"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Oxigenio/CNAF: preferir sempre que possivel (Primeira escolha)",
              "VNI: indicada se edema/fadiga, mas EPAP 5-10 cmH₂O, monitorar PA (Com cautela)",
              "VM: Vt 6-8, Pplato < 30, ΔP < 12-14, PEEP minima necessaria (Se necessario)"
            ]
          }
        ]
      },
      {
        "name": "C7.P1 — Hipovolemia funcional / dependencia de pre-carga",
        "desc": "Grave. Hipotensao/labilidade pressorica, taquicardia, extremidades frias, TEC > 3s, oliguria, queda PA com cabeceira elevada/PEEP",
        "assess": [],
        "interv": [
          "Pressao positiva → ↓ retorno venoso → ↓ debito cardiaco (Fisiologia)",
          "Preferir: O₂ baixo fluxo, CNAF (se necessario) (Escolha)",
          "Evitar: EPAP/PEEP altas, VNI agressiva (Cautela)",
          "VM: PEEP minima (geralmente 5 cmH₂O), evitar recrutamento (Se necessario)",
          "Mobilizacao: subidas posturais lentas, monitorar PA a cada mudanca (Gradual)"
        ],
        "block": "C6 — Interacao coracao-ventilacao",
        "goals": [
          "Manter estabilidade hemodinamica"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Pressao positiva → ↓ retorno venoso → ↓ debito cardiaco (Fisiologia)",
              "Preferir: O₂ baixo fluxo, CNAF (se necessario) (Escolha)",
              "Evitar: EPAP/PEEP altas, VNI agressiva (Cautela)",
              "VM: PEEP minima (geralmente 5 cmH₂O), evitar recrutamento (Se necessario)",
              "Mobilizacao: subidas posturais lentas, monitorar PA a cada mudanca (Gradual)"
            ]
          }
        ]
      },
      {
        "name": "C7.P2 — Sobrecarga hidrica / congestao pulmonar e sistemica",
        "desc": "Grave. Edema periferico/anasarca, balanco hidrico positivo, estertores/congestao, RX com congestao, ganho ponderal",
        "assess": [],
        "interv": [
          "VNI (CPAP/BiPAP): EPAP 8-12 cmH₂O (ou conforme resposta) (Tratamento)",
          "CNAF: util para reduzir trabalho respiratorio (Suporte)",
          "VM: PEEP suficiente para manter alveolos abertos e melhorar oxigenacao (Se necessario)",
          "Posicionamento: sentado/poltrona = tratamento, evitar decubito horizontal (Terapeutico)",
          "Mobilizacao: parte do tratamento, ajuda na mobilizacao de liquido e ventilacao (Benefico)"
        ],
        "block": "C7 — Disturbios de volume",
        "goals": [
          "Usar pressao positiva como ferramenta terapeutica"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "VNI (CPAP/BiPAP): EPAP 8-12 cmH₂O (ou conforme resposta) (Tratamento)",
              "CNAF: util para reduzir trabalho respiratorio (Suporte)",
              "VM: PEEP suficiente para manter alveolos abertos e melhorar oxigenacao (Se necessario)",
              "Posicionamento: sentado/poltrona = tratamento, evitar decubito horizontal (Terapeutico)",
              "Mobilizacao: parte do tratamento, ajuda na mobilizacao de liquido e ventilacao (Benefico)"
            ]
          }
        ]
      },
      {
        "name": "C7.P3 — Hipoxemia secundaria a disturbio de volume",
        "desc": "Grave. SpO₂ < 92%, PaO₂ reduzida, aumento necessidade O₂, relacao com congestao/colapso",
        "assess": [],
        "interv": [
          "Hipovolemico: O₂/CNAF, evitar PEEP alta (Estrategia)",
          "Hipervolêmico: VNI/CPAP como terapia (Estrategia)"
        ],
        "block": "C7 — Disturbios de volume",
        "goals": [
          "Otimizar oxigenacao conforme estado volemico"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Hipovolemico: O₂/CNAF, evitar PEEP alta (Estrategia)",
              "Hipervolêmico: VNI/CPAP como terapia (Estrategia)"
            ]
          }
        ]
      },
      {
        "name": "C7.P4 — Instabilidade hemodinamica induzida por ajustes ventilatorios/posturais",
        "desc": "Grave. Queda de PA apos aumento PEEP/EPAP, inicio VNI, mudancas posturais, taquicardia, baixo debito",
        "assess": [],
        "interv": [
          "Ajustar em pequenos passos (Gradual)",
          "Monitorar PA, FC, perfusao apos cada mudanca (Vigilancia)"
        ],
        "block": "C7 — Disturbios de volume",
        "goals": [
          "Ajustes graduais com monitorizacao"
        ],
        "phases": [
          {
            "timeframe": "0-2h",
            "interv": [
              "Ajustar em pequenos passos (Gradual)",
              "Monitorar PA, FC, perfusao apos cada mudanca (Vigilancia)"
            ]
          }
        ]
      },
      {
        "name": "C7.P5 — Intolerancia a mobilizacao por desequilibrio de volume",
        "desc": "Moderado. Tontura, queda PA ao sentar/ficar em pe, dessaturacao associada a congestao, fadiga precoce",
        "assess": [],
        "interv": [
          "Hipovolemico: microetapas, pausas longas, monitorar PA a cada mudanca (Cautela)",
          "Hipervolêmico: mobilizacao como tratamento (Terapeutico)",
          "Progressao: sedestacao → beira-leito → poltrona → ortostatismo → marcha (Gradual)"
        ],
        "block": "C7 — Disturbios de volume",
        "goals": [
          "Mobilizacao segura conforme volume"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Hipovolemico: microetapas, pausas longas, monitorar PA a cada mudanca (Cautela)",
              "Hipervolêmico: mobilizacao como tratamento (Terapeutico)",
              "Progressao: sedestacao → beira-leito → poltrona → ortostatismo → marcha (Gradual)"
            ]
          }
        ]
      },
      {
        "name": "C8.P1 — Queda de PA ao sentar ou ficar em pe (hipotensao ortostatica)",
        "desc": "Grave. Queda PAS ≥ 20 mmHg ou PAD ≥ 10 mmHg em ate 3 min, sintomas: tontura, escurecimento visual, sudorese fria, nausea, sincope",
        "assess": [],
        "interv": [
          "Preparacao: exercicios bomba muscular em leito (dorsiflexao/plantiflexao, extensao joelhos) (Antes de verticalizar)",
          "Respiracoes profundas (Preparacao)",
          "Elevacao progressiva cabeceira (Gradual)",
          "Compressao periferica: meias elasticas, faixas MMII (se disponivel) (Suporte)",
          "Verticalizacao cabeceira/leito: 30° → 45° → 60° → 75° → 90°, 3-5 min cada angulo (Opcao 1)",
          "Prancha ortostatica: 30° → 45° → 60° → 75° → 90°, 3-10 min/estagio, monitorar PA/FC/sintomas (Opcao 2)",
          "Treino funcional: sedestacao sustentada, transferencia leito-poltrona, sentar/levantar assistido, marcha estacionaria (Progressao)",
          "Fortalecimento bomba muscular: plantiflexao resistida, extensao joelhos, mini-agachamento (Varias vezes/dia)",
          "PARADA: queda PA significativa, tontura intensa, nausea, escurecimento visual, sudorese fria, palidez, sincope (Criterios)"
        ],
        "block": "C7 — Disturbios de volume",
        "goals": [
          "Permitir sedestacao segura e sustentada",
          "Tolerar ortostatismo por tempo progressivo"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Preparacao: exercicios bomba muscular em leito (dorsiflexao/plantiflexao, extensao joelhos) (Antes de verticalizar)",
              "Respiracoes profundas (Preparacao)",
              "Elevacao progressiva cabeceira (Gradual)",
              "Compressao periferica: meias elasticas, faixas MMII (se disponivel) (Suporte)"
            ]
          },
          {
            "timeframe": "24-72h",
            "interv": [
              "Verticalizacao cabeceira/leito: 30° → 45° → 60° → 75° → 90°, 3-5 min cada angulo (Opcao 1)",
              "Prancha ortostatica: 30° → 45° → 60° → 75° → 90°, 3-10 min/estagio, monitorar PA/FC/sintomas (Opcao 2)",
              "Treino funcional: sedestacao sustentada, transferencia leito-poltrona, sentar/levantar assistido, marcha estacionaria (Progressao)",
              "Fortalecimento bomba muscular: plantiflexao resistida, extensao joelhos, mini-agachamento (Varias vezes/dia)",
              "PARADA: queda PA significativa, tontura intensa, nausea, escurecimento visual, sudorese fria, palidez, sincope (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C8.P2 — Intolerancia a verticalizacao",
        "desc": "Grave. Incapacidade de manter sedestacao/ortostatismo, sintomas neurovegetativos importantes",
        "assess": [],
        "interv": [
          "Verticalizacao em microetapas com pausas (Estrategia)",
          "Monitorizacao continua (Vigilancia)"
        ],
        "block": "C8 — Hipotensao ortostatica e intolerancia postural",
        "goals": [
          "Tolerancia progressiva a mudancas posturais"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Verticalizacao em microetapas com pausas (Estrategia)",
              "Monitorizacao continua (Vigilancia)"
            ]
          }
        ]
      },
      {
        "name": "C8.P3 — Baixo retorno venoso por desacondicionamento e bomba muscular ineficiente",
        "desc": "Moderado. Fraqueza de MMII, edema de MMII, longo tempo de leito, queda de PA ao minimo esforco postural",
        "assess": [],
        "interv": [
          "Exercicios ativos MMII: bomba muscular frequente (Diario)",
          "Mobilizacao precoce (Fundamental)"
        ],
        "block": "C8 — Hipotensao ortostatica e intolerancia postural",
        "goals": [
          "Melhorar retorno venoso e controle postural"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Exercicios ativos MMII: bomba muscular frequente (Diario)",
              "Mobilizacao precoce (Fundamental)"
            ]
          }
        ]
      },
      {
        "name": "C8.P4 — Baixa tolerancia ao esforco funcional",
        "desc": "Moderado. Fadiga precoce, tontura, queda de PA com pequenas atividades",
        "assess": [],
        "interv": [
          "Progressao funcional gradual (Diario)",
          "Aumentar tempo em ortostatismo (Progressivo)"
        ],
        "block": "C8 — Hipotensao ortostatica e intolerancia postural",
        "goals": [
          "Iniciar treino de marcha assistida"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Progressao funcional gradual (Diario)",
              "Aumentar tempo em ortostatismo (Progressivo)"
            ]
          }
        ]
      },
      {
        "name": "C9.P1 — Isquemia miocardica aguda / risco de reinfarto",
        "desc": "Critico. Dor toracica tipica/recorrente, alteracoes ECG/telemetria, troponina elevada, instabilidade hemodinamica",
        "assess": [],
        "interv": [
          "Oxigenoterapia para SpO₂ 92-96% (evita hipoxia que piora isquemia) (Alvo)",
          "CNAF se FR ≥ 28-30 + esforco respiratorio (Reduz demanda)",
          "VNI se SCA + edema/congestao importante: CPAP 8-12 cmH₂O, monitorar PA (Se indicado)",
          "Cabeceira elevada (reduz dispneia e trabalho) (Posicionamento)",
          "Mobilizacao: sedestacao leito 10-20 min se liberado e estavel (Dose segura)",
          "D1-D2: poltrona 30-60 min, ortostatismo curto, marcha 5-20 m assistida (Progressao)",
          "D2-D3: marcha 20-100 m conforme tolerancia, treino AVDs simples com pausas (Funcional)",
          "Regra IAM: mobilizar sem disparar taquicardia, hipertensao e dor (Fundamento)",
          "PARADA: dor toracica/pressao, dispneia desproporcional, queda PA ou elevacao com sintomas, taquicardia sustentada, arritmia nova, dessaturacao (Criterios rigidos)"
        ],
        "block": "C8 — Hipotensao ortostatica e intolerancia postural",
        "goals": [
          "Evitar aumento de consumo miocardico de O₂",
          "Iniciar reabilitacao fase I hospitalar"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Oxigenoterapia para SpO₂ 92-96% (evita hipoxia que piora isquemia) (Alvo)",
              "CNAF se FR ≥ 28-30 + esforco respiratorio (Reduz demanda)",
              "VNI se SCA + edema/congestao importante: CPAP 8-12 cmH₂O, monitorar PA (Se indicado)",
              "Cabeceira elevada (reduz dispneia e trabalho) (Posicionamento)",
              "Mobilizacao: sedestacao leito 10-20 min se liberado e estavel (sem dor, hemodinamica estavel, sem arritmia) (Dose segura)"
            ]
          },
          {
            "timeframe": "24-72h",
            "interv": [
              "D1-D2: poltrona 30-60 min, ortostatismo curto, marcha 5-20 m assistida (Progressao)",
              "D2-D3: marcha 20-100 m conforme tolerancia, treino AVDs simples com pausas (Funcional)",
              "Regra IAM: mobilizar sem disparar taquicardia, hipertensao e dor (Fundamento)",
              "PARADA: dor toracica/pressao, dispneia desproporcional, queda PA ou elevacao com sintomas, taquicardia sustentada, arritmia nova, dessaturacao (Criterios rigidos)"
            ]
          }
        ]
      },
      {
        "name": "C9.P2 — Desequilibrio oferta/consumo de O₂ do miocardio",
        "desc": "Grave. Taquicardia, hipoxemia, anemia/hipovolemia, dor/ansiedade, febre/sepse concomitante",
        "assess": [],
        "interv": [
          "Suporte respiratorio adequado (Fundamental)",
          "Controle de dor e ansiedade (Essencial)",
          "Evitar esforcos desnecessarios (Economia)"
        ],
        "block": "C9 — Sindrome coronariana aguda (SCA/IAM)",
        "goals": [
          "Otimizar oferta e reduzir consumo"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Suporte respiratorio adequado (Fundamental)",
              "Controle de dor e ansiedade (Essencial)",
              "Evitar esforcos desnecessarios (Economia)"
            ]
          }
        ]
      },
      {
        "name": "C9.P3 — Dispneia/hipoxemia associada (congestao, edema, atelectasia, dor)",
        "desc": "Grave. SpO₂ < 92%, FR elevada, crepitacoes/congestao, RX sugestivo",
        "assess": [],
        "interv": [
          "Tratar congestao se presente (VNI como no C2) (Especifico)",
          "Expansao pulmonar se atelectasia (Especifico)"
        ],
        "block": "C9 — Sindrome coronariana aguda (SCA/IAM)",
        "goals": [
          "Melhorar oxigenacao e conforto"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Tratar congestao se presente (VNI como no C2) (Especifico)",
              "Expansao pulmonar se atelectasia (Especifico)"
            ]
          }
        ]
      },
      {
        "name": "C9.P4 — Risco de arritmias malignas no contexto de SCA",
        "desc": "Grave. Extrassistoles frequentes, TVNS, FA, instabilidade eletrica, sintomas (palpitacao, sincope, tontura)",
        "assess": [],
        "interv": [
          "Manter SpO₂ adequada (hipoxia e gatilho) (Vigilancia)",
          "Evitar esforcos que disparem FC excessiva (Cautela)"
        ],
        "block": "C9 — Sindrome coronariana aguda (SCA/IAM)",
        "goals": [
          "Prevenir arritmias por controle de gatilhos"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Manter SpO₂ adequada (hipoxia e gatilho) (Vigilancia)",
              "Evitar esforcos que disparem FC excessiva (Cautela)"
            ]
          }
        ]
      },
      {
        "name": "C9.P5 — Baixa tolerancia ao esforco / restricao funcional inicial",
        "desc": "Moderado. Dispneia e fadiga ao minimo esforco, medo de mobilizar, fraqueza e descondicionamento",
        "assess": [],
        "interv": [
          "Reabilitacao fase I progressiva (Gradual)",
          "Educacao: sinais de alerta (Orientacao)"
        ],
        "block": "C9 — Sindrome coronariana aguda (SCA/IAM)",
        "goals": [
          "Melhorar independencia para AVDs basicas"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Reabilitacao fase I progressiva (Gradual)",
              "Educacao: sinais de alerta (Orientacao)"
            ]
          }
        ]
      },
      {
        "name": "C9.P6 — Pos-procedimento (cateterismo/angioplastia) com restricoes e risco de sangramento",
        "desc": "Moderado. Puncao femoral/radial recente, dor local/hematoma, restricao de mobilidade do membro puncionado",
        "assess": [],
        "interv": [
          "Evitar flexao excessiva quadril (femoral) nas primeiras horas conforme protocolo (Cautela)",
          "Evitar carga/forca no punho (radial) se doloroso/hematoma (Cautela)",
          "Priorizar mobilizacao segura sem tracionar local (Seguranca)"
        ],
        "block": "C9 — Sindrome coronariana aguda (SCA/IAM)",
        "goals": [
          "Mobilizacao respeitando restricoes de puncao"
        ],
        "phases": [
          {
            "timeframe": "24-48h",
            "interv": [
              "Evitar flexao excessiva quadril (femoral) nas primeiras horas conforme protocolo (Cautela)",
              "Evitar carga/forca no punho (radial) se doloroso/hematoma (Cautela)",
              "Priorizar mobilizacao segura sem tracionar local (Seguranca)"
            ]
          }
        ]
      },
      {
        "name": "C10.P1 — Baixo debito / intolerancia ao esforco por limitacao valvar",
        "desc": "Grave. Fadiga/dispneia desproporcionais, hipotensao/labilidade ao ortostatismo, queda de performance funcional",
        "assess": [],
        "interv": [
          "Oxigenoterapia/CNAF se necessario (Suporte)",
          "VNI se congestao (comum em IM/EM/EAo descompensada): CPAP 8-12 cmH₂O, monitorar PA (Se indicado)",
          "Mobilizacao conservadora: sedestacao → poltrona (dose minima eficaz) (Segura)"
        ],
        "block": "C9 — Sindrome coronariana aguda (SCA/IAM)",
        "goals": [
          "Manter estabilidade hemodinamica sem disparar taquicardia ou hipotensao"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Oxigenoterapia/CNAF se necessario (Suporte)",
              "VNI se congestao (comum em IM/EM/EAo descompensada): CPAP 8-12 cmH₂O, monitorar PA (Se indicado)",
              "Mobilizacao conservadora: sedestacao → poltrona (dose minima eficaz) (Segura)"
            ]
          }
        ]
      },
      {
        "name": "C10.P2 — Congestao pulmonar/edema por falencia esquerda (IM/EM/EAo avancada)",
        "desc": "Critico. Ortopneia, DPN, crepitacoes, RX com congestao, hipoxemia, FR elevada",
        "assess": [],
        "interv": [
          "VNI/CPAP como no C2 (Tratamento)",
          "Posicionamento: sentado/poltrona (Terapeutico)"
        ],
        "block": "C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": [
          "Reduzir congestao, melhorar oxigenacao"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "VNI/CPAP como no C2 (Tratamento)",
              "Posicionamento: sentado/poltrona (Terapeutico)"
            ]
          }
        ]
      },
      {
        "name": "C10.P3 — Isquemia/sincope em estenose aortica grave (EAo)",
        "desc": "Critico. Sincope/presincope ao esforco, angina/dor toracica, PA nao sustenta em mudancas posturais",
        "assess": [],
        "interv": [
          "EAo: mobilizacao conservadora e lenta, etapas curtas (Cuidado especial)",
          "Priorizar: sedestacao → poltrona → ortostatismo 30-60s (Gradual)",
          "Evitar picos de esforco (sem \"levanta e anda\" rapido) (Cautela)",
          "Pausas longas e monitorizacao PA/FC (Vigilancia)",
          "PARADA EAo: tontura/presincope, queda PA, dor toracica, dispneia desproporcional (Criterios)"
        ],
        "block": "C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": [
          "Evitar sincope e isquemia"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "EAo: mobilizacao conservadora e lenta, etapas curtas (Cuidado especial)",
              "Priorizar: sedestacao → poltrona → ortostatismo 30-60s (Gradual)",
              "Evitar picos de esforco (sem \"levanta e anda\" rapido) (Cautela)",
              "Pausas longas e monitorizacao PA/FC (Vigilancia)",
              "PARADA EAo: tontura/presincope, queda PA, dor toracica, dispneia desproporcional (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C10.P4 — Taquicardia como inimiga (especialmente EM e IAo)",
        "desc": "Grave. FC elevada reduz enchimento diastolico (EM) e piora congestao, FC elevada encurta diastole (IAo)",
        "assess": [],
        "interv": [
          "EM: controle rigoroso de carga, sedestacao e marcha curta, CNAF/VNI se congesto, monitorar FC (Estrategia)",
          "IAo: evitar picos de FC, sessoes curtas com pausas, marcha fracionada (2×10m com pausa) (Estrategia)"
        ],
        "block": "C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": [
          "Controle rigoroso de carga para evitar disparos de FC"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "EM: controle rigoroso de carga, sedestacao e marcha curta, CNAF/VNI se congesto, monitorar FC (Estrategia)",
              "IAo: evitar picos de FC, sessoes curtas com pausas, marcha fracionada (2×10m com pausa) (Estrategia)"
            ]
          }
        ]
      },
      {
        "name": "C10.P5 — Hipoxemia e alto trabalho respiratorio aumentando carga cardiaca",
        "desc": "Grave. FR > 28-30, uso de musculatura acessoria, dessaturacao ao mobilizar/deitar, piora FC/PA",
        "assess": [],
        "interv": [
          "CNAF/VNI conforme necessidade (Suporte)",
          "IM: VNI/CPAP se congesto, mobilizacao com controle dispneia (Borg), estrategia tempo ↑ antes intensidade ↑ (Especifico)",
          "PARADA IM: dispneia intensa, dessaturacao, taquicardia sintomatica (Criterios)"
        ],
        "block": "C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": [
          "Reduzir trabalho respiratorio e demanda miocardica"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "CNAF/VNI conforme necessidade (Suporte)",
              "IM: VNI/CPAP se congesto, mobilizacao com controle dispneia (Borg), estrategia tempo ↑ antes intensidade ↑ (Especifico)",
              "PARADA IM: dispneia intensa, dessaturacao, taquicardia sintomatica (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C10.P6 — Pos-intervencao valvar (TAVI/valva cirurgica) com risco de complicacoes",
        "desc": "Grave. Pos-op imediato, drenos, dor, restricoes, risco de disturbios conducao/arritmias, sangramento",
        "assess": [],
        "interv": [
          "Terapia respiratoria: expansao pulmonar, tosse eficaz com protecao (C4) (Sessoes)",
          "Suporte ventilatorio: O₂, CNAF, VNI conforme necessidade (Se indicado)",
          "Progressao funcional: D0-D1 sedestacao/poltrona, D1-D2 ortostatismo/marcha 5-10m, D2-D3 marcha 20-50m (Gradual)",
          "Seguranca por puncao (TAVI/cateter): evitar flexao quadril (femoral) ou apoio punho (radial) conforme protocolo (Cautela)",
          "PARADA: dor toracica, queda PA, arritmia nova, dessaturacao, sangramento (Criterios)"
        ],
        "block": "C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": [
          "Recuperacao funcional segura pos-procedimento"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Terapia respiratoria: expansao pulmonar, tosse eficaz com protecao (C4) (Sessoes)",
              "Suporte ventilatorio: O₂, CNAF, VNI conforme necessidade (Se indicado)",
              "Progressao funcional: D0-D1 sedestacao/poltrona, D1-D2 ortostatismo/marcha 5-10m, D2-D3 marcha 20-50m (Gradual)",
              "Seguranca por puncao (TAVI/cateter): evitar flexao quadril (femoral) ou apoio punho (radial) conforme protocolo (Cautela)",
              "PARADA: dor toracica, queda PA, arritmia nova, dessaturacao, sangramento (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C10.P7 — Insuficiencia tricuspide / falencia direita (IT importante)",
        "desc": "Grave. Dependencia de pre-carga, edema periferico, baixa tolerancia postural, hipotensao com pressao positiva",
        "assess": [],
        "interv": [
          "Oxigenio/CNAF se hipoxemia, cautela com VNI/PEEP alta (Suporte)",
          "Mobilizacao: similar ao C1/C8, bomba muscular MMII e poltrona ajudam retorno venoso se tolerado (Estrategia)"
        ],
        "block": "C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": [
          "Mobilizacao em microdegraus sem colapso"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Oxigenio/CNAF se hipoxemia, cautela com VNI/PEEP alta (Suporte)",
              "Mobilizacao: similar ao C1/C8, bomba muscular MMII e poltrona ajudam retorno venoso se tolerado (Estrategia)"
            ]
          }
        ]
      },
      {
        "name": "C11.P1 — Hipoxemia com alto impacto sobre o VD (vasoconstricao hipoxica)",
        "desc": "Critico. SpO₂ < 92%, PaO₂ reduzida, piora hemodinamica associada a hipoxia",
        "assess": [],
        "interv": [
          "Regra: O VD MANDA. Hipoxia ↑ RVP → piora VD (Fisiologia)",
          "Oxigenoterapia para SpO₂ 92-96% (ou alvo individual) (Fundamental)",
          "CNAF frequentemente a melhor ponte: Fluxo 40-60 L/min, melhora oxigenacao com pouco impacto hemodinamico (Preferencial)",
          "VNI com cautela: EPAP/PEEP ↑ → ↓ retorno venoso → piora VD. EPAP 5-8 cmH₂O, monitorar PA/perfusao apos iniciar (Pressao minima eficaz)",
          "VM se necessario: estrategia VD-protetora (Vt 6-8, Pplato < 30, ΔP < 12-14, PEEP minima, evitar hipercapnia/acidose) (Protecao)",
          "Cabeceira elevada, evitar supino se piora (Posicionamento)",
          "Mobilizacao em microdegraus: passivo/bomba muscular → cabeceira elevada → sedestacao 2-10 min → poltrona → ortostatismo 30-60s (Progressao)",
          "PARADA: queda PA/baixo debito, dessaturacao, dispneia intensa, tontura, taquicardia sustentada (Criterios)"
        ],
        "block": "C10 — Valvopatias (EAo, IM, IAo, EM, IT)",
        "goals": [
          "Manter SpO₂ ≥ 92-96% para reduzir RVP",
          "Reduzir dependencia de alto suporte"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Regra: O VD MANDA. Hipoxia ↑ RVP → piora VD (Fisiologia)",
              "Oxigenoterapia para SpO₂ 92-96% (ou alvo individual) (Fundamental)",
              "CNAF frequentemente a melhor ponte: Fluxo 40-60 L/min (Preferencial)",
              "VNI com cautela: EPAP 5-8 cmH₂O, monitorar PA/perfusao (Pressao minima eficaz)",
              "VM se necessario: estrategia VD-protetora (Protecao)"
            ]
          },
          {
            "timeframe": "24-72h",
            "interv": [
              "Cabeceira elevada, evitar supino se piora (Posicionamento)",
              "Mobilizacao em microdegraus: passivo/bomba muscular → cabeceira elevada → sedestacao 2-10 min → poltrona → ortostatismo 30-60s (Progressao)",
              "PARADA: queda PA/baixo debito, dessaturacao, dispneia intensa, tontura, taquicardia sustentada (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C11.P2 — Hipercapnia/acidose respiratoria aumentando RVP (pos-carga do VD)",
        "desc": "Critico. PaCO₂ > 50 mmHg e/ou pH < 7,30, aumento esforco respiratorio, sonolencia, piora do VD",
        "assess": [],
        "interv": [
          "VNI se fadiga/hipercapnia: EPAP conservadora 5-8 cmH₂O (Cautela)",
          "VM: evitar hipercapnia grave e auto-PEEP (Se necessario)"
        ],
        "block": "C11 — Hipertensao pulmonar e cor pulmonale",
        "goals": [
          "Evitar hipercapnia/acidose significativa"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "VNI se fadiga/hipercapnia: EPAP conservadora 5-8 cmH₂O (Cautela)",
              "VM: evitar hipercapnia grave e auto-PEEP (Se necessario)"
            ]
          }
        ]
      },
      {
        "name": "C11.P3 — Sobrecarga de VD / baixo debito por aumento de RVP",
        "desc": "Critico. Hipotensao, hipoperfusao, taquicardia, extremidades frias, TEC prolongado, ECO: VD dilatado/septo em D",
        "assess": [],
        "interv": [
          "Evitar PEEP/EPAP excessiva (Fundamental)",
          "Evitar manobras de recrutamento (podem derrubar PA) (So se imprescindivel)"
        ],
        "block": "C11 — Hipertensao pulmonar e cor pulmonale",
        "goals": [
          "Evitar colapso hemodinamico"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Evitar PEEP/EPAP excessiva (Fundamental)",
              "Evitar manobras de recrutamento (podem derrubar PA) (So se imprescindivel)"
            ]
          }
        ]
      },
      {
        "name": "C11.P4 — Dependencia de pre-carga + risco de colapso com pressao positiva",
        "desc": "Critico. Queda de PA apos iniciar VNI/VM ou subir PEEP, piora com recrutamento, instabilidade postural importante",
        "assess": [],
        "interv": [
          "PEEP/EPAP minima necessaria (Estrategia)",
          "Mobilizacao apenas se PAM ≥ alvo, sem escalada recente suporte, SpO₂ estavel, FR toleravel (Criterios)"
        ],
        "block": "C11 — Hipertensao pulmonar e cor pulmonale",
        "goals": [
          "Minimizar impacto hemodinamico negativo"
        ],
        "phases": [
          {
            "timeframe": "0-2h",
            "interv": [
              "PEEP/EPAP minima necessaria (Estrategia)",
              "Mobilizacao apenas se PAM ≥ alvo, sem escalada recente suporte, SpO₂ estavel, FR toleravel (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C11.P5 — Aumento do trabalho respiratorio elevando consumo de O₂ e estresse simpatico",
        "desc": "Grave. FR > 28-30, uso de musculatura acessoria, taquicardia induzida por dispneia",
        "assess": [],
        "interv": [
          "CNAF: reduz trabalho com pouca PEEP (Ideal)",
          "VNI: carga fisiologica (Com cautela)"
        ],
        "block": "C11 — Hipertensao pulmonar e cor pulmonale",
        "goals": [
          "Reduzir trabalho respiratorio e estresse"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "CNAF: reduz trabalho com pouca PEEP (Ideal)",
              "VNI: carga fisiologica (Com cautela)"
            ]
          }
        ]
      },
      {
        "name": "C11.P6 — Intolerancia a mobilizacao por limitacao hemodinamica",
        "desc": "Grave. Tontura/presincope ao sentar/ficar em pe, queda de PA com pequenos esforcos, dessaturacao ao mobilizar",
        "assess": [],
        "interv": [
          "Microdegraus: similar ao C1 (Estrategia)",
          "Prevenir complicacoes por imobilismo (Objetivo)"
        ],
        "block": "C11 — Hipertensao pulmonar e cor pulmonale",
        "goals": [
          "Mobilizacao sem descompensar VD"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Microdegraus: similar ao C1 (Estrategia)",
              "Prevenir complicacoes por imobilismo (Objetivo)"
            ]
          }
        ]
      },
      {
        "name": "C12.P1 — Comprometimento ventilatorio pos-procedimento (dor, hipoventilacao, atelectasia)",
        "desc": "Grave. Padrao superficial, queda SpO₂, ausculta com reducao MV, RX com atelectasia/congestao, tosse ineficaz",
        "assess": [],
        "interv": [
          "Expansao pulmonar: respiracao diafragmatica, inspiracoes lentas profundas com pausas, 3-5 × 5-10 rep (Sessoes)",
          "Tosse eficaz com protecao: splinting com almofada/apoio, huffing/tosse assistida (Tecnica)",
          "Suporte ventilatorio: O₂ se SpO₂ < alvo, CNAF se esforco alto + hipoxemia, VNI se congestao/edema (Conforme necessidade)"
        ],
        "block": "C11 — Hipertensao pulmonar e cor pulmonale",
        "goals": [
          "Garantir ventilacao adequada e prevencao de atelectasia"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Expansao pulmonar: respiracao diafragmatica, inspiracoes lentas profundas com pausas, 3-5 × 5-10 rep (Sessoes)",
              "Tosse eficaz com protecao: splinting com almofada/apoio, huffing/tosse assistida (Tecnica)",
              "Suporte ventilatorio: O₂ se SpO₂ < alvo, CNAF se esforco alto + hipoxemia, VNI se congestao/edema (Conforme necessidade)"
            ]
          }
        ]
      },
      {
        "name": "C12.P2 — Instabilidade eletrica / disturbios de conducao pos-procedimento",
        "desc": "Grave. Bradicardia, BAV, pausas, arritmias novas em telemetria (risco aumentado especialmente pos-TAVI)",
        "assess": [],
        "interv": [
          "Mobilizacao apenas se ritmo sem instabilidade ativa (Criterio)",
          "Monitorar FC, PA, SpO₂, FR durante sessao (Vigilancia)"
        ],
        "block": "C12 — Pos-TAVI/Pos-Valva/Pos-Transplante",
        "goals": [
          "Monitorizacao e mobilizacao segura"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Mobilizacao apenas se ritmo sem instabilidade ativa (Criterio)",
              "Monitorar FC, PA, SpO₂, FR durante sessao (Vigilancia)"
            ]
          }
        ]
      },
      {
        "name": "C12.P3 — Instabilidade hemodinamica / labilidade pressorica",
        "desc": "Grave. PAM oscilante, necessidade de suporte vasoativo (UTI), hipotensao ao mobilizar",
        "assess": [],
        "interv": [
          "Mobilizacao apenas se PAM ≥ alvo e estavel (Criterio)",
          "Evitar queda PA ao mobilizar (Vigilancia)"
        ],
        "block": "C12 — Pos-TAVI/Pos-Valva/Pos-Transplante",
        "goals": [
          "Manter PAM ≥ alvo e estavel"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Mobilizacao apenas se PAM ≥ alvo e estavel (Criterio)",
              "Evitar queda PA ao mobilizar (Vigilancia)"
            ]
          }
        ]
      },
      {
        "name": "C12.P4 — Restricao por puncao vascular (TAVI/cateter) e risco de sangramento/hematoma",
        "desc": "Moderado. Puncao femoral/radial recente, dor local/hematoma, limitacao mobilidade do membro, restricoes conforme protocolo",
        "assess": [],
        "interv": [
          "Puncao femoral: evitar flexao excessiva quadril nas primeiras horas, cuidado em sentar/levantar (Protocolo local)",
          "Puncao radial: evitar apoio e forca no punho se doloroso/hematoma (Cautela)",
          "Inspecao do sitio de puncao antes/depois da sessao (Vigilancia)"
        ],
        "block": "C12 — Pos-TAVI/Pos-Valva/Pos-Transplante",
        "goals": [
          "Mobilizacao respeitando seguranca de puncao"
        ],
        "phases": [
          {
            "timeframe": "24-48h",
            "interv": [
              "Puncao femoral: evitar flexao excessiva quadril nas primeiras horas, cuidado em sentar/levantar (Protocolo local)",
              "Puncao radial: evitar apoio e forca no punho se doloroso/hematoma (Cautela)",
              "Inspecao do sitio de puncao antes/depois da sessao (Vigilancia)"
            ]
          }
        ]
      },
      {
        "name": "C12.P5 — Fraqueza e descondicionamento (pos-UTI/pos-cirurgia)",
        "desc": "Moderado. Dificuldade em transferencias, baixa tolerancia a marcha, fadiga precoce",
        "assess": [],
        "interv": [
          "Progressao: D0-D1 sedestacao/poltrona, D1-D2 ortostatismo 30-120s/marcha 5-10m, D2-D3 marcha 20-50m (Adaptavel)",
          "PARADA: dor toracica, queda PA, arritmia nova, dessaturacao, sangramento, tontura (Criterios)"
        ],
        "block": "C12 — Pos-TAVI/Pos-Valva/Pos-Transplante",
        "goals": [
          "Melhorar independencia em transferencias"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Progressao: D0-D1 sedestacao/poltrona, D1-D2 ortostatismo 30-120s/marcha 5-10m, D2-D3 marcha 20-50m (Adaptavel)",
              "PARADA: dor toracica, queda PA, arritmia nova, dessaturacao, sangramento, tontura (Criterios)"
            ]
          }
        ]
      },
      {
        "name": "C12.P6 — Situacoes especificas do transplante: resposta cronotropica alterada",
        "desc": "Moderado. FC de repouso mais alta, resposta ao esforco menos previsivel (transplante cardiaco)",
        "assess": [],
        "interv": [
          "Monitorar: PA, sintomas, SpO₂, percepcao de esforco (Borg) (Objetiva)",
          "FC menos confiavel como marcador de esforco (Conhecimento)"
        ],
        "block": "C12 — Pos-TAVI/Pos-Valva/Pos-Transplante",
        "goals": [
          "Monitorizacao mais objetiva"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Monitorar: PA, sintomas, SpO₂, percepcao de esforco (Borg) (Objetiva)",
              "FC menos confiavel como marcador de esforco (Conhecimento)"
            ]
          }
        ]
      },
      {
        "name": "C13.P1 — Descondicionamento cardiovascular agudo",
        "desc": "Moderado. Fadiga e dispneia a esforcos minimos, queda importante de tolerancia funcional, imobilismo recente/UTI/pos-evento",
        "assess": [],
        "interv": [
          "Criterios para entrar: sem dor toracica ativa, sem arritmia instavel, hemodinamica estavel, SpO₂ estavel, liberacao clinica (Elegibilidade)",
          "NIVEL 1: exercicios ativos MMSS/MMII, sedestacao sustentada, transferencia leito↔poltrona (Leito/poltrona)",
          "NIVEL 2: ortostatismo com apoio, marcha estacionaria, sentar/levantar (Ortostatismo)",
          "NIVEL 3: marcha no quarto/corredor 5-20m → 20-100+m conforme tolerancia (Marcha)"
        ],
        "block": "C12 — Pos-TAVI/Pos-Valva/Pos-Transplante",
        "goals": [
          "Sentar no leito/poltrona com seguranca",
          "Ficar em pe com seguranca"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Criterios para entrar: sem dor toracica ativa, sem arritmia instavel, hemodinamica estavel, SpO₂ estavel, liberacao clinica (Elegibilidade)",
              "NIVEL 1: exercicios ativos MMSS/MMII, sedestacao sustentada, transferencia leito↔poltrona (Leito/poltrona)"
            ]
          },
          {
            "timeframe": "24-72h",
            "interv": [
              "NIVEL 2: ortostatismo com apoio, marcha estacionaria, sentar/levantar (Ortostatismo)",
              "NIVEL 3: marcha no quarto/corredor 5-20m → 20-100+m conforme tolerancia (Marcha)"
            ]
          }
        ]
      },
      {
        "name": "C13.P2 — Baixa tolerancia ortostatica e ao esforco",
        "desc": "Moderado. Tontura, hipotensao ao sentar/ficar em pe, taquicardia ou dispneia precoce, pausas muito frequentes",
        "assess": [],
        "interv": [
          "Progressao gradual conforme tolerancia (Individualizado)",
          "Monitorar: FC, PA, SpO₂, FR, Borg (dispneia e esforco) (Continuo)"
        ],
        "block": "C13 — Reabilitacao cardiaca fase I",
        "goals": [
          "Iniciar marcha assistida curta"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Progressao gradual conforme tolerancia (Individualizado)",
              "Monitorar: FC, PA, SpO₂, FR, Borg (dispneia e esforco) (Continuo)"
            ]
          }
        ]
      },
      {
        "name": "C13.P3 — Medo de mobilizar / comportamento de evitacao",
        "desc": "Leve. Inseguranca do paciente, recusa ou rigidez excessiva, postura de \"fragilidade aprendida\"",
        "assess": [],
        "interv": [
          "Educacao terapeutica: ensinar sinais de alerta, importancia da progressao, conservacao de energia (Orientacao)",
          "Progressao gradual com reforco positivo (Abordagem)"
        ],
        "block": "C13 — Reabilitacao cardiaca fase I",
        "goals": [
          "Reduzir medo e hipervigilancia disfuncional"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Educacao terapeutica: ensinar sinais de alerta, importancia da progressao, conservacao de energia (Orientacao)",
              "Progressao gradual com reforco positivo (Abordagem)"
            ]
          }
        ]
      },
      {
        "name": "C13.P4 — Risco de complicacoes por imobilismo",
        "desc": "Moderado. Risco de: trombose, atelectasia, perda de massa muscular, perda de autonomia",
        "assess": [],
        "interv": [
          "Mobilizacao precoce conforme criterios (Fundamental)",
          "Bomba muscular de MMII (Frequente)"
        ],
        "block": "C13 — Reabilitacao cardiaca fase I",
        "goals": [
          "Prevenir complicacoes"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Mobilizacao precoce conforme criterios (Fundamental)",
              "Bomba muscular de MMII (Frequente)"
            ]
          }
        ]
      },
      {
        "name": "C13.P5 — Progressao funcional ate a alta",
        "desc": "Leve. Necessidade de marcha funcional, subir/descer degraus se necessario para casa, entender limites",
        "assess": [],
        "interv": [
          "NIVEL 4 (funcional): treino de escada se indicado para casa, AVDs com deslocamento, simulacao de tarefas reais (Progressao)",
          "Dosagem: Intensidade Borg 2-4 (leve a moderado), Duracao curtos blocos 3-10 min, Frequencia 1-2x/dia (Parametros)",
          "PARADA: dor toracica, dispneia desproporcional, tontura, queda/elevacao PA com sintomas, arritmia nova, dessaturacao (Criterios classicos)"
        ],
        "block": "C13 — Reabilitacao cardiaca fase I",
        "goals": [
          "Alta com mobilidade funcional segura"
        ],
        "phases": [
          {
            "timeframe": "Ate alta",
            "interv": [
              "NIVEL 4 (funcional): treino de escada se indicado para casa, AVDs com deslocamento, simulacao de tarefas reais (Progressao)",
              "Dosagem: Intensidade Borg 2-4 (leve a moderado), Duracao curtos blocos 3-10 min, Frequencia 1-2x/dia (Parametros)",
              "PARADA: dor toracica, dispneia desproporcional, tontura, queda/elevacao PA com sintomas, arritmia nova, dessaturacao (Criterios classicos)"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "respiratory",
    "name": "Sistema Respiratorio",
    "icon": "M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152-7.065c-.022-.826-.16-1.875-.903-2.373-.715-.478-1.755-.142-2.29.526-1.084 1.352-2.07 1.934-3.862 1.934s-2.778-.582-3.862-1.934c-.535-.668-1.575-1.004-2.29-.526-.743.498-.881 1.547-.903 2.373a23.91 23.91 0 01-1.152 7.065C5.353 13.258 9.117 12.75 12 12.75z",
    "color": "#38bdf8",
    "problems": [
      {
        "name": "R1.1 — Hipoxemia leve a moderada em resp. espontanea",
        "desc": "Moderado. SpO₂ < 92% (geral) ou < 88-90% (DPOC), FR normal/leve↑, sem fadiga grave",
        "assess": [
          "Atingir SpO₂ alvo: Geral 92-96%, DPOC 88-92%",
          "Menor suporte que mantem SpO₂ alvo",
          "Reduzir gradualmente dependencia de O₂"
        ],
        "interv": [
          "Cateter nasal 1-5 L/min (titular)",
          "Mascara simples 5-10 L/min se insuficiente",
          "Mascara com reservatorio 10-15 L/min se necessario",
          "Posicionamento terapeutico, mobilizacao precoce",
          "Monitorar SpO₂, FR, FC, esforco respiratorio"
        ],
        "block": "R1 — Oxigenoterapia, HFNC e VNI",
        "goals": [
          "Atingir SpO₂ alvo: Geral 92-96%, DPOC 88-92%",
          "Menor suporte que mantem SpO₂ alvo",
          "Reduzir gradualmente dependencia de O₂"
        ],
        "phases": []
      },
      {
        "name": "R1.2 — Hipoxemia moderada a grave com alto trabalho respiratorio",
        "desc": "Grave. SpO₂ < alvo com mascara reservatorio, FR > 28-30, musculatura acessoria",
        "assess": [
          "Reduzir trabalho respiratorio, melhorar SpO₂",
          "Estabilizar e evitar intubacao"
        ],
        "interv": [
          "HFNC fluxo 40-60 L/min, FiO₂ alto e reduzir conforme SpO₂",
          "Primeiro aumentar fluxo, depois reduzir FiO₂",
          "Posicao sentada/tripe",
          "Higiene bronquica se secrecao; reavaliar 15-30-60 min",
          "Criterios de falha: FR>30, esforco nao reduz → escalar VNI/IOT"
        ],
        "block": "R1 — Oxigenoterapia, HFNC e VNI",
        "goals": [
          "Reduzir trabalho respiratorio, melhorar SpO₂",
          "Estabilizar e evitar intubacao"
        ],
        "phases": []
      },
      {
        "name": "R1.3 — Insuf. respiratoria com componente ventilatorio (hipercapnia)",
        "desc": "Critico. PaCO₂ elevada + pH < 7,35, sonolencia, FR alta com baixa efetividade",
        "assess": [
          "Reduzir trabalho, melhorar pH e ventilacao alveolar",
          "Reverter falencia e evitar intubacao"
        ],
        "interv": [
          "VNI: IPAP 10-14 cmH₂O, EPAP 4-6, FiO₂ titular",
          "Ajustar por Vt espontaneo, FR, conforto, gasometria, vazamento",
          "Pausas programadas; higiene bronquica antes longos periodos",
          "Monitorar 1-2h: FR, SpO₂, consciencia, fadiga, gaso",
          "Criterios de falha: piora consciencia, instabilidade → IOT"
        ],
        "block": "R1 — Oxigenoterapia, HFNC e VNI",
        "goals": [
          "Reduzir trabalho, melhorar pH e ventilacao alveolar",
          "Reverter falencia e evitar intubacao"
        ],
        "phases": []
      },
      {
        "name": "R1.4 — Intolerancia a interface / falha de adaptacao",
        "desc": "Moderado. Ansiedade, vazamento, dor facial, claustrofobia, lesao pele",
        "assess": [
          "Manter suporte nao invasivo por blocos progressivos"
        ],
        "interv": [
          "Trocar tipo/tamanho interface",
          "Ajustar tirantes e vazamentos",
          "Adaptacao gradual com pausas programadas",
          "Umidificacao adequada"
        ],
        "block": "R1 — Oxigenoterapia, HFNC e VNI",
        "goals": [
          "Manter suporte nao invasivo por blocos progressivos"
        ],
        "phases": []
      },
      {
        "name": "R1.5 — Dependencia prolongada de oxigenio",
        "desc": "Moderado. Estavel mas nao reduz O₂ sem dessaturar",
        "assess": [
          "Reduzir progressivamente necessidade de O₂"
        ],
        "interv": [
          "Avaliar causa: descondicionamento, atelectasia, congestao, shunt",
          "Mobilizacao progressiva 2-3x/dia",
          "Reexpansao pulmonar, treino funcional com SpO₂",
          "Ajustar O₂ durante esforco"
        ],
        "block": "R1 — Oxigenoterapia, HFNC e VNI",
        "goals": [
          "Reduzir progressivamente necessidade de O₂"
        ],
        "phases": []
      },
      {
        "name": "R2.1 — Tosse ineficaz",
        "desc": "Grave. PCF < 160 (alto risco < 60 inutil), PEmax < 60, secrecao sem aspiracao",
        "assess": [
          "Aumentar fluxo tosse efetivo, eliminar secrecao"
        ],
        "interv": [
          "Medir PCF, PEmax, PImax",
          "Treino muscular expiratorio POWERbreathe 30-50% PEmax",
          "Treino tosse: insp profunda → pausa → exp explosiva; huffing",
          "Tosse assistida manual; se PCF<60: tosse assistida mecanica",
          "Reavaliar PCF/PEmax 48-72h"
        ],
        "block": "R2 — Via aerea, secrecao e higiene bronquica",
        "goals": [
          "Aumentar fluxo tosse efetivo, eliminar secrecao"
        ],
        "phases": []
      },
      {
        "name": "R2.2 — Hipoventilacao / baixo volume corrente em resp. espontanea",
        "desc": "Moderado. VC < 5-7 mL/kg, VE baixo, FR alta superficial, atelectasia basal",
        "assess": [
          "Aumentar volume corrente, melhorar expansibilidade"
        ],
        "interv": [
          "Ventilometria VC, VE; avaliar dor, mobilidade toracica",
          "Exercicios ventilatorios: inspiracao lenta profunda, fracionada",
          "Inspirometria incentivo; sedestacao, ortostatismo precoce",
          "Mobilizacao global 2-3x/dia; repetir ventilometria diario"
        ],
        "block": "R2 — Via aerea, secrecao e higiene bronquica",
        "goals": [
          "Aumentar volume corrente, melhorar expansibilidade"
        ],
        "phases": []
      },
      {
        "name": "R2.3 — Fraqueza muscular respiratoria",
        "desc": "Grave. PImax < -60 (< -30 grave), desmame dificil, tosse fraca",
        "assess": [
          "Iniciar treino muscular respiratorio"
        ],
        "interv": [
          "TMI: POWERbreathe 30-50% PImax, 2x/dia, 2-3 series 10-15 rep",
          "Progressao carga a cada 3-5 dias",
          "Mobilizacao global; medir PImax/PEmax 5-7 dias"
        ],
        "block": "R2 — Via aerea, secrecao e higiene bronquica",
        "goals": [
          "Iniciar treino muscular respiratorio"
        ],
        "phases": []
      },
      {
        "name": "R2.4 — Secrecao espessa / desidratada",
        "desc": "Moderado. Aspiracao dificil, secrecao seca/aderida",
        "assess": [
          "Reduzir viscosidade, facilitar remocao"
        ],
        "interv": [
          "Corrigir umidificacao; avaliar hidratacao sistemica",
          "Higiene bronquica frequente",
          "Evitar aspiracao traumatica repetitiva"
        ],
        "block": "R2 — Via aerea, secrecao e higiene bronquica",
        "goals": [
          "Reduzir viscosidade, facilitar remocao"
        ],
        "phases": []
      },
      {
        "name": "R2.5 — Atelectasia por retencao / hipoventilacao",
        "desc": "Grave. RX colapso segmentar/lobar, MV reduzido, hipoxemia",
        "assess": [
          "Reexpandir area colapsada"
        ],
        "interv": [
          "Posicionamento: pulmao afetado para cima 2-4h",
          "Exercicios reexpansao; se VM: MRA + PEEP adequada",
          "Reavaliar clinica e imagem diario"
        ],
        "block": "R2 — Via aerea, secrecao e higiene bronquica",
        "goals": [
          "Reexpandir area colapsada"
        ],
        "phases": []
      },
      {
        "name": "R2.6 — Pressao de cuff inadequada",
        "desc": "Moderado. Pcuff < 20 (vazamento/aspiracao) ou > 30 (lesao traqueal)",
        "assess": [
          "Pcuff 20-30 cmH₂O (ideal 25)"
        ],
        "interv": [
          "Medir Pcuff com cuffometro; ajustar volume cuff",
          "Verificar vazamento Vt exp vs insp; auscultar regiao glotica",
          "Reavaliar Pcuff 12/12h; registrar em prontuario"
        ],
        "block": "R2 — Via aerea, secrecao e higiene bronquica",
        "goals": [
          "Pcuff 20-30 cmH₂O (ideal 25)"
        ],
        "phases": []
      },
      {
        "name": "R2.7 — Risco de aspiracao / disfagia",
        "desc": "Grave. Rebaixamento, AVE/TRM, falha teste degluticao, FOIS < 5",
        "assess": [
          "Prevenir pneumonia aspirativa"
        ],
        "interv": [
          "Cabeceira ≥ 30-45°; higiene oral 3-4x/dia",
          "Aspiracao orofaringea PRN; Pcuff 20-30",
          "Pre-extubacao: teste tosse voluntaria, degluticao agua 3-10ml",
          "Se falha: adiar extubacao, fonoaudiologia; considerar TQT"
        ],
        "block": "R2 — Via aerea, secrecao e higiene bronquica",
        "goals": [
          "Prevenir pneumonia aspirativa"
        ],
        "phases": []
      },
      {
        "name": "R3.1 — IRA hipoxemica",
        "desc": "Critico. SpO₂ < 90-92% ar, PaO₂ < 60, P/F < 300",
        "assess": [
          "Corrigir hipoxemia, reduzir trabalho"
        ],
        "interv": [
          "Escalonamento: cateter → mascara → reservatorio → HFNC → VNI → VM",
          "O₂ titular SpO₂ alvo; HFNC 40-60 L/min; VNI EPAP 5-10",
          "Posicionamento, mobilizacao precoce, higiene bronquica",
          "FALHA: FR>30, P/F<150 → escalar"
        ],
        "block": "R3 — Insuf. respiratoria aguda",
        "goals": [
          "Corrigir hipoxemia, reduzir trabalho"
        ],
        "phases": []
      },
      {
        "name": "R3.2 — IRA hipercapnica",
        "desc": "Critico. PaCO₂ > 45, pH < 7,35, sonolencia/asterixis",
        "assess": [
          "Melhorar ventilacao alveolar, corrigir acidose"
        ],
        "interv": [
          "VNI: IPAP 10-14, EPAP 4-6; ajustar por Vt, FR, PaCO₂",
          "Interface e vedacao; pausas programadas",
          "Gasometria 1-2h; FALHA → VM invasiva"
        ],
        "block": "R3 — Insuf. respiratoria aguda",
        "goals": [
          "Melhorar ventilacao alveolar, corrigir acidose"
        ],
        "phases": []
      },
      {
        "name": "R3.3 — IRA mista (hipoxemica + hipercapnica)",
        "desc": "Critico. PaO₂ baixa + PaCO₂ alta + pH alterado",
        "assess": [
          "Estabilizar oxigenacao e ventilacao"
        ],
        "interv": [
          "HFNC ou VNI conforme perfil; baixo limiar para VM",
          "Monitorizacao intensiva; tratar causa base agressivamente"
        ],
        "block": "R3 — Insuf. respiratoria aguda",
        "goals": [
          "Estabilizar oxigenacao e ventilacao"
        ],
        "phases": []
      },
      {
        "name": "R3.4 — Fadiga muscular respiratoria",
        "desc": "Critico. FR > 35, acessorios, sudorese, paradoxo, PImax < -30, Vt caindo",
        "assess": [
          "Reduzir trabalho imediato, prevenir parada"
        ],
        "interv": [
          "Suporte ventilatorio HFNC/VNI/VM conforme gravidade",
          "Evitar exercicios nesse momento; apos estabilizacao: TMI progressivo"
        ],
        "block": "R3 — Insuf. respiratoria aguda",
        "goals": [
          "Reduzir trabalho imediato, prevenir parada"
        ],
        "phases": []
      },
      {
        "name": "R3.5 — Falencia respiratoria iminente",
        "desc": "Critico. Rebaixamento, exaustao, instabilidade, gaso grave",
        "assess": [
          "Garantir via aerea e ventilacao"
        ],
        "interv": [
          "Preparar VM invasiva; pre-oxigenacao; auxiliar equipe IOT",
          "Pos-intubacao: protocolo VM protetora (R4)"
        ],
        "block": "R3 — Insuf. respiratoria aguda",
        "goals": [
          "Garantir via aerea e ventilacao"
        ],
        "phases": []
      },
      {
        "name": "R4-A1 — VM fora da zona protetora (risco VILI)",
        "desc": "Critico. Vt > 8 mL/kg PBW, Pplat > 30, ΔP > 15, SI fora 0,9-1,1, Cest < 30",
        "assess": [
          "Vt 4-6 mL/kg PBW, Pplat ≤ 30, ΔP < 15"
        ],
        "interv": [
          "Medir Vt, Pplat, PEEP, ΔP, Cest por plantao",
          "Reduzir Vt stepwise; hipercapnia permissiva se pH ≥ 7,20",
          "Titular PEEP por Cest/ΔP; recrutamento se indicado; pronacao se P/F < 150"
        ],
        "block": "R4-A — VM: Mecanica e protecao",
        "goals": [
          "Vt 4-6 mL/kg PBW, Pplat ≤ 30, ΔP < 15"
        ],
        "phases": []
      },
      {
        "name": "R4-A2 — Driving pressure elevado",
        "desc": "Critico. ΔP > 15 cmH₂O",
        "assess": [
          "ΔP < 15 (ideal < 12)"
        ],
        "interv": [
          "Reduzir Vt; testar PEEP; avaliar parede/abdome; Vt ultrabaixo se necessario"
        ],
        "block": "R4-A — VM: Mecanica e protecao",
        "goals": [
          "ΔP < 15 (ideal < 12)"
        ],
        "phases": []
      },
      {
        "name": "R4-A3 — Pressao de plato elevada",
        "desc": "Grave. Pplat > 30 cmH₂O",
        "assess": [
          "Pplat ≤ 30 (ideal < 28)"
        ],
        "interv": [
          "Reduzir Vt; rever PEEP; avaliar pressao abdominal"
        ],
        "block": "R4-A — VM: Mecanica e protecao",
        "goals": [
          "Pplat ≤ 30 (ideal < 28)"
        ],
        "phases": []
      },
      {
        "name": "R4-A4 — Volume corrente excessivo",
        "desc": "Grave. Vt > 8 mL/kg PBW",
        "assess": [
          "Vt 4-6 mL/kg PBW"
        ],
        "interv": [
          "Recalcular PBW; ajustar Vt no ventilador; reavaliar gaso 30-60 min"
        ],
        "block": "R4-A — VM: Mecanica e protecao",
        "goals": [
          "Vt 4-6 mL/kg PBW"
        ],
        "phases": []
      },
      {
        "name": "R4-A5 — Complacencia pulmonar muito baixa",
        "desc": "Grave. Cest < 30 mL/cmH₂O",
        "assess": [
          "Melhorar recrutamento, minimizar estresse"
        ],
        "interv": [
          "Titular PEEP por melhor Cest; pronacao se SDRA; MRA se indicado"
        ],
        "block": "R4-A — VM: Mecanica e protecao",
        "goals": [
          "Melhorar recrutamento, minimizar estresse"
        ],
        "phases": []
      },
      {
        "name": "R4-A6 — Stress index alterado",
        "desc": "Moderado. SI < 0,9 (colapso) ou > 1,1 (hiperdistensao)",
        "assess": [
          "SI entre 0,9-1,1"
        ],
        "interv": [
          "SI < 0,9 → subir PEEP; SI > 1,1 → reduzir PEEP ou Vt"
        ],
        "block": "R4-A — VM: Mecanica e protecao",
        "goals": [
          "SI entre 0,9-1,1"
        ],
        "phases": []
      },
      {
        "name": "R4-A7 — Hiperinsuflacao / hiperdistensao global",
        "desc": "Grave. Curvas achatadas, ΔP alto, Cest piora ao subir PEEP",
        "assess": [
          "Reduzir volumes pulmonares finais"
        ],
        "interv": [
          "Reduzir PEEP e Vt; reavaliar hemodinamica"
        ],
        "block": "R4-A — VM: Mecanica e protecao",
        "goals": [
          "Reduzir volumes pulmonares finais"
        ],
        "phases": []
      },
      {
        "name": "R4-B1 — Hipoxemia refrataria em VM",
        "desc": "Critico. P/F < 150, SpO₂ < 90% com FiO₂ ≥ 0,8",
        "assess": [
          "Aumentar P/F, FiO₂ < 0,6"
        ],
        "interv": [
          "Otimizar PEEP; MRA se recrutavel; pronacao se P/F < 150"
        ],
        "block": "R4-B — VM: Oxigenacao e recrutamento",
        "goals": [
          "Aumentar P/F, FiO₂ < 0,6"
        ],
        "phases": []
      },
      {
        "name": "R4-B2 — PEEP insuficiente (colapso)",
        "desc": "Grave. SI < 0,9, Cest melhora ao subir PEEP",
        "assess": [
          "Manter pulmao aberto"
        ],
        "interv": [
          "Titulacao PEEP 8→10→12→14; melhor Cest, menor ΔP, sem ↓PAM"
        ],
        "block": "R4-B — VM: Oxigenacao e recrutamento",
        "goals": [
          "Manter pulmao aberto"
        ],
        "phases": []
      },
      {
        "name": "R4-B3 — PEEP excessiva (hiperdistensao)",
        "desc": "Grave. SI > 1,1, ΔP ↑ ao subir PEEP, hipotensao",
        "assess": [
          "Reduzir hiperdistensao"
        ],
        "interv": [
          "Reduzir PEEP 2 cmH₂O; reavaliar Cest, ΔP, SpO₂, PAM"
        ],
        "block": "R4-B — VM: Oxigenacao e recrutamento",
        "goals": [
          "Reduzir hiperdistensao"
        ],
        "phases": []
      },
      {
        "name": "R4-B4 — Pulmao recrutavel vs nao recrutavel",
        "desc": "Moderado. Curva P×V, Cest, MRA, TC",
        "assess": [
          "Identificar estrategia"
        ],
        "interv": [
          "Recrutavel: MRA + PEEP manutencao; Nao: pressao minima + pronacao"
        ],
        "block": "R4-B — VM: Oxigenacao e recrutamento",
        "goals": [
          "Identificar estrategia"
        ],
        "phases": []
      },
      {
        "name": "R4-B5 — Manobra de recrutamento alveolar",
        "desc": "Grave. Atelectasia, queda Cest, pos-desconexao",
        "assess": [
          "Abrir unidades colapsadas"
        ],
        "interv": [
          "Contraindicacoes: pneumotorax, choque, VD falente",
          "Monitorar SpO₂, PAM, FC durante MRA; fixar PEEP apos MRA"
        ],
        "block": "R4-B — VM: Oxigenacao e recrutamento",
        "goals": [
          "Abrir unidades colapsadas"
        ],
        "phases": []
      },
      {
        "name": "R4-B6 — Pronacao",
        "desc": "Critico. P/F < 150-200, SDRA",
        "assess": [
          "Aumentar P/F, reduzir FiO₂"
        ],
        "interv": [
          "Prona 16-20h/dia; fisio: proteger tubo, posicionamento; higiene antes/depois"
        ],
        "block": "R4-B — VM: Oxigenacao e recrutamento",
        "goals": [
          "Aumentar P/F, reduzir FiO₂"
        ],
        "phases": []
      },
      {
        "name": "R4-B7 — Consolidacao / shunt nao recrutavel",
        "desc": "Grave. Consolidacao extensa, Cest nao melhora",
        "assess": [
          "Otimizar oxigenacao sem VILI"
        ],
        "interv": [
          "Nao forcar PEEP alta; PEEP moderada + pronacao; aguardar causa base"
        ],
        "block": "R4-B — VM: Oxigenacao e recrutamento",
        "goals": [
          "Otimizar oxigenacao sem VILI"
        ],
        "phases": []
      },
      {
        "name": "R4-C1 — Hipercapnia / acidose respiratoria",
        "desc": "Grave. PaCO₂ > 50 e/ou pH < 7,30",
        "assess": [
          "pH ≥ 7,25, evitar ↑ΔP/Pplat"
        ],
        "interv": [
          "Ajustar FR (se nao autoPEEP); reduzir Vd; gaso 30-60 min"
        ],
        "block": "R4-C — VM: Controle ventilatorio (CO₂)",
        "goals": [
          "pH ≥ 7,25, evitar ↑ΔP/Pplat"
        ],
        "phases": []
      },
      {
        "name": "R4-C2 — Espaco morto aumentado",
        "desc": "Grave. PaCO₂ alto apesar VE alto, TEP/choque",
        "assess": [
          "Melhorar eficiencia ventilatoria"
        ],
        "interv": [
          "Revisar PEEP; pronacao; tratar hemodinamica, TEP"
        ],
        "block": "R4-C — VM: Controle ventilatorio (CO₂)",
        "goals": [
          "Melhorar eficiencia ventilatoria"
        ],
        "phases": []
      },
      {
        "name": "R4-C3 — Hipercapnia permissiva",
        "desc": "Moderado. Protecao Vt baixo, ΔP limite",
        "assess": [
          "pH toleravel sem ultrapassar protecao"
        ],
        "interv": [
          "Alvo pH ≥ 7,20-7,25; manter VM protetora; monitorar repercussao"
        ],
        "block": "R4-C — VM: Controle ventilatorio (CO₂)",
        "goals": [
          "pH toleravel sem ultrapassar protecao"
        ],
        "phases": []
      },
      {
        "name": "R4-D1 — Assincronia significativa",
        "desc": "Grave. Double trigger, esforco inefetivo, Vt irregular",
        "assess": [
          "Reduzir assincronia, Vt/pressoes seguras"
        ],
        "interv": [
          "Curvas P×T, F×T, loops; checar circuito, agua, secrecao; identificar tipo"
        ],
        "block": "R4-D — VM: Assincronias",
        "goals": [
          "Reduzir assincronia, Vt/pressoes seguras"
        ],
        "phases": []
      },
      {
        "name": "R4-D2 — Flow starvation",
        "desc": "Moderado. Curva P×T concava, esforco puxando",
        "assess": [
          "Satisfazer demanda inspiratoria"
        ],
        "interv": [
          "Aumentar fluxo inspiratorio; ajustar rampa/rise time; checar resistencia"
        ],
        "block": "R4-D — VM: Assincronias",
        "goals": [
          "Satisfazer demanda inspiratoria"
        ],
        "phases": []
      },
      {
        "name": "R4-D3 — Double trigger",
        "desc": "Grave. Dois ciclos colados, Vt somado",
        "assess": [
          "Eliminar empilhamento"
        ],
        "interv": [
          "Aumentar TI; ajustar trigger; tratar drive alto: dor, febre, hipoxemia"
        ],
        "block": "R4-D — VM: Assincronias",
        "goals": [
          "Eliminar empilhamento"
        ],
        "phases": []
      },
      {
        "name": "R4-D4 — Esforco inefetivo",
        "desc": "Moderado. Deflexoes sem disparar, autoPEEP",
        "assess": [
          "Melhorar disparo efetivo"
        ],
        "interv": [
          "Trigger mais sensivel; reduzir autoPEEP; PEEP externa ate 80% intrínseca"
        ],
        "block": "R4-D — VM: Assincronias",
        "goals": [
          "Melhorar disparo efetivo"
        ],
        "phases": []
      },
      {
        "name": "R4-D5 — Drive excessivo (P-SILI)",
        "desc": "Critico. FR alta, Vt escapa alto, dor/febre",
        "assess": [
          "Reduzir esforco lesivo"
        ],
        "interv": [
          "Corrigir dor, febre, acidose, hipoxia; ajustar suporte; monitorar Vt e ΔP"
        ],
        "block": "R4-D — VM: Assincronias",
        "goals": [
          "Reduzir esforco lesivo"
        ],
        "phases": []
      },
      {
        "name": "R4-E1 — AutoPEEP / PEEP intrínseca",
        "desc": "Grave. Fluxo nao zera, PEEP intr > 5",
        "assess": [
          "Fluxo zerar, PEEP intr ≤ 5"
        ],
        "interv": [
          "Checar secrecao, tubo, filtro; reduzir FR, TE (I:E 1:3-1:5); broncoespasmo"
        ],
        "block": "R4-E — VM: Obstrucao e aprisionamento",
        "goals": [
          "Fluxo zerar, PEEP intr ≤ 5"
        ],
        "phases": []
      },
      {
        "name": "R4-E2 — Hiperinsuflacao com choque",
        "desc": "Critico. PAM cai, taquicardia, aprisionamento",
        "assess": [
          "Reverter urgente"
        ],
        "interv": [
          "Aumentar TE, reduzir Vt; grave: desconexao controlada"
        ],
        "block": "R4-E — VM: Obstrucao e aprisionamento",
        "goals": [
          "Reverter urgente"
        ],
        "phases": []
      },
      {
        "name": "R4-E3 — Broncoespasmo em VM",
        "desc": "Grave. Sibilos, PIP ↑ Pplat normal, hipercapnia",
        "assess": [
          "Reduzir resistencia"
        ],
        "interv": [
          "FR menor, TE maior; broncodilatador; reavaliar curva fluxo"
        ],
        "block": "R4-E — VM: Obstrucao e aprisionamento",
        "goals": [
          "Reduzir resistencia"
        ],
        "phases": []
      },
      {
        "name": "R4-E4 — DPOC exacerbado",
        "desc": "Grave. DPOC + acidose + autoPEEP",
        "assess": [
          "pH ≥ 7,25, reduzir aprisionamento"
        ],
        "interv": [
          "TE prolongado I:E 1:3-1:5; permissiva se pH OK; desmame precoce"
        ],
        "block": "R4-E — VM: Obstrucao e aprisionamento",
        "goals": [
          "pH ≥ 7,25, reduzir aprisionamento"
        ],
        "phases": []
      },
      {
        "name": "R4-E5 — Asma grave / status asmatico",
        "desc": "Critico. Resistencia extrema, risco barotrauma",
        "assess": [
          "Evitar barotrauma, pH toleravel"
        ],
        "interv": [
          "Exp longa: FR baixa, TE max; broncodilatacao + MgSO4"
        ],
        "block": "R4-E — VM: Obstrucao e aprisionamento",
        "goals": [
          "Evitar barotrauma, pH toleravel"
        ],
        "phases": []
      },
      {
        "name": "R4-E6 — Obstrucao TOT/TQT",
        "desc": "Critico. PIP sobe subito, Vt cai, dessaturacao",
        "assess": [
          "Restabelecer patencia"
        ],
        "interv": [
          "Checar circuito/tubo, aspirar; ventilar manual; broncoscopia/troca se necessario"
        ],
        "block": "R4-E — VM: Obstrucao e aprisionamento",
        "goals": [
          "Restabelecer patencia"
        ],
        "phases": []
      },
      {
        "name": "R4-F1 — Disfuncao diafragmatica",
        "desc": "Grave. MIP < -20/-30, eco excursao < 10 mm",
        "assess": [
          "Recuperar forca"
        ],
        "interv": [
          "Eco seriada; evitar ventilacao excessiva; TRE diarios; TMI progressivo"
        ],
        "block": "R4-F — VM: Neuro / sedacao / diafragma",
        "goals": [
          "Recuperar forca"
        ],
        "phases": []
      },
      {
        "name": "R4-F2 — VIDD (lesao diafragma)",
        "desc": "Grave. VM passiva prolongada ou esforco excessivo",
        "assess": [
          "Prevenir lesao, ativar diafragma"
        ],
        "interv": [
          "Evitar super/subassistencia; desmame precoce; TRE + mobilizacao"
        ],
        "block": "R4-F — VM: Neuro / sedacao / diafragma",
        "goals": [
          "Prevenir lesao, ativar diafragma"
        ],
        "phases": []
      },
      {
        "name": "R4-F3 — Delirium / agitacao",
        "desc": "Grave. CAM-ICU+, risco autoextubacao",
        "assess": [
          "Controlar delirium"
        ],
        "interv": [
          "Sedacao minima; bundle A-F; mobilizacao precoce"
        ],
        "block": "R4-F — VM: Neuro / sedacao / diafragma",
        "goals": [
          "Controlar delirium"
        ],
        "phases": []
      },
      {
        "name": "R4-F4 — Sedacao profunda",
        "desc": "Moderado. RASS -4/-5, VM passiva",
        "assess": [
          "Reduzir sedacao"
        ],
        "interv": [
          "Despertar diario; RASS alvo -1 a 0; TRE quando despertar"
        ],
        "block": "R4-F — VM: Neuro / sedacao / diafragma",
        "goals": [
          "Reduzir sedacao"
        ],
        "phases": []
      },
      {
        "name": "R4-F5 — Polineuropatia critico",
        "desc": "Grave. MRC < 48, desmame dificil",
        "assess": [
          "Recuperar funcao"
        ],
        "interv": [
          "Mobilizacao 2x/dia; eletroestimulacao; TMI diario"
        ],
        "block": "R4-F — VM: Neuro / sedacao / diafragma",
        "goals": [
          "Recuperar funcao"
        ],
        "phases": []
      },
      {
        "name": "R4-G1 — Pneumotorax",
        "desc": "Critico. MV abolido, PIP alto, hipotensao",
        "assess": [
          "Drenagem urgente"
        ],
        "interv": [
          "Chamar equipe URGENTE; RX torax; preparar drenagem; reduzir pressoes"
        ],
        "block": "R4-G — VM: Complicacoes e emergencias",
        "goals": [
          "Drenagem urgente"
        ],
        "phases": []
      },
      {
        "name": "R4-G2 — PAVM suspeita",
        "desc": "Grave. Febre, secrecao purulenta, infiltrado",
        "assess": [
          "Facilitar diagnostico"
        ],
        "interv": [
          "Aspirado; higiene otimizada; cabeceira 30-45°"
        ],
        "block": "R4-G — VM: Complicacoes e emergencias",
        "goals": [
          "Facilitar diagnostico"
        ],
        "phases": []
      },
      {
        "name": "R4-G3 — Autoextubacao",
        "desc": "Critico. Tubo saiu",
        "assess": [
          "Avaliar reintubacao"
        ],
        "interv": [
          "O₂ mascara/HFNC/VNI; avaliar SpO₂, FR, esforco; decidir com equipe"
        ],
        "block": "R4-G — VM: Complicacoes e emergencias",
        "goals": [
          "Avaliar reintubacao"
        ],
        "phases": []
      },
      {
        "name": "R4-G4 — Desconexao circuito",
        "desc": "Critico. Alarme, dessaturacao",
        "assess": [
          "Reconectar"
        ],
        "interv": [
          "Reconectar imediato; verificar fixacao; MRA se colapso"
        ],
        "block": "R4-G — VM: Complicacoes e emergencias",
        "goals": [
          "Reconectar"
        ],
        "phases": []
      },
      {
        "name": "R4-G5 — Instabilidade hemodinamica",
        "desc": "Critico. PAM < 65, FC > 120 apos VM",
        "assess": [
          "Identificar causa"
        ],
        "interv": [
          "Suspeitar hiperinsuflacao, pneumotorax; reduzir PEEP/Vt; RX"
        ],
        "block": "R4-G — VM: Complicacoes e emergencias",
        "goals": [
          "Identificar causa"
        ],
        "phases": []
      },
      {
        "name": "R4-G6 — PCR em VM",
        "desc": "Critico. Sem pulso, apneia",
        "assess": [
          "RCP imediato"
        ],
        "interv": [
          "Codigo azul; ventilar manual 100%; auxiliar compressoes"
        ],
        "block": "R4-G — VM: Complicacoes e emergencias",
        "goals": [
          "RCP imediato"
        ],
        "phases": []
      },
      {
        "name": "R4-G7 — Dessaturacao subita",
        "desc": "Critico. SpO₂ cai rapido",
        "assess": [
          "Identificar causa"
        ],
        "interv": [
          "DOPE: Deslocamento, Obstrucao, Pneumotorax, Equipment; aspirar; RX"
        ],
        "block": "R4-G — VM: Complicacoes e emergencias",
        "goals": [
          "Identificar causa"
        ],
        "phases": []
      },
      {
        "name": "R4-H1 — Dependencia de via aerea artificial",
        "desc": "Grave. TOT/TQT, manutencao patencia e protecao",
        "assess": [
          "Manutencao patencia e protecao da via aerea"
        ],
        "interv": [
          "Medir Pcuff 6/6h; fixacao segura 12/12h; higiene oral 8-12h; auscultar turno",
          "Trocar fixacao diario; avaliar indicacao TQT; aspiracao traqueal tecnica asséptica",
          "Cuff-leak test (TOT); avaliar tosse voluntaria, PCF > 60 L/min"
        ],
        "block": "R4-H — Manejo via aerea artificial",
        "goals": [
          "Curto prazo: cuff 20-30, fixacao, higiene oral, auscultar",
          "Medio prazo: trocar fixacao, avaliar TQT",
          "Pre-decannula: cuff-leak, avaliar tosse"
        ],
        "phases": [
          {
            "timeframe": "Curto prazo",
            "interv": [
              "Cuff 20-30 cmH₂O; fixacao segura; higiene oral 8-12h; auscultar por turno"
            ]
          },
          {
            "timeframe": "Medio prazo",
            "interv": [
              "Trocar fixacao diario; avaliar indicacao TQT; aspiracao traqueal tecnica asséptica"
            ]
          },
          {
            "timeframe": "Pre-decannula",
            "interv": [
              "Cuff-leak test (TOT); avaliar tosse voluntaria, PCF > 60 L/min"
            ]
          }
        ]
      },
      {
        "name": "R4-H2 — Manter vias aereas pervias",
        "desc": "Grave. Secrecoes, obstrucao, desobstrucao",
        "assess": [
          "Umidificacao e aspiracao",
          "Tosse assistida e mobilizacao",
          "Pre-extubacao: tosse, PCF > 60"
        ],
        "interv": [
          "HME ou umidificador; aspiracao indicada (roncos, ↑Ppico, ↓SpO₂)",
          "Instilacao SF 5-10 mL se espessa; tosse assistida 2-3x/dia; mobilizacao"
        ],
        "block": "R4-H — Manejo via aerea artificial",
        "goals": [
          "Umidificacao 32-34°C; aspiracao sob demanda",
          "Tosse assistida; mobilizacao; drenagem postural",
          "Pre-extubacao: tosse, PCF > 60"
        ],
        "phases": [
          {
            "timeframe": "Manutencao diaria",
            "interv": [
              "HME ou umidificador 32-34°C; aspiracao sob demanda (roncos, ↑Ppico, ↓SpO₂)"
            ]
          },
          {
            "timeframe": "Higiene bronquica",
            "interv": [
              "Instilacao SF 5-10 mL se espessa; tosse assistida 2-3x/dia; mobilizacao"
            ]
          },
          {
            "timeframe": "Pre-extubacao",
            "interv": [
              "Avaliar tosse voluntaria, PCF > 60 L/min"
            ]
          }
        ]
      },
      {
        "name": "R4-H3 — Secrecao purulenta/hematica",
        "desc": "Grave. Purulenta ou hematica",
        "assess": [
          "Purulenta: comunicar medico, cultura, higiene 4-6x/dia",
          "Hematica: aspiracao delicada, pressao baixa, comunicar se > 50ml"
        ],
        "interv": [
          "ATB se PAVM; nebulizacao SF 3%; evitar SF se hematica"
        ],
        "block": "R4-H — Manejo via aerea artificial",
        "goals": [
          "Purulenta: comunicar medico, cultura, higiene 4-6x/dia",
          "Hematica: aspiracao delicada, pressao baixa, comunicar se > 50ml"
        ],
        "phases": []
      },
      {
        "name": "R5-A1 — Criterios desmame nao atingidos",
        "desc": "Moderado. P/F < 150, PEEP > 8-10, instavel, febril, sedado",
        "assess": [
          "Atingir criterios pre-TRE"
        ],
        "interv": [
          "Otimizar oxigenacao; reduzir sedacao RASS -1 a 0; estabilizar hemodinamica"
        ],
        "block": "R5-A — Desmame e TRE",
        "goals": [
          "Atingir criterios pre-TRE"
        ],
        "phases": []
      },
      {
        "name": "R5-A1 EXP — Dependencia VM sem criterios desmame",
        "desc": "Grave. Nao preenche criterios para TRE",
        "assess": [
          "Checklist diario; otimizacao ventilatoria; sedacao minima; desmame suporte",
          "Avaliar PImax/PEmax quando RASS ≥ -1; TMI; mobilizacao; considerar TQT > 14-21 dias"
        ],
        "interv": [
          "VM protetora; despertar diario; reduzir FiO₂/PEEP progressivo"
        ],
        "block": "R5-A — Desmame e TRE",
        "goals": [
          "Checklist diario; otimizacao ventilatoria; sedacao minima; desmame suporte",
          "Avaliar PImax/PEmax quando RASS ≥ -1; TMI; mobilizacao; considerar TQT > 14-21 dias"
        ],
        "phases": []
      },
      {
        "name": "R5-A2 — TRE indicado",
        "desc": "Leve. P/F > 150, PEEP ≤ 8, estavel, acordado",
        "assess": [
          "Realizar TRE"
        ],
        "interv": [
          "Tubo-T ou PS 5-7; 30-120 min; monitorar FR, Vt, RSBI, SpO₂",
          "Sucesso: FR<35, RSBI<105, SpO₂>90%; Falha: reconectar"
        ],
        "block": "R5-A — Desmame e TRE",
        "goals": [
          "Realizar TRE"
        ],
        "phases": []
      },
      {
        "name": "R5-A3 — TRE falhou",
        "desc": "Grave. FR > 35, dessaturacao, esforco ↑",
        "assess": [
          "Fortalecer para novo TRE"
        ],
        "interv": [
          "Reconectar; investigar MIP/MEP, secrecao; TMI; mobilizacao; novo TRE 24-48h"
        ],
        "block": "R5-A — Desmame e TRE",
        "goals": [
          "Fortalecer para novo TRE"
        ],
        "phases": []
      },
      {
        "name": "R5-A4 — Desmame prolongado",
        "desc": "Grave. Multiplas falhas, VM > 7-14 dias",
        "assess": [
          "Desmame progressivo"
        ],
        "interv": [
          "TRE 30→60→120 min; TMI 2x/dia; mobilizacao; TQT se > 10-14 dias"
        ],
        "block": "R5-A — Desmame e TRE",
        "goals": [
          "Desmame progressivo"
        ],
        "phases": []
      },
      {
        "name": "R5-A5 — RSBI elevado",
        "desc": "Grave. RSBI > 105",
        "assess": [
          "RSBI < 105"
        ],
        "interv": [
          "TMI para ↑Vt ↓FR; controlar drive; higiene bronquica; remedir antes TRE"
        ],
        "block": "R5-A — Desmame e TRE",
        "goals": [
          "RSBI < 105"
        ],
        "phases": []
      },
      {
        "name": "R5-A6 — Dependencia ventilatoria cronica/irreversivel",
        "desc": "Moderado. VM > 30 dias, multiplas falhas, sem perspectiva",
        "assess": [
          "Otimizar qualidade de vida"
        ],
        "interv": [
          "Considerar TQT, VM domiciliar; prevenir complicacoes; mobilizacao maxima; discutir metas"
        ],
        "block": "R5-A — Desmame e TRE",
        "goals": [
          "Otimizar qualidade de vida"
        ],
        "phases": []
      },
      {
        "name": "R5-B1 — Extubacao bem-sucedida",
        "desc": "Leve. TRE sucesso, primeiras 48h",
        "assess": [
          "Prevenir reintubacao"
        ],
        "interv": [
          "O₂ titular; HFNC profilatico se risco; higiene precoce; monitorar estridor"
        ],
        "block": "R5-B — Pos-extubacao",
        "goals": [
          "Prevenir reintubacao"
        ],
        "phases": []
      },
      {
        "name": "R5-B2 — Estridor pos-extubacao",
        "desc": "Grave. Som agudo, esforco ↑, edema glotico",
        "assess": [
          "Reduzir edema"
        ],
        "interv": [
          "Sentado; O₂; nebulizacao adrenalina + corticoide; preparar reintubacao"
        ],
        "block": "R5-B — Pos-extubacao",
        "goals": [
          "Reduzir edema"
        ],
        "phases": []
      },
      {
        "name": "R5-B3 — Insuf. respiratoria pos-extubacao",
        "desc": "Critico. SpO₂ < 90%, FR > 30, fadiga < 48h",
        "assess": [
          "Evitar reintubacao"
        ],
        "interv": [
          "HFNC 50-60 L/min; VNI se hipercapnia/falha; FALHA → reintubar"
        ],
        "block": "R5-B — Pos-extubacao",
        "goals": [
          "Evitar reintubacao"
        ],
        "phases": []
      },
      {
        "name": "R5-B4 — Reintubacao",
        "desc": "Critico. Falha suporte, IOT < 48-72h",
        "assess": [
          "IOT segura"
        ],
        "interv": [
          "Pre-oxigenacao; auxiliar equipe; pos-IOT VM protetora"
        ],
        "block": "R5-B — Pos-extubacao",
        "goals": [
          "IOT segura"
        ],
        "phases": []
      },
      {
        "name": "R5-B5 — Alto risco reintubacao",
        "desc": "Moderado. Idade > 65, comorbidades, TRE limite",
        "assess": [
          "Profilaxia"
        ],
        "interv": [
          "HFNC profilatico; higiene 3-4x/dia; monitorizacao reforcada"
        ],
        "block": "R5-B — Pos-extubacao",
        "goals": [
          "Profilaxia"
        ],
        "phases": []
      },
      {
        "name": "R5-C1 — Indicacao TQT",
        "desc": "Moderado. VM prevista > 14-21 dias",
        "assess": [
          "Facilitar desmame, conforto"
        ],
        "interv": [
          "Discutir timing; pos-TQT higiene via canula; progressao cuff → desinflado → valvula → cap"
        ],
        "block": "R5-C — Traqueostomia",
        "goals": [
          "Facilitar desmame, conforto"
        ],
        "phases": []
      },
      {
        "name": "R5-C2 — Desmame traqueostomizado",
        "desc": "Moderado. Criterios OK, TQT presente",
        "assess": [
          "Progressao ate decanulacao"
        ],
        "interv": [
          "VM → PSV baixa → CPAP; desinflar cuff; valvula Passy-Muir; cap/oclusao"
        ],
        "block": "R5-C — Traqueostomia",
        "goals": [
          "Progressao ate decanulacao"
        ],
        "phases": []
      },
      {
        "name": "R5-C3 — Obstrucao/deslocamento TQT",
        "desc": "Critico. SpO₂ cai, PIP alto, enfisema subcutaneo",
        "assess": [
          "Restabelecer via aerea"
        ],
        "interv": [
          "Aspirar; checar posicionamento; trocar canula se obstruida"
        ],
        "block": "R5-C — Traqueostomia",
        "goals": [
          "Restabelecer via aerea"
        ],
        "phases": []
      },
      {
        "name": "R5-C4 — Decanulacao",
        "desc": "Leve. Tolera cap 24h, tosse eficaz",
        "assess": [
          "Remover TQT"
        ],
        "interv": [
          "Cap 24h OK, PCF > 60-160; decanular; monitorar 24-48h"
        ],
        "block": "R5-C — Traqueostomia",
        "goals": [
          "Remover TQT"
        ],
        "phases": []
      },
      {
        "name": "R5-D1 — MIP/MEP fracos",
        "desc": "Grave. MIP < -20/-30, MEP < +30/+40",
        "assess": [
          "MIP > -30, MEP > +40"
        ],
        "interv": [
          "TMI POWERbreathe 30-50% MIP 2x/dia; TME se MEP fraco; reavaliar 5-7 dias"
        ],
        "block": "R5-D — Biomarcadores e preditores",
        "goals": [
          "MIP > -30, MEP > +40"
        ],
        "phases": []
      },
      {
        "name": "R5-D2 — PCF baixo",
        "desc": "Grave. PCF < 60 inutil, < 160 risco",
        "assess": [
          "PCF > 160"
        ],
        "interv": [
          "Treino tosse; tosse assistida; TME; PCF<60: tosse mecanica"
        ],
        "block": "R5-D — Biomarcadores e preditores",
        "goals": [
          "PCF > 160"
        ],
        "phases": []
      },
      {
        "name": "R5-D3 — RSBI elevado",
        "desc": "Grave. RSBI > 105",
        "assess": [
          "RSBI < 105"
        ],
        "interv": [
          "TMI para ↑Vt; controlar drive; remedir antes TRE"
        ],
        "block": "R5-D — Biomarcadores e preditores",
        "goals": [
          "RSBI < 105"
        ],
        "phases": []
      },
      {
        "name": "R5-D4 — P0.1 elevado (drive alto)",
        "desc": "Moderado. P0.1 > 4-6 cmH₂O",
        "assess": [
          "P0.1 entre 2-4"
        ],
        "interv": [
          "Medir P0.1; investigar dor, febre, acidose, hipoxemia; tratar causas"
        ],
        "block": "R5-D — Biomarcadores e preditores",
        "goals": [
          "P0.1 entre 2-4"
        ],
        "phases": []
      },
      {
        "name": "R5-D5 — Excursao diafragmatica reduzida",
        "desc": "Grave. Excursao < 10 mm",
        "assess": [
          "Excursao > 10 mm"
        ],
        "interv": [
          "Eco diafragmatica; TMI progressivo; evitar ventilacao excessiva; reavaliar 5-7 dias"
        ],
        "block": "R5-D — Biomarcadores e preditores",
        "goals": [
          "Excursao > 10 mm"
        ],
        "phases": []
      },
      {
        "name": "R5-D6 — Espessamento diafragmatico reduzido",
        "desc": "Grave. TFdi < 20%",
        "assess": [
          "TFdi > 20%"
        ],
        "interv": [
          "TFdi = [(Ei-Ee)/Ee]×100; TMI; TRE progressivos; reavaliar seriado"
        ],
        "block": "R5-D — Biomarcadores e preditores",
        "goals": [
          "TFdi > 20%"
        ],
        "phases": []
      },
      {
        "name": "R5-D7 — Indices integrados",
        "desc": "Moderado. CROP < 13, IWI < 25",
        "assess": [
          "Melhorar preditores"
        ],
        "interv": [
          "CROP = Cdin×MIP×(PaO₂/PAO₂)/FR >13; IWI >25; fortalecer + otimizar"
        ],
        "block": "R5-D — Biomarcadores e preditores",
        "goals": [
          "Melhorar preditores"
        ],
        "phases": []
      }
    ]
  },
  {
    "id": "neurological",
    "name": "Sistema Neurologico",
    "icon": "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
    "color": "#c084fc",
    "problems": [
      {
        "name": "N1.1 — Imobilismo neurologico severo",
        "desc": "Critico. Coma, sedacao profunda, sem mobilidade voluntaria",
        "assess": [],
        "interv": [
          "Mobilizacao passiva 2x/dia (10-15 rep/articulacao)",
          "Posicionamento terapeutico (Troca a cada 2h)",
          "Expansao toracica passiva (Sessoes)",
          "Sedestacao cabeceira 30-90° (Progressivo 10-60 min)",
          "Prancha ortostatica quando elegivel (1-2x/dia)",
          "Eletroestimulacao se disponivel (20-30 min/grupo)"
        ],
        "block": "N1 — Rebaixamento / Coma / Sedacao",
        "goals": [
          "Preservar funcao e prevenir complicacoes"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Mobilizacao passiva 2x/dia (10-15 rep/articulacao)",
              "Posicionamento terapeutico (Troca a cada 2h)",
              "Expansao toracica passiva (Sessoes)",
              "Sedestacao cabeceira 30-90° (Progressivo 10-60 min)",
              "Prancha ortostatica quando elegivel (1-2x/dia)",
              "Eletroestimulacao se disponivel (20-30 min/grupo)"
            ]
          }
        ]
      },
      {
        "name": "N1.2 — Baixa responsividade / Despertar minimal",
        "desc": "Grave. Nao sustenta tronco, nao mantem cabeca",
        "assess": [],
        "interv": [
          "Sedestacao a beira do leito (5-10 min → 20-40 min)",
          "Treino de controle de tronco (Deslocamento peso, alcance)",
          "Transferencias terapeuticas (Diaria leito↔poltrona)"
        ],
        "block": "N1 — Rebaixamento / Coma / Sedacao",
        "goals": [
          "Iniciar controle postural"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Sedestacao a beira do leito (5-10 min → 20-40 min)",
              "Treino de controle de tronco (Deslocamento peso, alcance)",
              "Transferencias terapeuticas (Diaria leito↔poltrona)"
            ]
          }
        ]
      },
      {
        "name": "N1.3 — Inicio de participacao ativa",
        "desc": "Moderado. Fraqueza grave, fadiga rapida",
        "assess": [],
        "interv": [
          "Ortostatismo assistido (30-60s → 5-10 min)",
          "Transferencias ativas-assistidas (Diario)",
          "TMI se PImax < -40 (30-50% carga, 2x/dia)"
        ],
        "block": "N1 — Rebaixamento / Coma / Sedacao",
        "goals": [
          "Ortostatismo e funcionalidade"
        ],
        "phases": [
          {
            "timeframe": "7-14 dias",
            "interv": [
              "Ortostatismo assistido (30-60s → 5-10 min)",
              "Transferencias ativas-assistidas (Diario)",
              "TMI se PImax < -40 (30-50% carga, 2x/dia)"
            ]
          }
        ]
      },
      {
        "name": "N2.1 — Hemiparesia / Perda controle postural",
        "desc": "Grave. Fraqueza unilateral, assimetria, alto risco queda",
        "assess": [],
        "interv": [
          "Posicionamento terapeutico rigoroso (Troca 2h, proteger ombro)",
          "Treino controle tronco na beira do leito (5-10 min → 20-40 min)",
          "Sedestacao em poltrona (30 min → 2-4h)"
        ],
        "block": "N2 — AVC (Isquemico/Hemorragico)",
        "goals": [
          "Recuperar controle postural e prevenir complicacoes"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Posicionamento terapeutico rigoroso (Troca 2h, proteger ombro)",
              "Treino controle tronco na beira do leito (5-10 min → 20-40 min)",
              "Sedestacao em poltrona (30 min → 2-4h)"
            ]
          }
        ]
      },
      {
        "name": "N2.2 — Incapacidade transferencias",
        "desc": "Grave. Nao rola, nao senta, nao levanta",
        "assess": [],
        "interv": [
          "Treino transferencias: decubito→sentado→pe→cadeira (Todo dia)",
          "Treino sentar-levantar (5-10 rep, 2-3 series)"
        ],
        "block": "N2 — AVC (Isquemico/Hemorragico)",
        "goals": [
          "Iniciar transferencias funcionais"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino transferencias: decubito→sentado→pe→cadeira (Todo dia)",
              "Treino sentar-levantar (5-10 rep, 2-3 series)"
            ]
          }
        ]
      },
      {
        "name": "N2.3 — Intolerancia ortostatismo",
        "desc": "Moderado. Queda PA, tontura, taquicardia, fadiga",
        "assess": [],
        "interv": [
          "Prancha ortostatica 30→70-80° (1-2x/dia)",
          "Ortostatismo assistido progressivo (30s → 5-10 min)"
        ],
        "block": "N2 — AVC (Isquemico/Hemorragico)",
        "goals": [
          "Tolerar ortostatismo ≥ 5-10 min"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Prancha ortostatica 30→70-80° (1-2x/dia)",
              "Ortostatismo assistido progressivo (30s → 5-10 min)"
            ]
          }
        ]
      },
      {
        "name": "N2.4 — Ausencia marcha funcional",
        "desc": "Moderado. Nao sustenta peso, arrasta lado paretico",
        "assess": [],
        "interv": [
          "Pre-marcha: transferencia peso em pe (Treino)",
          "Marcha assistida: 2 terapeutas/andador (2-5 m → progredir)"
        ],
        "block": "N2 — AVC (Isquemico/Hemorragico)",
        "goals": [
          "Iniciar marcha com apoio"
        ],
        "phases": [
          {
            "timeframe": "7-14 dias",
            "interv": [
              "Pre-marcha: transferencia peso em pe (Treino)",
              "Marcha assistida: 2 terapeutas/andador (2-5 m → progredir)"
            ]
          }
        ]
      },
      {
        "name": "N2.5 — Ombro doloroso / Subluxacao",
        "desc": "Moderado. Dor, flacidez, tracao durante mobilizacao",
        "assess": [],
        "interv": [
          "Posicionamento rigoroso (Sempre)",
          "Suporte de ombro em sedestacao (Obrigatorio)",
          "Mobilizacao so com escapula controlada (Tecnica)",
          "Evitar puxar pelo braco (Nunca)"
        ],
        "block": "N2 — AVC (Isquemico/Hemorragico)",
        "goals": [
          "Prevenir subluxacao e dor"
        ],
        "phases": [
          {
            "timeframe": "Imediato",
            "interv": [
              "Posicionamento rigoroso (Sempre)",
              "Suporte de ombro em sedestacao (Obrigatorio)",
              "Mobilizacao so com escapula controlada (Tecnica)",
              "Evitar puxar pelo braco (Nunca)"
            ]
          }
        ]
      },
      {
        "name": "N2.6 — Componente respiratorio",
        "desc": "Moderado. Tosse fraca, PCF baixo, risco aspiracao",
        "assess": [],
        "interv": [
          "Medir PCF e PEmax (Inicial e seriado)",
          "Treinar tosse e huffing (Sessoes)",
          "Higiene bronquica por criterio (PRN)",
          "Mobilizacao precoce (Principal prevencao)"
        ],
        "block": "N2 — AVC (Isquemico/Hemorragico)",
        "goals": [
          "Manter via aerea limpa, prevenir pneumonia"
        ],
        "phases": [
          {
            "timeframe": "Continuo",
            "interv": [
              "Medir PCF e PEmax (Inicial e seriado)",
              "Treinar tosse e huffing (Sessoes)",
              "Higiene bronquica por criterio (PRN)",
              "Mobilizacao precoce (Principal prevencao)"
            ]
          }
        ]
      },
      {
        "name": "N3.1 — Rebaixamento / Coma / Despertar lento",
        "desc": "Critico. GCS baixo, sem comandos, dependencia total",
        "assess": [],
        "interv": [
          "Mobilizacao passiva global 2x/dia (10-15 rep)",
          "Posicionamento terapeutico rigoroso (Troca 2h)",
          "Sedestacao progressiva 30-90° (10-60 min)",
          "Prancha ortostatica quando elegivel (1-2x/dia)",
          "Eletroestimulacao se disponivel (20-30 min)"
        ],
        "block": "N3 — TCE (Traumatismo Cranioencefalico)",
        "goals": [
          "Preservar funcao e prevenir complicacoes"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Mobilizacao passiva global 2x/dia (10-15 rep)",
              "Posicionamento terapeutico rigoroso (Troca 2h)",
              "Sedestacao progressiva 30-90° (10-60 min)",
              "Prancha ortostatica quando elegivel (1-2x/dia)",
              "Eletroestimulacao se disponivel (20-30 min)"
            ]
          }
        ]
      },
      {
        "name": "N3.2 — Agitacao / Hiperatividade / Delirium",
        "desc": "Grave. Arranca dispositivos, nao tolera manuseio",
        "assess": [],
        "interv": [
          "Mobilizacao como tratamento delirium (Sedestacao/poltrona diaria)",
          "Controle drive respiratorio se VM (Revisar conforto)"
        ],
        "block": "N3 — TCE (Traumatismo Cranioencefalico)",
        "goals": [
          "Reduzir contencao, organizar"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Mobilizacao como tratamento delirium (Sedestacao/poltrona diaria)",
              "Controle drive respiratorio se VM (Revisar conforto)"
            ]
          }
        ]
      },
      {
        "name": "N3.3 — Perda controle tronco/cabeca",
        "desc": "Grave. Cabeca cai, tronco colapsa",
        "assess": [],
        "interv": [
          "Treino controle tronco beira leito (5-10 min → 30-40 min)",
          "Deslocamento peso, alcance funcional (Sessoes)"
        ],
        "block": "N3 — TCE (Traumatismo Cranioencefalico)",
        "goals": [
          "Manter sedestacao ≥ 10-20 min"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino controle tronco beira leito (5-10 min → 30-40 min)",
              "Deslocamento peso, alcance funcional (Sessoes)"
            ]
          }
        ]
      },
      {
        "name": "N3.4 — Incapacidade transferencias",
        "desc": "Grave. Nao rola, nao senta, nao levanta",
        "assess": [],
        "interv": [
          "Treino diario: decubito→sentado→poltrona (Todo dia)"
        ],
        "block": "N3 — TCE (Traumatismo Cranioencefalico)",
        "goals": [
          "Iniciar transferencias assistidas"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino diario: decubito→sentado→poltrona (Todo dia)"
            ]
          }
        ]
      },
      {
        "name": "N3.5 — Intolerancia ortostatismo",
        "desc": "Moderado. Queda PA, tontura, palidez",
        "assess": [],
        "interv": [
          "Prancha ortostatica progressiva (1-2x/dia)",
          "Monitorizacao continua sinais vitais (Sempre)"
        ],
        "block": "N3 — TCE (Traumatismo Cranioencefalico)",
        "goals": [
          "Tolerar ortostatismo ≥ 5-10 min"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Prancha ortostatica progressiva (1-2x/dia)",
              "Monitorizacao continua sinais vitais (Sempre)"
            ]
          }
        ]
      },
      {
        "name": "N3.6 — Fraqueza respiratoria",
        "desc": "Moderado. Tosse fraca, PCF baixo, risco atelectasia",
        "assess": [],
        "interv": [
          "Medir PCF, PEmax, PImax (Seriado)",
          "Treinar tosse e huffing (Sessoes)",
          "Mobilizacao precoce (Principal estrategia)"
        ],
        "block": "N3 — TCE (Traumatismo Cranioencefalico)",
        "goals": [
          "Manter via aerea limpa"
        ],
        "phases": [
          {
            "timeframe": "Continuo",
            "interv": [
              "Medir PCF, PEmax, PImax (Seriado)",
              "Treinar tosse e huffing (Sessoes)",
              "Mobilizacao precoce (Principal estrategia)"
            ]
          }
        ]
      },
      {
        "name": "N3.7 — Transicao participacao ativa",
        "desc": "Moderado. Fraqueza global, fadiga rapida",
        "assess": [],
        "interv": [
          "Pre-marcha: transferencia peso, passos no lugar (Treino)",
          "Marcha assistida: barras/andador (2-5 m → progredir)"
        ],
        "block": "N3 — TCE (Traumatismo Cranioencefalico)",
        "goals": [
          "Iniciar ortostatismo e marcha"
        ],
        "phases": [
          {
            "timeframe": "7-14 dias",
            "interv": [
              "Pre-marcha: transferencia peso, passos no lugar (Treino)",
              "Marcha assistida: barras/andador (2-5 m → progredir)"
            ]
          }
        ]
      },
      {
        "name": "N4.1 — Fraqueza respiratoria na lesao medular",
        "desc": "Critico. Paralisia diafragma/intercostais, tosse ineficaz",
        "assess": [],
        "interv": [
          "Avaliar PImax, PEmax, PCF (Inicial e seriado)",
          "Higiene bronquica e tosse assistida (PRN)",
          "TMI: 30-50% PImax 2x/dia (Se PImax < -40)",
          "Posicionamento e expansao (Sedestacao precoce)"
        ],
        "block": "N4 — TRM (Lesao Medular)",
        "goals": [
          "Garantir via aerea limpa, melhorar forca"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Avaliar PImax, PEmax, PCF (Inicial e seriado)",
              "Higiene bronquica e tosse assistida (PRN)",
              "TMI: 30-50% PImax 2x/dia (Se PImax < -40)",
              "Posicionamento e expansao (Sedestacao precoce)"
            ]
          }
        ]
      },
      {
        "name": "N4.2 — Disautonomia / Intolerancia ortostatica",
        "desc": "Grave. Hipotensao ortostatica grave, sincope",
        "assess": [],
        "interv": [
          "Prancha ortostatica 30→70-80° (1-2x/dia)",
          "Medidas auxiliares: meias, faixa abdominal (Suporte)"
        ],
        "block": "N4 — TRM (Lesao Medular)",
        "goals": [
          "Tolerar sedestacao e ortostatismo"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Prancha ortostatica 30→70-80° (1-2x/dia)",
              "Medidas auxiliares: meias, faixa abdominal (Suporte)"
            ]
          }
        ]
      },
      {
        "name": "N4.3 — Imobilismo, contraturas",
        "desc": "Grave. Paralisia, espasticidade, encurtamentos",
        "assess": [],
        "interv": [
          "Mobilizacao passiva global 2x/dia (10-15 rep)",
          "Posicionamento terapeutico rigoroso (Alinhamento, orteses)"
        ],
        "block": "N4 — TRM (Lesao Medular)",
        "goals": [
          "Preservar amplitude e alinhamento"
        ],
        "phases": [
          {
            "timeframe": "Imediato",
            "interv": [
              "Mobilizacao passiva global 2x/dia (10-15 rep)",
              "Posicionamento terapeutico rigoroso (Alinhamento, orteses)"
            ]
          }
        ]
      },
      {
        "name": "N4.4 — Incapacidade transferencias",
        "desc": "Grave. Dependencia total, nao controla tronco",
        "assess": [],
        "interv": [
          "Treino controle tronco (Sedestacao beira leito)",
          "Treino transferencias leito↔cadeira (Diario)"
        ],
        "block": "N4 — TRM (Lesao Medular)",
        "goals": [
          "Iniciar sedestacao e transferencias"
        ],
        "phases": [
          {
            "timeframe": "7-14 dias",
            "interv": [
              "Treino controle tronco (Sedestacao beira leito)",
              "Treino transferencias leito↔cadeira (Diario)"
            ]
          }
        ]
      },
      {
        "name": "N4.5 — Prevencao complicacoes secundarias",
        "desc": "Moderado. TVP, atelectasia, ulcera, osteopenia",
        "assess": [],
        "interv": [
          "Mobilizacao diaria (Obrigatorio)",
          "Mudanca decubito rigorosa (A cada 2h)",
          "Sedestacao/verticalizacao precoce (Diario)"
        ],
        "block": "N4 — TRM (Lesao Medular)",
        "goals": [
          "Reduzir complicacoes imobilidade"
        ],
        "phases": [
          {
            "timeframe": "Continuo",
            "interv": [
              "Mobilizacao diaria (Obrigatorio)",
              "Mudanca decubito rigorosa (A cada 2h)",
              "Sedestacao/verticalizacao precoce (Diario)"
            ]
          }
        ]
      },
      {
        "name": "N4.6 — Transicao funcionalidade (lesao incompleta)",
        "desc": "Moderado. Fraqueza residual, baixa resistencia",
        "assess": [],
        "interv": [
          "Pre-marcha: descarga peso, fortalecimento (Treino)",
          "Marcha assistida se elegivel (Barras/andador)",
          "Treino funcional diario (Progressivo)"
        ],
        "block": "N4 — TRM (Lesao Medular)",
        "goals": [
          "Aumentar independencia"
        ],
        "phases": [
          {
            "timeframe": "14-30 dias",
            "interv": [
              "Pre-marcha: descarga peso, fortalecimento (Treino)",
              "Marcha assistida se elegivel (Barras/andador)",
              "Treino funcional diario (Progressivo)"
            ]
          }
        ]
      },
      {
        "name": "N5.1 — Fraqueza respiratoria progressiva",
        "desc": "Critico. Queda progressiva PImax, PEmax, PCF",
        "assess": [],
        "interv": [
          "Medir PImax, PEmax, PCF diariamente (Monitorar tendencia)",
          "Higiene bronquica e tosse assistida (PRN)",
          "TMI com CAUTELA: 20-30% se estavel (1-2x/dia, interromper se piora)"
        ],
        "block": "N5 — Doencas Neuromusculares",
        "goals": [
          "Monitorar e prevenir falencia"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Medir PImax, PEmax, PCF diariamente (Monitorar tendencia)",
              "Higiene bronquica e tosse assistida (PRN)",
              "TMI com CAUTELA: 20-30% se estavel (1-2x/dia, interromper se piora)"
            ]
          }
        ]
      },
      {
        "name": "N5.2 — Tosse ineficaz / Incapacidade limpar via aerea",
        "desc": "Critico. PCF < 160 L/min, acumulo secrecao",
        "assess": [],
        "interv": [
          "Medir PCF seriado (Monitorar)",
          "Tosse assistida manual/mecanica (Varias vezes/dia)",
          "Air stacking se indicado (Tecnica)"
        ],
        "block": "N5 — Doencas Neuromusculares",
        "goals": [
          "Garantir via aerea limpa"
        ],
        "phases": [
          {
            "timeframe": "Imediato",
            "interv": [
              "Medir PCF seriado (Monitorar)",
              "Tosse assistida manual/mecanica (Varias vezes/dia)",
              "Air stacking se indicado (Tecnica)"
            ]
          }
        ]
      },
      {
        "name": "N5.3 — Fadiga muscular global",
        "desc": "Grave. Fadiga rapida, piora ao longo do dia",
        "assess": [],
        "interv": [
          "Sessoes curtas e fracionadas (Evitar overtraining)",
          "Priorizar funcao, nao cansaco (Estrategia)",
          "Monitorar FR, FC, fadiga (Continuo)"
        ],
        "block": "N5 — Doencas Neuromusculares",
        "goals": [
          "Manter funcao sem piorar"
        ],
        "phases": [
          {
            "timeframe": "7-14 dias",
            "interv": [
              "Sessoes curtas e fracionadas (Evitar overtraining)",
              "Priorizar funcao, nao cansaco (Estrategia)",
              "Monitorar FR, FC, fadiga (Continuo)"
            ]
          }
        ]
      },
      {
        "name": "N5.4 — Perda de mobilidade e funcao",
        "desc": "Grave. Fraqueza proximal/distal, incapacidade funcional",
        "assess": [],
        "interv": [
          "Treino funcional: transferencias, sedestacao (Diario)",
          "Uso de orteses e dispositivos (Auxiliar)",
          "Controle de fadiga (Sempre)"
        ],
        "block": "N5 — Doencas Neuromusculares",
        "goals": [
          "Preservar independencia maxima"
        ],
        "phases": [
          {
            "timeframe": "7-30 dias",
            "interv": [
              "Treino funcional: transferencias, sedestacao (Diario)",
              "Uso de orteses e dispositivos (Auxiliar)",
              "Controle de fadiga (Sempre)"
            ]
          }
        ]
      },
      {
        "name": "N5.5 — Necessidade de VM ou VNI",
        "desc": "Critico. Hipoventilacao, hipercapnia, trabalho ↑",
        "assess": [],
        "interv": [
          "Ajuste e monitorizacao VNI (Continuo)",
          "Avaliar retirada/progressao diaria (Reavaliar)"
        ],
        "block": "N5 — Doencas Neuromusculares",
        "goals": [
          "Manter conforto e PaCO₂ aceitavel"
        ],
        "phases": [
          {
            "timeframe": "Imediato",
            "interv": [
              "Ajuste e monitorizacao VNI (Continuo)",
              "Avaliar retirada/progressao diaria (Reavaliar)"
            ]
          }
        ]
      },
      {
        "name": "N6.1 — Delirium hipoativo",
        "desc": "Grave. Quieto, sonolento, pouco responsivo, imovel",
        "assess": [],
        "interv": [
          "Mobilizacao como medicamento (Todo dia, 2x/dia)",
          "Progressao postura: decubito→sedestacao→poltrona→ortostatismo (Obrigatorio)",
          "Sedestacao em poltrona 30-60 min→2-6h (Estimulo sensorial)",
          "Treino funcional simples: alcancar, sentar-levantar (Sessoes)"
        ],
        "block": "N6 — Delirium / Agitacao",
        "goals": [
          "Aumentar vigilia e mobilidade"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Mobilizacao como medicamento (Todo dia, 2x/dia)",
              "Progressao postura: decubito→sedestacao→poltrona→ortostatismo (Obrigatorio)",
              "Sedestacao em poltrona 30-60 min→2-6h (Estimulo sensorial)",
              "Treino funcional simples: alcancar, sentar-levantar (Sessoes)"
            ]
          }
        ]
      },
      {
        "name": "N6.2 — Delirium hiperativo",
        "desc": "Critico. Agitado, arrancando dispositivos",
        "assess": [],
        "interv": [
          "Mobilizacao como antidelirium (Mesmo agitado: sedestacao/poltrona)",
          "Organizacao respiratoria: revisar conforto VM/O₂ (Se aplicavel)",
          "Sessoes curtas e frequentes 10-15 min (1-3x/dia)"
        ],
        "block": "N6 — Delirium / Agitacao",
        "goals": [
          "Reduzir contencao, organizar"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Mobilizacao como antidelirium (Mesmo agitado: sedestacao/poltrona)",
              "Organizacao respiratoria: revisar conforto VM/O₂ (Se aplicavel)",
              "Sessoes curtas e frequentes 10-15 min (1-3x/dia)"
            ]
          }
        ]
      },
      {
        "name": "N6.3 — Delirium + Imobilidade prolongada",
        "desc": "Grave. Dias/semanas no leito, extremamente fraco",
        "assess": [],
        "interv": [
          "Prancha ortostatica 30-40°→progredir (Progressivo)",
          "Treino transferencias leito↔cadeira (Diario com 2 terapeutas se necessario)"
        ],
        "block": "N6 — Delirium / Agitacao",
        "goals": [
          "Tolerar sedestacao ≥ 20-30 min"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Prancha ortostatica 30-40°→progredir (Progressivo)",
              "Treino transferencias leito↔cadeira (Diario com 2 terapeutas se necessario)"
            ]
          }
        ]
      },
      {
        "name": "N6.4 — Delirium + Fraqueza respiratoria",
        "desc": "Grave. Padrao rapido/superficial, tosse ineficaz",
        "assess": [],
        "interv": [
          "Avaliar FR, padrao, PCF, PEmax, PImax (Seriado)",
          "Integrar: mobilizacao + higiene + treino respiratorio (Abordagem global)"
        ],
        "block": "N6 — Delirium / Agitacao",
        "goals": [
          "Estabilizar padrao, prevenir complicacoes"
        ],
        "phases": [
          {
            "timeframe": "Continuo",
            "interv": [
              "Avaliar FR, padrao, PCF, PEmax, PImax (Seriado)",
              "Integrar: mobilizacao + higiene + treino respiratorio (Abordagem global)"
            ]
          }
        ]
      },
      {
        "name": "N7.1 — Rebaixamento pos-crise / pos-sedativos",
        "desc": "Grave. Sonolencia, confusao, nao segue comandos",
        "assess": [],
        "interv": [
          "Posicionamento: lateral de seguranca, cabeceira elevada (Imediato)",
          "Sedestacao progressiva 10-15 min→20-40 min (24-72h)",
          "Transferencia leito→poltrona diariamente (Quando elegivel)"
        ],
        "block": "N7 — Pos-crise Convulsiva / Status",
        "goals": [
          "Garantir seguranca e verticalizacao"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Posicionamento: lateral de seguranca, cabeceira elevada (Imediato)",
              "Sedestacao progressiva 10-15 min→20-40 min (24-72h)",
              "Transferencia leito→poltrona diariamente (Quando elegivel)"
            ]
          }
        ]
      },
      {
        "name": "N7.2 — Risco aspiracao / Secrecao retida",
        "desc": "Grave. Tosse ineficaz pos-ictal, disfagia",
        "assess": [],
        "interv": [
          "Avaliar tosse: PCF quando possivel (Se PCF < 160: alto risco)",
          "Higiene bronquica por criterio (Ausculta, secrecao, RX)",
          "Tosse/huffing assistidos (PRN)",
          "Mobilizacao precoce (Principal prevencao)"
        ],
        "block": "N7 — Pos-crise Convulsiva / Status",
        "goals": [
          "Manter via aerea limpa, prevenir pneumonia"
        ],
        "phases": [
          {
            "timeframe": "Imediato",
            "interv": [
              "Avaliar tosse: PCF quando possivel (Se PCF < 160: alto risco)",
              "Higiene bronquica por criterio (Ausculta, secrecao, RX)",
              "Tosse/huffing assistidos (PRN)",
              "Mobilizacao precoce (Principal prevencao)"
            ]
          }
        ]
      },
      {
        "name": "N7.3 — Instabilidade autonômica / Fadiga",
        "desc": "Moderado. Taquicardia, PA labil, fadiga intensa",
        "assess": [],
        "interv": [
          "Sessoes curtas 5-10 min, 1-3x/dia (Fracionado)",
          "Escada postural: cabeceira→sedestacao→poltrona→ortostatismo (Progressivo)",
          "Monitorar PA, FC, SpO₂ continuamente (Sempre)"
        ],
        "block": "N7 — Pos-crise Convulsiva / Status",
        "goals": [
          "Mobilizar sem instabilizar"
        ],
        "phases": [
          {
            "timeframe": "24-72h",
            "interv": [
              "Sessoes curtas 5-10 min, 1-3x/dia (Fracionado)",
              "Escada postural: cabeceira→sedestacao→poltrona→ortostatismo (Progressivo)",
              "Monitorar PA, FC, SpO₂ continuamente (Sempre)"
            ]
          }
        ]
      },
      {
        "name": "N7.4 — Fraqueza global / Descondicionamento",
        "desc": "Grave. Nao consegue sentar, levantar, transferir",
        "assess": [],
        "interv": [
          "Treino controle tronco: deslocamento peso, alcance (Beira-leito)",
          "Transferencias terapeuticas: rolar→sentar→sentar/levantar→pivot (Diario)",
          "Ortostatismo: prancha 30→60-80° se intolerante (Progressivo)"
        ],
        "block": "N7 — Pos-crise Convulsiva / Status",
        "goals": [
          "Recuperar funcao basica"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino controle tronco: deslocamento peso, alcance (Beira-leito)",
              "Transferencias terapeuticas: rolar→sentar→sentar/levantar→pivot (Diario)",
              "Ortostatismo: prancha 30→60-80° se intolerante (Progressivo)"
            ]
          }
        ]
      },
      {
        "name": "N7.5 — Paciente em VM apos status",
        "desc": "Critico. Fraqueza respiratoria, tosse ineficaz, assincronia",
        "assess": [],
        "interv": [
          "Revisar conforto ventilatorio: trigger, fluxo, suporte (Imediato)",
          "Higiene bronquica por criterio (PRN)",
          "Mobilizacao precoce em VM: sedestacao, poltrona (Se estavel)",
          "Avaliar prontidao TRE/desmame 48-72h (Integrar com R5)"
        ],
        "block": "N7 — Pos-crise Convulsiva / Status",
        "goals": [
          "Garantir ventilacao segura, avaliar desmame"
        ],
        "phases": [
          {
            "timeframe": "0-24h",
            "interv": [
              "Revisar conforto ventilatorio: trigger, fluxo, suporte (Imediato)",
              "Higiene bronquica por criterio (PRN)",
              "Mobilizacao precoce em VM: sedestacao, poltrona (Se estavel)",
              "Avaliar prontidao TRE/desmame 48-72h (Integrar com R5)"
            ]
          }
        ]
      },
      {
        "name": "N7.6 — Risco recorrencia crise durante terapia",
        "desc": "Moderado. Historia recente de crise/status",
        "assess": [],
        "interv": [
          "Ambiente seguro: cama baixa, laterais, equipe proxima (Sempre)",
          "Primeiras sessoes: em leito/sentado→progredir (Cautela)",
          "Evitar estimulos extremos: hiperventilacao, fadiga extenuante (Controle)",
          "Se crise: proteger, lateral, suspender, acionar equipe (Protocolo)"
        ],
        "block": "N7 — Pos-crise Convulsiva / Status",
        "goals": [
          "Mobilizar com seguranca"
        ],
        "phases": [
          {
            "timeframe": "Imediato",
            "interv": [
              "Ambiente seguro: cama baixa, laterais, equipe proxima (Sempre)",
              "Primeiras sessoes: em leito/sentado→progredir (Cautela)",
              "Evitar estimulos extremos: hiperventilacao, fadiga extenuante (Controle)",
              "Se crise: proteger, lateral, suspender, acionar equipe (Protocolo)"
            ]
          }
        ]
      },
      {
        "name": "N8.1 — Risco lesao pulmonar (VILI)",
        "desc": "Critico. Pulmao normal pode virar lesionado por VM inadequada",
        "assess": [],
        "interv": [
          "Vt: 6-8 mL/kg, Pplato < 30, ΔP < 12-14 (VM protetora obrigatoria)",
          "PEEP: 8-10, ajustar por mecanica (Evitar colapso)",
          "FiO₂: minima para SpO₂ > 92-95% (Titular)",
          "Monitorar complacencia, Pplato, ΔP, curvas (Continuo)",
          "MRA somente se queda SpO₂/atelectasia, seguida de ajuste PEEP (Criterioso)"
        ],
        "block": "N8 — Morte Encefalica (Doador)",
        "goals": [
          "Manter VM protetora, preservar pulmao para transplante"
        ],
        "phases": [
          {
            "timeframe": "Imediato e continuo",
            "interv": [
              "Vt: 6-8 mL/kg, Pplato < 30, ΔP < 12-14 (VM protetora obrigatoria)",
              "PEEP: 8-10, ajustar por mecanica (Evitar colapso)",
              "FiO₂: minima para SpO₂ > 92-95% (Titular)",
              "Monitorar complacencia, Pplato, ΔP, curvas (Continuo)",
              "MRA somente se queda SpO₂/atelectasia, seguida de ajuste PEEP (Criterioso)"
            ]
          }
        ]
      },
      {
        "name": "N8.2 — Atelectasia por imobilidade",
        "desc": "Grave. Perda suspiros, colapso gravitacional",
        "assess": [],
        "interv": [
          "Alternancia decubitos a cada 2h (Rigoroso)",
          "Evitar decubito dorsal prolongado (Preferir lateral alternado)",
          "Semifowler quando possivel (Posicionar)"
        ],
        "block": "N8 — Morte Encefalica (Doador)",
        "goals": [
          "Manter pulmao totalmente expandido"
        ],
        "phases": [
          {
            "timeframe": "Continuo",
            "interv": [
              "Alternancia decubitos a cada 2h (Rigoroso)",
              "Evitar decubito dorsal prolongado (Preferir lateral alternado)",
              "Semifowler quando possivel (Posicionar)"
            ]
          }
        ]
      },
      {
        "name": "N8.3 — Secrecao bronquica",
        "desc": "Grave. Tosse inexistente, drenagem abolida",
        "assess": [],
        "interv": [
          "Aspiracao por criterio (PRN)",
          "Mobilizacao de secrecao, vibrocompressao (Tecnicas)",
          "Monitorar PIP, ausculta, SpO₂ (Continuo)"
        ],
        "block": "N8 — Morte Encefalica (Doador)",
        "goals": [
          "Manter vias aereas pervias"
        ],
        "phases": [
          {
            "timeframe": "Continuo",
            "interv": [
              "Aspiracao por criterio (PRN)",
              "Mobilizacao de secrecao, vibrocompressao (Tecnicas)",
              "Monitorar PIP, ausculta, SpO₂ (Continuo)"
            ]
          }
        ]
      },
      {
        "name": "N8.4 — Instabilidade hemodinamica induzida VM",
        "desc": "Critico. PEEP alta→queda retorno, manobras→colapso",
        "assess": [],
        "interv": [
          "Recrutamento/ajuste PEEP: feito com equipe medica (Sempre)",
          "Monitorar PA invasiva, FC, debito urinario (Continuo)"
        ],
        "block": "N8 — Morte Encefalica (Doador)",
        "goals": [
          "Manter PAM ≥ 65 mmHg"
        ],
        "phases": [
          {
            "timeframe": "Imediato",
            "interv": [
              "Recrutamento/ajuste PEEP: feito com equipe medica (Sempre)",
              "Monitorar PA invasiva, FC, debito urinario (Continuo)"
            ]
          }
        ]
      },
      {
        "name": "N8.5 — Hipotermia e alteracoes metabolicas",
        "desc": "Grave. Perda controle termico, hipotermia→piora oxigenacao",
        "assess": [],
        "interv": [
          "Monitorar temperatura (Continuo)",
          "Evitar exposicao excessiva (Durante procedimentos)",
          "Ajustar ventilacao conforme gasometria (Em conjunto com equipe)"
        ],
        "block": "N8 — Morte Encefalica (Doador)",
        "goals": [
          "Manter normotermia e estabilidade"
        ],
        "phases": [
          {
            "timeframe": "Continuo",
            "interv": [
              "Monitorar temperatura (Continuo)",
              "Evitar exposicao excessiva (Durante procedimentos)",
              "Ajustar ventilacao conforme gasometria (Em conjunto com equipe)"
            ]
          }
        ]
      },
      {
        "name": "N8.6 — Preparacao para captacao",
        "desc": "Critico. Pulmao precisa estar expandido, limpo, estavel",
        "assess": [],
        "interv": [
          "VM protetora rigorosa (Obrigatorio)",
          "Higiene bronquica impecavel (Continuo)",
          "Posicao adequada (Monitorado)",
          "Gasometrias de controle (Seriadas)",
          "Evitar: atelectasia, infeccao, hipoxemia (Prevencao total)"
        ],
        "block": "N8 — Morte Encefalica (Doador)",
        "goals": [
          "Manter pulmao em condicoes ideais ate captacao"
        ],
        "phases": [
          {
            "timeframe": "Ate o fim",
            "interv": [
              "VM protetora rigorosa (Obrigatorio)",
              "Higiene bronquica impecavel (Continuo)",
              "Posicao adequada (Monitorado)",
              "Gasometrias de controle (Seriadas)",
              "Evitar: atelectasia, infeccao, hipoxemia (Prevencao total)"
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
        "name": "F1.P1 — Deficit de controle de tronco",
        "desc": "Grave. Incapacidade sedestacao sem apoio >30-60s, TCT reduzida",
        "assess": [],
        "interv": [
          "Posicionamento terapeutico: sedestacao borda leito/poltrona, quadril ~90°, pes apoiados",
          "Ativacao de tronco: co-contracao isometrica paravertebrais+transverso+obliquos",
          "Treino controle postural: posicao neutra, deslocamentos peso, alcances funcionais",
          "Perturbacoes externas: empurroes leves imprevisiveis no tronco",
          "Transferencia de base de suporte, prancha ortostatica se intolerancia postural"
        ],
        "block": "F1 — Neurologico-Funcional",
        "goals": [
          "Manter sedestacao com apoio ≥3-5 min",
          "Manter sedestacao ≥10-20 min sem apoio (medio prazo)"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Posicionamento",
              "Ativacao tronco",
              "Treino controle postural"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Transferencia base suporte",
              "Prancha se necessario"
            ]
          }
        ]
      },
      {
        "name": "F1.P2 — Alteracao de tonus (hipotonia/hipertonia/espasticidade)",
        "desc": "Moderado. Ashworth ≥1+, hipotonia com instabilidade proximal",
        "assess": [],
        "interv": [
          "Posicionamento terapeutico 24h: inibir padroes espasticos, alongamento prolongado",
          "Alongamento terapeutico prolongado 30-120s por grupo, 3-5 rep, 1-2x/dia",
          "Mobilizacao passiva, ativo-assistida e ativa 2-3 series 10-15 rep",
          "Inibicao de padroes espasticos, facilitacao neuromuscular em hipotonia",
          "Treino funcional com controle de tonus"
        ],
        "block": "F1 — Neurologico-Funcional",
        "goals": [
          "Reduzir resistencia ao movimento passivo",
          "Aumentar ADM funcional"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Posicionamento 24h",
              "Alongamento prolongado",
              "Mobilizacao"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Inibicao padroes",
              "Facilitacao"
            ]
          }
        ]
      },
      {
        "name": "F1.P3 — Hemiparesia / Tetraparesia de origem central",
        "desc": "Grave. Assimetria motora, padroes sinergicos patologicos",
        "assess": [],
        "interv": [
          "Facilitacao neuromuscular (Bobath/task-oriented)",
          "Feedback multimodal: visual, tátil, verbal",
          "Tarefas orientadas a objetivo: alcancar, pegar, empurrar",
          "Treino transferencias simetricas: rolar bilateral, sentar-levantar",
          "Fortalecimento funcional, controle postural simetrico",
          "Treino de marcha se aplicavel"
        ],
        "block": "F1 — Neurologico-Funcional",
        "goals": [
          "Ativacao voluntaria lado afetado",
          "Integrar membro afetado em tarefas funcionais"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Facilitacao",
              "Feedback",
              "Tarefas objetivo",
              "Transferencias simetricas"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Fortalecimento",
              "Controle postural",
              "Marcha"
            ]
          }
        ]
      },
      {
        "name": "F1.P4 — Apraxia / Deficit de planejamento motor",
        "desc": "Moderado. Nao executa tarefas apesar de forca e compreensao",
        "assess": [],
        "interv": [
          "Fragmentacao de tarefas em micro-etapas",
          "Treino de sequencia motora com ordem fixa",
          "Pistas multimodais graduadas: fisica→tátil→demonstracao→verbal→visual",
          "Repeticao em contexto funcional real com objetos reais"
        ],
        "block": "F1 — Neurologico-Funcional",
        "goals": [
          "Completar 2-3 tarefas basicas com pistas",
          "Executar 5-8 tarefas com pistas minimas (medio prazo)"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Fragmentacao",
              "Sequencia",
              "Pistas"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao complexidade",
              "Treino iniciacao"
            ]
          }
        ]
      },
      {
        "name": "F1.P5 — Ataxia / Incoordenacao",
        "desc": "Moderado. Dismetria, decomposicao de movimento, marcha ataxica",
        "assess": [],
        "interv": [
          "Reducao de velocidade: movimentos lentos e controlados",
          "Aumento de base de suporte em ortostatismo e sedestacao",
          "Treino com controle visual: alcancar alvo, tocar pontos",
          "Tarefas de precisao progressiva: alvos grandes→pequenos",
          "Progressao gradual, treino sem feedback visual",
          "Tarefas funcionais finas, marcha coordenada"
        ],
        "block": "F1 — Neurologico-Funcional",
        "goals": [
          "Reduzir dismetria em ≥30%",
          "Coordenação para AVDs basicas"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Velocidade reduzida",
              "Base suporte",
              "Controle visual"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Precisao",
              "Marcha coordenada"
            ]
          }
        ]
      },
      {
        "name": "F1.P6 — Negligencia espacial / Deficit atencao unilateral",
        "desc": "Moderado. Ignora hemicorpo, colide com objetos",
        "assess": [],
        "interv": [
          "Posicionamento estrategico: objetos/pessoas no lado negligenciado",
          "Treino varredura visual: buscar objetos, contar itens",
          "Uso forçado do hemicorpo afetado: tarefas bilaterais obrigatorias",
          "Pistas verbais e tateis constantes",
          "Integracao em tarefas funcionais e mobilidade com atencao espacial"
        ],
        "block": "F1 — Neurologico-Funcional",
        "goals": [
          "Aumentar consciencia hemicorpo em ≥50%",
          "Uso espontaneo do membro em tarefas"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Posicionamento",
              "Varredura visual",
              "Uso forçado"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao dificuldade",
              "Integracao AVDs"
            ]
          }
        ]
      },
      {
        "name": "F1.P7 — Rebaixamento cognitivo funcional / Delirium com impacto motor",
        "desc": "Grave. Nao mantem atencao, flutuacao consciencia, nao segue comandos",
        "assess": [],
        "interv": [
          "Sessoes curtas e frequentes: 3-7 min, 4-6x/dia",
          "Mesmas tarefas repetidas (2-3 fixas), poucas variacoes",
          "Contexto funcional real: sentar para comer, levantar para banheiro",
          "Feedback intenso no inicio, orientacao constante",
          "Progressao muito gradual: +2-3 min/dia, 1 nova tarefa a cada 2-3 dias"
        ],
        "block": "F1 — Neurologico-Funcional",
        "goals": [
          "Atencao sustentada ≥3-5 min",
          "Participar 20-30 min conforme melhora"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Sessoes curtas 4-6x/dia",
              "Mesmas tarefas",
              "Contexto real"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao gradual",
              "Orientacao"
            ]
          }
        ]
      },
      {
        "name": "F1.P8 — Baixa capacidade de aprendizado motor",
        "desc": "Moderado. Nao retem ganho entre sessoes, reaprendizado constante",
        "assess": [],
        "interv": [
          "Repeticao massiva: 20-30 rep/tarefa, 2-3 tarefas, 2-4 sessoes/dia",
          "Mesmas tarefas todo dia, contexto funcional sempre igual",
          "Progressao micro: 1 pequena variacao por vez a cada 3-5 dias",
          "Teste de retencao no inicio de cada sessao"
        ],
        "block": "F1 — Neurologico-Funcional",
        "goals": [
          "Reter habilidade dentro da sessao",
          "Reter ganho entre sessoes (medio prazo)"
        ],
        "phases": [
          {
            "timeframe": "0-5 dias",
            "interv": [
              "Repeticao massiva",
              "Tarefas fixas",
              "Alta frequencia"
            ]
          },
          {
            "timeframe": "1-3 semanas",
            "interv": [
              "Progressao micro",
              "Espacamento progressivo"
            ]
          }
        ]
      },
      {
        "name": "F1.P9 — Deficit de transicoes posturais (rolar, sentar, levantar)",
        "desc": "Grave. Incapacidade ou grande dificuldade de rolar, decubito→sentado→pe",
        "assess": [],
        "interv": [
          "Treino rolar no leito: dissociacao cinturas, 3-5 series 5-10 rep/lado",
          "Passagem decubito→sedestacao: sequencia fixa rolar, pernas fora, empurrar, organizar tronco",
          "Treino sentar→levantar (sit-to-stand): pes apoiados, tronco à frente, 3-5 series 5-10 rep",
          "Controle peso e simetria, prancha ortostatica se intolerancia"
        ],
        "block": "F1 — Neurologico-Funcional",
        "goals": [
          "Executar 1 transicao com reducao 1 nivel assistencia",
          "Transferencias basicas seguras ate alta"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Rolar",
              "Decubito→sentado",
              "Sit-to-stand"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Controle peso",
              "Prancha se necessario"
            ]
          }
        ]
      },
      {
        "name": "F2.P1 — Dessaturacao ao esforco ou mudanca postural",
        "desc": "Grave. SpO2 <90-92% ao sentar/pe/andar, queda ≥4%",
        "assess": [],
        "interv": [
          "Otimizacao suporte O2: meta SpO2 individual, CNAF/VNI durante esforco se necessario",
          "Mobilizacao fracionada e progressiva com pausas programadas",
          "Controle ventilatorio durante esforco: ritmo, evitar apneia",
          "Reducao custo energetico: altura cama/cadeira, tecnica",
          "Treino aerobio leve intervalado 1-2 min esforco/1-2 min pausa"
        ],
        "block": "F2 — Cardiorrespiratorio Funcional",
        "goals": [
          "Sedestacao ≥10 min com SpO2 ≥92%",
          "Ortostatismo ≥3-5 min sem dessaturar"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "O2",
              "Fracionado",
              "Controle ventilatorio"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino intervalado"
            ]
          }
        ]
      },
      {
        "name": "F2.P2 — Taquicardia desproporcional ao esforco",
        "desc": "Moderado. FC >20-30 bpm com tarefas leves, FC elevada apos cessar",
        "assess": [],
        "interv": [
          "Zona segura: 60-80% FCmax (ou limite clinico)",
          "Treino aerobio intervalado baixa intensidade: 1-2 min esforco/1-2 min pausa",
          "Progressao: mais tempo → mais repeticoes → mais velocidade/distancia"
        ],
        "block": "F2 — Cardiorrespiratorio Funcional",
        "goals": [
          "Sedestacao + 1 transferencia com FC <80-85% FCmax"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Definir zona",
              "Intervalado"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao carga"
            ]
          }
        ]
      },
      {
        "name": "F2.P3 — Hipotensao ao ortostatismo ou durante esforco",
        "desc": "Grave. Queda PAS ≥20 ou PAD ≥10 mmHg, tontura, escurecimento",
        "assess": [],
        "interv": [
          "Verticalizacao progressiva: 30°→45°→60°→75°→90°, 3-5 min/posicao",
          "Prancha ortostatica se intolerancia grave: 30-45°→60-80°, monitorar PA/FC/sintomas"
        ],
        "block": "F2 — Cardiorrespiratorio Funcional",
        "goals": [
          "Tolerar sedestacao ≥10-20 min sem queda sintomatica"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Verticalizacao progressiva",
              "Prancha se necessario"
            ]
          }
        ]
      },
      {
        "name": "F2.P4 — Dispneia desproporcional ao nivel de atividade",
        "desc": "Grave. Borg ≥5 em atividades leves, FR >28-30",
        "assess": [],
        "interv": [
          "Treino padrao respiratorio: inspiracao nasal lenta, expiracao prolongada (lábios semicerrados)",
          "TMI se indicado: 30% PImax, 2x/dia, 3 series 10-15 rep",
          "Mobilizacao intervalada: 1-2 min esforco/1-2 min pausa"
        ],
        "block": "F2 — Cardiorrespiratorio Funcional",
        "goals": [
          "1 tarefa basica com Borg ≤4",
          "Mobilidade basica com dispneia toleravel"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Padrao respiratorio",
              "TMI se indicado"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Mobilizacao intervalada"
            ]
          }
        ]
      },
      {
        "name": "F2.P5 — Baixa tolerancia à posicao sentada/em pe",
        "desc": "Grave. Nao mantem sedestacao/ortostatismo >1-5 min",
        "assess": [],
        "interv": [
          "Verticalizacao progressiva: cabeceira, prancha, leito-chair, tilt table",
          "Sedestacao ativa: beira leito→poltrona, 2-5 min→20-30 min",
          "Ortostatismo assistido: 30-60s→pausa→repetir até 3-5 min",
          "Controle hemodinamico: PA/FC/SpO2 antes e durante, interromper se PAS ↓≥20 ou Borg >7"
        ],
        "block": "F2 — Cardiorrespiratorio Funcional",
        "goals": [
          "Sedestacao ≥5-10 min com estabilidade",
          "Sedestacao ≥20 min, ortostatismo ≥3-5 min (medio prazo)"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Verticalizacao",
              "Sedestacao ativa",
              "Ortostatismo assistido"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Controle hemodinamico"
            ]
          }
        ]
      },
      {
        "name": "F2.P6 — Resposta cronotropica inadequada",
        "desc": "Moderado. FC nao sobe (betabloqueado) ou sobe demais",
        "assess": [],
        "interv": [
          "Nao usar FC como unico guia: priorizar Borg 3-5, capacidade de falar, sinais clinicos",
          "Exercicio em bloco curto intervalado: 1-3 min esforco/1-2 min pausa",
          "Condicionamento progressivo, treino de recuperacao autonômica"
        ],
        "block": "F2 — Cardiorrespiratorio Funcional",
        "goals": [
          "Identificar perfil FC do paciente",
          "Borg e sintomas como guias primarios"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Mudanca paradigma",
              "Intervalado"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Condicionamento",
              "Recuperacao"
            ]
          }
        ]
      },
      {
        "name": "F2.P7 — Disautonomia pos-UTI / pos-COVID / sepse",
        "desc": "Grave. Oscilacoes PA/FC imprevisiveis, fadiga extrema ao esforco leve",
        "assess": [],
        "interv": [
          "Verticalizacao ultra gradual: incrementos 5-10° a cada 3-5 min",
          "Exposicao postural fracionada: multiplas sessoes curtas/dia",
          "Ativacao muscular periferica: MMII em decubito e sedestacao",
          "Controle respiratorio: evitar hiperventilacao"
        ],
        "block": "F2 — Cardiorrespiratorio Funcional",
        "goals": [
          "Exposicao postural sem eventos autonômicos graves"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Verticalizacao gradual",
              "Fracionado",
              "Ativacao MMII"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Controle respiratorio"
            ]
          }
        ]
      },
      {
        "name": "F3.P1 — Dor limitante funcional",
        "desc": "Grave. EVA ≥6 repouso ou ≥4 em funcao",
        "assess": [],
        "interv": [
          "Sincronizacao com analgesia: sessao 30-60 min apos analgesico",
          "Crioterapia 15-20 min pre-mobilizacao (inflamatoria), termoterapia se rigidez",
          "TENS se disponivel, posicionamento terapeutico, mobilizacao protegida",
          "Ativacao isometrica leve, educacao em dor, exposicao gradual"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Reduzir EVA ≥2 pontos",
          "EVA ≤3-4 repouso, ≤5 movimento"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Sincronizacao analgesia",
              "Crioterapia/termo",
              "TENS",
              "Posicionamento",
              "Mobilizacao protegida"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Isometricos",
              "Educacao",
              "Exposicao gradual"
            ]
          }
        ]
      },
      {
        "name": "F3.P2 — Limitacao ADM com impacto funcional",
        "desc": "Moderado. ADM reduzida que impede padroes basicos",
        "assess": [],
        "interv": [
          "Mobilizacao passiva manual 3-5 series 10-15 rep",
          "Alongamento estatico sustentado 30-90s, 3-5 rep, 2x/dia",
          "Termoterapia pre-mobilizacao, mobilizacao em padroes funcionais",
          "Mobilizacao ativo-assistida, integracao em tarefas"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Recuperar 5-10° ADM em articulacao-alvo",
          "ADM minima funcional"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Passiva",
              "Alongamento",
              "Termo",
              "Padroes funcionais"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Ativo-assistida",
              "Integracao"
            ]
          }
        ]
      },
      {
        "name": "F3.P3 — Rigidez articular e capsular (pos-imobilismo/pos-op)",
        "desc": "Moderado. Rigidez matinal, dor ao fim ADM, padrao capsular",
        "assess": [],
        "interv": [
          "Mobilizacao articular manual (Maitland/Kaltenborn) graus III-IV",
          "Alongamento capsular prolongado 60-120s",
          "Termoterapia pre-mobilizacao, mobilizacao em diagonal/padroes FNP",
          "Treino ativo na nova amplitude, crioterapia pos se inflamacao"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Reduzir rigidez matinal ≥30%",
          "Ganhar 10-20° ADM total"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Mobilizacao articular",
              "Alongamento capsular",
              "Termo"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Ativo na nova amplitude",
              "Integracao funcional"
            ]
          }
        ]
      },
      {
        "name": "F3.P4 — Contraturas e encurtamentos",
        "desc": "Grave. Perda sustentada ADM, posturas fixas (flexao joelho, equino)",
        "assess": [],
        "interv": [
          "Alongamento prolongado baixa intensidade (LPLI): 2-5 min sustentacao, 3-5 rep, 2-3x/dia",
          "Posicionamento terapeutico 24h: cunhas, rolos, orteses seriadas",
          "Mobilizacao articular suave, termoterapia pre-alongamento",
          "Orteses seriadas, fortalecimento antagonistas, FES se disponivel"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Evitar progressao (prioridade maxima)",
          "Ganhar 5-15° ADM cumulativo"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "LPLI",
              "Posicionamento 24h",
              "Mobilizacao suave"
            ]
          },
          {
            "timeframe": "1-3 semanas",
            "interv": [
              "Orteses seriadas",
              "Fortalecimento antagonistas"
            ]
          }
        ]
      },
      {
        "name": "F3.P5 — Instabilidade articular / protecao mecanica",
        "desc": "Moderado. Sensacao falseio, instabilidade pos-trauma/pos-op",
        "assess": [],
        "interv": [
          "Protecao mecanica inteligente: ortese/imobilizador/taping conforme necessario",
          "Ativacao isometrica de estabilizadores 3-5 series 5-10s 8-12 rep",
          "Reducao cinesiofobia, treino transferencia peso controlada 25%→50%→75%",
          "Progressao isometrico→isotônico→funcional, treino proprioceptivo"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Estabilidade segura para funcao basica",
          "Controle articular dinamico em tarefas"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Protecao",
              "Isometricos",
              "Transferencia peso"
            ]
          },
          {
            "timeframe": "3-10 dias",
            "interv": [
              "Progressao",
              "Propriocepcao",
              "Integracao"
            ]
          }
        ]
      },
      {
        "name": "F3.P6 — Fraqueza periferica assimetrica (nao neurologica central)",
        "desc": "Moderado. Incapacidade vencer gravidade em segmentos especificos",
        "assess": [],
        "interv": [
          "Sobrecarga progressiva: MRC 0-2 gravidade eliminada/facilitacao, MRC 3 contra gravidade, MRC 4-5 resistencia",
          "Protocolo fortalecimento: 50-70% max, 2-4 series 8-12 rep, 5-7x/semana",
          "Facilitacao neuromuscular se MRC <3, FES se disponivel",
          "Progressao carga, treino funcional orientado à tarefa, excêntrico se tolerado"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Aumentar forca ≥1 ponto MRC",
          "MRC ≥4, simetria >70%"
        ],
        "phases": [
          {
            "timeframe": "0-5 dias",
            "interv": [
              "Sobrecarga adequada",
              "Protocolo",
              "Facilitacao/FES"
            ]
          },
          {
            "timeframe": "5-14 dias",
            "interv": [
              "Progressao",
              "Treino funcional",
              "Excêntrico"
            ]
          }
        ]
      },
      {
        "name": "F3.P7 — Restricao de carga (NWB/PWB/TTWB)",
        "desc": "Moderado. Prescricao NWB/PWB/TTWB, pos-op ortopedico",
        "assess": [],
        "interv": [
          "Educacao precisa: NWB, TTWB ~10kg, PWB 25-50%, WBAT. Balanca para mostrar nivel",
          "Treino intensivo com dispositivo: andador/muletas, sequencia passos, sentar-levantar com dispositivo",
          "Transferencias seguras respeitando restricao, identificar sinais de violacao",
          "Fortalecimento segmentos nao restritos, manutencao membro restrito (ADM permitida, isometricos)"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "100% adesao à restricao",
          "Marcha/transferir com dispositivo seguro"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Educacao",
              "Treino dispositivo",
              "Transferencias"
            ]
          },
          {
            "timeframe": "Ate liberacao",
            "interv": [
              "Fortalecimento outros segmentos",
              "Manutencao membro restrito"
            ]
          }
        ]
      },
      {
        "name": "F3.P8 — Pos-operatorio ortopedico com risco de complicacoes",
        "desc": "Moderado. Edema, dor+imobilismo, dificuldade ativacao muscular",
        "assess": [],
        "interv": [
          "Respeito absoluto ao protocolo cirurgico: carga, ADM, posicoes proibidas",
          "Crioterapia 15-20 min 4-6x/dia, elevacao, compressao, drenagem suave",
          "Ativacao muscular precoce: isometricos quadriceps/gluteos D1, 3-5 series 10 contracoes 5s",
          "Prevencao TVP: mobilizacao precoce, exercicios tornozelo 1-2h",
          "Mobilizacao passiva/ativa dentro dos limites, progressao ADM e fortalecimento conforme protocolo"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Mobilizacao precoce segura",
          "ADM minima, dor EVA ≤3-4, funcionalidade basica"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Protocolo",
              "Crioterapia",
              "Ativacao precoce",
              "TVP",
              "Mobilizacao"
            ]
          },
          {
            "timeframe": "3-14 dias",
            "interv": [
              "Progressao ADM",
              "Fortalecimento",
              "Treino funcional"
            ]
          }
        ]
      },
      {
        "name": "F3.P9 — Fraqueza muscular GLOBAL (ICU-AW, imobilismo prolongado)",
        "desc": "Grave. MRC-sum <48, incapacidade vencer gravidade multiplos grupos",
        "assess": [],
        "interv": [
          "Avaliacao sistematica MRC-sum, reavaliar 3-5 dias",
          "Mobilizacao precoce progressiva: passiva→ativo-assistida→ativa→resistida",
          "EENM se disponivel 30-50 Hz, quadriceps/tibial/deltoide/triceps",
          "Ativacao funcional multiarticular, treino aerobico baixa intensidade 40-60% FCmax",
          "Progressao carga sistematica, treino funcional intensivo, otimizacao nutricional"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "MRC-sum +3-5 pontos",
          "MRC-sum ≥48, transferencias assistencia minima"
        ],
        "phases": [
          {
            "timeframe": "0-5 dias",
            "interv": [
              "Avaliacao",
              "Mobilizacao progressiva",
              "EENM",
              "Funcional",
              "Aerobico"
            ]
          },
          {
            "timeframe": "5-14 dias",
            "interv": [
              "Progressao carga",
              "Treino funcional",
              "Nutricao"
            ]
          }
        ]
      },
      {
        "name": "F3.P10 — Fraqueza MMII com impacto em transferencias e marcha",
        "desc": "Grave. Incapacidade sentar-levantar sem assistencia, marcha impossivel ou claudicante",
        "assess": [],
        "interv": [
          "Fortalecimento prioritario quadriceps e gluteos: MRC 0-2 gravidade eliminada/facilitacao/EENM, MRC 3 contra gravidade, MRC 4-5 resistencia",
          "Treino sentar-levantar: cadeira alta→padrao→baixa, 3-5 series 5-10 rep",
          "Ativacao dorsiflexores (tibial anterior), AFO se necessario",
          "Ortostatismo estatico: 30s→1 min→3 min→5 min",
          "Treino marcha progressivo: paralelas→andador→muletas→bengala→independente"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Quadriceps/gluteos MRC ≥3",
          "Sentar-levantar assistencia minima, marcha com dispositivo"
        ],
        "phases": [
          {
            "timeframe": "0-5 dias",
            "interv": [
              "Quadriceps/gluteos",
              "Sit-to-stand",
              "Dorsiflexores",
              "Ortostatismo"
            ]
          },
          {
            "timeframe": "5-14 dias",
            "interv": [
              "Marcha progressiva",
              "Step",
              "Fortalecimento resistido"
            ]
          }
        ]
      },
      {
        "name": "F3.P11 — Fraqueza MMSS com impacto em AVDs",
        "desc": "Moderado. Incapacidade pentear, levar comida à boca, vestir-se",
        "assess": [],
        "interv": [
          "Fortalecimento ombro (deltoide): MRC 0-2 facilitacao/EENM, MRC 3 contra gravidade, MRC 4-5 resistencia",
          "Treino alimentacao: copo vazio→com agua→talher→colher com comida",
          "Preensao e forca de pinça: massa terapeutica, objetos pequenos, bola",
          "Integracao higiene: escovar dentes, pentear, lavar rosto",
          "Fortalecimento resistido progressivo, treino vestir-se, alcance funcional"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Deltoides/triceps/biceps MRC ≥3",
          "Alimentacao independente, higiene facial independente"
        ],
        "phases": [
          {
            "timeframe": "0-5 dias",
            "interv": [
              "Ombro",
              "Alimentacao",
              "Preensao",
              "Higiene"
            ]
          },
          {
            "timeframe": "5-14 dias",
            "interv": [
              "Resistido",
              "Vestir",
              "Alcance"
            ]
          }
        ]
      },
      {
        "name": "F3.P12 — Fraqueza CORE/TRONCO (muscular, nao neurologica)",
        "desc": "Moderado. Incapacidade sedestacao sem apoio MMSS por fraqueza pura",
        "assess": [],
        "interv": [
          "Ativacao isometrica core: transverso, multífidos, obliquos 5-10s, 3-5 series 8-12 rep",
          "Sedestacao ativa borda leito sem apoio MMSS 30-60s→progredir",
          "Treino rolar: com ajuda→pista tátil→verbal→independente",
          "Posicao prona se tolerado 2-5 min 2-3x/dia",
          "Fortalecimento dinamico: ponte, dead bug, bird dog, prancha, side plank"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Sedestacao sem apoio MMSS ≥1-2 min",
          "Sedestacao ≥10-15 min, rolar independente"
        ],
        "phases": [
          {
            "timeframe": "0-5 dias",
            "interv": [
              "Isometricos core",
              "Sedestacao ativa",
              "Rolar",
              "Prono"
            ]
          },
          {
            "timeframe": "5-14 dias",
            "interv": [
              "Fortalecimento dinamico",
              "Integracao funcional"
            ]
          }
        ]
      },
      {
        "name": "F3.P13 — Atrofia muscular / Sarcopenia / Perda massa muscular",
        "desc": "Moderado. Perimetria reduzida >2cm, perda visivel volume",
        "assess": [],
        "interv": [
          "Otimizacao nutricional: proteina ≥1.5-2 g/kg/dia, calorias ≥30-35 kcal/kg, HMB/leucina/creatina",
          "Treino resistido alta intensidade: 60-80% max, 3-5 series 6-12 rep, 5-7x/semana",
          "EENM 50-100 Hz alta intensidade 30-45 min se nao consegue voluntario",
          "Perimetria seriada baseline + 7 dias, periodizacao hipertrofia/forca"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Estabilizar perda (prioridade)",
          "Ganhar 1-3cm perimetria"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "Nutricao",
              "Treino resistido",
              "EENM",
              "Monitoramento"
            ]
          },
          {
            "timeframe": "1-4 semanas",
            "interv": [
              "Periodizacao",
              "Sobrecarga progressiva",
              "Excêntrico"
            ]
          }
        ]
      },
      {
        "name": "F3.P14 — Limitacao ADM OMBRO (padrao capsular/pos-op/frozen shoulder)",
        "desc": "Moderado. Rotacao externa <30°, abducao <90°, impacto vestir/pentear",
        "assess": [],
        "interv": [
          "Mobilizacao glenoumeral Maitland III-IV: caudal, posterior, anterior, tracao",
          "Alongamento capsular sustentado 60-120s rotacao externa/interna, flexao/abducao",
          "Termoterapia pre-mobilizacao, mobilizacao ativo-assistida padroes funcionais",
          "Fortalecimento na nova amplitude, tecnicas energia muscular (MET)"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Ganhar 5-10° por movimento",
          "Abducao ≥120-140°, RE ≥45-60°"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "Mobilizacao articular",
              "Alongamento capsular",
              "Termo"
            ]
          },
          {
            "timeframe": "1-4 semanas",
            "interv": [
              "Fortalecimento",
              "MET",
              "Integracao"
            ]
          }
        ]
      },
      {
        "name": "F3.P15 — Limitacao ADM JOELHO (extensao/flexao)",
        "desc": "Moderado. Deficit extensao >5-10°, flexao <90°",
        "assess": [],
        "interv": [
          "Mobilizacao extensao: alongamento passivo 2-5 min, mobilizacao patelar, liberacao isquiotibiais",
          "Mobilizacao flexao: flexao passiva, patelar cranial, wall slides",
          "Crioterapia pos se edema, termo se rigidez. Ativacao quadriceps/isquiotibiais multiplas amplitudes",
          "Treino marcha com extensao completa, treino escadas, fortalecimento amplitude completa"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Ganhar 5-10° extensao, 10-20° flexao",
          "Extensao 0°, flexao ≥110-120°"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "Extensao",
              "Flexao",
              "Termo/crio",
              "Ativacao"
            ]
          },
          {
            "timeframe": "1-3 semanas",
            "interv": [
              "Marcha",
              "Escadas",
              "Fortalecimento"
            ]
          }
        ]
      },
      {
        "name": "F3.P16 — Limitacao ADM TORNOZELO / Pe EQUINO",
        "desc": "Grave. Dorsiflexao <0-5°, impacto apoio/marcha",
        "assess": [],
        "interv": [
          "Alongamento prolongado triceps sural: 2-5 min sustentacao, joelho estendido (gastrocnemio) e fletido (soleo)",
          "Mobilizacao articular tornozelo: deslizamento posterior talus, tracao",
          "Posicionamento antiequino 24h: AFO 90°, tala seriada, cunhas",
          "Termoterapia pre-alongamento, orteses seriadas progressivas, fortalecimento dorsiflexores"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Ganhar 5-10° dorsiflexao",
          "Dorsiflexao ≥5-10° funcional"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "Alongamento sural",
              "Mobilizacao",
              "Posicionamento 24h",
              "Termo"
            ]
          },
          {
            "timeframe": "1-4 semanas",
            "interv": [
              "Orteses seriadas",
              "Dorsiflexores",
              "Marcha"
            ]
          }
        ]
      },
      {
        "name": "F3.P17 — Limitacao ADM QUADRIL (flexao/rotacao/extensao)",
        "desc": "Moderado. Flexao <90°, rotacoes limitadas, deficit extensao",
        "assess": [],
        "interv": [
          "Mobilizacao flexao: passiva, deslizamento posterior femoral, alongamento gluteo/capsula posterior",
          "Mobilizacao extensao: decubito ventral, Thomas modificado, liberacao flexores",
          "Mobilizacao rotacoes em 90° quadril/joelho",
          "Fortalecimento amplitude completa, treino sentar (altura cadeira), marcha com extensao"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Flexao ≥90°",
          "Flexao ≥110-120°, extensao completa"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "Flexao",
              "Extensao",
              "Rotacoes"
            ]
          },
          {
            "timeframe": "1-4 semanas",
            "interv": [
              "Fortalecimento",
              "Sentar",
              "Marcha"
            ]
          }
        ]
      },
      {
        "name": "F3.P18 — Deficit ADM ATIVA (forca insuficiente para amplitude passiva)",
        "desc": "Moderado. ADM passiva completa, ADM ativa reduzida, lag extensor",
        "assess": [],
        "interv": [
          "Fortalecimento especifico na amplitude deficitária (ex: lag joelho últimos 15-30°)",
          "Sustentacao isometrica em amplitude final: levar com ajuda, sustentar 5-60s",
          "Facilitacao neuromuscular, EENM sincronizada com voluntario",
          "Progressao carga, treino funcional em tarefas reais, excêntrico enfatizado"
        ],
        "block": "F3 — Musculoesqueletico/Ortopedico Funcional",
        "goals": [
          "Reduzir diferença passiva-ativa ≥30%",
          "ADM ativa ≥80-90% passiva"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "Fortalecimento amplitude",
              "Sustentacao",
              "Facilitacao",
              "EENM"
            ]
          },
          {
            "timeframe": "1-3 semanas",
            "interv": [
              "Progressao",
              "Funcional",
              "Excêntrico"
            ]
          }
        ]
      },
      {
        "name": "F4.P1 — Instabilidade em sedestacao",
        "desc": "Grave. Nao mantem sedestacao sem apoio >30-60s",
        "assess": [],
        "interv": [
          "Ajuste biomecanico: pes apoiados, quadris/joelhos 90°, superfície firme",
          "Treino controle ativo tronco: transferencias peso lateral/AP/diagonal, alcances",
          "Ativacao core em sedestacao 30-60s",
          "Tarefas funcionais em sedestacao, reacoes endireitamento/protecao",
          "Fortalecimento proximal, progressao desafio (alcances, superfície instavel)"
        ],
        "block": "F4 — Equilibrio e Controle Postural",
        "goals": [
          "Sedestacao estavel ≥3-5 min",
          "Sedestacao independente ≥10-20 min"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Base",
              "Controle tronco",
              "Core",
              "Tarefas"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Reacoes",
              "Fortalecimento",
              "Progressao"
            ]
          }
        ]
      },
      {
        "name": "F4.P2 — Instabilidade em ortostatismo",
        "desc": "Grave. Nao mantem pe sem apoio, oscilacoes amplas",
        "assess": [],
        "interv": [
          "Progressao base suporte: andador/barras→apoio MMSS bilateral→unilateral→minimo→sem apoio",
          "Treino transferencia peso lateral/AP/diagonal 1-2 min cada",
          "Ativacao antigravitaria: gluteos, quadriceps, sural. Mini-agachamentos, elevacao calcanhares",
          "Aumento progressivo tempo 30-60s→+30s/sessao",
          "Reacoes posturais: perturbacoes progressivas tornozelo→quadril→passo"
        ],
        "block": "F4 — Equilibrio e Controle Postural",
        "goals": [
          "Ortostatismo ≥2-3 min com apoio minimo",
          "Ortostatismo independente ≥5-10 min"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Base suporte",
              "Transferencia peso",
              "Antigravitaria",
              "Tempo"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Reacoes posturais",
              "Fortalecimento",
              "Alcances"
            ]
          }
        ]
      },
      {
        "name": "F4.P3 — Quedas frequentes ou quase-quedas",
        "desc": "Critico. Historico quedas, perda equilibrio durante mobilizacao",
        "assess": [],
        "interv": [
          "Contencao risco: guarda terapêutica, cinto marcha, calçado, ambiente",
          "Analise causa: fraqueza, hipotensao, deficit sensorial, atenção, dor",
          "Treino situacoes risco: sentar/levantar, virar, parar/iniciar",
          "Reacoes posturais: perturbacoes controladas progressivas"
        ],
        "block": "F4 — Equilibrio e Controle Postural",
        "goals": [
          "Zero quedas mobilizacao assistida",
          "Quase-quedas zero, escore equilibrio +5-10"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Contencao",
              "Analise"
            ]
          },
          {
            "timeframe": "3-10 dias",
            "interv": [
              "Treino situacoes",
              "Reacoes"
            ]
          }
        ]
      },
      {
        "name": "F4.P4 — Medo de cair (fear of falling) com impacto funcional",
        "desc": "Moderado. Evita pe/andar apesar de capacidade, rigidez, recusa",
        "assess": [],
        "interv": [
          "Exposicao gradual: tarefas muito seguras→progressao lenta",
          "Garantia seguranca real: guarda, dispositivos adequados",
          "Sucesso repetido: sequencia alta taxa acerto"
        ],
        "block": "F4 — Equilibrio e Controle Postural",
        "goals": [
          "Executar 1 tarefa evitada com seguranca",
          "Mobilidade sem medo limitante"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Exposicao gradual",
              "Seguranca"
            ]
          },
          {
            "timeframe": "3-10 dias",
            "interv": [
              "Sucesso repetido"
            ]
          }
        ]
      },
      {
        "name": "F4.P5 — Alteracao vestibular",
        "desc": "Moderado. Vertigem, nausea, nistagmo, piora equilibrio com movimento cabeca",
        "assess": [],
        "interv": [
          "Estabilizacao olhar: X1 e X2, 10-20 rep 3x/dia",
          "Habituacao: movimentos que provocam→repeticao→adaptacao",
          "Integracao: cabeca em pe, andando, dinamico"
        ],
        "block": "F4 — Equilibrio e Controle Postural",
        "goals": [
          "Reduzir vertigem",
          "Mobilidade cabeca, equilibrio funcional"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "X1/X2",
              "Habituacao"
            ]
          },
          {
            "timeframe": "1-3 sem",
            "interv": [
              "Integracao"
            ]
          }
        ]
      },
      {
        "name": "F4.P6 — Perda de estrategias posturais (tornozelo, quadril, passo)",
        "desc": "Grave. Nao reage a perturbacoes, congela ou cai",
        "assess": [],
        "interv": [
          "Tornozelo: perturbacoes pequenas, base fixa, oscilacoes A/P",
          "Quadril: perturbacoes moderadas, flexao/extensao rapida",
          "Passo: perturbacoes maiores, passo protecao todas direcoes",
          "Funcional: mudancas, obstaculos, dupla tarefa"
        ],
        "block": "F4 — Equilibrio e Controle Postural",
        "goals": [
          "Iniciar reacoes",
          "Selecao automatica estrategia"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Tornozelo",
              "Quadril"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Passo",
              "Funcional"
            ]
          }
        ]
      },
      {
        "name": "F5.P1 — Incapacidade de compreender comandos",
        "desc": "Grave. Nao executa comandos 1 etapa de forma consistente",
        "assess": [],
        "interv": [
          "Simplificacao: comandos curtos 1 etapa. Ex: Senta, Levanta",
          "Demonstracao: mostrar sempre com fala, pistas visuais/tateis",
          "Complexificacao: 1→2 etapas→sequencia. Rotina estruturada"
        ],
        "block": "F5 — Cognitivo-Funcional",
        "goals": [
          "Executar 2-3 comandos 1 etapa",
          "Comandos 2 etapas, sequencias funcionais"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Simplificacao",
              "Demonstracao"
            ]
          },
          {
            "timeframe": "3-10 dias",
            "interv": [
              "Complexificacao",
              "Rotina"
            ]
          }
        ]
      },
      {
        "name": "F5.P2 — Deficit de atencao sustentada",
        "desc": "Moderado. Perde foco antes 1-2 min, precisa redirecionamento",
        "assess": [],
        "interv": [
          "Sessoes curtas 3-5 min; 4x5min melhor que 1x20min",
          "Ambiente: reduzir ruidos, movimento, estimulos",
          "Treino atencao seletiva: tarefa com distratores, desafio gradual"
        ],
        "block": "F5 — Cognitivo-Funcional",
        "goals": [
          "Atencao ≥3-5 min",
          "Atencao ≥10-15 min"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Curtas",
              "Ambiente"
            ]
          },
          {
            "timeframe": "3-10 dias",
            "interv": [
              "Treino seletiva"
            ]
          }
        ]
      },
      {
        "name": "F5.P3 — Deficit memoria operacional e retencao de treino",
        "desc": "Grave. Nao lembra o que treinou, recomeca do zero todo dia",
        "assess": [],
        "interv": [
          "Repeticao massiva: mesmas tarefas todo dia, poucas variacoes, alta frequencia",
          "Contexto funcional: sentar-levantar, transferencias, marcha real",
          "Espacamento: iniciar variacao pequena apos consolidacao base"
        ],
        "block": "F5 — Cognitivo-Funcional",
        "goals": [
          "Reter tarefa dentro sessao",
          "Reter ganho entre sessoes"
        ],
        "phases": [
          {
            "timeframe": "0-5 dias",
            "interv": [
              "Repeticao massiva",
              "Contexto funcional"
            ]
          },
          {
            "timeframe": "1-3 sem",
            "interv": [
              "Espacamento"
            ]
          }
        ]
      },
      {
        "name": "F5.P4 — Fadiga cognitiva",
        "desc": "Moderado. Queda desempenho apos poucos min, irritabilidade/apatia",
        "assess": [],
        "interv": [
          "Sessoes curtas 3-7 min. PARAR ANTES de desmontar. Multiplas curtas > 1 longa",
          "Alternancia tarefa dificil↔facil, descansos programados",
          "Condicionamento cognitivo: progressao muito gradual tempo/complexidade"
        ],
        "block": "F5 — Cognitivo-Funcional",
        "goals": [
          "Sessoes sem crash",
          "Tolerancia para sessoes completas"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Curtas",
              "Alternancia"
            ]
          },
          {
            "timeframe": "3-10 dias",
            "interv": [
              "Condicionamento"
            ]
          }
        ]
      },
      {
        "name": "F5.P5 — Desorientacao temporoespacial",
        "desc": "Moderado. Nao sabe onde esta, que dia e, por que internado",
        "assess": [],
        "interv": [
          "Reorientacao frequente: repetir onde esta, o que faz, por que. A cada contato",
          "Pistas ambientais: relogio, calendario, janela, objetos familiares",
          "Rotina estruturada: horarios previsiveis"
        ],
        "block": "F5 — Cognitivo-Funcional",
        "goals": [
          "Orientacao basica situacao",
          "Orientacao mantida mais tempo"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Reorientacao",
              "Pistas"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Rotina"
            ]
          }
        ]
      },
      {
        "name": "F5.P6 — Deficit executivo (planejamento, organizacao, julgamento)",
        "desc": "Grave. Nao organiza sequencia, decisoes inseguras, supervisao constante",
        "assess": [],
        "interv": [
          "Pistas graduadas: visual+tátil+verbal. Progredir reduzindo",
          "Vigilancia: nunca assumir aprendeu. Impulsividade perigosa",
          "Sequencias: quebrar tarefas, passo-a-passo, repeticao massiva"
        ],
        "block": "F5 — Cognitivo-Funcional",
        "goals": [
          "Completar tarefas basicas com pistas",
          "Reduzir pistas, autonomia supervisionada"
        ],
        "phases": [
          {
            "timeframe": "0-5 dias",
            "interv": [
              "Pistas",
              "Vigilancia"
            ]
          },
          {
            "timeframe": "1-2 sem",
            "interv": [
              "Sequencias"
            ]
          }
        ]
      },
      {
        "name": "F6.P1 — Hipotensao ortostatica",
        "desc": "Grave. Queda PAS ≥20 ou PAD ≥10 em ate 3 min ao levantar",
        "assess": [],
        "interv": [
          "Bomba muscular pre-mudanca: dorsiflexao, extensao joelhos, gluteos 2-3 series ANTES sentar/levantar",
          "Progressao lenta: 30°→45°→60°→75°→90°, 2-5 min cada. Avancar se PA/sintomas OK",
          "Verticalizacao progressiva: ortostatismo 30-60s→marcha estacionaria→passos curtos",
          "Compressao: meias elasticas, faixas MMII/abdomen"
        ],
        "block": "F6 — Autonomico/Tolerancia Postural",
        "goals": [
          "Sedestacao ≥10 min sem sintomas",
          "Ortostatismo ≥2-5 min"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Bomba pre",
              "Progressao lenta"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Verticalizacao",
              "Compressao"
            ]
          }
        ]
      },
      {
        "name": "F6.P2 — Taquicardia postural / POTS-like",
        "desc": "Moderado. FC ≥30 bpm ou FC >120 ao ficar em pe",
        "assess": [],
        "interv": [
          "Condicionamento postural gradual: multiplas exposicoes curtas. Interromper se FC desproporcional",
          "Bomba muscular: ativacao MMII constante durante ortostatismo",
          "Treino aerobio leve: marcha lenta, sentar-levantar"
        ],
        "block": "F6 — Autonomico/Tolerancia Postural",
        "goals": [
          "Tolerar sedestacao sem FC >120"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Condicionamento gradual",
              "Bomba muscular"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Treino aerobio"
            ]
          }
        ]
      },
      {
        "name": "F6.P3 — Sincope ou pre-sincope postural",
        "desc": "Critico. Quase-desmaio ou desmaio ao sentar/ficar em pe",
        "assess": [],
        "interv": [
          "Seguranca maxima: sempre 2 terapeutas, monitorizacao continua, prancha se intolerancia grave",
          "Progressao micro: incrementos 5-10°, 2-5 min. PARAR aos primeiros sintomas",
          "Alinhamento medico: hidratacao, sal, medicacao se indicado"
        ],
        "block": "F6 — Autonomico/Tolerancia Postural",
        "goals": [
          "ZERO sincopes",
          "Tolerar sedestacao/ortostatismo sem pre-sincope"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Seguranca",
              "Progressao micro"
            ]
          },
          {
            "timeframe": "3-10 dias",
            "interv": [
              "Alinhamento medico"
            ]
          }
        ]
      },
      {
        "name": "F6.P4 — Intolerancia grave à verticalizacao",
        "desc": "Critico. Nao tolera >30-60s em pe mesmo com apoio",
        "assess": [],
        "interv": [
          "Prancha ortostatica: 30°→45°→60°→75°→90°, 3-10 min cada, monitorar continuo",
          "Micro-progressao: avancar so se PA/sintomas permitirem",
          "Ortostatismo ativo apos tolerar 90° prancha"
        ],
        "block": "F6 — Autonomico/Tolerancia Postural",
        "goals": [
          "Tolerar 60-75° por ≥5 min",
          "Tolerar 90°, transicao ortostatismo ativo"
        ],
        "phases": [
          {
            "timeframe": "0-5 dias",
            "interv": [
              "Prancha",
              "Micro-progressao"
            ]
          },
          {
            "timeframe": "1-2 sem",
            "interv": [
              "Ortostatismo ativo"
            ]
          }
        ]
      },
      {
        "name": "F6.P5 — Disautonomia pos-UTI / sepse / COVID / TCE",
        "desc": "Grave. PA/FC imprevisiveis, alternancia hipo/hipertensao, fadiga extrema",
        "assess": [],
        "interv": [
          "Monitorizacao: PA/FC antes/durante/depois. Identificar padrao individual",
          "Curtas frequentes: 3-5 min, 4-6x/dia",
          "Condicionamento: exposicoes progressivas treinam regulacao"
        ],
        "block": "F6 — Autonomico/Tolerancia Postural",
        "goals": [
          "Tolerar sedestacao/ortostatismo sem crise"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "Monitorizacao",
              "Curtas frequentes"
            ]
          },
          {
            "timeframe": "1-3 sem",
            "interv": [
              "Condicionamento"
            ]
          }
        ]
      },
      {
        "name": "F7.P1 — Excesso de dispositivos limitando mobilizacao",
        "desc": "Moderado. Multiplos acessos, drenos, VM, medo equipe tracionar",
        "assess": [],
        "interv": [
          "Checklist: revisar dispositivos, organizar linhas/tubos/drenos",
          "Papeis: quem segura o que. Nunca improvisar",
          "Interdisciplinar: necessidade real de cada dispositivo"
        ],
        "block": "F7 — Dispositivos e Barreiras Externas",
        "goals": [
          "Mobilizar com seguranca",
          "Rotina mobilizacao, equipe treinada"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Checklist",
              "Papeis"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Interdisciplinar"
            ]
          }
        ]
      },
      {
        "name": "F7.P2 — Ambiente hostil à mobilidade",
        "desc": "Moderado. Falta poltrona, andador, barras, espaco",
        "assess": [],
        "interv": [
          "Trazer recursos: poltrona, andador, barras moveis",
          "Organizar espaco: reposicionar leito, zona mobilizacao",
          "Adaptacoes permanentes quando possivel"
        ],
        "block": "F7 — Dispositivos e Barreiras Externas",
        "goals": [
          "Criar ambiente favoravel"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Recursos",
              "Organizar espaco"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Adaptacoes"
            ]
          }
        ]
      },
      {
        "name": "F7.P3 — Cultura de imobilismo / medo da equipe",
        "desc": "Moderado. Melhor nao mexer, mobilizacao so quando melhorar",
        "assess": [],
        "interv": [
          "Comunicacao: articular enfermagem/medico/técnico. Mobilizacao E tratamento",
          "Pequenas vitorias: sedestacao, poltrona ja sao progresso",
          "Mostrar resultados: dados, casos, evidencias"
        ],
        "block": "F7 — Dispositivos e Barreiras Externas",
        "goals": [
          "Iniciar mobilizacao apesar cultura"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "Comunicacao",
              "Pequenas vitorias"
            ]
          },
          {
            "timeframe": "1-3 sem",
            "interv": [
              "Mostrar resultados"
            ]
          }
        ]
      },
      {
        "name": "F7.P4 — Restricoes medicas excessivas ou pouco claras",
        "desc": "Moderado. Repouso absoluto sem justificativa, limites indefinidos",
        "assess": [],
        "interv": [
          "Perguntar explicitamente: carga? sentar? em pe? andar? limites claros",
          "Questionar repouso absoluto sem criterio fisiologico",
          "Reavaliacao: restricoes dia a dia, liberar conforme evolucao"
        ],
        "block": "F7 — Dispositivos e Barreiras Externas",
        "goals": [
          "Regras claras",
          "Progressao clara, reduzir restricoes desnecessarias"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Perguntar",
              "Questionar"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Reavaliacao"
            ]
          }
        ]
      },
      {
        "name": "F7.P5 — Falta de pessoal/equipamento para mobilizacao segura",
        "desc": "Grave. Precisa 2-3 pessoas ou guindaste, nunca disponivel",
        "assess": [],
        "interv": [
          "Agendar: se 3 pessoas combinar horario. Se equipamento reservar antes",
          "Mobilizacao planejada: evento programado, nao improviso",
          "Sistematico: horarios definidos, equipe coordenada"
        ],
        "block": "F7 — Dispositivos e Barreiras Externas",
        "goals": [
          "Primeira mobilizacao realizada",
          "Rotina mobilizacao, fluxo estabelecido"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Agendar",
              "Planejar"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Sistematico"
            ]
          }
        ]
      },
      {
        "name": "F7.P6 — Conflito de prioridades assistenciais",
        "desc": "Moderado. Sempre nao da tempo, exames atropelam reabilitacao",
        "assess": [],
        "interv": [
          "Integrar rotina: mobilizacao NAO e extra, e tratamento prioritario",
          "Negociar: horarios fixos com equipe, coordenar com procedimentos",
          "Sistematico: horarios protegidos, equipe alinhada"
        ],
        "block": "F7 — Dispositivos e Barreiras Externas",
        "goals": [
          "Mobilizacao na rotina"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "Integrar",
              "Negociar"
            ]
          },
          {
            "timeframe": "1-3 sem",
            "interv": [
              "Sistematico"
            ]
          }
        ]
      },
      {
        "name": "F7.P7 — HIPOATIVIDADE NO LEITO / Sindrome do imobilismo",
        "desc": "Grave. Repouso >48-72h sem mobilizacao, alto risco descondicionamento",
        "assess": [],
        "interv": [
          "Mudancas decubito programadas a cada 2-3h",
          "Mobilizacao passiva/ativo-assistida TODAS articulacoes 2-3x/dia",
          "Sedestacao borda leito 2-5 min→20-30 min se hemodinamica permitir",
          "Ativacao muscular voluntaria se possivel: isometricos MMSS/MMII/abdome",
          "Inspecao diaria pele, ortostatismo precoce se tolerado, transferencias leito-poltrona",
          "Fisioterapia respiratoria, profilaxia TVP"
        ],
        "block": "F7 — Dispositivos e Barreiras Externas",
        "goals": [
          "Iniciar mobilizacao precoce no leito",
          "Sedestacao ≥20-30 min, ortostatismo assistido"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Decubitos",
              "Passiva/ativo-assistida",
              "Sedestacao borda",
              "Ativacao",
              "Pele"
            ]
          },
          {
            "timeframe": "2-7 dias",
            "interv": [
              "Ortostatismo",
              "Transferencias",
              "Respiratoria",
              "TVP"
            ]
          }
        ]
      },
      {
        "name": "F7.P8 — Necessidade de evolucao postural progressiva",
        "desc": "Grave. Restrito ao leito, necessita progressao sistematica posturas",
        "assess": [],
        "interv": [
          "Etapa 1: elevacao cabeceira 0°→30°→45°→60°→90°, 5-10 min cada, monitorar PA/FC/sintomas",
          "Etapa 2: sedestacao beira leito 5-10 min→20-30 min, treino controle tronco",
          "Etapa 3: ortostatismo 2-5 min→10-20 min, transferencia peso, alcances",
          "Etapa 4: marcha estacionaria 1-2 min, cadencia ritmica",
          "Etapa 5: deambulacao 10-20 m→50-100 m, progressao dispositivos",
          "Etapa 6: sedestacao poltrona ≥30-60 min 2-3x/dia, AVDs, marcha funcional"
        ],
        "block": "F7 — Dispositivos e Barreiras Externas",
        "goals": [
          "Tolerar cada angulo ≥5-10 min",
          "Sedestacao beira leito ≥20-30 min",
          "Ortostatismo ≥2-5 min",
          "Marcha ≥10-20 m",
          "Transferencia leito↔poltrona"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Elevacao cabeceira",
              "Monitorizacao"
            ]
          },
          {
            "timeframe": "48-96h",
            "interv": [
              "Beira leito",
              "Controle tronco"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Ortostatismo"
            ]
          },
          {
            "timeframe": "5-10 dias",
            "interv": [
              "Marcha estacionaria"
            ]
          },
          {
            "timeframe": "7-14 dias",
            "interv": [
              "Deambulacao"
            ]
          },
          {
            "timeframe": "10-21 dias",
            "interv": [
              "Poltrona",
              "AVDs",
              "Marcha funcional"
            ]
          }
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
        "name": "5.0.P1 — Dor traumatica ou pos-operatoria limitante",
        "desc": "Grave. EVA ≥6 repouso ou ≥4 ao mobilizar",
        "assess": [],
        "interv": [
          "Posicionamento antalgico",
          "Protecao com coxins",
          "Crioterapia/termoterapia quando indicado",
          "Treinar como mover sem gerar dor mecanica",
          "Alvo EVA ≤4 durante mobilizacao"
        ],
        "block": "5.0 — Base Transversal Trauma/Ortopedia",
        "goals": [
          "Controlar dor para ventilacao e mobilizacao segura"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Posicionamento",
              "Protecao",
              "Crio/termo",
              "Educacao"
            ]
          }
        ]
      },
      {
        "name": "5.0.P2 — Restricao de carga (NWB/TTWB/PWB/WBAT)",
        "desc": "Grave. Prescricao formal, risco falha sintese",
        "assess": [],
        "interv": [
          "Definir regra: NWB sem carga, TTWB toque ponta, PWB parcial, WBAT tolerado",
          "Treino ortostatismo com descarga correta",
          "Transferencia leito↔poltrona respeitando carga",
          "Marcha com dispositivo conforme caso",
          "Nunca testar carga proibida"
        ],
        "block": "5.0 — Base Transversal Trauma/Ortopedia",
        "goals": [
          "Proteger fratura/sintese, transferencias seguras"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Definir regra",
              "Treino ortostatismo",
              "Transferencias",
              "Marcha dispositivo"
            ]
          },
          {
            "timeframe": "Ate alta",
            "interv": [
              "Uso correto dispositivos",
              "Plano continuidade"
            ]
          }
        ]
      },
      {
        "name": "5.0.P3 — Risco instabilidade mecanica / falha fixacao",
        "desc": "Critico. Osteossintese recente, fixador, fratura instavel",
        "assess": [],
        "interv": [
          "Transferencias protegidas: rolar em bloco se coluna, sentar pelo lado protegido",
          "Tudo lento, organizado, sem alavancas perigosas",
          "PARADA: dor mecanica subita intensa, sensacao falha, deficit neurologico novo"
        ],
        "block": "5.0 — Base Transversal Trauma/Ortopedia",
        "goals": [
          "Proteger sintese e prevenir complicacoes"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Transferencias protegidas",
              "Vigilancia"
            ]
          }
        ]
      },
      {
        "name": "5.0.P4 — Imobilismo com risco sistemico",
        "desc": "Grave. Risco atelectasia, TEP/TVP, perda funcional",
        "assess": [],
        "interv": [
          "Inspiracoes profundas, tosse assistida",
          "Mudanca frequente decubito",
          "Sedestacao/poltrona o mais precoce possivel",
          "Bomba muscular multiplas vezes/dia",
          "Elevacao MMII quando indicado, monitorar edema assimetrico dor panturrilha"
        ],
        "block": "5.0 — Base Transversal Trauma/Ortopedia",
        "goals": [
          "Prevenir atelectasia, trombose, colapso funcional"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Respiratorio",
              "Posicionamento",
              "Mobilizacao",
              "TVP"
            ]
          }
        ]
      },
      {
        "name": "5.0.P5 — Perda ADM e forca segmentos nao imobilizados",
        "desc": "Moderado. Edema, rigidez, inibicao, desuso",
        "assess": [],
        "interv": [
          "Exercicios ativos/isometricos: quadriceps, gluteos, panturrilha, MMSS",
          "Objetivo: evitar ICU-AW localizada, TVP, preservar capacidade funcional"
        ],
        "block": "5.0 — Base Transversal Trauma/Ortopedia",
        "goals": [
          "Manter funcao dos segmentos livres"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Ativos/isometricos"
            ]
          }
        ]
      },
      {
        "name": "5.1.P1 — Dor ventilatorio-dependente com hipoventilacao",
        "desc": "Grave. EVA ≥6 ao inspirar/tossir, FR superficial, volumes baixos",
        "assess": [],
        "interv": [
          "Gestao funcional dor: posicionamento antalgico, apoio manual/travesseiro para tosse",
          "Treino huffing, tosse protegida. Sessoes curtas frequentes. Alvo EVA ≤4",
          "Reexpansao: inspiracao lenta profunda com pausa 2-3s, expansao segmentar, espironetro"
        ],
        "block": "5.1 — Trauma Toracico",
        "goals": [
          "Permitir ventilacao profunda e eficaz"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Dor",
              "Tosse protegida",
              "Reexpansao"
            ]
          }
        ]
      },
      {
        "name": "5.1.P2 — Atelectasia segmentar/lobar pos-trauma",
        "desc": "Grave. RX/TC colapso, ausculta ↓ MV, ↑ O2",
        "assess": [],
        "interv": [
          "Reexpansao dirigida",
          "Posicionamento: decubito lateral pulmao bom para baixo",
          "Alternancia frequente decubitos",
          "Mobilizacao precoce: sentar, pe, andar"
        ],
        "block": "5.1 — Trauma Toracico",
        "goals": [
          "Reexpandir areas colapsadas"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Reexpansao",
              "Posicionamento",
              "Mobilizacao"
            ]
          }
        ]
      },
      {
        "name": "5.1.P3 — Tosse ineficaz e retencao secrecao",
        "desc": "Grave. PCF <270 ineficaz, <160 incapaz limpar",
        "assess": [],
        "interv": [
          "Higiene por criterio: ha secrecao? tosse eficaz?",
          "Se PCF <270 tecnicas auxiliares; <160 critico",
          "Huffing, tosse assistida manual, ciclo ativo, drenagem postural com cautela"
        ],
        "block": "5.1 — Trauma Toracico",
        "goals": [
          "Garantir tosse funcional ou alternativa eficaz"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Avaliacao",
              "Tecnicas"
            ]
          }
        ]
      },
      {
        "name": "5.1.P4 — Contusao pulmonar com alteracao troca gasosa",
        "desc": "Critico. PaO2/FiO2 <300, SpO2 instavel",
        "assess": [],
        "interv": [
          "CNAF hipoxemia moderada. VNI (CPAP/BiPAP) se trabalho respiratorio alto, contusao, atelectasia",
          "Posicionamento terapeutico estrategico"
        ],
        "block": "5.1 — Trauma Toracico",
        "goals": [
          "Manter SpO2 na meta individual"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "CNAF/VNI",
              "Posicionamento"
            ]
          }
        ]
      },
      {
        "name": "5.1.P5 — Instabilidade mecanica parede toracica (volet)",
        "desc": "Critico. Movimento paradoxal, dor intensa, ↑ trabalho respiratorio",
        "assess": [],
        "interv": [
          "Suporte ventilatorio conforme necessario",
          "Posicionamento para estabilizacao",
          "Controle rigoroso dor"
        ],
        "block": "5.1 — Trauma Toracico",
        "goals": [
          "Prevenir fadiga respiratoria"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Suporte",
              "Posicionamento",
              "Dor"
            ]
          }
        ]
      },
      {
        "name": "5.1.P6 — Pneumo/hemotorax drenado com risco complicacoes",
        "desc": "Grave. Dreno selo agua, dor, risco hipoventilacao/atelectasia",
        "assess": [],
        "interv": [
          "Mobilizacao precoce com dreno protegido (sedestacao/poltrona/ortostatismo/marcha se estavel)",
          "Tecnicas ventilatorias respeitando dor",
          "Monitorar fuga aerea. PARADA: aumento fuga no dreno"
        ],
        "block": "5.1 — Trauma Toracico",
        "goals": [
          "Prevenir complicacoes respiratorias"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Mobilizacao precoce",
              "Tecnicas",
              "Vigilancia"
            ]
          }
        ]
      },
      {
        "name": "5.1.P7 — Insuficiencia respiratoria aguda pos-trauma",
        "desc": "Critico. SpO2 <90%, FR >30 ou <10, PaO2/FiO2 <200",
        "assess": [],
        "interv": [
          "Suporte ventilatorio agressivo conforme necessario",
          "Otimizacao: dor, posicionamento, higiene, expansao",
          "PARADA: dor incapacitante, SpO2 <88-90% persistente, taquipneia extrema, instabilidade hemodinamica"
        ],
        "block": "5.1 — Trauma Toracico",
        "goals": [
          "Estabilizar funcao respiratoria"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Suporte",
              "Otimizacao"
            ]
          }
        ]
      },
      {
        "name": "5.2.P1 — Risco instabilidade coluna e piora neurologica",
        "desc": "Critico. Fratura instavel ou em investigacao, colar/colete",
        "assess": [],
        "interv": [
          "REGRA: protecao coluna. Nenhum ganho compensa piora neurologica",
          "Alinhamento neutro SEMPRE. Nunca flexionar, rodar, torcer",
          "Toda mobilizacao em BLOCO. Rolamento em bloco: cabeca/tronco/pelve peça unica",
          "2-3 pessoas se necessario, prancha lençol/coxins",
          "PARADA: dor axial subita intensa, piora neurologica, parestesias novas, perda alinhamento"
        ],
        "block": "5.2 — Coluna e TRM",
        "goals": [
          "Proteger coluna e medula, rolamento em bloco"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Protecao",
              "Rolamento bloco"
            ]
          }
        ]
      },
      {
        "name": "5.2.P2 — Deficit neurologico medular (completo ou incompleto)",
        "desc": "Critico. Paresia/plegia, nivel ASIA A-D",
        "assess": [],
        "interv": [
          "Exercicios ativos/resistidos MMSS (paraplegia) ou MMII (tetraparesia parcial)",
          "Prevenir atrofia, rigidez, contraturas"
        ],
        "block": "5.2 — Coluna e TRM",
        "goals": [
          "Preservar forca e ADM segmentos livres"
        ],
        "phases": [
          {
            "timeframe": "3-10 dias",
            "interv": [
              "Ativos/resistidos",
              "Prevencao"
            ]
          },
          {
            "timeframe": "Ate alta",
            "interv": [
              "Rolamento e transferencias seguras",
              "Uso colar/colete",
              "Plano continuidade"
            ]
          }
        ]
      },
      {
        "name": "5.2.P3 — Incapacidade transferencias seguras",
        "desc": "Grave. Nao rola, senta, transfere sem violar alinhamento",
        "assess": [],
        "interv": [
          "Sedestacao segura: cabeceira progressiva, depois sedestacao tronco alinhado",
          "Apoio bracos, colete quando indicado. Monitorar PA, sintomas, fadiga",
          "Transferencias leito↔poltrona sempre em bloco, sem flexao/rotacao"
        ],
        "block": "5.2 — Coluna e TRM",
        "goals": [
          "Transferencias seguras independente ou assistido"
        ],
        "phases": [
          {
            "timeframe": "3-10 dias",
            "interv": [
              "Sedestacao",
              "Transferencias bloco"
            ]
          }
        ]
      },
      {
        "name": "5.2.P4 — Hipoventilacao por dor, colar ou fraqueza respiratoria",
        "desc": "Grave. FR superficial, ↓ volumes, tosse fraca (lesoes cervicais/altas)",
        "assess": [],
        "interv": [
          "Fisioterapia respiratoria TRM essencial",
          "Avaliar ventilometria, CV, PImax/PEmax, tosse PCF",
          "Inspiracoes profundas, empilhamento ar se indicado, tosse assistida manual/mecanica",
          "TMI quando possivel"
        ],
        "block": "5.2 — Coluna e TRM",
        "goals": [
          "Manter volumes pulmonares"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Respiratoria",
              "Avaliacao",
              "Tecnicas"
            ]
          }
        ]
      },
      {
        "name": "5.2.P5 — Alto risco complicacoes imobilismo",
        "desc": "Grave. Risco atelectasia, pneumonia, trombose, ulceras",
        "assess": [],
        "interv": [
          "Mudanca decubito em bloco frequente",
          "Bomba muscular, posicionamento adequado",
          "Mobilizacao precoce possivel",
          "Ortostatismo/verticalizacao so se liberado: cabeceira→prancha→ortostatismo assistido"
        ],
        "block": "5.2 — Coluna e TRM",
        "goals": [
          "Prevenir complicacoes imobilismo"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Decubito bloco",
              "Bomba",
              "Posicionamento",
              "Mobilizacao"
            ]
          }
        ]
      },
      {
        "name": "5.3.P1 — Restricao carga MMII (NWB/TTWB/PWB/WBAT)",
        "desc": "Critico. Ordem medica, risco falha sintese",
        "assess": [],
        "interv": [
          "Checklist pre-mobilizacao: regra carga, tipo fixacao, dor, pressao, sinais neurovasculares, risco queda, dispositivos",
          "Regras por carga: NWB membro no ar, TTWB dedo chao, PWB ensinar porcentagem pratica",
          "Transferencias protegidas leito↔poltrona/banheiro em sequencia fixa",
          "Ortostatismo→marcha estacionaria→passos→corredor. Dispositivo: andador/muletas/bengala"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Mobilizacao segura respeitando carga"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Checklist",
              "Regras",
              "Transferencias"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Ortostatismo",
              "Marcha"
            ]
          }
        ]
      },
      {
        "name": "5.3.P2 — Dor mecanica limitante MMII",
        "desc": "Grave. EVA ≥6 repouso ou ≥4 ao mobilizar",
        "assess": [],
        "interv": [
          "Controle funcional: posicionamento+elevacao, crioterapia se apropriado",
          "Mobilizacao graduada sem tranco",
          "Treino tosse/respiracao se dor limita ventilacao",
          "Regra: treinar EVA 0-4; ajustar 5-6; parar ≥7 ou dor mecanica nova intensa"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Reduzir dor para treino, alvo EVA ≤4"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Controle dor",
              "Mobilizacao graduada"
            ]
          }
        ]
      },
      {
        "name": "5.3.P3 — Inibicao muscular e fraqueza segmentar (quadriceps/gluteos)",
        "desc": "Moderado. Lag extensor, incapaz controle pelvico, falha STS",
        "assess": [],
        "interv": [
          "Ativacao essencial 24-72h: isometricos quadriceps (sustentada), gluteos, bomba panturrilha",
          "Elevacao perna estendida so se permitido sem dor relevante",
          "Ponte parcial se permitido. Dose: micro-series ao dia > sessao unica longa"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Manter ADM funcional e ativacao muscular"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Isometricos",
              "Bomba",
              "Ponte"
            ]
          }
        ]
      },
      {
        "name": "5.3.P4 — Edema, rigidez e perda ADM pos-imobilizacao/pos-op",
        "desc": "Moderado. Limita marcha (passo curto, dorsiflexao), transferencias",
        "assess": [],
        "interv": [
          "ADM para funcao: joelho flexao/extensao para sentar/levantar e marcha",
          "Tornozelo dorsiflexao para apoio e passada (prevenir equino)",
          "Quadril mobilidade para transferencias. Evitar agressividade que piore edema/dor"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Manter ADM funcional"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "ADM funcional"
            ]
          }
        ]
      },
      {
        "name": "5.3.P5 — Instabilidade marcha / alto risco queda",
        "desc": "Grave. Andador+inseguranca, quase-quedas, medo",
        "assess": [],
        "interv": [
          "Treino marcha foco estabilidade (prioridade)",
          "Consolidar independencia com dispositivo",
          "PARADA: dor mecanica subita/estalo, perda neurovascular distal, instabilidade importante/quase-quedas, hipotensao, dessaturacao, sangramento/hematoma expansivo"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Melhorar padrao marcha dentro restricao"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Marcha estabilidade",
              "Dispositivo"
            ]
          }
        ]
      },
      {
        "name": "5.3.P6 — Alto risco tromboembolico e complicacoes imobilismo",
        "desc": "Grave. Trauma+repouso+edema MMII, baixa mobilidade 72h",
        "assess": [],
        "interv": [
          "TVP prevencao ativa: bomba muscular varias vezes/dia, mobilizacao precoce possivel, elevacao membro se indicado",
          "Vigilancia: edema assimetrico, dor panturrilha, calor"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Prevenir TVP, atelectasia, perda funcional"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Bomba",
              "Mobilizacao",
              "Vigilancia"
            ]
          }
        ]
      },
      {
        "name": "5.3.P7 — Fratura pelve/acetabulo com limitacao severa",
        "desc": "Critico. Dor pelvica importante, restricao carga mais rigida",
        "assess": [],
        "interv": [
          "Tecnicas especificas transferencia respeitando pelve",
          "Progressao muito cautelosa"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Transferencias seguras com protecao pelvica"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Transferencias pelve"
            ]
          }
        ]
      },
      {
        "name": "5.3.P8 — Paciente nao domina regra de carga",
        "desc": "Grave. Apoia sem perceber, cognitivo limitrofe",
        "assess": [],
        "interv": [
          "Educacao intensiva e repetida",
          "Supervisao constante",
          "Treino subir/descer degrau quando necessario: sobe com bom, desce com ruim"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Dominio da regra de carga"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Educacao",
              "Supervisao"
            ]
          }
        ]
      },
      {
        "name": "5.3.P9 — Fratura FEMUR proximal (colo/transtrocantérica/subtrocantérica)",
        "desc": "Critico. Idoso pos-queda, fixacao DHS/haste/artroplastia",
        "assess": [],
        "interv": [
          "PRIORIDADE: mobilizacao precoce 24-48h pos-op se estavel",
          "Checklist: tipo fixacao, regra carga, restricoes movimento, dor, hemodinamica, dispositivo",
          "Sedestacao precoce D1-D2: cabeceira→borda→poltrona, almofada abdutor se artroplastia",
          "Ortostatismo e marcha D1-D2: andador/paralelas, WBAT geralmente, 3-10 m",
          "Prevencao TVP agressiva: mobilizacao, bomba panturrilha",
          "Progressao marcha 10→20→50 m. Fortalecimento quadriceps/gluteos D1+"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Mobilizacao precoce segura",
          "Marcha funcional com dispositivo"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Checklist",
              "Sedestacao",
              "Ortostatismo marcha",
              "TVP"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao marcha",
              "Fortalecimento",
              "Educacao"
            ]
          }
        ]
      },
      {
        "name": "5.3.P10 — Fratura FEMUR diafisaria",
        "desc": "Critico. Alta energia, haste intramedular, PWB/WBAT",
        "assess": [],
        "interv": [
          "Avaliacao: tipo haste, regra carga, Hb/Ht (sangramento coxa), vigilancia compartimental",
          "Mobilizacao precoce: sedestacao D1-D2, ortostatismo D2-D3 se estavel",
          "Marcha com andador PWB/WBAT, 20-50 m ate alta",
          "Ativacao: isometricos quadriceps (critico), gluteos, dorsiflexores"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Mobilizacao segura respeitando carga"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Avaliacao",
              "Sedestacao",
              "Ativacao"
            ]
          },
          {
            "timeframe": "D2-D3",
            "interv": [
              "Ortostatismo",
              "Marcha"
            ]
          }
        ]
      },
      {
        "name": "5.3.P11 — Fratura TIBIA/FIBULA",
        "desc": "Critico. Haste/placa ou fixador externo, ALTO RISCO sindrome compartimental",
        "assess": [],
        "interv": [
          "VIGILANCIA COMPARTIMENTAL 48h: 5 Ps (Pain desproporcional, Pressure, Paresthesia, Pallor, Pulselessness). Qualquer suspeita PARAR+avisar URGENTE",
          "Fixador externo: cuidados pinos, protecao mobilizacao",
          "Edema: elevacao ACIMA coracao, crioterapia, bomba tornozelo ativa",
          "Mobilizacao gradual: sedestacao perna elevada, ortostatismo NWB/PWB quando liberado",
          "Prevencao rigidez tornozelo: mobilizacao ativa D1"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Mobilizacao protegida, vigilancia compartimental"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Vigilancia 5Ps",
              "Edema",
              "Mobilizacao",
              "Tornozelo"
            ]
          },
          {
            "timeframe": "3-10 dias",
            "interv": [
              "Marcha",
              "ADM tornozelo"
            ]
          }
        ]
      },
      {
        "name": "5.3.P12 — Fratura TORNOZELO (maleolar uni/bi/trimaleolar)",
        "desc": "Grave. Edema importante, restricao NWB/TTWB, risco rigidez/equino",
        "assess": [],
        "interv": [
          "Edema prioridade: elevacao acima coracao, crioterapia 15-20 min varias/dia, compressao",
          "Mobilizacao DEDOS obrigatoria desde D1",
          "Transferencias protegidas NWB, posicionamento antiequino 24h (90°)",
          "Recuperacao ADM tornozelo apos liberacao 4-6 sem: mobilizacao, alongamento sural",
          "Progressao carga: NWB→TTWB→PWB 50%→WBAT conforme protocolo"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Controle edema, preservar ADM dedos, prevenir equino"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Edema",
              "Dedos",
              "Transferencias",
              "Antiequino"
            ]
          },
          {
            "timeframe": "2-6 sem",
            "interv": [
              "ADM tornozelo",
              "Progressao carga"
            ]
          }
        ]
      },
      {
        "name": "5.3.P13 — Fratura CALCANEO / ossos do pe",
        "desc": "Grave. Trauma altura, edema maciço, NWB 8-12 sem",
        "assess": [],
        "interv": [
          "Edema: elevacao rigorosa, crioterapia, compressao",
          "Mobilizacao obrigatoria: dedos vigoroso, tornozelo dorsi/plantiflexao suave. NUNCA inversao/eversao (subtalar)",
          "Marcha NWB estrita, dominar perfeitamente",
          "Manutencao MMII contralateral, core, MMSS"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Controle edema, mobilizacao sem carga"
        ],
        "phases": [
          {
            "timeframe": "0-2 sem",
            "interv": [
              "Edema",
              "Dedos/tornozelo",
              "NWB"
            ]
          },
          {
            "timeframe": "3-6 meses",
            "interv": [
              "Progressao carga muito lenta",
              "ADM",
              "Calçado"
            ]
          }
        ]
      },
      {
        "name": "5.3.P14 — Fratura PATELA",
        "desc": "Grave. Lag extensor grave/completo, imobilizador extensao",
        "assess": [],
        "interv": [
          "Protecao mecanismo extensor: imobilizador 0° 2-4 sem, proibido flexao ativa contra gravidade",
          "Ativacao quadriceps CRITICA: set quadriceps D1, 10-15 contracoes 5-10s varias/dia",
          "Controle edema: elevacao, crioterapia, compressao",
          "Mobilizacao sedestacao/ortostatismo com imobilizador, WBAT geralmente permitida",
          "Recuperacao extensao ativa (LAG 0°), progressao flexao apos 2-4 sem"
        ],
        "block": "5.3 — Fraturas MMII",
        "goals": [
          "Proteger fixacao, recuperar extensao ativa"
        ],
        "phases": [
          {
            "timeframe": "0-2 sem",
            "interv": [
              "Protecao",
              "Quadriceps",
              "Edema"
            ]
          },
          {
            "timeframe": "2-6 sem",
            "interv": [
              "Extensao ativa",
              "Flexao progressiva",
              "Marcha"
            ]
          }
        ]
      },
      {
        "name": "5.4.P1 — Dor e protecao antalgica MS",
        "desc": "Grave. EVA ≥6 ao mover/apoiar, MS colado ao corpo",
        "assess": [],
        "interv": [
          "Checklist MS obrigatorio: osso fraturado? fixacao? movimentos proibidos? pode apoiar peso? ate onde mover?",
          "Controle dor/edema: elevacao, posicionamento, crioterapia",
          "Mobilizacao ativa dedos, punho (se permitido), cotovelo (se permitido). Mao parada = mao rigida"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Controlar dor e edema, preservar mobilidade segmentos liberados"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Checklist",
              "Dor/edema",
              "Mobilizacao segmentos livres"
            ]
          }
        ]
      },
      {
        "name": "5.4.P2 — Restricao movimento ombro/cotovelo/punho",
        "desc": "Moderado. Imobilizacao, tipoia, gesso, movimentos proibidos",
        "assess": [],
        "interv": [
          "Educacao paciente: o que pode/nao pode, como deitar/levantar/sentar/andar, proteger braco"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Ensinar movimento e transferir protegendo MS"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Educacao"
            ]
          }
        ]
      },
      {
        "name": "5.4.P3 — Incapacidade usar dispositivos marcha por limitacao MMSS",
        "desc": "Grave. Nao segura andador, muletas, mesmo com MMII capazes",
        "assess": [],
        "interv": [
          "Transferencias SEM usar (ou minimamente) braco acometido: levantar com MS contralateral+MMII",
          "Adaptar altura cama/cadeira, posicao maos",
          "Adaptacao marcha: andador apoio unilateral? bengala lado oposto? marcha assistida pessoa?"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Levantar e andar mesmo sem usar plenamente braco"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Transferencias sem MS",
              "Adaptacao"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Consolidar independencia"
            ]
          }
        ]
      },
      {
        "name": "5.4.P4 — Edema, rigidez e perda ADM membro imobilizado",
        "desc": "Moderado. Mao inchada, dedos rigidos, risco SDRC",
        "assess": [],
        "interv": [
          "Movimento frequente segmentos liberados, estimulo sensorial leve, uso funcional protegido mao quando possivel",
          "Evitar imobilizacao desnecessaria, medo de mover tudo"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Prevenir rigidez cronica e SDRC"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Mobilizacao",
              "Uso protegido"
            ]
          }
        ]
      },
      {
        "name": "5.4.P5 — Perda funcao global AVDs por limitacao MS",
        "desc": "Moderado. Dificuldade higiene, alimentacao, vestir, apoiar",
        "assess": [],
        "interv": [
          "Treino AVDs adaptadas",
          "Estrategias compensatorias"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Melhorar uso funcional protegido MS"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "AVDs adaptadas"
            ]
          }
        ]
      },
      {
        "name": "5.4.P6 — Risco complicacoes imobilismo MS",
        "desc": "Moderado. Imobilizacao prolongada, dor+edema+rigidez",
        "assess": [],
        "interv": [
          "Manutencao funcao global: MMII, tronco, MS nao acometido",
          "Plano progressao ambulatorial mobilidade membro",
          "PARADA: dor desproporcional/progressiva, edema aumentando, alteracao cor/temperatura/sensibilidade mao, sinais compressao neurovascular, estalo/falha sintese"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Manter funcao global, alta com dominio regras protecao MS"
        ],
        "phases": [
          {
            "timeframe": "Ate alta",
            "interv": [
              "Manutencao global",
              "Plano",
              "Criterios parada"
            ]
          }
        ]
      },
      {
        "name": "5.4.P7 — Fratura UMERO proximal",
        "desc": "Grave. Queda ombro/braco, tipoia/Velpeau, risco capsulite adesiva",
        "assess": [],
        "interv": [
          "Avaliacao: tipo fratura, tratamento, restricoes, status neurovascular (nervo axilar)",
          "Controle dor/edema: elevacao, crioterapia, posicionamento tipoia",
          "Mobilizacao OBRIGATORIA dedos, punho, cotovelo desde D1. NUNCA mao/punho parados",
          "Prevencao rigidez ombro: exercicios pendulares apos 1-3 sem conforme protocolo",
          "Progressao ADM passiva→ativo-assistida→ativa conforme protocolo"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Controlar dor/edema, prevenir rigidez ombro"
        ],
        "phases": [
          {
            "timeframe": "0-2 sem",
            "interv": [
              "Avaliacao",
              "Dor/edema",
              "Dedos/punho/cotovelo"
            ]
          },
          {
            "timeframe": "2-6 sem",
            "interv": [
              "Pendulares",
              "ADM"
            ]
          }
        ]
      },
      {
        "name": "5.4.P8 — Fratura UMERO diafisaria",
        "desc": "Grave. Trauma direto, RISCO nervo radial 20%",
        "assess": [],
        "interv": [
          "Avaliacao neurologica OBRIGATORIA nervo radial: extensao punho (sinal stop), extensao dedos, abdutor polegar, sensibilidade dorso mao. Qualquer alteracao AVISAR",
          "Mobilizacao agressiva segmentos livres: dedos e punho CRITICO, ombro pendulares, cotovelo confirmar",
          "Controle edema. Recuperacao ADM cotovelo e ombro conforme tratamento"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Protecao fixacao, avaliacao neurologica seriada"
        ],
        "phases": [
          {
            "timeframe": "0-2 sem",
            "interv": [
              "Neurologico radial",
              "Mobilizacao livres",
              "Edema"
            ]
          },
          {
            "timeframe": "2-8 sem",
            "interv": [
              "ADM",
              "Fortalecimento"
            ]
          }
        ]
      },
      {
        "name": "5.4.P9 — Fratura CLAVICULA",
        "desc": "Moderado. Queda ombro/braco, imobilizacao 8 ou tipoia",
        "assess": [],
        "interv": [
          "Tipo tratamento: conservador 4-6 sem ou cirurgico",
          "Mobilizacao obrigatoria: dedos, punho, cotovelo. Ombro geralmente restrito 4-6 sem",
          "Restricoes: evitar elevacao >90°, abducao forçada, rotacao externa extrema, apoiar peso/empurrar",
          "Controle dor/edema. Progressao ADM ombro apos 4-6 sem"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Controlar dor, protecao fixacao, funcao cotovelo/punho/mao"
        ],
        "phases": [
          {
            "timeframe": "0-3 sem",
            "interv": [
              "Mobilizacao",
              "Restricoes",
              "Dor"
            ]
          },
          {
            "timeframe": "3-8 sem",
            "interv": [
              "ADM ombro",
              "Fortalecimento"
            ]
          }
        ]
      },
      {
        "name": "5.4.P10 — Fratura PUNHO (Colles, Smith, estiloide)",
        "desc": "Grave. FOOSH, edema importante, ALTO RISCO rigidez e SDRC",
        "assess": [],
        "interv": [
          "Edema prioridade absoluta: elevacao ACIMA coracao, crioterapia, compressao",
          "Mobilizacao DEDOS obrigatoria D1: flexao/extensao vigorosa todos dedos, punho completo, pinças, oposicao polegar. 10-15 rep 1-2h acordado",
          "Prevencao SDRC: sinais precoces dor desproporcional, edema progressivo, alteracao cor/temperatura. Qualquer suspeita AVISAR",
          "Ombro e cotovelo ADM completa D1. Recuperacao ADM punho apos retirada gesso ~6 sem"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Controle edema agressivo, mobilizacao dedos, prevenir SDRC"
        ],
        "phases": [
          {
            "timeframe": "0-6 sem",
            "interv": [
              "Edema",
              "Dedos",
              "SDRC"
            ]
          },
          {
            "timeframe": "6-12 sem",
            "interv": [
              "ADM punho",
              "Fortalecimento"
            ]
          }
        ]
      },
      {
        "name": "5.4.P11 — Fratura ESCAFOIDE",
        "desc": "Grave. Tabaqueira anatomica, gesso INCLUINDO POLEGAR 8-12 sem, risco pseudoartrose",
        "assess": [],
        "interv": [
          "Caracteristicas: vascularizacao retrograda, polo proximal/terco medio alto risco necrose/pseudoartrose. Consolidacao lenta 8-12 sem",
          "Imobilizacao especifica incluindo polegar 8-12 sem minimo",
          "Mobilizacao dedos 2-5 (indicador ao minimo) ATIVA VIGOROSA D1. NUNCA parados",
          "Educacao: escafoide consolida LENTAMENTE. Remover gesso antes = risco alto pseudoartrose"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Protecao rigorosa, prevencao rigidez dedos livres"
        ],
        "phases": [
          {
            "timeframe": "0-12 sem",
            "interv": [
              "Imobilizacao",
              "Dedos livres",
              "Educacao"
            ]
          },
          {
            "timeframe": "3-6 meses",
            "interv": [
              "Recuperacao pos-imobilizacao"
            ]
          }
        ]
      },
      {
        "name": "5.4.P12 — Fratura MAO (metacarpos, falanges)",
        "desc": "Grave. Trauma direto, edema importante, risco rigidez digital grave",
        "assess": [],
        "interv": [
          "Edema prioridade maxima: elevacao rigorosa, crioterapia, compressao suave",
          "Posicao imobilizacao CRITICA: punho leve extensao 20-30°, MF flexao 70-90°, IF extensao 0°, polegar abducao. NUNCA MF extensao",
          "Mobilizacao precoce protegida: dedos nao fraturados ATIVA VIGOROSA D1. Dedo fraturado conforme protocolo",
          "Recuperacao ADM: prioridade MF flexao 90°, IF proximal 100°, IF distal 70°. Fortalecimento e funcao"
        ],
        "block": "5.4 — Fraturas MMSS",
        "goals": [
          "Controle edema, mobilizacao protegida precoce"
        ],
        "phases": [
          {
            "timeframe": "0-3 sem",
            "interv": [
              "Edema",
              "Posicao",
              "Mobilizacao"
            ]
          },
          {
            "timeframe": "3-12 sem",
            "interv": [
              "ADM",
              "Fortalecimento"
            ]
          }
        ]
      },
      {
        "name": "5.5.P1 — Dor pos-operatoria limitante e protecao antalgica",
        "desc": "Grave. EVA ≥6 ou dor impede respiracao/transferencia",
        "assess": [],
        "interv": [
          "Checklist pre-sessao: cirurgia exata? movimentos proibidos? regra carga? dreno? PA/FC/SpO2/dor? dispositivo marcha?",
          "Controle dor para permitir mobilizacao"
        ],
        "block": "5.5 — Pos-operatorio Ortopedico",
        "goals": [
          "Reduzir dor para funcao, meta EVA ≤4 treino"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Checklist",
              "Controle dor"
            ]
          }
        ]
      },
      {
        "name": "5.5.P2 — Restricao movimento especifica cirurgia",
        "desc": "Critico. Ex: quadril flexao/adução/rotacao, risco luxacao",
        "assess": [],
        "interv": [
          "Educacao especifica conforme cirurgia"
        ],
        "block": "5.5 — Pos-operatorio Ortopedico",
        "goals": [
          "Dominar regras cirurgia (movimento e carga)"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Educacao"
            ]
          }
        ]
      },
      {
        "name": "5.5.P3 — Restricao carga (WBAT/PWB/TTWB/NWB) pos-op",
        "desc": "Critico. Conforme protese, osteossintese, qualidade ossea",
        "assess": [],
        "interv": [
          "Protocolo D0-D2: tirar do leito com seguranca, impedir espiral imobilismo",
          "Exercicios circulatorios (bomba panturrilha), ativacao quadriceps+gluteo (isometricos), treino respiratorio se dor limita",
          "Sedestacao progressiva, transferencia leito↔poltrona tecnica protegida, ortostatismo curto seguro, marcha muito curta se permitido"
        ],
        "block": "5.5 — Pos-operatorio Ortopedico",
        "goals": [
          "Mobilizacao precoce segura"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Protocolo base",
              "Exercicios",
              "Sedestacao",
              "Transferencia",
              "Ortostatismo",
              "Marcha"
            ]
          }
        ]
      },
      {
        "name": "5.5.P4 — Fraqueza/inibicao muscular pos-op (quadriceps/gluteo)",
        "desc": "Moderado. Extensor lag, incapaz estabilizar pelve, falha STS",
        "assess": [],
        "interv": [
          "D3-D7: consolidar funcao e independencia",
          "Progressao marcha distancia curta→corredor",
          "Treino sit-to-stand tecnica segura",
          "ADM funcional sem violar restricoes",
          "Fortalecimento progressivo quando permitido",
          "Treino AVDs: banheiro, higiene, vestir"
        ],
        "block": "5.5 — Pos-operatorio Ortopedico",
        "goals": [
          "Fortalecer ativacao quadriceps/gluteo/tronco"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Marcha",
              "STS",
              "ADM",
              "Fortalecimento",
              "AVDs"
            ]
          }
        ]
      },
      {
        "name": "5.5.P5 — Rigidez/queda ADM (risco contraturas)",
        "desc": "Moderado. Amplitude insuficiente sentar/levantar/marcha",
        "assess": [],
        "interv": [
          "Mobilizacao especifica conforme cirurgia"
        ],
        "block": "5.5 — Pos-operatorio Ortopedico",
        "goals": [
          "Recuperar ADM funcional minima"
        ],
        "phases": [
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Mobilizacao"
            ]
          }
        ]
      },
      {
        "name": "5.5.P6 — Alto risco trombose, atelectasia, complicacoes sistemicas",
        "desc": "Grave. Cirurgia+imobilismo+dor+sedacao",
        "assess": [],
        "interv": [
          "Mobilizacao precoce agressiva dentro restricoes"
        ],
        "block": "5.5 — Pos-operatorio Ortopedico",
        "goals": [
          "Prevenir atelectasia, trombose, perda funcional rapida"
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
        "name": "5.5.P7 — Risco queda e violar regras pos-operatorias",
        "desc": "Grave. Impulsivo, ansioso, delirium, uso inadequado dispositivo",
        "assess": [],
        "interv": [
          "Subprotocolos por cirurgia: ATQ (altura sentar, evitar cruzar pernas, rotacoes), ATJ (edema+mobilidade+quadriceps), osteossintese (educacao carga), coluna (rolar bloco)",
          "Regras movimento e carga dominadas, plano progressao ambulatorial",
          "PARADA: dor mecanica subita intensa, sangramento/hematoma expansivo, instabilidade hemodinamica, sinais neurovasculares alterados, queda/quase-queda, piora neurologica coluna"
        ],
        "block": "5.5 — Pos-operatorio Ortopedico",
        "goals": [
          "Alta com seguranca e autonomia compativel domicilio"
        ],
        "phases": [
          {
            "timeframe": "Ate alta",
            "interv": [
              "Protocolos especificos",
              "Criterios parada"
            ]
          }
        ]
      },
      {
        "name": "5.6.P1 — Fratura COLUNA CERVICAL (estavel sem deficit neurologico)",
        "desc": "Critico. Trauma cervical, colar/halo-colete/fixacao, risco lesao medular tardia",
        "assess": [],
        "interv": [
          "Avaliacao neurologica OBRIGATORIA antes toda mobilizacao: forca MMSS/MMII, sensibilidade, reflexos. Qualquer alteracao nova PARAR+AVISAR",
          "Tipo imobilizacao: colar movimento cervical PROIBIDO; halo limita tronco; fixacao confirmar restricoes",
          "Mobilizacao gradual protegida D1-D2 sedestacao com colar, transferencias NUNCA remover colar sem ordem",
          "Restricoes absolutas: NUNCA remover colar, movimentos cervicais, manipulacao"
        ],
        "block": "5.5 — Pos-operatorio Ortopedico",
        "goals": [
          "Protecao rigorosa coluna cervical"
        ],
        "phases": [
          {
            "timeframe": "0-2 sem",
            "interv": [
              "Avaliacao neuro",
              "Mobilizacao com colar"
            ]
          },
          {
            "timeframe": "2-12 sem",
            "interv": [
              "Funcao global",
              "Educacao colar"
            ]
          }
        ]
      },
      {
        "name": "5.6.P2 — Fratura COLUNA TORACICA (compressao/estavel)",
        "desc": "Grave. Queda altura, osteoporose, dor toracica intensa",
        "assess": [],
        "interv": [
          "Avaliacao: tipo fratura, estabilidade 3 colunas Denis, deficit neurologico? tratamento?",
          "Controle dor crucial para respiracao profunda e mobilizacao. EVA >6 limita severamente",
          "Prevencao complicacoes respiratorias PRIORIDADE: respiracao profunda APESAR dor (com analgesia), tosse assistida/controlada, mudancas decubito, mobilizacao precoce",
          "Mobilizacao gradual D1-D2 sedestacao, D2-D3 ortostatismo e marcha. Evitar flexao tronco, rotacoes forçadas, carga axial"
        ],
        "block": "5.6 — Fraturas Coluna / Politrauma",
        "goals": [
          "Controle dor, mobilizacao protegida precoce"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Avaliacao",
              "Dor",
              "Respiratorio",
              "Mobilizacao"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Marcha",
              "Educacao"
            ]
          }
        ]
      },
      {
        "name": "5.6.P3 — Fratura COLUNA LOMBAR (compressao/explosao)",
        "desc": "Critico. Dor lombar intensa, possivel deficit L2-S1",
        "assess": [],
        "interv": [
          "Avaliacao neurologica OBRIGATORIA MMII cada sessao: forca flexores quadril, quadriceps, dorsiflexores, plantiflexores, gluteos; sensibilidade; reflexos; esfincteriana (sindrome cauda equina ALERTA)",
          "Restricoes conforme tratamento: conservador repouso 1-3 dias→mobilizacao gradual, evitar flexao lombar/torcoes/carga axial; cirurgico confirmar restricoes",
          "Mobilizacao precoce protegida D1-D2 sedestacao (pode ser dolorosa), D2-D3 ortostatismo e marcha andador/paralelas. Log roll, sentar/levantar com apoio MMSS",
          "Prevencao TVP. Marcha, fortalecimento MMII, educacao mecanica corporal e sinais alerta"
        ],
        "block": "5.6 — Fraturas Coluna / Politrauma",
        "goals": [
          "Protecao coluna, avaliacao neurologica seriada"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Neuro MMII",
              "Restricoes",
              "Mobilizacao",
              "TVP"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Marcha",
              "Fortalecimento",
              "Educacao"
            ]
          }
        ]
      },
      {
        "name": "5.7.P1 — TCE leve/moderado SEM indicacao neurocirurgica",
        "desc": "Critico. Glasgow 9-15, cefaleia, nausea, tontura, confusao",
        "assess": [],
        "interv": [
          "Avaliacao neurologica OBRIGATORIA cada sessao: Glasgow, orientacao, pupilas, forca MMSS/MMII, marcha. Sinais alarme: piora Glasgow, cefaleia pior vida, vomitos jato, sonolencia, assimetria pupilar/forca, convulsao AVISAR",
          "Liberacao medica para levantar (TC estavel+observacao 12-24h). Progressao cautelosa D1-D2 cabeceira 30°→45°→sentado; D2-D3 beira leito→poltrona; D3+ ortostatismo/marcha SE estavel",
          "Prevencao sindrome pos-concussional: repouso relativo (mobilizacao leve OK), evitar esforco fisico/cognitivo intenso, hidratacao, sono",
          "Posicionamento cabeceira 30-45°"
        ],
        "block": "5.6 — Fraturas Coluna / Politrauma",
        "goals": [
          "Observacao neurologica seriada, mobilizacao cautelosa"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Avaliacao neuro",
              "Progressao cautelosa",
              "Prevencao"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao funcional",
              "Educacao alta"
            ]
          }
        ]
      },
      {
        "name": "5.7.P2 — Trauma ABDOMINAL fechado sob observacao",
        "desc": "Critico. Dor abdominal, distensao, tratamento conservador ou pos-laparotomia",
        "assess": [],
        "interv": [
          "Sinais alerta: sangramento (taquicardia, hipotensao, palidez, distensao progressiva, Hb/Ht); peritonite (dor difusa, defesa, febre, RHA). Qualquer alteracao AVISAR",
          "Repouso 24-48h: decubito dorsal ou conforto, joelhos semifletidos. Mobilizacao minima: mudancas decubito suaves, exercicios MMII leito. Evitar sentar/levantar precipitado, Valsalva, contracao abdominal",
          "Contraindicacoes temporarias: instavel, sangramento ativo, EVA >7, suspeita lesao. Aguardar estabilizacao e liberacao medica",
          "Progressao D2-D3 cabeceira→beira leito→poltrona; D3-D5 ortostatismo e marcha curta"
        ],
        "block": "5.6 — Fraturas Coluna / Politrauma",
        "goals": [
          "Repouso inicial, observacao sangramento/peritonite"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Sinais alerta",
              "Repouso"
            ]
          },
          {
            "timeframe": "2-7 dias",
            "interv": [
              "Progressao",
              "Educacao"
            ]
          }
        ]
      },
      {
        "name": "5.7.P3 — Lesao LIGAMENTAR grave joelho/tornozelo (entorse II-III)",
        "desc": "Grave. Dor intensa, edema maciço, instabilidade",
        "assess": [],
        "interv": [
          "PROTOCOLO PRICE/POLICE: Protection, Ice 15-20 min 3-6x/dia, Compression, Elevation, Load conforme protocolo",
          "Tipo lesao e tratamento: grau I mobilizacao precoce; II imobilizacao 2-4 sem; III cirurgico ou conservador conforme ligamento",
          "Controle atrofia: isometricos quadriceps D1 5s 10-15 rep 3-4x/dia; tornozelo se permitido",
          "Mobilizacao conforme protocolo. Progressao carga tipica 0-2 sem descarga, 2-6 sem parcial, 6-8 sem total. Propriocepcao essencial 4-6 sem"
        ],
        "block": "5.6 — Fraturas Coluna / Politrauma",
        "goals": [
          "Controle edema, protecao, prevenir rigidez"
        ],
        "phases": [
          {
            "timeframe": "0-2 sem",
            "interv": [
              "PRICE/POLICE",
              "Tipo lesao",
              "Atrofia"
            ]
          },
          {
            "timeframe": "2-12 sem",
            "interv": [
              "Progressao carga",
              "Fortalecimento",
              "Propriocepcao"
            ]
          }
        ]
      },
      {
        "name": "5.7.P4 — Suspeita ou SINDROME COMPARTIMENTAL",
        "desc": "Critico. EMERGENCIA ortopedica. 5 Ps, risco necrose <6h",
        "assess": [],
        "interv": [
          "5 Ps: Pain desproporcional e à extensao passiva dedos (precoce), Pressure compartimento tenso, Paresthesia, Pallor (tardio), Pulselessness (tardio). Situacoes risco: fraturas alta energia, esmagamento, reperfusao",
          "Conduta imediata: RECONHECER, AVISAR EQUIPE URGENTE, REMOVER imobilizacoes constritivas, ELEVAR membro nivel coracao (NAO acima), NAO mobilizar. Tratamento: FASCIOTOMIA URGENCIA <6h",
          "Janela <6h reversivel; 6-12h sequelas; >12h necrose/amputacao"
        ],
        "block": "5.7 — Outros Traumas",
        "goals": [
          "Reconhecimento precoce e acionamento cirurgia urgente"
        ],
        "phases": [
          {
            "timeframe": "0-6h",
            "interv": [
              "5 Ps",
              "Conduta imediata"
            ]
          },
          {
            "timeframe": "Pos-fasciotomia",
            "interv": [
              "Cuidados ferida",
              "Mobilizacao precoce"
            ]
          }
        ]
      },
      {
        "name": "5.7.P5 — AMPUTACAO traumatica membro (aguda)",
        "desc": "Critico. Perda traumatica segmento, dor intensa, choque emocional",
        "assess": [],
        "interv": [
          "Suporte psicologico PRIORIDADE: presenca empatica, escuta, nunca minimizar, psicologia urgente",
          "Controle dor: incisional + fantasma (dessensibilizacao coto, espelhamento, TENS)",
          "Posicionamento coto: MMII evitar flexao quadril/joelho prolongada (contratura flexao); decubito ventral 20-30 min 2-3x/dia; MMSS membro ao longo corpo",
          "Cuidados coto: curativo, bandagem compressiva 8 quando liberado. Mobilizacao e treino funcional precoce D1-D2 sedestacao/transferencias, D2-D3 ortostatismo/marcha 2 muletas",
          "Fortalecimento residual e contralateral, AVDs adaptadas, preparacao protetizacao"
        ],
        "block": "5.7 — Outros Traumas",
        "goals": [
          "Suporte psicologico, controle dor, posicionamento adequado"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Psicologico",
              "Dor",
              "Posicionamento",
              "Coto"
            ]
          },
          {
            "timeframe": "3-14 dias",
            "interv": [
              "Mobilizacao",
              "Fortalecimento",
              "AVDs",
              "Protetizacao"
            ]
          }
        ]
      },
      {
        "name": "5.8.P1 — Instabilidade clinica global (hemodinamica e/ou respiratoria)",
        "desc": "Critico. PAM <65 ou vasopressor, SpO2 instavel/FiO2 alta, lactato elevado, VM em parametros altos",
        "assess": [],
        "interv": [
          "Verificar criterios estabilidade com equipe antes de mobilizar",
          "Priorizar intervencoes no leito: posicionamento, recrutamento, prevencao complicacoes",
          "Mobilizacao passiva/ativo-assistida de segmentos livres se tolerado",
          "PARADA: queda PAM, dessaturacao sustentada, arritmia, piora neurologica"
        ],
        "block": "5.7 — Outros Traumas",
        "goals": [
          "Manter seguranca hemodinamica/respiratoria durante fisioterapia"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Reavaliacao seriada",
              "Mobilizacao leve",
              "Prevencao complicacoes"
            ]
          }
        ]
      },
      {
        "name": "5.8.P2 — Multiplas restricoes de movimento e carga",
        "desc": "Critico. Varios focos fratura, lesao coluna/pelve, ordens conflitantes",
        "assess": [],
        "interv": [
          "Mapear TODAS as restricoes antes da sessao (carga, movimentos proibidos, posicionamentos)",
          "Planejar trajeto e tecnicas de mobilizacao com 2-3 profissionais",
          "Usar dispositivos auxiliares (prancha, cinto, andador) conforme quadro",
          "Registrar plano simplificado junto ao leito"
        ],
        "block": "5.7 — Outros Traumas",
        "goals": [
          "Mobilizar sem violar nenhuma restricao mecanica"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Mapa restricoes",
              "Planejamento equipe",
              "Mobilizacao assistida"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Revisar restricoes",
              "Progredir conforme liberacao"
            ]
          }
        ]
      },
      {
        "name": "5.8.P3 — Alto risco hipoxemia, atelectasia e complicacoes pulmonares",
        "desc": "Critico. Trauma toracico/contusao, dor importante, secrecao retida, imobilidade",
        "assess": [],
        "interv": [
          "Combinar analgesia otima com medico antes de sessoes",
          "Reexpansao e higiene brônquica frequentes (criterios: SpO2, RX, ausculta, secrecao)",
          "Posicionamento terapeutico (decubitos estrategicos, semi-Fowler, prona vigil se indicado)",
          "Mobilizacao precoce dentro seguranca hemodinamica"
        ],
        "block": "5.7 — Outros Traumas",
        "goals": [
          "Reduzir risco IRpA, pneumonia e VMI prolongada"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Analgesia",
              "Reexpansao",
              "Higiene",
              "Posicionamento"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Mobilizacao progressiva",
              "Reavaliacao imagem"
            ]
          }
        ]
      },
      {
        "name": "5.8.P4 — Rebaixamento do nivel de consciencia / TCE associado",
        "desc": "Critico. Glasgow <13, sedacao, deficits focais, colaboracao limitada",
        "assess": [],
        "interv": [
          "Avaliacao neurologica seriada a cada sessao",
          "Manter cabeca alinhada, evitar manobras que aumentem PIC",
          "Mobilizacao graduada (cabeceira→beira leito→poltrona→ortostatismo) somente se autorizado",
          "Estimulo sensorial e motor precoce sem provocar agitacao"
        ],
        "block": "5.7 — Outros Traumas",
        "goals": [
          "Prevenir complicacoes do coma e promover recuperacao neurologica"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Avaliacao neuro",
              "Posicionamento",
              "Estimulo seguro"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Progressao mobilizacao",
              "Treino funcional basico"
            ]
          }
        ]
      },
      {
        "name": "5.8.P5 — Dor intensa e resposta simpatica exagerada",
        "desc": "Grave. EVA ≥7 com taquicardia/hipertensao associadas",
        "assess": [],
        "interv": [
          "Coordinar manejo analgésico com equipe (antes, durante e apos sessao)",
          "Usar tecnicas de mobilizacao em blocos curtos com pausas",
          "Ensinar estrategias nao farmacologicas (posicionamento, respiracao, gelo/calor quando indicado)",
          "Monitorar sinais vitais durante mobilizacao"
        ],
        "block": "5.7 — Outros Traumas",
        "goals": [
          "Reduzir dor a nivel que permita mobilizacao segura"
        ],
        "phases": [
          {
            "timeframe": "0-48h",
            "interv": [
              "Analgesia otima",
              "Sessões curtas",
              "Treino respiratorio"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Aumentar tolerancia ao movimento",
              "Autogestao da dor"
            ]
          }
        ]
      },
      {
        "name": "5.8.P6 — Fraqueza global e risco extremo de perda funcional",
        "desc": "Critico. Leito >72h, VM/sedacao/BNM, incapaz rolar/sentar ou sustentar cabeca/tronco",
        "assess": [],
        "interv": [
          "Protocolo de mobilizacao precoce em UTI: mobilizacao passiva/assistida, sedestacao, ortostatismo progressivo",
          "Treinar rolar, sentar beira leito e STS conforme nivel de consciencia/forca",
          "Associar eletroestimulacao se disponivel em grupos chave (quadriceps, gluteos)",
          "Planejar metas funcionais semanais com equipe"
        ],
        "block": "5.7 — Outros Traumas",
        "goals": [
          "Evitar fraqueza adquirida na UTI e perda de autonomia"
        ],
        "phases": [
          {
            "timeframe": "0-7 dias",
            "interv": [
              "Mobilizacao precoce",
              "Treino leito",
              "Sedestacao"
            ]
          },
          {
            "timeframe": ">7 dias",
            "interv": [
              "Ortostatismo/marcha",
              "Fortalecimento",
              "Treino AVDs"
            ]
          }
        ]
      },
      {
        "name": "5.8.P7 — Alto risco tromboembolico e complicacoes do imobilismo",
        "desc": "Critico. Trauma+inflamacao+imobilidade+cirurgias multiplas",
        "assess": [],
        "interv": [
          "Garantir medidas farmacologicas conforme protocolo (se nao contraindicadas)",
          "Bomba muscular frequente MMII, mudanca decubito, sedestacao precoce",
          "Educar paciente/familia sobre sinais de TVP/TEP",
          "Registrar contraindicacoes e revisar diariamente"
        ],
        "block": "5.7 — Outros Traumas",
        "goals": [
          "Reduzir incidência de TVP/TEP e complicacoes do repouso"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Profilaxia",
              "Bomba muscular",
              "Decubitos"
            ]
          },
          {
            "timeframe": "3-7 dias",
            "interv": [
              "Mobilizacao ativa",
              "Educacao"
            ]
          }
        ]
      },
      {
        "name": "5.8.P8 — Risco de queda, falha de sintese e eventos adversos na mobilizacao",
        "desc": "Critico. Multiplos dispositivos, instabilidade postural, deficit cognitivo/impulsividade",
        "assess": [],
        "interv": [
          "Definir nivel minimo de ajuda (2-3 pessoas) e equipamentos antes de cada sessao",
          "Usar cintos de seguranca, andadores, suportes conforme necessario",
          "Estabelecer criterios PARADA claros (quase-queda, dor mecanica aguda, perda contato linha/dispositivo critico)",
          "Documentar eventos adversos e ajustar plano"
        ],
        "block": "5.7 — Outros Traumas",
        "goals": [
          "Realizar mobilizacao segura mesmo em politrauma complexo"
        ],
        "phases": [
          {
            "timeframe": "0-72h",
            "interv": [
              "Planejamento seguranca",
              "Mobilizacao assistida",
              "Criterios parada"
            ]
          },
          {
            "timeframe": "3-14 dias",
            "interv": [
              "Reducao ajuda",
              "Autonomia progressiva"
            ]
          }
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
