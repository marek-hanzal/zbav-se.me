import { Effect } from "effect";
import { favouriteCreateFx } from "~/@user/favourite/fx/favouriteCreateFx";
import { favouriteDeleteFx } from "~/@user/favourite/fx/favouriteDeleteFx";
import type { FavouriteToggleSchema } from "~/@user/favourite/schema/FavouriteToggleSchema";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@user/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/@user/listing-event/fx/listingEventCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace favouriteToggleFx {
	export type Props = FavouriteToggleSchema.Type;
}

export const favouriteToggleFx = Effect.fn("favouriteToggleFx")(function* ({
	feedId,
	listingId,
	toggle,
}: favouriteToggleFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* listingCheckIfOwnFx({
				listingId,
				message: "You cannot add your own listing to favourites",
			});

			return yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* favouriteCreateFx({
							feedId,
							listingId,
						});

						yield* listingEventCreateFx({
							listingId,
							event: "favourite",
						}).pipe(Effect.ignore);

						return yield* listingFetchFx({
							where: {
								id: listingId,
							},
						});
					});
				},
				onFalse() {
					return Effect.gen(function* () {
						yield* favouriteDeleteFx({
							listingId,
						});

						yield* listingEventCreateFx({
							listingId,
							event: "unfavourite",
						}).pipe(Effect.ignore);

						return yield* listingFetchFx({
							where: {
								id: listingId,
							},
						});
					});
				},
			});
		}),
	);
});

export type favouriteToggleFx = ReturnType<typeof favouriteToggleFx>;
