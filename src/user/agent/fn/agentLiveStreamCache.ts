import type { QueryClient } from "@tanstack/react-query";
import { match, P } from "ts-pattern";
import { withAgentLiveItemQuery } from "~/user/agent/query/withAgentLiveItemQuery";
import { withAgentLiveRunCollectionQuery } from "~/user/agent/query/withAgentLiveRunCollectionQuery";
import { withAgentLiveRunQuery } from "~/user/agent/query/withAgentLiveRunQuery";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";
import {
	type agentLiveStreamState,
	applyEventToItem,
	createRun,
	ensureRunItem,
	getFallbackItemId,
	withResponseId,
	withTerminalStatus,
} from "./agentLiveStreamState";

export namespace agentLiveStreamCache {
	export type ItemState = agentLiveStreamState.ItemState;
	export type NoticeKind = agentLiveStreamState.NoticeKind;
	export type RunState = agentLiveStreamState.RunState;
	export type RunStatus = agentLiveStreamState.RunStatus;

	export interface ApplyEventResult {
		terminalStatus?: Exclude<RunStatus, "streaming">;
	}
}

export const seedRun = ({
	queryClient,
	runId,
	userText,
}: {
	queryClient: QueryClient;
	runId: string;
	userText: string;
}) => {
	queryClient.setQueryData<string[]>(withAgentLiveRunCollectionQuery.keys(), (source = []) => {
		return source.includes(runId)
			? source
			: [
					...source,
					runId,
				];
	});

	queryClient.setQueryData(
		withAgentLiveRunQuery.keys({
			runId,
		}),
		createRun({
			runId,
			userText,
		}),
	);
};

export const markRun = ({
	queryClient,
	runId,
	status,
}: {
	queryClient: QueryClient;
	runId: string;
	status: agentLiveStreamCache.RunStatus;
}) => {
	queryClient.setQueryData<agentLiveStreamCache.RunState | undefined>(
		withAgentLiveRunQuery.keys({
			runId,
		}),
		(source) => {
			if (!source) {
				return source;
			}

			return withTerminalStatus({
				run: source,
				status,
			});
		},
	);
};

export const clearRun = ({ queryClient, runId }: { queryClient: QueryClient; runId: string }) => {
	const run = getRun({
		queryClient,
		runId,
	});

	queryClient.setQueryData<string[]>(withAgentLiveRunCollectionQuery.keys(), (source = []) => {
		return source.filter((id) => id !== runId);
	});

	queryClient.removeQueries({
		queryKey: withAgentLiveRunQuery.keys({
			runId,
		}),
		exact: true,
	});

	for (const itemId of run?.itemIds ?? []) {
		queryClient.removeQueries({
			queryKey: withAgentLiveItemQuery.keys({
				runId,
				itemId,
			}),
			exact: true,
		});
	}
};

export const applyEvent = ({
	queryClient,
	runId,
	event,
}: {
	queryClient: QueryClient;
	runId: string;
	event: AgentEvent;
}): agentLiveStreamCache.ApplyEventResult => {
	return match(event)
		.with(
			{
				type: "response.created",
			},
			(event) => {
				queryClient.setQueryData<agentLiveStreamCache.RunState | undefined>(
					withAgentLiveRunQuery.keys({
						runId,
					}),
					(source) => {
						if (!source) {
							return source;
						}

						return withResponseId({
							run: source,
							responseId: event.response.id,
						});
					},
				);

				return {};
			},
		)
		.with(
			{
				type: "response.output_item.added",
			},
			(event) => {
				const itemId = syncRunItemId({
					queryClient,
					runId,
					outputIndex: event.output_index,
					itemId:
						event.item.id ??
						getFallbackItemId({
							runId,
							outputIndex: event.output_index,
						}),
				});

				queryClient.setQueryData(
					withAgentLiveItemQuery.keys({
						runId,
						itemId,
					}),
					event.item,
				);

				return {};
			},
		)
		.with(
			{
				type: "response.output_item.done",
			},
			(event) => {
				const itemId = syncRunItemId({
					queryClient,
					runId,
					outputIndex: event.output_index,
					itemId:
						event.item.id ??
						getFallbackItemId({
							runId,
							outputIndex: event.output_index,
						}),
				});

				queryClient.setQueryData(
					withAgentLiveItemQuery.keys({
						runId,
						itemId,
					}),
					event.item,
				);

				return {};
			},
		)
		.with(
			{
				type: "response.completed",
			},
			() => {
				markRun({
					queryClient,
					runId,
					status: "completed",
				});

				return {
					terminalStatus: "completed",
				};
			},
		)
		.with(
			{
				type: "response.failed",
			},
			() => {
				markRun({
					queryClient,
					runId,
					status: "failed",
				});

				return {
					terminalStatus: "failed",
				};
			},
		)
		.with(
			{
				type: "response.incomplete",
			},
			() => {
				markRun({
					queryClient,
					runId,
					status: "incomplete",
				});

				return {
					terminalStatus: "incomplete",
				};
			},
		)
		.otherwise((event) => {
			const itemEvent = match(event)
				.with(
					{
						item_id: P.string,
						output_index: P.number,
					},
					(event) => event,
				)
				.otherwise(() => null);

			if (!itemEvent) {
				return {};
			}

			const itemId = syncRunItemId({
				queryClient,
				runId,
				outputIndex: itemEvent.output_index,
				itemId: itemEvent.item_id,
			});

			queryClient.setQueryData<agentLiveStreamCache.ItemState | undefined>(
				withAgentLiveItemQuery.keys({
					runId,
					itemId,
				}),
				(source) => {
					return applyEventToItem({
						item: source,
						event,
					});
				},
			);

			return {};
		});
};

export const getRun = ({
	queryClient,
	runId,
}: {
	queryClient: QueryClient;
	runId: string;
}): agentLiveStreamCache.RunState | undefined => {
	return queryClient.getQueryData<agentLiveStreamCache.RunState | undefined>(
		withAgentLiveRunQuery.keys({
			runId,
		}),
	);
};

const syncRunItemId = ({
	queryClient,
	runId,
	outputIndex,
	itemId,
}: {
	queryClient: QueryClient;
	runId: string;
	outputIndex: number;
	itemId: string;
}): string => {
	const run = getRun({
		queryClient,
		runId,
	});

	if (!run) {
		return itemId;
	}

	const result = ensureRunItem({
		run,
		outputIndex,
		itemId,
	});

	if (result.nextRun !== run) {
		queryClient.setQueryData(
			withAgentLiveRunQuery.keys({
				runId,
			}),
			result.nextRun,
		);
	}

	if (result.previousItemId && result.previousItemId !== itemId) {
		const previousItem = queryClient.getQueryData<agentLiveStreamCache.ItemState | undefined>(
			withAgentLiveItemQuery.keys({
				runId,
				itemId: result.previousItemId,
			}),
		);

		if (previousItem) {
			queryClient.setQueryData(
				withAgentLiveItemQuery.keys({
					runId,
					itemId,
				}),
				previousItem,
			);
		}

		queryClient.removeQueries({
			queryKey: withAgentLiveItemQuery.keys({
				runId,
				itemId: result.previousItemId,
			}),
			exact: true,
		});
	}

	return itemId;
};
