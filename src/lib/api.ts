import type { Project, ProjectsPage, MajorTag } from '@/types/project'

const DEFAULT_API_BASE = 'http://localhost:8080'
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE).replace(/\/$/, '')
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

const VALID_MAJOR_TAGS = new Set<MajorTag>(['cs', 'film', 'business', 'comdes'])

export interface BackendProject {
    id: string
    userId: string | null
    title: string
    generalDescription: string | null
    type: string | null
    county: string | null
}

function splitType(type?: string | null) {
    return (type ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
}

function mapBackendProject(p: BackendProject): Project {
    const typeTags = splitType(p.type)

    return {
        id: p.id,
        title: p.title,
        description: p.generalDescription ?? '',
        ownerName: p.userId ? `User ${p.userId.slice(0, 8)}` : 'Project Owner',
        majors: typeTags.filter((tag): tag is MajorTag =>
            VALID_MAJOR_TAGS.has(tag as MajorTag)
        ),
        tags: typeTags,
        status: 'open',
        spotsTotal: 1,
        spotsFilled: 0,
        createdAt: new Date().toISOString(),
    }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
    })

    if (!res.ok) {
        const message = await res.text().catch(() => '')
        throw new Error(message || `Request failed (${res.status})`)
    }

    if (res.status === 204) return undefined as T
    return res.json()
}

export async function getProjects(): Promise<BackendProject[]> {
    return requestJson<BackendProject[]>('/projects', { cache: 'no-store' })
}

export async function fetchProjects(page = 1, pageSize = 9): Promise<ProjectsPage> {
    const raw = await getProjects()
    const mapped = raw.map(mapBackendProject)

    const start = (page - 1) * pageSize

    return {
        projects: mapped.slice(start, start + pageSize),
        total: mapped.length,
        page,
        hasMore: start + pageSize < mapped.length,
    }
}

export async function createProject(data: {
    title: string
    generalDescription?: string
    type?: string
    county?: string
}): Promise<BackendProject> {
    return requestJson<BackendProject>('/projects', {
        method: 'POST',
        body: JSON.stringify({
            userId: null,
            ...data,
        }),
    })
}

export async function updateProject(
    id: string,
    data: {
        title?: string
        generalDescription?: string
        type?: string
        county?: string
    },
): Promise<BackendProject> {
    return requestJson<BackendProject>(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
}

export async function deleteProject(id: string): Promise<void> {
    await requestJson<void>(`/projects/${id}`, {
        method: 'DELETE',
    })
}