import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/buyer-listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/buyer-listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/buyer-listing-event/fx/listingEventCreateFx";
import { flagCreateFx } from "~/buyer-listing-flag/fx/flagCreateFx";
import { flagDeleteFx } from "~/buyer-listing-flag/fx/flagDeleteFx";
import type { FlagToggleSchema } from "~/buyer-listing-flag/schema/FlagToggleSchema";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { activityCreateFx } from "~/user-activity/fx/activityCreateFx";

export namespace flagToggleFx {
	export interface Props extends FlagToggleSchema.Type {
		userId: string;
	}
}

export const flagToggleFx = Effect.fn("flagToggleFx")(function* ({
	userId,
	toggle,
	listingId,
	meta,
}: flagToggleFx.Props) {
	const logger = yield* getLoggerFx("flagToggleFx");
	logger.trace("flagToggleFx", {
		userId,
		toggle,
		listingId,
		meta,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const listingUserId = yield* listingCheckIfOwnFx({
				userId,
				listingId,
				message: "You cannot flag your own listing",
			});

			if (toggle) {
				yield* flagCreateFx({
					userId,
					listingId,
				});

				yield* listingEventCreateFx({
					userId,
					listingId,
					event: "listing.flag",
					checkVisibility: false,
				}).pipe(Effect.ignore);

				yield* activityCreateFx({
					userId: listingUserId,
					reference: [
						listingId,
					],
					family: "reaction",
					type: "listing.flag",
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
					meta,
				});
			} else {
				yield* flagDeleteFx({
					userId,
					listingId,
				});

				yield* listingEventCreateFx({
					userId,
					listingId,
					event: "unflag",
					checkVisibility: false,
				}).pipe(Effect.ignore);

				yield* activityCreateFx({
					userId: listingUserId,
					reference: [
						listingId,
					],
					family: "reaction",
					type: "unflag",
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
					meta,
				});
			}
		}),
	);
});

export type flagToggleFx = ReturnType<typeof flagToggleFx>;
