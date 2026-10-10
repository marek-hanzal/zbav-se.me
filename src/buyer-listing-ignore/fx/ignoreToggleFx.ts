import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/buyer-listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/buyer-listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/buyer-listing-event/fx/listingEventCreateFx";
import { ignoreCreateFx } from "~/buyer-listing-ignore/fx/ignoreCreateFx";
import { ignoreDeleteFx } from "~/buyer-listing-ignore/fx/ignoreDeleteFx";
import type { IgnoreToggleSchema } from "~/buyer-listing-ignore/schema/IgnoreToggleSchema";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { activityCreateFx } from "~/user-activity/fx/activityCreateFx";

export namespace ignoreToggleFx {
	export interface Props extends IgnoreToggleSchema.Type {
		userId: string;
	}
}

export const ignoreToggleFx = Effect.fn("ignoreToggleFx")(function* ({
	userId,
	toggle,
	listingId,
	meta,
}: ignoreToggleFx.Props) {
	const logger = yield* getLoggerFx("ignoreToggleFx");
	logger.trace("ignoreToggleFx", {
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
				message: "You cannot ignore your own listing",
			});

			if (toggle) {
				yield* ignoreCreateFx({
					userId,
					listingId,
				});

				yield* listingEventCreateFx({
					userId,
					listingId,
					event: "listing.ignore",
					checkVisibility: false,
				}).pipe(Effect.ignore);

				yield* activityCreateFx({
					userId: listingUserId,
					reference: [
						listingId,
					],
					family: "reaction",
					type: "listing.ignore",
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
				yield* ignoreDeleteFx({
					userId,
					listingId,
				});

				yield* listingEventCreateFx({
					userId,
					listingId,
					event: "unignore",
					checkVisibility: false,
				}).pipe(Effect.ignore);

				yield* activityCreateFx({
					userId: listingUserId,
					reference: [
						listingId,
					],
					family: "reaction",
					type: "unignore",
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

export type ignoreToggleFx = ReturnType<typeof ignoreToggleFx>;
