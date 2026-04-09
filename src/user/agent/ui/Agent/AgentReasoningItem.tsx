import type { ReasoningItem } from "@openai/agents-core";
import type { ResponseReasoningItem } from "openai/resources/responses/responses";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";
import { AgentRawItem } from "./AgentRawItem";

type AgentReasoning = ReasoningItem | ResponseReasoningItem;

export namespace AgentReasoningItem {
	export interface Props extends Container.Props {
		item: AgentReasoning;
	}
}

export const AgentReasoningItem: FC<AgentReasoningItem.Props> = ({ item, ui, ...props }) => {
	const lines = getLines(item);

	if (lines.length === 0) {
		return (
			<AgentRawItem
				item={item}
				ui={ui}
				{...props}
			/>
		);
	}

	return (
		<Container
			data-ui={"AgentReasoningItem"}
			ui={{
				background: "alt",
				border: true,
				round: "default",
				inner: "default",
				flow: "vertical",
				gap: "xs",
				text: "sm",
				opacity: "7",
				...ui,
			}}
			className={[
				"max-w-[min(42rem,100%)]",
			]}
			{...props}
		>
			<div className={"text-xs font-semibold uppercase opacity-60"}>Reasoning</div>

			{getReasoningLines(lines)}
		</Container>
	);
};

const getLines = (item: AgentReasoning): string[] => {
	const summary = ("summary" in item ? item.summary : []).map(({ text }) => text).filter(Boolean);

	if (summary.length > 0) {
		return summary;
	}

	const content = ("content" in item ? (item.content ?? []) : [])
		.map(({ text }) => text)
		.filter(Boolean);

	if (content.length > 0) {
		return content;
	}

	return ("rawContent" in item ? (item.rawContent ?? []) : [])
		.map(({ text }) => text)
		.filter(Boolean);
};

const getReasoningLines = (lines: string[]) => {
	const keyMap = new Map<string, number>();

	return lines.map((line) => {
		const key = getKey({
			keyMap,
			value: line,
		});

		return <Markdown key={key}>{line}</Markdown>;
	});
};

const getKey = ({ keyMap, value }: { keyMap: Map<string, number>; value: string }): string => {
	const count = keyMap.get(value) ?? 0;

	keyMap.set(value, count + 1);

	return `${value}-${count}`;
};
