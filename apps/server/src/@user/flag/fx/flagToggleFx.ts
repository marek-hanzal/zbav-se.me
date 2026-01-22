import { Effect } from "effect";
import { flagCreateFx } from "~/@session/flag/fx/flagCreateFx";
import { listingCheckIfOwnFx } from "~/@session/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@session/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/@session/listing-event/fx/listingEventCreateFx";
import type { FlagToggleSchema } from "~/@user/flag/schema/FlagToggleSchema";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { flagDeleteFx } from "./flagDeleteFx";

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
