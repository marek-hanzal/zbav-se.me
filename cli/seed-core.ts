import { Effect } from "effect";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import {
	appendSeedBenchmarkJsonl,
	printSeedCoreReport,
} from "~/server/@system/seed/fx/report/seedReportConsole";
import { seedCoreFx } from "~/server/@system/seed/fx/seedCoreFx";
import { withSeedRuntimeFx } from "~/server/@system/seed/fx/withSeedRuntimeFx";
import { parseSeedArgsFx } from "~/server/@system/seed/schema/SeedArgsSchema";

const { report, runtimeMs } = await Effect.gen(function* () {
	const start = yield* Effect.sync(() => Date.now());
	const args = yield* parseSeedArgsFx({
		name: "seed-core",
		args: process.argv.slice(2),
	});
	const viteConfig = ViteEnvSchema.parse(process.env);
	const report = yield* seedCoreFx({
		count: args.count,
		user: args.user,
		cdn: viteConfig.VITE_CONTENT_CDN,
	});
	const end = yield* Effect.sync(() => Date.now());

	return {
		report,
		runtimeMs: end - start,
	};
}).pipe(withSeedRuntimeFx, Effect.scoped, Effect.runPromise);

printSeedCoreReport(report);
appendSeedBenchmarkJsonl({
	kind: "core",
	count: report.count,
	totals: report.totals,
	runtimeMs,
});
