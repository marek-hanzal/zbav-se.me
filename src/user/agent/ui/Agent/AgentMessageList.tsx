import { type FC, type RefObject, useRef } from "react";
import { useAutoScroll } from "@/lib/client/auto-scroll";
import { Container } from "@/lib/client/container";
import { EmptyWelcome } from "./EmptyWelcome";
import { HistoryList } from "./HistoryList";
import { LiveList } from "./LiveList";

export namespace AgentMessageList {
	export interface Props extends Container.Props {
		containerRef: RefObject<HTMLDivElement | null>;
		isPending: boolean;
		threadId: string;
	}
}

export const AgentMessageList: FC<AgentMessageList.Props> = ({
	containerRef,
	isPending,
	threadId,
	...props
}) => {
	const contentRef = useRef<HTMLDivElement | null>(null);
	useAutoScroll({
		containerRef,
		contentRef,
		debounceMs: 32,
		resizeBehavior: "instant",
	});

	const inline = false;

	return (
		<Container
			data-ui={"AgentMessageList"}
			ref={contentRef}
			data-ui-flow="vertical"
			data-ui-inner="default"
			data-ui-gap="lg"
			{...props}
		>
			<EmptyWelcome
				threadId={threadId}
				isPending={isPending}
			/>

			<HistoryList
				threadId={threadId}
				inline={inline}
			/>

			<LiveList
				threadId={threadId}
				inline={inline}
			/>
		</Container>
	);
};
