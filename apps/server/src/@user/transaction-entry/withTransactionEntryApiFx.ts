import { Effect } from "effect";
import { withTransactionEntryCollectionApiFx } from "~/@user/transaction-entry/collection";
import { withTransactionEntryCountApiFx } from "~/@user/transaction-entry/count";
import { withTransactionEntryCreateApiFx } from "~/@user/transaction-entry/create";
import { withTransactionEntryFetchApiFx } from "~/@user/transaction-entry/fetch";
import { withTransactionEntryGalleryFetchApiFx } from "~/@user/transaction-entry/gallery-fetch";

export const withTransactionEntryApiFx = Effect.fn("withTransactionEntryApiFx")(function* () {
	yield* Effect.all([
		withTransactionEntryCollectionApiFx(),
		withTransactionEntryCountApiFx(),
		withTransactionEntryCreateApiFx(),
		withTransactionEntryFetchApiFx(),
		withTransactionEntryGalleryFetchApiFx(),
	]);
});
