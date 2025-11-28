import { Effect } from "effect";
import { listingTransactionPatchFx } from "~/@user/listing-transaction/fx/listingTransactionPatchFx";
import { listingTransactionResolveFx } from "~/@user/listing-transaction/fx/listingTransactionResolveFx";
import { listingTransactionStatusCreateFx } from "~/@user/listing-transaction-status/fx/listingTransactionStatusCreateFx";
import type { ListingTransactionStatusRejectSchema } from "~/@user/listing-transaction-status/schema/ListingTransactionStatusRejectSchema";

export namespace listingTransactionStatusRejectFx {
	export type Props = ListingTransactionStatusRejectSchema.Type;
}

export const listingTransactionStatusRejectFx = ({
	listingTransactionId,
}: listingTransactionStatusRejectFx.Props) => {
	return Effect.gen(function* () {
		const transaction = yield* listingTransactionResolveFx({
			listingTransactionId,
			message: "You are not allowed to reject this listing transaction",
		});

		yield* listingTransactionPatchFx({
			listingTransactionId: transaction.listingTransactionId,
		});

		return yield* listingTransactionStatusCreateFx({
			listingTransactionId: transaction.listingTransactionId,
			status: "rejected",
			side: transaction.side,
		});
	});
};

export type listingTransactionStatusRejectFx = ReturnType<typeof listingTransactionStatusRejectFx>;
