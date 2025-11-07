import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InfraError } from "../../../error/InfraError";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
import type { ListingScoreTypeSchema } from "../schema/ListingScoreTypeSchema";
import { listingScoreRateLimit } from "./listingScoreRateLimit";

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
			});
		}),
		Effect.andThen(() => {
			return Effect.tryPromise({
				try: () => {
					return database
						.insertInto("listing_score")
						.values({
							id: genId(),
							listingId,
							userId,
							score: match(score)
								.with("listing", () => 1)
								.with("ignore", () => -3)
								.with("view", () => 5)
								.with("cart", () => 15)
								.exhaustive(),
							type: score,
							createdAt: new Date(),
						})
						.returningAll()
						.executeTakeFirst();
				},
				catch: (e) => {
					return new InfraError({
						type: "database",
						message:
							e instanceof Error ? e.message : "Unknown error",
					});
				},
			}).pipe(
				Effect.andThen((row) => {
					if (row) {
						return Effect.succeed(row);
					}
					return Effect.fail(
						new InfraError({
							type: "database",
							message: "Failed to fetch created listing score",
						}),
					);
				}),
			);
		}),
	);
};

export type createListingScore = ReturnType<typeof createListingScore>;
