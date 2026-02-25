import {
	notifyManager,
	type OmitKeyof,
	type QueryClient,
	type QueryKey,
	type UseMutationOptions,
	type UseSuspenseQueryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { cleanOf } from "@use-pico/common/clean-of";
import type { EntitySchema } from "@use-pico/common/schema";

export namespace withEntityQuery {
	export namespace Invalidator {
		/**
		 * Supported invalidation targets.
		 *
		 * - `collection`: invalidates collection queries
		 * - `fetch`: invalidates single-entity fetch queries
		 */
		export type Type = "collection" | "fetch";

		/**
		 * Optional payload used to scope invalidation keys.
		 *
		 * Both properties are optional so callers can invalidate broadly or narrowly,
		 * depending on how specific their cache keys are.
		 */
		export interface Data<TFetchRequest, TCollectionRequest> {
			fetch?: TFetchRequest;
			collection?: TCollectionRequest;
		}
	}

	/**
	 * Static definition of an entity resource handled by this helper.
	 *
	 * The helper uses this contract to:
	 * - build stable query keys
	 * - convert id to fetch request shape
	 * - load one entity or a collection
	 * - patch an entity and synchronize cache
	 */
	export interface Props<
		TEntity extends EntitySchema.Type,
		TFetchRequest,
		TCollectionRequest,
		TPatchRequest,
	> {
		/**
		 * Base query key prefix for this entity resource.
		 */
		keys(): QueryKey;
		/**
		 * Maps entity id to canonical fetch request payload.
		 */
		toIdKey(id: string): TFetchRequest;
		/**
		 * Loads a single entity by fetch request.
		 */
		fetch(data: TFetchRequest): Promise<TEntity>;
		/**
		 * Loads a collection of entities.
		 */
		collection(data: TCollectionRequest): Promise<TEntity[]>;
		/**
		 * Patches an entity and returns server-updated entity payload.
		 */
		patch(data: TPatchRequest): Promise<TEntity>;
	}

	/**
	 * Suspense query options passed through to TanStack Query.
	 *
	 * `queryKey` and `queryFn` are controlled internally by this helper.
	 */
	export interface QueryOptions<TResult>
		extends OmitKeyof<UseSuspenseQueryOptions<TResult, Error>, "queryKey" | "queryFn"> {
		//
	}

	/**
	 * Mutation options passed through to TanStack Query mutation API.
	 *
	 * `mutationFn` and `mutationKey` are controlled internally. Use `invalidate`
	 * to request additional invalidation after optimistic cache sync from patch result.
	 */
	export interface MutationOptions<TRequest, TResult, TError, TContext = unknown>
		extends Omit<
			UseMutationOptions<TResult, TError, TRequest, TContext>,
			"mutationFn" | "mutationKey"
		> {
		/**
		 * Additional invalidation strategy to run after patch result is written to cache.
		 *
		 * Prefer keeping this narrow. Most updates are already propagated by writing
		 * the returned entity into canonical fetch cache.
		 */
		invalidate: Invalidator.Type[];
	}
}

/**
 * Creates a normalized entity query facade on top of native TanStack Query APIs.
 *
 * Core behavior:
 * - `useCollectionQuery` loads collection data and normalizes each entity into
 *   canonical per-id fetch cache entries.
 * - `useFetchQuery` reads single entity cache by id and re-renders only that entity
 *   when data changes.
 * - `usePatchMutation` writes server-returned entity directly into fetch cache,
 *   so fetch consumers update without mandatory invalidation/refetch.
 * - `useInvalidator` provides explicit force invalidation for cases where broad
 *   refresh is still required.
 *
 * All query hooks in this helper use suspense via `useSuspenseQuery`.
 */
export const withEntityQuery = <
	TEntity extends EntitySchema.Type,
	TFetchRequest,
	TCollectionRequest,
	TPatchRequest,
>({
	keys,
	toIdKey,
	fetch,
	collection,
	patch,
}: withEntityQuery.Props<TEntity, TFetchRequest, TCollectionRequest, TPatchRequest>) => {
	/**
	 * Internal key builder.
	 *
	 * Combines base resource key with query part (`fetch` / `collection`) and optional
	 * request payload, then removes empty segments for stable TanStack Query keys.
	 */
	function $keys(part: string, data?: unknown) {
		return cleanOf([
			...keys(),
			part,
			data,
		]) as QueryKey;
	}

	/**
	 * Internal invalidation utility.
	 *
	 * This is a force-refresh mechanism and should be used with care: broad invalidation
	 * can trigger extra network traffic and unnecessary re-renders compared to direct
	 * entity cache updates.
	 */
	async function invalidator(
		queryClient: QueryClient,
		invalidate?: withEntityQuery.Invalidator.Type[],
		data?: withEntityQuery.Invalidator.Data<TFetchRequest, TCollectionRequest>,
	): Promise<unknown> {
		if (!invalidate) {
			return;
		}

		const what: Promise<unknown>[] = [];

		if (invalidate.includes("collection")) {
			what.push(
				queryClient.invalidateQueries({
					queryKey: $keys("collection", data?.collection),
					refetchType: "all",
				}),
			);
		}

		if (invalidate.includes("fetch")) {
			what.push(
				queryClient.invalidateQueries({
					queryKey: $keys("fetch", data?.fetch),
					refetchType: "all",
				}),
			);
		}

		return Promise.all(what);
	}

	/**
	 * Internal suspense fetch hook by canonical fetch request payload.
	 */
	function useEntityQuery(data: TFetchRequest, opts?: withEntityQuery.QueryOptions<TEntity>) {
		return useSuspenseQuery({
			queryKey: $keys("fetch", data),
			queryFn() {
				return fetch(data);
			},
			...opts,
		});
	}

	/**
	 * Fetches a single entity by id using canonical fetch keys.
	 *
	 * Safe with or without prior collection hydration:
	 * - if entity is already normalized by collection query, this resolves from cache
	 * - otherwise it fetches directly from server
	 *
	 * Consumers re-render when this entity cache entry changes, including updates
	 * written by `usePatchMutation`.
	 */
	function useFetchQuery(id: string, opts?: withEntityQuery.QueryOptions<TEntity>) {
		const request = toIdKey(id);

		return useEntityQuery(request, opts);
	}

	/**
	 * Source hook for collection data.
	 *
	 * Loads entities from backend, then normalizes result into canonical per-entity
	 * fetch cache entries and returns only array of ids.
	 *
	 * Every collection refresh re-hydrates normalized entity cache entries to keep
	 * single-entity reads consistent.
	 */
	function useCollectionQuery(
		data: TCollectionRequest,
		opts?: withEntityQuery.QueryOptions<string[]>,
	) {
		const queryClient = useQueryClient();

		return useSuspenseQuery({
			queryKey: $keys("collection", data),
			async queryFn() {
				const result = await collection(data);

				return notifyManager.batch(() =>
					result.map((item) => {
						queryClient.setQueryData($keys("fetch", toIdKey(item.id)), item);
						return item.id;
					}),
				);
			},
			...opts,
		});
	}

	/**
	 * Primary synchronization mutation for entity updates.
	 *
	 * Writes the server-returned entity into canonical fetch cache immediately, which
	 * updates all fetch consumers for that id without mandatory invalidation/refetch.
	 *
	 * Optional invalidation is available for broader cache refresh scenarios.
	 */
	function usePatchMutation<TContext = unknown>(
		opts?: withEntityQuery.MutationOptions<TPatchRequest, TEntity, Error, TContext>,
	) {
		const queryClient = useQueryClient();
		const { invalidate, ...$opts } = opts || {};

		return useMutation({
			async mutationFn(request) {
				const result = await patch(request);
				const key = toIdKey(result.id);

				queryClient.setQueryData($keys("fetch", key), result);

				await invalidator(queryClient, invalidate, {
					fetch: key,
				});

				return result;
			},
			...$opts,
		});
	}

	/**
	 * Returns a low-level invalidation function.
	 *
	 * This is a brute-force fallback and should be used with caution. Prefer direct
	 * cache updates from `usePatchMutation` whenever possible.
	 */
	function useInvalidator() {
		const queryClient = useQueryClient();

		return (
			invalidate: withEntityQuery.Invalidator.Type[],
			data: withEntityQuery.Invalidator.Data<TFetchRequest, TCollectionRequest>,
		) => {
			return invalidator(queryClient, invalidate, data);
		};
	}

	return {
		useFetchQuery,
		useCollectionQuery,
		usePatchMutation,
		useInvalidator,
	} as const;
};
