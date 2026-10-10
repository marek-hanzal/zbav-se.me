import { Effect } from "effect";
import type { Kysely } from "kysely";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { DatabaseError } from "~/database/service/pg";
import type { Database } from "~/database/type/Database";
import { RuntimeErrorFx } from "~/server-error/error/RuntimeErrorFx";

export namespace dbFx {
	export type Handlers = Partial<Record<string, (e: DatabaseError) => any>>;

	export type ErrorChannel<M extends Handlers> = {
		[K in keyof M]: M[K] extends (e: DatabaseError) => infer R ? R : never;
	}[keyof M];
}

const dbFxImplFx = Effect.fn("tryDbFx")(function* <TResult>(
	runFn: (kysely: Kysely<Database>) => Promise<TResult>,
	handler?: dbFx.Handlers,
) {
	const { kysely } = yield* KyselyContextFx;

	return yield* Effect.tryPromise({
		try() {
			return runFn(kysely);
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
	runFn: (kysely: Kysely<Database>) => Promise<TResult>,
): Effect.Effect<TResult, RuntimeErrorFx, KyselyContextFx>;

export function dbFx<TResult, const M extends dbFx.Handlers>(
	runFn: (kysely: Kysely<Database>) => Promise<TResult>,
	handler: M & dbFx.Handlers,
): Effect.Effect<TResult, RuntimeErrorFx | dbFx.ErrorChannel<M>, KyselyContextFx>;

export function dbFx(runFn: any, handler?: any) {
	return dbFxImplFx(runFn, handler);
}
