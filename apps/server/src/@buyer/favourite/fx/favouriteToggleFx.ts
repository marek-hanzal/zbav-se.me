import { Effect } from "effect";
import { favouriteCreateFx } from "~/@buyer/favourite/fx/favouriteCreateFx";
import { favouriteDeleteFx } from "~/@buyer/favourite/fx/favouriteDeleteFx";
import type { FavouriteToggleSchema } from "~/@buyer/favourite/schema/FavouriteToggleSchema";
import { listingCheckIfOwnFx } from "~/@buyer/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@buyer/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/@buyer/listing-event/fx/listingEventCreateFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "favouriteToggleFx",
		input: {
			userId,
			feedId,
			listingId,
			toggle,
		},
	});

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
