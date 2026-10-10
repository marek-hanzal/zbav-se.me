import { Effect } from "effect";
import { withSeedProgressContextFx } from "~/seed/context/SeedProgressContextFx";
import { listingSeedFx } from "~/seed/fx/listingSeedFx";
import { withSeedRuntimeFx } from "~/seed/fx/withSeedRuntimeFx";
import type { SeedRunConfigSchema } from "~/seed/schema/SeedRunConfig";
import type { SeedProgressEvent } from "~/seed/type/SeedProgressEvent";
import type { SeedRunSummary } from "~/seed/type/SeedRunSummary";

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
