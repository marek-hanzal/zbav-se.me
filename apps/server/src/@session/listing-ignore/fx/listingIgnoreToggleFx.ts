import { Effect } from "effect";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { listingCheckIfOwnFx } from "../../listing/fx/listingCheckIfOwnFx";
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
	return withTransactionFx(
		Effect.gen(function* () {
			if (toggle) {
				yield* listingCheckIfOwnFx({
					listingId,
					errorMessage: "You cannot ignore your own listing",
				});

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
		}),
	);
};

export type listingIgnoreToggleFx = ReturnType<typeof listingIgnoreToggleFx>;
