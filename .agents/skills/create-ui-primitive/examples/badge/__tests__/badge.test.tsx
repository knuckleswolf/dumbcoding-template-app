import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '../badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge.Root>Active</Badge.Root>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies tone styles', () => {
    render(<Badge.Root tone="success">Active</Badge.Root>);
    expect(screen.getByText('Active')).toHaveClass('bg-emerald-100');
  });

  it('applies custom className', () => {
    render(<Badge.Root className="custom-class">Active</Badge.Root>);
    expect(screen.getByText('Active')).toHaveClass('custom-class');
  });
});
