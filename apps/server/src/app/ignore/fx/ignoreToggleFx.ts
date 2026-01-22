import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@session/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@session/listing/fx/listingFetchFx";
import { ignoreCreateFx } from "~/app/ignore/fx/ignoreCreateFx";
import { ignoreDeleteFx } from "~/app/ignore/fx/ignoreDeleteFx";
import type { IgnoreToggleSchema } from "~/app/ignore/schema/IgnoreToggleSchema";
import { listingEventCreateFx } from "~/app/listing-event/fx/listingEventCreateFx";
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
			yield* listingCheckIfOwnFx({
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
