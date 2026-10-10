export namespace SeedRunSummary {
	export type PhaseStatus = "completed" | "pending" | "running";

	export interface Phase {
		name: string;
		done: number;
		total: number;
		status: PhaseStatus;
	}

	export interface Type {
		seedId: string;
		seedLabel: string;
		userEmail: string;
		userId: string;
		requestedCount: number;
		createdCount: number;
		beforeTotal: number;
		afterTotal: number;
		phases: Phase[];
		currentPhase: Phase | null;
	}
}
