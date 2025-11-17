import { Effect } from "effect";

export namespace getListingTransactionSellerInfoFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const getListingTransactionSellerInfoFx = ({
	transactionId,
	userId,
}: getListingTransactionSellerInfoFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.succeed({
			score: 0,
		});
	});
};

export type getListingTransactionSellerInfoFx = ReturnType<
	typeof getListingTransactionSellerInfoFx
>;
