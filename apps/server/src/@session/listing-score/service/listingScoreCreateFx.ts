import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { ListingScoreTypeSchema } from "../../../app/listing-score/schema/ListingScoreTypeSchema";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
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
		database: WithDatabase;
		userId: string;
		listingId: string;
		score: ListingScoreTypeSchema.Type;
	}
}

export const listingScoreCreateFx = ({
	database,
	userId,
	listingId,
	score,
}: listingScoreCreateFx.Props) => {
	return Effect.gen(function* () {
		const listing = yield* Effect.promise(async () => {
			return database
				.selectFrom("listing")
				.select("userId")
				.where("id", "=", listingId)
				.executeTakeFirst();
		});

		if (!listing) {
			return yield* Effect.fail(
				new NotFoundError({
					resource: "listing",
					resourceId: listingId,
					message: "Listing not found",
				}),
			);
		}

		if (listing.userId === userId) {
			return yield* Effect.fail(
				new InvalidRequestError({
					message: "You cannot score your own listing",
				}),
			);
		}

		yield* listingScoreRateLimitFx({
			database,
			userId,
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
						.where("userId", "=", userId)
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
							userId,
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
							userId,
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
