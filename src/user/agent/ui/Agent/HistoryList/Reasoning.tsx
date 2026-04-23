import type { AgentInputItem } from "@openai/agents-core";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";

type AgentReasoning = Extract<
	AgentInputItem,
	{
		type: "reasoning";
	}
>;

export namespace Reasoning {
	export interface Props extends Group.Props {
		item: AgentReasoning;
		inline: boolean;
	}
}

export const Reasoning: FC<Reasoning.Props> = ({ item, inline, ...props }) => {
	if (inline) {
		return (
			<Group
				data-ui={"Reasoning"}
				data-id={item.id}
				data-ui-shadow={undefined}
				data-ui-opacity="6"
				{...props}
			>
				<Tx
					label={translator.text("Agent reasoning")}
					data-ui-text="sm"
					data-ui-font="bold"
					className={[
						"wrap-break-word",
					]}
				/>
			</Group>
		);
	}

	const content = getReasoningText(item);

	return (
		<Group
			data-ui={"Reasoning"}
			data-id={item.id}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background="alt"
			data-ui-inner="default"
			data-ui-opacity="6"
			{...props}
		>
			<Container
				data-ui-flow="vertical"
				data-ui-gap="xs"
				className={[
					"min-w-0",
				]}
			>
				<Typo
					label={translator.text("Agent reasoning")}
					data-ui-text="sm"
					data-ui-font="bold"
					className={[
						"wrap-break-word",
					]}
				/>

				{content !== undefined ? (
					<Typo
						label={content}
						data-ui-text="xs"
						data-ui-opacity="8"
						className={[
							"wrap-break-word",
							"whitespace-pre-wrap",
						]}
					/>
				) : null}
			</Container>
		</Group>
	);
};

function getReasoningText(item: AgentReasoning) {
	const rawText = item.rawContent
		?.map((content) => content.text)
		.join("\n")
		.trim();

	if (rawText) {
		return rawText;
	}

	const contentText = item.content
		.map((content) => content.text)
		.join("\n")
		.trim();

	return contentText || undefined;
}
