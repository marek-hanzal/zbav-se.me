import type { AgentInputItem, FunctionCallItem, FunctionCallResultItem } from "@openai/agents-core";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { getToolOutputText } from "~/user/agent/type/getToolOutputText";

export namespace ToolCallItem {
	export interface Props extends Group.Props {
		item: FunctionCallItem;
		items: AgentInputItem[];
		inline: boolean;
	}
}

export const ToolCallItem: FC<ToolCallItem.Props> = ({
	item,
	items,
	inline,
	className,
	...props
}) => {
	if (inline) {
		// return null;
	}

	const result = items.find(
		(i): i is FunctionCallResultItem =>
			i.type === "function_call_result" && i.callId === item.callId,
	);
	const output = getToolOutputText(result);

	return (
		<Group
			data-ui={"ToolCallItem"}
			data-id={item.id}
			ui={{
				tone: "neutral",
				theme: "light",
				background: "alt",
				inner: "default",
				opacity: "6",
				...ui,
			}}
			className={className}
			{...props}
		>
			<Container
				ui={{
					flow: "vertical",
					gap: "xs",
				}}
				className={[
					"min-w-0",
				]}
			>
				<Typo
					label={item.name}
					ui={{
						text: "sm",
						font: "bold",
					}}
					className={[
						"wrap-break-word",
					]}
				/>

				<Typo
					label={translator.text("Tool call input (label)")}
					ui={{
						text: "xs",
						opacity: "6",
						font: "semibold",
					}}
				/>

				<Typo
					label={item.arguments}
					ui={{
						text: "xs",
						opacity: "8",
					}}
					className={[
						"wrap-break-word",
						"whitespace-pre-wrap",
					]}
				/>

				{output !== undefined ? (
					<>
						<Typo
							label={translator.text("Tool call output (label)")}
							ui={{
								text: "xs",
								opacity: "6",
								font: "semibold",
							}}
						/>
						<Typo
							label={output}
							ui={{
								text: "xs",
								opacity: "8",
							}}
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
