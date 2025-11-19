import { Effect } from "effect";
import { DateTime } from "luxon";
import type { ListingScoreTypeSchema } from "../../../app/listing-score/schema/ListingScoreTypeSchema";
import { TooManyRequests } from "../../../error/TooManyRequests";
import { DatabaseContextFx } from "../../../service/DatabaseContextFx";
import { UserContextFx } from "../../../service/UserContextFx";

export namespace listingScoreRateLimitFx {
	export interface Props {
		listingId: string;
		score: ListingScoreTypeSchema.Type;
		minutes?: number;
	}
}

export const listingScoreRateLimitFx = ({
	listingId,
	score,
	minutes = 10,
}: listingScoreRateLimitFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const listingScore = yield* Effect.promise(async () => {
			return database
				.selectFrom("listing_score")
				.select("createdAt")
				.where("userId", "=", user.id)
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
			return yield* new TooManyRequests({
				message: "You have already scored this listing",
			});
		}

		return yield* Effect.void;
	});
};

export type listingScoreRateLimitFx = ReturnType<typeof listingScoreRateLimitFx>;
