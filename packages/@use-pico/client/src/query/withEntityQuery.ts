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
import type { CountSchema, EntitySchema } from "@use-pico/common/schema";

export namespace withEntityQuery {
	export namespace Invalidator {
		/**
		 * Supported invalidation targets.
		 *
		 * - `collection`: invalidates collection queries
		 * - `fetch`: invalidates single-entity fetch queries
		 */
		export type Type = "collection" | "fetch" | "count";

		/**
		 * Optional payload used to scope invalidation keys.
		 *
		 * Both properties are optional so callers can invalidate broadly or narrowly,
		 * depending on how specific their cache keys are.
		 */
		export interface Data<TFetchRequest, TCollectionRequest, TCountRequest> {
			fetch?: TFetchRequest;
			collection?: TCollectionRequest;
			count?: TCountRequest;
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
		TCountRequest,
		TPatchRequest,
		TCreateRequest,
		TDeleteRequest,
		TPatchCollectionRequest = never,
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
		fetchFn(data: TFetchRequest): Promise<TEntity>;
		/**
		 * Loads a collection of entities.
		 */
		collectionFn(data: TCollectionRequest): Promise<TEntity[]>;
		countFn(data: TCountRequest): Promise<CountSchema.Type>;
		/**
		 * Create mutation.
		 */
		createFn(data: TCreateRequest): Promise<TEntity>;
		/**
		 * Patches an entity and returns server-updated entity payload.
		 */
		patchFn(data: TPatchRequest): Promise<TEntity>;
		/**
		 * Patches a collection of entities and returns the server-updated entities.
		 */
		patchCollectionFn(data: TPatchCollectionRequest): Promise<TEntity[]>;
		/**
		 * Delete mutation.
		 */
		deleteFn(data: TDeleteRequest): Promise<TEntity>;
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

	export namespace MutationOptions {
		/**
		 * Extra metadata propagated to TanStack mutation options.
		 *
		 * `mutationId` can be used by higher-level helpers/UI to distinguish
		 * concurrently running mutations that share the same mutation key.
		 */
		export interface Meta {
			mutationId?: string;
		}

		export namespace PreMutation {
			/**
			 * Lifecycle payload for pre-mutation hook.
			 *
			 * Contains validated mutation input right before `mutationFn` execution.
			 */
			export interface Props<TVariables> {
				variables: TVariables;
			}

			/**
			 * Result of the callback is unused
			 */
			export type Fn<TVariables> = (props: Props<TVariables>) => Promise<any>;
		}

		export namespace PostMutation {
			/**
			 * Lifecycle payload for post-mutation hook.
			 *
			 * Contains original input and resolved server entity after cache sync.
			 */
			export interface Props<TVariables, TResult> {
				variables: TVariables;
				result: TResult;
			}

