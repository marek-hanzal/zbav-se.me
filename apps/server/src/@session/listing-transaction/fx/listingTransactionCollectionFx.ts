import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { withListingTransactionQueryBuilder } from "../db/withListingTransactionQueryBuilder";
import { withListingTransactionSelect } from "../db/withListingTransactionSelect";
import type { ListingTransactionQuerySchema } from "../schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "../schema/ListingTransactionSchema";

export namespace listingTransactionCollectionFx {
	export interface Props {
		query: ListingTransactionQuerySchema.Type;
	}
}

export const listingTransactionCollectionFx = ({
	query: { filter, where, cursor, sort, meta },
}: listingTransactionCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.promise(async () => {
			return withCollection({
				select: withListingTransactionSelect({
					database,
					sort,
				}),
				output: ListingTransactionSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query(query) {
					return withListingTransactionQueryBuilder({
						meta,
						...query,
					});
				},
			});
		});
	});
};

export type listingTransactionCollectionFx = ReturnType<typeof listingTransactionCollectionFx>;
