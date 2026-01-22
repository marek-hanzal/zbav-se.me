import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@session/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@session/listing/fx/listingFetchFx";
import { flagCreateFx } from "~/app/flag/fx/flagCreateFx";
import { flagDeleteFx } from "~/app/flag/fx/flagDeleteFx";
import type { FlagToggleSchema } from "~/app/flag/schema/FlagToggleSchema";
import { listingEventCreateFx } from "~/app/listing-event/fx/listingEventCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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
			yield* listingCheckIfOwnFx({
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
