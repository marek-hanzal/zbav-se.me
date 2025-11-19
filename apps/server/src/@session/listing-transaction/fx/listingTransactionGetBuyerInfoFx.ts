import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";

export namespace listingTransactionGetBuyerInfoFx {
	export interface Props {
		transactionId: string;
	}
}

export const listingTransactionGetBuyerInfoFx = ({
	transactionId,
}: listingTransactionGetBuyerInfoFx.Props) => {
	return Effect.gen(function* () {
		const user = yield* UserContextFx;

		return yield* Effect.succeed({
			score: 0,
		});
	});
};

export type listingTransactionGetBuyerInfoFx = ReturnType<typeof listingTransactionGetBuyerInfoFx>;
