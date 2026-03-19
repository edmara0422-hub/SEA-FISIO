'use server'

import { Pinecone } from '@pinecone-database/pinecone'
import { pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY ?? '',
})

const index = pinecone.Index(process.env.PINECONE_INDEX || 'sea-knowledge')

// Singleton — model loads once per server process, not on every call
let _embedder: FeatureExtractionPipeline | null = null
async function getEmbedder() {
  if (!_embedder) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _embedder = (await (pipeline as any)('feature-extraction', 'Xenova/all-MiniLM-L6-v2')) as FeatureExtractionPipeline
  }
  return _embedder
}

const clinicalDocuments = [
  'Ventilação mecânica protetora com volumes de 6-8 mL/kg',
  'PEEP otimizado baseado em complacência dinâmica',
  'Monitoramento contínuo de pressão de platô',
  'Estratégia de desmame com índice RSBI',
  'Glasgow coma scale para avaliação neurológica',
  'Síndrome do desconforto respiratório do adulto (SDRA)',
  'Síndrome de choque séptico e manejo multimodal',
  'Nutrição enteral em pacientes críticos',
  'Profilaxia de tromboembolismo pulmonar',
  'Manejo de analgesia e sedação em UTI',
]

export interface SemanticSearchResult {
  id: string
  content: string
  score: number
  metadata: Record<string, unknown>
}

export async function indexClinicalDocuments() {
  try {
    const embedder = await getEmbedder()

    const vectors = await Promise.all(
      clinicalDocuments.map(async (doc, idx) => {
        const embedding = await embedder(doc, { pooling: 'mean', normalize: true })
        return {
          id: `doc-${idx}`,
          values: Array.from(embedding.data) as number[],
          metadata: { text: doc, type: 'clinical' },
        }
      })
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (index.upsert as any)(vectors)
    console.log('[v0] Indexed', vectors.length, 'clinical documents to Pinecone')
  } catch (error) {
    console.error('[v0] Indexing error:', error)
  }
}

export async function semanticSearch(query: string, topK = 5): Promise<SemanticSearchResult[]> {
  try {
    const embedder = await getEmbedder()
    const queryEmbedding = await embedder(query, { pooling: 'mean', normalize: true })

    const results = await index.query({
      vector: Array.from(queryEmbedding.data),
      topK,
      includeMetadata: true,
    })

    return results.matches.map((match) => ({
      id: match.id,
      content: String(match.metadata?.text ?? ''),
      score: match.score || 0,
      metadata: match.metadata || {},
    }))
  } catch (error) {
    console.error('[v0] Search error:', error)
    return []
  }
}

export async function searchClinicalProtocol(symptom: string): Promise<string> {
  const results = await semanticSearch(`Protocolo para ${symptom}`, 3)

  if (results.length === 0) {
    return 'Nenhum protocolo encontrado'
  }

  return results
    .map((r, idx) => `${idx + 1}. ${r.content} (relevância: ${(r.score * 100).toFixed(1)}%)`)
    .join('\n')
}

export async function findSimilarCases(caseDescription: string): Promise<SemanticSearchResult[]> {
  return semanticSearch(`Caso clínico: ${caseDescription}`, 5)
}
