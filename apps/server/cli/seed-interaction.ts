import { Effect } from "effect";
import {
	appendSeedBenchmarkJsonl,
	printSeedInteractionReport,
} from "~/seed/fx/report/seedReportConsole";
import { seedInteractionFx } from "~/seed/fx/seedInteractionFx";
import { withSeedRuntimeFx } from "~/seed/fx/withSeedRuntimeFx";
import { parseSeedArgsFx } from "~/seed/schema/SeedArgsSchema";

const program = Effect.gen(function* () {
	const start = yield* Effect.sync(() => Date.now());
	const args = yield* parseSeedArgsFx({
		name: "seed-interaction",
		args: process.argv.slice(2),
	});
	const report = yield* seedInteractionFx({
		count: args.count,
		user: args.user,
	});
	const end = yield* Effect.sync(() => Date.now());

	return {
		report,
		runtimeMs: end - start,
	};
});

const { report, runtimeMs } = await program.pipe(
	withSeedRuntimeFx,
	Effect.scoped,
	Effect.runPromise,
);

printSeedInteractionReport(report);
appendSeedBenchmarkJsonl({
	kind: "interaction",
	count: report.count,
	totals: report.totals,
	runtimeMs,
});
