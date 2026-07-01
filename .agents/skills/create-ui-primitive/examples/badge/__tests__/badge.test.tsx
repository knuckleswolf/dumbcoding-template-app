import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '../badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText('Active')).toHaveClass('bg-green-200');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Active</Badge>);
    expect(screen.getByText('Active')).toHaveClass('custom-class');
  });
});
