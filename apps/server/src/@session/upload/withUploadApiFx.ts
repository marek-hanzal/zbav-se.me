import { Effect } from "effect";
import { withUploadFetchApiFx } from "./fetch";

export const withUploadApiFx = Effect.fn("withUploadApiFx")(function* () {
	yield* withUploadFetchApiFx();
});
