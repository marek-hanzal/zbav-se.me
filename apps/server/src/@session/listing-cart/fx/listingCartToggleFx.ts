import { Effect } from "effect";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { listingCheckIfOwnFx } from "../../listing/fx/listingCheckIfOwnFx";
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
	return withTransactionFx(
		Effect.gen(function* () {
			yield* listingCheckIfOwnFx({
				listingId,
				errorMessage: "You cannot add your own listing to cart",
			});

			yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* listingCartCreateFx({
							listingId,
						});

						yield* listingScoreCreateFx({
							listingId,
							score: "cart",
						}).pipe(Effect.ignore);

						return yield* Effect.void;
					});
				},
				onFalse() {
					return Effect.gen(function* () {
						yield* listingCartDeleteFx({
							listingId,
						});

						return yield* Effect.void;
					});
				},
			});
		}),
	);
};

export type listingCartToggleFx = ReturnType<typeof listingCartToggleFx>;
