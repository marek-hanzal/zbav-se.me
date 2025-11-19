import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { ListingScoreTypeSchema } from "../../../app/listing-score/schema/ListingScoreTypeSchema";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
import { DatabaseContextFx } from "../../../service/DatabaseContextFx";
import { UserContextFx } from "../../../service/UserContextFx";
import { listingScoreRateLimitFx } from "./listingScoreRateLimitFx";

const ScoreList: Record<ListingScoreTypeSchema.Type, number> = {
	listing: 1,
	ignore: -3,
	view: 5,
	cart: 15,
	flag: -15,
};

export namespace listingScoreCreateFx {
	export interface Props {
		listingId: string;
		score: ListingScoreTypeSchema.Type;
	}
}

export const listingScoreCreateFx = ({ listingId, score }: listingScoreCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const listing = yield* Effect.promise(async () => {
			return database
				.selectFrom("listing")
				.select("userId")
				.where("id", "=", listingId)
				.executeTakeFirst();
		});

		if (!listing) {
			return yield* new NotFoundError({
				resource: "listing",
				resourceId: listingId,
				message: "Listing not found",
			});
		}

		if (listing.userId === user.id) {
			return yield* new InvalidRequestError({
				message: "You cannot score your own listing",
			});
		}

		yield* listingScoreRateLimitFx({
			listingId,
			score,
		});

		return yield* Effect.promise(async () => {
			/**
			 * Some of the scores may have different implementations.
			 */
			return match(score)
				.with("cart", "flag", async (score) => {
					const row = await database
						.selectFrom("listing_score")
						.selectAll()
						.where("listingId", "=", listingId)
						.where("userId", "=", user.id)
						.where("type", "=", score)
						.executeTakeFirst();

					if (row) {
						return row;
					}

					return database
						.insertInto("listing_score")
						.values({
							id: genId(),
							listingId,
							userId: user.id,
							score: ScoreList[score],
							type: score,
							createdAt: new Date(),
						})
						.returningAll()
						.executeTakeFirstOrThrow();
				})
				.otherwise(async (score) => {
					return database
						.insertInto("listing_score")
						.values({
							id: genId(),
							listingId,
							userId: user.id,
							score: ScoreList[score],
							type: score,
							createdAt: new Date(),
						})
						.returningAll()
						.executeTakeFirstOrThrow();
				});
		});
	});
};

export type listingScoreCreateFx = ReturnType<typeof listingScoreCreateFx>;
