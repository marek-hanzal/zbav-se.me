import { Effect } from "effect";
import { transactionAcceptFx } from "~/seller-transaction/fx/transactionAcceptFx";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";

type CreateOpenScenarioInput = {
	sellerId: string;
	buyerId: string;
};

export const createOpenScenarioFx = ({ sellerId, buyerId }: CreateOpenScenarioInput) =>
	Effect.gen(function* () {
		const { listingId, transactionId } = yield* createPendingScenarioFx({
			sellerId,
			buyerId,
		});

		yield* transactionAcceptFx({
			transactionId,
			userId: sellerId,
		});

		return {
			listingId,
			transactionId,
		};
	});
