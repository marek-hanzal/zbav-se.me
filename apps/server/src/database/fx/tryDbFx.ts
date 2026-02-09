import { Effect } from "effect";
import { DatabaseError } from "pg";
import { RuntimeErrorFx } from "~/error/RuntimeErrorFx";

export namespace tryDbFx {
	export type Handlers = Partial<Record<string, (e: DatabaseError) => unknown>>;

	export type ErrorChannel<M extends Handlers> = {
		[K in keyof M]: M[K] extends (e: DatabaseError) => infer R ? R : never;
	}[keyof M];

	export type Callback = {
		<TResult>(props: { run(): Promise<TResult> }): Effect.Effect<TResult, RuntimeErrorFx>;
		<TResult, const M extends Handlers>(props: {
			run(): Promise<TResult>;
			handler: M;
		}): Effect.Effect<TResult, RuntimeErrorFx | ErrorChannel<M>>;
	};

	export interface Props<TResult> {
		run(): Promise<TResult>;
		handler?: Handlers;
	}
}

const _tryDbFx = Effect.fn("tryDbFx")(function* <TResult>({
	run,
	handler,
}: tryDbFx.Props<TResult>) {
	return yield* Effect.tryPromise({
		try: run,
		catch: (error: unknown) => {
			if (error instanceof DatabaseError) {
				const code = error.code ?? "(no-code)";
				const mapped = handler?.[code]?.(error);
				if (mapped) {
					return mapped;
				}

				return new RuntimeErrorFx({
					message: error.message,
					cause: error,
				});
			}

			if (error instanceof Error) {
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

export const tryDbFx: tryDbFx.Callback = _tryDbFx as any;
