/** 83 problemas - Sistema Respiratorio (Referencias Clinicas) */
window.RESPIRATORY_PROBLEMS=(function(){
  function P(name,desc,assess,interv,opts){
    var o=opts||{};
    return {name:name,desc:desc,assess:assess||[],interv:interv||[],block:o.block,goals:o.goals||[],phases:o.phases||[]};
  }
  var BLOCKS=['R1 — Oxigenoterapia, HFNC e VNI','R2 — Via aerea, secrecao e higiene bronquica','R3 — Insuf. respiratoria aguda','R4-A — VM: Mecanica e protecao','R4-B — VM: Oxigenacao e recrutamento','R4-C — VM: Controle ventilatorio (CO₂)','R4-D — VM: Assincronias','R4-E — VM: Obstrucao e aprisionamento','R4-F — VM: Neuro / sedacao / diafragma','R4-G — VM: Complicacoes e emergencias','R4-H — Manejo via aerea artificial','R5-A — Desmame e TRE','R5-B — Pos-extubacao','R5-C — Traqueostomia','R5-D — Biomarcadores e preditores'];
  var BND=[0,5,12,17,24,31,34,39,45,50,57,60,67,72,76,83]; /* start index per block */
  var arr=[
    /* R1 — OXIGENOTERAPIA, HFNC E VNI */
    P('R1.1 — Hipoxemia leve a moderada em resp. espontanea','Moderado. SpO₂ < 92% (geral) ou < 88-90% (DPOC), FR normal/leve↑, sem fadiga grave',['Atingir SpO₂ alvo: Geral 92-96%, DPOC 88-92%','Menor suporte que mantem SpO₂ alvo','Reduzir gradualmente dependencia de O₂'],['Cateter nasal 1-5 L/min (titular)','Mascara simples 5-10 L/min se insuficiente','Mascara com reservatorio 10-15 L/min se necessario','Posicionamento terapeutico, mobilizacao precoce','Monitorar SpO₂, FR, FC, esforco respiratorio']),
    P('R1.2 — Hipoxemia moderada a grave com alto trabalho respiratorio','Grave. SpO₂ < alvo com mascara reservatorio, FR > 28-30, musculatura acessoria',['Reduzir trabalho respiratorio, melhorar SpO₂','Estabilizar e evitar intubacao'],['HFNC fluxo 40-60 L/min, FiO₂ alto e reduzir conforme SpO₂','Primeiro aumentar fluxo, depois reduzir FiO₂','Posicao sentada/tripe','Higiene bronquica se secrecao; reavaliar 15-30-60 min','Criterios de falha: FR>30, esforco nao reduz → escalar VNI/IOT']),
    P('R1.3 — Insuf. respiratoria com componente ventilatorio (hipercapnia)','Critico. PaCO₂ elevada + pH < 7,35, sonolencia, FR alta com baixa efetividade',['Reduzir trabalho, melhorar pH e ventilacao alveolar','Reverter falencia e evitar intubacao'],['VNI: IPAP 10-14 cmH₂O, EPAP 4-6, FiO₂ titular','Ajustar por Vt espontaneo, FR, conforto, gasometria, vazamento','Pausas programadas; higiene bronquica antes longos periodos','Monitorar 1-2h: FR, SpO₂, consciencia, fadiga, gaso','Criterios de falha: piora consciencia, instabilidade → IOT']),
    P('R1.4 — Intolerancia a interface / falha de adaptacao','Moderado. Ansiedade, vazamento, dor facial, claustrofobia, lesao pele',['Manter suporte nao invasivo por blocos progressivos'],['Trocar tipo/tamanho interface','Ajustar tirantes e vazamentos','Adaptacao gradual com pausas programadas','Umidificacao adequada']),
    P('R1.5 — Dependencia prolongada de oxigenio','Moderado. Estavel mas nao reduz O₂ sem dessaturar',['Reduzir progressivamente necessidade de O₂'],['Avaliar causa: descondicionamento, atelectasia, congestao, shunt','Mobilizacao progressiva 2-3x/dia','Reexpansao pulmonar, treino funcional com SpO₂','Ajustar O₂ durante esforco']),
    /* R2 — VIA AÉREA, SECREÇÃO E HIGIENE BRÔNQUICA */
    P('R2.1 — Tosse ineficaz','Grave. PCF < 160 (alto risco < 60 inutil), PEmax < 60, secrecao sem aspiracao',['Aumentar fluxo tosse efetivo, eliminar secrecao'],['Medir PCF, PEmax, PImax','Treino muscular expiratorio POWERbreathe 30-50% PEmax','Treino tosse: insp profunda → pausa → exp explosiva; huffing','Tosse assistida manual; se PCF<60: tosse assistida mecanica','Reavaliar PCF/PEmax 48-72h']),
    P('R2.2 — Hipoventilacao / baixo volume corrente em resp. espontanea','Moderado. VC < 5-7 mL/kg, VE baixo, FR alta superficial, atelectasia basal',['Aumentar volume corrente, melhorar expansibilidade'],['Ventilometria VC, VE; avaliar dor, mobilidade toracica','Exercicios ventilatorios: inspiracao lenta profunda, fracionada','Inspirometria incentivo; sedestacao, ortostatismo precoce','Mobilizacao global 2-3x/dia; repetir ventilometria diario']),
    P('R2.3 — Fraqueza muscular respiratoria','Grave. PImax < -60 (< -30 grave), desmame dificil, tosse fraca',['Iniciar treino muscular respiratorio'],['TMI: POWERbreathe 30-50% PImax, 2x/dia, 2-3 series 10-15 rep','Progressao carga a cada 3-5 dias','Mobilizacao global; medir PImax/PEmax 5-7 dias']),
    P('R2.4 — Secrecao espessa / desidratada','Moderado. Aspiracao dificil, secrecao seca/aderida',['Reduzir viscosidade, facilitar remocao'],['Corrigir umidificacao; avaliar hidratacao sistemica','Higiene bronquica frequente','Evitar aspiracao traumatica repetitiva']),
    P('R2.5 — Atelectasia por retencao / hipoventilacao','Grave. RX colapso segmentar/lobar, MV reduzido, hipoxemia',['Reexpandir area colapsada'],['Posicionamento: pulmao afetado para cima 2-4h','Exercicios reexpansao; se VM: MRA + PEEP adequada','Reavaliar clinica e imagem diario']),
    P('R2.6 — Pressao de cuff inadequada','Moderado. Pcuff < 20 (vazamento/aspiracao) ou > 30 (lesao traqueal)',['Pcuff 20-30 cmH₂O (ideal 25)'],['Medir Pcuff com cuffometro; ajustar volume cuff','Verificar vazamento Vt exp vs insp; auscultar regiao glotica','Reavaliar Pcuff 12/12h; registrar em prontuario']),
    P('R2.7 — Risco de aspiracao / disfagia','Grave. Rebaixamento, AVE/TRM, falha teste degluticao, FOIS < 5',['Prevenir pneumonia aspirativa'],['Cabeceira ≥ 30-45°; higiene oral 3-4x/dia','Aspiracao orofaringea PRN; Pcuff 20-30','Pre-extubacao: teste tosse voluntaria, degluticao agua 3-10ml','Se falha: adiar extubacao, fonoaudiologia; considerar TQT']),
    /* R3 — INSUFICIÊNCIA RESPIRATÓRIA AGUDA */
    P('R3.1 — IRA hipoxemica','Critico. SpO₂ < 90-92% ar, PaO₂ < 60, P/F < 300',['Corrigir hipoxemia, reduzir trabalho'],['Escalonamento: cateter → mascara → reservatorio → HFNC → VNI → VM','O₂ titular SpO₂ alvo; HFNC 40-60 L/min; VNI EPAP 5-10','Posicionamento, mobilizacao precoce, higiene bronquica','FALHA: FR>30, P/F<150 → escalar']),
    P('R3.2 — IRA hipercapnica','Critico. PaCO₂ > 45, pH < 7,35, sonolencia/asterixis',['Melhorar ventilacao alveolar, corrigir acidose'],['VNI: IPAP 10-14, EPAP 4-6; ajustar por Vt, FR, PaCO₂','Interface e vedacao; pausas programadas','Gasometria 1-2h; FALHA → VM invasiva']),
    P('R3.3 — IRA mista (hipoxemica + hipercapnica)','Critico. PaO₂ baixa + PaCO₂ alta + pH alterado',['Estabilizar oxigenacao e ventilacao'],['HFNC ou VNI conforme perfil; baixo limiar para VM','Monitorizacao intensiva; tratar causa base agressivamente']),
    P('R3.4 — Fadiga muscular respiratoria','Critico. FR > 35, acessorios, sudorese, paradoxo, PImax < -30, Vt caindo',['Reduzir trabalho imediato, prevenir parada'],['Suporte ventilatorio HFNC/VNI/VM conforme gravidade','Evitar exercicios nesse momento; apos estabilizacao: TMI progressivo']),
    P('R3.5 — Falencia respiratoria iminente','Critico. Rebaixamento, exaustao, instabilidade, gaso grave',['Garantir via aerea e ventilacao'],['Preparar VM invasiva; pre-oxigenacao; auxiliar equipe IOT','Pos-intubacao: protocolo VM protetora (R4)']),
    /* R4-A — VM: MECÂNICA E PROTEÇÃO */
    P('R4-A1 — VM fora da zona protetora (risco VILI)','Critico. Vt > 8 mL/kg PBW, Pplat > 30, ΔP > 15, SI fora 0,9-1,1, Cest < 30',['Vt 4-6 mL/kg PBW, Pplat ≤ 30, ΔP < 15'],['Medir Vt, Pplat, PEEP, ΔP, Cest por plantao','Reduzir Vt stepwise; hipercapnia permissiva se pH ≥ 7,20','Titular PEEP por Cest/ΔP; recrutamento se indicado; pronacao se P/F < 150']),
    P('R4-A2 — Driving pressure elevado','Critico. ΔP > 15 cmH₂O',['ΔP < 15 (ideal < 12)'],['Reduzir Vt; testar PEEP; avaliar parede/abdome; Vt ultrabaixo se necessario']),
    P('R4-A3 — Pressao de plato elevada','Grave. Pplat > 30 cmH₂O',['Pplat ≤ 30 (ideal < 28)'],['Reduzir Vt; rever PEEP; avaliar pressao abdominal']),
    P('R4-A4 — Volume corrente excessivo','Grave. Vt > 8 mL/kg PBW',['Vt 4-6 mL/kg PBW'],['Recalcular PBW; ajustar Vt no ventilador; reavaliar gaso 30-60 min']),
    P('R4-A5 — Complacencia pulmonar muito baixa','Grave. Cest < 30 mL/cmH₂O',['Melhorar recrutamento, minimizar estresse'],['Titular PEEP por melhor Cest; pronacao se SDRA; MRA se indicado']),
    P('R4-A6 — Stress index alterado','Moderado. SI < 0,9 (colapso) ou > 1,1 (hiperdistensao)',['SI entre 0,9-1,1'],['SI < 0,9 → subir PEEP; SI > 1,1 → reduzir PEEP ou Vt']),
    P('R4-A7 — Hiperinsuflacao / hiperdistensao global','Grave. Curvas achatadas, ΔP alto, Cest piora ao subir PEEP',['Reduzir volumes pulmonares finais'],['Reduzir PEEP e Vt; reavaliar hemodinamica']),
    /* R4-B — VM: OXIGENAÇÃO E RECRUTAMENTO */
    P('R4-B1 — Hipoxemia refrataria em VM','Critico. P/F < 150, SpO₂ < 90% com FiO₂ ≥ 0,8',['Aumentar P/F, FiO₂ < 0,6'],['Otimizar PEEP; MRA se recrutavel; pronacao se P/F < 150']),
    P('R4-B2 — PEEP insuficiente (colapso)','Grave. SI < 0,9, Cest melhora ao subir PEEP',['Manter pulmao aberto'],['Titulacao PEEP 8→10→12→14; melhor Cest, menor ΔP, sem ↓PAM']),
    P('R4-B3 — PEEP excessiva (hiperdistensao)','Grave. SI > 1,1, ΔP ↑ ao subir PEEP, hipotensao',['Reduzir hiperdistensao'],['Reduzir PEEP 2 cmH₂O; reavaliar Cest, ΔP, SpO₂, PAM']),
    P('R4-B4 — Pulmao recrutavel vs nao recrutavel','Moderado. Curva P×V, Cest, MRA, TC',['Identificar estrategia'],['Recrutavel: MRA + PEEP manutencao; Nao: pressao minima + pronacao']),
    P('R4-B5 — Manobra de recrutamento alveolar','Grave. Atelectasia, queda Cest, pos-desconexao',['Abrir unidades colapsadas'],['Contraindicacoes: pneumotorax, choque, VD falente','Monitorar SpO₂, PAM, FC durante MRA; fixar PEEP apos MRA']),
    P('R4-B6 — Pronacao','Critico. P/F < 150-200, SDRA',['Aumentar P/F, reduzir FiO₂'],['Prona 16-20h/dia; fisio: proteger tubo, posicionamento; higiene antes/depois']),
    P('R4-B7 — Consolidacao / shunt nao recrutavel','Grave. Consolidacao extensa, Cest nao melhora',['Otimizar oxigenacao sem VILI'],['Nao forcar PEEP alta; PEEP moderada + pronacao; aguardar causa base']),
    /* R4-C — VM: CONTROLE VENTILATÓRIO (CO₂) */
    P('R4-C1 — Hipercapnia / acidose respiratoria','Grave. PaCO₂ > 50 e/ou pH < 7,30',['pH ≥ 7,25, evitar ↑ΔP/Pplat'],['Ajustar FR (se nao autoPEEP); reduzir Vd; gaso 30-60 min']),
    P('R4-C2 — Espaco morto aumentado','Grave. PaCO₂ alto apesar VE alto, TEP/choque',['Melhorar eficiencia ventilatoria'],['Revisar PEEP; pronacao; tratar hemodinamica, TEP']),
    P('R4-C3 — Hipercapnia permissiva','Moderado. Protecao Vt baixo, ΔP limite',['pH toleravel sem ultrapassar protecao'],['Alvo pH ≥ 7,20-7,25; manter VM protetora; monitorar repercussao']),
    /* R4-D — VM: ASSINCRONIAS */
    P('R4-D1 — Assincronia significativa','Grave. Double trigger, esforco inefetivo, Vt irregular',['Reduzir assincronia, Vt/pressoes seguras'],['Curvas P×T, F×T, loops; checar circuito, agua, secrecao; identificar tipo']),
    P('R4-D2 — Flow starvation','Moderado. Curva P×T concava, esforco puxando',['Satisfazer demanda inspiratoria'],['Aumentar fluxo inspiratorio; ajustar rampa/rise time; checar resistencia']),
    P('R4-D3 — Double trigger','Grave. Dois ciclos colados, Vt somado',['Eliminar empilhamento'],['Aumentar TI; ajustar trigger; tratar drive alto: dor, febre, hipoxemia']),
    P('R4-D4 — Esforco inefetivo','Moderado. Deflexoes sem disparar, autoPEEP',['Melhorar disparo efetivo'],['Trigger mais sensivel; reduzir autoPEEP; PEEP externa ate 80% intrínseca']),
    P('R4-D5 — Drive excessivo (P-SILI)','Critico. FR alta, Vt escapa alto, dor/febre',['Reduzir esforco lesivo'],['Corrigir dor, febre, acidose, hipoxia; ajustar suporte; monitorar Vt e ΔP']),
    /* R4-E — VM: OBSTRUÇÃO E APRISIONAMENTO */
    P('R4-E1 — AutoPEEP / PEEP intrínseca','Grave. Fluxo nao zera, PEEP intr > 5',['Fluxo zerar, PEEP intr ≤ 5'],['Checar secrecao, tubo, filtro; reduzir FR, TE (I:E 1:3-1:5); broncoespasmo']),
    P('R4-E2 — Hiperinsuflacao com choque','Critico. PAM cai, taquicardia, aprisionamento',['Reverter urgente'],['Aumentar TE, reduzir Vt; grave: desconexao controlada']),
    P('R4-E3 — Broncoespasmo em VM','Grave. Sibilos, PIP ↑ Pplat normal, hipercapnia',['Reduzir resistencia'],['FR menor, TE maior; broncodilatador; reavaliar curva fluxo']),
    P('R4-E4 — DPOC exacerbado','Grave. DPOC + acidose + autoPEEP',['pH ≥ 7,25, reduzir aprisionamento'],['TE prolongado I:E 1:3-1:5; permissiva se pH OK; desmame precoce']),
    P('R4-E5 — Asma grave / status asmatico','Critico. Resistencia extrema, risco barotrauma',['Evitar barotrauma, pH toleravel'],['Exp longa: FR baixa, TE max; broncodilatacao + MgSO4']),
    P('R4-E6 — Obstrucao TOT/TQT','Critico. PIP sobe subito, Vt cai, dessaturacao',['Restabelecer patencia'],['Checar circuito/tubo, aspirar; ventilar manual; broncoscopia/troca se necessario']),
    /* R4-F — VM: NEURO / SEDAÇÃO / DIAFRAGMA */
    P('R4-F1 — Disfuncao diafragmatica','Grave. MIP < -20/-30, eco excursao < 10 mm',['Recuperar forca'],['Eco seriada; evitar ventilacao excessiva; TRE diarios; TMI progressivo']),
    P('R4-F2 — VIDD (lesao diafragma)','Grave. VM passiva prolongada ou esforco excessivo',['Prevenir lesao, ativar diafragma'],['Evitar super/subassistencia; desmame precoce; TRE + mobilizacao']),
    P('R4-F3 — Delirium / agitacao','Grave. CAM-ICU+, risco autoextubacao',['Controlar delirium'],['Sedacao minima; bundle A-F; mobilizacao precoce']),
    P('R4-F4 — Sedacao profunda','Moderado. RASS -4/-5, VM passiva',['Reduzir sedacao'],['Despertar diario; RASS alvo -1 a 0; TRE quando despertar']),
    P('R4-F5 — Polineuropatia critico','Grave. MRC < 48, desmame dificil',['Recuperar funcao'],['Mobilizacao 2x/dia; eletroestimulacao; TMI diario']),
    /* R4-G — VM: COMPLICAÇÕES E EMERGÊNCIAS */
    P('R4-G1 — Pneumotorax','Critico. MV abolido, PIP alto, hipotensao',['Drenagem urgente'],['Chamar equipe URGENTE; RX torax; preparar drenagem; reduzir pressoes']),
    P('R4-G2 — PAVM suspeita','Grave. Febre, secrecao purulenta, infiltrado',['Facilitar diagnostico'],['Aspirado; higiene otimizada; cabeceira 30-45°']),
    P('R4-G3 — Autoextubacao','Critico. Tubo saiu',['Avaliar reintubacao'],['O₂ mascara/HFNC/VNI; avaliar SpO₂, FR, esforco; decidir com equipe']),
    P('R4-G4 — Desconexao circuito','Critico. Alarme, dessaturacao',['Reconectar'],['Reconectar imediato; verificar fixacao; MRA se colapso']),
    P('R4-G5 — Instabilidade hemodinamica','Critico. PAM < 65, FC > 120 apos VM',['Identificar causa'],['Suspeitar hiperinsuflacao, pneumotorax; reduzir PEEP/Vt; RX']),
    P('R4-G6 — PCR em VM','Critico. Sem pulso, apneia',['RCP imediato'],['Codigo azul; ventilar manual 100%; auxiliar compressoes']),
    P('R4-G7 — Dessaturacao subita','Critico. SpO₂ cai rapido',['Identificar causa'],['DOPE: Deslocamento, Obstrucao, Pneumotorax, Equipment; aspirar; RX']),
    /* R4-H — MANEJO VIA AÉREA ARTIFICIAL */
    P('R4-H1 — Dependencia de via aerea artificial','Grave. TOT/TQT, manutencao patencia e protecao',['Manutencao patencia e protecao da via aerea'],['Medir Pcuff 6/6h; fixacao segura 12/12h; higiene oral 8-12h; auscultar turno','Trocar fixacao diario; avaliar indicacao TQT; aspiracao traqueal tecnica asséptica','Cuff-leak test (TOT); avaliar tosse voluntaria, PCF > 60 L/min'],{goals:['Curto prazo: cuff 20-30, fixacao, higiene oral, auscultar','Medio prazo: trocar fixacao, avaliar TQT','Pre-decannula: cuff-leak, avaliar tosse'],phases:[{timeframe:'Curto prazo',interv:['Cuff 20-30 cmH₂O; fixacao segura; higiene oral 8-12h; auscultar por turno']},{timeframe:'Medio prazo',interv:['Trocar fixacao diario; avaliar indicacao TQT; aspiracao traqueal tecnica asséptica']},{timeframe:'Pre-decannula',interv:['Cuff-leak test (TOT); avaliar tosse voluntaria, PCF > 60 L/min']}]}),
    P('R4-H2 — Manter vias aereas pervias','Grave. Secrecoes, obstrucao, desobstrucao',['Umidificacao e aspiracao','Tosse assistida e mobilizacao','Pre-extubacao: tosse, PCF > 60'],['HME ou umidificador; aspiracao indicada (roncos, ↑Ppico, ↓SpO₂)','Instilacao SF 5-10 mL se espessa; tosse assistida 2-3x/dia; mobilizacao'],{goals:['Umidificacao 32-34°C; aspiracao sob demanda','Tosse assistida; mobilizacao; drenagem postural','Pre-extubacao: tosse, PCF > 60'],phases:[{timeframe:'Manutencao diaria',interv:['HME ou umidificador 32-34°C; aspiracao sob demanda (roncos, ↑Ppico, ↓SpO₂)']},{timeframe:'Higiene bronquica',interv:['Instilacao SF 5-10 mL se espessa; tosse assistida 2-3x/dia; mobilizacao']},{timeframe:'Pre-extubacao',interv:['Avaliar tosse voluntaria, PCF > 60 L/min']}]}),
    P('R4-H3 — Secrecao purulenta/hematica','Grave. Purulenta ou hematica',['Purulenta: comunicar medico, cultura, higiene 4-6x/dia','Hematica: aspiracao delicada, pressao baixa, comunicar se > 50ml'],['ATB se PAVM; nebulizacao SF 3%; evitar SF se hematica'],{goals:['Purulenta: comunicar medico, cultura, higiene 4-6x/dia','Hematica: aspiracao delicada, pressao baixa, comunicar se > 50ml']}),
    /* R5-A — DESMAME E TRE */
    P('R5-A1 — Criterios desmame nao atingidos','Moderado. P/F < 150, PEEP > 8-10, instavel, febril, sedado',['Atingir criterios pre-TRE'],['Otimizar oxigenacao; reduzir sedacao RASS -1 a 0; estabilizar hemodinamica']),
    P('R5-A1 EXP — Dependencia VM sem criterios desmame','Grave. Nao preenche criterios para TRE',['Checklist diario; otimizacao ventilatoria; sedacao minima; desmame suporte','Avaliar PImax/PEmax quando RASS ≥ -1; TMI; mobilizacao; considerar TQT > 14-21 dias'],['VM protetora; despertar diario; reduzir FiO₂/PEEP progressivo']),
    P('R5-A2 — TRE indicado','Leve. P/F > 150, PEEP ≤ 8, estavel, acordado',['Realizar TRE'],['Tubo-T ou PS 5-7; 30-120 min; monitorar FR, Vt, RSBI, SpO₂','Sucesso: FR<35, RSBI<105, SpO₂>90%; Falha: reconectar']),
    P('R5-A3 — TRE falhou','Grave. FR > 35, dessaturacao, esforco ↑',['Fortalecer para novo TRE'],['Reconectar; investigar MIP/MEP, secrecao; TMI; mobilizacao; novo TRE 24-48h']),
    P('R5-A4 — Desmame prolongado','Grave. Multiplas falhas, VM > 7-14 dias',['Desmame progressivo'],['TRE 30→60→120 min; TMI 2x/dia; mobilizacao; TQT se > 10-14 dias']),
    P('R5-A5 — RSBI elevado','Grave. RSBI > 105',['RSBI < 105'],['TMI para ↑Vt ↓FR; controlar drive; higiene bronquica; remedir antes TRE']),
    P('R5-A6 — Dependencia ventilatoria cronica/irreversivel','Moderado. VM > 30 dias, multiplas falhas, sem perspectiva',['Otimizar qualidade de vida'],['Considerar TQT, VM domiciliar; prevenir complicacoes; mobilizacao maxima; discutir metas']),
    /* R5-B — PÓS-EXTUBAÇÃO */
    P('R5-B1 — Extubacao bem-sucedida','Leve. TRE sucesso, primeiras 48h',['Prevenir reintubacao'],['O₂ titular; HFNC profilatico se risco; higiene precoce; monitorar estridor']),
    P('R5-B2 — Estridor pos-extubacao','Grave. Som agudo, esforco ↑, edema glotico',['Reduzir edema'],['Sentado; O₂; nebulizacao adrenalina + corticoide; preparar reintubacao']),
    P('R5-B3 — Insuf. respiratoria pos-extubacao','Critico. SpO₂ < 90%, FR > 30, fadiga < 48h',['Evitar reintubacao'],['HFNC 50-60 L/min; VNI se hipercapnia/falha; FALHA → reintubar']),
    P('R5-B4 — Reintubacao','Critico. Falha suporte, IOT < 48-72h',['IOT segura'],['Pre-oxigenacao; auxiliar equipe; pos-IOT VM protetora']),
    P('R5-B5 — Alto risco reintubacao','Moderado. Idade > 65, comorbidades, TRE limite',['Profilaxia'],['HFNC profilatico; higiene 3-4x/dia; monitorizacao reforcada']),
    /* R5-C — TRAQUEOSTOMIA */
    P('R5-C1 — Indicacao TQT','Moderado. VM prevista > 14-21 dias',['Facilitar desmame, conforto'],['Discutir timing; pos-TQT higiene via canula; progressao cuff → desinflado → valvula → cap']),
    P('R5-C2 — Desmame traqueostomizado','Moderado. Criterios OK, TQT presente',['Progressao ate decanulacao'],['VM → PSV baixa → CPAP; desinflar cuff; valvula Passy-Muir; cap/oclusao']),
    P('R5-C3 — Obstrucao/deslocamento TQT','Critico. SpO₂ cai, PIP alto, enfisema subcutaneo',['Restabelecer via aerea'],['Aspirar; checar posicionamento; trocar canula se obstruida']),
    P('R5-C4 — Decanulacao','Leve. Tolera cap 24h, tosse eficaz',['Remover TQT'],['Cap 24h OK, PCF > 60-160; decanular; monitorar 24-48h']),
    /* R5-D — BIOMARCADORES E PREDITORES */
    P('R5-D1 — MIP/MEP fracos','Grave. MIP < -20/-30, MEP < +30/+40',['MIP > -30, MEP > +40'],['TMI POWERbreathe 30-50% MIP 2x/dia; TME se MEP fraco; reavaliar 5-7 dias']),
    P('R5-D2 — PCF baixo','Grave. PCF < 60 inutil, < 160 risco',['PCF > 160'],['Treino tosse; tosse assistida; TME; PCF<60: tosse mecanica']),
    P('R5-D3 — RSBI elevado','Grave. RSBI > 105',['RSBI < 105'],['TMI para ↑Vt; controlar drive; remedir antes TRE']),
    P('R5-D4 — P0.1 elevado (drive alto)','Moderado. P0.1 > 4-6 cmH₂O',['P0.1 entre 2-4'],['Medir P0.1; investigar dor, febre, acidose, hipoxemia; tratar causas']),
    P('R5-D5 — Excursao diafragmatica reduzida','Grave. Excursao < 10 mm',['Excursao > 10 mm'],['Eco diafragmatica; TMI progressivo; evitar ventilacao excessiva; reavaliar 5-7 dias']),
    P('R5-D6 — Espessamento diafragmatico reduzido','Grave. TFdi < 20%',['TFdi > 20%'],['TFdi = [(Ei-Ee)/Ee]×100; TMI; TRE progressivos; reavaliar seriado']),
    P('R5-D7 — Indices integrados','Moderado. CROP < 13, IWI < 25',['Melhorar preditores'],['CROP = Cdin×MIP×(PaO₂/PAO₂)/FR >13; IWI >25; fortalecer + otimizar'])
  ];
  arr.forEach(function(p,i){
    for(var b=0;b<BND.length-1;b++) if(i>=BND[b]&&i<BND[b+1]){ p.block=BLOCKS[b]; break; }
    if(!p.goals||!p.goals.length) p.goals=(p.assess&&p.assess.length)?p.assess.slice(0,3):[];
  });
  return arr;
})();
