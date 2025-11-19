import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
import { UserContextFx } from "../../../fx/UserContextFx";
import { ListingScoreContextFx, type ListingScoreType } from "./ListingScoreContextFx";
import { listingScoreRateLimitFx } from "./listingScoreRateLimitFx";

export namespace listingScoreCreateFx {
	export interface Props {
		listingId: string;
		score: ListingScoreType;
	}
}

export const listingScoreCreateFx = ({ listingId, score }: listingScoreCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;
		const scores = yield* ListingScoreContextFx;

		const listing = yield* Effect.tryPromise(async () => {
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

		return yield* Effect.tryPromise(async () => {
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
							score: scores[score],
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
							score: scores[score],
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
