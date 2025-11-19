import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withListingScoreQueryBuilder } from "../db/withListingScoreQueryBuilder";
import { withListingScoreSelect } from "../db/withListingScoreSelect";
import type { ListingScoreCountQuerySchema } from "../schema/ListingScoreCountQuerySchema";

export namespace listingScoreCountFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: ListingScoreCountQuerySchema.Type;
	}
}

export const listingScoreCountFx = ({
	database,
	userId,
	query: { filter, where },
}: listingScoreCountFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCount({
				select: withListingScoreSelect({
					database,
					sort: undefined,
				}),
				filter,
				where: {
					...where,
					userId,
				},
				query: withListingScoreQueryBuilder,
			});
		});
	});
};

export type listingScoreCountFx = ReturnType<typeof listingScoreCountFx>;
