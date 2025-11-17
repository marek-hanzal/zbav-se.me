import { Effect } from "effect";
import { DateTime } from "luxon";
import type { ListingScoreTypeSchema } from "../../../app/listing-score/schema/ListingScoreTypeSchema";
import type { WithDatabase } from "../../../database/WithDatabase";
import { TooManyRequests } from "../../../error/TooManyRequests";

export namespace listingScoreRateLimitFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
		score: ListingScoreTypeSchema.Type;
		minutes?: number;
	}
}

export const listingScoreRateLimitFx = ({
	database,
	userId,
	listingId,
	score,
	minutes = 10,
}: listingScoreRateLimitFx.Props) => {
	return Effect.gen(function* () {
		const listingScore = yield* Effect.promise(async () => {
			return database
				.selectFrom("listing_score")
				.select("createdAt")
				.where("userId", "=", userId)
				.where("listingId", "=", listingId)
				.where("type", "=", score)
				.where(
					"createdAt",
					">=",
					DateTime.now()
						.minus({
							minutes,
						})
						.toJSDate(),
				)
				.orderBy("createdAt", "desc")
				.executeTakeFirst();
		});

		if (listingScore) {
			return yield* Effect.fail(
				new TooManyRequests({
					message: "You have already scored this listing",
				}),
			);
		}

		return yield* Effect.void;
	});
};

export type listingScoreRateLimitFx = ReturnType<typeof listingScoreRateLimitFx>;
