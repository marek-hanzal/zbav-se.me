import { create } from "zustand";
import type { AgentLiveStore } from "./AgentLiveStore";
import { applyAgentLiveEvent } from "./applyAgentLiveEvent";
import { clearAgentLiveRun } from "./clearAgentLiveRun";
import { markAgentLiveRun } from "./markAgentLiveRun";
import { seedAgentLiveRun } from "./seedAgentLiveRun";

export const createAgentLiveStore = (): AgentLiveStore.Hook => {
	return create<AgentLiveStore.Value>((set) => ({
		runIds: [],
		runById: {},
		slotById: {},

		seedRun({ runId, userText }) {
			set((state) =>
				seedAgentLiveRun({
					state,
					runId,
					userText,
				}),
			);
		},

		clearRun({ runId }) {
			set((state) =>
				clearAgentLiveRun({
					state,
					runId,
				}),
			);
		},

		markRun({ runId, status }) {
			set((state) =>
				markAgentLiveRun({
					state,
					runId,
					status,
				}),
			);
		},

		applyEvent({ runId, event }) {
			let result: AgentLiveStore.ApplyEventResult = {};

			set((state) => {
				const next = applyAgentLiveEvent({
					state,
					runId,
					event,
				});

				result = next.result;

				return next.patch;
			});

			return result;
		},
	}));
};
