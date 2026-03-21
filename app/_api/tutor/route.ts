import { NextRequest, NextResponse } from 'next/server'

const MODULE_CONTEXT: Record<string, string> = {
  M1: 'fisioterapia neurológica — plasticidade neural, mapas corticais, reabilitação pós-AVC, avaliação neurológica',
  M2: 'fisioterapia respiratória e ventilação mecânica — parâmetros ventilatórios, mecânica pulmonar, desmame',
  M3: 'fisioterapia cardiovascular — ECG, hemodinâmica, reabilitação cardíaca, exercício supervisionado',
}

export async function POST(req: NextRequest) {
  try {
    const { selectedText, question, topicTitle, moduleId, history = [] } = await req.json()

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Pergunta obrigatória' }, { status: 400 })
    }

    const moduleContext = MODULE_CONTEXT[moduleId] ?? 'fisioterapia clínica'

    // Try real Claude API if key is available
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (apiKey) {
      const Anthropic = (await import('@anthropic-ai/sdk')).default
      const client = new Anthropic({ apiKey })

      const systemPrompt = `Você é um tutor especializado em ${moduleContext}.
O aluno está estudando o tópico: "${topicTitle}".
${selectedText ? `\nTrecho selecionado pelo aluno:\n"${selectedText}"\n` : ''}
Explique de forma clara, com linguagem clínica acessível, usando exemplos práticos da fisioterapia quando possível.
Seja conciso (máximo 4 parágrafos). Não repita o enunciado da pergunta.`

      const messages = [
        ...history.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: question },
      ]

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: systemPrompt,
        messages,
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      return NextResponse.json({ response: text, source: 'claude' })
    }

    // Fallback — local response when no API key
    const fallback = buildFallback(question, topicTitle, moduleId)
    return NextResponse.json({ response: fallback, source: 'local' })
  } catch (err) {
    console.error('[tutor]', err)
    return NextResponse.json(
      { response: 'Não foi possível responder agora. Tente novamente em instantes.' },
      { status: 500 }
    )
  }
}

function buildFallback(question: string, topicTitle: string, moduleId: string): string {
  return `Sobre "${topicTitle}" (${moduleId}): sua pergunta — "${question.slice(0, 80)}" — é relevante para a prática clínica.\n\nPara aprofundar, consulte as referências do módulo e os protocolos institucionais. A simulação interativa do módulo pode ajudar a visualizar os conceitos.\n\n_(Tutor com IA completo disponível com chave ANTHROPIC_API_KEY configurada)_`
}
