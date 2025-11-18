import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
import { listingScoreCreateFx } from "../../listing-score/service/listingScoreCreateFx";
import type { ListingFlagToggleSchema } from "../schema/ListingFlagToggleSchema";
import { listingFlagCreateFx } from "./listingFlagCreateFx";
import { listingFlagDeleteFx } from "./listingFlagDeleteFx";

export namespace listingFlagToggleFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		data: ListingFlagToggleSchema.Type;
	}
}

export const listingFlagToggleFx = ({
	database,
	userId,
	data: { toggle, listingId },
}: listingFlagToggleFx.Props) => {
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
						message: "You cannot flag your own listing",
					}),
				);
			}

			yield* listingFlagCreateFx({
				database,
				userId,
				listingId,
			});

			yield* listingScoreCreateFx({
				database,
				userId,
				listingId,
				score: "flag",
			}).pipe(Effect.ignore);

			return Effect.void;
		}

		yield* listingFlagDeleteFx({
			database,
			userId,
			listingId,
		});

		return Effect.void;
	});
};

export type listingFlagToggleFx = ReturnType<typeof listingFlagToggleFx>;
