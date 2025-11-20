import { Effect } from "effect";
import { UserContextFx } from "../../../auth/fx/UserContextFx";

export namespace listingTransactionGetSellerInfoFx {
	export interface Props {
		transactionId: string;
	}
}

export const listingTransactionGetSellerInfoFx = ({
	transactionId,
}: listingTransactionGetSellerInfoFx.Props) => {
	return Effect.gen(function* () {
		const user = yield* UserContextFx;

		return yield* Effect.succeed({
			score: 0,
		});
	});
};

export type listingTransactionGetSellerInfoFx = ReturnType<
	typeof listingTransactionGetSellerInfoFx
>;
