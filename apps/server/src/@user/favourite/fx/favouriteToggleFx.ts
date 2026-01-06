import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { FavouriteToggleSchema } from "~/@user/favourite/schema/FavouriteToggleSchema";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@user/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/@user/listing-event/fx/listingEventCreateFx";
import { favouriteCreateFx } from "~/app/favourite/fx/favouriteCreateFx";
import { favouriteDeleteFx } from "~/app/favourite/fx/favouriteDeleteFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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
							listingId,
							event: "favourite",
						}).pipe(Effect.ignore);

						return yield* listingFetchFx({
							userId,
							where: {
								id: listingId,
							},
							scope: {
								userId,
							},
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
							listingId,
							event: "unfavourite",
						}).pipe(Effect.ignore);

						return yield* listingFetchFx({
							userId,
							where: {
								id: listingId,
							},
							scope: {
								userId,
							},
						});
					});
				},
			});
		}),
	);
});

export type favouriteToggleFx = ReturnType<typeof favouriteToggleFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<favouriteToggleFx>, UserContextFx>>;
