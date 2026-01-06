import { Effect } from "effect";
import type { IgnoreToggleSchema } from "~/@user/ignore/schema/IgnoreToggleSchema";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@user/listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/@user/listing-event/fx/listingEventCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { ignoreCreateFx } from "./ignoreCreateFx";
import { ignoreDeleteFx } from "./ignoreDeleteFx";

export namespace ignoreToggleFx {
	export type Props = IgnoreToggleSchema.Type;
}

export const ignoreToggleFx = Effect.fn("ignoreToggleFx")(function* ({
	toggle,
	listingId,
}: ignoreToggleFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* listingCheckIfOwnFx({
				listingId,
				message: "You cannot ignore your own listing",
			});

			return yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* ignoreCreateFx({
							listingId,
						});

						yield* listingEventCreateFx({
							listingId,
							event: "ignore",
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
						yield* ignoreDeleteFx({
							listingId,
						});

						yield* listingEventCreateFx({
							listingId,
							event: "unignore",
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
});

export type ignoreToggleFx = ReturnType<typeof ignoreToggleFx>;
