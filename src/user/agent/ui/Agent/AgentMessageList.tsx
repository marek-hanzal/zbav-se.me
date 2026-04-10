import { type FC, type RefObject, useRef } from "react";
import { useAutoScroll } from "@/lib/client/auto-scroll";
import { Container } from "@/lib/client/container";
import { HistoryList } from "./HistoryList";
import { LiveList } from "./LiveList";

export namespace AgentMessageList {
	export interface Props extends Container.Props {
		containerRef: RefObject<HTMLDivElement | null>;
	}
}

export const AgentMessageList: FC<AgentMessageList.Props> = ({ containerRef, ui, ...props }) => {
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
			<HistoryList />

			<LiveList />
		</Container>
	);
};
