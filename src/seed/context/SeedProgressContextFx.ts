import { Context, Effect } from "effect";
import type { SeedProgressEvent } from "~/seed/type/SeedProgressEvent";
import type { SeedRunSummary } from "~/seed/type/SeedRunSummary";

export interface SeedProgress {
	startPhaseFx(input: { name: string; total: number }): Effect.Effect<void>;
	advanceFx(input?: { delta?: number }): Effect.Effect<void>;
	finishPhaseFx(): Effect.Effect<void>;
	logFx(input: { message: string }): Effect.Effect<void>;
	updateSummaryFx(input: { summary: Partial<SeedRunSummary.Type> }): Effect.Effect<void>;
}

export class SeedProgressContextFx extends Context.Service<SeedProgressContextFx, SeedProgress>()(
	"SeedProgressContextFx",
) {
	//
}

export const withSeedProgressContextFn = (emitFn: (event: SeedProgressEvent.Type) => void) => {
	const progress: SeedProgress = {
		startPhaseFx({ name, total }) {
			return Effect.sync(() => {
				emitFn({
					type: "phase-started",
					name,
					total,
				});
			});
		},
		advanceFx({ delta = 1 } = {}) {
			return Effect.sync(() => {
				emitFn({
					type: "phase-advanced",
					delta,
				});
			});
		},
		finishPhaseFx() {
			return Effect.sync(() => {
				emitFn({
					type: "phase-finished",
				});
			});
		},
		logFx({ message }) {
			return Effect.sync(() => {
				emitFn({
					type: "log-added",
					message,
				});
			});
		},
		updateSummaryFx({ summary }) {
			return Effect.sync(() => {
				emitFn({
					type: "summary-updated",
					summary,
				});
			});
		},
	};

	return <A, E, R>(effect: Effect.Effect<A, E, R>) => {
		return effect.pipe(Effect.provideService(SeedProgressContextFx, progress));
	};
};
