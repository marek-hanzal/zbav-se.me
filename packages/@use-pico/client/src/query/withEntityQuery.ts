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
		export type Type = "collection" | "fetch";

		export interface Data<TFetchRequest, TCollectionRequest> {
			fetch?: TFetchRequest;
			collection?: TCollectionRequest;
		}
	}

	export interface Props<
		TEntity extends EntitySchema.Type,
		TFetchRequest,
		TCollectionRequest,
		TPatchRequest,
	> {
		keys(): QueryKey;
		toIdKey(id: string): TFetchRequest;
		fetch(data: TFetchRequest): Promise<TEntity>;
		collection(data: TCollectionRequest): Promise<TEntity[]>;
		patch(data: TPatchRequest): Promise<TEntity>;
	}

	export interface QueryOptions<TResult>
		extends OmitKeyof<UseSuspenseQueryOptions<TResult, Error>, "queryKey" | "queryFn"> {
		//
	}

	export interface MutationOptions<TRequest, TResult, TError, TContext = unknown>
		extends Omit<
			UseMutationOptions<TResult, TError, TRequest, TContext>,
			"mutationFn" | "mutationKey"
		> {
		invalidate: Invalidator.Type[];
	}
}

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
	function $keys(part: string, data?: unknown) {
		return cleanOf([
			...keys(),
			part,
			data,
		]) as QueryKey;
	}

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

	function useEntityQuery(data: TFetchRequest, opts?: withEntityQuery.QueryOptions<TEntity>) {
		return useSuspenseQuery({
			queryKey: $keys("fetch", data),
			queryFn() {
				return fetch(data);
			},
			...opts,
		});
	}

	function useFetchQuery(id: string, opts?: withEntityQuery.QueryOptions<TEntity>) {
		const request = toIdKey(id);

		return useEntityQuery(request, opts);
	}

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
		useEntityQuery,
		useFetchQuery,
		useCollectionQuery,
		usePatchMutation,
		useInvalidator,
	} as const;
};
