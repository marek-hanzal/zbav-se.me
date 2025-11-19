import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { withListingFlagQueryBuilder } from "../db/withListingFlagQueryBuilder";
import { withListingFlagSelect } from "../db/withListingFlagSelect";
import type { ListingFlagQuerySchema } from "../schema/ListingFlagQuerySchema";
import { ListingFlagSchema } from "../schema/ListingFlagSchema";

export namespace listingFlagCollectionFx {
	export interface Props {
		query: ListingFlagQuerySchema.Type;
	}
}

export const listingFlagCollectionFx = ({
	query: { cursor, filter, where, sort },
}: listingFlagCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withListingFlagSelect({
					database,
					sort,
				}),
				output: ListingFlagSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingFlagQueryBuilder,
			});
		});
	});
};

export type listingFlagCollectionFx = ReturnType<typeof listingFlagCollectionFx>;
