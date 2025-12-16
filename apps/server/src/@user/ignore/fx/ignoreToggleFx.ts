import { Effect } from "effect";
import type { IgnoreToggleSchema } from "~/@user/ignore/schema/IgnoreToggleSchema";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/@user/listing/fx/listingFetchFx";
import { listingScoreCreateFx } from "~/@user/listing-score/fx/listingScoreCreateFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { ignoreCreateFx } from "./ignoreCreateFx";
import { ignoreDeleteFx } from "./ignoreDeleteFx";

export namespace ignoreToggleFx {
	export type Props = IgnoreToggleSchema.Type;
}

export const ignoreToggleFx = ({ toggle, listingId }: ignoreToggleFx.Props) => {
	return withTransactionFx(
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

						yield* listingScoreCreateFx({
							listingId,
							score: "ignore",
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

export type ignoreToggleFx = ReturnType<typeof ignoreToggleFx>;
