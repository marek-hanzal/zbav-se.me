import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InfraError } from "../../../error/InfraError";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
import type { ListingScoreTypeSchema } from "../schema/ListingScoreTypeSchema";
import { listingScoreRateLimit } from "./listingScoreRateLimit";

const ScoreList: Record<ListingScoreTypeSchema.Type, number> = {
	listing: 1,
	ignore: -3,
	view: 5,
	cart: 15,
};

export namespace createListingScore {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
		score: ListingScoreTypeSchema.Type;
	}
}

export const createListingScore = ({
	database,
	userId,
	listingId,
	score,
}: createListingScore.Props) => {
	return Effect.tryPromise({
		try: () =>
			database
				.selectFrom("listing")
				.select("userId")
				.where("id", "=", listingId)
				.executeTakeFirst(),
		catch: (e) => {
			return new InfraError({
				type: "database",
				message: e instanceof Error ? e.message : "Unknown error",
			});
		},
	}).pipe(
		Effect.flatMap((row) => {
			if (row) {
				return Effect.succeed(row);
			}
			return Effect.fail(
				new NotFoundError({
					resource: "listing",
					resourceId: listingId,
					message: "Listing not found",
				}),
			);
		}),
		Effect.filterOrFail(
			(row) => row.userId !== userId,
			() => {
				return new InvalidRequestError({
					message: "You cannot score your own listing",
				});
			},
		),
		Effect.tap(() => {
			return listingScoreRateLimit({
				database,
				userId,
				listingId,
				score,
			});
		}),
		Effect.andThen(() => {
			return Effect.tryPromise({
				try() {
					/**
					 * Some of the scores may have different implementations.
					 */
					return match(score)
						.with("cart", async (score) => {
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
								.executeTakeFirst();
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
								.executeTakeFirst();
						});
				},
				catch(e) {
					return new InfraError({
						type: "database",
						message:
							e instanceof Error ? e.message : "Unknown error",
					});
				},
			});
		}),
	);
};

export type createListingScore = ReturnType<typeof createListingScore>;
