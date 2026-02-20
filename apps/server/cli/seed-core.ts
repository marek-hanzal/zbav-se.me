import { Effect } from "effect";
import { seedCoreFx } from "~/seed/fx/seedCoreFx";
import { printSeedBenchmarkJsonl, printSeedCoreReport } from "~/seed/fx/report/seedReportConsole";
import { withSeedRuntimeFx } from "~/seed/fx/withSeedRuntimeFx";
import { parseSeedArgsFx } from "~/seed/schema/SeedArgsSchema";
import { ServerCdnSchema } from "~/schema/env/ServerCdnSchema";

const program = Effect.gen(function* () {
	const start = yield* Effect.sync(() => Date.now());
	const args = yield* parseSeedArgsFx({
		name: "seed-core",
		args: process.argv.slice(2),
	});
	const cdnConfig = ServerCdnSchema.parse(process.env);
	const report = yield* seedCoreFx({
		count: args.count,
		user: args.user,
		cdn: cdnConfig.SERVER_CONTENT_CDN,
	});
	const end = yield* Effect.sync(() => Date.now());

	return {
		report,
		runtimeMs: end - start,
	};
});

const { report, runtimeMs } = await program.pipe(withSeedRuntimeFx, Effect.scoped, Effect.runPromise);

printSeedCoreReport(report);
printSeedBenchmarkJsonl({
	kind: "core",
	count: report.count,
	totals: report.totals,
	runtimeMs,
});
