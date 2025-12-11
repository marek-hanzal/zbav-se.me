import { Context, Effect } from "effect";
import { DefaultTransactionContext } from "../config/DefaultTransactionContext";

export interface TransactionContext {
	/**
	 * Number of days until a transaction expires.
	 * Defaults to 3 days.
	 */
	expires: number;
	/**
	 * Number of days to extend a transaction.
	 */
	extend: number;
}

export class TransactionContextFx extends Context.Tag("TransactionContextFx")<
	TransactionContextFx,
	TransactionContext
>() {
	//
}

export const TransactionContextProvider = (
	context: TransactionContext = DefaultTransactionContext,
) => {
	return Effect.provideService(TransactionContextFx, context);
};
