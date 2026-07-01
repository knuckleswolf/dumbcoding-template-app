import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RepositoryCard } from '../repository-card';

describe('RepositoryCard', () => {
  const defaultProps = {
    id: 'test-repo',
    name: 'test-repo',
    owner: 'testuser',
    stars: 342,
  };

  it('renders repository information', () => {
    render(<RepositoryCard {...defaultProps} />);
    expect(screen.getByText('testuser/test-repo')).toBeInTheDocument();
  });

  it('displays formatted stars', () => {
    render(<RepositoryCard {...defaultProps} stars={1500} />);
    expect(screen.getByText(/1\.5K/)).toBeInTheDocument();
  });

  it('shows popular badge when stars >= 1000', () => {
    render(<RepositoryCard {...defaultProps} stars={1000} />);
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('does not show popular badge when stars < 1000', () => {
    render(<RepositoryCard {...defaultProps} stars={500} />);
    expect(screen.queryByText('Popular')).not.toBeInTheDocument();
  });

  it('displays language when provided', () => {
    render(<RepositoryCard {...defaultProps} language="TypeScript" />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('displays description', () => {
    render(
      <RepositoryCard
        {...defaultProps}
        description="A test repository"
      />
    );
    expect(screen.getByText('A test repository')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<RepositoryCard {...defaultProps} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('calls onAction when action button is clicked', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();
    render(
      <RepositoryCard
        {...defaultProps}
        actionLabel="View"
        onAction={handleAction}
      />
    );
    await user.click(screen.getByText('View'));
    expect(handleAction).toHaveBeenCalled();
  });

  it('disables action button when loading', () => {
    render(
      <RepositoryCard
        {...defaultProps}
        actionLabel="View"
        isActionLoading={true}
      />
    );
    expect(screen.getByRole('button', { name: /Loading/ })).toBeDisabled();
  });
});
