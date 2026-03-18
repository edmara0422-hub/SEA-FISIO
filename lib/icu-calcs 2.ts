/**
 * Cálculos do Prontuário ICU (referência do projeto antigo)
 */

export function calcPesoIdeal(alt: number, sexo: string): number {
  if (!alt || alt < 100 || alt > 250) return 0;
  if (sexo === "M") return 50 + 0.91 * (alt - 152.4);
  if (sexo === "F") return 45.5 + 0.91 * (alt - 152.4);
  return 47.75 + 0.91 * (alt - 152.4);
}

export function calcPF(pao2: number, fio2: number): number | null {
  if (fio2 === 0) return null;
  return pao2 / (fio2 / 100);
}

export function interpPF(v: number): { t: string; c: string } | null {
  if (v >= 400) return { t: "Normal", c: "#4ade80" };
  if (v >= 300) return { t: "Preservado", c: "#4ade80" };
  if (v >= 200) return { t: "SDRA Leve", c: "#facc15" };
  if (v >= 100) return { t: "SDRA Moderada", c: "#fb923c" };
  return { t: "SDRA Grave", c: "#f87171" };
}

export function calcDP(plato: number, peep: number): number | null {
  if (plato == null || peep == null) return null;
  return plato - peep;
}

export function calcCest(vt: number, dp: number): number | null {
  if (!dp || dp === 0) return null;
  return vt / dp;
}

export function calcGlasgow(
  o: number,
  v: number | string,
  m: number
): { total: number | string; interp: string; cor: string } | null {
  if (v === "T" || v === "t")
    return {
      total: `${(o || 0) + (m || 0)}T`,
      interp: "Intubado",
      cor: "#60a5fa",
    };
  const t = (o || 0) + Number(v) + (m || 0);
  if (t >= 15) return { total: 15, interp: "Consciente e Orientado", cor: "#4ade80" };
  if (t >= 13) return { total: t, interp: "Disfunção Leve", cor: "#facc15" };
  if (t >= 9) return { total: t, interp: "Disfunção Moderada", cor: "#fb923c" };
  return { total: t, interp: "Coma (VA definitiva)", cor: "#f87171" };
}

export function calcRSBI(fr: number, vc: number): number | null {
  if (!vc || vc === 0) return null;
  return fr / (vc / 1000);
}

export function interpRSBI(v: number): { t: string; c: string } | null {
  if (v < 80) return { t: "Favorável ao desmame", c: "#4ade80" };
  if (v <= 105) return { t: "Risco moderado", c: "#facc15" };
  return { t: "Alto risco de falha", c: "#f87171" };
}

export function analisarGaso(params: {
  gasoPH: number
  gasoPaCO2: number
  gasoHCO3: number
}): { tipo: string; origem: string; comp: string; cor: string; full: string } | null {
  const pH = Number(params.gasoPH)
  const co2 = Number(params.gasoPaCO2)
  const hco3 = Number(params.gasoHCO3)

  if ([pH, co2, hco3].some((value) => Number.isNaN(value))) {
    return null
  }

  let tipo = "Normal"
  let origem = ""
  let comp = ""

  if (pH < 7.35) {
    tipo = "Acidose"
    if (co2 > 45 && hco3 < 22) {
      origem = "Mista"
      comp = "Nao compensada"
    } else if (co2 > 45) {
      origem = "Respiratoria"
      comp = hco3 > 26 ? "Parcial" : "Nao compensada"
    } else if (hco3 < 22) {
      origem = "Metabolica"
      comp = co2 < 35 ? "Parcial" : "Nao compensada"
    }
  } else if (pH > 7.45) {
    tipo = "Alcalose"
    if (co2 < 35 && hco3 > 26) {
      origem = "Mista"
      comp = "Nao compensada"
    } else if (co2 < 35) {
      origem = "Respiratoria"
      comp = hco3 < 22 ? "Parcial" : "Nao compensada"
    } else if (hco3 > 26) {
      origem = "Metabolica"
      comp = co2 > 45 ? "Parcial" : "Nao compensada"
    }
  }

  let cor = "#4ade80"
  if (tipo !== "Normal") cor = "#facc15"
  if (origem === "Mista" || comp === "Nao compensada") cor = "#fb923c"
  if (pH < 7.2 || pH > 7.6) cor = "#f87171"

  return {
    tipo,
    origem,
    comp,
    cor,
    full: `${tipo}${origem ? ` ${origem}` : ""}${comp ? ` - ${comp}` : ""}`,
  }
}

