import type { RunStreamEvent } from "@openai/agents-core";
import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";

export namespace Reasoning {
	export interface Props extends Group.Props {
		events: RunStreamEvent[] | undefined;
		itemId: string;
		inline: boolean;
	}
}

export const Reasoning: FC<Reasoning.Props> = ({ events, itemId, inline, className, ...props }) => {
	const content = useReasoningContent(events, itemId);

	if (inline) {
		return (
			<Group
				data-ui={"Reasoning"}
				data-id={itemId}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-background="default"
				data-ui-inner="default"
				data-ui-color={"lead"}
				{...props}
			>
				<Container
					data-ui-flow={"horizontal"}
					data-ui-gap={"default"}
					data-ui-items={"center"}
				>
					<Tx
						label={translator.text("Agent reasoning")}
						data-ui-text="sm"
						data-ui-font="bold"
						className={[
							"wrap-break-word",
						]}
					/>

					<SpinnerContainer
						data-ui-tone={"neutral"}
						type={"icon"}
						data-ui-text={"default"}
					/>
				</Container>
			</Group>
		);
	}

	return (
		<Group
			data-ui={"Reasoning"}
			data-id={itemId}
			data-output-id={itemId}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background="default"
			data-ui-inner="default"
			className={className}
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

				{content.length > 0 ? (
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

function useReasoningContent(events: RunStreamEvent[] | undefined = [], itemId: string) {
	return useMemo(() => {
		let content = "";

		for (const event of events) {
			const responseEvent = getResponseStreamEvent(event);

			if (
				!responseEvent ||
				!("item_id" in responseEvent) ||
				responseEvent.item_id !== itemId
			) {
				continue;
			}

			if (responseEvent.type === "response.reasoning_text.delta") {
				content += responseEvent.delta;
				continue;
			}

			if (responseEvent.type === "response.reasoning_text.done") {
				content = responseEvent.text;
			}
		}

		return content.trim();
	}, [
		events,
		itemId,
	]);
}
