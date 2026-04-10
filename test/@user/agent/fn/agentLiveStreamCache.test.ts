import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import {
	applyEvent,
	clearRun,
	getRun,
	markRun,
	seedRun,
} from "~/user/agent/fn/agentLiveStreamCache";
import { withAgentLiveItemQuery } from "~/user/agent/query/withAgentLiveItemQuery";
import { withAgentLiveRunCollectionQuery } from "~/user/agent/query/withAgentLiveRunCollectionQuery";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

describe("agentLiveStreamCache", () => {
	it("stores assistant text deltas on the target message item", () => {
		const queryClient = createQueryClient();
		const runId = "run-text";

		seedRun({
			queryClient,
			runId,
			userText: "Hello",
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.output_item.added",
				output_index: 0,
				sequence_number: 1,
				item: {
					id: "msg-1",
					type: "message",
					role: "assistant",
					status: "in_progress",
					content: [],
				},
			} as AgentEvent,
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.output_text.delta",
				item_id: "msg-1",
				output_index: 0,
				content_index: 0,
				delta: "Hel",
				logprobs: [],
				sequence_number: 2,
			} as AgentEvent,
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.output_text.done",
				item_id: "msg-1",
				output_index: 0,
				content_index: 0,
				text: "Hello there",
				logprobs: [],
				sequence_number: 3,
			} as AgentEvent,
		});

		expect(
			getRun({
				queryClient,
				runId,
			})?.itemIds,
		).toEqual([
			"msg-1",
		]);
		expect(
			getItem({
				queryClient,
				runId,
				itemId: "msg-1",
			}),
		).toMatchObject({
			id: "msg-1",
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

	it("stores reasoning summary and reasoning text on the target reasoning item", () => {
		const queryClient = createQueryClient();
		const runId = "run-reasoning";

		seedRun({
			queryClient,
			runId,
			userText: "Think",
		});

		applyEvent({
			queryClient,
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

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.reasoning_summary_text.delta",
				item_id: "reason-1",
				output_index: 0,
				summary_index: 0,
				delta: "Thin",
				sequence_number: 2,
			} as AgentEvent,
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.reasoning_summary_text.done",
				item_id: "reason-1",
				output_index: 0,
				summary_index: 0,
				text: "Thinking out loud",
				sequence_number: 3,
			} as AgentEvent,
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.reasoning_text.done",
				item_id: "reason-1",
				output_index: 0,
				content_index: 0,
				text: "Internal reasoning",
				sequence_number: 4,
			} as AgentEvent,
		});

		expect(
			getItem({
				queryClient,
				runId,
				itemId: "reason-1",
			}),
		).toMatchObject({
			id: "reason-1",
			type: "reasoning",
			summary: [
				{
					type: "summary_text",
					text: "Thinking out loud",
				},
			],
			content: [
				{
					type: "reasoning_text",
					text: "Internal reasoning",
				},
			],
		});
	});

	it("stores function call argument deltas on the target tool item", () => {
		const queryClient = createQueryClient();
		const runId = "run-tool";

		seedRun({
			queryClient,
			runId,
			userText: "Call a function",
		});

		applyEvent({
			queryClient,
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

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.function_call_arguments.delta",
				item_id: "call-item-1",
				output_index: 0,
				delta: '{"query":',
				sequence_number: 2,
			} as AgentEvent,
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.function_call_arguments.done",
				item_id: "call-item-1",
				output_index: 0,
				name: "search",
				arguments: '{"query":"weather"}',
				sequence_number: 3,
			} as AgentEvent,
		});

		expect(
			getItem({
				queryClient,
				runId,
				itemId: "call-item-1",
			}),
		).toMatchObject({
			id: "call-item-1",
			type: "function_call",
			call_id: "call-1",
			name: "search",
			arguments: '{"query":"weather"}',
		});
	});

	it("orders live items by output index instead of first event arrival", () => {
		const queryClient = createQueryClient();
		const runId = "run-order";

		seedRun({
			queryClient,
			runId,
			userText: "Order matters",
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.output_text.delta",
				item_id: "msg-late",
				output_index: 1,
				content_index: 0,
				delta: "Answer",
				logprobs: [],
				sequence_number: 1,
			} as AgentEvent,
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.function_call_arguments.delta",
				item_id: "tool-early",
				output_index: 0,
				delta: '{"query":"draft"}',
				sequence_number: 2,
			} as AgentEvent,
		});

		expect(
			getRun({
				queryClient,
				runId,
			})?.itemIds,
		).toEqual([
			"tool-early",
			"msg-late",
		]);
	});

	it("keeps partial output visible when the run is cancelled", () => {
		const queryClient = createQueryClient();
		const runId = "run-cancelled";

		seedRun({
			queryClient,
			runId,
			userText: "Cancel me",
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.output_item.added",
				output_index: 0,
				sequence_number: 1,
				item: {
					id: "msg-cancelled",
					type: "message",
					role: "assistant",
					status: "in_progress",
					content: [],
				},
			} as AgentEvent,
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.output_text.delta",
				item_id: "msg-cancelled",
				output_index: 0,
				content_index: 0,
				delta: "Part",
				logprobs: [],
				sequence_number: 2,
			} as AgentEvent,
		});

		markRun({
			queryClient,
			runId,
			status: "cancelled",
		});

		expect(
			getRun({
				queryClient,
				runId,
			}),
		).toMatchObject({
			status: "cancelled",
			notice: "cancelled",
		});
		expect(
			getItem({
				queryClient,
				runId,
				itemId: "msg-cancelled",
			}),
		).toMatchObject({
			content: [
				{
					type: "output_text",
					text: "Part",
				},
			],
		});
	});

	it("keeps partial output visible when the run fails", () => {
		const queryClient = createQueryClient();
		const runId = "run-failed";

		seedRun({
			queryClient,
			runId,
			userText: "Fail me",
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.output_item.added",
				output_index: 0,
				sequence_number: 1,
				item: {
					id: "msg-failed",
					type: "message",
					role: "assistant",
					status: "in_progress",
					content: [],
				},
			} as AgentEvent,
		});

		applyEvent({
			queryClient,
			runId,
			event: {
				type: "response.output_text.delta",
				item_id: "msg-failed",
				output_index: 0,
				content_index: 0,
				delta: "Still here",
				logprobs: [],
				sequence_number: 2,
			} as AgentEvent,
		});

		markRun({
			queryClient,
			runId,
			status: "failed",
		});

		expect(
			getRun({
				queryClient,
				runId,
			}),
		).toMatchObject({
			status: "failed",
			notice: "failed",
		});
		expect(
			getItem({
				queryClient,
				runId,
				itemId: "msg-failed",
			}),
		).toMatchObject({
			content: [
				{
					type: "output_text",
					text: "Still here",
				},
			],
		});
	});

	it("clears the live run collection, run cache and item caches", () => {
		const queryClient = createQueryClient();
		const runId = "run-completed";

		seedRun({
			queryClient,
			runId,
			userText: "Done",
		});

		applyEvent({
			queryClient,
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
					content: [],
				},
			} as AgentEvent,
		});

		clearRun({
			queryClient,
			runId,
		});

		expect(queryClient.getQueryData<string[]>(withAgentLiveRunCollectionQuery.keys())).toEqual(
			[],
		);
		expect(
			getRun({
				queryClient,
				runId,
			}),
		).toBeUndefined();
		expect(
			getItem({
				queryClient,
				runId,
				itemId: "msg-done",
			}),
		).toBeUndefined();
	});
});

const createQueryClient = (): QueryClient => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	});
};

const getItem = ({
	queryClient,
	runId,
	itemId,
}: {
	queryClient: QueryClient;
	runId: string;
	itemId: string;
}) => {
	return queryClient.getQueryData(
		withAgentLiveItemQuery.keys({
			runId,
			itemId,
		}),
	);
};
