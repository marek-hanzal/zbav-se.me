import { Effect } from "effect";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
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
			const listing = yield* Effect.promise(async () => {
				return database
					.selectFrom("listing")
					.select("id")
					.where("id", "=", listingId)
					.where("userId", "=", user.id)
					.executeTakeFirst();
			});

			if (listing) {
				return yield* new InvalidRequestError({
					message: "You cannot ignore your own listing",
				});
			}

			yield* listingIgnoreCreateFx({
				listingId,
			});

			return yield* listingScoreCreateFx({
				listingId,
				score: "ignore",
			});
		}

		return yield* listingIgnoreDeleteFx({
			listingId,
		});
	});
};

export type listingIgnoreToggleFx = ReturnType<typeof listingIgnoreToggleFx>;
