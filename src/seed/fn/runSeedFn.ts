import { Effect } from "effect";
import { withSeedProgressContextFn } from "~/seed/context/SeedProgressContextFx";
import { listingSeedFx } from "~/seed/fx/listingSeedFx";
import { withSeedRuntimeFx } from "~/seed/fx/withSeedRuntimeFx";
import type { SeedRunConfigSchema } from "~/seed/schema/SeedRunConfig";
import type { SeedProgressEvent } from "~/seed/type/SeedProgressEvent";
import type { SeedRunSummary } from "~/seed/type/SeedRunSummary";

export const runSeedEffectFx = (
	config: SeedRunConfigSchema.Type,
	emitFn: (event: SeedProgressEvent.Type) => void,
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
	})().pipe(withSeedProgressContextFn(emitFn), withSeedRuntimeFx, Effect.scoped) as Effect.Effect<
		SeedRunSummary.Type,
		unknown,
		never
	>;
};

export const runSeedFn = async (
	config: SeedRunConfigSchema.Type,
	emitFn: (event: SeedProgressEvent.Type) => void,
) => {
	return Effect.runPromise(runSeedEffectFx(config, emitFn));
};
