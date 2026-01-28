import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer-user/transaction/collection";
import { withCreateApiFx } from "~/@buyer-user/transaction/create";
import { withFetchApiFx } from "~/@buyer-user/transaction/fetch";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCreateApiFx(),
		withFetchApiFx(),
	]);
});
