import type { AgentInputItem } from "@openai/agents-core";
import { type FC, type RefObject, useRef } from "react";
import { useAutoScroll } from "@/lib/client/auto-scroll";
import { Container } from "@/lib/client/container";
import { AgentHistoryItem } from "./AgentHistoryItem";
import { AgentLiveRun } from "./AgentLiveRun";

export namespace AgentMessageList {
	export interface Props extends Container.Props {
		containerRef: RefObject<HTMLDivElement | null>;
		items: AgentInputItem[];
		liveRunIds: string[];
	}
}

export const AgentMessageList: FC<AgentMessageList.Props> = ({
	containerRef,
	items,
	liveRunIds,
	ui,
	...props
}) => {
	const contentRef = useRef<HTMLDivElement | null>(null);
	useAutoScroll({
		containerRef,
		contentRef,
		debounceMs: 32,
		resizeBehavior: "instant",
	});

	return (
		<Container
			data-ui={"AgentMessageList"}
			ref={contentRef}
			ui={{
				flow: "vertical",
				inner: "default",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			{items.map((item, index) => {
				return (
					<AgentHistoryItem
						key={`history-${item.id ?? index}`}
						item={item}
					/>
				);
			})}

			{liveRunIds.map((runId) => {
				return (
					<AgentLiveRun
						key={`live-${runId}`}
						runId={runId}
					/>
				);
			})}
		</Container>
	);
};
