import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withFeedQueryBuilder } from "~/@user/feed/db/withFeedQueryBuilder";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import type { FeedQuerySchema } from "../../feed/schema/FeedQuerySchema";
import { withListingCartFeedSelect } from "../db/withListingCartFeedSelect";
import { ListingCartFeedSchema } from "../schema/ListingCartFeedSchema";

export namespace listingCartFeedCollectionFx {
	export interface Props {
		query: FeedQuerySchema.Type;
	}
}

export const listingCartFeedCollectionFx = ({
	query: { cursor, filter, where, sort },
}: listingCartFeedCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withListingCartFeedSelect({
					database,
					sort,
					userId: user.id,
				}),
				output: ListingCartFeedSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withFeedQueryBuilder,
			});
		});
	});
};

export type listingCartFeedCollectionFx = ReturnType<typeof listingCartFeedCollectionFx>;
