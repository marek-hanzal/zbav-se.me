import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { withListingScoreQueryBuilder } from "../db/withListingScoreQueryBuilder";
import { withListingScoreSelect } from "../db/withListingScoreSelect";
import type { ListingScoreCountQuerySchema } from "../schema/ListingScoreCountQuerySchema";

export namespace listingScoreCountFx {
	export interface Props {
		query: ListingScoreCountQuerySchema.Type;
	}
}

export const listingScoreCountFx = ({ query: { filter, where } }: listingScoreCountFx.Props) => {
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
