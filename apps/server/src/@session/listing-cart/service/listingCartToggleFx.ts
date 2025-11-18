import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
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

			if (listing.userId === userId) {
				return yield* new InvalidRequestError({
					message: "You cannot add your own listing to cart",
				});
			}

			yield* listingCartCreateFx({
				database,
				userId,
				listingId,
			});

			yield* listingScoreCreateFx({
				database,
				userId,
				listingId,
				score: "cart",
			}).pipe(Effect.ignore);

			return yield* Effect.void;
		}

		yield* listingCartDeleteFx({
			database,
			userId,
			listingId,
		});

		return yield* Effect.void;
	});
};

export type listingCartToggleFx = ReturnType<typeof listingCartToggleFx>;
