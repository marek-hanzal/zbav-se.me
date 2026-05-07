import { Effect } from "effect";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import type { testabase } from "~/test/testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

namespace runWithTestRuntime {
	export interface Props<A, E, R> {
		database: TestDatabase;
		effect: Effect.Effect<A, E, R>;
	}
}

export const runWithTestRuntime = <A, E, R>({
	database,
	effect,
}: runWithTestRuntime.Props<A, E, R>) =>
	Effect.runPromise(effect.pipe(withRuntimeFx(database)) as Effect.Effect<A, E, never>);
