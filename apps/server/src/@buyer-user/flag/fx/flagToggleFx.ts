import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@buyer-session/listing/fx/listingCheckIfOwnFx";
import { listingEventCreateFx } from "~/@buyer-session/listing-event/fx/listingEventCreateFx";
import { flagCreateFx } from "~/@buyer-user/flag/fx/flagCreateFx";
import { flagDeleteFx } from "~/@buyer-user/flag/fx/flagDeleteFx";
import type { FlagToggleSchema } from "~/@buyer-user/flag/schema/FlagToggleSchema";
import { listingFetchFx } from "~/@buyer-user/listing/fx/listingFetchFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "flagToggleFx",
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
