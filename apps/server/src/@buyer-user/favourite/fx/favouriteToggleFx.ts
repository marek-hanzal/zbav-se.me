import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@buyer-user/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@buyer-user/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/@buyer-session/listing-event/fx/listingEventCreateFx";
import type { FavouriteToggleSchema } from "~/@buyer-user/favourite/schema/FavouriteToggleSchema";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { favouriteCreateFx } from "~/@buyer-user/favourite/fx/favouriteCreateFx";
import { favouriteDeleteFx } from "~/@buyer-user/favourite/fx/favouriteDeleteFx";

export namespace favouriteToggleFx {
	export interface Props extends FavouriteToggleSchema.Type {
		userId: string;
	}
}

export const favouriteToggleFx = Effect.fn("favouriteToggleFx")(function* ({
	userId,
	feedId,
	listingId,
	toggle,
}: favouriteToggleFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* listingCheckIfOwnFx({
				userId,
				listingId,
				message: "You cannot add your own listing to favourites",
			});

			return yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* favouriteCreateFx({
							feedId,
							listingId,
							userId,
						});

						yield* listingEventCreateFx({
							userId,
							listingId,
							event: "favourite",
						}).pipe(Effect.ignore);

						return yield* listingFetchFx({
							userId,
							where: {
								id: listingId,
							},
							scope: {},
						});
					});
				},
				onFalse() {
					return Effect.gen(function* () {
						yield* favouriteDeleteFx({
							listingId,
							userId,
						});

						yield* listingEventCreateFx({
							userId,
							listingId,
							event: "unfavourite",
						}).pipe(Effect.ignore);

						return yield* listingFetchFx({
							userId,
							where: {
								id: listingId,
							},
							scope: {},
						});
					});
				},
			});
		}),
	);
});

export type favouriteToggleFx = ReturnType<typeof favouriteToggleFx>;
