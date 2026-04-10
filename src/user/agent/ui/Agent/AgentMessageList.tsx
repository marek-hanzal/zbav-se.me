import type { AgentInputItem } from "@openai/agents-core";
import { type FC, type RefObject, useRef } from "react";
import { useAutoScroll } from "@/lib/client/auto-scroll";
import { Container } from "@/lib/client/container";

export namespace AgentMessageList {
	export interface Props extends Container.Props {
		containerRef: RefObject<HTMLDivElement | null>;
		items: AgentInputItem[];
	}
}

export const AgentMessageList: FC<AgentMessageList.Props> = ({
	containerRef,
	items,
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
			{/*

                Here should be history-list implementation from "items"

                ./HistoryList/HistoryList.tsx

			 */}

			{/*

                Here should be live-stream implementation from agent stream

                ./LiveList/LiveList.tsx

			 */}
		</Container>
	);
};
