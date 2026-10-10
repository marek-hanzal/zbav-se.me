import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "~/ui/ui/Container";
import { AgentStreamItemsQueryFn } from "~/user-agent/query/AgentStreamItemsQueryFn";
import { withAgentStreamItemsQuery } from "~/user-agent/query/withAgentStreamItemsQuery";
import { AssistantMessage } from "~/user-agent/ui/Agent/HistoryList/AssistantMessage";
import { Reasoning } from "~/user-agent/ui/Agent/HistoryList/Reasoning";
import { SystemMessage } from "~/user-agent/ui/Agent/HistoryList/SystemMessage";
import { ToolCall } from "~/user-agent/ui/Agent/HistoryList/ToolCall";
import { UserMessage } from "~/user-agent/ui/Agent/HistoryList/UserMessage";

export namespace HistoryList {
	export interface Props extends Container.Props {
		threadId: string;
		inline: boolean;
	}
}

export const HistoryList: FC<HistoryList.Props> = ({ threadId, inline, ...props }) => {
	const { data: items } = withAgentStreamItemsQuery.useSuspenseQuery(
		AgentStreamItemsQueryFn(threadId),
	);

	return (
		<Container
			data-ui={"HistoryList"}
			data-ui-flow="vertical"
			data-ui-gap="lg"
			{...props}
		>
			{items.map((item, index) => {
				return match(item)
					.with(
						{
							role: "user",
						},
						(item) => {
							return (
								<UserMessage
									key={`user-${item.id ?? index}`}
									content={item.content}
								/>
							);
						},
					)
					.with(
						{
							role: "assistant",
						},
						(item) => (
							<AssistantMessage
								key={`assistant-${item.id}`}
								content={item.content}
								groupId={item.id}
							/>
						),
					)
					.with(
						{
							role: "system",
						},
						(item) => (
							<SystemMessage
								key={`system-${item.id}`}
								item={item}
							/>
						),
					)
					.with(
						{
							type: "function_call",
						},
						(item) => (
							<ToolCall
								key={`function-call-${item.callId}`}
								item={item}
								items={items}
								inline={inline}
							/>
						),
					)
					.with(
						{
							type: "function_call_result",
						},
						() => {
							return null;
						},
					)
					.with(
						{
							type: "reasoning",
						},
						(item) => (
							<Reasoning
								key={`reasoning-${item.id ?? index}`}
								item={item}
							/>
						),
					)
					.otherwise((event) => {
						console.warn(event);
						return "unknown";
					});
			})}
		</Container>
	);
};
