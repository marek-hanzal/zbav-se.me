import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";
import { withCountApiFx } from "./count";
import { withCreateApiFx } from "./create";
import { withFetchApiFx } from "./fetch";
import { withSellerInfoApiFx } from "./seller-info";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* Effect.all([
		withSellerInfoApiFx(),
		withCollectionApiFx(),
		withCountApiFx(),
		withFetchApiFx(),
		withCreateApiFx(),
	]);
});
