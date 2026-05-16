import type { AgentInputItem, FunctionCallItem, FunctionCallResultItem } from "@openai/agents-core";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { getToolOutputText } from "~/user/agent/type/getToolOutputText";

export namespace ToolCall {
	export interface Props extends Group.Props {
		item: FunctionCallItem;
		items: AgentInputItem[];
		inline: boolean;
	}
}

export const ToolCall: FC<ToolCall.Props> = ({ item, items, inline, ...props }) => {
	const translator = useTranslator();
	if (inline) {
		return (
			<Group
				data-ui={"ToolCall"}
				data-id={item.id}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-background="default"
				data-ui-inner="default"
				data-ui-opacity={"6"}
				{...props}
			>
				<Container
					data-ui-flow={"horizontal"}
					data-ui-gap={"default"}
					data-ui-items={"center"}
				>
					<Tx
						label={`Agent tool - ${item.name}`}
						data-ui-text="sm"
						data-ui-font="bold"
						className={[
							"wrap-break-word",
						]}
					/>
				</Container>
			</Group>
		);
	}

	const result = items.find((i): i is FunctionCallResultItem => {
		return i.type === "function_call_result" && i.callId === item.callId;
	});
	const output = getToolOutputText(result);

	return (
		<Group
			data-ui={"ToolCall"}
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
					label={item.name}
					data-ui-text="sm"
					data-ui-font="bold"
					className={[
						"wrap-break-word",
					]}
				/>

				<Typo
					label={translator.text("Tool call input (label)")}
					data-ui-text="xs"
					data-ui-opacity="6"
					data-ui-font="semibold"
				/>

				<Typo
					label={item.arguments}
					data-ui-text="xs"
					data-ui-opacity="8"
					className={[
						"wrap-break-word",
						"whitespace-pre-wrap",
					]}
				/>

				{output !== undefined ? (
					<>
						<Typo
							label={translator.text("Tool call output (label)")}
							data-ui-text="xs"
							data-ui-opacity="6"
							data-ui-font="semibold"
						/>
						<Typo
							label={output}
							data-ui-text="xs"
							data-ui-opacity="8"
							className={[
								"wrap-break-word",
								"whitespace-pre-wrap",
							]}
						/>
					</>
				) : null}
			</Container>
		</Group>
	);
};
