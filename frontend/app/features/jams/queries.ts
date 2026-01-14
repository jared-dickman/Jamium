import type { JamRow, JamInsert, JamUpdate } from '@/lib/supabase/jams.schema';
import type { JamFilters } from '@/app/features/jams/keys';
import { apiRoutes } from '@/app/config/apiRoutes';
import { getAuthHeaders } from '@/lib/auth/clientAuth';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
  return response.json() as Promise<T>;
}

export async function fetchJamsList(filters?: JamFilters): Promise<JamRow[]> {
  const params = new URLSearchParams();
  if (filters?.userId) params.set('userId', filters.userId);
  if (filters?.isPublic !== undefined) params.set('isPublic', String(filters.isPublic));

  const url = params.toString() ? `${apiRoutes.jams}?${params}` : apiRoutes.jams;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: getAuthHeaders(),
  });
  return handleResponse<JamRow[]>(response);
}

export async function fetchJamDetail(id: string): Promise<JamRow> {
  const response = await fetch(apiRoutes.jamDetail(id), {
    cache: 'no-store',
    headers: getAuthHeaders(),
  });
  return handleResponse<JamRow>(response);
}

export async function createJam(input: JamInsert): Promise<JamRow> {
  const response = await fetch(apiRoutes.jams, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(input),
  });
  return handleResponse<JamRow>(response);
}

export async function updateJam(id: string, input: JamUpdate): Promise<JamRow> {
  const response = await fetch(apiRoutes.jamDetail(id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(input),
  });
  return handleResponse<JamRow>(response);
}

export async function deleteJam(id: string): Promise<void> {
  const response = await fetch(apiRoutes.jamDetail(id), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
}
