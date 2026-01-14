/**
 * Hierarchical Query Key Factory for Jams
 *
 * Pattern: ['jams'] -> ['jams', 'list'] -> ['jams', 'detail', id]
 */

export type JamFilters = {
  userId?: string;
  isPublic?: boolean;
};

export const jamKeys = {
  all: ['jams'] as const,
  lists: () => [...jamKeys.all, 'list'] as const,
  list: (filters?: JamFilters) => [...jamKeys.lists(), filters] as const,
  details: () => [...jamKeys.all, 'detail'] as const,
  detail: (id: string) => [...jamKeys.details(), id] as const,
} as const;
