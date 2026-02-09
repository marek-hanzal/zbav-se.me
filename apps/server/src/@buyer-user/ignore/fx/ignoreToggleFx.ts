import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@buyer-session/listing/fx/listingCheckIfOwnFx";
import { listingEventCreateFx } from "~/@buyer-session/listing-event/fx/listingEventCreateFx";
import { ignoreCreateFx } from "~/@buyer-user/ignore/fx/ignoreCreateFx";
import { ignoreDeleteFx } from "~/@buyer-user/ignore/fx/ignoreDeleteFx";
import type { IgnoreToggleSchema } from "~/@buyer-user/ignore/schema/IgnoreToggleSchema";
import { listingFetchFx } from "~/@buyer-user/listing/fx/listingFetchFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "ignoreToggleFx",
		input: {
			userId,
			toggle,
			listingId,
		},
	});

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
