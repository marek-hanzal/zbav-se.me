import { Effect } from "effect";
import { listingTransactionPatchFx } from "~/@user/listing-transaction/fx/listingTransactionPatchFx";
import { listingTransactionResolveFx } from "~/@user/listing-transaction/fx/listingTransactionResolveFx";
import { listingTransactionStatusCreateFx } from "~/@user/listing-transaction-status/fx/listingTransactionStatusCreateFx";
import type { ListingTransactionStatusAcceptSchema } from "~/@user/listing-transaction-status/schema/ListingTransactionStatusAcceptSchema";

export namespace listingTransactionStatusAcceptFx {
	export type Props = ListingTransactionStatusAcceptSchema.Type;
}

export const listingTransactionStatusAcceptFx = ({
	listingTransactionId,
}: listingTransactionStatusAcceptFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* listingTransactionResolveFx({
			listingTransactionId,
			message: "You are not allowed to accept this listing transaction",
		});

		yield* listingTransactionPatchFx({
			listingTransactionId: transaction.listingTransactionId,
		});

		return yield* listingTransactionStatusCreateFx({
			listingTransactionId: transaction.listingTransactionId,
			status: "accepted",
			side: transaction.side,
		});
	});
};

export type listingTransactionStatusAcceptFx = ReturnType<typeof listingTransactionStatusAcceptFx>;
