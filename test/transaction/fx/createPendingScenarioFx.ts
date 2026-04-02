import { Effect } from "effect";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";

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
