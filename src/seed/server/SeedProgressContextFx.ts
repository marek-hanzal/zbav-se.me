import { Context, Effect } from "effect";
import type { SeedProgressEvent } from "~/seed/seed/SeedProgressEvent";
import type { SeedRunSummary } from "~/seed/seed/SeedRunSummary";

export interface SeedProgress {
	startPhase(input: { name: string; total: number }): Effect.Effect<void>;
	advance(input?: { delta?: number }): Effect.Effect<void>;
	finishPhase(): Effect.Effect<void>;
	log(input: { message: string }): Effect.Effect<void>;
	updateSummary(input: { summary: Partial<SeedRunSummary.Type> }): Effect.Effect<void>;
}

export class SeedProgressContextFx extends Context.Tag("SeedProgressContextFx")<
	SeedProgressContextFx,
	SeedProgress
>() {
	//
}

export const withSeedProgressContextFx = (emit: (event: SeedProgressEvent.Type) => void) => {
	const progress: SeedProgress = {
		startPhase({ name, total }) {
			return Effect.sync(() => {
				emit({
					type: "phase-started",
					name,
					total,
				});
			});
		},
		advance({ delta = 1 } = {}) {
			return Effect.sync(() => {
				emit({
					type: "phase-advanced",
					delta,
				});
			});
		},
		finishPhase() {
			return Effect.sync(() => {
				emit({
					type: "phase-finished",
				});
			});
		},
		log({ message }) {
			return Effect.sync(() => {
				emit({
					type: "log-added",
					message,
				});
			});
		},
		updateSummary({ summary }) {
			return Effect.sync(() => {
				emit({
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
