import { Effect } from "effect";
import { flagCreateFx } from "~/server/@buyer/flag/fx/flagCreateFx";
import { flagDeleteFx } from "~/server/@buyer/flag/fx/flagDeleteFx";
import type { FlagToggleSchema } from "~/server/@buyer/flag/schema/FlagToggleSchema";
import { listingCheckIfOwnFx } from "~/server/@buyer/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/server/@buyer/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/server/@buyer/listing-event/fx/listingEventCreateFx";
import { inboxCreateFx } from "~/server/@user/inbox/fx/inboxCreateFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace flagToggleFx {
	export interface Props extends FlagToggleSchema.Type {
		userId: string;
	}
}

export const flagToggleFx = Effect.fn("flagToggleFx")(function* ({
	userId,
	toggle,
	listingId,
}: flagToggleFx.Props) {
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

						yield* inboxCreateFx({
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

						yield* inboxCreateFx({
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
						});
					});
				},
			});
		}),
	);
});

export type flagToggleFx = ReturnType<typeof flagToggleFx>;
