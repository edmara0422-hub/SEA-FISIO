import { NextRequest, NextResponse } from 'next/server'

type ClinicalContext = 'ecg' | 'vm' | 'neuro' | 'clinical'

const allowedContexts: ClinicalContext[] = ['ecg', 'vm', 'neuro', 'clinical']
const MAX_QUERY_CHARS = 1200

const quickKnowledge: Record<ClinicalContext, string[]> = {
    ecg: [
        'P wave normal: 0.08-0.12s.',
        'PR interval normal: 0.12-0.20s.',
        'QRS normal: 0.06-0.10s.',
    ],
    vm: [
        'Volume corrente protetor: 6-8 mL/kg de peso ideal.',
        'Pressao de plato alvo: abaixo de 30 cmH2O.',
        'PEEP deve ser ajustada por oxigenacao e mecanica pulmonar.',
    ],
    neuro: [
        'Ondas alfa: 8-12 Hz em relaxamento vigil.',
        'GCS 3-8 sugere comprometimento neurologico grave.',
        'Interpretar sinais neurofisiologicos junto ao exame clinico.',
    ],
    clinical: [
        'Sempre priorize ABCDE e seguranca do paciente.',
        'Use scores apenas como apoio, nao como decisao isolada.',
        'Reavalie resposta terapeutica em ciclos curtos.',
    ],
}

function parseContext(value: unknown): ClinicalContext {
    if (typeof value !== 'string') return 'clinical'
    return allowedContexts.includes(value as ClinicalContext) ? (value as ClinicalContext) : 'clinical'
}

function normalizeQuery(value: unknown): string {
    if (typeof value !== 'string') return ''
    return value.replace(/\s+/g, ' ').trim().slice(0, MAX_QUERY_CHARS)
}

function isEmergencyLike(query: string): boolean {
    return /(parada|choque|dessatur|hipotens|convuls|coma|rebaix|instabil|emerg)/i.test(query)
}

function safetySuffix(query: string): string {
    const emergencyNotice = isEmergencyLike(query)
        ? '\n\nAlerta: sinais de possivel gravidade. Priorize protocolo de emergencia, monitorizacao continua e equipe presencial.'
        : ''

    return `${emergencyNotice}\n\nSugestao: confirme com protocolo institucional e avaliacao clinica presencial.`
}

function buildResponse(query: string, context: ClinicalContext) {
    const bullets = quickKnowledge[context].map((item) => `- ${item}`).join('\n')
    return `Analise inicial para: "${query}"\n\n${bullets}${safetySuffix(query)}`
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const query = normalizeQuery(body?.query)
        const context = parseContext(body?.context)

        if (!query) {
            return NextResponse.json({ error: 'Campo query obrigatorio.' }, { status: 400 })
        }

        return NextResponse.json({
            response: buildResponse(query, context),
            source: 'assistant-local',
        })
    } catch {
        return NextResponse.json(
            { response: 'Nao foi possivel processar agora. Tente novamente em instantes.' },
            { status: 500 }
        )
    }
}
