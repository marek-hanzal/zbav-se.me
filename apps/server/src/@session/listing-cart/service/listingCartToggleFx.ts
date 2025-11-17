import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { listingScoreCreateFx } from "../../listing-score/service/listingScoreCreateFx";
import type { ListingCartToggleSchema } from "../schema/ListingCartToggleSchema";
import { listingCartCreateFx } from "./listingCartCreateFx";
import { listingCartDeleteFx } from "./listingCartDeleteFx";

export namespace listingCartToggleFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		data: ListingCartToggleSchema.Type;
	}
}

export const listingCartToggleFx = ({
	database,
	userId,
	data: { toggle, listingId },
}: listingCartToggleFx.Props) => {
	return Effect.gen(function* () {
		if (toggle) {
			const listing = yield* Effect.promise(async () => {
				return database
					.selectFrom("listing")
					.select("id")
					.where("id", "=", listingId)
					.where("userId", "=", userId)
					.executeTakeFirst();
			});

			if (listing) {
				return yield* Effect.fail(
					new InvalidRequestError({
						message: "You cannot add your own listing to cart",
					}),
				);
			}

			yield* listingCartCreateFx({
				database,
				userId,
				listingId,
			});

			return yield* listingScoreCreateFx({
				database,
				userId,
				listingId,
				score: "cart",
			});
		}

		return yield* listingCartDeleteFx({
			database,
			userId,
			listingId,
		});
	});
};

export type listingCartToggleFx = ReturnType<typeof listingCartToggleFx>;
