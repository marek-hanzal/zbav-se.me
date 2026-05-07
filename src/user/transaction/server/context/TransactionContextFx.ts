import { Context } from "effect";

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
