import { Context, Effect, Layer } from "effect";
import { terminal as term } from "terminal-kit";
import { seedConsoleStyle } from "~/seed/fx/progress/seedConsoleStyle";

type PhaseState = {
	name: string;
	total: number;
	done: number;
	startedAt: number;
};

export interface SeedProgress {
	startPhase(input: { name: string; total: number }): Effect.Effect<void>;
	advance(input?: { delta?: number }): Effect.Effect<void>;
	log(input: { message: string }): Effect.Effect<void>;
	finishPhase(): Effect.Effect<void>;
	finishAll(): Effect.Effect<void>;
}

export class SeedProgressContextFx extends Context.Tag("SeedProgressContextFx")<
	SeedProgressContextFx,
	SeedProgress
>() {
	//
}

const withProgressRenderer = (): SeedProgress => {
	let phase: PhaseState | null = null;
	let progressBar: ReturnType<typeof term.progressBar> | null = null;
	const startedAt = Date.now();
	const withBarWidth = () => Math.max(24, Math.min(64, Math.floor((term.width || 100) * 0.45)));
	const withRatio = () => {
		if (!phase) {
			return 0;
		}
		const total = Math.max(1, phase.total);
		return Math.max(0, Math.min(1, phase.done / total));
	};

	const stopBar = () => {
		if (!progressBar) {
			return;
		}
		progressBar.stop();
		progressBar = null;
	};

	const startBar = () => {
		if (!phase) {
			return;
		}
		if (phase.total <= 1) {
			return;
		}

		progressBar = term.progressBar({
			title: seedConsoleStyle.magenta(`${phase.name}: `),
			width: withBarWidth(),
			eta: true,
			percent: true,
			inline: true,
		});
		progressBar.update(withRatio());
	};

	const updateBar = () => {
		if (!phase) {
			return;
		}
		if (phase.total <= 1) {
			return;
		}
		if (!progressBar) {
			startBar();
			return;
		}

		progressBar.update(withRatio());
	};

	return {
		startPhase({ name, total }) {
			return Effect.sync(() => {
				stopBar();
				phase = {
					name,
					total,
					done: 0,
					startedAt: Date.now(),
				};
				console.log(
					`\n${seedConsoleStyle.bold(seedConsoleStyle.blue("[STEP]"))} Phase started: ${name}`,
				);
				updateBar();
			});
		},
		advance({ delta = 1 } = {}) {
			return Effect.sync(() => {
				if (!phase) {
					return;
				}
				phase.done += delta;
				updateBar();
			});
		},
		log({ message }) {
			return Effect.sync(() => {
				const hasPhase = Boolean(phase);
				if (hasPhase) {
					stopBar();
				}
				console.log(`${seedConsoleStyle.bold(seedConsoleStyle.cyan("[INFO]"))} ${message}`);
			});
		},
		finishPhase() {
			return Effect.sync(() => {
				if (!phase) {
					return;
				}
				phase.done = Math.max(phase.done, phase.total);
				updateBar();
				stopBar();
				const elapsed = ((Date.now() - phase.startedAt) / 1000).toFixed(1);
				console.log(
					`${seedConsoleStyle.bold(seedConsoleStyle.green("[DONE]"))} Phase finished: ${phase.name} (${elapsed}s)`,
				);
			});
		},
		finishAll() {
			return Effect.sync(() => {
				stopBar();
				const total = ((Date.now() - startedAt) / 1000).toFixed(1);
				console.log(
					`\n${seedConsoleStyle.bold(seedConsoleStyle.green("[SEED]"))} Completed in ${total}s`,
				);
			});
		},
	};
};

export const SeedProgressContextLayer = Layer.succeed(
	SeedProgressContextFx,
	withProgressRenderer(),
);
