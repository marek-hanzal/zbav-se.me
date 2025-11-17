import { Effect } from "effect";

export namespace listingTransactionGetBuyerInfoFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const listingTransactionGetBuyerInfoFx = ({
	transactionId,
	userId,
}: listingTransactionGetBuyerInfoFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.succeed({
			score: 0,
		});
	});
};

export type listingTransactionGetBuyerInfoFx = ReturnType<typeof listingTransactionGetBuyerInfoFx>;
