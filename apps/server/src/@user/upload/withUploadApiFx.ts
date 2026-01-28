import { Effect } from "effect";
import { withCreateApiFx } from "./create";
import { withFetchApiFx } from "./fetch";

export const withUploadApiFx = Effect.fn("withUploadApiFx")(function* () {
	yield* Effect.all([
		withCreateApiFx(),
		withFetchApiFx(),
	]);
});
