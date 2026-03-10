import * as LaunchDarkly from '@launchdarkly/node-server-sdk'

const client = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY || '')

export interface FeatureContext {
  kind: 'user' | 'organization'
  key: string
  name?: string
  email?: string
  custom?: Record<string, unknown>
}

export async function getFeatureFlag(flagKey: string, context: FeatureContext, defaultValue = false) {
  try {
    const value = await client.boolVariation(flagKey, context, defaultValue)
    return value
  } catch (error) {
    console.error('[v0] Feature flag error:', error)
    return defaultValue
  }
}

export async function getFeatureFlagVariant(flagKey: string, context: FeatureContext, defaultValue: string) {
  try {
    const value = await client.stringVariation(flagKey, context, defaultValue)
    return value
  } catch (error) {
    console.error('[v0] Feature flag error:', error)
    return defaultValue
  }
}

export async function trackEvent(
  context: FeatureContext,
  eventName: string,
  data?: Record<string, unknown>
) {
  try {
    client.track(eventName, context, 1, data)
  } catch (error) {
    console.error('[v0] Event tracking error:', error)
  }
}

export const FEATURE_FLAGS = {
  aiAssistant: 'ai-assistant-enabled',
  realTimeCollab: 'real-time-collaboration',
  advancedReports: 'advanced-reports',
  betaFeatures: 'beta-features-enabled',
  experimentalUI: 'experimental-ui',
  graphqlAPI: 'graphql-api-enabled',
  edgeFunctions: 'edge-functions-enabled',
  darkMode: 'dark-mode',
} as const

export async function isFeatureEnabled(
  featureName: keyof typeof FEATURE_FLAGS,
  userId: string
) {
  const context: FeatureContext = {
    kind: 'user',
    key: userId,
  }

  return getFeatureFlag(FEATURE_FLAGS[featureName], context, false)
}

export async function getExperimentVariant(userId: string, experimentKey: string) {
  const context: FeatureContext = {
    kind: 'user',
    key: userId,
    custom: { timestamp: Date.now() },
  }

  return getFeatureFlagVariant(experimentKey, context, 'control')
}

export async function recordFeatureUsage(userId: string, featureName: string) {
  const context: FeatureContext = {
    kind: 'user',
    key: userId,
  }

  await trackEvent(context, `feature_used`, { feature: featureName })
}

export async function getVariantCount(flagKey: string): Promise<number> {
  try {
    const flag = await client.variation(flagKey, { kind: 'user', key: 'anonymous' }, null)
    return flag ? 1 : 0
  } catch (error) {
    console.error('[v0] Variant count error:', error)
    return 0
  }
}

export const features = {
  aiAssistantEnabled: async (userId: string) =>
    isFeatureEnabled('aiAssistant', userId),
  realTimeCollabEnabled: async (userId: string) =>
    isFeatureEnabled('realTimeCollab', userId),
  advancedReportsEnabled: async (userId: string) =>
    isFeatureEnabled('advancedReports', userId),
  betaFeaturesEnabled: async (userId: string) =>
    isFeatureEnabled('betaFeatures', userId),
  experimentalUIEnabled: async (userId: string) =>
    isFeatureEnabled('experimentalUI', userId),
  graphqlAPIEnabled: async (userId: string) =>
    isFeatureEnabled('graphqlAPI', userId),
}
