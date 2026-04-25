import { Effect } from "effect";
import {
	appendSeedBenchmarkJsonl,
	printSeedInteractionReport,
} from "~/server/@system/seed/fx/report/seedReportConsole";
import { seedInteractionFx } from "~/server/@system/seed/fx/seedInteractionFx";
import { withSeedRuntimeFx } from "~/server/@system/seed/fx/withSeedRuntimeFx";
import { parseSeedArgsFx } from "~/server/@system/seed/schema/SeedArgsSchema";

const { report, runtimeMs } = await Effect.gen(function* () {
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
}).pipe(withSeedRuntimeFx, Effect.scoped, Effect.runPromise);

printSeedInteractionReport(report);
appendSeedBenchmarkJsonl({
	kind: "interaction",
	count: report.count,
	tables: report.tables,
	runtimeMs,
});
