import { type FC, type RefObject, useRef } from "react";
import { useAutoScroll } from "~/navigation/hook/useAutoScroll";
import { Container } from "~/ui/ui/Container";
import { EmptyWelcome } from "~/user-agent/ui/Agent/EmptyWelcome";
import { HistoryList } from "~/user-agent/ui/Agent/HistoryList/index";
import { LiveList } from "~/user-agent/ui/Agent/LiveList/index";

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
