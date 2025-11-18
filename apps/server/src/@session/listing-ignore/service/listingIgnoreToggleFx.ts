import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { listingScoreCreateFx } from "../../listing-score/service/listingScoreCreateFx";
import type { ListingIgnoreToggleSchema } from "../schema/ListingIgnoreToggleSchema";
import { listingIgnoreCreateFx } from "./listingIgnoreCreateFx";
import { listingIgnoreDeleteFx } from "./listingIgnoreDeleteFx";

export namespace listingIgnoreToggleFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		data: ListingIgnoreToggleSchema.Type;
	}
}

export const listingIgnoreToggleFx = ({
	database,
	userId,
	data: { toggle, listingId },
}: listingIgnoreToggleFx.Props) => {
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
						message: "You cannot ignore your own listing",
					}),
				);
			}

			yield* listingIgnoreCreateFx({
				database,
				userId,
				listingId,
			});

			return yield* listingScoreCreateFx({
				database,
				userId,
				listingId,
				score: "ignore",
			});
		}

		return yield* listingIgnoreDeleteFx({
			database,
			userId,
			listingId,
		});
	});
};

export type listingIgnoreToggleFx = ReturnType<typeof listingIgnoreToggleFx>;
