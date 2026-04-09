import type { AssistantMessageItem } from "@openai/agents-core";
import type { ResponseOutputMessage } from "openai/resources/responses/responses";
import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";

type AgentAssistantMessage = AssistantMessageItem | ResponseOutputMessage;
type AgentAssistantMessagePart = AgentAssistantMessage["content"][number];

export namespace AgentAssistantMessageItem {
	export interface Props extends Container.Props {
		item: AgentAssistantMessage;
	}
}

export const AgentAssistantMessageItem: FC<AgentAssistantMessageItem.Props> = ({
	item,
	ui,
	...props
}) => {
	const keyMap = new Map<string, number>();
	const parts = item.content.map((part) => {
		const key = getKey({
			keyMap,
			value: part,
		});

		return match(part)
			.with(
				{
					type: "output_text",
				},
				(part) => <Markdown key={key}>{part.text}</Markdown>,
			)
			.with(
				{
					type: "refusal",
				},
				(part) => <Markdown key={key}>{part.refusal}</Markdown>,
			)
			.otherwise((part) => (
				<pre
					key={key}
					className={"whitespace-pre-wrap break-words text-sm opacity-70"}
				>
					{JSON.stringify(part, null, 2)}
				</pre>
			));
	});

	return (
		<Container
			data-ui={"AgentAssistantMessageItem"}
			ui={{
				flow: "horizontal",
				justify: "start",
				...ui,
			}}
			{...props}
		>
			<Container
				data-ui={"AgentAssistantMessageItem[Card]"}
				ui={{
					background: "alt",
					border: true,
					round: "default",
					inner: "default",
					flow: "vertical",
					gap: "xs",
				}}
				className={[
					"max-w-[min(48rem,100%)]",
				]}
			>
				{parts.length > 0 ? parts : getEmptyContent()}
			</Container>
		</Container>
	);
};

const getEmptyContent = (): ReactNode => {
	return null;
};

const getKey = ({
	keyMap,
	value,
}: {
	keyMap: Map<string, number>;
	value: AgentAssistantMessagePart;
}): string => {
	const base = JSON.stringify(value);
	const count = keyMap.get(base) ?? 0;

	keyMap.set(base, count + 1);

	return `${base}-${count}`;
};
