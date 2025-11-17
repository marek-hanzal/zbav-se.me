import { Effect } from "effect";

export namespace getListingTransactionBuyerInfoFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const getListingTransactionBuyerInfoFx = ({
	transactionId,
	userId,
}: getListingTransactionBuyerInfoFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.succeed({
			score: 0,
		});
	});
};

export type getListingTransactionBuyerInfoFx = ReturnType<typeof getListingTransactionBuyerInfoFx>;
