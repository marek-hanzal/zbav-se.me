import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { flagCreateFx } from "~/buyer/flag/server/fx/flagCreateFx";
import { flagDeleteFx } from "~/buyer/flag/server/fx/flagDeleteFx";
import type { FlagToggleSchema } from "~/buyer/flag/server/schema/FlagToggleSchema";
import { listingCheckIfOwnFx } from "~/buyer/listing/server/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/buyer/listing/server/fx/listingFetchFx";
import { listingEventCreateFx } from "~/buyer/listing-event/server/fx/listingEventCreateFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";

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

			return yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* flagCreateFx({
							userId,
							listingId,
						});

						yield* listingEventCreateFx({
							userId,
							listingId,
							event: "flag",
						}).pipe(Effect.ignore);

						yield* activityCreateFx({
							userId: listingUserId,
							reference: [
								listingId,
							],
							family: "reaction",
							type: "flag",
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
						yield* flagDeleteFx({
							userId,
							listingId,
						});

						yield* listingEventCreateFx({
							userId,
							listingId,
							event: "unflag",
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
					});
				},
			});
		}),
	);
});

export type flagToggleFx = ReturnType<typeof flagToggleFx>;
