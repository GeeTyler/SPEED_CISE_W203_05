import { render, screen } from '@testing-library/react';
import HomePage from '@/app/components/homepage/page';
import Intro from '@/app/components/homepage/_components/intro'; 

describe('HomePage', () => {
  it('renders the HomePage component with Intro', () => {
    render(<HomePage />);

    expect(screen.getByText('Welcome to SPEED')).toBeInTheDocument();
    expect(screen.getByText('Systematic Program for Evaluating and Enriching Documents')).toBeInTheDocument();
  });
});

describe('Intro', () => {
  it('renders the Intro component with correct title and description', () => {
    render(<Intro />);

    expect(screen.getByText('Welcome to SPEED')).toBeInTheDocument();
    expect(screen.getByText('Systematic Program for Evaluating and Enriching Documents')).toBeInTheDocument();
    expect(
      screen.getByText(
        /SPEED is your go-to platform for accessing a vast database of articles/i
      )
    ).toBeInTheDocument();
  });

  it('checks if the Card has the correct background class', () => {
    const { container } = render(<Intro />);
    expect(container.querySelector('.bg-zinc-950')).toBeInTheDocument();
  });
});
