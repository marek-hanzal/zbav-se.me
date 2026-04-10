import type { StoreApi, UseBoundStore } from "zustand";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";
import type { AgentLiveRunState } from "./AgentLiveRunState";
import type { AgentLiveSlotState } from "./AgentLiveSlotState";

export namespace AgentLiveStore {
	export type TerminalStatus = Exclude<AgentLiveRunState.Status, "streaming">;

	export interface State {
		runIds: string[];
		runById: Record<string, AgentLiveRunState.Value | undefined>;
		slotById: Record<string, AgentLiveSlotState.Value | undefined>;
	}

	export interface ApplyEventResult {
		terminalStatus?: TerminalStatus;
	}

	export interface Value extends State {
		seedRun(props: { runId: string; userText: string }): void;
		clearRun(props: { runId: string }): void;
		markRun(props: { runId: string; status: TerminalStatus }): void;
		applyEvent(props: { runId: string; event: AgentEvent }): ApplyEventResult;
	}

	export type Hook = UseBoundStore<StoreApi<Value>>;
}
