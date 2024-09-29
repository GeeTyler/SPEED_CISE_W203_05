import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'
 
describe('Page', () => {
  it('renders the HomePage inside a div', () => {
    render(<Page />)
    const divElement = screen.getByTestId('homepage-container')
    expect(divElement).toBeInTheDocument()
  })
})