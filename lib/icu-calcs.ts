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