export function interpP01(v: number): { t: string; c: string } | null {
  const value = Number(v)
  if (Number.isNaN(value)) return null
  if (value >= 1.5 && value <= 3.5) return { t: "Drive normal (1.5-3.5)", c: "#4ade80" }
  if (value < 1.0) return { t: "Drive hipo (<1.0)", c: "#f87171" }
  if (value < 1.5) return { t: "Drive baixo-normal", c: "#facc15" }
  if (value <= 4.0) return { t: "Drive levemente elevado", c: "#facc15" }
  return { t: "Drive hiper (>4.0)", c: "#f87171" }
}

export function interpPocc(v: number): { t: string; c: string } | null {
  const value = Number(v)
  if (Number.isNaN(value)) return null
  if (value >= 5 && value <= 10) return { t: "Normal (5-10)", c: "#4ade80" }
  if (value < 5) return { t: "Baixo (<5)", c: "#facc15" }
  return { t: "Elevado (>10)", c: "#fb923c" }
}

export function calcPmusc(pocc: number): number | null {
  const value = Number(pocc)
  if (Number.isNaN(value)) return null
  return Math.abs(0.75 * value)
}

export function interpPmusc(v: number): { t: string; c: string } | null {
  const value = Number(v)
  if (Number.isNaN(value)) return null
  if (value < 5) return { t: "Superassistencia (<5)", c: "#60a5fa" }
  if (value <= 10) return { t: "Protecao diafragmatica (5-10)", c: "#4ade80" }
  if (value <= 13) return { t: "Esforco moderado (10-13)", c: "#facc15" }
  return { t: "Esforco excessivo (>13)", c: "#f87171" }
}

export type PatientData = {
  id?: string;
  leito?: string;
  nome?: string;
  idade?: string;
  sexo?: string;
  altura?: string;
  peso?: string;
  pesoIdeal?: string;
  pesoAtual?: string;
  statusClinico?: string;
  historia?: string;
  diagnostico?: string;
  glasgowO?: string;
  glasgowV?: string;
  glasgowM?: string;
  rass?: string;
  cardiovascular?: string;
  pas?: string;
  pad?: string;
  pam?: string;
  fc?: string;
  pulmonar?: string;
  tipoVia?: string;
  modoVM?: string;
  vt?: string;
  fr?: string;
  peep?: string;
  fio2?: string;
  ppico?: string;
  pplato?: string;
  pmean?: string;
  gasoPH?: string;
  gasoPaCO2?: string;
  gasoPaO2?: string;
  gasoHCO3?: string;
  gasoBE?: string;
  gasoFiO2?: string;
  [key: string]: unknown;
};

export function emptyPatient(): PatientData {
  return {
    leito: "",
    nome: "",
    idade: "",
    sexo: "",
    altura: "",
    peso: "",
    pesoIdeal: "",
    pesoAtual: "",
    statusClinico: "",
    historia: "",
    diagnostico: "",
    glasgowO: "",
    glasgowV: "",
    glasgowM: "",
    rass: "",
    cardiovascular: "",
    pas: "",
    pad: "",
    pam: "",
    fc: "",
    pulmonar: "",
    tipoVia: "",
    modoVM: "",
    vt: "",
    fr: "",
    peep: "",
    fio2: "",
    ppico: "",
    pplato: "",
    pmean: "",
    gasoPH: "",
    gasoPaCO2: "",
    gasoPaO2: "",
    gasoHCO3: "",
    gasoBE: "",
    gasoFiO2: "",
  };
}
