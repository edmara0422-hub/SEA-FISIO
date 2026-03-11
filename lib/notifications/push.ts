// Tipos de alertas críticos
export interface CriticalAlert {
  id: string
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  parameter: string
  value: number
  normalRange: [number, number]
  action: 'none' | 'adjust' | 'contact-doctor'
  timestamp: number
}

export const CRITICAL_THRESHOLDS = {
  PF_RATIO: {
    normal: [300, Infinity],
    moderate: [100, 300],
    severe: [0, 100],
  },
  RSBI: {
    favorable: [0, 80],
    intermediate: [80, 105],
    unfavorable: [105, Infinity],
  },
  PEEP: {
    low: [0, 5],
    optimal: [5, 15],
    high: [15, Infinity],
  },
  PLATEAU_PRESSURE: {
    safe: [0, 30],
    borderline: [30, 35],
    unsafe: [35, Infinity],
  },
  MECHANICAL_POWER: {
    safe: [0, 17],
    borderline: [17, 20],
    harmful: [20, Infinity],
  },
  ROX: {
    success: [4.88, Infinity],
    intermediate: [3, 4.88],
    failure: [0, 3],
  },
}

export function checkCriticalValues(params: {
  pf?: number
  rsbi?: number
  peep?: number
  platoPressure?: number
  mecPower?: number
  rox?: number
}): CriticalAlert[] {
  const alerts: CriticalAlert[] = []

  if (params.pf !== undefined) {
    if (params.pf < 100) {
      alerts.push({
        id: `pf-${Date.now()}`,
        title: 'P/F Crítico',
        message: `P/F = ${params.pf.toFixed(0)} (< 100) - SDRA Grave`,
        severity: 'critical',
        parameter: 'P/F Ratio',
        value: params.pf,
        normalRange: [300, Infinity],
        action: 'contact-doctor',
        timestamp: Date.now(),
      })
    } else if (params.pf < 300) {
      alerts.push({
        id: `pf-${Date.now()}`,
        title: 'P/F Moderado',
        message: `P/F = ${params.pf.toFixed(0)} (100-300) - SDRA Moderada`,
        severity: 'high',
        parameter: 'P/F Ratio',
        value: params.pf,
        normalRange: [300, Infinity],
        action: 'adjust',
        timestamp: Date.now(),
      })
    }
  }

  if (params.rsbi !== undefined) {
    if (params.rsbi > 105) {
      alerts.push({
        id: `rsbi-${Date.now()}`,
        title: 'RSBI Desfavorável',
        message: `RSBI = ${params.rsbi.toFixed(1)} (> 105) - Desmame improvável`,
        severity: 'medium',
        parameter: 'RSBI Index',
        value: params.rsbi,
        normalRange: [0, 80],
        action: 'none',
        timestamp: Date.now(),
      })
    }
  }

  if (params.platoPressure !== undefined && params.platoPressure > 30) {
    alerts.push({
      id: `plat-${Date.now()}`,
      title: 'Pressão de Platô Elevada',
      message: `Pressão de platô = ${params.platoPressure} cmH₂O (> 30) - Risco de barotrauma`,
      severity: 'high',
      parameter: 'Plateau Pressure',
      value: params.platoPressure,
      normalRange: [0, 30],
      action: 'adjust',
      timestamp: Date.now(),
    })
  }

  if (params.mecPower !== undefined && params.mecPower > 20) {
    alerts.push({
      id: `pwr-${Date.now()}`,
      title: 'Potência Mecânica Elevada',
      message: `Potência = ${params.mecPower.toFixed(2)} J/min (> 20) - Lesão pulmonar aumentada`,
      severity: 'high',
      parameter: 'Mechanical Power',
      value: params.mecPower,
      normalRange: [0, 17],
      action: 'adjust',
      timestamp: Date.now(),
    })
  }

  if (params.rox !== undefined && params.rox < 3) {
    alerts.push({
      id: `rox-${Date.now()}`,
      title: 'ROX Crítico',
      message: `ROX = ${params.rox.toFixed(2)} (< 3) - Falha prevista com CPAP`,
      severity: 'critical',
      parameter: 'ROX Index',
      value: params.rox,
      normalRange: [4.88, Infinity],
      action: 'contact-doctor',
      timestamp: Date.now(),
    })
  }

  return alerts
}

export async function sendWebPushNotification(
  alert: CriticalAlert,
  subscription?: PushSubscription
): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.error('Web Push não suportado neste navegador')
    return false
  }

  try {
    if (!subscription) {
      const registration = await navigator.serviceWorker.ready
      subscription = await registration.pushManager.getSubscription()
    }

    if (!subscription) {
      console.error('Nenhuma subscription de push disponível')
      return false
    }

    // Aqui você enviaria para seu servidor que dispara o push
    // Por exemplo: POST /api/push-notification
    const response = await fetch('/api/push-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        tag: alert.parameter,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Erro ao enviar Web Push:', error)
    return false
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    console.error('Service Workers não suportados')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    console.error('Notificações foram negadas pelo usuário')
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    // Salvar subscription no servidor
    await fetch('/api/push-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })

    return subscription
  } catch (error) {
    console.error('Erro ao subscribir em notificações:', error)
    return null
  }
}
