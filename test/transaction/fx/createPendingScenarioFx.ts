import { Effect } from "effect";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";

export namespace createPendingScenarioFx {
	export interface Props {
		buyerId: string;
		listing?: createListingFx.Props;
		sellerId: string;
	}
}

export const createPendingScenarioFx = ({
	sellerId,
	buyerId,
	listing,
}: createPendingScenarioFx.Props) =>
	Effect.gen(function* () {
		const createdListing = yield* createListingFx(sellerId, listing);

		const transaction = yield* transactionCreateFx({
			listingId: createdListing.id,
			userId: buyerId,
		});

		return {
			listingId: createdListing.id,
			transactionId: transaction.id,
		};
	});
