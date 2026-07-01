import { useCallback, useMemo } from 'react';
import type { MouseEvent } from 'react';
import type { RepositoryCardProps } from '../repository-card.types';
import { calculateRepoMetadata } from '../repository-card.model';

/**
 * Hook for repository card logic
 */
export function useRepositoryCard(props: RepositoryCardProps) {
  const metadata = useMemo(
    () => calculateRepoMetadata(props.stars, props.language),
    [props.stars, props.language]
  );

  const handleClick = useCallback(() => {
    props.onClick?.();
  }, [props.onClick]);

  const handleAction = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    props.onAction?.();
  }, [props.onAction]);

  return { metadata, handleClick, handleAction };
}
