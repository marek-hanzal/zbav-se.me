import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { withListingCartQueryBuilder } from "../db/withListingCartQueryBuilder";
import { withListingCartSelect } from "../db/withListingCartSelect";
import type { ListingCartQuerySchema } from "../schema/ListingCartQuerySchema";
import { ListingCartSchema } from "../schema/ListingCartSchema";

export namespace listingCartCollectionFx {
	export interface Props {
		query: ListingCartQuerySchema.Type;
	}
}

export const listingCartCollectionFx = ({
	query: { cursor, filter, where, sort },
}: listingCartCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.promise(async () => {
			return withCollection({
				select: withListingCartSelect({
					database,
					sort,
				}),
				output: ListingCartSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingCartQueryBuilder,
			});
		});
	});
};

export type listingCartCollectionFx = ReturnType<typeof listingCartCollectionFx>;
