import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingScoreQueryBuilder } from "~/app/listing-score/db/withListingScoreQueryBuilder";
import { withListingScoreSelect } from "~/app/listing-score/db/withListingScoreSelect";
import type { ListingScoreCountQuerySchema } from "~/app/listing-score/schema/ListingScoreCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace listingScoreCountFx {
	export type Props = ListingScoreCountQuerySchema.Type;
}

export const listingScoreCountFx = (query: listingScoreCountFx.Props) => {
	const { filter, where } = query;
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withListingScoreSelect({
					database,
					sort: undefined,
				}),
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingScoreQueryBuilder,
			});
		});
	});
};

export type listingScoreCountFx = ReturnType<typeof listingScoreCountFx>;
