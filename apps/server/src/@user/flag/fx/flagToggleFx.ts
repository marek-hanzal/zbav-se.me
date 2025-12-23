import { Effect } from "effect";
import { flagCreateFx } from "~/@user/flag/fx/flagCreateFx";
import { flagDeleteFx } from "~/@user/flag/fx/flagDeleteFx";
import type { FlagToggleSchema } from "~/@user/flag/schema/FlagToggleSchema";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@user/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/@user/listing-event/fx/listingEventCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace flagToggleFx {
	export type Props = FlagToggleSchema.Type;
}

export const flagToggleFx = ({ toggle, listingId }: flagToggleFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			yield* listingCheckIfOwnFx({
				listingId,
				message: "You cannot flag your own listing",
			});

			return yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* flagCreateFx({
							listingId,
						});

						yield* listingEventCreateFx({
							listingId,
							event: "flag",
						}).pipe(Effect.ignore);

						return yield* listingFetchFx({
							where: {
								id: listingId,
							},
						});
					});
				},
				onFalse() {
					return Effect.gen(function* () {
						yield* flagDeleteFx({
							listingId,
						});

						yield* listingEventCreateFx({
							listingId,
							event: "unflag",
						}).pipe(Effect.ignore);

						return yield* listingFetchFx({
							where: {
								id: listingId,
							},
						});
					});
				},
			});
		}),
	);
};

export type flagToggleFx = ReturnType<typeof flagToggleFx>;
