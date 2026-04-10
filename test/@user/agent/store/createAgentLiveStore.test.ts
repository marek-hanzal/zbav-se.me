import { describe, expect, it } from "vitest";
import { createAgentLiveStore } from "~/user/agent/store/createAgentLiveStore";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

describe("createAgentLiveStore", () => {
	it("keeps output_index order and preserves streamed message content across late item snapshots", () => {
		const store = createStore();
		const runId = "run-order";

		store.getState().seedRun({
			runId,
			userText: "Order matters",
		});

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.output_text.delta",
				item_id: "msg-temp",
				output_index: 1,
				content_index: 0,
				delta: "Hel",
				logprobs: [],
				sequence_number: 1,
			} as AgentEvent,
		});

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.function_call_arguments.delta",
				item_id: "tool-early",
				output_index: 0,
				delta: '{"query":"draft"}',
				sequence_number: 2,
			} as AgentEvent,
		});

		expect(getRun(store, runId)?.orderedSlotIds).toEqual([
			getSlotId(store, runId, 0),
			getSlotId(store, runId, 1),
		]);

		const messageSlotId = getSlotId(store, runId, 1);

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.output_item.added",
				output_index: 1,
				sequence_number: 3,
				item: {
					id: "msg-real",
					type: "message",
					role: "assistant",
					status: "in_progress",
					content: [],
				},
			} as AgentEvent,
		});

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.output_text.done",
				item_id: "msg-real",
				output_index: 1,
				content_index: 0,
				text: "Hello there",
				logprobs: [],
				sequence_number: 4,
			} as AgentEvent,
		});

		expect(getSlotId(store, runId, 1)).toBe(messageSlotId);
		expect(getRun(store, runId)?.slotIdByItemId["msg-temp"]).toBeUndefined();
		expect(getRun(store, runId)?.slotIdByItemId["msg-real"]).toBe(messageSlotId);
		expect(getSlot(store, runId, 1)?.item).toMatchObject({
			id: "msg-real",
			type: "message",
			role: "assistant",
			content: [
				{
					type: "output_text",
					text: "Hello there",
				},
			],
		});
	});

	it("keeps reasoning as trailing activity state without creating a visible slot", () => {
		const store = createStore();
		const runId = "run-reasoning";

		store.getState().seedRun({
			runId,
			userText: "Think",
		});

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.output_item.added",
				output_index: 0,
				sequence_number: 1,
				item: {
					id: "reason-1",
					type: "reasoning",
					status: "in_progress",
					summary: [],
					content: [],
				},
			} as AgentEvent,
		});

		expect(getRun(store, runId)?.orderedSlotIds).toEqual([]);
		expect(getRun(store, runId)?.activity.kind).toBe("thinking");

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.output_item.done",
				output_index: 0,
				sequence_number: 2,
				item: {
					id: "reason-1",
					type: "reasoning",
					status: "completed",
					summary: [],
					content: [],
				},
			} as AgentEvent,
		});

		expect(getRun(store, runId)?.orderedSlotIds).toEqual([]);
		expect(getRun(store, runId)?.activity.kind).toBe("pending");
	});

	it("keeps trailing tool activity while the tool call or tool output is in progress", () => {
		const store = createStore();
		const runId = "run-tool";

		store.getState().seedRun({
			runId,
			userText: "Call a function",
		});

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.output_item.added",
				output_index: 0,
				sequence_number: 1,
				item: {
					id: "call-item-1",
					type: "function_call",
					call_id: "call-1",
					name: "search",
					arguments: "",
					status: "in_progress",
				},
			} as AgentEvent,
		});

		expect(getRun(store, runId)?.activity.kind).toBe("tool");

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.output_item.done",
				output_index: 0,
				sequence_number: 2,
				item: {
					id: "call-item-1",
					type: "function_call",
					call_id: "call-1",
					name: "search",
					arguments: '{"query":"weather"}',
					status: "completed",
				},
			} as AgentEvent,
		});

		expect(getRun(store, runId)?.activity.kind).toBe("idle");

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.output_item.added",
				output_index: 1,
				sequence_number: 3,
				item: {
					id: "call-output-1",
					type: "function_call_output",
					call_id: "call-1",
					output: "",
					status: "in_progress",
				},
			} as AgentEvent,
		});

		expect(getRun(store, runId)?.activity.kind).toBe("tool");

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.output_item.done",
				output_index: 1,
				sequence_number: 4,
				item: {
					id: "call-output-1",
					type: "function_call_output",
					call_id: "call-1",
					output: "done",
					status: "completed",
				},
			} as AgentEvent,
		});

		expect(getRun(store, runId)?.activity.kind).toBe("idle");
	});

	it("keeps partial output visible for cancelled, failed, and incomplete terminal states", () => {
		const cases = [
			{
				label: "cancelled",
				status: "cancelled",
			},
			{
				label: "failed",
				status: "failed",
			},
			{
				label: "incomplete",
				status: "incomplete",
			},
		] as const;

		for (const testCase of cases) {
			const store = createStore();
			const runId = `run-${testCase.label}`;

			store.getState().seedRun({
				runId,
				userText: "Keep it",
			});

			store.getState().applyEvent({
				runId,
				event: {
					type: "response.output_text.delta",
					item_id: `msg-${testCase.label}`,
					output_index: 0,
					content_index: 0,
					delta: "Part",
					logprobs: [],
					sequence_number: 1,
				} as AgentEvent,
			});

			store.getState().markRun({
				runId,
				status: testCase.status,
			});

			expect(getRun(store, runId)).toMatchObject({
				status: testCase.status,
				notice: testCase.status,
			});
			expect(getSlot(store, runId, 0)?.item).toMatchObject({
				type: "message",
				role: "assistant",
				content: [
					{
						type: "output_text",
						text: "Part",
					},
				],
			});
		}
	});

	it("returns terminal status on completion events and keeps the run visible until cleared", () => {
		const store = createStore();
		const runId = "run-completed";

		store.getState().seedRun({
			runId,
			userText: "Done",
		});

		store.getState().applyEvent({
			runId,
			event: {
				type: "response.output_item.added",
				output_index: 0,
				sequence_number: 1,
				item: {
					id: "msg-done",
					type: "message",
					role: "assistant",
					status: "completed",
					content: [
						{
							type: "output_text",
							text: "Done",
							annotations: [],
						},
					],
				},
			} as AgentEvent,
		});

		const result = store.getState().applyEvent({
			runId,
			event: {
				type: "response.completed",
				response: {
					id: "resp-1",
					object: "response",
					created_at: 0,
					status: "completed",
					model: "gpt-5.4",
					output: [],
					parallel_tool_calls: false,
					tool_choice: "auto",
				},
				sequence_number: 2,
			} as unknown as AgentEvent,
		});

		expect(result.terminalStatus).toBe("completed");
		expect(getRun(store, runId)?.status).toBe("completed");

		store.getState().clearRun({
			runId,
		});

		expect(store.getState().runIds).toEqual([]);
		expect(getRun(store, runId)).toBeUndefined();
		expect(getSlot(store, runId, 0)).toBeUndefined();
	});
});

const createStore = () => {
	return createAgentLiveStore();
};

const getRun = (store: ReturnType<typeof createStore>, runId: string) => {
	return store.getState().runById[runId];
};

const getSlotId = (store: ReturnType<typeof createStore>, runId: string, outputIndex: number) => {
	return getRun(store, runId)?.slotIdByOutputIndex[String(outputIndex)];
};

const getSlot = (store: ReturnType<typeof createStore>, runId: string, outputIndex: number) => {
	const slotId = getSlotId(store, runId, outputIndex);

	return slotId ? store.getState().slotById[slotId] : undefined;
};
