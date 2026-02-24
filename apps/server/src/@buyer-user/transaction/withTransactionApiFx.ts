import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer-user/transaction/collection";
import { withCountApiFx } from "~/@buyer-user/transaction/count";
import { withCreateApiFx } from "~/@buyer-user/transaction/create";
import { withFetchApiFx } from "~/@buyer-user/transaction/fetch";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withCreateApiFx(),
		withFetchApiFx(),
	]);
});
