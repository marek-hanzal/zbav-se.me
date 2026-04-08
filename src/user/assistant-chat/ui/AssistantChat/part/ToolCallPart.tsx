import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Tx } from "@/lib/client/tx";
import type { AssistantChatToolCallPartSchema } from "~/user/assistant/schema/part/AssistantChatToolCallPartSchema";

export namespace ToolCallPart {
	export interface Props extends Omit<Container.Props, "part"> {
		part: AssistantChatToolCallPartSchema.Type;
	}
}

export const ToolCallPart: FC<ToolCallPart.Props> = ({ part, ui, ...props }) => {
	return (
		<Container
			data-ui={"AssistantChat-ToolCall"}
			ui={{
				border: true,
				round: "default",
				inner: "default",
				gap: "xs",
				flow: "vertical",
				background: "alt",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					flow: "horizontal",
					justify: "space-between",
					items: "center",
					gap: "default",
				}}
			>
				<div className={"font-semibold"}>
					<Tx label={part.toolName} />
				</div>

				<Tx
					label={part.status}
					ui={{
						text: "xs",
						opacity: "6",
					}}
				/>
			</Container>

			<Container
				ui={{
					flow: "vertical",
					gap: "xs",
				}}
			>
				<div className={"text-xs font-semibold opacity-60"}>
					<Tx label={"Input"} />
				</div>

				<pre className={"whitespace-pre-wrap break-words text-sm"}>
					{part.input.length > 0 ? part.input : "Pending tool input..."}
				</pre>
			</Container>

			<Container
				ui={{
					flow: "vertical",
					gap: "xs",
				}}
			>
				<div className={"text-xs font-semibold opacity-60"}>
					<Tx label={"Output"} />
				</div>

				<pre className={"whitespace-pre-wrap break-words text-sm"}>
					{part.output.length > 0 ? part.output : "Waiting for tool output..."}
				</pre>
			</Container>
		</Container>
	);
};
