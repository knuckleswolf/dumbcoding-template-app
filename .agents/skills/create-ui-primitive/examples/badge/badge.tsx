import type { ReactNode } from 'react';
import type { BadgeRootProps, BadgeSize, BadgeTone, BadgeVariant } from './badge.types';

/**
 * Badge UI primitive root slot.
 *
 * @example
 * ```tsx
 * <Badge.Root tone="success">Active</Badge.Root>
 * ```
 */
const ROOT_BASE_CLASS = 'inline-flex items-center rounded-full font-medium';

const ROOT_VARIANT_CLASS = {
  solid: 'border border-transparent',
  soft: 'border border-transparent',
  outline: 'border bg-transparent',
} satisfies Record<BadgeVariant, string>;

const ROOT_TONE_CLASS = {
  neutral: 'border-zinc-300 bg-zinc-100 text-zinc-950',
  success: 'border-emerald-300 bg-emerald-100 text-emerald-950',
  warning: 'border-amber-300 bg-amber-100 text-amber-950',
  danger: 'border-red-300 bg-red-100 text-red-950',
  info: 'border-blue-300 bg-blue-100 text-blue-950',
} satisfies Record<BadgeTone, string>;

const ROOT_SIZE_CLASS = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
} satisfies Record<BadgeSize, string>;

const cx = (...classNames: Array<string | false | null | undefined>) =>
  classNames.filter(Boolean).join(' ');

export const BadgeRoot = ({
  children,
  className,
  size = 'md',
  tone = 'neutral',
  variant = 'soft',
  ...props
}: BadgeRootProps): ReactNode => {
  return (
    <span
      className={cx(
        ROOT_BASE_CLASS,
        ROOT_VARIANT_CLASS[variant],
        ROOT_TONE_CLASS[tone],
        ROOT_SIZE_CLASS[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

BadgeRoot.displayName = 'BadgeRoot';

export const Badge = {
  Root: BadgeRoot,
};
