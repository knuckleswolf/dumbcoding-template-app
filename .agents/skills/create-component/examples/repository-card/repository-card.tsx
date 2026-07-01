import { useRepositoryCard } from './hooks';
import type { ReactNode } from 'react';
import type { RepositoryCardProps } from './repository-card.types';

/**
 * RepositoryCard - Product-ready component for displaying repository information
 *
 * Demonstrates:
 * - Composition of multiple UI elements
 * - Business logic layer (formatting, calculations)
 * - Custom hooks for complex logic
 * - Proper state management patterns
 *
 * @example
 * ```tsx
 * <RepositoryCard
 *   id="sambl-plugin"
 *   name="sambl-plugin"
 *   owner="knuckleswolf"
 *   description="TypeScript monorepo with plugin architecture"
 *   language="TypeScript"
 *   stars={342}
 *   actionLabel="View"
 *   onAction={() => navigate('/sambl-plugin')}
 * />
 * ```
 */
export function RepositoryCard({
  id,
  name,
  owner,
  description,
  language,
  stars,
  onClick,
  actionLabel,
  onAction,
  variant = 'default',
  size = 'standard',
  isActionLoading = false,
  className,
}: RepositoryCardProps): ReactNode {
  const { metadata, handleClick, handleAction } = useRepositoryCard({
    id,
    name,
    owner,
    description,
    language,
    stars,
    onClick,
    actionLabel,
    onAction,
    variant,
    size,
    isActionLoading,
    className,
  });

  const baseStyles = 'rounded-lg border border-gray-200 hover:border-gray-300 transition-all';
  const variantStyles = {
    default: 'bg-white p-4',
    featured: 'bg-gradient-to-br from-blue-50 to-white p-5 ring-1 ring-blue-100',
  };
  const sizeStyles = {
    compact: 'max-w-sm',
    standard: 'max-w-md',
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className ?? ''}`;

  return (
    <div
      className={classes}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {/* Header: Name + Popular badge */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h3 className="font-bold text-lg">
            {owner}/{name}
          </h3>
        </div>
        {metadata.isPopular && (
          <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-900 rounded-full">
            Popular
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>
      )}

      {/* Footer: Language + Stars + Action */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {language && (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: metadata.languageColor }}
              />
              <span className="text-xs text-gray-600">{language}</span>
            </div>
          )}
          <span className="text-xs font-semibold text-gray-700">
            ⭐ {metadata.formattedStars}
          </span>
        </div>

        {actionLabel && (
          <button
            className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleAction}
            disabled={isActionLoading}
          >
            {isActionLoading ? 'Loading...' : actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

RepositoryCard.displayName = 'RepositoryCard';
