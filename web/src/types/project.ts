export type ProjectStatus = 'open' | 'in-progress' | 'closed'
export type MajorTag = 'cs' | 'film' | 'business' | 'comdes'

export interface Project {
  id: string
  title: string
  description: string
  ownerName: string
  majors: MajorTag[]
  tags: string[]
  status: ProjectStatus
  spotsTotal: number
  spotsFilled: number
  createdAt: string
}

export interface ProjectsPage {
  projects: Project[]
  total: number
  page: number
  hasMore: boolean
}
