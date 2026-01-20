import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withUploadApiFx = Effect.fn("withUploadApiFx")(function* () {
	yield* withCreateApiFx();
});
