import { Effect } from "effect";
import type { Kysely } from "kysely";
import { DatabaseError } from "~/server/database/pg";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { KyselyContextFx } from "../context/KyselyContextFx";
import type { Database } from "../Database";

export namespace dbFx {
	export type Handlers = Partial<Record<string, (e: DatabaseError) => any>>;

	export type ErrorChannel<M extends Handlers> = {
		[K in keyof M]: M[K] extends (e: DatabaseError) => infer R ? R : never;
	}[keyof M];
}

const dbFxImpl = Effect.fn("tryDbFx")(function* <TResult>(
	run: (kysely: Kysely<Database>) => Promise<TResult>,
	handler?: dbFx.Handlers,
) {
	const { kysely } = yield* KyselyContextFx;

	return yield* Effect.tryPromise({
		try() {
			return run(kysely);
		},
		catch: (error: unknown) => {
			if (error instanceof DatabaseError) {
				const code = error.code ?? "(no-code)";
				const mapped = handler?.[code]?.(error);
				if (mapped !== undefined) {
					return mapped;
				}

				return new RuntimeErrorFx({
					message: "Database Error",
					cause: error,
				});
			}

			if (error instanceof Error) {
				return new RuntimeErrorFx({
					message: "Generic Error",
					cause: error,
				});
			}

			return new RuntimeErrorFx({
				message: "Unknown Error",
				cause: error,
			});
		},
	});
});

export function dbFx<TResult>(
	run: (kysely: Kysely<Database>) => Promise<TResult>,
): Effect.Effect<TResult, RuntimeErrorFx, KyselyContextFx>;

export function dbFx<TResult, const M extends dbFx.Handlers>(
	run: (kysely: Kysely<Database>) => Promise<TResult>,
	handler: M & dbFx.Handlers,
): Effect.Effect<TResult, RuntimeErrorFx | dbFx.ErrorChannel<M>, KyselyContextFx>;

export function dbFx(run: any, handler?: any) {
	return dbFxImpl(run, handler);
}
