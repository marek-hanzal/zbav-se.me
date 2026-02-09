import { Effect } from "effect";
import { mapToError } from "~/database/mapToError";

export const tryDbFx = Effect.fn("tryDbFx")(function* <TResult>(
	promise: () => Promise<TResult>,
	error: mapToError.Props,
) {
	return yield* Effect.tryPromise({
		try: promise,
		catch: mapToError(error),
	});
});
