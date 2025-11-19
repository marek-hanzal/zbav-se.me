import { Effect } from "effect";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { listingCheckIfOwnFx } from "../../listing/fx/listingCheckIfOwnFx";
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
	return withTransactionFx(
		Effect.gen(function* () {
			if (toggle) {
				yield* listingCheckIfOwnFx({
					listingId,
					errorMessage: "You cannot flag your own listing",
				});

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
		}),
	);
};

export type listingFlagToggleFx = ReturnType<typeof listingFlagToggleFx>;
