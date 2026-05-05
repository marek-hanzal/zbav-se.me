import { StatusMessage } from "@inkjs/ui";
import { Effect, Exit, Fiber } from "effect";
import { Box, useApp, useInput, useStdout } from "ink";
import { type FC, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { match } from "ts-pattern";
import { runSeedEffect } from "~/seed/fn/runSeedFn";
import type { SeedProgressEvent } from "~/seed/seed/SeedProgressEvent";
import { SeedRunConfigSchema } from "~/seed/seed/SeedRunConfig";
import type { SeedRunSummary } from "~/seed/seed/SeedRunSummary";
import { seedRegistry } from "~/seed/seed/seedRegistry";
import { RunScreen } from "./RunScreen";
import { SetupScreen } from "./SetupScreen";

type ScreenState = "completed" | "failed" | "running" | "setup";
type FocusField = "count" | "seed" | "submit" | "user";

type PhaseState = {
	done: number;
	name: string;
	startedAt: number;
	total: number;
} | null;

type SummaryState = Partial<SeedRunSummary.Type>;

const LOG_BUFFER_LIMIT = 200;
const focusOrder: FocusField[] = [
	"seed",
	"count",
	"user",
	"submit",
];

const readErrorMessage = (error: unknown) => {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	if (typeof error === "object" && error && "message" in error) {
		const message = Reflect.get(error, "message");
		if (typeof message === "string" && message.length > 0) {
			return message;
		}
	}

	return "Unknown seed failure";
};

const withPhaseStatusUpdate = (
	phases: SeedRunSummary.Phase[],
	phaseName: string,
	status: SeedRunSummary.PhaseStatus,
	done?: number,
) => {
	return phases.map((phase) => {
		if (phase.name !== phaseName) {
			return phase;
		}

		return {
			...phase,
			status,
			done: done ?? phase.done,
		};
	});
};

const isExitScreenState = (screenState: ScreenState) => {
	return match(screenState)
		.with("completed", () => true)
		.with("failed", () => true)
		.with("running", () => false)
		.with("setup", () => false)
		.exhaustive();
};

export namespace SeedApp {
	export type Props = {};
}

export const SeedApp: FC<SeedApp.Props> = () => {
	const { exit } = useApp();
	const { stdout } = useStdout();
	const rows = stdout.rows ?? 24;
	const columns = stdout.columns ?? 80;
	const runFiberRef = useRef<Fiber.RuntimeFiber<SeedRunSummary.Type, unknown> | null>(null);
	const isExitingRef = useRef(false);

	const [countInput, setCountInput] = useState(String(seedRegistry[0]?.defaultCount ?? 25));
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [focusField, setFocusField] = useState<FocusField>("seed");
	const [logLines, setLogLines] = useState<string[]>([]);
	const [phase, setPhase] = useState<PhaseState>(null);
	const [runConfig, setRunConfig] = useState<SeedRunConfigSchema.Type | null>(null);
	const [screenState, setScreenState] = useState<ScreenState>("setup");
	const [selectedSeedIndex, setSelectedSeedIndex] = useState(0);
	const [summary, setSummary] = useState<SummaryState>({});
	const [userEmailInput, setUserEmailInput] = useState(
		seedRegistry[0]?.defaultUserEmail ?? "seed-listings@test.cz",
	);

	const selectedSeed = seedRegistry[selectedSeedIndex] ?? seedRegistry[0];

	const validation = useMemo(() => {
		return SeedRunConfigSchema.safeParse({
			seedId: selectedSeed.id,
			count: countInput,
			userEmail: userEmailInput,
		});
	}, [
		countInput,
		selectedSeed.id,
		userEmailInput,
	]);

	const validationErrors = useMemo(() => {
		const errors = new Map<string, string>();

		if (validation.success) {
			return errors;
		}

		for (const issue of validation.error.issues) {
			const key = String(issue.path[0] ?? "");
			if (!errors.has(key)) {
				errors.set(key, issue.message);
			}
		}

		return errors;
	}, [
		validation,
	]);

	const moveFocus = useEffectEvent((delta: number) => {
		const currentIndex = focusOrder.indexOf(focusField);
		const nextIndex = (currentIndex + delta + focusOrder.length) % focusOrder.length;
		setFocusField(focusOrder[nextIndex] ?? "seed");
	});

	const resetToSetup = useEffectEvent(() => {
		runFiberRef.current = null;
		isExitingRef.current = false;
		setCountInput(String(selectedSeed.defaultCount));
		setUserEmailInput(selectedSeed.defaultUserEmail);
		setErrorMessage(null);
		setFocusField("seed");
		setLogLines([]);
		setPhase(null);
		setRunConfig(null);
		setScreenState("setup");
		setSummary({});
	});

	const interruptRun = useEffectEvent(async () => {
		const runFiber = runFiberRef.current;

		if (!runFiber) {
			return;
		}

		runFiberRef.current = null;
		Effect.runFork(Fiber.interrupt(runFiber));
	});

	const closeApp = useEffectEvent((forceExit: boolean) => {
		if (isExitingRef.current) {
			return;
		}

		isExitingRef.current = true;
		void interruptRun();
		exit();

		if (forceExit) {
			setTimeout(() => {
				process.exit(130);
			}, 25);
		}
	});

	const submitSetup = useEffectEvent(() => {
		if (!validation.success) {
			setErrorMessage("Fix the highlighted setup fields before running the seed.");
			return;
		}

		setErrorMessage(null);
		setLogLines([]);
		setPhase(null);
		setSummary({
			seedId: validation.data.seedId,
			seedLabel: selectedSeed.label,
			userEmail: validation.data.userEmail,
			requestedCount: validation.data.count,
			createdCount: 0,
			beforeTotal: 0,
			afterTotal: 0,
			phases: [],
			currentPhase: null,
		});
		setRunConfig(validation.data);
		setScreenState("running");
	});

	const onProgressEvent = useEffectEvent((event: SeedProgressEvent.Type) => {
		switch (event.type) {
			case "log-added": {
				setLogLines((current) => {
					const next = [
						...current,
						event.message,
					];
					return next.slice(-LOG_BUFFER_LIMIT);
				});
				return;
			}
			case "phase-started": {
				const nextPhase = {
					name: event.name,
					total: event.total,
					done: 0,
					startedAt: Date.now(),
				} as const;
				setPhase(nextPhase);
				setSummary((current) => ({
					...current,
					phases: withPhaseStatusUpdate(
						current.phases ?? [],
						nextPhase.name,
						"running",
						0,
					),
					currentPhase: {
						name: nextPhase.name,
						total: nextPhase.total,
						done: nextPhase.done,
						status: "running",
					},
				}));
				return;
			}
			case "phase-advanced": {
				setPhase((current) => {
					if (!current) {
						return current;
					}

					const nextPhase = {
						...current,
						done: Math.max(0, Math.min(current.total, current.done + event.delta)),
					};

					setSummary((summary) => ({
						...summary,
						phases: withPhaseStatusUpdate(
							summary.phases ?? [],
							nextPhase.name,
							"running",
							nextPhase.done,
						),
						currentPhase: {
							name: nextPhase.name,
							total: nextPhase.total,
							done: nextPhase.done,
							status: "running",
						},
					}));

					return nextPhase;
				});
				return;
			}
			case "phase-finished": {
				setPhase((current) => {
					if (!current) {
						return current;
					}

					const nextPhase = {
						...current,
						done: current.total,
					};

					setSummary((summary) => ({
						...summary,
						phases: withPhaseStatusUpdate(
							summary.phases ?? [],
							nextPhase.name,
							"completed",
							nextPhase.done,
						),
						currentPhase: {
							name: nextPhase.name,
							total: nextPhase.total,
							done: nextPhase.done,
							status: "completed",
						},
					}));

					return nextPhase;
				});
				return;
			}
			case "summary-updated": {
				setSummary((current) => ({
					...current,
					...event.summary,
					phases: event.summary.phases ?? current.phases,
				}));
			}
		}
	});

	useEffect(() => {
		if (screenState !== "running" || !runConfig) {
			return;
		}

		let active = true;
		const runFiber = Effect.runFork(runSeedEffect(runConfig, onProgressEvent));
		runFiberRef.current = runFiber;

		void Effect.runPromise(Fiber.await(runFiber)).then((result) => {
			if (!active) {
				return;
			}

			runFiberRef.current = null;

			if (Exit.isSuccess(result)) {
				setSummary(result.value);
				setPhase(null);
				setScreenState("completed");
				setLogLines((current) => {
					return [
						...current,
						`Seed finished: created ${result.value.createdCount} listings.`,
					].slice(-LOG_BUFFER_LIMIT);
				});
				return;
			}

			if (Exit.isInterrupted(result)) {
				return;
			}

			const message = readErrorMessage(result.cause);
			setPhase(null);
			setErrorMessage(message);
			setScreenState("failed");
			setLogLines((current) => {
				return [
					...current,
					`Seed failed: ${message}`,
				].slice(-LOG_BUFFER_LIMIT);
			});
		});

		return () => {
			active = false;
			if (runFiberRef.current === runFiber) {
				runFiberRef.current = null;
			}
		};
	}, [
		runConfig,
		screenState,
	]);

	useInput((input, key) => {
		if (key.ctrl && input === "c") {
			closeApp(true);
			return;
		}

		match(screenState)
			.with("setup", () => {
				if (key.tab && key.shift) {
					moveFocus(-1);
					return;
				}

				if (key.tab) {
					moveFocus(1);
					return;
				}

				if (focusField === "submit" && key.return) {
					submitSetup();
				}
			})
			.when(isExitScreenState, () => {
				if (input === "q") {
					closeApp(false);
					return;
				}

				if (input === "r") {
					resetToSetup();
				}
			})
			.otherwise(() => {});
	});

	return (
		<Box
			flexDirection={"column"}
			height={rows}
			paddingX={1}
			paddingY={1}
			width={columns}
		>
			{match(screenState)
				.with("setup", () => (
					<SetupScreen
						countInput={countInput}
						errors={validationErrors}
						errorMessage={errorMessage}
						focusField={focusField}
						onCountChange={setCountInput}
						onCountSubmit={() => {
							setFocusField("user");
						}}
						onSeedChange={(seedId: string) => {
							const nextIndex = seedRegistry.findIndex((seed) => seed.id === seedId);
							if (nextIndex < 0) {
								return;
							}

							const nextSeed = seedRegistry[nextIndex];
							if (!nextSeed) {
								return;
							}

							setSelectedSeedIndex(nextIndex);
							setCountInput(String(nextSeed.defaultCount));
							setUserEmailInput(nextSeed.defaultUserEmail);
						}}
						onUserEmailChange={setUserEmailInput}
						onUserEmailSubmit={() => {
							setFocusField("submit");
						}}
						selectedSeedId={selectedSeed.id}
						seedOptions={seedRegistry.map((seed) => ({
							label: seed.label,
							value: seed.id,
						}))}
						userEmailInput={userEmailInput}
					/>
				))
				.with("running", "completed", "failed", (state) => (
					<RunScreen
						errorMessage={errorMessage}
						logLines={logLines}
						phase={phase}
						rows={rows}
						screenState={state}
						seedLabel={summary.seedLabel ?? selectedSeed.label}
						summary={summary}
					/>
				))
				.exhaustive()}
			{rows < 24 || columns < 88 ? (
				<Box marginTop={1}>
					<StatusMessage variant={"warning"}>
						Terminal is smaller than the recommended 88x24 size.
					</StatusMessage>
				</Box>
			) : null}
		</Box>
	);
};
