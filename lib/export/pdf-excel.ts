'use server'

function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function escapePdfText(value: string): string {
  return normalizeText(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function createPdfBuffer(lines: string[]): Buffer {
  let cursorY = 790
  const content = lines
    .map((line, index) => {
      const fontSize = index === 0 ? 18 : index === 1 ? 12 : 10
      const block = [
        'BT',
        `/F1 ${fontSize} Tf`,
        `1 0 0 1 48 ${cursorY} Tm`,
        `(${escapePdfText(line)}) Tj`,
        'ET',
      ].join('\n')

      cursorY -= index === 0 ? 28 : 16
      return block
    })
    .join('\n')

  const streamObject = `5 0 obj\n<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream\nendobj`
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
    streamObject,
  ]

  let document = '%PDF-1.4\n'
  const offsets: number[] = []

  for (const object of objects) {
    offsets.push(Buffer.byteLength(document, 'utf8'))
    document += `${object}\n`
  }

  const xrefOffset = Buffer.byteLength(document, 'utf8')
  document += `xref\n0 ${objects.length + 1}\n`
  document += '0000000000 65535 f \n'
  document += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')
  document += `\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return Buffer.from(document, 'utf8')
}

function escapeCsvValue(value: string | number): string {
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export async function generatePatientPDF(patientData: {
  name: string
  age: number
  diagnosis: string
  recordNumber: string
  ventilation?: {
    fr: number
    peep: number
    peakPressure: number
    tidalVolume: number
  }
  gasometry?: {
    pao2: number
    pH: number
  }
  calculations?: Record<string, number | string | null | undefined>
}): Promise<Buffer> {
  const lines = [
    'Sistema de Estudo Avancado (SEA)',
    'Prontuario Eletronico',
    `Nome: ${patientData.name}`,
    `Idade: ${patientData.age} anos`,
    `Diagnostico: ${patientData.diagnosis}`,
    `Prontuario: ${patientData.recordNumber}`,
    `Data: ${new Date().toLocaleDateString('pt-BR')}`,
  ]

  if (patientData.ventilation) {
    lines.push('Parametros de Ventilacao')
    lines.push(`FR: ${patientData.ventilation.fr} ciclos/min`)
    lines.push(`PEEP: ${patientData.ventilation.peep} cmH2O`)
    lines.push(`Pico: ${patientData.ventilation.peakPressure} cmH2O`)
    lines.push(`VT: ${patientData.ventilation.tidalVolume} mL`)
  }

  if (patientData.gasometry) {
    lines.push('Gasometria Arterial')
    lines.push(`PaO2: ${patientData.gasometry.pao2} mmHg`)
    lines.push(`pH: ${patientData.gasometry.pH.toFixed(2)}`)
  }

  if (patientData.calculations) {
    lines.push('Indices Calculados')
    for (const [key, value] of Object.entries(patientData.calculations)) {
      if (value != null) {
        lines.push(`${key}: ${value}`)
      }
    }
  }

  return createPdfBuffer(lines)
}

export async function generatePatientExcel(
  patients: Array<{
    name: string
    age: number
    diagnosis: string
    recordNumber: string
    ventilation?: Record<string, number>
    gasometry?: Record<string, number>
    calculations?: Record<string, number>
  }>
) {
  const headers = [
    'Prontuario',
    'Paciente',
    'Idade',
    'Diagnostico',
    'FR',
    'PEEP',
    'Pico (cmH2O)',
    'VT (mL)',
    'PaO2',
    'pH',
    'P/F Ratio',
    'RSBI',
    'Compliance',
  ]

  const rows = patients.map((patient) => [
    patient.recordNumber,
    patient.name,
    patient.age,
    patient.diagnosis,
    patient.ventilation?.fr ?? '-',
    patient.ventilation?.peep ?? '-',
    patient.ventilation?.peakPressure ?? '-',
    patient.ventilation?.tidalVolume ?? '-',
    patient.gasometry?.pao2 ?? '-',
    patient.gasometry?.pH ?? '-',
    patient.calculations?.pf ?? '-',
    patient.calculations?.rsbi ?? '-',
    patient.calculations?.cest ?? '-',
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(','))
    .join('\n')

  return Buffer.from(csv, 'utf8')
}

export async function generatePDFReport(reportTitle: string, content: string): Promise<Buffer> {
  const lines = [
    reportTitle,
    `Data: ${new Date().toLocaleDateString('pt-BR')}`,
    ...content.split('\n').filter(Boolean),
  ]

  return createPdfBuffer(lines)
}
