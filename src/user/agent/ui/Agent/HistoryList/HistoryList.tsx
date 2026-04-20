import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { AgentStreamItemsQuery } from "~/user/agent/query/AgentStreamItemsQuery";
import { withAgentStreamItemsQuery } from "~/user/agent/query/withAgentStreamItemsQuery";
import { AssistantMessage } from "./AssistantMessage";
import { SystemMessage } from "./SystemMessage";
import { ToolCallItem } from "./ToolCallItem";
import { UserMessage } from "./UserMessage";

export namespace HistoryList {
	export interface Props extends Container.Props {
		threadId: string;
	}
}

export const HistoryList: FC<HistoryList.Props> = ({ threadId, ...props }) => {
	const { data: items } = withAgentStreamItemsQuery.useSuspenseQuery(
		AgentStreamItemsQuery(threadId),
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
							<ToolCallItem
								key={`function-call-${item.callId}`}
								item={item}
								items={items}
								inline
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
						() => {
							return null;
						},
					)
					.otherwise((event) => {
						console.warn(event);
						return "unknown";
					});
			})}
		</Container>
	);
};
