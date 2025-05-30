import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Header from '@/components/Header';

describe('Header', () => {
  it('renders header component', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(<Header />);
    expect(screen.getByText(/главная/i)).toBeInTheDocument();
    expect(screen.getByText(/посты/i)).toBeInTheDocument();
  });
}); 