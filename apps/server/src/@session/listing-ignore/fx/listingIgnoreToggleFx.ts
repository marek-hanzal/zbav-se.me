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
			yield* listingCheckIfOwnFx({
				listingId,
				message: "You cannot ignore your own listing",
			});

			yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* listingIgnoreCreateFx({
							listingId,
						});

						yield* listingScoreCreateFx({
							listingId,
							score: "ignore",
						}).pipe(Effect.ignore);

						return yield* Effect.void;
					});
				},
				onFalse() {
					return Effect.gen(function* () {
						yield* listingIgnoreDeleteFx({
							listingId,
						});

						return yield* Effect.void;
					});
				},
			});
		}),
	);
};

export type listingIgnoreToggleFx = ReturnType<typeof listingIgnoreToggleFx>;
