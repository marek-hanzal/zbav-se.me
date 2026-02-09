import { Effect } from "effect";
import { DatabaseError } from "pg";
import { ConflictErrorFx } from "~/error/ConflictErrorFx";
import { RuntimeErrorFx } from "~/error/RuntimeErrorFx";

export namespace tryDbFx {
	export interface Props<TResult> {
		run(): Promise<TResult>;
		conflict?: string;
	}
}

export const tryDbFx = Effect.fn("tryDbFx")(function* <TResult>({
	run,
	conflict,
}: tryDbFx.Props<TResult>) {
	return yield* Effect.tryPromise({
		try: run,
		catch(error: unknown) {
			if (error instanceof DatabaseError) {
				switch (error.code) {
					case "23505":
						return new ConflictErrorFx({
							message: conflict ?? "(unknown conflict)",
							cause: error,
						});
				}

				return new RuntimeErrorFx({
					message: error.message,
					cause: error,
				});
			} else if (error instanceof Error) {
				return new RuntimeErrorFx({
					message: error.message,
					cause: error,
				});
			}

			return new RuntimeErrorFx({
				message: String(error),
				cause: error,
			});
		},
	});
});
