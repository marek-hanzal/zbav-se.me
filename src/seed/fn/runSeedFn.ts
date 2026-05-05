import { Effect } from "effect";
import type { SeedProgressEvent } from "~/seed/seed/SeedProgressEvent";
import type { SeedRunConfigSchema } from "~/seed/seed/SeedRunConfig";
import type { SeedRunSummary } from "~/seed/seed/SeedRunSummary";
import { listingSeedFx } from "~/seed/server/listingSeedFx";
import { withSeedProgressContextFx } from "~/seed/server/SeedProgressContextFx";
import { withSeedRuntimeFx } from "~/seed/server/withSeedRuntimeFx";

export const runSeedEffect = (
	config: SeedRunConfigSchema.Type,
	emit: (event: SeedProgressEvent.Type) => void,
) => {
	return (() => {
		switch (config.seedId) {
			case "listings": {
				return listingSeedFx({
					count: config.count,
					userEmail: config.userEmail,
				});
			}
			default: {
				throw new Error(`Unsupported seed id: ${config.seedId}`);
			}
		}
	})().pipe(withSeedProgressContextFx(emit), withSeedRuntimeFx, Effect.scoped) as Effect.Effect<
		SeedRunSummary.Type,
		unknown,
		never
	>;
};

export const runSeedFn = async (
	config: SeedRunConfigSchema.Type,
	emit: (event: SeedProgressEvent.Type) => void,
) => {
	return Effect.runPromise(runSeedEffect(config, emit));
};
