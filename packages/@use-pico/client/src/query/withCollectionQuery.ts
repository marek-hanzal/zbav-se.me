import { type QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import type { CountSchema, EntitySchema } from "@use-pico/common/schema";
import type { withMutation } from "../mutation";
import type { withQuery } from "./withQuery";

export namespace withCollectionQuery {
	export interface Props<
		TResult extends EntitySchema.Type,
		TCollectionRequest,
		TFetchRequest,
		TCountRequest,
		TPatchRequest,
	> {
		key(data: TCollectionRequest): QueryKey;
		collectionQuery: withQuery.Api<TCollectionRequest, TResult[]>;
		fetchQuery: withQuery.Api<TFetchRequest, TResult>;
		countQuery: withQuery.Api<TCountRequest, CountSchema.Type>;
		patchMutation: withMutation.Api<TPatchRequest, TResult, any>;
		toIdKey(id: string): TFetchRequest;
	}
}

export const withCollectionQuery = <
	TResult extends EntitySchema.Type,
	TCollectionRequest,
	TFetchRequest,
	TCountRequest,
	TPatchRequest,
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
	TPatchRequest
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
		useMutation() {
			const set = fetchQuery.useSet();

			const mutation = patchMutation.useMutation({
				async onPostMutation({ result }) {
					set(() => result, toIdKey(result.id));
				},
			});

			return mutation;
		},
	};
};
