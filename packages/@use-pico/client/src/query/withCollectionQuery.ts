import { type QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import type { EntitySchema } from "@use-pico/common/schema";
import type { withMutation } from "../mutation";
import type { withQuery } from "./withQuery";

export namespace withCollectionQuery {
	export interface Props<
		TCollectionData,
		TResult extends EntitySchema.Type,
		TFetchData,
		TPatchValues,
	> {
		key(data: TCollectionData): QueryKey;
		collectionQuery: withQuery.Api<TCollectionData, TResult[]>;
		fetchQuery: withQuery.Api<TFetchData, TResult>;
		patchMutation: withMutation.Api<TPatchValues, TResult, any>;
		toIdKey(id: string): TFetchData;
	}
}

export const withCollectionQuery = <
	TCollectionData,
	TResult extends EntitySchema.Type,
	TFetchData,
	TPatchValues,
>({
	key,
	collectionQuery,
	fetchQuery,
	patchMutation,
	toIdKey,
}: withCollectionQuery.Props<TCollectionData, TResult, TFetchData, TPatchValues>) => {
	return {
		useCollectionQuery(data: TCollectionData) {
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
		useFetchQuery(data: TFetchData, opts?: withQuery.QueryOptions<TResult> | undefined) {
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
