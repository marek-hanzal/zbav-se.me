import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
import { UserContextFx } from "../../../fx/UserContextFx";
import { listingScoreCreateFx } from "../../listing-score/fx/listingScoreCreateFx";
import type { ListingIgnoreToggleSchema } from "../schema/ListingIgnoreToggleSchema";
import { listingIgnoreCreateFx } from "./listingIgnoreCreateFx";
import { listingIgnoreDeleteFx } from "./listingIgnoreDeleteFx";

export namespace listingIgnoreToggleFx {
	export interface Props {
		data: ListingIgnoreToggleSchema.Type;
	}
}

export const listingIgnoreToggleFx = ({
	data: { toggle, listingId },
}: listingIgnoreToggleFx.Props) => {
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
					message: "You cannot ignore your own listing",
				});
			}

			yield* listingIgnoreCreateFx({
				listingId,
			});

			yield* listingScoreCreateFx({
				listingId,
				score: "ignore",
			}).pipe(Effect.ignore);

			return Effect.void;
		}

		yield* listingIgnoreDeleteFx({
			listingId,
		});

		return Effect.void;
	});
};

export type listingIgnoreToggleFx = ReturnType<typeof listingIgnoreToggleFx>;
