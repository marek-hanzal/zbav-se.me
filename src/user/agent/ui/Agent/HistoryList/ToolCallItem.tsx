import type { AgentInputItem, FunctionCallItem, FunctionCallResultItem } from "@openai/agents-core";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";

function extractOutputText(result: FunctionCallResultItem): string | undefined {
	const { output } = result;
	if (typeof output === "string") {
		return output;
	}
	if (Array.isArray(output)) {
		return undefined;
	}
	if (output.type === "text") {
		return output.text;
	}
	return undefined;
}

export namespace ToolCallItem {
	export interface Props extends Group.Props {
		callId: string;
		items: AgentInputItem[];
	}
}

export const ToolCallItem: FC<ToolCallItem.Props> = ({
	callId,
	items,
	ui,
	className,
	...props
}) => {
	const call = items.find(
		(i): i is FunctionCallItem => i.type === "function_call" && i.callId === callId,
	);
	const result = items.find(
		(i): i is FunctionCallResultItem =>
			i.type === "function_call_result" && i.callId === callId,
	);

	if (!call) {
		return null;
	}

	const outputText = result ? extractOutputText(result) : undefined;

	return (
		<Group
			data-ui={"HistoryList-ToolCallItem"}
			ui={{
				tone: "secondary",
				theme: "light",
				background: "alt",
				inner: "default",
				...ui,
			}}
			className={[
				"w-4/5",
				className,
			]}
			{...props}
		>
			<Container
				ui={{
					flow: "vertical",
					gap: "xs",
				}}
			>
				<Typo
					label={call.name}
					ui={{
						text: "sm",
						font: "semibold",
					}}
				/>

				<Typo
					label={translator.text("Tool call input (label)")}
					ui={{
						text: "xs",
						opacity: "6",
					}}
				/>

				<Typo
					label={call.arguments}
					ui={{
						text: "xs",
						opacity: "8",
					}}
				/>

				{outputText !== undefined ? (
					<>
						<Typo
							label={translator.text("Tool call output (label)")}
							ui={{
								text: "xs",
								opacity: "6",
							}}
						/>
						<Typo
							label={outputText}
							ui={{
								text: "xs",
								opacity: "8",
							}}
						/>
					</>
				) : null}
			</Container>
		</Group>
	);
};
