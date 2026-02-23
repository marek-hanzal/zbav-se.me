import { type QueryKey, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { CountSchema, EntitySchema } from "@use-pico/common/schema";
import type { withMutation } from "../mutation";
import type { withQuery } from "./withQuery";

export namespace withCollectionQuery {
	/**
	 * Static definition of a "collection + item + count + patch" resource.
	 *
	 * This object describes how to:
	 * - load a list-like collection from API
	 * - map each collection item to canonical item cache keys
	 * - load an individual item by id
	 * - load count metadata
	 * - patch a single item and keep caches coherent
	 */
	export interface Props<
		TResult extends EntitySchema.Type,
		TCollectionRequest,
		TFetchRequest,
		TCountRequest,
		TPatchRequest,
		TPatchError,
	> {
		/**
		 * Query key factory for the "collection ids" cache entry.
		 *
		 * This key represents the list result used by `useCollectionQuery`.
		 * Keep this aligned with `collectionQuery.keys(...)` semantics to avoid
		 * duplicate caches for logically identical collection requests.
		 */
		key(data: TCollectionRequest): QueryKey;
		/**
		 * Query API for loading the collection payload from backend.
		 *
		 * Expected behavior:
		 * - returns full entities (`TResult[]`), not ids
		 * - each entity is then copied into canonical item cache (`fetchQuery`)
		 *   during `useCollectionQuery`
		 */
		collectionQuery: withQuery.Api<TCollectionRequest, TResult[]>;
		/**
		 * Canonical query API for a single entity.
		 *
		 * All item reads should converge here. Collection hydration and patch
		 * updates both write into this cache so per-item UI can re-render without
		 * refetching the full collection.
		 */
		fetchQuery: withQuery.Api<TFetchRequest, TResult>;
		/**
		 * Query API returning aggregate metadata for the collection.
		 *
		 * Typical use: limits/counters in UI. This cache is invalidated after
		 * patch mutation because item changes may affect aggregate counts.
		 */
		countQuery: withQuery.Api<TCountRequest, CountSchema.Type>;
		/**
		 * Mutation API for patching a single entity.
		 *
		 * Must return the updated entity (`TResult`) so we can immediately update
		 * canonical fetch cache for `result.id` and keep item-level UI in sync.
		 */
		patchMutation: withMutation.Api<TPatchRequest, TResult, TPatchError>;
		/**
		 * Mapping from entity id to the corresponding `fetchQuery` request shape.
		 *
		 * This is the bridge between collection items and single-item cache keys.
		 * It must produce exactly the same request structure that callers use for
		 * `fetchQuery`/`useQuery`, otherwise cache hydration will miss.
		 */
		toIdKey(id: string): TFetchRequest;
	}

	/**
	 * Per-mutation behavior overrides.
	 *
	 * Why this is runtime/per-call and not part of collection definition:
	 * - most patches update fields that do not change collection membership/order,
	 *   so invalidating collection on every patch is unnecessary work.
	 * - some patches can affect ordering/membership and then we do need collection
	 *   invalidation, but only for those specific mutation call-sites.
	 *
	 * This keeps default rendering fast (single-item update) while still allowing
	 * opt-in consistency when a specific patch requires a full collection refresh.
	 */
	export interface MutationProps<TPatchRequest, TResult, TPatchError, TContext = unknown>
		extends withMutation.UseOptions<TPatchRequest, TResult, TPatchError, TContext> {
		/**
		 * If true, invalidate collection query keys in addition to count.
		 *
		 * Default is false to preserve optimal re-render behavior:
		 * - update canonical fetch cache for the patched item
		 * - avoid re-fetching the full collection payload
		 */
		invalidateCollection?: boolean;
	}
}

/**
 * Creates a centralized query facade for resources that naturally have:
 * - collection endpoint (many items)
 * - fetch endpoint (single item)
 * - count endpoint (collection metadata)
 * - patch mutation (single item update)
 *
 * Core strategy:
 * 1. `useCollectionQuery` returns only item ids.
 * 2. During collection fetch, canonical item cache is populated via `fetchQuery` keys.
 * 3. UI then consumes per-item `useQuery(id)` which usually resolves from cache immediately.
 * 4. `useMutation` updates only the patched item cache and invalidates count by default.
 *
 * Result:
 * - fine-grained re-rendering when one item changes
 * - optional collection invalidation only when explicitly needed
 */
export const withCollectionQuery = <
	TResult extends EntitySchema.Type,
	TCollectionRequest,
	TFetchRequest,
	TCountRequest,
	TPatchRequest,
	TPatchError,
>({
	key,
	collectionQuery,
	fetchQuery,
	countQuery,
	patchMutation,
	toIdKey,
}: withCollectionQuery.Props<
	TResult,
	TCollectionRequest,
	TFetchRequest,
	TCountRequest,
	TPatchRequest,
	TPatchError
>) => {
	return {
		useCollectionQuery(data: TCollectionRequest) {
			const set = fetchQuery.useSet();

			return useSuspenseQuery({
				queryKey: key(data),
				async queryFn() {
					const response = await collectionQuery.query(data);
					response.forEach((item) => {
						set(() => item, toIdKey(item.id));
					});
					return response.map(({ id }) => id);
				},
			});
		},
		useQuery(id: string, opts?: withQuery.QueryOptions<TResult> | undefined) {
			return fetchQuery.useSuspenseQuery(toIdKey(id), opts);
		},
		useCount(data: TCountRequest, opts?: withQuery.QueryOptions<CountSchema.Type> | undefined) {
			return countQuery.useSuspenseQuery(data, opts);
		},
		useFetchQuery(data: TFetchRequest, opts?: withQuery.QueryOptions<TResult> | undefined) {
			return fetchQuery.useSuspenseQuery(data, opts);
		},
		useMutation<TContext = unknown>(
			options?: withCollectionQuery.MutationProps<
				TPatchRequest,
				TResult,
				TPatchError,
				TContext
			>,
		) {
			const queryClient = useQueryClient();
			const set = fetchQuery.useSet();
			const { invalidateCollection = false, onPostMutation, ...$options } = options ?? {};

			const mutation = patchMutation.useMutation<TContext>({
				...$options,
				async onPostMutation({ result, variables }) {
					set(() => result, toIdKey(result.id));
					const invalidation = [
						countQuery.invalidate(queryClient),
					];
					if (invalidateCollection) {
						invalidation.push(collectionQuery.invalidate(queryClient));
					}
					await Promise.all(invalidation);
					await onPostMutation?.({
						variables,
						result,
					});
				},
			});

			return mutation;
		},
		fetch(data: TFetchRequest) {
			return fetchQuery.query(data);
		},
		collection(data: TCollectionRequest) {
			return collectionQuery.query(data);
		},
		count(data: TCountRequest) {
			return countQuery.query(data);
		},
	};
};
