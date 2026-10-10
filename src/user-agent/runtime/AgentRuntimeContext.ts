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
		getThreadStateFn(threadId: string): ThreadState;
		submitFn(threadId: string, input: AgentInputItem[]): void;
		clearQueueFn(threadId: string): void;
		cancelFn(threadId: string): void;
	}
}

export const AgentRuntimeContext = createContext<AgentRuntimeContext.Value | null>(null);
