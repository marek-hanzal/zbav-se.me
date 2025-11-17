import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingQueryBuilder } from "../db/withListingQueryBuilder";
import { withListingSelect } from "../db/withListingSelect";
import type { ListingQuerySchema } from "../schema/ListingQuerySchema";
import { ListingSchema } from "../schema/ListingSchema";

export namespace listingCollectionFx {
	export interface Props {
		userId: string;
		query: ListingQuerySchema.Type;
	}
}

export const listingCollectionFx = ({
	userId,
	query: { cursor, filter, where, sort, meta },
}: listingCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCollection({
				select: withListingSelect({
					sort,
					meta,
					userId,
				}),
				output: ListingSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where,
				query(query) {
					return withListingQueryBuilder({
						userId,
						...query,
					});
				},
			});
		});
	});
};

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
