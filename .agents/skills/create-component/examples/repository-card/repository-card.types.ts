import type { ReactNode } from 'react';

export type RepositoryCardVariant = 'default' | 'featured';
export type RepositoryCardSize = 'compact' | 'standard';

export interface RepositoryCardProps {
  /**
   * Repository ID
   */
  id: string;

  /**
   * Repository name
   */
  name: string;

  /**
   * Repository owner/org
   */
  owner: string;

  /**
   * Repository description
   */
  description?: string;

  /**
   * Primary language
   */
  language?: string;

  /**
   * Number of stars
   */
  stars: number;

  /**
   * Callback when card is clicked
   */
  onClick?: () => void;

  /**
   * Action button content
   */
  actionLabel?: ReactNode;

  /**
   * Callback when action is clicked
   */
  onAction?: () => void;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: RepositoryCardVariant;

  /**
   * Size variant
   * @default 'standard'
   */
  size?: RepositoryCardSize;

  /**
   * Loading state (action button)
   */
  isActionLoading?: boolean;

  /**
   * CSS class name
   */
  className?: string;
}

export interface RepositoryMetadata {
  formattedStars: string;
  isPopular: boolean;
  languageColor: string;
}
