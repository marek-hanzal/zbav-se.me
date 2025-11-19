import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
import { listingScoreCreateFx } from "../../listing-score/fx/listingScoreCreateFx";
import type { ListingCartToggleSchema } from "../schema/ListingCartToggleSchema";
import { listingCartCreateFx } from "./listingCartCreateFx";
import { listingCartDeleteFx } from "./listingCartDeleteFx";

export namespace listingCartToggleFx {
	export interface Props {
		data: ListingCartToggleSchema.Type;
	}
}

export const listingCartToggleFx = ({ data: { toggle, listingId } }: listingCartToggleFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		if (toggle) {
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
					message: "You cannot add your own listing to cart",
				});
			}

			yield* listingCartCreateFx({
				listingId,
			});

			yield* listingScoreCreateFx({
				listingId,
				score: "cart",
			}).pipe(Effect.ignore);

			return yield* Effect.void;
		}

		yield* listingCartDeleteFx({
			listingId,
		});

		return yield* Effect.void;
	});
};

export type listingCartToggleFx = ReturnType<typeof listingCartToggleFx>;
