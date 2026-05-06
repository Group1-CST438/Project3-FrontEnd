import type { Project, ProjectsPage } from '@/types/project'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Campus Navigator App',
    description:
      "A mobile app that helps new students navigate City Tech's campus with indoor wayfinding, event listings, and real-time accessibility updates.",
    ownerName: 'Alex Rivera',
    majors: ['cs', 'comdes'],
    tags: ['mobile', 'react-native', 'maps'],
    status: 'open',
    spotsTotal: 4,
    spotsFilled: 1,
    createdAt: '2026-04-20T12:00:00Z',
  },
  {
    id: '2',
    title: 'City Tech Documentary: The Commuter',
    description:
      'A short documentary exploring the lives of City Tech students who commute two hours each way — their sacrifices, resilience, and dreams.',
    ownerName: 'Maya Chen',
    majors: ['film'],
    tags: ['documentary', 'storytelling', 'interview'],
    status: 'open',
    spotsTotal: 5,
    spotsFilled: 2,
    createdAt: '2026-04-18T09:00:00Z',
  },
  {
    id: '3',
    title: 'TutorLink — Peer Tutoring Platform',
    description:
      'A web platform connecting City Tech students who need tutoring with peers who can help. Features scheduling, ratings, and session tracking.',
    ownerName: 'Jordan Kim',
    majors: ['cs', 'business'],
    tags: ['web', 'nextjs', 'education', 'startup'],
    status: 'open',
    spotsTotal: 6,
    spotsFilled: 3,
    createdAt: '2026-04-15T14:00:00Z',
  },
  {
    id: '4',
    title: 'CUNY Green Brand Identity System',
    description:
      'Designing a cohesive brand identity for a student-led sustainability initiative at CUNY, including logo, typography, color system, and motion guidelines.',
    ownerName: 'Sofia Patel',
    majors: ['comdes'],
    tags: ['branding', 'identity', 'sustainability', 'figma'],
    status: 'open',
    spotsTotal: 3,
    spotsFilled: 1,
    createdAt: '2026-04-12T11:00:00Z',
  },
  {
    id: '5',
    title: 'Campus Event Management System',
    description:
      'A full-stack platform for managing and discovering campus events, club meetings, and study sessions with notifications and RSVP tracking.',
    ownerName: 'Daniel Torres',
    majors: ['cs'],
    tags: ['fullstack', 'typescript', 'events', 'postgres'],
    status: 'in-progress',
    spotsTotal: 4,
    spotsFilled: 3,
    createdAt: '2026-03-28T10:00:00Z',
  },
  {
    id: '6',
    title: 'Social Media Strategy: Local NYC Businesses',
    description:
      'Developing a multi-platform social media campaign for 3 local Brooklyn businesses to increase their digital reach and community engagement.',
    ownerName: 'Priya Williams',
    majors: ['comdes', 'business'],
    tags: ['marketing', 'instagram', 'content', 'strategy'],
    status: 'open',
    spotsTotal: 4,
    spotsFilled: 2,
    createdAt: '2026-04-10T16:00:00Z',
  },
  {
    id: '7',
    title: 'AR Art Installation: City as Canvas',
    description:
      'An augmented reality experience overlaying digital artwork on 5 City Tech campus locations, viewable via mobile. Blends tech and visual storytelling.',
    ownerName: 'Marcus Johnson',
    majors: ['cs', 'film', 'comdes'],
    tags: ['ar', 'creative-tech', 'three.js', 'art'],
    status: 'open',
    spotsTotal: 6,
    spotsFilled: 2,
    createdAt: '2026-04-22T08:00:00Z',
  },
  {
    id: '8',
    title: 'Career Paths in STEM Podcast',
    description:
      'A podcast series interviewing City Tech alumni about their careers in STEM, produced and distributed on Spotify, Apple Podcasts, and YouTube.',
    ownerName: 'Aisha Morgan',
    majors: ['film', 'business'],
    tags: ['podcast', 'audio', 'production', 'interviews'],
    status: 'open',
    spotsTotal: 4,
    spotsFilled: 1,
    createdAt: '2026-04-08T13:00:00Z',
  },
  {
    id: '9',
    title: 'Student Portal UX Redesign',
    description:
      'Redesigning the City Tech student portal with modern UX principles — improving navigation, mobile responsiveness, and accessibility for 18,000+ students.',
    ownerName: 'Leo Chang',
    majors: ['comdes', 'cs'],
    tags: ['ux', 'figma', 'accessibility', 'research'],
    status: 'in-progress',
    spotsTotal: 5,
    spotsFilled: 4,
    createdAt: '2026-03-15T09:00:00Z',
  },
  {
    id: '10',
    title: 'Brooklyn Startup Case Competition',
    description:
      'Organizing and documenting a startup pitch competition for CUNY students, with industry judges, prizes, and a produced highlight reel.',
    ownerName: 'Nadia Foster',
    majors: ['business', 'film'],
    tags: ['startup', 'pitch', 'competition', 'event'],
    status: 'open',
    spotsTotal: 8,
    spotsFilled: 4,
    createdAt: '2026-04-25T15:00:00Z',
  },
  {
    id: '11',
    title: 'Open Source CLI for Dev Environments',
    description:
      'Building an open-source command-line tool that helps developers manage multiple project environments. Contributing to an existing GitHub repo.',
    ownerName: 'Sam Ortiz',
    majors: ['cs'],
    tags: ['cli', 'open-source', 'golang', 'devtools'],
    status: 'open',
    spotsTotal: 3,
    spotsFilled: 1,
    createdAt: '2026-04-17T12:00:00Z',
  },
  {
    id: '12',
    title: 'Sustainability Impact Report Design',
    description:
      'Designing an annual sustainability impact report for a NYC nonprofit — infographics, data visualization, and 40-page editorial layout in print and digital.',
    ownerName: 'Emma Liu',
    majors: ['comdes', 'business'],
    tags: ['print', 'infographic', 'editorial', 'nonprofit'],
    status: 'closed',
    spotsTotal: 3,
    spotsFilled: 3,
    createdAt: '2026-03-01T10:00:00Z',
  },
]

