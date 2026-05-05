import { ProgressBar, Spinner, StatusMessage } from "@inkjs/ui";
import { Box, Text } from "ink";
import { type FC, useEffect, useRef, useState } from "react";
import { match, P } from "ts-pattern";
import type { SeedRunSummary } from "~/seed/seed/SeedRunSummary";

type ScreenState = "completed" | "failed" | "running";

type PhaseState = {
	done: number;
	name: string;
	startedAt: number;
	total: number;
} | null;

const toEtaSeconds = (phase: PhaseState) => {
	if (!phase || phase.done <= 0 || phase.total <= phase.done) {
		return null;
	}

	const elapsedMs = Date.now() - phase.startedAt;
	if (elapsedMs <= 0) {
		return null;
	}

	const rate = phase.done / elapsedMs;
	if (rate <= 0) {
		return null;
	}

	const remainingMs = Math.round((phase.total - phase.done) / rate);
	return Math.max(0, Math.floor(remainingMs / 1000));
};

const formatEta = (etaSeconds: number | null) => {
	if (etaSeconds === null) {
		return "--:--";
	}

	const totalSeconds = Math.max(0, etaSeconds);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export namespace RunScreen {
	export interface Props {
		errorMessage: string | null;
		logLines: string[];
		phase: PhaseState;
		rows: number;
		screenState: ScreenState;
		seedLabel: string;
		summary: Partial<SeedRunSummary.Type>;
	}
}

const toPhaseValue = (phase: SeedRunSummary.Phase) => {
	return match(phase)
		.when(
			(currentPhase) => currentPhase.status === "completed",
			() => 100,
		)
		.when(
			(currentPhase) => currentPhase.total <= 0,
			() => 0,
		)
		.otherwise((currentPhase) =>
			Math.round((currentPhase.done / Math.max(1, currentPhase.total)) * 100),
		);
};

const toProgressName = (phase: PhaseState, screenState: ScreenState) => {
	return match(phase?.name)
		.with(P.string, (phaseName) => phaseName)
		.with(undefined, () =>
			match(screenState)
				.with("completed", () => "Seed completed")
				.with("failed", () => "Seed failed")
				.with("running", () => "Waiting for progress")
				.exhaustive(),
		)
		.exhaustive();
};

const isTerminalScreenState = (screenState: ScreenState) => {
	return match(screenState)
		.with("completed", () => true)
		.with("failed", () => true)
		.with("running", () => false)
		.exhaustive();
};

const toProgressTotals = (
	phase: PhaseState,
	summary: Partial<SeedRunSummary.Type>,
	screenState: ScreenState,
) => {
	const isTerminal = isTerminalScreenState(screenState);
	const summaryRequestedCount = summary.requestedCount ?? 0;
	const summaryCreatedCount = summary.createdCount ?? 0;

	return {
		total:
			phase?.total ?? summary.currentPhase?.total ?? (isTerminal ? summaryRequestedCount : 0),
		done: phase?.done ?? summary.currentPhase?.done ?? (isTerminal ? summaryCreatedCount : 0),
	};
};

const toPhaseLabel = (phase: SeedRunSummary.Phase, eta: string) => {
	return match(phase.status)
		.with("running", () => `${phase.done}/${phase.total} ETA ${eta}`)
		.otherwise(() => `${phase.done}/${phase.total}`);
};

const toPhaseStatusLabel = (status: SeedRunSummary.PhaseStatus) => {
	return match(status)
		.with("completed", () => " [done]")
		.with("running", () => " [running]")
		.with("pending", () => " [pending]")
		.exhaustive();
};

const toSmoothedEtaSeconds = (current: number | null, next: number | null) => {
	return match({
		current,
		next,
	})
		.with(
			{
				next: null,
			},
			() => null,
		)
		.with(
			{
				current: null,
				next: P.number,
			},
			({ next: nextEtaSeconds }) => nextEtaSeconds,
		)
		.with(
			{
				current: P.number,
				next: P.number,
			},
			({ current: currentEtaSeconds, next: nextEtaSeconds }) => {
				const blended = Math.round(currentEtaSeconds * 0.8 + nextEtaSeconds * 0.2);
				const maxDelta = Math.max(2, Math.round(currentEtaSeconds * 0.12));
				const lowerBound = Math.max(0, currentEtaSeconds - maxDelta);
				const upperBound = currentEtaSeconds + maxDelta;

				return Math.min(upperBound, Math.max(lowerBound, blended));
			},
		)
		.exhaustive();
};

const toFooter = (screenState: ScreenState, errorMessage: string | null) => {
	return match(screenState)
		.with("completed", () => (
			<StatusMessage variant={"success"}>
				Seed finished. Press q to quit or r to go back to setup.
			</StatusMessage>
		))
		.with("failed", () => (
			<StatusMessage variant={"error"}>
				{errorMessage ?? "Seed failed."} Press q to quit or r to go back to setup.
			</StatusMessage>
		))
		.with("running", () => (
			<StatusMessage variant={"info"}>
				Seed is running. Ctrl+C is the only immediate exit.
			</StatusMessage>
		))
		.exhaustive();
};

const MAX_VISIBLE_PHASES = 3;

const toVisiblePhases = (phases: SeedRunSummary.Phase[]) => {
	if (phases.length <= MAX_VISIBLE_PHASES) {
		return phases;
	}

	const activeIndex = phases.findIndex((phase) => phase.status === "running");
	const pendingIndex = phases.findIndex((phase) => phase.status === "pending");
	const anchorIndex =
		activeIndex >= 0 ? activeIndex : pendingIndex >= 0 ? pendingIndex : phases.length - 1;
	const windowStart = Math.max(0, Math.min(anchorIndex - 1, phases.length - MAX_VISIBLE_PHASES));

	return phases.slice(windowStart, windowStart + MAX_VISIBLE_PHASES);
};

export const RunScreen: FC<RunScreen.Props> = ({
	errorMessage,
	logLines,
	phase,
	rows,
	screenState,
	seedLabel,
	summary,
}) => {
	const progressName = toProgressName(phase, screenState);
	const progressTotals = toProgressTotals(phase, summary, screenState);
	const progressTotal = progressTotals.total;
	const progressDone = progressTotals.done;
	const progressValue =
		progressTotal > 0 ? Math.round((progressDone / Math.max(1, progressTotal)) * 100) : 0;
	const phaseRows = summary.phases ?? [];
	const visiblePhaseRows = toVisiblePhases(phaseRows);
	const [displayedEtaSeconds, setDisplayedEtaSeconds] = useState<number | null>(() => {
		return toEtaSeconds(phase);
	});
	const phaseRef = useRef(phase);
	const phaseKey = phase ? `${phase.name}:${phase.startedAt}` : null;
	const logLimit = Math.max(4, Math.min(10, rows - 18 - visiblePhaseRows.length * 3));
	const visibleLogs = logLines.slice(-logLimit);
	const keyedVisibleLogs = (() => {
		const duplicateCounts = new Map<string, number>();

		return visibleLogs.map((line) => {
			const duplicateCount = (duplicateCounts.get(line) ?? 0) + 1;
			duplicateCounts.set(line, duplicateCount);

			return {
				key: `${line}-${duplicateCount}`,
				line,
			};
		});
	})();

	useEffect(() => {
		phaseRef.current = phase;
	}, [
		phase,
	]);

	useEffect(() => {
		if (phaseKey === null || !phaseRef.current) {
			setDisplayedEtaSeconds(null);
			return;
		}

		const updateEta = () => {
			const nextEtaSeconds = toEtaSeconds(phaseRef.current);

			setDisplayedEtaSeconds((current) => toSmoothedEtaSeconds(current, nextEtaSeconds));
		};

		updateEta();

		const interval = setInterval(updateEta, 1200);

		return () => {
			clearInterval(interval);
		};
	}, [
		phaseKey,
	]);

	const eta = formatEta(displayedEtaSeconds);

	return (
		<Box
			borderColor={"cyan"}
			borderStyle={"round"}
			flexDirection={"column"}
			flexGrow={1}
			paddingX={2}
			paddingY={1}
			gap={1}
		>
			<Text
				bold
				color={"cyan"}
			>
				{seedLabel} seed
			</Text>

			<Box
				borderColor={"gray"}
				borderStyle={"round"}
				flexDirection={"column"}
				flexShrink={0}
				paddingX={1}
				paddingY={1}
			>
				<Box
					flexDirection={"column"}
					gap={1}
				>
					{phaseRows.length > 0 ? (
						visiblePhaseRows.map((phaseRow) => {
							const isRunning = phaseRow.status === "running";
							const label = toPhaseLabel(phaseRow, eta);

							return (
								<Box
									flexDirection={"column"}
									key={phaseRow.name}
									width={"100%"}
								>
									<Box
										width={"100%"}
										justifyContent={"space-between"}
									>
										<Box
											flexShrink={1}
											marginRight={1}
										>
											<Text
												bold={isRunning}
												wrap={"truncate-end"}
											>
												{phaseRow.name}
											</Text>
										</Box>

										<Text bold={isRunning}>
											{toPhaseStatusLabel(phaseRow.status)}
										</Text>
									</Box>

									<Box>
										{isRunning ? (
											<Spinner label={label} />
										) : (
											<Text>{label}</Text>
										)}
									</Box>

									<Box>
										<ProgressBar value={toPhaseValue(phaseRow)} />
									</Box>
								</Box>
							);
						})
					) : (
						<>
							<Text bold>{progressName}aaa</Text>

							<Box marginTop={1}>
								{screenState === "running" ? (
									<Spinner
										label={`${progressDone}/${progressTotal} ETA ${eta}`}
									/>
								) : (
									<Text>
										{progressDone}/{progressTotal} ETA {eta}
									</Text>
								)}
							</Box>

							<Box>
								<ProgressBar value={progressValue} />
							</Box>
						</>
					)}
				</Box>
			</Box>

			<Box
				borderColor={"gray"}
				borderStyle={"round"}
				flexDirection={"column"}
				flexGrow={1}
				paddingX={1}
				paddingY={1}
			>
				<Text bold>Logs</Text>
				<Box flexDirection={"column"}>
					{visibleLogs.length > 0 ? (
						keyedVisibleLogs.map((item) => {
							return (
								<Text
									key={item.key}
									wrap={"truncate-end"}
								>
									{item.line}
								</Text>
							);
						})
					) : (
						<Text dimColor>No logs yet.</Text>
					)}
				</Box>
			</Box>

			<Box
				borderColor={"gray"}
				borderStyle={"round"}
				flexDirection={"column"}
				paddingX={1}
				paddingY={1}
			>
				<Text>Current total: {summary.beforeTotal ?? 0}</Text>
				<Text>
					Generated now: {summary.createdCount ?? 0} / {summary.requestedCount ?? 0}
				</Text>
				<Text>
					New total:{" "}
					{match(screenState)
						.with("completed", () => String(summary.afterTotal ?? 0))
						.otherwise(() => "-")}
				</Text>
				<Text dimColor>User: {summary.userEmail ?? "-"}</Text>
			</Box>

			<Box>{toFooter(screenState, errorMessage)}</Box>
		</Box>
	);
};
