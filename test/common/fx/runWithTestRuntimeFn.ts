import { Effect } from "effect";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import type { testabaseFn } from "~/test/testabaseFn";

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;

namespace runWithTestRuntimeFn {
	export interface Props<A, E, R> {
		database: TestDatabase;
		effect: Effect.Effect<A, E, R>;
	}
}

export const runWithTestRuntimeFn = <A, E, R>({
	database,
	effect,
}: runWithTestRuntimeFn.Props<A, E, R>) =>
	Effect.runPromise(effect.pipe(withRuntimeFn(database)) as Effect.Effect<A, E, never>);
