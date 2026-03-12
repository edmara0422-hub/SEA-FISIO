'use client'

type GraphQLVariables = Record<string, unknown>

type GraphQLError = {
  message: string
}

type GraphQLResponse<TData> = {
  data: TData | null
  errors?: GraphQLError[]
}

type GraphQLRequest<TVariables extends GraphQLVariables> = {
  query: string
  variables?: TVariables
}

class SimpleGraphQLClient {
  private readonly httpUrl =
    process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql'

  private readonly wsUrl =
    process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql'

  async query<TData, TVariables extends GraphQLVariables = GraphQLVariables>(
    request: GraphQLRequest<TVariables>
  ): Promise<GraphQLResponse<TData>> {
    return this.request<TData, TVariables>(request)
  }

  async mutate<TData, TVariables extends GraphQLVariables = GraphQLVariables>(
    request: GraphQLRequest<TVariables>
  ): Promise<GraphQLResponse<TData>> {
    return this.request<TData, TVariables>(request)
  }

  subscribe<TData, TVariables extends GraphQLVariables = GraphQLVariables>(
    request: GraphQLRequest<TVariables>,
    handlers: {
      next: (data: TData) => void
      error?: (error: unknown) => void
      complete?: () => void
    }
  ) {
    if (typeof WebSocket === 'undefined') {
      handlers.complete?.()
      return { unsubscribe() {} }
    }

    const socket = new WebSocket(this.wsUrl, 'graphql-transport-ws')
    const operationId = `op-${Date.now()}`

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          type: 'connection_init',
          payload: {
            authorization:
              typeof window !== 'undefined' ? `Bearer ${localStorage.getItem('token') || ''}` : '',
          },
        })
      )
    })

    socket.addEventListener('message', (event) => {
      try {
        const payload = JSON.parse(String(event.data)) as {
          type: string
          payload?: { data?: TData; errors?: GraphQLError[] }
        }

        if (payload.type === 'connection_ack') {
          socket.send(
            JSON.stringify({
              id: operationId,
              type: 'subscribe',
              payload: request,
            })
          )
          return
        }

        if (payload.type === 'next' && payload.payload?.data) {
          handlers.next(payload.payload.data)
          return
        }

        if (payload.type === 'error') {
          handlers.error?.(payload.payload?.errors || new Error('GraphQL subscription error'))
          return
        }

        if (payload.type === 'complete') {
          handlers.complete?.()
          socket.close()
        }
      } catch (error) {
        handlers.error?.(error)
      }
    })

    socket.addEventListener('error', (event) => {
      handlers.error?.(event)
    })

    socket.addEventListener('close', () => {
      handlers.complete?.()
    })

    return {
      unsubscribe() {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ id: operationId, type: 'complete' }))
        }
        socket.close()
      },
    }
  }

  private async request<TData, TVariables extends GraphQLVariables = GraphQLVariables>(
    request: GraphQLRequest<TVariables>
  ): Promise<GraphQLResponse<TData>> {
    try {
      const response = await fetch(this.httpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
      })

      const payload = (await response.json()) as {
        data?: TData
        errors?: GraphQLError[]
      }

      return {
        data: payload.data ?? null,
        errors: payload.errors,
      }
    } catch (error) {
      return {
        data: null,
        errors: [
          {
            message: error instanceof Error ? error.message : 'GraphQL request failed',
          },
        ],
      }
    }
  }
}

export const apolloClient = new SimpleGraphQLClient()

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
