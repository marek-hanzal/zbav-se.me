import { Effect } from "effect";
import { DateTime } from "luxon";
import type { ListingScoreTypeSchema } from "../../../app/listing-score/schema/ListingScoreTypeSchema";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InfraError } from "../../../error/InfraError";
import { TooManyRequests } from "../../../error/TooManyRequests";

export namespace listingScoreRateLimit {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
		score: ListingScoreTypeSchema.Type;
		minutes?: number;
	}
}

export const listingScoreRateLimit = ({
	database,
	userId,
	listingId,
	score,
	minutes = 10,
}: listingScoreRateLimit.Props) => {
	const rateLimit = DateTime.now()
		.minus({
			minutes,
		})
		.toJSDate();

	return Effect.tryPromise({
		try: () => {
			return database
				.selectFrom("listing_score")
				.select("createdAt")
				.where("userId", "=", userId)
				.where("listingId", "=", listingId)
				.where("type", "=", score)
				.where("createdAt", ">=", rateLimit)
				.orderBy("createdAt", "desc")
				.executeTakeFirst();
		},
		catch: (e) => {
			return new InfraError({
				type: "database",
				message: e instanceof Error ? e.message : "Unknown error",
			});
		},
	}).pipe(
		Effect.filterOrFail(
			(row) => !row,
			() => {
				return new TooManyRequests({
					message: "You have already scored this listing",
				});
			},
		),
		Effect.asVoid,
	);
};
