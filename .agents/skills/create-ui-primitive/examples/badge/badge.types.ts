import type { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  /**
   * Content to display
   */
  children?: ReactNode;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * CSS class name
   */
  className?: string;
}
