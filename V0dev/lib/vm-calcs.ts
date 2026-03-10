/**
 * Cálculos de ventilação mecânica (referência do projeto antigo)
 */

export function calcDP(plato: number, peep: number): number | null {
  if (plato == null || peep == null || isNaN(plato) || isNaN(peep)) return null;
  return plato - peep;
}

export function calcCest(vt: number, dp: number): number | null {
  if (dp == null || dp === 0 || isNaN(vt)) return null;
  return vt / dp;
}

export function calcRSBI(fr: number, vc: number): number | null {
  if (vc === 0 || isNaN(fr) || isNaN(vc)) return null;
  return fr / (vc / 1000);
}

export function interpRSBI(v: number): { t: string; c: string } | null {
  if (v < 80) return { t: "Favorável ao desmame", c: "#4ade80" };
  if (v <= 105) return { t: "Risco moderado", c: "#facc15" };
  return { t: "Alto risco de falha", c: "#f87171" };
}

export function calcPF(pao2: number, fio2: number): number | null {
  if (fio2 === 0 || isNaN(pao2) || isNaN(fio2)) return null;
  return pao2 / (fio2 / 100);
}

export function interpPF(v: number): { t: string; c: string } | null {
  if (v >= 400) return { t: "Normal", c: "#4ade80" };
  if (v >= 300) return { t: "Preservado", c: "#4ade80" };
  if (v >= 200) return { t: "SDRA Leve", c: "#facc15" };
  if (v >= 100) return { t: "SDRA Moderada", c: "#fb923c" };
  return { t: "SDRA Grave", c: "#f87171" };
}

export function calcROX(spo2: number, fio2: number, fr: number): number | null {
  if (fio2 === 0 || fr === 0 || isNaN(spo2) || isNaN(fio2) || isNaN(fr)) return null;
  return (spo2 / fio2) * 100 / fr;
}

export function calcMechanicalPower(vcMl: number, dp: number, f: number): number | null {
  if (isNaN(vcMl) || isNaN(dp) || isNaN(f)) return null;
  return 0.098 * (vcMl / 1000) * dp * f;
}

export function calcCdyn(vt: number, pico: number, peep: number): number | null {
  if (pico <= peep || isNaN(vt) || isNaN(pico) || isNaN(peep)) return null;
  return vt / (pico - peep);
}

export function calcRaw(pico: number, plato: number, fluxo: number): number | null {
  if (!fluxo || fluxo === 0 || isNaN(pico) || isNaN(plato)) return null;
  return (pico - plato) / (fluxo / 60);
}
