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
			yield* listingCheckIfOwnFx({
				listingId,
				message: "You cannot flag your own listing",
			});

			yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* listingFlagCreateFx({
							listingId,
						});

						yield* listingScoreCreateFx({
							listingId,
							score: "flag",
						}).pipe(Effect.ignore);

						return yield* Effect.void;
					});
				},
				onFalse() {
					return Effect.gen(function* () {
						yield* listingFlagDeleteFx({
							listingId,
						});

						return yield* Effect.void;
					});
				},
			});
		}),
	);
};

export type listingFlagToggleFx = ReturnType<typeof listingFlagToggleFx>;
