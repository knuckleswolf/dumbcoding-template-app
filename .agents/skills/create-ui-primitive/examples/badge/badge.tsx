import type { ReactNode } from 'react';
import type { BadgeProps } from './badge.types';

/**
 * Badge UI primitive - shows status or label.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * ```
 */
export const Badge = ({
  children,
  variant = 'default',
  className,
  ...props
}: BadgeProps): ReactNode => {
  const baseStyles = 'inline-block px-2 py-1 text-xs font-semibold rounded-full';
  const variantStyles = {
    default: 'bg-gray-200 text-gray-900',
    success: 'bg-green-200 text-green-900',
    warning: 'bg-yellow-200 text-yellow-900',
    error: 'bg-red-200 text-red-900',
    info: 'bg-blue-200 text-blue-900',
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${className ?? ''}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
