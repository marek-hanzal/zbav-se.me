import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@buyer-session/listing/fx/listingCheckIfOwnFx";
import { listingEventCreateFx } from "~/@buyer-session/listing-event/fx/listingEventCreateFx";
import { favouriteCreateFx } from "~/@buyer-user/favourite/fx/favouriteCreateFx";
import { favouriteDeleteFx } from "~/@buyer-user/favourite/fx/favouriteDeleteFx";
import type { FavouriteToggleSchema } from "~/@buyer-user/favourite/schema/FavouriteToggleSchema";
import { listingFetchFx } from "~/@buyer-user/listing/fx/listingFetchFx";
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
	yield* Effect.annotateLogsScoped({
		"favouriteToggleFx.userId": userId,
		"favouriteToggleFx.feedId": feedId,
		"favouriteToggleFx.listingId": listingId,
		"favouriteToggleFx.toggle": toggle,
	});

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
