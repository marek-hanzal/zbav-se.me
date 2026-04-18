import type { RunStreamEvent } from "@openai/agents";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { selectToolCallState } from "./selectToolCallState";

export namespace ToolCallBlock {
	export interface Props extends Group.Props {
		events: RunStreamEvent[] | undefined;
		itemId: string;
		inline: boolean;
	}
}

export const ToolCallBlock: FC<ToolCallBlock.Props> = ({
	events,
	itemId,
	inline,
	className,
	...props
}) => {
	if (inline) {
		// return null;
	}

	const state = selectToolCallState(events, itemId);

	return (
		<Group
			data-ui={"ToolCallBlock"}
			data-id={itemId}
			data-output-id={itemId}
			ui={{
				tone: "neutral",
				theme: "light",
				background: "default",
				inner: "default",
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
					label={state.name}
					ui={{
						text: "sm",
						font: "bold",
					}}
					className={[
						"wrap-break-word",
					]}
				/>

				{state.input !== null ? (
					<>
						<Typo
							label={translator.text("Tool call input (label)")}
							ui={{
								text: "xs",
								opacity: "6",
								font: "semibold",
							}}
						/>
						<Typo
							label={state.input}
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

				{state.isPending ? (
					<SpinnerContainer
						data-ui={"ToolCallBlock-[Spinner]"}
						type="icon"
						size="md"
						ui={{
							tone: "neutral",
							theme: "light",
							layout: "horizontal-flex",
							height: undefined,
							width: undefined,
							color: "lead",
						}}
					/>
				) : null}

				{state.output !== undefined ? (
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
							label={state.output}
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
