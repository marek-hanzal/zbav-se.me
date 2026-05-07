import { Effect } from "effect";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";

type CreateResolvedScenarioInput = {
	sellerId: string;
	buyerId: string;
};

export const createResolvedScenarioFx = ({ sellerId, buyerId }: CreateResolvedScenarioInput) =>
	Effect.gen(function* () {
		const { listingId, transactionId } = yield* createOpenScenarioFx({
			sellerId,
			buyerId,
		});

		yield* transactionResolveFx({
			transactionId,
			userId: sellerId,
		});

		return {
			listingId,
			transactionId,
		};
	});
