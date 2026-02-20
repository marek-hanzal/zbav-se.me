import { Effect } from "effect";
import { seedInteractionFx } from "~/seed/fx/seedInteractionFx";
import { printSeedInteractionReport } from "~/seed/fx/report/seedReportConsole";
import { withSeedRuntimeFx } from "~/seed/fx/withSeedRuntimeFx";
import { parseSeedArgsFx } from "~/seed/schema/SeedArgsSchema";

const program = Effect.gen(function* () {
	const args = yield* parseSeedArgsFx(process.argv.slice(2));
	const report = yield* seedInteractionFx({
		count: args.count,
		user: args.user,
	});

	printSeedInteractionReport(report);
});

await program.pipe(withSeedRuntimeFx, Effect.scoped, Effect.runPromise);
