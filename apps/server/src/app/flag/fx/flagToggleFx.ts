import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { FlagToggleSchema } from "~/@user/flag/schema/FlagToggleSchema";
import { flagCreateFx } from "~/app/flag/fx/flagCreateFx";
import { flagDeleteFx } from "~/app/flag/fx/flagDeleteFx";
import { listingCheckIfOwnFx } from "~/app/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/app/listing/fx/listingFetchFx";
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
							scope: {
								userId,
							},
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
							scope: {
								userId,
							},
						});
					});
				},
			});
		}),
	);
});

export type flagToggleFx = ReturnType<typeof flagToggleFx>;

