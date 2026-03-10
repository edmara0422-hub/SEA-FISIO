import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql',
    connectionParams: () => ({
      authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
    }),
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
    query: { fetchPolicy: 'network-only' },
  },
})

export interface PatientData {
  id: string
  name: string
  age: number
  parameters: Record<string, number>
}

export interface VMCalculation {
  id: string
  patientId: string
  dp: number
  compliance: number
  rsbi: number
  pf: number
}

export const PATIENT_SUBSCRIPTION = `
  subscription OnPatientUpdate($id: ID!) {
    patientUpdated(id: $id) {
      id
      name
      parameters
      lastUpdate
    }
  }
`

export const VM_CALCULATION_SUBSCRIPTION = `
  subscription OnVMCalculation($patientId: ID!) {
    vmCalculationUpdated(patientId: $patientId) {
      id
      dp
      compliance
      rsbi
      pf
      timestamp
    }
  }
`

export const GET_PATIENT = `
  query GetPatient($id: ID!) {
    patient(id: $id) {
      id
      name
      age
      parameters
      records {
        id
        type
        createdAt
      }
    }
  }
`

export const UPDATE_PATIENT = `
  mutation UpdatePatient($id: ID!, $input: PatientInput!) {
    updatePatient(id: $id, input: $input) {
      id
      name
      parameters
    }
  }
`

export const CALCULATE_VM = `
  mutation CalculateVM($patientId: ID!, $params: VMParams!) {
    calculateVMIndices(patientId: $patientId, params: $params) {
      id
      dp
      compliance
      rsbi
      pf
      recommendations
    }
  }
`
