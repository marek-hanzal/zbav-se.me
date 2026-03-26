import { Effect } from "effect";
import { ignoreCreateFx } from "~/server/@buyer/ignore/fx/ignoreCreateFx";
import { ignoreDeleteFx } from "~/server/@buyer/ignore/fx/ignoreDeleteFx";
import type { IgnoreToggleSchema } from "~/server/@buyer/ignore/schema/IgnoreToggleSchema";
import { listingCheckIfOwnFx } from "~/server/@buyer/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/server/@buyer/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/server/@buyer/listing-event/fx/listingEventCreateFx";
import { inboxCreateFx } from "~/server/@user/inbox/fx/inboxCreateFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace ignoreToggleFx {
	export interface Props extends IgnoreToggleSchema.Type {
		userId: string;
	}
}

export const ignoreToggleFx = Effect.fn("ignoreToggleFx")(function* ({
	userId,
	toggle,
	listingId,
}: ignoreToggleFx.Props) {
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

						yield* inboxCreateFx({
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

						yield* inboxCreateFx({
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
						});
					});
				},
			});
		}),
	);
});

export type ignoreToggleFx = ReturnType<typeof ignoreToggleFx>;
