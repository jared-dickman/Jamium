import { jamKeys, type JamFilters } from '@/app/features/jams/keys';
import {
  fetchJamsList,
  fetchJamDetail,
  createJam,
  updateJam,
  deleteJam,
} from '@/app/features/jams/queries';
import type { JamInsert, JamUpdate } from '@/lib/supabase/jams.schema';

/**
 * Query options definitions
 * Separates query configuration from hook implementation
 */

export const jamOptions = {
  list: (filters?: JamFilters) => ({
    queryKey: jamKeys.list(filters),
    queryFn: () => fetchJamsList(filters),
  }),

  detail: (id: string) => ({
    queryKey: jamKeys.detail(id),
    queryFn: () => fetchJamDetail(id),
  }),
};

export const jamMutations = {
  create: (input: JamInsert) => createJam(input),
  update: (id: string, input: JamUpdate) => updateJam(id, input),
  delete: (id: string) => deleteJam(id),
};
