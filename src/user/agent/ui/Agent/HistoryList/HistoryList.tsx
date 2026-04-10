import type { AgentInputItem } from "@openai/agents-core";
import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { AssistantMessage } from "./AssistantMessage";
import { SystemMessage } from "./SystemMessage";
import { UserMessage } from "./UserMessage";

export namespace HistoryList {
	export interface Props extends Container.Props {
		items: AgentInputItem[];
	}
}

export const HistoryList: FC<HistoryList.Props> = ({ items, ui, ...props }) => {
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
					.otherwise((event) => {
						console.warn(event);
						return "unknown";
					});
			})}
		</Container>
	);
};
