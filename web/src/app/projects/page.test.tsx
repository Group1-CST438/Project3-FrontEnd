import { render, screen } from '@testing-library/react'
import ProjectsPage from './page'

describe('ProjectsPage', () => {
  it('renders the page heading', () => {
    render(<ProjectsPage />)

    expect(screen.getByText(/discover projects/i)).toBeInTheDocument()
  })

  it('renders the create project button', () => {
    render(<ProjectsPage />)

    expect(screen.getByText(/\+ create project/i)).toBeInTheDocument()
  })

  it('renders a sample project title', () => {
    render(<ProjectsPage />)

    expect(screen.getByText(/parknarc/i)).toBeInTheDocument()
  })
})