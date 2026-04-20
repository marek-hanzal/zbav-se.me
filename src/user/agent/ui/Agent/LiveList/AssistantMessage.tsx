import type { RunStreamEvent } from "@openai/agents";
import { type FC, useMemo } from "react";
import { match } from "ts-pattern";
import { Group } from "@/lib/client/group";
import { Markdown } from "@/lib/client/markdown";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";

export namespace AssistantMessage {
	export interface Props extends Group.Props {
		/**
		 * Recommended to use stable reference
		 */
		events: RunStreamEvent[] | undefined;
		itemId: string;
	}
}

export const AssistantMessage: FC<AssistantMessage.Props> = ({ events, itemId, ...props }) => {
	const content = useResponseContent(events, itemId);

	if (!content.length) {
		return null;
	}

	return (
		<Group
			data-ui={"AssistantMessage"}
			data-id={itemId}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background={undefined}
			data-ui-shadow={undefined}
			data-ui-inner={undefined}
			{...props}
		>
			<Markdown>{content}</Markdown>
		</Group>
	);
};

// =================================================================================================

function useResponseContent(events: RunStreamEvent[] | undefined = [], itemId: string) {
	return useMemo(() => {
		const mine = events.filter((event) => {
			const responseEvent = getResponseStreamEvent(event);

			if (!responseEvent) {
				return false;
			}

			return match(responseEvent)
				.with(
					{
						item_id: itemId,
					},
					() => true,
				)
				.with(
					{
						item: {
							id: itemId,
						},
					},
					() => true,
				)
				.otherwise(() => {
					return false;
				});
		});

		let content = "";

		for (const event of mine) {
			const responseEvent = getResponseStreamEvent(event);

			if (!responseEvent) {
				continue;
			}

			if (responseEvent.type === "response.output_text.delta") {
				content += responseEvent.delta;
			} else if (responseEvent.type === "response.output_text.done") {
				content = responseEvent.text;
			}
		}

		return content.trim();
	}, [
		events,
		itemId,
	]);
}
