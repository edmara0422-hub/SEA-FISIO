'use client'

import * as Sentry from '@sentry/nextjs'
import posthog from 'posthog-js'

export function initializeMonitoring() {
  // Sentry - Error Tracking
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      denyUrls: [
        // Browser extensions
        /extensions\//i,
        /^chrome:\/\//i,
      ],
    })
  }

  // PostHog - Analytics
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY && typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      session_recording: {
        maskAllInputs: true,
      },
    })
  }
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  // PostHog
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(eventName, properties)
  }

  // Sentry
  Sentry.captureMessage(eventName, 'info', { tags: properties })
}

export function captureException(error: Error, context?: Record<string, any>) {
  // Sentry
  Sentry.captureException(error, {
    contexts: { additional: context },
  })

  // PostHog
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture('error', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...context,
    })
  }
}

export function setUserContext(userId: string, properties?: Record<string, any>) {
  // Sentry
  Sentry.setUser({
    id: userId,
    ...properties,
  })

  // PostHog
  if (typeof window !== 'undefined' && posthog) {
    posthog.identify(userId, properties)
  }
}

export function trackVMCalculation(params: {
  fr: number
  peep: number
  peakPressure: number
  hasAlerts: boolean
}) {
  trackEvent('vm_calculation', {
    fr: params.fr,
    peep: params.peep,
    peak_pressure: params.peakPressure,
    has_critical_alerts: params.hasAlerts,
  })
}

export function trackPatientCreated(diagnosis: string) {
  trackEvent('patient_created', {
    diagnosis,
    timestamp: new Date().toISOString(),
  })
}

export function trackExportAction(format: 'pdf' | 'excel') {
  trackEvent('export_action', {
    format,
    timestamp: new Date().toISOString(),
  })
}

export function trackPageView(page: string) {
  trackEvent('page_view', { page })
}