function mapBackendProject(p: BackendProject): Project {
  return {
    id: p.id,
    title: p.title,
    description: p.generalDescription ?? '',
    ownerName: p.userId ?? 'Unknown',
    majors: [],
    tags: p.type ? p.type.split(', ').filter(Boolean) : [],
    status: 'open',
    spotsTotal: 0,
    spotsFilled: 0,
    createdAt: new Date().toISOString(),
  }
}

export async function fetchProjects(page = 1, pageSize = 9): Promise<ProjectsPage> {
  const paginate = (all: Project[]) => {
    const start = (page - 1) * pageSize
    return {
      projects: all.slice(start, start + pageSize),
      total: all.length,
      page,
      hasMore: start + pageSize < all.length,
    }
  }

  if (!API_BASE) {
    await new Promise((r) => setTimeout(r, 600))
    return paginate(MOCK_PROJECTS)
  }

  try {
    const res = await fetch(`${API_BASE}/projects`)
    if (!res.ok) throw new Error(`${res.status}`)
    const raw = await res.json()
    const all: Project[] = Array.isArray(raw)
      ? raw.map(mapBackendProject)
      : (raw as ProjectsPage).projects ?? []
    return paginate(all.length > 0 ? all : MOCK_PROJECTS)
  } catch {
    return paginate(MOCK_PROJECTS)
  }
}

export async function expressInterest(projectId: string): Promise<void> {
  if (!API_BASE) return
  const res = await fetch(`${API_BASE}/projects/${projectId}/interest`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to express interest')
}

export async function passProject(projectId: string): Promise<void> {
  if (!API_BASE) return
  const res = await fetch(`${API_BASE}/projects/${projectId}/pass`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to pass project')
}

// ── Project CRUD ────────────────────────────────────────────────────────────

export interface BackendProject {
  id: string
  userId: string | null
  title: string
  generalDescription: string | null
  type: string | null
  county: string | null
}

export async function getProjects(): Promise<BackendProject[]> {
  const res = await fetch(`${API_BASE}/projects`)
  if (!res.ok) throw new Error(`Failed to load projects (${res.status})`)
  return res.json()
}

export async function createProject(data: {
  title: string
  generalDescription?: string
  type?: string
  county?: string
}): Promise<BackendProject> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: null, ...data }),
  })
  if (!res.ok) throw new Error(`Failed to create project (${res.status})`)
  return res.json()
}

export async function updateProject(
  id: string,
  data: { title?: string; generalDescription?: string; type?: string; county?: string },
): Promise<BackendProject> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to update project (${res.status})`)
  return res.json()
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Failed to delete project (${res.status})`)
}
