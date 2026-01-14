'use client';

import { useApiQuery, useApiMutation } from '@/app/hooks/query-hooks';
import { jamKeys, type JamFilters } from '@/app/features/jams/keys';
import { jamOptions, jamMutations } from '@/app/features/jams/options';
import type { JamRow, JamInsert, JamUpdate } from '@/lib/supabase/jams.schema';

/**
 * Component API - Feature hooks that components import
 * These are the ONLY hooks that components should use for jams data
 */

/**
 * Fetch list of user's jams with optional filters
 */
export function useJams(filters?: JamFilters) {
  const options = jamOptions.list(filters);

  return useApiQuery<JamRow[], Error, JamRow[]>(options.queryKey, options.queryFn, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single jam by ID
 */
export function useJam(id: string) {
  const options = jamOptions.detail(id);

  return useApiQuery<JamRow, Error, JamRow>(options.queryKey, options.queryFn, {
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(id),
  });
}

/**
 * Create a new jam
 */
export function useCreateJam() {
  return useApiMutation<JamRow, Error, JamInsert>(
    (data: JamInsert) => jamMutations.create(data),
    {
      invalidationKeys: [jamKeys.all],
    }
  );
}

/**
 * Update an existing jam
 */
export function useUpdateJam() {
  return useApiMutation<JamRow, Error, { id: string; data: JamUpdate }>(
    ({ id, data }) => jamMutations.update(id, data),
    {
      invalidationKeys: [jamKeys.all],
    }
  );
}

/**
 * Soft delete a jam
 */
export function useDeleteJam() {
  return useApiMutation<void, Error, string>(
    (id: string) => jamMutations.delete(id),
    {
      invalidationKeys: [jamKeys.all],
    }
  );
}
