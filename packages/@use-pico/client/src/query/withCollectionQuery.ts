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
		toFetchKey(item: TResult): TFetchData;
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
	toFetchKey,
}: withCollectionQuery.Props<TCollectionData, TResult, TFetchData, TPatchValues>) => {
	return {
		useSuspenseQuery(data: TCollectionData) {
			const set = fetchQuery.useSet();

			return useSuspenseQuery({
				queryKey: key(data),
				async queryFn() {
					const response = await collectionQuery.query(data);
					response.forEach((item) => {
						set(() => item, toFetchKey(item));
					});
					return response;
				},
			});
		},
		useMutation() {
			const set = fetchQuery.useSet();

			const mutation = patchMutation.useMutation({
				async onPostMutation({ result }) {
					set(() => result, toFetchKey(result));
				},
			});

			return mutation;
		},
	};
};
