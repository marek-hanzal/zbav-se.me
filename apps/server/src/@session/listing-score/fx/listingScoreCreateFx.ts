import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { listingCheckIfOwnFx } from "../../listing/fx/listingCheckIfOwnFx";
import { ListingScoreContextFx, type ListingScoreType } from "./ListingScoreContextFx";
import { listingScoreRateLimitFx } from "./listingScoreRateLimitFx";

export namespace listingScoreCreateFx {
	export interface Props {
		listingId: string;
		score: ListingScoreType;
	}
}

export const listingScoreCreateFx = ({ listingId, score }: listingScoreCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;
			const scores = yield* ListingScoreContextFx;

			yield* listingCheckIfOwnFx({
				listingId,
				errorMessage: "You cannot score your own listing",
			});

			yield* listingScoreRateLimitFx({
				listingId,
				score,
			});

			// TODO Use Effect's match
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
		}),
	);
};

export type listingScoreCreateFx = ReturnType<typeof listingScoreCreateFx>;
