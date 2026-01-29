import { Effect } from "effect";
import { withCreateApiFx } from "~/@user/upload/create";
import { withFetchApiFx } from "~/@user/upload/fetch";

export const withUploadApiFx = Effect.fn("withUploadApiFx")(function* () {
	yield* Effect.all([
		withCreateApiFx(),
		withFetchApiFx(),
	]);
});
