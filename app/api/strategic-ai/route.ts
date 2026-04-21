import { NextRequest, NextResponse } from 'next/server'

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'

const PHASE_LABELS: Record<string, string> = {
  f1: 'F1 · Infra — Infraestrutura básica digital instalada',
  f2: 'F2 · Processo — Processos internos digitalizados',
  f3: 'F3 · Estratégia — Tecnologia como vantagem competitiva',
  f4: 'F4 · Digitização — Dados e produtos digitais ativos',
  f5: 'F5 · Digitalização — Modelo de negócio digital-first',
  f6: 'F6 · Transformação — Empresa reinventada pela tecnologia',
}

export async function POST(req: NextRequest) {
  const GROQ_KEY = process.env.GROQ_API_KEY
  if (!GROQ_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 })
  }

  let body: { metrics?: Record<string, unknown>; phase?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Body inválido' }, { status: 400 }) }

  const { metrics = {}, phase = 'f1' } = body

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  const prompt = `Você é advisor estratégico especialista em produtos SaaS de saúde no Brasil, com foco em crescimento de startups clínicas em early stage.

PRODUTO: SEA FISIO
Descrição: App clínico para fisioterapeutas intensivistas — prontuário eletrônico de UTI, calculadoras de ventilação mecânica, simulações 3D, analytics clínico.
Fundadora: Edmara Rocha
Data de hoje: ${today}

MÉTRICAS REAIS (Supabase):
- Usuários cadastrados: ${metrics.totalUsers ?? 0}
- Usuários ativos última semana: ${metrics.activeWeek ?? 0}
- Retenção 7 dias: ${metrics.retention7d ?? 0}%
- NPS: ${metrics.nps ?? 'não coletado ainda'}
- Assinaturas ativas: ${metrics.subsActive ?? 0}

FASE DE MATURIDADE DIGITAL ATUAL: ${PHASE_LABELS[phase as string] ?? phase}

STACK VERIFICADO: Next.js 16 + Supabase + Vercel + Tailwind + React Three Fiber (simulações 3D)

Regras de análise:
1. Seja ESPECÍFICO com os números reais — não genérico
2. Com 0 usuários, o único problema que importa é aquisição — diga isso sem rodeios
3. Com poucos usuários mas sem retenção, foco é engajamento antes de escala
4. NPS não coletado = ponto cego crítico para decisões de produto
5. Cada ação deve ser executável esta semana, não um objetivo de trimestre
6. O bloqueio deve ser honesto e direto — o que realmente está impedindo o crescimento

Gere um briefing estratégico diário em português brasileiro (PT-BR).

Responda SOMENTE com JSON válido, sem markdown, sem texto antes ou depois:
{
  "foco": "headline direto sobre o que importa AGORA — mencione os números reais, máximo 2 frases",
  "diretiva": "instrução de O QUE FAZER HOJE — ação concreta e específica para a situação real, 2-4 frases",
  "acoes": [
    "ação 1 — específica, mensurável, executável esta semana",
    "ação 2 — específica, mensurável, executável esta semana",
    "ação 3 — específica, mensurável, executável esta semana"
  ],
  "bloqueio": "o obstáculo real a remover — direto, honesto, sem eufemismos, 1-2 frases",
  "sinal": "sinal concreto e mensurável de progresso — com número sempre que possível"
}`

  try {
    const res = await fetch(GROQ_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.65,
        max_tokens: 900,
        response_format: { type: 'json_object' },
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Groq error:', text)
      return NextResponse.json({ error: 'Groq API error' }, { status: 502 })
    }

    const data = await res.json()
    const content: string = data.choices?.[0]?.message?.content ?? ''

    // Parse JSON — with response_format:json_object it should already be JSON
    let directive: unknown
    try {
      directive = JSON.parse(content)
    } catch {
      const match = content.match(/\{[\s\S]*\}/)
      if (!match) return NextResponse.json({ error: 'Resposta inválida da IA' }, { status: 500 })
      directive = JSON.parse(match[0])
    }

    return NextResponse.json(directive)
  } catch (e) {
    console.error('strategic-ai error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
