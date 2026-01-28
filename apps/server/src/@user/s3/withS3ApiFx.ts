import { Effect } from "effect";
import { withPresignApiFx } from "~/@user/s3/presign";

export const withS3ApiFx = Effect.fn("withS3ApiFx")(function* () {
	yield* withPresignApiFx();
});
