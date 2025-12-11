import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingScoreCreateFx } from "~/@user/listing-score/fx/listingScoreCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { IgnoreToggleSchema } from "../schema/IgnoreToggleSchema";
import { ignoreCreateFx } from "./ignoreCreateFx";
import { ignoreDeleteFx } from "./ignoreDeleteFx";

export namespace ignoreToggleFx {
	export interface Props {
		data: IgnoreToggleSchema.Type;
	}
}

export const ignoreToggleFx = ({ data: { toggle, listingId } }: ignoreToggleFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			yield* listingCheckIfOwnFx({
				listingId,
				message: "You cannot ignore your own listing",
			});

			yield* Effect.if(toggle, {
				onTrue() {
					return Effect.gen(function* () {
						yield* ignoreCreateFx({
							listingId,
						});

						yield* listingScoreCreateFx({
							listingId,
							score: "ignore",
						}).pipe(Effect.ignore);

						return yield* Effect.void;
					});
				},
				onFalse() {
					return Effect.gen(function* () {
						yield* ignoreDeleteFx({
							listingId,
						});

						return yield* Effect.void;
					});
				},
			});
		}),
	);
};

export type ignoreToggleFx = ReturnType<typeof ignoreToggleFx>;
