import { z } from 'zod'

// ECG Parameters Schema
export const ECGParametersSchema = z.object({
  bpm: z.number().min(40).max(200).describe('Batidas por minuto'),
  amplitude: z.number().min(0.5).max(5).describe('Amplitude da onda em mV'),
  rhythm: z.enum(['sinusal', 'taquicardia', 'bradicardia', 'arritmia']).describe('Tipo de ritmo'),
  prInterval: z.number().min(120).max(200).describe('Intervalo PR em ms'),
  qrsWidth: z.number().min(80).max(120).describe('Largura QRS em ms'),
})

export type ECGParameters = z.infer<typeof ECGParametersSchema>

// Ventilation Mechanics Schema
export const VentilationSchema = z.object({
  fr: z.number().min(6).max(40).describe('Frequência respiratória'),
  peep: z.number().min(0).max(25).describe('PEEP em cmH₂O'),
  peakPressure: z.number().min(15).max(60).describe('Pressão de pico'),
  platoPressure: z.number().min(10).max(50).describe('Pressão de platô'),
  tidalVolume: z.number().min(300).max(1000).describe('Volume corrente em mL'),
  fio2: z.number().min(21).max(100).describe('Fração inspirada de oxigênio'),
  flowRate: z.number().min(20).max(150).describe('Fluxo em L/min'),
})

export type VentilationParameters = z.infer<typeof VentilationSchema>

// Gasometry Schema
export const GasometrySchema = z.object({
  pao2: z.number().min(30).max(150).describe('PaO₂ em mmHg'),
  paco2: z.number().min(20).max(80).describe('PaCO₂ em mmHg'),
  pH: z.number().min(6.8).max(7.8).describe('pH arterial'),
  hco3: z.number().min(10).max(40).optional().describe('HCO3 mEq/L'),
  lactate: z.number().min(0).max(10).optional().describe('Lactato em mmol/L'),
  spo2: z.number().min(60).max(100).describe('Saturação de O₂'),
})

export type GasometryData = z.infer<typeof GasometrySchema>

// Glasgow Coma Scale Schema
export const GlasgowSchema = z.object({
  eyes: z.number().min(1).max(4).describe('Abertura ocular'),
  verbal: z.union([z.number().min(1).max(5), z.literal('T')]).describe('Resposta verbal'),
  motor: z.number().min(1).max(6).describe('Resposta motora'),
})

export type GlasgowData = z.infer<typeof GlasgowSchema>

// Patient Demographics Schema
export const PatientDemographicsSchema = z.object({
  nome: z.string().min(1).max(100),
  idade: z.number().min(0).max(150),
  altura: z.number().min(100).max(250),
  peso: z.number().min(20).max(200),
  sexo: z.enum(['M', 'F']),
  diagnóstico: z.string().optional(),
})

export type PatientDemographics = z.infer<typeof PatientDemographicsSchema>

// Complete Patient Record Schema
export const PatientRecordSchema = z.object({
  id: z.string().uuid(),
  demographics: PatientDemographicsSchema,
  gasometry: GasometrySchema,
  ventilation: VentilationSchema.optional(),
  glasgow: GlasgowSchema.optional(),
  ecg: ECGParametersSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type PatientRecord = z.infer<typeof PatientRecordSchema>

// Safe parsing helpers
export const validateECG = (data: unknown) => ECGParametersSchema.safeParse(data)
export const validateVentilation = (data: unknown) => VentilationSchema.safeParse(data)
export const validateGasometry = (data: unknown) => GasometrySchema.safeParse(data)
export const validateGlasgow = (data: unknown) => GlasgowSchema.safeParse(data)
export const validatePatientRecord = (data: unknown) => PatientRecordSchema.safeParse(data)
