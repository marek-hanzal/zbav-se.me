import { Effect } from "effect";
import { transactionCreateFx } from "~/client/@buyer/transaction/server/fx/transactionCreateFx";
import { createListingFx } from "~/test/utils/createListingFx";

type CreatePendingScenarioInput = {
	sellerId: string;
	buyerId: string;
};

export const createPendingScenarioFx = ({ sellerId, buyerId }: CreatePendingScenarioInput) =>
	Effect.gen(function* () {
		const listing = yield* createListingFx(sellerId);

		yield* transactionCreateFx({
			listingId: listing.id,
			userId: buyerId,
		});

		return {
			listingId: listing.id,
		};
	});
