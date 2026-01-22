import { Effect } from "effect";
import { withCountApiFx } from "./count";
import { withCreateApiFx } from "./create";
import { withFetchApiFx } from "./fetch";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* Effect.all([
		withCreateApiFx(),
		withFetchApiFx(),
		withCountApiFx(),
	]);
});
