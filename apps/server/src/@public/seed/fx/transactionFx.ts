import { Effect } from "effect";
import { seedTransactionsFx } from "~/@public/seed/fx/seedTransactionsFx";

export namespace transactionFx {
	export interface Props {
		userId: string;
		transaction: Omit<seedTransactionsFx.Props, "userId">;
	}
}

export const transactionFx = Effect.fn("transactionFx")(function* ({
	userId,
	transaction,
}: transactionFx.Props) {
	yield* seedTransactionsFx({
		userId,
		...transaction,
	});
});
