export type Slide = {
  title: string
  bullets: string[]
  highlight?: string
}

export type ContentBlock =
  | { id: string; type: 'text';       title?: string; body: string }
  | { id: string; type: 'video';      title: string; url: string; thumbnail?: string; duration?: string }
  | { id: string; type: 'simulation'; title: string; simulationId: string; description?: string }
  | { id: string; type: 'attachment'; title: string; url: string; fileType: string }
  | { id: string; type: 'protocol';   title: string; steps: string[] }
  | { id: string; type: 'slides';     title: string; slides: Slide[] }

export type CadernoTopic = {
  id: string
  title: string
  blocks: ContentBlock[]
}

export type CadernoModuleContent = {
  moduleId: string
  topics: CadernoTopic[]
}

export type TutorMessage = {
  role: 'user' | 'assistant'
  content: string
}
