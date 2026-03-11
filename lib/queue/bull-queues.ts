import Queue from 'bull'

const redis = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
}

export const vmCalculationQueue = new Queue('vm-calculations', redis)
export const reportGenerationQueue = new Queue('report-generation', redis)
export const notificationQueue = new Queue('notifications', redis)
export const aiAnalysisQueue = new Queue('ai-analysis', redis)

vmCalculationQueue.process(async (job) => {
  console.log('[v0] Processing VM calculation:', job.id)
  const { patientId, parameters } = job.data

  try {
    const result = await performVMCalculation(patientId, parameters)
    job.progress(100)
    return result
  } catch (error) {
    throw error
  }
})

reportGenerationQueue.process(async (job) => {
  console.log('[v0] Generating report:', job.id)
  const { patientId, type } = job.data

  try {
    const report = await generateReport(patientId, type)
    job.progress(100)
    return report
  } catch (error) {
    throw error
  }
})

notificationQueue.process(async (job) => {
  console.log('[v0] Sending notification:', job.id)
  const { userId, message, type } = job.data

  try {
    await sendNotification(userId, message, type)
    job.progress(100)
  } catch (error) {
    throw error
  }
})

aiAnalysisQueue.process(async (job) => {
  console.log('[v0] Analyzing with AI:', job.id)
  const { query, context } = job.data

  try {
    const analysis = await performAIAnalysis(query, context)
    job.progress(100)
    return analysis
  } catch (error) {
    throw error
  }
})

export async function enqueueVMCalculation(patientId: string, parameters: Record<string, number>) {
  return vmCalculationQueue.add({ patientId, parameters }, { attempts: 3, backoff: 'exponential' })
}

export async function enqueueReportGeneration(patientId: string, type: 'pdf' | 'excel') {
  return reportGenerationQueue.add(
    { patientId, type },
    { attempts: 3, backoff: 'exponential', priority: 5 }
  )
}

export async function enqueueNotification(userId: string, message: string, type: 'alert' | 'info') {
  return notificationQueue.add({ userId, message, type }, { attempts: 2 })
}

export async function enqueueAIAnalysis(query: string, context: unknown) {
  return aiAnalysisQueue.add({ query, context }, { attempts: 5, backoff: 'exponential' })
}

async function performVMCalculation(patientId: string, parameters: Record<string, number>) {
  return { patientId, parameters, calculatedAt: new Date() }
}

async function generateReport(patientId: string, type: string) {
  return { patientId, type, generatedAt: new Date() }
}

async function sendNotification(userId: string, message: string, type: string) {
  console.log(`[v0] Notification to ${userId}: ${message}`)
}

async function performAIAnalysis(query: string, context: unknown) {
  return { query, context, analyzedAt: new Date() }
}

vmCalculationQueue.on('completed', (job) => {
  console.log(`[v0] VM calculation ${job.id} completed`)
})

vmCalculationQueue.on('failed', (job, err) => {
  console.error(`[v0] VM calculation ${job.id} failed:`, err.message)
})
