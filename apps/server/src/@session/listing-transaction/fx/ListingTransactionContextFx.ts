import { Context, Effect } from "effect";
import { DefaultListingTransactionContext } from "../config/DefaultListingTransactionContext";

export interface ListingTransactionContext {
	/**
	 * Number of days until a listing transaction expires.
	 * Defaults to 3 days.
	 */
	expires: number;
	/**
	 * Number of days to extend a listing transaction.
	 */
	extend: number;
}

export class ListingTransactionContextFx extends Context.Tag("ListingTransactionContextFx")<
	ListingTransactionContextFx,
	ListingTransactionContext
>() {
	//
}

export const ListingTransactionContextProvider = (
	context: ListingTransactionContext = DefaultListingTransactionContext,
) => {
	return Effect.provideService(ListingTransactionContextFx, context);
};
