import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingScoreCreateFx } from "~/@user/listing-score/fx/listingScoreCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { FlagToggleSchema } from "../schema/FlagToggleSchema";
import { flagCreateFx } from "./flagCreateFx";
import { flagDeleteFx } from "./flagDeleteFx";

export namespace flagToggleFx {
	export interface Props {
		data: FlagToggleSchema.Type;
	}
}

export const flagToggleFx = ({ data: { toggle, listingId } }: flagToggleFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			yield* listingCheckIfOwnFx({
				listingId,
				message: "You cannot flag your own listing",
			});

			yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* flagCreateFx({
							listingId,
						});

						yield* listingScoreCreateFx({
							listingId,
							score: "flag",
						}).pipe(Effect.ignore);

						return yield* Effect.void;
					});
				},
				onFalse() {
					return Effect.gen(function* () {
						yield* flagDeleteFx({
							listingId,
						});

						return yield* Effect.void;
					});
				},
			});
		}),
	);
};

export type flagToggleFx = ReturnType<typeof flagToggleFx>;
