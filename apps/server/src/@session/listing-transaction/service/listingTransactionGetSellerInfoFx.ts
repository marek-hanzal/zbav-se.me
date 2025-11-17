import { Effect } from "effect";

export namespace listingTransactionGetSellerInfoFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const listingTransactionGetSellerInfoFx = ({
	transactionId,
	userId,
}: listingTransactionGetSellerInfoFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.succeed({
			score: 0,
		});
	});
};

export type listingTransactionGetSellerInfoFx = ReturnType<
	typeof listingTransactionGetSellerInfoFx
>;
