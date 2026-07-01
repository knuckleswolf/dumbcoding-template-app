import type { RepositoryMetadata } from './repository-card.types';

/**
 * Format star count to human-readable format
 */
export function formatStars(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Determine if repository is popular
 */
export function isPopularRepo(stars: number): boolean {
  return stars >= 1_000;
}

/**
 * Get language color for visual indicator
 */
export function getLanguageColor(language?: string): string {
  const colors: Record<string, string> = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f1e05a',
    'Python': '#3572a5',
    'Go': '#00add8',
    'Rust': '#ce422b',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#239120',
  };
  return colors[language ?? 'Unknown'] ?? '#858585';
}

/**
 * Calculate repository metadata
 */
export function calculateRepoMetadata(stars: number, language?: string): RepositoryMetadata {
  return {
    formattedStars: formatStars(stars),
    isPopular: isPopularRepo(stars),
    languageColor: getLanguageColor(language),
  };
}
