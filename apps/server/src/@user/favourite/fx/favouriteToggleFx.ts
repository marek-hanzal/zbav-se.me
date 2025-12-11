import { Effect } from "effect";
import { favouriteCreateFx } from "~/@user/favourite/fx/favouriteCreateFx";
import { favouriteDeleteFx } from "~/@user/favourite/fx/favouriteDeleteFx";
import type { FavouriteToggleSchema } from "~/@user/favourite/schema/FavouriteToggleSchema";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingScoreCreateFx } from "~/@user/listing-score/fx/listingScoreCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace favouriteToggleFx {
	export type Props = FavouriteToggleSchema.Type;
}

export const favouriteToggleFx = ({ feedId, listingId, toggle }: favouriteToggleFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			yield* listingCheckIfOwnFx({
				listingId,
				message: "You cannot add your own listing to favourites",
			});

			yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* favouriteCreateFx({
							feedId,
							listingId,
						});

						yield* listingScoreCreateFx({
							listingId,
							score: "favourite",
						}).pipe(Effect.ignore);

						return yield* Effect.void;
					});
				},
				onFalse() {
					return Effect.gen(function* () {
						yield* favouriteDeleteFx({
							listingId,
						});

						return yield* Effect.void;
					});
				},
			});
		}),
	);
};

export type favouriteToggleFx = ReturnType<typeof favouriteToggleFx>;
