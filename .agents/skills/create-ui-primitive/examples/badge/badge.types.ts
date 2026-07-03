import type { ComponentPropsWithoutRef } from 'react';

export type BadgeVariant = 'solid' | 'soft' | 'outline';
export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeRootProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * Visual variant
   * @default 'soft'
   */
  variant?: BadgeVariant;

  /**
   * Color tone
   * @default 'neutral'
   */
  tone?: BadgeTone;

  /**
   * Size variant
   * @default 'md'
   */
  size?: BadgeSize;
}
