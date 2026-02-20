import { Context, Effect, Layer } from "effect";
import { terminal as term } from "terminal-kit";

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

const withMarkup = (markup: string) => (value: string) => {
	if (!process.stdout.isTTY || process.env.NO_COLOR) {
		return value;
	}

	return String(term.str(`${markup}${value}^:`));
};

const style = {
	bold: withMarkup("^+"),
	green: withMarkup("^g"),
	blue: withMarkup("^b"),
	magenta: withMarkup("^m"),
	cyan: withMarkup("^c"),
};

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
			title: style.magenta(`${phase.name}: `),
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
				console.log(`\n${style.bold(style.blue("[STEP]"))} Phase started: ${name}`);
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
				console.log(`${style.bold(style.cyan("[INFO]"))} ${message}`);
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
				console.log(`${style.bold(style.green("[DONE]"))} Phase finished: ${phase.name} (${elapsed}s)`);
			});
		},
		finishAll() {
			return Effect.sync(() => {
				stopBar();
				const total = ((Date.now() - startedAt) / 1000).toFixed(1);
				console.log(`\n${style.bold(style.green("[SEED]"))} Completed in ${total}s`);
			});
		},
	};
};

export const SeedProgressContextLayer = Layer.succeed(
	SeedProgressContextFx,
	withProgressRenderer(),
);
