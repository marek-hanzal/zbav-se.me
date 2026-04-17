import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { ignoreCreateFx } from "~/buyer/ignore/server/fx/ignoreCreateFx";
import { ignoreDeleteFx } from "~/buyer/ignore/server/fx/ignoreDeleteFx";
import type { IgnoreToggleSchema } from "~/buyer/ignore/server/schema/IgnoreToggleSchema";
import { listingCheckIfOwnFx } from "~/buyer/listing/server/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/buyer/listing/server/fx/listingFetchFx";
import { listingEventCreateFx } from "~/buyer/listing-event/server/fx/listingEventCreateFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";

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

			return yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* ignoreCreateFx({
							userId,
							listingId,
						});

						yield* listingEventCreateFx({
							userId,
							listingId,
							event: "ignore",
						}).pipe(Effect.ignore);

						yield* activityCreateFx({
							userId: listingUserId,
							reference: [
								listingId,
							],
							family: "reaction",
							type: "ignore",
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
					});
				},
				onFalse() {
					return Effect.gen(function* () {
						yield* ignoreDeleteFx({
							userId,
							listingId,
						});

						yield* listingEventCreateFx({
							userId,
							listingId,
							event: "unignore",
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
					});
				},
			});
		}),
	);
});

export type ignoreToggleFx = ReturnType<typeof ignoreToggleFx>;