			/**
			 * Result of the callback is unused
			 */
			export type Fn<TVariables, TResult> = (
				props: Props<TVariables, TResult>,
			) => Promise<any>;
		}
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
			"mutationFn" | "mutationKey" | "meta"
		> {
		/**
		 * Additional invalidation strategy to run after patch result is written to cache.
		 *
		 * Prefer keeping this narrow. Most updates are already propagated by writing
		 * the returned entity into canonical fetch cache.
		 */
		invalidate?: Invalidator.Type[];
		meta?: MutationOptions.Meta;
		/**
		 * Optional callback called right _before_ mutationFn - this blocking the mutation itself
		 *
		 * Fails the mutation if an error is thrown.
		 */
		onPreMutation?: MutationOptions.PreMutation.Fn<TRequest>;
		/**
		 * Optional callback called right _after_ mutationFn - this blocking the mutation itself (it's not a onSuccess callback)
		 */
		onPostMutation?: MutationOptions.PostMutation.Fn<TRequest, TResult>;
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
	TCountRequest,
	TPatchRequest,
	TCreateRequest,
	TDeleteRequest,
	TPatchCollectionRequest = never,
>({
	keys,
	toIdKey,
	fetchFn,
	collectionFn,
	countFn,
	createFn,
	deleteFn,
	patchFn,
	patchCollectionFn,
}: withEntityQuery.Props<
	TEntity,
	TFetchRequest,
	TCollectionRequest,
	TCountRequest,
	TPatchRequest,
	TCreateRequest,
	TDeleteRequest,
	TPatchCollectionRequest
>) => {
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
	 * Writes one entity into canonical fetch cache (`.../fetch/<id>`).
	 *
	 * This is the fundamental cache sync primitive used by collection hydration
	 * and mutation pipelines. Keeping this centralized ensures all update paths
	 * use the same key strategy.
	 */
	function $updateFn(queryClient: QueryClient, item: TEntity) {
		queryClient.setQueryData($keys("fetch", toIdKey(item.id)), item);

		return item;
	}

	/**
	 * Hook form of {@link $updateFn} for component code paths.
	 *
	 * Useful when data already came from another source (WebSocket, local merge,
	 * optimistic UI) and you want to normalize it into entity fetch cache.
	 */
	function useUpdate() {
		const queryClient = useQueryClient();

		return (item: TEntity) => $updateFn(queryClient, item);
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
		data?: withEntityQuery.Invalidator.Data<TFetchRequest, TCollectionRequest, TCountRequest>,
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

		if (invalidate.includes("count")) {
			what.push(
				queryClient.invalidateQueries({
					queryKey: $keys("count", data?.count),
					refetchType: "all",
				}),
			);
		}

		return Promise.all(what);
	}

	function ensureEntityQuery(
		queryClient: QueryClient,
		data: TFetchRequest,
		opts?: withEntityQuery.QueryOptions<TEntity>,
	) {
		return queryClient.ensureQueryData({
			queryKey: $keys("fetch", data),
			queryFn() {
				return fetchFn(data);
			},
			...opts,
		});
	}

	/**
	 * Internal suspense fetch hook by canonical fetch request payload.
	 */
	function useEntityQuery(data: TFetchRequest, opts?: withEntityQuery.QueryOptions<TEntity>) {
		return useSuspenseQuery({
			queryKey: $keys("fetch", data),
			queryFn() {
				return fetchFn(data);
			},
			...opts,
		});
	}

	function useMaybeEntityQuery(
		data: TFetchRequest,
		opts?: withEntityQuery.QueryOptions<TEntity | null>,
	) {
		return useSuspenseQuery({
			queryKey: $keys("fetch", data),
			async queryFn() {
				try {
					return await fetchFn(data);
				} catch {
					return null;
				}
			},
			...opts,
		});
	}

	function ensureFetchQuery(
		queryClient: QueryClient,
		id: string,
		opts?: withEntityQuery.QueryOptions<TEntity>,
	) {
		const request = toIdKey(id);

		return queryClient.ensureQueryData({
			queryKey: $keys("fetch", request),
			queryFn() {
				return fetchFn(request);
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

	async function $collectionFn(queryClient: QueryClient, data: TCollectionRequest) {
		const result = await collectionFn(data);

		return notifyManager.batch(() =>
			result.map((item) => {
				return $updateFn(queryClient, item).id;
			}),
		);
	}

	function ensureCollectionQuery(
		queryClient: QueryClient,
		data: TCollectionRequest,
		opts?: withEntityQuery.QueryOptions<string[]>,
	) {
		return queryClient.ensureQueryData({
			queryKey: $keys("collection", data),
			async queryFn() {
				return $collectionFn(queryClient, data);
			},
			...opts,
		});
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
				return $collectionFn(queryClient, data);
			},
			...opts,
		});
	}

	function ensureCountQuery(
		queryClient: QueryClient,
		data: TCountRequest,
		opts?: withEntityQuery.QueryOptions<CountSchema.Type>,
	) {
		return queryClient.ensureQueryData({
			queryKey: $keys("count", data),
			queryFn() {
				return countFn(data);
			},
			...opts,
		});
	}

	/**
	 * Suspense count query for the entity resource.
	 *
	 * Use this when UI needs aggregate flags (`isEmpty`, `isFilterEmpty`, `total`, ...)
	 * without hydrating full collection payload.
	 */
	function useCountQuery(
		data: TCountRequest,
		opts?: withEntityQuery.QueryOptions<CountSchema.Type>,
	) {
		return useSuspenseQuery({
			queryKey: $keys("count", data),
			async queryFn() {
				return countFn(data);
			},
			...opts,
		});
	}

	/**
	 * Internal patch pipeline shared by hook and non-hook mutation entry points.
	 *
	 * Performs:
	 * 1. server patch request
	 * 2. canonical fetch cache update for returned entity
	 * 3. optional scoped invalidation
	 */
	async function $patchFn(
		queryClient: QueryClient,
		request: TPatchRequest,
		invalidate?: withEntityQuery.Invalidator.Type[],
	) {
		const result = await patchFn(request);
		const key = toIdKey(result.id);

		$updateFn(queryClient, result);

		await invalidator(queryClient, invalidate, {
			fetch: key,
		});

		return result;
	}

	/**
	 * Internal patch-collection pipeline shared by hook and non-hook mutation entry points.
	 *
	 * Performs:
	 * 1. server patch request
	 * 2. canonical fetch cache update for every returned entity
	 * 3. optional invalidation
	 */
	async function $patchCollectionFn(
		queryClient: QueryClient,
		request: TPatchCollectionRequest,
		invalidate?: withEntityQuery.Invalidator.Type[],
	) {
		const result = await patchCollectionFn(request);

		for (const item of result) {
			$updateFn(queryClient, item);
		}

		await invalidator(queryClient, invalidate);

		return result;
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
		const { invalidate, onPreMutation, onPostMutation, meta, ...$opts } = opts || {};

		return useMutation({
			async mutationFn(request) {
				await onPreMutation?.({
					variables: request,
				});

				const result = await $patchFn(queryClient, request, invalidate);

				await onPostMutation?.({
					variables: request,
					result,
				});

				return result;
			},
			meta: meta as Record<string, unknown>,
			...$opts,
		});
	}

	/**
	 * Bulk patch mutation that writes every returned entity into canonical fetch cache.
	 */
	function usePatchCollectionMutation<TContext = unknown>(
		opts?: withEntityQuery.MutationOptions<TPatchCollectionRequest, TEntity[], Error, TContext>,
	) {
		const queryClient = useQueryClient();
		const { invalidate, onPreMutation, onPostMutation, meta, ...$opts } = opts || {};

		return useMutation({
			async mutationFn(request) {
				await onPreMutation?.({
					variables: request,
				});

				const result = await $patchCollectionFn(queryClient, request, invalidate);

				await onPostMutation?.({
					variables: request,
					result,
				});

				return result;
			},
			meta: meta as Record<string, unknown>,
			...$opts,
		});
	}

	/**
	 * Internal create pipeline shared by hook and non-hook mutation entry points.
	 *
	 * Newly created entity is normalized into canonical fetch cache so follow-up
	 * screens can read it via `useFetchQuery` without an extra network roundtrip.
	 */
	async function $createFn(
		queryClient: QueryClient,
		request: TCreateRequest,
		invalidate?: withEntityQuery.Invalidator.Type[],
	) {
		const result = await createFn(request);
		const key = toIdKey(result.id);

		$updateFn(queryClient, result);

		await invalidator(queryClient, invalidate, {
			fetch: key,
		});

		return result;
	}

	/**
	 * Optional create mutation with the same lifecycle semantics as patch.
	 *
	 * - runs `onPreMutation` before API call
	 * - writes returned entity into canonical fetch cache
	 * - performs optional extra invalidation
	 * - runs `onPostMutation` after cache sync
	 */
	function useCreateMutation<TContext = unknown>(
		opts?: withEntityQuery.MutationOptions<TCreateRequest, TEntity, Error, TContext>,
	) {
		const queryClient = useQueryClient();
		const { invalidate, onPreMutation, onPostMutation, meta, ...$opts } = opts || {};

		return useMutation({
			async mutationFn(request) {
				await onPreMutation?.({
					variables: request,
				});

				const result = await $createFn(queryClient, request, invalidate);

				await onPostMutation?.({
					variables: request,
					result,
				});

				return result;
			},
			meta: meta as Record<string, unknown>,
			...$opts,
		});
	}

	/**
	 * Internal delete pipeline shared by hook and non-hook mutation entry points.
	 *
	 * Removes canonical fetch cache for deleted entity and optionally invalidates
	 * dependent query segments (usually collection).
	 */
	async function $deleteFn(
		queryClient: QueryClient,
		request: TDeleteRequest,
		invalidate?: withEntityQuery.Invalidator.Type[],
	) {
		const result = await deleteFn(request);
		const key = toIdKey(result.id);

		queryClient.removeQueries({
			queryKey: $keys("fetch", key),
			exact: true,
		});

		await invalidator(queryClient, invalidate, {
			fetch: key,
		});

		return result;
	}

	/**
	 * Optional delete mutation with cache cleanup.
	 *
	 * - runs `onPreMutation` before API call
	 * - removes canonical fetch cache for deleted entity id
	 * - performs optional extra invalidation
	 * - runs `onPostMutation` after cache sync
	 */
	function useDeleteMutation<TContext = unknown>(
		opts?: withEntityQuery.MutationOptions<TDeleteRequest, TEntity, Error, TContext>,
	) {
		const queryClient = useQueryClient();
		const { invalidate, onPreMutation, onPostMutation, meta, ...$opts } = opts || {};

		return useMutation({
			async mutationFn(request) {
				await onPreMutation?.({
					variables: request,
				});

				const result = await $deleteFn(queryClient, request, invalidate);

				await onPostMutation?.({
					variables: request,
					result,
				});

				return result;
			},
			meta: meta as Record<string, unknown>,
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
			data: withEntityQuery.Invalidator.Data<
				TFetchRequest,
				TCollectionRequest,
				TCountRequest
			>,
		) => {
			return invalidator(queryClient, invalidate, data);
		};
	}

	/**
	 * Public facade with:
	 * - raw request fns (`fetchFn/collectionFn/countFn`)
	 * - cache primitives (`updateFn`, `invalidator`)
	 * - hook APIs for suspense queries and mutations
	 * - non-hook mutation pipelines (`createFn/patchFn/deleteFn`) for external orchestration
	 */
	return {
		keys: $keys,
		//
		fetchFn,
		ensureFetchQuery,
		ensureEntityQuery,
		//
		collectionFn,
		ensureCollectionQuery,
		//
		countFn,
		ensureCountQuery,
		//
		updateFn: $updateFn,
		//
		createFn: $createFn,
		patchFn: $patchFn,
		patchCollectionFn: $patchCollectionFn,
		deleteFn: $deleteFn,
		//
		invalidator,
		//
		useFetchQuery,
		useEntityQuery,
		useMaybeEntityQuery,
		useCollectionQuery,
		useCountQuery,
		//
		usePatchMutation,
		usePatchCollectionMutation,
		useCreateMutation,
		useDeleteMutation,
		//
		useUpdate,
		//
		useInvalidator,
	} as const;
};
