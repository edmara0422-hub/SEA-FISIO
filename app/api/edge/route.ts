import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''

  const response = await fetch('https://api.example.com/search', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`,
    },
  })

  const data = await response.json()

  return NextResponse.json(
    { results: data, timestamp: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    }
  )
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const cached = request.headers.get('X-Cached')
  if (cached === 'true') {
    return NextResponse.json({ fromCache: true, data: body })
  }

  const result = {
    processed: true,
    input: body,
    processedAt: new Date().toISOString(),
    region: request.headers.get('x-vercel-id'),
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=30',
      'X-Processed': 'edge',
    },
  })
}
