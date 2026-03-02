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
		TCountRequest,
		TPatchRequest,
		TCreateRequest,
		TDeleteRequest,
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
		export interface Meta {
			mutationId?: string;
		}

		export namespace PreMutation {
			export interface Props<TVariables> {
				variables: TVariables;
			}

			/**
			 * Result of the callback is unused
			 */
			export type Fn<TVariables> = (props: Props<TVariables>) => Promise<any>;
		}

		export namespace PostMutation {
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
>({
	keys,
	toIdKey,
	fetchFn,
	collectionFn,
	countFn,
	createFn,
	deleteFn,
	patchFn,
}: withEntityQuery.Props<
	TEntity,
	TFetchRequest,
	TCollectionRequest,
	TCountRequest,
	TPatchRequest,
	TCreateRequest,
	TDeleteRequest
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
				return fetchFn(data);
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
				const result = await collectionFn(data);

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

	async function $patchFn(
		queryClient: QueryClient,
		request: TPatchRequest,
		invalidate?: withEntityQuery.Invalidator.Type[],
	) {
		const result = await patchFn(request);
		const key = toIdKey(result.id);

		queryClient.setQueryData($keys("fetch", key), result);

		await invalidator(queryClient, invalidate, {
			fetch: key,
		});

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

	async function $createFn(
		queryClient: QueryClient,
		request: TCreateRequest,
		invalidate?: withEntityQuery.Invalidator.Type[],
	) {
		const result = await createFn(request);
		const key = toIdKey(result.id);

		queryClient.setQueryData($keys("fetch", key), result);

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
			data: withEntityQuery.Invalidator.Data<TFetchRequest, TCollectionRequest>,
		) => {
			return invalidator(queryClient, invalidate, data);
		};
	}

	return {
		fetchFn,
		collectionFn,
		countFn,
		//
		createFn: $createFn,
		patchFn: $patchFn,
		deleteFn: $deleteFn,
		//
		invalidator,
		//
		useFetchQuery,
		useCollectionQuery,
		useCountQuery,
		usePatchMutation,
		useCreateMutation,
		useDeleteMutation,
		useInvalidator,
	} as const;
};
