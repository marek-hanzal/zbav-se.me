import { Effect } from "effect";
import { withLocationAutocompleteApiFx } from "./autocomplete";
import { withLocationFetchApiFx } from "./fetch";

export const withLocationApiFx = Effect.fn("withLocationApiFx")(function* () {
	yield* Effect.all([
		withLocationAutocompleteApiFx(),
		withLocationFetchApiFx(),
	]);
});
