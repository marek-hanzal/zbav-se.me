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
		//
	}
}

export const HistoryList: FC<HistoryList.Props> = (props) => {
	const { data: items } = withAgentStreamItemsQuery.useSuspenseQuery(AgentStreamItemsQuery);

	return (
		<Container
			data-ui={"HistoryList"}
			data-ui-flow="vertical"
			data-ui-gap="default"
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
									item={item}
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
								item={item}
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
