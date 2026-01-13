import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query';
import { queryClient } from '@/app/providers/QueryClient';

/**
 * Custom useQuery wrapper with consistent error handling and type safety
 *
 * @example
 * const { data, isLoading, error } = useApiQuery(
 *   ['songs'],
 *   fetchSongs,
 *   { select: toSongsView }
 * );
 */
export function useApiQuery<
  TData = unknown,
  TError = Error,
  TTransformed = TData,
  TKey extends QueryKey = QueryKey,
>(
  queryKey: TKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TTransformed, TKey>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError, TTransformed, TKey>({
    queryKey,
    queryFn,
    ...options,
  });
}

interface UseApiMutationOptions<TData, TError, TVariables, TContext> extends Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn'
> {
  /**
   * Query keys to invalidate after successful mutation
   * This triggers automatic refetch of related queries
   */
  invalidationKeys?: QueryKey[];
}

/**
 * Custom useMutation wrapper with automatic cache invalidation
 *
 * @example
 * const { mutate } = useApiMutation(
 *   (data: CreateSongInput) => createSong(data),
 *   { invalidationKeys: [songKeys.all] }
 * );
 */
export function useApiMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseApiMutationOptions<TData, TError, TVariables, TContext>
) {
  const { invalidationKeys, onSuccess: userOnSuccess, ...rest } = options || {};

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    ...rest,
    onSuccess: async (data, variables, context, ...args) => {
      // Automatic cache invalidation
      if (invalidationKeys && invalidationKeys.length > 0) {
        await Promise.all(
          invalidationKeys.map(key =>
            queryClient.invalidateQueries({
              queryKey: key,
              refetchType: 'all',
            })
          )
        );
      }

      // User-provided onSuccess callback
      if (userOnSuccess) {
        userOnSuccess(data, variables, context, ...args);
      }
    },
  });
}
