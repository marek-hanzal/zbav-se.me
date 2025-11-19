import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
import { listingScoreCreateFx } from "../../listing-score/fx/listingScoreCreateFx";
import type { ListingFlagToggleSchema } from "../schema/ListingFlagToggleSchema";
import { listingFlagCreateFx } from "./listingFlagCreateFx";
import { listingFlagDeleteFx } from "./listingFlagDeleteFx";

export namespace listingFlagToggleFx {
	export interface Props {
		data: ListingFlagToggleSchema.Type;
	}
}

export const listingFlagToggleFx = ({ data: { toggle, listingId } }: listingFlagToggleFx.Props) => {
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
					message: "You cannot flag your own listing",
				});
			}

			yield* listingFlagCreateFx({
				listingId,
			});

			yield* listingScoreCreateFx({
				listingId,
				score: "flag",
			}).pipe(Effect.ignore);

			return Effect.void;
		}

		yield* listingFlagDeleteFx({
			listingId,
		});

		return Effect.void;
	});
};

export type listingFlagToggleFx = ReturnType<typeof listingFlagToggleFx>;
