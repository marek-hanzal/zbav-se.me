import type { AgentInputItem } from "@openai/agents-core";
import { createContext } from "react";

export namespace AgentRuntimeContext {
	export interface QueueItem {
		input: AgentInputItem[];
	}

	export interface ThreadState {
		isRunning: boolean;
		queue: QueueItem[];
	}

	export interface Value {
		getThreadState(threadId: string): ThreadState;
		submit(threadId: string, input: AgentInputItem[]): void;
		clearQueue(threadId: string): void;
		cancel(threadId: string): void;
	}
}

export const AgentRuntimeContext = createContext<AgentRuntimeContext.Value | null>(null);
