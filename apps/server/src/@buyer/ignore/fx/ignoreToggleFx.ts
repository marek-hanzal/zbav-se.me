import { Effect } from "effect";
import { ignoreCreateFx } from "~/@buyer/ignore/fx/ignoreCreateFx";
import { ignoreDeleteFx } from "~/@buyer/ignore/fx/ignoreDeleteFx";
import type { IgnoreToggleSchema } from "~/@buyer/ignore/schema/IgnoreToggleSchema";
import { listingCheckIfOwnFx } from "~/@buyer/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@buyer/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/@buyer/listing-event/fx/listingEventCreateFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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
