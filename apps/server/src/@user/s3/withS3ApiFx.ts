import { Effect } from "effect";
import { withPresignApiFx } from "./presign";

export const withS3ApiFx = Effect.fn("withS3ApiFx")(function* () {
	yield* withPresignApiFx();
});
