import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
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

export const HistoryList: FC<HistoryList.Props> = ({ ui, ...props }) => {
	const { data: items } = withAgentStreamItemsQuery.useSuspenseQuery({
		sort: [
			{
				field: "sort",
				order: "asc",
			},
		],
		cursor: {
			page: 0,
			size: 512,
		},
	});

	return (
		<Container
			data-ui={"HistoryList"}
			ui={{
				flow: "vertical",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			{items.map((item) => {
				return match(item)
					.with(
						{
							role: "user",
						},
						(item) => (
							<UserMessage
								key={`user-${item.id}`}
								item={item}
							/>
						),
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
