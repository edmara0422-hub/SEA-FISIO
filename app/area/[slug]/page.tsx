import { AreaPageClient } from './area-client'

export function generateStaticParams() {
  return [
    { slug: 'fisioterapia' },
    { slug: 'marketing' },
    { slug: 'neurologia' },
  ]
}

export default function AreaPage() {
  return <AreaPageClient />
}
