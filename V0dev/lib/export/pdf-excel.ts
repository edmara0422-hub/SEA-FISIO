'use server'

import PDFDocument from 'pdfkit'
import ExcelJS from 'exceljs'
import { PatientRecord } from '@/lib/schemas/clinical'

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
  calculations?: Record<string, any>
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument()
      const buffers: Buffer[] = []

      doc.on('data', (chunk) => buffers.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(buffers)))
      doc.on('error', reject)

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('Sistema de Estudo Avançado (SEA)', { align: 'center' })
      doc.fontSize(14).text('Prontuário Eletrônico', { align: 'center' })
      doc.moveDown()

      // Patient Info
      doc.fontSize(12).font('Helvetica-Bold').text('Informações do Paciente')
      doc.fontSize(11).font('Helvetica')
      doc.text(`Nome: ${patientData.name}`)
      doc.text(`Idade: ${patientData.age} anos`)
      doc.text(`Diagnóstico: ${patientData.diagnosis}`)
      doc.text(`Nº Prontuário: ${patientData.recordNumber}`)
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`)
      doc.moveDown()

      // Ventilation Parameters
      if (patientData.ventilation) {
        doc.fontSize(12).font('Helvetica-Bold').text('Parâmetros de Ventilação')
        doc.fontSize(11).font('Helvetica')
        doc.text(`FR: ${patientData.ventilation.fr} ciclos/min`)
        doc.text(`PEEP: ${patientData.ventilation.peep} cmH₂O`)
        doc.text(`Pressão de Pico: ${patientData.ventilation.peakPressure} cmH₂O`)
        doc.text(`Volume Corrente: ${patientData.ventilation.tidalVolume} mL`)
        doc.moveDown()
      }

      // Gasometry
      if (patientData.gasometry) {
        doc.fontSize(12).font('Helvetica-Bold').text('Gasometria Arterial')
        doc.fontSize(11).font('Helvetica')
        doc.text(`PaO₂: ${patientData.gasometry.pao2} mmHg`)
        doc.text(`pH: ${patientData.gasometry.pH.toFixed(2)}`)
        doc.moveDown()
      }

      // Calculations
      if (patientData.calculations) {
        doc.fontSize(12).font('Helvetica-Bold').text('Índices Calculados')
        doc.fontSize(11).font('Helvetica')
        Object.entries(patientData.calculations).forEach(([key, value]) => {
          if (typeof value === 'number') {
            doc.text(`${key}: ${value.toFixed(2)}`)
          }
        })
      }

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

export async function generatePatientExcel(patients: Array<{
  name: string
  age: number
  diagnosis: string
  recordNumber: string
  ventilation?: Record<string, number>
  gasometry?: Record<string, number>
  calculations?: Record<string, number>
}>) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Prontuários')

  // Headers
  const headers = [
    'Prontuário',
    'Paciente',
    'Idade',
    'Diagnóstico',
    'FR',
    'PEEP',
    'Pico (cmH₂O)',
    'VT (mL)',
    'PaO₂',
    'pH',
    'P/F Ratio',
    'RSBI',
    'Compliance',
  ]

  worksheet.addRow(headers)

  // Style headers
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } }

  // Add data rows
  patients.forEach((patient, index) => {
    const row = [
      patient.recordNumber,
      patient.name,
      patient.age,
      patient.diagnosis,
      patient.ventilation?.fr || '-',
      patient.ventilation?.peep || '-',
      patient.ventilation?.peakPressure || '-',
      patient.ventilation?.tidalVolume || '-',
      patient.gasometry?.pao2 || '-',
      patient.gasometry?.pH || '-',
      patient.calculations?.pf || '-',
      patient.calculations?.rsbi || '-',
      patient.calculations?.cest || '-',
    ]

    worksheet.addRow(row)

    // Alternate row colors
    if ((index + 2) % 2 === 0) {
      worksheet.getRow(index + 2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } }
    }
  })

  // Auto-fit columns
  worksheet.columns.forEach((col) => {
    col.width = 15
  })

  // Convert to buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer as Buffer
}

export async function generatePDFReport(reportTitle: string, content: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument()
      const buffers: Buffer[] = []

      doc.on('data', (chunk) => buffers.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(buffers)))
      doc.on('error', reject)

      doc.fontSize(20).font('Helvetica-Bold').text(reportTitle, { align: 'center' })
      doc.fontSize(10).text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'right' })
      doc.moveDown()

      doc.fontSize(11).font('Helvetica').text(content, { align: 'left' })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
