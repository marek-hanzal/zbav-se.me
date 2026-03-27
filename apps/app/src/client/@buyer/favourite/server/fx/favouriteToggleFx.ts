import { Effect } from "effect";
import { favouriteCreateFx } from "~/client/@buyer/favourite/server/fx/favouriteCreateFx";
import { favouriteDeleteFx } from "~/client/@buyer/favourite/server/fx/favouriteDeleteFx";
import type { FavouriteToggleSchema } from "~/client/@buyer/favourite/server/schema/FavouriteToggleSchema";
import { listingCheckIfOwnFx } from "~/client/@buyer/listing/server/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/client/@buyer/listing/server/fx/listingFetchFx";
import { listingEventCreateFx } from "~/client/@buyer/listing-event/server/fx/listingEventCreateFx";
import { inboxCreateFx } from "~/client/@user/inbox/server/fx/inboxCreateFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

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
			const listingUserId = yield* listingCheckIfOwnFx({
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

						yield* inboxCreateFx({
							userId: listingUserId,
							reference: [
								listingId,
							],
							family: "reaction",
							type: "favourite",
							payload: {
								listingId,
							},
							priority: "common",
						});

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

						yield* inboxCreateFx({
							userId: listingUserId,
							reference: [
								listingId,
							],
							family: "reaction",
							type: "unfavourite",
							payload: {
								listingId,
							},
							priority: "common",
						});

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
