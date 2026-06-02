import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/buyer/listing/server/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/buyer/listing/server/fx/listingFetchFx";
import { listingEventCreateFx } from "~/buyer/listing-event/server/fx/listingEventCreateFx";
import { favouriteCreateFx } from "~/buyer/listing-favourite/server/fx/favouriteCreateFx";
import { favouriteDeleteFx } from "~/buyer/listing-favourite/server/fx/favouriteDeleteFx";
import type { FavouriteToggleSchema } from "~/buyer/listing-favourite/server/schema/FavouriteToggleSchema";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";

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
	meta,
}: favouriteToggleFx.Props) {
	const logger = yield* getLoggerFx("favouriteToggleFx", "listing_favourite");
	logger.trace("Request", {
		userId,
		feedId,
		listingId,
		toggle,
		meta,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const listingUserId = yield* listingCheckIfOwnFx({
				userId,
				listingId,
				message: "You cannot add your own listing to favourites",
			});

			yield* Effect.if(toggle, {
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
							event: "listing.favourite",
							checkVisibility: false,
						}).pipe(Effect.ignore);

						yield* activityCreateFx({
							userId: listingUserId,
							reference: [
								listingId,
							],
							family: "reaction",
							type: "listing.favourite",
							payload: {
								listingId,
							},
							priority: "common",
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
							checkVisibility: false,
						}).pipe(Effect.ignore);

						yield* activityCreateFx({
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
					});
				},
			});

			return yield* listingFetchFx({
				userId,
				where: {
					id: listingId,
				},
				scope: {},
				meta,
			});
		}),
	);
});

export type favouriteToggleFx = ReturnType<typeof favouriteToggleFx>;
