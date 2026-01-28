import { Effect } from "effect";
import { withLocationAutocompleteApiFx } from "~/@session/location/autocomplete";
import { withLocationFetchApiFx } from "~/@session/location/fetch";

export const withLocationApiFx = Effect.fn("withLocationApiFx")(function* () {
	yield* Effect.all([
		withLocationAutocompleteApiFx(),
		withLocationFetchApiFx(),
	]);
});
