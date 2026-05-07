import type { SeedRunSummary } from "./SeedRunSummary";

export namespace SeedProgressEvent {
	export interface PhaseStarted {
		type: "phase-started";
		name: string;
		total: number;
	}

	export interface PhaseAdvanced {
		type: "phase-advanced";
		delta: number;
	}

	export interface PhaseFinished {
		type: "phase-finished";
	}

	export interface LogAdded {
		type: "log-added";
		message: string;
	}

	export interface SummaryUpdated {
		type: "summary-updated";
		summary: Partial<SeedRunSummary.Type>;
	}

	export type Type = LogAdded | PhaseAdvanced | PhaseFinished | PhaseStarted | SummaryUpdated;
}
